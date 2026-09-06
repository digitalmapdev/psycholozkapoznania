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
