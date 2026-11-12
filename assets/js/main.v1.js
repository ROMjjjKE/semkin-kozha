
(function(){
  'use strict';
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'),
      closeBtn=document.getElementById('drawerClose');
  function openD(){ if(!drawer) return; drawer.hidden=false; drawer.classList.add('is-open');
    document.body.classList.add('is-locked'); if(burger) burger.setAttribute('aria-expanded','true');
    if(closeBtn) closeBtn.focus(); }
  function closeD(){ if(!drawer) return; drawer.classList.remove('is-open'); drawer.hidden=true;
    document.body.classList.remove('is-locked'); if(burger){burger.setAttribute('aria-expanded','false'); burger.focus();} }
  if(burger) burger.addEventListener('click', openD);
  if(closeBtn) closeBtn.addEventListener('click', closeD);
  if(drawer) drawer.addEventListener('click', function(e){ if(e.target===drawer) closeD(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && drawer && !drawer.hidden) closeD(); });
  window.addEventListener('resize', function(){ if(window.innerWidth>859 && drawer && !drawer.hidden) closeD(); });

  // карта дефектов
  var PLAN={
    potertost:['обезжириваем участок и снимаем ослабленный верхний слой','шлифуем зерно, чтобы новая отделка легла ровно','подбираем цвет по образцу и наносим покрытие слоями','финиш с матовым эффектом — без «лаковой» плёнки'],
    porez:['оцениваем глубину пореза и состояние основы','армируем и заполняем составом послойно','восстанавливаем рисунок зерна под соседние участки','колеровка и финишное покрытие под общую фактуру'],
    treshiny:['расшиваем трещины, чтобы состав попал вглубь','заполняем эластичным составом, который не рвётся при посадке','текстурируем поверхность под зерно кожи','колеровка и матовый финиш'],
    prozhog:['убираем обугленный и отслоившийся материал','восстанавливаем утраченный объём и рельеф','подбираем цвет, наносим покрытие и фиксируем фактуру','проверяем стык с соседними участками'],
    blesk:['обезжириваем и обезжириваем повторно — блеск держится на жире','матируем поверхность до бархатистости','восстанавливаем зерно, если оно стёрлось до гладкости','наносим матовое покрытие и закрепляем результат'],
    kraska:['определяем тип пластика и способ подготовки','наносим адгезионный грунт под конкретный пластик','колеруем в цвет элемента и наносим покрытие','сушим, полируем стыки, ставим элемент на место']
  };
  var ZADD={ rul:'работаем по кругу руля, аккуратно с швами, кнопками и обогревом',
    bolster:'отдельно следим за зоной посадки — она снова будет нагружаться',
    seat:'учитываем натяжение обивки, чтобы покрытие не пошло трещинами',
    panel:'пластик готовим отдельно от кожи: другой грунт и другой финиш',
    door:'проверяем зону контакта с локтем — самое нагруженное место карты',
    armrest:'учитываем, что подлокотник закрывается и трётся каждый день' };
  var ZNAME={rul:'Руль',bolster:'Боковая поддержка',seat:'Подушка сиденья',panel:'Панель и пластик',door:'Дверная карта',armrest:'Подлокотник'};
  var DNAME={potertost:'Потёртость',porez:'Порез',treshiny:'Трещины',prozhog:'Прожог',blesk:'Жирный блеск',kraska:'Сошла краска'};
  var curZ='rul', curD='potertost';
  function paintPlan(){
    var t=document.getElementById('p-title'), l=document.getElementById('p-list'), n=document.getElementById('p-note');
    if(!t) return;
    t.textContent=ZNAME[curZ]+': '+DNAME[curD].toLowerCase();
    var items=PLAN[curD].slice(); items.push(ZADD[curZ]);
    l.innerHTML=items.map(function(x){return '<li>'+x+'</li>';}).join('');
    n.textContent='Стоимость зависит от площади и сложности повреждения, поэтому её считаем по фото. Пришлите снимок при дневном свете и марку авто — ответим с ориентиром.';
  }
  var zBtns=document.querySelectorAll('[data-z]'), dBtns=document.querySelectorAll('[data-d2]');
  Array.prototype.forEach.call(zBtns, function(b){ b.addEventListener('click', function(){
    curZ=b.getAttribute('data-z'); Array.prototype.forEach.call(zBtns,function(x){x.setAttribute('aria-pressed', x===b?'true':'false');}); paintPlan(); }); });
  Array.prototype.forEach.call(dBtns, function(b){ b.addEventListener('click', function(){
    curD=b.getAttribute('data-d2'); Array.prototype.forEach.call(dBtns,function(x){x.setAttribute('aria-pressed', x===b?'true':'false');}); paintPlan(); }); });
  paintPlan();

  // марки
  var chips=document.querySelectorAll('[data-brand]'), bOut=document.getElementById('b-out');
  if(chips.length && bOut){
    bOut.textContent='Выберите марку — покажу, что обычно делаем на её салонах.';
    Array.prototype.forEach.call(chips, function(b){ b.addEventListener('click', function(){
      var name=b.getAttribute('data-brand'), g=b.getAttribute('data-g');
      Array.prototype.forEach.call(chips,function(x){x.setAttribute('aria-pressed', x===b?'true':'false');});
      bOut.textContent=name+' · '+g+'. Работаем с этой маркой: присылайте фото дефекта, марку и год — сориентируем по стоимости. Если салон с комбинированной отделкой (кожа и ткань), напишите об этом сразу.';
    }); });
  }

  // форма
  var f=document.getElementById('leadForm');
  if(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var g=function(n){ var el=f.querySelector('[name="'+n+'"]'); return el?el.value.trim():''; };
      var txt='Заявка на реставрацию\nИмя: '+(g('name')||'—')+'\nАвто: '+(g('car')||'—')+
        '\nЭлемент: '+g('zone')+'\nДефект: '+g('defect')+(g('note')?'\nЗадача: '+g('note'):'')+
        '\nФото приложу к сообщению.';
      var out=document.getElementById('out');
      if(out){ out.hidden=false; out.textContent=txt; }
      var done=false;
      try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt); done=true; } }catch(err){}
      if(!done){ try{ var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); done=true; }catch(err2){} }
      var b=f.querySelector('button[type="submit"]');
      if(b){ b.textContent = done ? 'Текст скопирован' : 'Текст заявки ниже'; setTimeout(function(){ b.textContent='Собрать заявку'; }, 2600); }
    });
  }
})();
