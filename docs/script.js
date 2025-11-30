// ---- CONFIG ----
const SMARTLINK = "https://www.effectivegatecpm.com/x4zrx08hv?key=78f784bfbfb2f9e34830ed390fc0343ad8";
// clé localStorage
const LS_KEY = "pdf_downloads_left";
// durée en secondes pour "visionner la pub" (20s demandé)
const AD_SECONDS = 20;
// fixe les pubs Adsterra (bannières) - intégrées dans HTML des pages

// ---- HELPERS ----
function getLeft(){
  const v = localStorage.getItem(LS_KEY);
  return v ? parseInt(v,10) : 0;
}
function setLeft(n){
  localStorage.setItem(LS_KEY, String(n));
}
function openNewTab(url){
  window.open(url, "_blank");
}

// ---- CORE ----
// appeler pour demander téléchargement d'un urlPDF (chaine complète)
function requestDownload(urlPDF){
  const left = getLeft();
  if(left > 0){
    setLeft(left - 1);
    // téléchargement autorisé immédiatement
    openNewTab(urlPDF);
    showToast(`Téléchargement lancé — téléchargements restants: ${getLeft()}`);
    return;
  }
  // sinon : ouvrir popup pub
  openAdPopup(urlPDF);
}

// affiche petit message non bloquant
function showToast(msg){
  // simple alert si pas d'UI toast
  try{
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.position = "fixed";
    el.style.bottom = "18px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.background = "#111";
    el.style.color = "#fff";
    el.style.padding = "10px 14px";
    el.style.borderRadius = "8px";
    el.style.zIndex = 99999;
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 2500);
  }catch(e){ alert(msg); }
}

// popup ad logic
let popupTarget = "";
function openAdPopup(urlPDF){
  popupTarget = urlPDF;
  const overlay = document.getElementById("ad-overlay");
  const countdownEl = document.getElementById("ad-countdown");
  overlay.style.display = "flex";

  // open smartlink in new tab (ad)
  try{ openNewTab(SMARTLINK); }catch(e){}

  // start countdown AD_SECONDS -> set downloads to 2 then auto-download
  let t = AD_SECONDS;
  countdownEl.textContent = t;
  const timer = setInterval(()=>{
    t--;
    countdownEl.textContent = t;
    if(t <= 0){
      clearInterval(timer);
      // give 2 downloads
      setLeft(2);
      overlay.style.display = "none";
      // start immediate download + decrement
      requestDownload(popupTarget);
    }
  }, 1000);
}

// attach simple generator for lists if used
function makeDownloadButton(url){
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = "Télécharger";
  btn.onclick = ()=> requestDownload(url);
  return btn;
}

// Expose to window for inline onclicks
window.requestDownload = requestDownload;
window.getLeft = getLeft;
