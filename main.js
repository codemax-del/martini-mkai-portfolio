(()=>{
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const L=n=>`assets/logos/${n}.webp`;
const rings=[
 {rx:.46,ry:.17,tilt:-16,sp:.25,s:62,l:['html5','css','js','react','java','dart']},
 {rx:.40,ry:.30,tilt:34,sp:-.18,s:56,l:['csharp','cpp','firebase','figma','vstudio']},
 {rx:.49,ry:.10,tilt:62,sp:.14,s:50,l:['mysql','postgresql','sql','oracle']}
];
const stage=$('#stage'),orbs=[];
rings.forEach((r,ri)=>r.l.forEach((n,i)=>{
  const d=document.createElement('div');d.className='orb';d.style.setProperty('--s',r.s+'px');
  d.innerHTML=`<img src="${L(n)}" alt="${n}" loading="lazy">`;stage.appendChild(d);
  orbs.push({d,r,a:i/r.l.length*Math.PI*2});
}));
let mx=0,my=0,tx=0,ty=0,t0=performance.now();
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;
  const c=$('#cursor');c.style.left=e.clientX+'px';c.style.top=e.clientY+'px'});
function orbit(now){
  const dt=(now-t0)/1000;t0=now;tx+=(mx-tx)*.06;ty+=(my-ty)*.06;
  const W=stage.clientWidth;
  orbs.forEach(o=>{
    const {r}=o;o.a+=r.sp*dt;
    const x=Math.cos(o.a)*r.rx*W,y=Math.sin(o.a)*r.ry*W,z=Math.sin(o.a);
    const th=r.tilt*Math.PI/180,X=x*Math.cos(th)-y*Math.sin(th),Y=x*Math.sin(th)+y*Math.cos(th);
    const sc=.72+.38*(z+1)/2;
    o.d.style.transform=`translate3d(${X+tx*40*z}px,${Y+ty*40*z}px,0) scale(${sc})`;
    o.d.style.zIndex=z>0?8:2;o.d.style.opacity=.55+.45*(z+1)/2;
  });
  stage.style.transform=`rotateY(${tx*14}deg) rotateX(${-ty*14}deg)`;
  requestAnimationFrame(orbit);
}
if(!reduce)requestAnimationFrame(orbit);else orbs.forEach(o=>o.d.style.transform=`translate(${Math.cos(o.a)*o.r.rx*300}px,${Math.sin(o.a)*o.r.ry*300}px)`);

// Marquees
const all=rings.flatMap(r=>r.l);
$$('.track').forEach((t,k)=>{
  const list=k?all.slice().reverse():all;
  t.innerHTML=[...list,...list].map(n=>`<div class="orb"><img src="${L(n)}" alt="${n}" loading="lazy"></div>`).join('');
});

// Particles
const cv=$('#bg'),cx=cv.getContext('2d');let P=[];
function rs(){cv.width=innerWidth;cv.height=innerHeight;P=Array.from({length:Math.min(90,innerWidth/14|0)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,v:.15+Math.random()*.4,r:Math.random()*1.8+.4}))}
rs();addEventListener('resize',rs);
(function pf(){cx.clearRect(0,0,cv.width,cv.height);
  P.forEach(p=>{p.y-=p.v;if(p.y<0)p.y=cv.height;cx.beginPath();cx.arc(p.x+mx*-30*p.r,p.y,p.r,0,7);cx.fillStyle='rgba(34,211,238,.55)';cx.fill()});
  if(!reduce)requestAnimationFrame(pf)})();

// Typing roles
const roles=['Développeur Full Stack','Technicien informatique','Créateur d\'applications mobiles','Monteur vidéo & créatif IA'];
let ri=0,ci=0,del=false;const re=$('#role');
(function ty(){const w=roles[ri];re.textContent=w.slice(0,ci);
  if(!del&&ci===w.length){del=true;return setTimeout(ty,1600)}
  if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
  ci+=del?-1:1;setTimeout(ty,del?35:70)})();

// Nav + progress
addEventListener('scroll',()=>{$('#nav').classList.toggle('sc',scrollY>40);
  $('#bar').style.transform=`scaleX(${scrollY/(document.body.scrollHeight-innerHeight)})`},{passive:true});

// GSAP
function start(){
  if(!window.gsap||reduce){$('#loader').remove();return}
  gsap.registerPlugin(ScrollTrigger);
  const tl=gsap.timeline();
  tl.to('#loader',{yPercent:-100,duration:.9,ease:'power4.inOut',delay:1})
    .from('h1 .line>span',{yPercent:110,rotate:4,duration:1,stagger:.15,ease:'power4.out'},'-=.3')
    .from('.hero-text>*:not(h1)',{y:30,opacity:0,stagger:.1,duration:.8},'-=.6')
    .from('.portrait',{scale:0,duration:1.2,ease:'elastic.out(1,.6)'},'-=1.2')
    .from('.orb',{scale:0,opacity:0,stagger:.04,duration:.7,ease:'back.out(2)'},'-=.8')
    .add(()=>$('#loader').remove());
  $$('.rv').forEach(e=>gsap.from(e,{y:60,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:e,start:'top 88%'}}));
  $$('[data-speed]').forEach(e=>gsap.to(e,{yPercent:e.dataset.speed*100,ease:'none',scrollTrigger:{trigger:e.parentElement,scrub:true}}));
  $$('.stats b').forEach(b=>{const o={v:0};gsap.to(o,{v:+b.dataset.n,duration:2,ease:'power2.out',onUpdate:()=>b.textContent=Math.round(o.v)+(b.dataset.n>=20?'+':''),scrollTrigger:{trigger:b,start:'top 90%'}})});
  $$('.track').forEach(t=>{const d=+t.dataset.dir;gsap.fromTo(t,{x:d<0?0:-t.scrollWidth/2},{x:d<0?-t.scrollWidth/2:0,ease:'none',scrollTrigger:{trigger:'#competences',start:'top bottom',end:'bottom top',scrub:1}})});
  gsap.to('.hero-text',{y:-120,opacity:.2,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.stage',{y:90,scale:.85,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  $$('.proj').forEach(p=>{gsap.from($('.video',p),{x:p.classList.contains('rev')?120:-120,opacity:0,rotateY:p.classList.contains('rev')?-12:12,duration:1.2,scrollTrigger:{trigger:p,start:'top 80%'}});
    gsap.from($('.info',p),{y:60,opacity:0,duration:1,scrollTrigger:{trigger:p,start:'top 75%'}})});
  $$('.step').forEach(s=>gsap.from(s,{x:-60,opacity:0,scrollTrigger:{trigger:s,start:'top 88%'}}));
  $$('.cols>div').forEach((c,i)=>gsap.from(c,{y:50,opacity:0,delay:i*.07,scrollTrigger:{trigger:c,start:'top 92%'}}));
  gsap.matchMedia().add('(min-width:901px)',()=>{
    const tr=$('.h-track');
    gsap.to(tr,{x:()=>-(tr.scrollWidth-innerWidth),ease:'none',scrollTrigger:{trigger:'.h-wrap',pin:true,scrub:1,end:()=>'+='+(tr.scrollWidth-innerWidth),invalidateOnRefresh:true}});
    $$('.card img').forEach(i=>gsap.fromTo(i,{scale:1.25},{scale:1,scrollTrigger:{trigger:i,containerAnimation:null,start:'top bottom',scrub:true}}));
  });
  // Lecture vidéo au scroll
  const v=$('.proj video');ScrollTrigger.create({trigger:v,start:'top 60%',end:'bottom 20%',onEnter:()=>v.play().catch(()=>{}),onLeave:()=>v.pause(),onEnterBack:()=>v.play().catch(()=>{}),onLeaveBack:()=>v.pause()});
  // Effet magnétique
  $$('.btn,.socials a,.cta').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.4,duration:.3})});b.addEventListener('pointerleave',()=>gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}))});
}
addEventListener('load',start);
setTimeout(()=>{const l=$('#loader');l&&!window.gsap&&l.remove()},4000);
})();
