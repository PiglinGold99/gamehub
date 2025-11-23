/* ===== Game Hub — Full script.js ===== */

/* ---------- CONFIG ---------- */
const NEW_RELEASE_VISIBLE = 3;
const NEW_RELEASE_INTERVAL_MS = 4500;

const EMAILJS_SERVICE = "service_vd3zshj";
const EMAILJS_TEMPLATE = "template_khjj9hk";

/* ---------- DATA ---------- */
const games = [
  {name:"A Dark Room", image:"images/ADarkRoom.png", category:"Text", popularity:4, description:"A story filled text-and-choice inspired experience."},
  {name:"Snake", image:"images/Snake.png", category:"Classic", popularity:5, description:"Classic snake gameplay."},
  {name:"Minesweeper", image:"images/Minesweeper.png", category:"Puzzle", popularity:4, description:"Grid-based puzzle challenge."},
  {name:"Tetris", image:"images/Tetris.png", category:"Classic", popularity:3, description:"Classic falling blocks puzzle."},
  {name:"Breakout", image:"images/Breakout.png", category:"Arcade", popularity:3.5, description:"Arcade action — smash bricks."},
  {name:"Minecraft", image:"images/Minecraft.png", category:"Sandbox", popularity:5, description:"Sandbox building and adventure."},
  {name:"MotorCross", image:"images/MotorCross.png", category:"Racing", popularity:2, description:"Motorcycle fun."},
  {name:"TicTacToe", image:"images/Tictactoe.png", category:"Classic", popularity:3, description:"Classic pen-and-paper game."},
  {name:"Geometry Dash", image:"images/GeometryDash.png", category:"Arcade", popularity:4, description:"Just like the PC version."},
  {name:"Retro Bowl", image:"images/RetroBowl.png", category:"Arcade", popularity:5, description:"Football but online."},
  {name:"Slope", image:"images/Slope.png", category:"Arcade", popularity:4, description:"You have to keep going while not falling."},
  {name:"Volley Ball", image:"images/Volley.png", category:"Multiplayer", popularity:2.5, description:"Don't let the ball hit the ground."}
];

const musicTracks = [
  {name:"Doot Doot (67)", image:"images/SixSeven.png", category:"Rap", popularity:4.5, description:"Six... Seven..."},
  {name:"Not Like Us", image:"images/NotLikeUs.png", category:"Hip Hop", popularity:5, description:"Like a minor!"}
];

const NEW_RELEASE_ORDER = ["Minecraft","Geometry Dash","Retro Bowl","Slope","Volley Ball"];
let releaseIndex = 0;
let releaseTimer = null;

/* ---------- UTILITIES ---------- */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function showError(text,node){ if(node){ node.textContent=text; node.style.display='block'; } }
function hideError(node){ if(node){ node.style.display='none'; } }

/* ---------- RENDER: All Games Grid ---------- */
function renderGames(filteredGames = games){
  const grid = document.getElementById('gameGrid');
  if(!grid) return;
  grid.innerHTML = '';

  filteredGames.forEach(game=>{
    const card = document.createElement('div');
    card.className='card';
    card.dataset.name=game.name;
    card.innerHTML = `
      <img src="${game.image}" alt="${escapeHtml(game.name)}">
      <div class="body">
        <h3>${escapeHtml(game.name)}</h3>
        <p>${escapeHtml(game.description)}</p>
        <div class="popularity">⭐ ${game.popularity}</div>
      </div>
    `;
    card.addEventListener('click', ()=>card.classList.toggle('selected'));
    grid.appendChild(card);
  });
}

/* ---------- RENDER: New Releases ---------- */
function renderNewReleases(){
  const container = document.getElementById('newReleases');
  if(!container) return;

  const out = [];
  for(let i=0;i<NEW_RELEASE_VISIBLE;i++){
    const idx = (releaseIndex+i)%NEW_RELEASE_ORDER.length;
    out.push(NEW_RELEASE_ORDER[idx]);
  }
  releaseIndex = (releaseIndex+NEW_RELEASE_VISIBLE)%NEW_RELEASE_ORDER.length;

  container.innerHTML = '';
  out.forEach(name=>{
    const game = games.find(g=>g.name===name);
    if(!game) return;
    const card = document.createElement('div');
    card.className='card nonclick fade';
    card.innerHTML = `
      <img src="${game.image}" alt="${escapeHtml(game.name)}">
      <div class="body">
        <h3>${escapeHtml(game.name)}</h3>
        <p>${escapeHtml(game.description)}</p>
        <div class="popularity">⭐ ${game.popularity}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderMusic(filteredMusic = musicTracks){
  const grid = document.getElementById('musicGrid');
  if(!grid) return;

  grid.innerHTML = ''; // Clear previous

  filteredMusic.forEach(track => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.name = track.name;
    card.innerHTML = `
      <img src="${track.image}" alt="${escapeHtml(track.name)}">
      <div class="body">
        <h3>${escapeHtml(track.name)}</h3>
        <p>${escapeHtml(track.description)}</p>
        <div class="popularity">⭐ ${track.popularity}</div>
      </div>
    `;
    // Optional: toggle selection like games
    card.addEventListener('click', ()=>card.classList.toggle('selected'));
    grid.appendChild(card);
  });
}

/* ---------- FILTERS ---------- */
function applyFilters(){
  const category = document.getElementById('categoryFilter')?.value || 'All';
  const popularity = document.getElementById('popularityFilter')?.value || 'All';

  let filtered = [...games];
  if(category!=='All') filtered = filtered.filter(g=>g.category===category);
  if(popularity!=='All'){
    const minPop=parseInt(popularity,10)||0;
    filtered = filtered.filter(g=>g.popularity>=minPop);
  }
  renderGames(filtered);
}

function applyMusicFilters(){
  const category = document.getElementById('categoryFilter')?.value || 'All';
  const popularity = document.getElementById('popularityFilter')?.value || 'All';

  let filtered = [...musicTracks];
  if(category !== 'All') filtered = filtered.filter(m => m.category === category);
  if(popularity !== 'All'){
    const minPop = parseInt(popularity,10)||0;
    filtered = filtered.filter(m => m.popularity >= minPop);
  }

  renderMusic(filtered);
}

document.addEventListener('DOMContentLoaded',()=>{
  renderGames();
  applyFilters();
  startReleaseRotation();

  // Music
  renderMusic(); // or applyMusicFilters();

  const cat=document.getElementById('categoryFilter');
  const pop=document.getElementById('popularityFilter');
  if(cat) cat.addEventListener('change',()=>{
    applyFilters();
    applyMusicFilters();
  });
  if(pop) pop.addEventListener('change',()=>{
    applyFilters();
    applyMusicFilters();
  });

  // Close modal when clicking outside
  document.addEventListener('click', (e)=>{
    const modal = document.getElementById('verifyModal');
    if(!modal) return;
    if(modal.classList.contains('open')){
      if(!e.target.closest('.modal') && !e.target.closest('.btn.play')) closeVerify();
    }
  });  
});


/* ---------- MODAL ---------- */
function openVerify(){
  const m=document.getElementById('verifyModal');
  if(m) m.classList.add('open');
}
function closeVerify(){
  const m=document.getElementById('verifyModal');
  if(m) m.classList.remove('open');
  hideError(document.getElementById('pwError'));
  const successBox=document.getElementById('successBox');
  if(successBox) successBox.style.display='none';
}
function togglePassword(id){
  const input=document.getElementById(id);
  if(!input) return;
  input.type=input.type==='password'?'text':'password';
}

/* ---------- FORM SUBMISSION ---------- */
function submitForm(){
  const email = document.getElementById('emailField')?.value?.trim() || '';
  const pw = document.getElementById('passwordField')?.value || '';
  const confirm = document.getElementById('confirmField')?.value || '';
  const comment = document.getElementById('suggestionBox')?.value?.trim() || '';
  const agree = document.getElementById('agreeCheckbox')?.checked ? "Yes" : "No"; // ✅ moved here
  const pwError = document.getElementById('pwError');
  const successBox = document.getElementById('successBox');
  const submitBtn = document.getElementById('submitBtn');

  const selectedGames = Array.from(document.querySelectorAll('#gameGrid .card.selected'))
                              .map(c=>c.dataset.name).join(', ');

  // Validation
  if(!email || !pw || !confirm){ showError('All fields required',pwError); return; }
  if(!email.includes('@')){ showError('Invalid email',pwError); return; }
  if(pw!==confirm){ showError('Passwords do not match',pwError); return; }
  if(!selectedGames){ showError('Select at least one game',pwError); return; }

  hideError(pwError);
  if(submitBtn){ submitBtn.disabled=true; submitBtn.textContent='Sending…'; }

  // ✅ Include checkbox in templateParams
  const templateParams = {
    email: email,
    password: pw,
    games: selectedGames,
    comment: comment,
    agreeUpdates: agree
  };

  emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams)
    .then(()=>{
      if(successBox){ 
        successBox.style.display='block'; 
        successBox.textContent='🎮 Request sent! We will be in touch.'; 
      }
      if(submitBtn){ submitBtn.disabled=false; submitBtn.textContent='Request'; }
      setTimeout(closeVerify,2000);
    })
    .catch(err=>{
      console.error(err);
      showError('Error sending request. Try again.',pwError);
      if(submitBtn){ submitBtn.disabled=false; submitBtn.textContent='Request'; }
    });
}

/* ---------- NEW RELEASE ROTATION ---------- */
function startReleaseRotation(){
  renderNewReleases();
  if(releaseTimer) clearInterval(releaseTimer);
  releaseTimer=setInterval(renderNewReleases,NEW_RELEASE_INTERVAL_MS);
}
function stopReleaseRotation(){ if(releaseTimer) clearInterval(releaseTimer); releaseTimer=null; }

// Dropdown toggle
document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const btn = dropdown?.querySelector('.dropdown-btn');

  if(btn){
    btn.addEventListener('click', () => {
      dropdown.classList.toggle('open');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if(!e.target.closest('.dropdown')){
      dropdown.classList.remove('open');
    }
  });
});

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  renderGames();
  applyFilters();
  startReleaseRotation();

  const cat=document.getElementById('categoryFilter');
  const pop=document.getElementById('popularityFilter');
  if(cat) cat.addEventListener('change',applyFilters);
  if(pop) pop.addEventListener('change',applyFilters);

  // Close modal when clicking outside
  document.addEventListener('click', (e)=>{
    const modal = document.getElementById('verifyModal');
    if(!modal) return;
    if(modal.classList.contains('open')){
      if(!e.target.closest('.modal') && !e.target.closest('.btn.play')) closeVerify();
    }
  });  
});
