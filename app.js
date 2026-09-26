const RCC_BASE_PATH = (() => {
  const path = window.location.pathname;
  if (path.includes('/rcc/')) return '/rcc/';
  if (path.includes('/RCC/')) return '/RCC/';
  return './';
})();

function pageHref(page){
  return RCC_BASE_PATH === './' ? page : RCC_BASE_PATH + page;
}

function setActive(linkId){
  try { document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active')); } catch(e){}
  const el = document.getElementById(linkId); if(el) el.classList.add('active');
}

function nav(){
  return `
    <header>
      <div class="container hstack nav-wrap">
        <strong>RCC</strong>
        <nav class="hstack" style="margin-left:auto">
          <a id="nav-home" href="${pageHref('index.html')}">Home</a>
          <a id="nav-contacts" href="${pageHref('contacts.html')}">Contacts</a>
          <a id="nav-calendar" href="${pageHref('calendar.html')}">Calendar</a>
          <a id="nav-notes" href="${pageHref('notes.html')}">Notes</a>
          <a id="nav-mail" href="${pageHref('mail.html')}">Gmail</a>
          <a id="nav-daymap" href="${pageHref('daymap.html')}">Daymap</a>
        </nav>
      </div>
    </header>`;
}

function mountNav(activeId){
  document.getElementById('nav-root').innerHTML = nav();
  setActive(activeId);
}

async function rccHash(text){
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function ensureLockScreen(){
  if (document.getElementById('rcc-lock-screen')) return;
  const lock = document.createElement('div');
  lock.id = 'rcc-lock-screen';
  lock.innerHTML = `
    <div class="lock-card vstack">
      <div class="lock-icon">🔒</div>
      <h1>RCC Locked</h1>
      <p id="rcc-lock-message" class="small">Create your RCC password.</p>
      <input id="rcc-password-input" type="password" placeholder="Enter RCC password" autocomplete="current-password" />
      <button type="button" id="rcc-unlock-button">Unlock</button>
      <p class="small">Tip: don’t use your Gmail, GitHub, or school password.</p>
    </div>`;
  document.body.prepend(lock);
}

async function unlockRcc(){
  const input = document.getElementById('rcc-password-input');
  const message = document.getElementById('rcc-lock-message');
  const password = input.value;
  if (!password) {
    message.textContent = 'Enter a password first.';
    return;
  }
  if (password.length < 4) {
    message.textContent = 'Use at least 4 characters.';
    return;
  }

  const savedHash = localStorage.getItem('rccPasswordHash');
  const passwordHash = await rccHash(password);

  if (!savedHash) {
    localStorage.setItem('rccPasswordHash', passwordHash);
    localStorage.setItem('rccUnlocked', 'yes');
    document.getElementById('rcc-lock-screen').style.display = 'none';
    input.value = '';
    return;
  }

  if (passwordHash === savedHash) {
    localStorage.setItem('rccUnlocked', 'yes');
    document.getElementById('rcc-lock-screen').style.display = 'none';
    input.value = '';
  } else {
    message.textContent = 'Wrong password. Try again.';
    input.value = '';
    input.focus();
  }
}

function lockRcc(){
  localStorage.removeItem('rccUnlocked');
  ensureLockScreen();
  document.getElementById('rcc-lock-message').textContent = localStorage.getItem('rccPasswordHash') ? 'Enter your RCC password.' : 'Create your RCC password.';
  document.getElementById('rcc-lock-screen').style.display = 'flex';
  const input = document.getElementById('rcc-password-input');
  input.value = '';
  input.focus();
}

function mountRccLock(){
  ensureLockScreen();
  const hasPassword = localStorage.getItem('rccPasswordHash');
  const unlocked = localStorage.getItem('rccUnlocked') === 'yes';
  document.getElementById('rcc-lock-message').textContent = hasPassword ? 'Enter your RCC password.' : 'Create your RCC password.';
  document.getElementById('rcc-unlock-button').addEventListener('click', unlockRcc);
  document.getElementById('rcc-password-input').addEventListener('keydown', event => {
    if (event.key === 'Enter') unlockRcc();
  });
  document.getElementById('rcc-lock-screen').style.display = hasPassword && unlocked ? 'none' : 'flex';
}

function resetRccPassword(){
  if (!confirm('Reset the RCC password on this device?')) return;
  localStorage.removeItem('rccPasswordHash');
  localStorage.removeItem('rccUnlocked');
  lockRcc();
}

function saveDaymapLink(){
  const input = document.getElementById('daymap-link-input');
  const value = input.value.trim();
  if (!value) return;
  localStorage.setItem('rccDaymapUrl', value);
  updateDaymapButton();
}

function updateDaymapButton(){
  const button = document.getElementById('open-daymap-link');
  const input = document.getElementById('daymap-link-input');
  if (!button || !input) return;
  const saved = localStorage.getItem('rccDaymapUrl') || '';
  input.value = saved;
  button.href = saved || 'https://daymap.net/';
  button.textContent = saved ? 'Open Daymap' : 'Open Daymap search';
}

document.addEventListener('DOMContentLoaded', mountRccLock);
