const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.desktop-nav');
menuBtn?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(open));
  menuBtn.textContent=open?'×':'☰';
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
  if(menuBtn) menuBtn.textContent='☰';
}));

const io=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const header=document.querySelector('[data-scroll-header]');
const parallax=document.querySelector('[data-parallax]');
let ticking=false;
const onScroll=()=>{
  if(ticking) return;
  requestAnimationFrame(()=>{
    const y=window.scrollY;
    header?.classList.toggle('scrolled',y>20);
    if(parallax && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const offset=Math.min(y*.045,22);
      parallax.style.transform=`scale(1.04) translate3d(0,${offset}px,0)`;
    }
    ticking=false;
  });
  ticking=true;
};
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

// Interactive booking mockup
const dayButtons=[...document.querySelectorAll('.days button')];
dayButtons.forEach(btn=>btn.addEventListener('click',()=>{
  dayButtons.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}));
const slots=[...document.querySelectorAll('.slots button')];
slots.forEach(btn=>btn.addEventListener('click',()=>{
  slots.forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
}));

// Support cards: tactile interaction on pointer devices
if(window.matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.support-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`translateY(-8px) perspective(700px) rotateX(${(-y*2.5).toFixed(2)}deg) rotateY(${(x*2.5).toFixed(2)}deg)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}

const form=document.querySelector('#contactForm');
form?.addEventListener('submit',e=>{
  e.preventDefault();
  const status=form.querySelector('.form-status');
  const button=form.querySelector('button[type="submit"]');
  button.disabled=true;
  const old=button.textContent;
  button.textContent='Wysyłanie…';
  setTimeout(()=>{
    status.textContent='Formularz demonstracyjny — podepnij tu Formspree, Resend lub własny endpoint.';
    button.disabled=false;
    button.textContent=old;
  },650);
});

// Hero cinematic entrance: image first, then content glides in from the right.
const hero=document.querySelector('[data-hero]');
if(hero){
  requestAnimationFrame(()=>setTimeout(()=>hero.classList.add('hero-ready'),420));
}

// Support CTAs prefill the contact topic and focus the first field after scrolling.
document.querySelectorAll('.support-link[data-topic]').forEach(link=>{
  link.addEventListener('click',()=>{
    const topic=document.querySelector('#topicField');
    if(topic){
      topic.value=link.dataset.topic || '';
      topic.dispatchEvent(new Event('input',{bubbles:true}));
    }
    setTimeout(()=>document.querySelector('#contactForm input')?.focus({preventScroll:true}),650);
  });
});

// Scroll progress + active section nav
const progressBar=document.querySelector('.scroll-progress span');
const sectionLinks=[...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const sections=sectionLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const updatePageMotion=()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progressBar) progressBar.style.transform=`scaleX(${max>0?scrollY/max:0})`;
  let current='';
  sections.forEach(section=>{if(section.getBoundingClientRect().top<=innerHeight*.34) current=section.id});
  sectionLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`));
};
window.addEventListener('scroll',updatePageMotion,{passive:true});
window.addEventListener('resize',updatePageMotion,{passive:true});
updatePageMotion();

// Ambient falling leaves: deliberately sparse, slow and random so it feels atmospheric, not gimmicky.
const leafField=document.querySelector('.ambient-leaves');
if(leafField && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const count=innerWidth<760?4:9;
  for(let i=0;i<count;i++){
    const leaf=document.createElement('i');
    leaf.className='falling-leaf';
    leaf.style.setProperty('--x',`${Math.round(Math.random()*96)}vw`);
    leaf.style.setProperty('--drift',`${Math.round(35+Math.random()*110)}px`);
    leaf.style.setProperty('--duration',`${Math.round(16+Math.random()*14)}s`);
    leaf.style.setProperty('--delay',`${(-Math.random()*24).toFixed(1)}s`);
    leaf.style.setProperty('--scale',(0.55+Math.random()*.85).toFixed(2));
    leaf.style.opacity=(.07+Math.random()*.07).toFixed(2);
    leafField.appendChild(leaf);
  }
}

// Cursor halo + soft magnetic CTA movement on desktop pointers.
if(matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const halo=document.querySelector('.cursor-halo');
  document.body.classList.add('has-pointer');
  window.addEventListener('pointermove',e=>{
    if(halo){halo.style.left=`${e.clientX}px`;halo.style.top=`${e.clientY}px`}
  },{passive:true});
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.08;
      const y=(e.clientY-r.top-r.height/2)*.12;
      el.style.transform=`translate3d(${x}px,${y-2}px,0)`;
    });
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
  document.querySelectorAll('.support-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${((e.clientX-r.left)/r.width*100).toFixed(1)}%`);
      card.style.setProperty('--my',`${((e.clientY-r.top)/r.height*100).toFixed(1)}%`);
    });
  });
}

// Make the whole support card actionable while preserving the actual link semantics.
document.querySelectorAll('.support-card').forEach(card=>{
  card.addEventListener('click',e=>{
    if(e.target.closest('a')) return;
    card.querySelector('.support-link')?.click();
  });
  card.addEventListener('keydown',e=>{
    if(e.key==='Enter' || e.key===' '){e.preventDefault();card.querySelector('.support-link')?.click()}
  });
});

// Forest World: scroll position scrubs the cinematic video timeline.
(()=>{
  const world=document.querySelector('[data-forest-world]');
  const video=world?.querySelector('[data-forest-video]');
  if(!world || !video) return;

  const scenes=[...world.querySelectorAll('[data-forest-scene]')];
  const progressEl=world.querySelector('[data-forest-progress]');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let duration=0;
  let frameRequest=0;
  let targetTime=0;
  let seekRequest=0;

  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  const sceneIndex=p=>p<.26?0:p<.51?1:p<.76?2:3;

  function progress(){
    const rect=world.getBoundingClientRect();
    const travel=Math.max(1,world.offsetHeight-window.innerHeight);
    return clamp(-rect.top/travel,0,1);
  }

  function seek(){
    seekRequest=0;
    if(!duration || video.readyState<1) return;
    const safeTarget=clamp(targetTime,0,Math.max(0,duration-.04));
    try{
      // fastSeek is faster when supported; currentTime is the reliable fallback.
      if(typeof video.fastSeek==='function' && Math.abs(video.currentTime-safeTarget)>.18){
        video.fastSeek(safeTarget);
      }else if(Math.abs(video.currentTime-safeTarget)>.018){
        video.currentTime=safeTarget;
      }
    }catch(_e){}
  }

  function render(){
    frameRequest=0;
    const p=progress();
    const active=sceneIndex(p);
    scenes.forEach((scene,index)=>scene.classList.toggle('is-active',index===active));
    if(progressEl) progressEl.style.transform=`scaleY(${p})`;
    world.classList.toggle('is-progressed',p>.035);

    if(!reduceMotion && duration){
      targetTime=p*duration;
      if(!seekRequest) seekRequest=requestAnimationFrame(seek);
    }
  }

  function queue(){ if(!frameRequest) frameRequest=requestAnimationFrame(render); }

  function initVideo(){
    duration=Number.isFinite(video.duration)?video.duration:0;
    video.pause();
    video.muted=true;
    video.playsInline=true;
    // Safari/Chromium may not decode a frame until play() is initiated once.
    const warmup=video.play();
    if(warmup && typeof warmup.then==='function'){
      warmup.then(()=>{video.pause();video.currentTime=0;queue()}).catch(()=>queue());
    }else queue();
  }

  if(video.readyState>=1) initVideo();
  else video.addEventListener('loadedmetadata',initVideo,{once:true});
  video.addEventListener('loadeddata',queue,{once:true});
  window.addEventListener('scroll',queue,{passive:true});
  window.addEventListener('resize',queue,{passive:true});
  queue();

  // Booking teaser: choose a preferred date, then carry it into the contact form.
  const dayButtons=[...world.querySelectorAll('[data-booking-day]')];
  const selectedLabel=world.querySelector('[data-selected-date]');
  const bookingCta=world.querySelector('[data-booking-cta]');
  const topicField=document.querySelector('#topicField');
  let selectedDay='';

  dayButtons.forEach(btn=>btn.addEventListener('click',()=>{
    selectedDay=btn.dataset.bookingDay || '';
    dayButtons.forEach(b=>b.classList.toggle('is-selected',b===btn));
    if(selectedLabel) selectedLabel.textContent=`Preferowany dzień: ${selectedDay}`;
    if(bookingCta) bookingCta.setAttribute('aria-disabled','false');
  }));

  bookingCta?.addEventListener('click',()=>{
    if(!selectedDay) return;
    if(topicField) topicField.value=`Pierwsza konsultacja — preferowany termin: ${selectedDay}`;
  });
})();
