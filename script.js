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
