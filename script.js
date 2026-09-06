const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.desktop-nav');
menuBtn?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(open));
  menuBtn.textContent=open?'×':'☰';
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open'); menuBtn?.setAttribute('aria-expanded','false'); if(menuBtn)menuBtn.textContent='☰';
}));

const io=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const form=document.querySelector('#contactForm');
form?.addEventListener('submit',e=>{
  e.preventDefault();
  const status=form.querySelector('.form-status');
  status.textContent='Formularz demonstracyjny — podepnij tu Formspree, Resend lub własny endpoint.';
});
