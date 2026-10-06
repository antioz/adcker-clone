// Функции анимаций — дословно из adcker.com (autoptimize js), без прелоадера, barba, swiper, glightbox.
const html=document.querySelector('html');const body=document.querySelector('body');let lenis;
function lenisScroll(){lenis=new Lenis({lerp:0.13,wrapper:document.querySelector('.js-lenis-wrapper'),content:document.querySelector('.js-lenis-content'),});function raf(time){lenis.raf(time);requestAnimationFrame(raf);}
requestAnimationFrame(raf);}
lenisScroll();

function toggleMenu(){let isThrottled=false;document.addEventListener('click',event=>{const self=event.target;const timeOut=1000;if(self.href){const hash=self.href.split('#')[1];if(hash==='contact'){document.querySelector('.js-menu-button').click();setTimeout(()=>{lenis.scrollTo('#end-of-page',{duration:1.5,easing:(t)=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2});},timeOut);}}
if(!self.classList.contains('js-menu-button'))return;event.preventDefault();if(isThrottled)return;isThrottled=true;const menu=document.querySelector('.js-menu');const blocks=document.querySelector('.js-blocks');const footer=document.querySelector('.js-footer-bar');const links=document.querySelectorAll('.js-menu-links');const socialLinks=document.querySelectorAll('.js-menu-social-links');const timeIn=600;const isOpening=!menu.classList.contains('is-open');if(isOpening){openMenu();}else{closeMenu();}
setTimeout(()=>{isThrottled=false;},1000);function openMenu(){lenis.stop();self.classList.add('is-open');menu.classList.add('is-open');if(blocks)blocks.classList.add('is-grayed');if(footer)footer.classList.add('is-grayed');if(socialLinks&&links){setTimeout(()=>{links.forEach(link=>{link.classList.remove('!delay-0');link.classList.remove('!duration-0');link.classList.add('is-visible')});},timeIn);setTimeout(()=>{socialLinks.forEach(link=>link.classList.add('is-visible'));},timeIn*2.1);}}
function closeMenu(){self.classList.remove('is-open');menu.classList.remove('is-open');if(blocks)blocks.classList.remove('is-grayed');if(footer)footer.classList.remove('is-grayed');if(socialLinks&&links){setTimeout(()=>{links.forEach(link=>{link.classList.remove('is-visible')
link.classList.add('!delay-0');link.classList.add('!duration-0');});socialLinks.forEach(link=>link.classList.remove('is-visible'));lenis.start();},timeOut);}}});}
toggleMenu();

function heroWithSlider(){const elements=document.querySelectorAll('.js-hero-lines');if(!elements.length)return;const timeIn=600;const timeOut=1000;const observer=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;openLines(el);observer.unobserve(el);});},{threshold:0});elements.forEach(el=>observer.observe(el));function openLines(element){element.classList.add('is-visible');}}
// Без прелоадера: ждём шрифты, иначе первый кадр — системным шрифтом.
document.fonts.ready.then(()=>{html.style.opacity='1';heroWithSlider();});

function heroWithVideo(){const wrapper=document.querySelector('.js-hero-w-video-video');const thumbnail=document.querySelector('.js-hero-w-video-thumbnail');const spacer=document.querySelector('.js-hero-w-video-spacer');if(!wrapper||!thumbnail||!spacer)return;let maxHeight=(window.innerWidth-30)/(16/9);const initialThumbRect=thumbnail.getBoundingClientRect();const initialThumbWidth=initialThumbRect.width;const initialThumbHeight=initialThumbRect.height;function onScroll(scroll){const clampedScroll=Math.min(Math.max(scroll,0),maxHeight);wrapper.style.height=`${clampedScroll}px`;const progress=clampedScroll/maxHeight;const newThumbWidth=initialThumbWidth*(1-progress*2);const newThumbHeight=initialThumbHeight*(1-progress*2);if(progress==1){wrapper.classList.replace('fixed','relative');spacer.classList.add('hidden');}else{}}
lenis.on('scroll',(e)=>{onScroll(e.scroll);});window.addEventListener('resize',()=>{maxHeight=window.innerWidth/(16/9);});}
heroWithVideo();

function elementAppears(){const isSafari=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);const elements=document.querySelectorAll('.js-element-appears');const childrenElements=document.querySelectorAll('.js-element-appears-children > *');if(!elements.length&&!childrenElements.length)return;function applyBlurEffect(element){const rect=element.getBoundingClientRect();const viewportHeight=window.innerHeight;const maxBlur=2;const blurDistanceBottom=viewportHeight/4;let blurAmount=0;let opacityAmount=1;let translateAmount=0;if(rect.top>viewportHeight-blurDistanceBottom&&rect.top<viewportHeight+rect.height){const progress=1-((rect.top-(viewportHeight-blurDistanceBottom))/blurDistanceBottom);const eased=0.5*(1-Math.cos(Math.PI*progress));blurAmount=maxBlur*(1-progress);opacityAmount=progress;translateAmount=30*(1-eased);}
element.style.opacity=opacityAmount;if(!isSafari){element.style.filter=`blur(${blurAmount}px)`;element.style.transform=`translateY(${translateAmount}px)`;}}
function onScroll(){elements.forEach(applyBlurEffect);childrenElements.forEach(applyBlurEffect);}
onScroll();lenis.on('scroll',onScroll);}
elementAppears();

function itemSiblings(){const items=document.querySelectorAll('.js-item-siblings');items.forEach((item)=>{item.addEventListener('mouseenter',()=>{items.forEach((sibling)=>{if(sibling!==item){sibling.classList.add('is-not-hovered');}});});item.addEventListener('mouseleave',()=>{items.forEach((sibling)=>{sibling.classList.remove('is-not-hovered');});});});}
itemSiblings();

function highlights(){document.addEventListener('click',event=>{const self=event.target;if(self.classList.contains('js-highlight-line')){event.preventDefault();const container=self.closest('.js-highlight');const description=container.querySelector('.js-highlight-description');const isOpen=description.classList.contains('is-open');if(isOpen){const currentHeight=description.scrollHeight;container.classList.remove('is-open');anime({targets:description,height:[currentHeight+'px','0px'],duration:500,easing:'easeInOutCirc',begin:()=>{description.style.overflow='hidden';},complete:()=>{description.classList.remove('is-open');description.style.height='';description.style.overflow='';}});}else{description.style.height='auto';const targetHeight=description.scrollHeight;description.style.height='0px';description.classList.add('is-open');container.classList.add('is-open');anime({targets:description,height:targetHeight+'px',duration:500,easing:'easeInOutCirc',complete:()=>{description.style.height='auto';}});}}});}
highlights();

function mediaFadein(){const mediaElements=document.querySelectorAll('.js-media-fadein');const observer=new IntersectionObserver((entries,obs)=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;if(el.tagName==='IMG'){if(el.complete){requestAnimationFrame(()=>show(el));}else{el.addEventListener('load',()=>show(el),{once:true});}}
else if(el.tagName==='VIDEO'){if(el.readyState>=2){requestAnimationFrame(()=>show(el));}else{el.addEventListener('loadeddata',()=>show(el),{once:true});}}
obs.unobserve(el);});},{threshold:0.1});mediaElements.forEach(el=>observer.observe(el));function show(el){setTimeout(()=>{el.classList.add('is-visible');},300);}}
mediaFadein();

// Вместо прелоадера: шапка появляется так же, как после него.
(function(){const hb=document.querySelector('.js-header-bar');setTimeout(()=>hb.classList.add('is-visible'),250);
document.querySelectorAll('.fake-video.js-media-fadein').forEach(el=>setTimeout(()=>el.classList.add('is-visible'),300));})();