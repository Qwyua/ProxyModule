// ==UserScript==
// @name         Proxy Module
// @version      betatest-1.1
// @description  -
// @match        *://*/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

// ****** BU USERSCRIPTI KULLANMAYINIZ ******

// betatest surumu
// bundan onceki surumun yayinlanmamasinin sebebi karmasik yapisi ve cok fazla manuel islem gerektirmesiydi
// bu surumde tum islemler yari otomatik olarak yapilacak ve kullaniciya yalnizca proxy secme opsiyonu sunulacak
// croxyproxy sunuculari uzerinden yapilan baglantida cookie bilgileri de gidecegi icin onemli sitelerde kullanilmamasi tavsiye edilir


// ================================================================================
// sistemi yari otomatikten tam otomatik yapma karari aldim
// sebebi ise kullanici betigin gm_xlhttprequest fonksiyonunu kullanarak manuel olarak onaylamasi gerekiyor
// kullanici eger bu islemi onaylamaz veya bir daha sorma(surekli reddet) gibi bir secenek secerse sistem calismaz ve scriptin silinmesi gerekir
// bu yuzden sistemi tam otomatik yapma karari aldim
// kullaniciya yalnizca script gelistiricisinin sundugu acma/kapama - checkbox gibi islem ile etkinlestirme/devre disi birakma opsiyonu sunulacak
// kullanici istedigi zaman proxy modunu acabilecek veya kapatabilecek
// ================================================================================


// bu surumde calisma yontemini buyuk ihtimalle goremeyeceksiniz fakat tam surumde calisan site eger websocket baglantisi kurmaya calisir ve proxymode etkinse
// baglanti tamamen proxy uzerinden yapilir
// baglanti hizi genel olarak idealdir
const[GM_onMessage,GM_sendMessage,observer]=[
    (k,c)=>GM_addValueChangeListener('ProxyMode',(_,__,o)=>o[k]!==undefined&&c(...o[k])),
    (k,...d)=>GM_setValue('ProxyMode',{...GM_getValue('ProxyMode',{}),[k]:d}),
    (s,c)=>{const o=new MutationObserver(()=>{const e=document.querySelector(s);e&&(c(e),o.disconnect())});o.observe(document.body,{childList:1,subtree:1})}
]
document.URL.includes("/__cpi")&&window.self!==window.top&&(console.log("__cpi bulundu")|GM_sendMessage('iframe-msg','success', location.href));
document.URL.includes("pr0xy")&&window.self!==window.top&&GM_getValue('ProxyMode.secretkey')==location.href.split('?')[1]&&setTimeout(()=>{GM_sendMessage('iframe-msg','tryagain')},3000)|sessionStorage.setItem("proxyid",location.href.split("proxyid=")[1])|document.querySelector('.fa.fa-arrow-right')?.dispatchEvent(new MouseEvent("click",{bubbles:true,button:0}))
document.URL.includes("/servers")&&window.self!==window.top&&observer('input[name=proxyServerId]',e=>{e.value=sessionStorage.proxyid;e.parentElement.submit()})
document.URL.includes("/requests?fso=")&&window.self!==window.top&&(console.log("HATA bulundu")|GM_sendMessage('iframe-msg','error'));

if (window.self !== window.top) return; // sadece belirli bir url de calismasi icin ek onlem alinacak 
// google.com, youtube.com, facebook.com, instagram.com, whatsapp.com, x.com, twitter.com, tiktok.com, linkedin.com, reddit.com, wechat.com, telegram.org, snapchat.com, pinterest.com, netflix.com, spotify.com, amazon.com, ebay.com, twitch.tv, discord.com, baidu.com
// bu gibi sitelerde script asla calismayacak - ornekler cogaltilabilir
// kritik sitelerde calismamasinin sebebi tamamen yapilan baglantida mevcut siteye ait cookie bilgileri de gidebilecegi icindir
// bu sebepten herhangi bir onemli bir sitede kullanilmamasi gerekir.


class Overlay{
    id='tm-loading';styleInjected=!1;
    css=`:root{--overlay-bg:rgba(0,0,0,.65);--text:#fff;--blur:8px}#tm-loading{position:fixed;inset:0;z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--overlay-bg);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur))}#tm-spin{display:flex;gap:6px;margin-bottom:16px}#tm-spin div{width:12px;height:12px;border-radius:50%;background:var(--text);animation:tm-pulse 1s infinite alternate}#tm-spin div:nth-child(2){animation-delay:.2s}#tm-spin div:nth-child(3){animation-delay:.4s}@keyframes tm-pulse{0%{transform:scale(0.5);opacity:0.3}100%{transform:scale(1);opacity:1}}#tm-text{font:600 18px/1.4 system-ui;color:var(--text);text-align:center;max-width:90%}#tm-gh{position:fixed;left:10px;bottom:10px;background:rgba(0,0,0,.55);color:#fff;padding:6px 8px;border-radius:6px;font:12px system-ui;text-decoration:none;z-index:10000000}@media(max-width:600px){#tm-spin div{width:10px;height:10px}#tm-text{font-size:16px}}`;
    themes={dark:{"--overlay-bg":"rgba(0,0,0,.7)","--text":"#fff","--blur":"6px"},blur:{"--overlay-bg":"rgba(255,255,255,.1)","--text":"#111","--blur":"18px"},opaque:{"--overlay-bg":"rgba(0,0,0,.9)","--text":"#fff","--blur":"0"}};
    el=(t,a={})=>Object.assign(document.createElement(t),a);
    inject=()=>this.styleInjected||(document.head.append(this.el('style',{textContent:this.css,id:'tm-style'})),this.styleInjected=!0);
    build=t=>{const o=this.el('div',{id:this.id,role:'dialog','aria-modal':'true'}),s=this.el('div',{id:'tm-spin'});s.append(this.el('div'),this.el('div'),this.el('div'));return o.append(s,this.el('div',{id:'tm-text',textContent:t})),o};
    open=(t='Yukleniyor...',th='dark',o={})=>{if(document.getElementById(this.id))return;this.inject();document.body.appendChild(this.build(t));this.setText(t);this.setTheme(th,o);document.body.appendChild(document.getElementById('tm-gh')||this.el('a',{id:'tm-gh',href:'https://github.com/',target:'_blank',textContent:'GitHub'}))};
    close=()=>{document.getElementById(this.id)?.remove();document.getElementById('tm-gh')?.remove()};
    setText=t=>document.getElementById('tm-text')&&(document.getElementById('tm-text').textContent=t);
    setTheme=(n='dark',o={})=>Object.entries({...this.themes[n]??this.themes.dark,...o}).forEach(([k,v])=>document.documentElement.style.setProperty(k,v));
}

const API=new Overlay;
window.TMLoadingOverlay={open:(...a)=>API.open(...a),close:()=>API.close(),setText:t=>API.setText(t),setTheme:(...a)=>API.setTheme(...a)};


class ProxyModule {
    ProxyMode = GM_getValue('ProxyMode');
    genereteSecretKey=(r='',n=1,l=23,c='abcdef1230456789')=>[...Array(n)].map(_=>{let p=Math.random()*(l-r.length+1)|0;return[...Array(l)].map((_,i)=>i>=p&&i<p+r.length?r[i-p]:c[Math.random()*c.length|0]).join('')})[0]
    saveCookieTimestamp=()=>GM_setValue("ProxyMode",this.ProxyMode={...this.ProxyMode,cookieTimestamp:Math.floor(Date.now()/6e4)});
    isCookieExpired=minutes=>this.ProxyMode?.cookieTimestamp?Math.floor(Date.now()/6e4)-this.ProxyMode.cookieTimestamp>minutes:!1;
    getSuitableProxy = m => {
     const list = this.ProxyMode.ProxyList;
     if (m === 'rand') return list.filter(p => p.permissions?.trusted !== false).sort(() => Math.random() - 0.5)[0] || null;
     if (this.ProxyMode.selectedProxyIP) return list.find(p => p.ip === this.ProxyMode.selectedProxyIP) || null;
     const trustedTrueList = list.filter(p => p.permissions?.trusted === true);
     return trustedTrueList.length 
         ? trustedTrueList[(this.lastTrustedIndex = (this.lastTrustedIndex + 1 || 0) % trustedTrueList.length)]
         : list.filter(p => p.permissions?.trusted !== false).sort(() => Math.random() - 0.5)[0] || null;
     };
    faa=u=>new Promise((r,j)=>GM_xmlhttpRequest({m:"GET",url:u,onload:({responseHeaders:h})=>r(Array.from((h||"").matchAll(/set-cookie:\s*(.+)/gi),x=>x[1].trim())),onerror:j,ontimeout:_=>j(Error("t"))}));

    constructor() {
        !this.ProxyMode?TMLoadingOverlay.open("Proxy Module Starting...",'dark')|this.init().then(()=>{console.log('After init:',this.ProxyMode);TMLoadingOverlay.close()}):console.log('Already loaded:',this.ProxyMode);
        this.ProxyMode?.runProxy&&this.runProxy();
    }
    runProxy() {
        TMLoadingOverlay.open("Proxy Conneting",'dark')
        !this.isCookieExpired(60)&&this.connectProxy();
        this.isCookieExpired(60)&&!this.isCookieExpired(180)&&(this.connectProxy(),this.getProxyCookie());
        (!this.ProxyMode.cookieTimestamp||this.isCookieExpired(180))&&this.getProxyCookie();
    }
    connectProxy() {
        console.log("Connecting Proxy...")
    }


    getProxyCookie(xxx='',yyy=0) {
        (yyy < 3) && !document.querySelector('[id=proxy-iframe]')&& (() => {
            TMLoadingOverlay.setText(yyy!=0??`(${yyy})`+"Getting Proxy Cookie...");
            let secretkey = this.genereteSecretKey('pr0xy');
            let suitableProxy = this.getSuitableProxy(xxx);
            let trusted = 'trusted' in suitableProxy.permissions;
            GM_setValue("ProxyMode.secretkey",secretkey)
            const iframe = Object.assign(document.createElement('iframe'),{
                id: 'proxy-iframe',
                style: 'z-index:9999;position:fixed;bottom:10px;right:10px;width:300px;height:200px;border:1px solid rgba(255,255,255,.1);border-radius:8px;box-shadow:0 10px 30px rgba(2,6,23,.7);',
                src: `https://croxyproxy.com/?${secretkey}?proxyid=${suitableProxy.id}`
            });
            document.body.appendChild(iframe);
            GM_onMessage('iframe-msg', async (status, url) => {
                console.log('Received message from iframe:', status, url);
                if (status === 'success') {
TMLoadingOverlay.setText("Received(1/3)...");
iframe.remove();
let attempts = 0;
const maxAttempts = 3;

while (attempts < maxAttempts) {
  attempts++;
  try {
    const start = performance.now();
    const cookies = await this.faa(url);
    const end = performance.now();
    console.log(`Fonksiyon ${end - start} ms surdu`);

    const cpc = cookies.find(c => c.startsWith("__cpc="))?.match(/^__cpc=([^;]+)/)?.[1];
    if (!cpc) {
      console.log(`__cpc bulunamadi, tekrar dene (${attempts}/${maxAttempts})`);
      continue;
    }

    const ip = new URL(url).hostname;
    console.log("cpc bulundu:", cpc, ip);

    if (end - start < 2000) {
      // trusted:true
      GM_setValue("ProxyMode", this.ProxyMode = {
        ...this.ProxyMode,
        ProxyList: this.ProxyMode.ProxyList.map(p =>
          p.ip === ip ? { ...p, permissions: { ...p.permissions, trusted: true } } : p
        )
      });
      document.cookie = `__cpc=${cpc};`;
      this.saveCookieTimestamp();
      TMLoadingOverlay.setText("Proxy Connected!");
      setTimeout(() => TMLoadingOverlay.close(), 2000);
      console.log("Proxy connected with __cpc:", cpc);
      break;
    } else {
      console.log("Response too fast, possible error, retrying...");
      TMLoadingOverlay.setText("Response too fast, possible error, retrying...");
    }

  } catch (err) {
    console.log(`Request failed, retrying... (${attempts}/${maxAttempts})`);
    console.error(`Request failed (${attempts}):`, err);

    // direkt trusted:false + blacklist + baska proxy
    GM_setValue("ProxyMode", this.ProxyMode = {
      ...this.ProxyMode,
      ProxyList: this.ProxyMode.ProxyList.map(p =>
        p.id === suitableProxy.id ? { ...p, permissions: { ...p.permissions, trusted: false } } : p
      ),
      blacklist: [...(this.ProxyMode.blacklist ?? []), suitableProxy.ip]
    });

    this.getProxyCookie('rand', yyy++);
    break;
  }

  if (attempts === maxAttempts) {
    console.log("3 denemede __cpc bulunamadi!\nBaska bir proxy deneniyor...");
    GM_setValue("ProxyMode", this.ProxyMode = {
      ...this.ProxyMode,
      ProxyList: this.ProxyMode.ProxyList.map(p =>
        p.id === suitableProxy.id ? { ...p, permissions: { ...p.permissions, trusted: false } } : p
      ),
      blacklist: [...(this.ProxyMode.blacklist ?? []), suitableProxy.ip]
    });
    this.getProxyCookie('rand', yyy++);
  }
}


                } else if (status === 'error') {
                    TMLoadingOverlay.setText(trusted ? "Proxy Error! Trying another..." : "Proxy Error! Please choose another proxy server.");
                    iframe.remove();
                    trusted ? this.getProxyCookie() : setTimeout(() => TMLoadingOverlay.close(), 3000);
                } else if (status === 'tryagain') {
                    iframe.remove();
                    this.getProxyCookie();
                }
            });
        })();
        (yyy >= 3) && console.log('Sistemsel bir hata bulundu, lutfen daha sonra deneyiniz. fonksiyondan cikiliyor')|GM_setValue("ProxyMode",this.ProxyMode={...this.ProxyMode,runProxy:!1})|TMLoadingOverlay.setText("System error found, please try again later.")|setTimeout(()=>TMLoadingOverlay.close(),3e3);

    }
    async init() {
        try {
            const json = await (await fetch('https://raw.githubusercontent.com/Qwyua/ProxyModule/main/src/ProxyModuleList.json')).json();
            const q = {
                ProxyList: json?.proxyList?.filter(p => p.active) ?? [],
                runProxy: true,
                blacklist: [],
                cookieTimestamp: null,
                selectedProxyID: '',
                selectedProxyIP: ''
            };
            GM_setValue('ProxyMode', q);
            this.ProxyMode = q;
            console.log('ProxyMode Started.');
            return q;
        } catch (e) {
            console.error('ProxyMode error!', e);
        }
    }
}

new ProxyModule();





