const root=document.documentElement,theme=document.getElementById('theme'),menu=document.getElementById('menu'),mobile=document.getElementById('mobileNav');
const saved=localStorage.getItem('jann-theme');if(saved)root.dataset.theme=saved;
theme?.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;localStorage.setItem('jann-theme',next)});
menu?.addEventListener('click',()=>mobile.classList.toggle('open'));
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobile.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
