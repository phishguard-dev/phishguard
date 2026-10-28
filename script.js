// PhishGuard: все адреса и сообщения ниже — учебные примеры.
// Макеты не содержат настоящих форм ввода и активных ссылок.
const scenarios = [
 {category:'SMS · ДОСТАВКА',title:'Всего 1,99 ₽ за посылку',kind:'sms',scam:true,
  explanation:'Сообщение требует небольшой платёж по посторонней ссылке. Даже сумма в 1,99 ₽ может быть поводом заманить на страницу ввода платёжных данных. Проверяй статус доставки самостоятельно в официальном приложении.',
  clue:'Сигналы: неожиданная доплата, чужой домен и угроза возврата посылки. Само SMS не доказывает обман.',
  data:{sender:'Уведомление о доставке',message:'Посылка № 48329 задержана на сортировке. Для продолжения доставки внесите 1,99 ₽ за хранение до 20:00.',url:'https://post-delivery-pay.example/track'}},
 {category:'TELEGRAM · АККАУНТ',title:'Друг пишет с нового аккаунта',kind:'telegram',scam:true,
  explanation:'Собеседник утверждает, что это знакомый, но пишет с нового аккаунта и просит войти в Telegram ради голосования. Такой вход на посторонней странице может привести к захвату аккаунта. Сначала свяжись с другом через прежний контакт.',
  clue:'Подозрительна комбинация: новый аккаунт + просьба авторизоваться + ссылка на конкурс.',
  data:{sender:'Макс (новый аккаунт)',handle:'был(а) недавно',message:'Привет! Это Макс, старый акк заблокировали 😭 Я в финале конкурса, можешь проголосовать? Там через Telegram войти надо, займёт 10 сек.',url:'https://vote-friends.example/contest'}},
 {category:'БАНК · УВЕДОМЛЕНИЕ',title:'Списание в приложении банка',kind:'bankpush',scam:false,
  explanation:'По условию ты самостоятельно открыл настоящее приложение своего банка и увидел уведомление в нём. Оно не предлагает переходить на чужой сайт и не просит назвать код. Само сообщение о списании не является признаком мошенничества. Если операция незнакома, проверь её через поддержку в приложении.',
  clue:'Важны источник и контекст: приложение открыто тобой, а способ связи — официальный канал.',
  data:{bank:'Банк · уведомления',amount:'−5 000 ₽',message:'Если вы не совершали операцию, свяжитесь с банком по номеру на обратной стороне карты.',time:'Сегодня · 15:42'}},
 {category:'DISCORD · ИГРЫ',title:'«Поддержка Steam» пишет в Discord',kind:'discord',scam:true,
  explanation:'Незнакомец в Discord представляется сотрудником Steam и просит подтвердить обмен предметами. Это не способ проверки безопасности аккаунта: подтверждение обмена может привести к потере вещей. Не выполняй инструкции из такого сообщения.',
  clue:'Самозваная поддержка в стороннем мессенджере, срочность и просьба подтвердить трейд.',
  data:{sender:'Steam Support | Verification',tag:'steam-security-help',message:'Hello! На твой аккаунт поступила жалоба. Чтобы избежать блокировки, подтверди проверочный обмен в Steam Guard в течение 15 минут. Это безопасная проверка.'}},
 {category:'ТЕЛЕФОН · ДОСТАВКА',title:'Курьер просит SMS-код',kind:'call',scam:true,
  explanation:'Даже если ты действительно ждёшь заказ, звонящий не должен просить код входа или подтверждения операции. Код может относиться к совсем другому сервису. Заверши разговор и проверь доставку в приложении.',
  clue:'Совпадение с ожидаемой доставкой создаёт доверие, но просьба продиктовать секретный код — опасный сигнал.',
  data:{name:'Курьер · неизвестный номер',line:'«Добрый день, я уже у подъезда. Вам сейчас придёт SMS, назовите четыре цифры, чтобы я смог подтвердить вручение заказа. Без этого система не отдаёт посылку».'}},
 {category:'АВИТО · СДЕЛКА',title:'Скидка за оплату вне площадки',kind:'marketplace',scam:true,
  explanation:'Продавец предлагает уйти с площадки на собственный сайт ради скидки. Там покупатель может потерять деньги или раскрыть данные карты. Оформляй доставку и оплату через официальные механизмы сервиса.',
  clue:'Ключевой признак — перевод оплаты на внешний сайт. Скидка служит приманкой.',
  data:{item:'Игровая видеокарта',price:'18 900 ₽',seller:'Продавец · Алексей',message:'Могу сделать на 10% дешевле! Оформи доставку через мой сайт, там просто введи данные карты. На Авито комиссия большая.',url:'https://delivery-discount.example/pay'}},
 {category:'МЕССЕНДЖЕР · ДРУЗЬЯ',title:'«АХАХ, это ты на видео?»',kind:'chat',scam:true,
  explanation:'Сообщение использует любопытство, а ссылка ведёт на стороннюю страницу с требованием войти в аккаунт. Даже сообщение из старого чата не гарантирует безопасность: аккаунт друга мог быть взломан. Уточни у друга другим способом.',
  clue:'Неожиданная ссылка + вход ради просмотра видео. Знакомый отправитель сам по себе не гарантия.',
  data:{sender:'Даня',status:'был в сети недавно',message:'АХАХАХ, это ты на видео? 😭😭',url:'https://video-check.example/watch/42',followup:'У меня просит войти, чтобы посмотреть 👀'}},
 {category:'SMS · ДОСТАВКА',title:'Обычное уведомление о курьере',kind:'deliverysafe',scam:false,
  explanation:'Ты ожидаешь посылку. Сообщение только сообщает время доставки и предлагает самостоятельно проверить трек-номер на официальном сайте. Нет ссылок, просьб сообщить код или оплатить что-либо. По условиям явных признаков мошенничества нет.',
  clue:'SMS от неизвестного номера само по себе не доказывает обман. Важны содержание и проверяемость информации.',
  data:{sender:'Уведомление о заказе',message:'Курьер доставит заказ сегодня с 14:00 до 16:00. Трек-номер 123456 можно проверить на официальном сайте службы доставки.'}},
 {category:'ПОЧТА · РАБОТА',title:'Приглашение на собеседование',kind:'hrmail',scam:false,
  explanation:'По условию адрес отправителя совпадает с подтверждённым доменом компании, собеседование ожидаемо, ссылка ведёт на обычную встречу в Zoom, а оплаты и секретных данных не требуют. Явных признаков мошенничества нет. В жизни проверяй настоящий адрес отправителя и ссылку.',
  clue:'Наличие ссылки в письме не делает его автоматически фишинговым. Важны проверенный отправитель и содержание.',
  data:{company:'Northstar Studio',email:'hr@northstar.example',subject:'Собеседование · 29 октября, 15:00',message:'Здравствуйте! Подтверждаем ваше собеседование завтра в 15:00. Подготовьте резюме. Ничего оплачивать не нужно.',url:'https://zoom.us/j/123456789',time:'29 окт · 15:00'}},
 {category:'БРАУЗЕР · ПОДДЕЛЬНОЕ ПРЕДУПРЕЖДЕНИЕ',title:'«Обнаружены 17 вирусов!»',kind:'security',scam:true,
  explanation:'Это содержимое случайной веб-страницы, а не результат проверки антивирусом. Сайт запугивает и предлагает установить неизвестную программу и дать ей доступ к компьютеру. Закрой вкладку и при необходимости проверь устройство установленным защитным ПО.',
  clue:'Обычная страница не может достоверно определить «17 вирусов» на устройстве таким баннером.',
  data:{url:'https://device-check-alert.example/scan',title:'КРИТИЧЕСКАЯ УГРОЗА',message:'На вашем устройстве обнаружено 17 вирусов! Для спасения файлов немедленно скачайте «Очиститель» и предоставьте доступ к компьютеру.',button:'Скачать очиститель'}}
];

const $=id=>document.getElementById(id);
let index=0,points=0,locked=false;
let quizOrder=[...scenarios], quizAnswers=[], reviewMode=false, originalScore=null;
const questionGroup=q=>({browser:"web",cloud:"web",security:"web",bankpush:"messages",deliverysafe:"messages",telegram:"messages",discord:"social",marketplace:"social",hrmail:"messages",sms:"messages",mail:"messages",chat:"messages",notice:"messages",calendar:"messages",call:"calls",social:"social",market:"social"}[q.kind]||"messages");
const shuffled=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
function selectQuestions(){return shuffled(scenarios)}
const escapeHTML=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const e=escapeHTML;

function renderScene(q){const d=q.data;
 switch(q.kind){
 case 'deliverysafe':
 case 'sms': return `<div class="mock mock-chat"><div class="mock-header"><div class="avatar">📦</div><div><div class="who">${e(d.sender)}</div><div class="sub">SMS · Входящее сообщение</div></div></div><div class="mock-body"><div class="bubble">${e(d.message)}<br><span class="link-look">${d.url?e(d.url):''}</span><div class="timestamp">14:32</div></div></div><div class="chat-input">Сообщение…</div></div>`;
 case 'call': return `<div class="mock mock-call"><div class="call-avatar">👤</div><div class="call-name">${e(d.name)}</div><div class="call-time">Входящий вызов · 00:42</div><div class="transcript"><div class="eyebrow">ЗВОНЯЩИЙ ГОВОРИТ:</div><div style="margin-top:9px">${e(d.line)}</div></div><div class="call-controls"><span>♩</span><span class="hangup">☎</span><span>◖))</span></div></div>`;
 case 'mail': return `<div class="mock mock-mail"><div class="mock-header">✉ &nbsp; Входящие / Новое письмо</div><div class="mock-body"><div class="mail-subject">${e(d.subject)}</div><div class="mail-meta">От: ${e(d.from)}<br>${e(d.email)}</div><div class="mail-copy">Здравствуйте!<br><br>${e(d.message)}</div><div class="fake-cta">${e(d.cta||"Подробнее")} →</div></div></div>`;
 case 'browser': return `<div class="mock mock-browser"><div class="browser-bar"><span>← → ↻</span><div class="url">${e(d.url)}</div><span>⋮</span></div><div class="web-page"><div style="font-size:33px">${e(d.icon||'🌐')}</div><h3>${e(d.heading)}</h3><p>${e(d.subtitle||'')}</p>${(d.fields||[]).map(f=>`<div class="fake-field">${e(f)}</div>`).join('')}${d.button?`<div class="web-button">${e(d.button)}</div>`:''}</div></div>`;
 case 'cloud': return `<div class="mock mock-cloud"><div class="cloud-browser"><span>← &nbsp; ↻</span><div class="cloud-address">🔒 ${e(d.url)}</div><span>⋮</span></div><div class="cloud-toolbar"><div class="cloud-logo">▦</div><div><strong>Документы · Общий доступ</strong><small>Просмотр файла по приглашению</small></div><span class="cloud-menu">☰</span></div><div class="cloud-document"><div class="cloud-file-icon">▤</div><div class="cloud-label">ВАМ ОТКРЫЛИ ДОСТУП</div><h3>${e(d.name)}</h3><div class="cloud-owner">${e(d.owner)}</div><div class="cloud-preview"><span></span><span></span><span></span><span></span></div><p>${e(d.message)}</p><div class="cloud-login">Продолжить с почтой →</div><div class="cloud-disclaimer">Макет учебной ситуации · кнопки неактивны</div></div></div>`;
 case 'chat': return `<div class="mock mock-tg"><div class="tg-head"><div class="tg-back">‹</div><div class="tg-avatar">Д</div><div><strong>${e(d.sender)}</strong><small>${e(d.status)}</small></div><span class="tg-menu">⋮</span></div><div class="tg-wall"><div class="tg-day">Сегодня</div><div class="tg-bubble">${e(d.message)}<div class="tg-link">▶ ${e(d.url)}</div><div class="tg-preview">🎞️ &nbsp; Видео недоступно без входа</div><div class="tg-followup">${e(d.followup)}</div><div class="tg-time">18:04 ✓✓</div></div></div><div class="tg-compose">☻ &nbsp; Сообщение <span>➤</span></div></div>`;
 case 'notice': return `<div class="mock mock-notice"><div class="notice-card"><div class="notice-icon">✅</div><div class="notice-title">${e(d.title)}</div><div class="notice-copy">${e(d.message)}</div><div class="notice-foot">${e(d.footer)}</div></div></div>`;
 case 'social': return `<div class="mock mock-social"><div class="social-banner">🎁 ✨ 🎉</div><div class="social-profile"><div class="avatar">🎁</div><div><div class="who">${e(d.name)}</div><div class="sub">${e(d.handle)}</div></div></div><div class="social-copy">${e(d.message)}<br><br><span style="color:#6a6de4;font-weight:700">#розыгрыш #подарки</span></div></div>`;
 case 'market': return `<div class="mock mock-market"><div class="market-top">Магазин / Дом и интерьер / Освещение</div><div class="market-card"><div class="market-item"><div class="market-image">💡</div><div><div class="market-title">${e(d.title)}</div><div class="market-price">${e(d.price)}</div><div class="market-desc">${e(d.description)}</div></div></div></div></div>`;
 case 'calendar': return `<div class="mock mock-calendar"><div class="calendar-head">▦ &nbsp; КАЛЕНДАРЬ · МОИ СОБЫТИЯ</div><div class="calendar-body"><div class="calendar-date">${e(d.date)}</div><div class="calendar-title">📚 ${e(d.title)}</div><div class="calendar-text">${e(d.message)}</div><div class="notice-foot">Добавлено вами · Личный календарь</div></div></div>`;
 case 'telegram': return `<div class="mock mock-tg"><div class="tg-head"><div class="tg-back">‹</div><div class="tg-avatar">М</div><div><strong>${e(d.sender)}</strong><small>${e(d.handle)}</small></div><span class="tg-menu">⋮</span></div><div class="tg-wall"><div class="tg-day">Сегодня</div><div class="tg-bubble">${e(d.message)}<div class="tg-link">🔗 ${e(d.url)}</div><div class="tg-time">17:26 ✓✓</div></div></div><div class="tg-compose">☻ &nbsp; Сообщение <span>➤</span></div></div>`;
 case 'discord': return `<div class="mock mock-discord"><div class="dc-head"><span class="dc-icon">◉</span><div><strong>${e(d.sender)}</strong><small>Личные сообщения · Discord</small></div><span class="dc-dots">⋯</span></div><div class="dc-content"><div class="dc-profile">S</div><div><strong>${e(d.sender)}</strong><div class="dc-tag">${e(d.tag)} · не в друзьях</div><p>${e(d.message)}</p><div class="dc-time">Сегодня, 18:12</div></div></div><div class="dc-compose">Написать сообщение…</div></div>`;
 case 'bankpush': return `<div class="mock mock-bank"><div class="bank-header"><span class="bank-logo">▣</span><div><strong>${e(d.bank)}</strong><small>Официальное приложение · открыто вами</small></div><span>⋯</span></div><div class="bank-card"><div class="bank-eyebrow">ОПЕРАЦИЯ ПО КАРТЕ</div><div class="bank-amount">${e(d.amount)}</div><div class="bank-time">${e(d.time)}</div><div class="bank-rule"></div><div class="bank-info">${e(d.message)}</div><div class="bank-action">Открыть поддержку в приложении</div></div><div class="bank-nav">⌂ Главная <span>▤ История</span> ◉ Профиль</div></div>`;
 case 'marketplace': return `<div class="mock mock-deal"><div class="deal-top"><span class="deal-logo">а</span><strong>Объявления · Чат с продавцом</strong><span>⋯</span></div><div class="deal-item"><div class="deal-image">🎮</div><div><strong>${e(d.item)}</strong><div class="deal-price">${e(d.price)}</div><small>Доставка доступна через площадку</small></div></div><div class="deal-chat"><div class="deal-person">${e(d.seller)}</div><div class="deal-bubble">${e(d.message)}<div class="deal-link">${e(d.url)}</div><div class="deal-time">16:41</div></div></div><div class="deal-compose">Сообщение продавцу…</div></div>`;
 case 'hrmail': return `<div class="mock mock-hr"><div class="hr-bar"><span>✉</span><strong>Почта / Входящие</strong><span>⋮</span></div><div class="hr-main"><div class="hr-label">Входящее · Собеседование</div><h3>${e(d.subject)}</h3><div class="hr-sender"><div class="hr-avatar">N</div><div><strong>${e(d.company)} · HR</strong><small>${e(d.email)}</small></div></div><p>${e(d.message)}</p><div class="hr-invite"><div>📅 <strong>Видеовстреча</strong></div><small>${e(d.time)}</small><div class="hr-url">${e(d.url)}</div></div><div class="hr-footer">↩ Ответить &nbsp;&nbsp; ↪ Переслать</div></div></div>`;
 case 'security': return `<div class="mock mock-security"><div class="security-browser"><span>← &nbsp; → &nbsp; ↻</span><div class="security-address">🔒 ${e(d.url)}</div><span>⋮</span></div><div class="security-page"><div class="security-top">⚠ &nbsp; Системное предупреждение — заявлено сайтом</div><div class="security-body"><div class="security-icon">🚨</div><div class="security-title">${e(d.title)}</div><div class="security-text">${e(d.message)}</div><div class="security-button">${e(d.button)}</div><div class="security-small">Учебный макет · кнопка неактивна</div></div></div></div>`;
 default:return '';
 }
}
function show(which){['home','welcome','knowledge','quiz','finish','analyzer'].forEach(id=>$(id).classList.toggle('hidden',id!==which));document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.go===(which==='quiz'||which==='finish'?'training':which==='welcome'?'training':which)));window.scrollTo(0,0)}
function start(){index=0;points=0;quizAnswers=[];reviewMode=false;originalScore=null;quizOrder=selectQuestions();show('quiz');renderQuestion()}
function retryMistakes(){const missed=quizAnswers.filter(a=>!a.correct).map(a=>a.q);if(!missed.length)return;originalScore=points+' / '+quizOrder.length;reviewMode=true;index=0;points=0;quizAnswers=[];quizOrder=shuffled(missed);show('quiz');renderQuestion()}
function renderQuestion(){locked=false;const q=quizOrder[index];$('counter').textContent=`СИТУАЦИЯ ${String(index+1).padStart(2,'0')} / ${quizOrder.length}`;$('score').textContent=`${points} ПРАВИЛЬНЫХ`;$('progress-fill').style.width=`${index/quizOrder.length*100}%`;$('category').textContent=q.category;$('question-title').textContent=q.title;$('scene').innerHTML=renderScene(q);$('feedback').className='feedback hidden';$('next').classList.add('hidden');$('next').innerHTML=index===quizOrder.length-1?'Посмотреть результат <span>→</span>':'Следующее задание <span>→</span>';['scam','safe'].forEach(id=>{$(id).disabled=false;$(id).classList.remove('selected')});}
function answer(choice){if(locked)return;locked=true;const q=quizOrder[index];const correct=choice===q.scam;if(correct)points++;quizAnswers.push({q,choice,correct});$('score').textContent=`${points} ПРАВИЛЬНЫХ`;['scam','safe'].forEach(id=>$(id).disabled=true);$(choice?'scam':'safe').classList.add('selected');$('feedback').className=`feedback ${correct?'correct':'incorrect'}`;$('feedback-title').textContent=correct?'✓ Верно!':'✕ Не совсем так';$('feedback-text').textContent=q.explanation;$('clue').textContent=q.clue;$('feedback-learn').onclick=()=>openLesson(lessonForKind[q.kind]);$('next').classList.remove('hidden');$('progress-fill').style.width=`${(index+1)/quizOrder.length*100}%`}
function next(){index++;if(index<quizOrder.length)renderQuestion();else finish()}
function finish(){show('finish');renderMistakes();$('final-score').textContent=`${points} / ${quizOrder.length}`;$('final-message').textContent=points===quizOrder.length?'Отличный результат! Ты разобрал все учебные ситуации. Помни: в реальности важно проверять источник и контекст.':points>=7?'Хороший результат! Ты замечаешь большинство подозрительных признаков. Попробуй ещё раз и разберись с оставшимися ситуациями.':'Это хорошая возможность потренироваться. Прочитай объяснения и попробуй пройти сценарии ещё раз.';$('retry-mistakes').hidden=!quizAnswers.some(a=>!a.correct);$('retry-mistakes').textContent='↻ Пройти только ошибки ('+quizAnswers.filter(a=>!a.correct).length+')';$('category-summary').textContent=categorySummary();if(reviewMode)$('final-message').textContent='Работа над ошибками: '+$('final-message').textContent+' Исходный результат: '+originalScore+'.'}
$('quiz-exit').addEventListener('click',()=>navigate('training'));$('quiz-knowledge').addEventListener('click',()=>navigate('knowledge'));$('start').addEventListener('click',start);$('restart').addEventListener('click',start);$('retry-mistakes').addEventListener('click',retryMistakes);$('scam').addEventListener('click',()=>answer(true));$('safe').addEventListener('click',()=>answer(false));$('next').addEventListener('click',next);


// База знаний: весь текст хранится локально, без внешних сервисов.
const lessons=[
 {id:'phishing',icon:'🎭',title:'Что такое фишинг',subtitle:'Как злоумышленники выманивают данные и деньги',sections:[
  ['Как это работает','Фишинг — обман, при котором человека пытаются убедить добровольно раскрыть пароль, код подтверждения, платёжные данные или перейти на поддельный ресурс. Сообщение может выглядеть как письмо банка, магазина, школы или знакомого.'],
  ['На что обращать внимание','Частые сигналы: неожиданная просьба, угрозы блокировкой, обещание приза, давление срочностью, просьба скрыть разговор или назвать секретный код. Один признак не всегда доказывает мошенничество, поэтому важен контекст.'],
  ['Как поступить','Не действуй под давлением. Самостоятельно открой официальный сайт или приложение и проверь информацию там. Не передавай пароли и коды подтверждения посторонним.']],example:'«Аккаунт заблокируют через 10 минут — срочно сообщите код!» — пример давления и попытки получить секретные данные.'},
 {id:'links',icon:'🔗',title:'Поддельные ссылки и сайты',subtitle:'Домен, адресная строка и маскировка страниц',sections:[
  ['Проверяй адрес','Дизайн страницы можно скопировать. Смотри на домен, а не только на логотип. Например, в bank.example.com.login-check.example.net основной домен — example.net, а не example.com.'],
  ['Что не гарантирует безопасность','Значок замка и https означают защищённое соединение, но не подтверждают честность владельца сайта. Красивый интерфейс и знакомые слова в адресе тоже не являются гарантией.'],
  ['Безопасный способ','Не открывай ссылки из неожиданных сообщений для входа в важные аккаунты. Введи знакомый адрес самостоятельно или открой официальное приложение.']],example:'Учебный адрес bank.example.com.login-check.example.net маскируется под банк, но относится к example.net.'},
 {id:'messages',icon:'✉️',title:'Письма, SMS и сообщения',subtitle:'Поддельные отправители, вложения и срочные просьбы',sections:[
  ['Типичные уловки','Мошенники могут сообщать о якобы задержанной посылке, штрафе, выигрыше или проблеме с аккаунтом. Часто предлагают нажать кнопку и немедленно заплатить.'],
  ['Проверяй отправителя','Имя контакта может быть подделано, а аккаунт знакомого — взломан. При необычной просьбе лучше уточнить информацию через другой, заранее известный канал связи.'],
  ['Не торопись с вложениями','Не запускай неожиданные файлы и не вводи личные данные на страницах из подозрительных писем. Проверяй уведомления в официальных приложениях.']],example:'«Оплатите доставку в течение 30 минут» — повод самостоятельно проверить заказ, а не платить по присланной ссылке.'},
 {id:'calls',icon:'📞',title:'Телефонное мошенничество',subtitle:'Подмена роли сотрудника и давление во время разговора',sections:[
  ['Как создают доверие','Звонящий может представиться сотрудником банка, оператором связи или технической поддержкой. Он может знать имя и другие сведения, но это не доказывает его полномочия.'],
  ['Опасные просьбы','Особенно подозрительны просьбы продиктовать SMS-код, пароль, перевести деньги на «безопасный счёт» или установить программу для удалённого доступа.'],
  ['Что делать','Заверши разговор и сам позвони по номеру с официального сайта или банковской карты. Не выполняй действия под диктовку неизвестного человека.']],example:'«Назовите код из SMS для отмены перевода» — типичная попытка получить доступ к аккаунту.'},
 {id:'accounts',icon:'🔐',title:'Защита аккаунтов',subtitle:'Пароли, двухфакторная защита и проверка входа',sections:[
  ['Уникальные пароли','Используй разные длинные пароли для важных сервисов. Менеджер паролей помогает хранить их и не повторять.'],
  ['Дополнительная защита','Включай двухфакторную аутентификацию, где она доступна. Никому не сообщай коды подтверждения и не одобряй незнакомые запросы на вход.'],
  ['Проверяй активность','Если сервис позволяет, просматривай список устройств и сеансов. Обновляй приложения и не вводи пароль после перехода по неожиданной ссылке.']],example:'Даже если сообщение выглядит как официальное, одноразовый код подтверждения нельзя передавать звонящему.'},
 {id:'help',icon:'🧭',title:'Что делать при подозрении на обман',subtitle:'Проверка ситуации и первые безопасные действия',sections:[
  ['Если сообщение только пришло','Не нажимай на подозрительные ссылки, не отправляй данные и не плати. Сверь информацию с официальным источником, который откроешь самостоятельно.'],
  ['Если пароль уже введён','Зайди на настоящий сайт или в приложение, смени пароль, заверши незнакомые сеансы и включи двухфакторную защиту. При необходимости обратись в поддержку сервиса.'],
  ['Если переданы платёжные данные','Как можно скорее свяжись с банком через официальный канал и следуй его рекомендациям по защите счёта. Если нужна помощь, обратись к взрослому, которому доверяешь.']],example:'Вместо ответа на подозрительное SMS самостоятельно открой приложение доставки и проверь статус заказа.'}
];
function categorySummary(){return ['web','messages','calls','social'].map((g,i)=>{const a=quizAnswers.filter(x=>questionGroup(x.q)===g);return a.length?['Сайты','Сообщения','Звонки','Соцсети и игры'][i]+': '+a.filter(x=>x.correct).length+'/'+a.length:null}).filter(Boolean).join('  ·  ')}
function renderMistakes(){
 const root=$('mistakes-review');root.replaceChildren();const h=document.createElement('h3');h.textContent='Разбор ответов';root.append(h);
 const mistakes=quizAnswers.filter(a=>!a.correct);
 if(!mistakes.length){const p=document.createElement('p');p.textContent='Все ответы верные! Можешь повторить тренировку в новом порядке.';root.append(p);return;}
 for(const a of mistakes){const box=document.createElement('div');box.className='review-item';const title=document.createElement('strong');title.textContent='✕ '+a.q.title;const choice=document.createElement('p');choice.textContent='Твой ответ: '+(a.choice?'Есть признаки мошенничества':'Нет явных признаков')+'. Правильно: '+(a.q.scam?'Есть признаки мошенничества':'Нет явных признаков')+'.';const why=document.createElement('p');why.textContent=a.q.explanation;box.append(title,choice,why);root.append(box)}
}
const storageKey='phishguard64-lessons';
function readLessons(){try{const a=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(a)?a.filter(x=>typeof x==='string'):[]}catch{return []}}
let doneLessons=new Set(readLessons()),activeLesson=null;
function saveLessons(){try{localStorage.setItem(storageKey,JSON.stringify([...doneLessons]))}catch{}updateLessonProgress()}
function updateLessonProgress(){const n=lessons.filter(l=>doneLessons.has(l.id)).length;$('lesson-progress-label').textContent=n+' из '+lessons.length;$('lesson-progress-fill').style.width=(n/lessons.length*100)+'%';$('lesson-complete').textContent=activeLesson&&doneLessons.has(activeLesson)?'✓ Урок изучен — отменить отметку':'✓ Отметить урок изученным'}
$('lesson-complete').addEventListener('click',()=>{if(!activeLesson)return;if(doneLessons.has(activeLesson))doneLessons.delete(activeLesson);else doneLessons.add(activeLesson);saveLessons();renderKnowledge()});
$('lesson-next').addEventListener('click',()=>{const i=lessons.findIndex(l=>l.id===activeLesson);openLesson(lessons[(i+1)%lessons.length].id)});
$('lesson-continue').addEventListener('click',()=>openLesson((lessons.find(l=>!doneLessons.has(l.id))||lessons[0]).id));
const lessonForKind={sms:'messages',call:'calls',mail:'messages',browser:'links',chat:'messages',notice:'accounts',social:'phishing',market:'links',calendar:'phishing',security:'help',telegram:'accounts',discord:'accounts',bankpush:'accounts',deliverysafe:'messages',marketplace:'links',hrmail:'messages'};
function renderKnowledge(){const grid=$('knowledge-grid');grid.replaceChildren();for(const lesson of lessons){const b=document.createElement('button');b.className='knowledge-card';if(doneLessons.has(lesson.id))b.classList.add('lesson-done');b.innerHTML=`<span class="lesson-icon">${lesson.icon}</span><strong>${lesson.title}</strong><small>${lesson.subtitle}</small><span class="read-more">Читать урок →</span>`;b.addEventListener('click',()=>openLesson(lesson.id));grid.appendChild(b)}updateLessonProgress()}
function openLesson(id){const lesson=lessons.find(l=>l.id===id);if(!lesson)return;activeLesson=id;updateLessonProgress();show('knowledge');$('knowledge-grid').classList.add('hidden');$('lesson').classList.remove('hidden');const body=$('lesson-body');body.replaceChildren();const heading=document.createElement('div');heading.className='lesson-tag';heading.textContent='PHISHGUARD / БАЗА ЗНАНИЙ';body.appendChild(heading);const title=document.createElement('h2');title.textContent=lesson.icon+' '+lesson.title;body.appendChild(title);const intro=document.createElement('p');intro.textContent=lesson.subtitle;body.appendChild(intro);for(const [name,content] of lesson.sections){const h=document.createElement('h3');h.textContent=name;const p=document.createElement('p');p.textContent=content;body.append(h,p)}const ex=document.createElement('div');ex.className='lesson-example';const bold=document.createElement('strong');bold.textContent='Пример: ';ex.append(bold,document.createTextNode(lesson.example));body.appendChild(ex);window.scrollTo(0,0)}
function openKnowledge(){show('knowledge');$('knowledge-grid').classList.remove('hidden');$('lesson').classList.add('hidden')}
function navigate(target){if(target==='home')show('home');else if(target==='knowledge')openKnowledge();else if(target==='training')show('welcome');else if(target==='analyzer')show('analyzer')}
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.go)));
$('back-lessons').addEventListener('click',openKnowledge);
$('lesson-train').addEventListener('click',start);
renderKnowledge();



// PhishGuard v5 — локальный статический анализ URL. Сеть не используется.
// Баллы — эвристические, НЕ вероятность мошенничества.
const urlInput=$('url-input'),analysisResult=$('analysis-result'),analysisError=$('analysis-error');
const shorteners=new Set(['bit.ly','tinyurl.com','t.co','is.gd','cutt.ly','tiny.cc','rebrand.ly','shorturl.at']);
const suspiciousWords=/(?:login|verify|confirm|password|account|payment|wallet|prize|reset|signin|unlock|urgent)/i;
// Названия для проверки подозрительных поддоменов строятся из справочника.
const ip4=h=>{const p=h.split('.');return p.length===4&&p.every(x=>/^\d{1,3}$/.test(x)&&Number(x)<=255)};
const isIp=h=>ip4(h)||h.startsWith('[')&&h.endsWith(']');
// Полный офлайн-снимок Public Suffix List: точные правила, *.wildcard и !exceptions.
// Если справочник не загрузился, не угадываем основной домен.
function domainParts(host){
 if(isIp(host)||host==='localhost')return {registrable:host,subdomain:'',approx:false,suffix:''};
 const parts=host.toLowerCase().replace(/\.$/,'').split('.');
 if(!parts.every(Boolean)||typeof PHISHGUARD_PSL==='undefined')return {registrable:null,subdomain:'',approx:true,suffix:''};
 let matched=1,exception=0;
 for(let i=0;i<parts.length;i++){
  const candidate=parts.slice(i).join('.');
  if(PHISHGUARD_PSL.has('!'+candidate))exception=Math.max(exception,parts.length-i-1);
  if(PHISHGUARD_PSL.has(candidate))matched=Math.max(matched,parts.length-i);
  if(i>0&&PHISHGUARD_PSL.has('*.'+candidate))matched=Math.max(matched,parts.length-i+1);
 }
 const suffixCount=exception||matched;
 const registrable=parts.length>suffixCount?parts.slice(-(suffixCount+1)).join('.'):null;
 return {registrable,subdomain:registrable?parts.slice(0,-(suffixCount+1)).join('.'):'' ,approx:false,suffix:parts.slice(-suffixCount).join('.')};
}
// PhishGuard 6.6 — сравнение доменов с небольшим проверяемым справочником.
// Справочник не является официальным реестром: у компаний бывают другие законные домены.
// Курируемый справочник для поиска похожих написаний. Не подтверждает владение или безопасность.
const brandRegistry=[
 {name:'Сбер',domains:['sberbank.ru','sber.ru']},
 {name:'Госуслуги',domains:['gosuslugi.ru']},
 {name:'Яндекс',domains:['yandex.ru','ya.ru','yandex.com']},
 {name:'ВКонтакте',domains:['vk.com','vk.ru']},
 {name:'Google',domains:['google.com','google.ru']},
 {name:'Microsoft',domains:['microsoft.com','live.com','outlook.com']},
 {name:'Apple',domains:['apple.com','icloud.com']},
 {name:'PayPal',domains:['paypal.com']},
 {name:'Telegram',domains:['telegram.org','t.me']},
 {name:'Ozon',domains:['ozon.ru']},
 {name:'Wildberries',domains:['wildberries.ru']},
 {name:'Т-Банк',domains:['tbank.ru','tinkoff.ru']},
 {name:'Альфа-Банк',domains:['alfabank.ru']},
 {name:'ВТБ',domains:['vtb.ru']},
 {name:'Газпромбанк',domains:['gazprombank.ru']},
 {name:'Райффайзен Банк',domains:['raiffeisen.ru']},
 {name:'Россельхозбанк',domains:['rshb.ru']},
 {name:'Совкомбанк',domains:['sovcombank.ru']},
 {name:'Почта России',domains:['pochta.ru']},
 {name:'Авито',domains:['avito.ru']},
 {name:'Мегамаркет',domains:['megamarket.ru']},
 {name:'МТС',domains:['mts.ru']},
 {name:'МегаФон',domains:['megafon.ru']},
 {name:'Билайн',domains:['beeline.ru']},
 {name:'Ростелеком',domains:['rt.ru','rostelecom.ru']},
 {name:'РЖД',domains:['rzd.ru']},
 {name:'Аэрофлот',domains:['aeroflot.ru']},
 {name:'Налоговая служба',domains:['nalog.gov.ru']},
 {name:'Госуслуги Москвы',domains:['mos.ru']},
 {name:'Mail.ru',domains:['mail.ru']},
 {name:'Дзен',domains:['dzen.ru']},
 {name:'Rutube',domains:['rutube.ru']},
 {name:'YouTube',domains:['youtube.com','youtu.be']},
 {name:'WhatsApp',domains:['whatsapp.com','wa.me']},
 {name:'Discord',domains:['discord.com','discord.gg']},
 {name:'Steam',domains:['steampowered.com','steamcommunity.com']},
 {name:'GitHub',domains:['github.com']},
 {name:'Amazon',domains:['amazon.com']},
 {name:'Netflix',domains:['netflix.com']},
 {name:'Dropbox',domains:['dropbox.com']},
 {name:'Adobe',domains:['adobe.com']},
 {name:'Cloudflare',domains:['cloudflare.com']},
 {name:'OpenAI',domains:['openai.com','chatgpt.com']},
 {name:'СДЭК',domains:['cdek.ru']},
 {name:'DNS',domains:['dns-shop.ru']},
 {name:'М.Видео',domains:['mvideo.ru']},
 {name:'Эльдорадо',domains:['eldorado.ru']},
 {name:'Литрес',domains:['litres.ru']},
 {name:'Кинопоиск',domains:['kinopoisk.ru']},
 {name:'Хабр',domains:['habr.com']},
 {name:'Twitch',domains:['twitch.tv']},
 {name:'Reddit',domains:['reddit.com']},
 {name:'Zoom',domains:['zoom.us']},
 {name:'LinkedIn',domains:['linkedin.com']},
 {name:'Pinterest',domains:['pinterest.com']}
];
const officialDomains=new Set(brandRegistry.flatMap(b=>b.domains));
const brandTokens=[...new Set(brandRegistry.flatMap(b=>b.domains.map(d=>d.split('.')[0])))].filter(n=>n.length>=4);
// Для длинных названий допустимы два изменения, для коротких — одно; короткие
// совпадения чаще случайны, поэтому проверяются только названия >= 5 символов.

function editDistance(a,b){
 const prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  let diag=prev[0];prev[0]=i;
  for(let j=1;j<=b.length;j++){
   const above=prev[j];
   prev[j]=Math.min(prev[j]+1,prev[j-1]+1,diag+(a[i-1]===b[j-1]?0:1));
   diag=above;
  }
 }
 return prev[b.length];
}
// Частые визуальные подмены кириллицей/латиницей (не универсальная проверка Unicode).
const lookalikes={'а':'a','е':'e','о':'o','р':'p','с':'c','х':'x','у':'y','к':'k','м':'m','т':'t','в':'b','н':'h','і':'i','ј':'j','ӏ':'l'};
function skeleton(text){return [...text.normalize('NFKC').toLowerCase()].map(ch=>lookalikes[ch]||ch).join('')}
function brandSignals(host,d,localHost){
 if(localHost||isIp(host))return [];
 const domain=d.registrable?.toLowerCase();
 if(!domain)return [];
 // Официальные домены и их поддомены не считаются подделкой только из-за имени.
 if([...officialDomains].some(x=>host===x||host.endsWith('.'+x)))return [];
 const stem=domain.slice(0,-(d.suffix.length+1));
 const normalized=skeleton(stem);
 const results=[];
 for(const brand of brandRegistry){
  let best=null;
  for(const official of brand.domains){
   const name=official.slice(0,official.lastIndexOf('.'));
   if(name.length<5)continue;
   const distance=editDistance(normalized,name);
   const visual=normalized===name&&normalized!==stem;
   const same=normalized===name;
   const embedded=name.length>=5&&normalized.includes(name)&&normalized!==name;
   const typo=distance>0&&distance<=(name.length>=10?2:1)&&Math.min(name.length,normalized.length)>=5&&Math.abs(name.length-normalized.length)<=2;
   if(!(visual||same||embedded||typo))continue;
   const points=visual?38:embedded?32:typo?30:20;
   const type=visual?'visual':embedded?'embedded':typo?'typo':'zone';
   if(!best||points>best.points)best={points,type,distance,official};
  }
  if(best){
   const details={visual:'В написании могут использоваться похожие символы.',embedded:'Название сервиса находится внутри другого доменного имени.',typo:`В написании ${best.distance} ${best.distance===1?'отличие':'отличия'} от известного имени.`,zone:'Название совпадает, но полный адрес отличается.'};
   results.push({points:best.points,title:'Возможная имитация: '+brand.name,description:`${domain} отличается от ${best.official}. ${details[best.type]} Это сигнал для проверки, а не доказательство мошенничества.`,group:'identity',brand:brand.name,reference:best.official});
  }
 }
 return results.sort((a,b)=>b.points-a.points).slice(0,2);
}
function analyzeUrl(raw){
 const input=raw.trim();
 if(!input)throw Error('Вставь адрес для анализа.');
 if(input.length>2048)throw Error('Адрес слишком длинный (максимум 2048 символов).');
 if(/[\s\u0000-\u001f\u007f]/.test(input))throw Error('В адресе есть пробелы или управляющие символы.');
 if(/^[a-z][a-z\d+.-]*:/i.test(input)&&!/^https?:\/\//i.test(input))throw Error('Поддерживаются только HTTP и HTTPS.');
 const prepared=/^https?:\/\//i.test(input)?input:'https://'+input;
 let u;try{u=new URL(prepared)}catch{throw Error('Некорректный адрес. Проверь его написание.')}
 if(!['http:','https:'].includes(u.protocol))throw Error('Поддерживаются только HTTP и HTTPS.');
 const host=u.hostname.toLowerCase().replace(/\.$/,'');
 if(!host||(!host.includes('.')&&host!=='localhost'))throw Error('Укажи полный домен, например example.com.');
 if(host.length>253)throw Error('Домен слишком длинный.');
 const localHost=host==='localhost'||host==='127.0.0.1'||host==='[::1]'||host==='::1'||/^10\./.test(host)||/^192\.168\./.test(host)||/^172\.(1[6-9]|2\d|3[01])\./.test(host);
 const d=domainParts(host),flags=[];
 const add=(points,title,description,group='other')=>flags.push({points,title,description,group});
 if(!localHost&&u.protocol==='http:')add(12,'Нет HTTPS','Соединение не шифруется с помощью HTTPS. Это не доказательство фишинга.','connection');
 if(u.username||u.password||/@/.test(prepared.slice(prepared.indexOf('//')+2).split(/[/?#]/)[0]))add(38,'Маскировка через @','Всё перед @ — данные пользователя, а не адрес сайта. Сайт определяется частью после @.','identity');
 if(!localHost&&isIp(host))add(18,'IP-адрес вместо домена','Для неожиданной страницы авторизации IP-адрес требует дополнительной проверки.','identity');
 if(host.includes('xn--'))add(16,'Международный домен (Punycode)','Некоторые символы домена представлены в кодировке Punycode. Это нормально для международных доменов, но возможно визуальное сходство с чужим брендом.','identity');
 if(shorteners.has(host))add(20,'Сервис коротких ссылок','Конечный адрес скрыт. Анализатор не раскрывает перенаправление.','identity');
 if(host.length>50)add(8,'Очень длинный хост','В длинном имени легко не заметить подмену домена.','identity');
 if(d.subdomain.split('.').filter(Boolean).length>=3)add(12,'Много поддоменов','Поддомены слева могут создавать видимость официального сайта.','identity');
 if(/%(?:2f|5c|40|00)/i.test(input))add(12,'Закодированные разделители','В ссылке есть закодированные символы, усложняющие чтение.','obfuscation');
 if(/\\/.test(input))add(18,'Обратный слеш','Обратный слеш может неоднозначно восприниматься при чтении URL.','obfuscation');
 if(/(?:--|\d{5,})/.test(host))add(5,'Необычный шаблон имени','Длинные последовательности цифр или двойной дефис — слабый сигнал.','identity');
 if(!localHost&&u.port&&!['80','443'].includes(u.port))add(8,'Нестандартный порт','Проверь, почему сайт использует нестандартный порт.','connection');
 if(u.search.length>250)add(5,'Длинные параметры','Ссылки с длинными параметрами бывают легитимными, но их сложнее проверить.','other');
 if(suspiciousWords.test(host+' '+u.pathname)&&!officialDomains.has(d.registrable))add(3,'Слова об авторизации или платежах','Сами по себе такие слова нормальны и почти не влияют на оценку.','content');
 if(d.registrable&&!officialDomains.has(d.registrable)&&brandTokens.some(b=>d.subdomain.split('.').some(x=>x===b||x.startsWith(b+'-')||x.endsWith('-'+b))))add(24,'Название известного сервиса в поддомене','Название сервиса находится слева от основного домена: владелец адреса определяется доменом справа, а не знакомым словом.','identity');
 flags.push(...brandSignals(host,d,localHost));
 const groups={};for(const f of flags)groups[f.group]=(groups[f.group]||0)+f.points;
 const score=Math.min(100,Math.round(Object.entries(groups).reduce((sum,[group,value])=>sum+Math.min(value,group==='identity'?65:group==='obfuscation'?25:group==='connection'?12:group==='content'?3:5),0))); 
 return {u,host,d,flags,score,localHost};
}
function renderAnalysis(){
 analysisError.classList.add('hidden');analysisResult.classList.add('hidden');let r;
 try{r=analyzeUrl(urlInput.value)}catch(err){analysisError.textContent=err.message;analysisError.classList.remove('hidden');return}
 const {u,host,d,flags,score,localHost}=r,level=localHost?'local':score>=55?'high':score>=25?'medium':'low';
 $('risk-title').textContent=level==='local'?'Локальный адрес компьютера':flags.some(f=>f.brand)?'Возможно, имитация известного сайта':level==='high'?'Обнаружены серьёзные признаки':level==='medium'?'Нужна дополнительная проверка':'Сильных признаков в адресе не найдено';
 $('risk-description').textContent=level==='local'?'Это адрес текущего компьютера, а не публичный домен. Локальный HTTP и порт разработки не оцениваются как признаки фишинга. Безопасность запущенного сервиса не проверялась.':flags.some(f=>f.brand)?'Проверь написание и полный домен через независимый источник. Сходство не доказывает мошенничество.':level==='low'?'Локальные правила не нашли явных признаков. Это НЕ подтверждает безопасность.':'Результат основан только на структуре адреса, а не на репутации сайта.';
 $('analysis-advice').textContent=localHost?'Это локальный адрес. Не открывай неизвестные сервисы только из-за низкой оценки.':flags.some(f=>f.brand)?'Что делать: не вводи пароль или данные карты. Открой официальный сайт вручную через закладку или поиск и сравни адреса.':score>=25?'Что делать: уточни источник ссылки через независимый канал. Не вводи секретные данные до проверки.':'Что делать: если ссылка неожиданная, проверь отправителя и назначение страницы. Отсутствие признаков не означает безопасность.';
 $('risk-number').textContent=score;$('risk-fill').style.width=score+'%';analysisResult.dataset.level=level;
 $('parsed-address').textContent=u.href;
 $('parsed-host').textContent=host;
 $('registrable-domain').textContent=!d.registrable?'— (домен не определён)':d.registrable===host?'— (совпадает с хостом)':d.registrable;
 $('subdomain-value').textContent=d.subdomain||'—';
 $('domain-caveat').textContent=localHost?'Локальный адрес: запросы направляются на этот компьютер. Не означает, что работающий на нём сервис безопасен.':d.approx?'Не удалось загрузить справочник Public Suffix List. Граница домена не определена.':d.registrable?'':'Адрес соответствует публичному суффиксу, основной домен не выделяется.';
 const signals=$('signals');signals.replaceChildren();
 if(!flags.length){const item=document.createElement('div');item.className='signal neutral';item.textContent=localHost?'Обнаружен адрес обратной петли (loopback). Обычные признаки публичных сайтов здесь неприменимы; локальный сервис не проверялся.':'Характерных признаков по локальным правилам не найдено. Это не подтверждение безопасности.';signals.append(item)}
 for(const f of flags){const item=document.createElement('div');item.className='signal';const head=document.createElement('div');head.className='signal-head';const title=document.createElement('strong');title.textContent=f.title;const weight=document.createElement('span');weight.textContent=f.points>=20?'Важный признак':f.points>=10?'Дополнительный признак':'Слабый признак';head.append(title,weight);const desc=document.createElement('p');desc.textContent=f.description;item.append(head,desc);signals.append(item)}
 $('check-status').textContent='Анализ адреса без посещения сайта.';
 analysisResult.classList.remove('hidden');rememberHistory(u.href);analysisResult.scrollIntoView({behavior:'smooth',block:'start'});
}
$('analyze-btn').addEventListener('click',renderAnalysis);
urlInput.addEventListener('keydown',ev=>{if(ev.key==='Enter')renderAnalysis()});
$('url-clear').addEventListener('click',()=>{resetAll();urlInput.value='';urlInput.focus()});
$('url-paste').addEventListener('click',async()=>{try{resetAll();urlInput.value=await navigator.clipboard.readText();urlInput.focus()}catch{$('analysis-error').textContent='Браузер запретил чтение буфера. Вставь ссылку сочетанием Ctrl + V.';$('analysis-error').classList.remove('hidden')}});
$('analyze-another').addEventListener('click',()=>{resetAll();urlInput.value='';urlInput.focus();urlInput.scrollIntoView({behavior:'smooth',block:'center'})});
$('copy-analysis').addEventListener('click',async()=>{const result=[$('risk-title').textContent,$('risk-description').textContent,'Адрес: '+$('parsed-address').textContent,'Хост: '+$('parsed-host').textContent,'Индекс признаков (не вероятность): '+$('risk-number').textContent+'/100',...Array.from($('signals').children).map(el=>el.innerText)].join('\n');try{await navigator.clipboard.writeText(result);$('copy-feedback').textContent='Результат скопирован.'}catch{$('copy-feedback').textContent='Не удалось скопировать. Проверь разрешение браузера.'}});
document.querySelectorAll('[data-sample]').forEach(b=>b.addEventListener('click',()=>{resetAll();urlInput.value=b.dataset.sample;renderAnalysis()}));


// PhishGuard 6.2 — устойчивое ожидание, без повторной отправки при временных ошибках.
const deepButton=$('deep-start'),deepStatus=$('deep-status'),deepOutput=$('deep-output');
const deepConsent=$('deep-consent');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function deepRequest(path,options){
 const response=await fetch(path,options);
 let data;
 try{data=await response.json()}catch{throw Error('Сервер вернул некорректный ответ ('+response.status+').')}
 if(!response.ok)throw Error((data.error||'Ошибка сервера')+(data.status_code?' (HTTP '+data.status_code+')':''));
 return data;
}
let currentScan=null,deepGeneration=0;
function resetAll(){clearTimeout(screenshotTimer);$('deep-image-loading').hidden=true;$('deep-image-error').hidden=true;$('deep-image-retry').hidden=true;deepGeneration++;currentScan=null;analysisResult.classList.add('hidden');analysisError.classList.add('hidden');deepOutput.classList.add('hidden');$('deep-image').removeAttribute('src');$('deep-image').hidden=true;$('deep-image-note').textContent='';deepStatus.textContent='Для проверки сначала введи адрес выше.';deepButton.disabled=false;deepConsent.checked=false;$('copy-feedback').textContent='';$('image-modal').classList.add('hidden')}
urlInput.addEventListener('input',()=>{if(analysisResult.classList.contains('hidden')&&deepOutput.classList.contains('hidden')&&!currentScan)return;resetAll()});
async function pollScan(scanId,token){
 const started=Date.now();
 for(let i=0;i<32;i++){
  await sleep(i===0?30000:6000);
  if(token!==deepGeneration)return null;
  let state;
  try{state=await deepRequest('/api/deep-result/'+encodeURIComponent(scanId));}
  catch(e){
   // Не создаём новое сканирование при сбое запроса результата.
   if(i>=31)throw e;
   deepStatus.textContent='Временный сбой получения отчёта. Повторяем запрос к уже созданному сканированию…';
   continue;
  }
  if(token!==deepGeneration)return null;
  if(state.ready)return state;
  deepStatus.textContent='Ожидаем отчёт urlscan.io… '+Math.round((Date.now()-started)/1000)+' сек.'+(state.retry?' (сервис временно ограничил запрос)':'');
 }
 throw Error('Отчёт пока недоступен. Новое сканирование не требуется: попробуй получить результат позже.');
}

let screenshotTimer=null;
function loadDeepScreenshot(url,token){
 const img=$('deep-image'),loading=$('deep-image-loading'),failure=$('deep-image-error'),retry=$('deep-image-retry');
 clearTimeout(screenshotTimer);img.onload=null;img.onerror=null;img.hidden=true;img.removeAttribute('src');
 loading.hidden=false;failure.hidden=true;retry.hidden=true;$('deep-image-note').textContent='';
 if(!url){loading.hidden=true;failure.hidden=false;retry.hidden=false;return}
 let done=false;
 const fail=()=>{if(done||token!==deepGeneration)return;done=true;clearTimeout(screenshotTimer);loading.hidden=true;failure.hidden=false;retry.hidden=false;$('deep-image-note').textContent='Отчёт получен, но снимок страницы сейчас недоступен.'};
 img.onload=()=>{if(done||token!==deepGeneration)return;done=true;clearTimeout(screenshotTimer);loading.hidden=true;img.hidden=false;$('deep-image-note').textContent='Снимок страницы получен.'};
 img.onerror=fail;screenshotTimer=setTimeout(fail,18000);
 img.src=url;
 retry.onclick=()=>{if(token!==deepGeneration)return;loadDeepScreenshot(url,token)};
}

function showDeepResult(result,token){
 if(token!==deepGeneration)return;
 $('deep-url').textContent=result.page_url||'Нет данных';$('deep-domain').textContent=result.domain||'Нет данных';$('deep-ip').textContent=result.ip||'Нет данных';$('deep-requests').textContent=result.requests??'Нет данных';$('deep-domains').textContent=result.domains??'Нет данных';$('deep-title').textContent=result.title||'Нет данных';$('deep-score').textContent=result.score??'Нет данных';
 $('deep-verdict').textContent=result.malicious===true?'Сервис отметил признаки угрозы. Не вводи данные на этой странице.':result.malicious===false?'По доступным данным сервиса угроз не отмечено. Это НЕ гарантия безопасности.':'Однозначный вердикт отсутствует. Нельзя считать страницу безопасной.';
 loadDeepScreenshot(result.screenshot,token);
 const link=$('deep-report');link.href=result.report||'#';deepOutput.classList.remove('hidden');deepStatus.textContent='Готово: отчёт получен.';
}
async function startDeepScan(){
 if(deepButton.disabled)return;
 if(!deepConsent.checked){deepStatus.textContent='Сначала подтверди согласие на отправку ссылки.';return}
 let parsed;try{parsed=analyzeUrl(urlInput.value)}catch(e){deepStatus.textContent=e.message;return}
 if(parsed.localHost){deepStatus.textContent='Локальные адреса нельзя отправлять на удалённое сканирование.';return}
 if(parsed.u.search||parsed.u.hash){deepStatus.textContent='Убери параметры после ? и # перед отправкой в сторонний сервис.';return}
 const target=parsed.u.href,token=++deepGeneration;deepButton.disabled=true;deepOutput.classList.add('hidden');
 try{let scanId;
  if(currentScan&&currentScan.url===target){scanId=currentScan.id;deepStatus.textContent='Получаем сохранённый отчёт…'}
  else{deepStatus.textContent='Отправляем адрес в urlscan.io…';const sent=await deepRequest('/api/deep-scan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:target,consent:true})});if(token!==deepGeneration)return;scanId=sent.scan_id;currentScan={url:target,id:scanId};deepStatus.textContent=sent.reused?'Используем ранее отправленное сканирование…':'Ожидаем удалённый браузер…'}
  rememberHistory(target,scanId);
  const result=await pollScan(scanId,token);if(token!==deepGeneration||!result)return;showDeepResult(result,token);
 }catch(e){if(token===deepGeneration)deepStatus.textContent='Глубокая проверка: '+e.message+' Можно повторить получение отчёта без нового сканирования.'}
 finally{if(token===deepGeneration)deepButton.disabled=false}
}
deepButton.addEventListener('click',startDeepScan);

$('deep-copy-url').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(urlInput.value.trim());deepStatus.textContent='Адрес скопирован.'}catch{deepStatus.textContent='Копирование недоступно. Выдели адрес вручную.'}});


// History stays in this browser; never stores screenshots or API secrets.
const historyKey='phishguard64-history',historyPref='phishguard64-history-enabled';
let historyEnabled=localStorage.getItem(historyPref)!=='false';
$('history-enabled').checked=historyEnabled;
function readHistory(){try{const a=JSON.parse(localStorage.getItem(historyKey)||'[]');return Array.isArray(a)?a.filter(x=>x&&typeof x.url==='string').slice(0,10):[]}catch{return []}}
let historyItems=readHistory();
function renderHistory(){const root=$('history-list');root.replaceChildren();if(!historyItems.length){const p=document.createElement('p');p.className='muted';p.textContent='История пуста. Проверки сохраняются только в этом браузере.';root.append(p);return}
 for(const item of historyItems){const row=document.createElement('div');row.className='history-item';const btn=document.createElement('button');btn.className='history-open';const strong=document.createElement('strong');strong.textContent=item.url;const small=document.createElement('small');small.textContent=(item.scanId?'Сохранён онлайн-отчёт':'Локальная проверка')+' · '+new Date(item.date).toLocaleString('ru-RU');btn.append(strong,small);btn.addEventListener('click',async()=>{resetAll();urlInput.value=item.url;renderAnalysis();if(item.scanId){currentScan={url:item.url,id:item.scanId};deepStatus.textContent='Загружаем сохранённый отчёт без нового сканирования…';deepButton.disabled=true;const token=++deepGeneration;try{const result=await deepRequest('/api/deep-result/'+encodeURIComponent(item.scanId));if(token===deepGeneration&&result.ready)showDeepResult(result,token);else if(token===deepGeneration)deepStatus.textContent='Сохранённый отчёт пока недоступен.'}catch(e){if(token===deepGeneration)deepStatus.textContent=e.message}finally{deepButton.disabled=false}}});row.append(btn);root.append(row)}}
function persistHistory(){try{if(historyEnabled)localStorage.setItem(historyKey,JSON.stringify(historyItems))}catch{toast('Не удалось сохранить историю браузера.')}}
function rememberHistory(url,scanId){if(!historyEnabled)return;const old=historyItems.find(x=>x.url===url);historyItems=[{url,scanId:scanId||old?.scanId||null,date:Date.now()},...historyItems.filter(x=>x.url!==url)].slice(0,10);persistHistory();renderHistory()}
$('history-enabled').addEventListener('change',e=>{historyEnabled=e.target.checked;localStorage.setItem(historyPref,String(historyEnabled));if(!historyEnabled){historyItems=[];localStorage.removeItem(historyKey)}renderHistory();toast(historyEnabled?'История включена':'История отключена и очищена')});
$('history-clear').addEventListener('click',()=>{historyItems=[];localStorage.removeItem(historyKey);renderHistory();toast('История очищена')});renderHistory();
let toastTimer;function toast(message){const el=$('toast');el.textContent=message;el.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add('hidden'),2600)}
const topButton=$('scroll-top');window.addEventListener('scroll',()=>topButton.classList.toggle('hidden',scrollY<350),{passive:true});topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
$('image-expand').addEventListener('click',()=>{const img=$('deep-image');if(img.hidden||!img.src){toast('Скриншот ещё не загружен');return}$('image-full').src=img.src;$('image-modal').classList.remove('hidden')});
$('image-close').addEventListener('click',()=>$('image-modal').classList.add('hidden'));
$('image-modal').addEventListener('click',e=>{if(e.target.id==='image-modal')$('image-modal').classList.add('hidden')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('image-modal').classList.add('hidden')});
