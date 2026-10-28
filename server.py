"""PhishGuard 6.1: local educational backend. Never expose API keys in browser."""
import ipaddress
import os
import re
import time
import threading
from urllib.parse import urlsplit

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory, Response
from collections import defaultdict, deque

load_dotenv()
BASE = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=None)
app.config['MAX_CONTENT_LENGTH'] = 4096
app.json.ensure_ascii = False
API = 'https://urlscan.io'
SCAN_LOCK = threading.Lock()
RECENT_SCANS = {}  # URL -> (scan_id, monotonic timestamp); local development only
# Simple per-process rate limiting for public deployment. Single Gunicorn worker is required.
RATE_LOCK = threading.Lock()
RATE_BUCKETS = defaultdict(deque)

def rate_limit(action, max_requests, seconds):
    # Do not trust arbitrary X-Forwarded-For values from clients.
    # On Render, connecting address may be a proxy: this still caps total load.
    ip = request.remote_addr or 'unknown'
    key = (action, ip)
    now = time.monotonic()
    with RATE_LOCK:
        q = RATE_BUCKETS[key]
        while q and q[0] < now - seconds:
            q.popleft()
        if len(q) >= max_requests:
            return jsonify(error='Слишком много запросов. Попробуйте позже.'), 429
        q.append(now)
        if len(RATE_BUCKETS) > 10000:
            for k in list(RATE_BUCKETS):
                if not RATE_BUCKETS[k] or RATE_BUCKETS[k][-1] < now - 3600:
                    del RATE_BUCKETS[k]
    return None

UUID_RE = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.I)

@app.get('/')
def home():
    return send_from_directory(BASE, 'index.html')

@app.get('/<path:name>')
def public_assets(name):
    if name not in {'style.css', 'script.js', 'psl-rules.js', 'favicon.svg'}:
        return jsonify(error='Not found'), 404
    return send_from_directory(BASE, name)

@app.get('/api/status')
def status():
    return jsonify(server='online', urlscan_configured=bool(os.getenv('URLSCAN_API_KEY', '').strip()))

@app.get('/api/urlscan-test')
def test():
    limited = rate_limit('test', 3, 3600)
    if limited: return limited
    key = os.getenv('URLSCAN_API_KEY', '').strip()
    if not key:
        return jsonify(success=False, message='API-ключ не найден'), 500
    try:
        r = requests.get(API + '/user/quotas/', headers={'API-Key': key}, timeout=15)
        return jsonify(success=r.ok, message='Соединение с urlscan.io работает!' if r.ok else 'API не подтвердил доступ', status_code=r.status_code)
    except requests.RequestException:
        return jsonify(success=False, message='Ошибка соединения'), 502


def validate_public_url(value):
    if not isinstance(value, str) or not (1 <= len(value) <= 2048):
        raise ValueError('Введите адрес длиной до 2048 символов.')
    if re.search(r'[\s\x00-\x1f\x7f\\]', value):
        raise ValueError('Адрес содержит недопустимые символы.')
    try:
        p = urlsplit(value)
        host = (p.hostname or '').rstrip('.').lower()
        port = p.port
    except ValueError:
        raise ValueError('Некорректный URL.')
    if p.scheme not in ('http', 'https') or not host or p.username or p.password:
        raise ValueError('Нужен полный HTTP(S)-адрес без логина и пароля.')
    if p.query or p.fragment:
        raise ValueError('Для приватности уберите параметры после ? и # перед онлайн-проверкой.')
    if port is not None and port not in (80, 443):
        raise ValueError('Для онлайн-проверки разрешены только стандартные порты.')
    if host == 'localhost' or host.endswith(('.localhost', '.local', '.internal', '.test', '.invalid', '.example')):
        raise ValueError('Локальные и тестовые домены не отправляются на сканирование.')
    if '.' not in host or not re.fullmatch(r'[a-z0-9.-]+', host) or '..' in host:
        raise ValueError('Требуется корректное публичное доменное имя.')
    try:
        ipaddress.ip_address(host.strip('[]'))
        raise ValueError('IP-адреса не отправляются на сканирование.')
    except ValueError as e:
        if str(e) == 'IP-адреса не отправляются на сканирование.':
            raise
    return value

@app.post('/api/deep-scan')
def deep_scan():
    limited = rate_limit('scan', 3, 3600)
    if limited: return limited
    data = request.get_json(silent=True) or {}
    if data.get('consent') is not True:
        return jsonify(error='Подтвердите отправку адреса в сторонний сервис.'), 400
    try:
        target = validate_public_url(data.get('url'))
    except ValueError as e:
        return jsonify(error=str(e)), 400
    key = os.getenv('URLSCAN_API_KEY', '').strip()
    if not key:
        return jsonify(error='API-ключ не настроен.'), 503
    # Повторное нажатие для того же URL не создаёт новое сканирование в течение 10 минут.
    with SCAN_LOCK:
        existing = RECENT_SCANS.get(target)
        if existing and time.monotonic() - existing[1] < 600:
            return jsonify(success=True, scan_id=existing[0], reused=True)
        try:
            r = requests.post(API + '/api/v1/scan/', headers={'API-Key': key},
                              json={'url': target, 'visibility': 'unlisted'}, timeout=25)
            if r.status_code != 200:
                return jsonify(error='Сервис не принял сканирование.', status_code=r.status_code), 502
            info = r.json()
            uid = info.get('uuid', '')
            if not UUID_RE.fullmatch(uid):
                return jsonify(error='Сервис вернул неожиданный идентификатор.'), 502
            RECENT_SCANS[target] = (uid, time.monotonic())
            return jsonify(success=True, scan_id=uid, reused=False)
        except (requests.RequestException, ValueError):
            return jsonify(error='Не удалось отправить запрос в urlscan.io.'), 502

@app.get('/api/deep-result/<scan_id>')
def deep_result(scan_id):
    limited = rate_limit('result', 120, 3600)
    if limited: return limited
    if not UUID_RE.fullmatch(scan_id):
        return jsonify(error='Неверный идентификатор.'), 400
    try:
        r = requests.get(f'{API}/api/v1/result/{scan_id}/', headers={'API-Key': os.getenv('URLSCAN_API_KEY', '').strip()}, timeout=20)
        if r.status_code in (404, 202):
            return jsonify(ready=False)
        if r.status_code in (403, 429, 500, 502, 503, 504):
            return jsonify(ready=False, retry=True, status_code=r.status_code), 200
        if not r.ok:
            return jsonify(error='Не удалось получить результат сканирования.', status_code=r.status_code), 502
        data = r.json()
        page = data.get('page') or {}
        stats = data.get('stats') or {}
        verdicts = data.get('verdicts') or {}
        overall = verdicts.get('overall') or {}
        req_count = stats.get('requests')
        if req_count is None:
            req_count = len(data.get('data', {}).get('requests', [])) if isinstance(data.get('data', {}).get('requests'), list) else None
        domain_count = stats.get('uniqDomains')
        if domain_count is None:
            domain_count = stats.get('uniqIPs')
        redirects = None
        raw_requests = (data.get('data') or {}).get('requests')
        if isinstance(raw_requests, list):
            redirects = sum(1 for item in raw_requests if isinstance(item, dict) and str((item.get('response') or {}).get('response', {}).get('status', '')).startswith(('301', '302', '303', '307', '308')))
        return jsonify(ready=True, title=page.get('title'), redirects=redirects, page_url=page.get('url'), domain=page.get('domain'), ip=page.get('ip'),
                       requests=req_count, domains=domain_count,
                       malicious=overall.get('malicious'), score=overall.get('score'),
                       screenshot=f'/api/deep-screenshot/{scan_id}',
                       report=f'https://urlscan.io/result/{scan_id}/')
    except (requests.RequestException, ValueError):
        return jsonify(error='Ошибка получения результата.'), 502

@app.get('/api/deep-screenshot/<scan_id>')
def deep_screenshot(scan_id):
    limited = rate_limit('screenshot', 30, 3600)
    if limited: return limited
    if not UUID_RE.fullmatch(scan_id):
        return jsonify(error='Неверный идентификатор.'), 400
    try:
        r = requests.get(f'{API}/screenshots/{scan_id}.png', headers={'API-Key': os.getenv('URLSCAN_API_KEY', '').strip()}, timeout=25)
        if not r.ok or not r.headers.get('Content-Type', '').startswith('image/') or len(r.content) > 8_000_000:
            return jsonify(error='Скриншот недоступен.'), 404
        return Response(r.content, mimetype='image/png', headers={'Cache-Control': 'private, max-age=300', 'X-Content-Type-Options': 'nosniff'})
    except requests.RequestException:
        return jsonify(error='Скриншот недоступен.'), 502

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)
