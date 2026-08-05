(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={FAVORITES:`pokesphere_favorites`,TEAMS:`pokesphere_teams`,PREFERENCES:`pokesphere_preferences`,RECENT_SEARCHES:`pokesphere_recent_searches`};function t(){try{let t=localStorage.getItem(e.FAVORITES);return t?JSON.parse(t):[]}catch(e){return console.error(`Failed to get favorites from storage:`,e),[]}}function n(e){return t().some(t=>String(t.id)===String(e))}function r(r){let i=t();return!n(r.id)&&(i.push({id:r.id,name:r.name,types:r.types,image:r.sprites?.other?.[`official-artwork`]?.front_default||r.sprites?.front_default}),localStorage.setItem(e.FAVORITES,JSON.stringify(i)),!0)}function i(n){let r=t();r=r.filter(e=>String(e.id)!==String(n)),localStorage.setItem(e.FAVORITES,JSON.stringify(r))}function a(){try{let t=localStorage.getItem(e.TEAMS);return t?JSON.parse(t):{}}catch(e){return console.error(`Failed to get teams from storage:`,e),{}}}function o(t,n){let r=a();r[t]=n,localStorage.setItem(e.TEAMS,JSON.stringify(r))}function s(){try{let t=localStorage.getItem(e.RECENT_SEARCHES);return t?JSON.parse(t):[]}catch(e){return console.error(`Failed to get recent searches from storage:`,e),[]}}function c(t){if(!t||typeof t!=`string`)return;let n=t.trim().toLowerCase();if(!n)return;let r=s();r=r.filter(e=>e!==n),r.unshift(n),r.length>5&&r.pop(),localStorage.setItem(e.RECENT_SEARCHES,JSON.stringify(r))}async function l(){try{let[e,t]=await Promise.all([fetch(`/public/partials/header.html`),fetch(`/public/partials/footer.html`)]);if(e.ok){let t=await e.text(),n=document.getElementById(`header-placeholder`);n&&(n.innerHTML=t)}if(t.ok){let e=await t.text(),n=document.getElementById(`footer-placeholder`);n&&(n.innerHTML=e)}u()}catch(e){console.error(`Failed to load HTML partials:`,e)}}function u(){let e=document.getElementById(`nav-toggle`),t=document.getElementById(`main-nav`);e&&t&&e.addEventListener(`click`,()=>{let n=t.classList.toggle(`is-open`);e.setAttribute(`aria-expanded`,String(n))});let n=document.getElementById(`header-search-form`),r=document.getElementById(`header-search-input`);n&&r&&n.addEventListener(`submit`,e=>{e.preventDefault();let n=r.value.trim();n&&(c(n),window.location.hash=`#search?q=${encodeURIComponent(n)}`,r.value=``,t&&t.classList.contains(`is-open`)&&t.classList.remove(`is-open`))})}var d=`https://pokeapi.co/api/v2`,f=new Map;async function p(e){if(f.has(e))return f.get(e);try{let t=await fetch(e);if(!t.ok)throw t.status===404?Error(`Pokémon not found`):Error(`API Error: ${t.status}`);let n=await t.json();return f.set(e,n),n}catch(t){throw console.error(`Fetch failed for URL: ${e}`,t),t}}async function m(e){if(!e)throw Error(`Name or ID is required`);return p(`${d}/pokemon/${String(e).trim().toLowerCase()}`)}async function ee(e){if(!e)throw Error(`ID or Name is required`);return p(`${d}/pokemon-species/${String(e).trim().toLowerCase()}`)}async function te(e){if(!e)throw Error(`Evolution chain URL is required`);return p(e)}async function ne(e=24,t=0){return p(`${d}/pokemon?limit=${e}&offset=${t}`)}async function h(e){return!e||e===`all`?null:(await p(`${d}/type/${e.trim().toLowerCase()}`)).pokemon.map(e=>e.pokemon)}async function re(e){return p(`${d}/pokemon/${String(e).trim().toLowerCase()}/encounters`)}var g={normal:`#A8A878`,fire:`#F08030`,water:`#6890F0`,grass:`#78C850`,electric:`#F8D030`,ice:`#98D8D8`,fighting:`#C03028`,poison:`#A040A0`,ground:`#E0C068`,flying:`#A890F0`,psychic:`#F85888`,bug:`#A8B820`,rock:`#B8A038`,ghost:`#705898`,dragon:`#7038F8`,steel:`#B8B8D0`,fairy:`#EE99AC`,dark:`#705848`},_=Object.keys(g);function v(e){return g[e?e.toLowerCase():`normal`]||`#A8A878`}function y(e){return!e||!Array.isArray(e)?``:e.map(e=>{let t=typeof e==`string`?e:e.type?.name||`normal`;return`<span class="type-badge" style="background-color: ${v(t)}">${t}</span>`}).join(``)}var b=[25,6,94,448,658,384];async function x(){let e=document.getElementById(`featured-pokemon-grid`);if(e){e.innerHTML=b.map(()=>`
    <div class="pokemon-card skeleton-card">
      <div class="skeleton" style="height: 120px; margin-bottom: 0.5rem;"></div>
      <div class="skeleton" style="height: 20px; width: 60%; margin: 0 auto 0.5rem auto;"></div>
      <div class="skeleton" style="height: 15px; width: 40%; margin: 0 auto;"></div>
    </div>
  `).join(``);try{e.innerHTML=(await Promise.all(b.map(e=>m(e)))).map(e=>ie(e)).join(``)}catch(t){console.error(`Error loading featured Pokémon:`,t),e.innerHTML=`<p class="error-msg">Failed to load featured Pokémon. Please try again later.</p>`}}}function ie(e){let t=e.sprites?.other?.[`official-artwork`]?.front_default||e.sprites?.front_default||``,n=`#${String(e.id).padStart(3,`0`)}`;return`
    <article class="pokemon-card" onclick="window.location.hash='#details/${e.id}'" role="button" tabindex="0">
      <span class="pokemon-card__number">${n}</span>
      <div class="pokemon-card__img-container">
        <img src="${t}" alt="${e.name}" class="pokemon-card__img" loading="lazy">
      </div>
      <h3 class="pokemon-card__name">${e.name}</h3>
      <div class="pokemon-card__types">
        ${y(e.types)}
      </div>
    </article>
  `}function S(e,t=`info`,n=3e3){let r=document.getElementById(`toast-container`);if(!r)return;let i=document.createElement(`div`);i.className=`toast toast-${t}`;let a=`ℹ️`;t===`success`&&(a=`✅`),t===`error`&&(a=`⚠️`),i.innerHTML=`
    <span class="toast-icon">${a}</span>
    <span class="toast-message">${ae(e)}</span>
  `,r.appendChild(i),setTimeout(()=>{i.style.opacity=`0`,i.style.transform=`translateY(10px)`,i.style.transition=`all 0.3s ease`,setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},300)},n)}function ae(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var C=24,w=1,T=[],E=0;async function D(e={}){O(),k();let t=document.getElementById(`search-input`),n=document.getElementById(`type-filter`);e.q?(t&&(t.value=e.q),await j(e.q)):e.type?(n&&(n.value=e.type),await M(e.type)):await A(1)}function O(){let e=document.getElementById(`type-filter`);!e||e.children.length>1||_.forEach(t=>{let n=document.createElement(`option`);n.value=t,n.textContent=t.charAt(0).toUpperCase()+t.slice(1),e.appendChild(n)})}function k(){let e=document.getElementById(`search-form`),t=document.getElementById(`type-filter`);e&&(e.onsubmit=async e=>{e.preventDefault();let n=document.getElementById(`search-input`)?.value.trim(),r=t?.value;n?(c(n),await j(n)):r&&r!==`all`?await M(r):await A(1)}),t&&(t.onchange=async()=>{let e=t.value;e===`all`?await A(1):await M(e)})}async function A(e=1){w=e;let t=(e-1)*C,n=document.getElementById(`search-results-grid`),r=document.getElementById(`search-results-count`);N(n);try{let e=await ne(C,t);E=e.count,r&&(r.textContent=`Showing Pokémon ${t+1}–${Math.min(t+C,E)} of ${E}`);let i=e.results.map(e=>m(e.name));T=await Promise.all(i),P(n,T),oe(Math.ceil(E/C))}catch(e){console.error(`Search load error:`,e),n&&(n.innerHTML=`<p class="error-msg">Error fetching Pokémon data. Please check your connection.</p>`)}}async function j(e){let t=document.getElementById(`search-results-grid`),n=document.getElementById(`search-results-count`);N(t);try{T=[await m(e)],E=1,n&&(n.textContent=`Found 1 result for "${e}"`),P(t,T),F()}catch(r){console.error(`Search error for term:`,e,r),n&&(n.textContent=`No Pokémon found matching "${e}"`),t&&(t.innerHTML=`<p class="error-msg">No Pokémon found matching "${e}". Try searching by exact name or Pokédex number.</p>`),F(),S(`No Pokémon found for "${e}"`,`error`)}}async function M(e){let t=document.getElementById(`search-results-grid`),n=document.getElementById(`search-results-count`);N(t);try{let r=await h(e);if(!r||r.length===0){t&&(t.innerHTML=`<p>No Pokémon found for type: ${e}</p>`);return}let i=r.slice(0,30),a=i.map(e=>m(e.name));T=await Promise.all(a),E=r.length,n&&(n.textContent=`Showing ${i.length} of ${E} ${e.toUpperCase()}-type Pokémon`),P(t,T),F()}catch(e){console.error(`Type filter error:`,e),t&&(t.innerHTML=`<p class="error-msg">Error filtering by type.</p>`)}}function N(e){e&&(e.innerHTML=Array(8).fill(0).map(()=>`
    <div class="pokemon-card skeleton-card">
      <div class="skeleton" style="height: 120px; margin-bottom: 0.5rem;"></div>
      <div class="skeleton" style="height: 20px; width: 60%; margin: 0 auto 0.5rem auto;"></div>
      <div class="skeleton" style="height: 15px; width: 40%; margin: 0 auto;"></div>
    </div>
  `).join(``))}function P(e,t){e&&(e.innerHTML=t.map(e=>{let t=e.sprites?.other?.[`official-artwork`]?.front_default||e.sprites?.front_default||``,n=`#${String(e.id).padStart(3,`0`)}`;return`
      <article class="pokemon-card" onclick="window.location.hash='#details/${e.id}'" role="button" tabindex="0">
        <span class="pokemon-card__number">${n}</span>
        <div class="pokemon-card__img-container">
          <img src="${t}" alt="${e.name}" class="pokemon-card__img" loading="lazy">
        </div>
        <h3 class="pokemon-card__name">${e.name}</h3>
        <div class="pokemon-card__types">
          ${y(e.types)}
        </div>
      </article>
    `}).join(``))}function oe(e){let t=document.getElementById(`search-pagination`);if(!t||e<=1){F();return}t.innerHTML=`
    <button class="btn btn-outline" ${w===1?`disabled`:``} id="prev-page-btn">Previous</button>
    <span style="align-self: center; font-weight: 500;">Page ${w} of ${e}</span>
    <button class="btn btn-outline" ${w===e?`disabled`:``} id="next-page-btn">Next</button>
  `,document.getElementById(`prev-page-btn`)?.addEventListener(`click`,()=>{w>1&&A(w-1)}),document.getElementById(`next-page-btn`)?.addEventListener(`click`,()=>{w<e&&A(w+1)})}function F(){let e=document.getElementById(`search-pagination`);e&&(e.innerHTML=``)}async function se(e){let t=document.getElementById(`details-container`);if(t){if(!e){t.innerHTML=`<p class="error-msg">No Pokémon specified. <a href="#search">Search for a Pokémon</a>.</p>`;return}t.innerHTML=`<div class="spinner" aria-label="Loading Pokémon details"></div>`;try{let n=await m(e),r=await ee(n.id).catch(()=>null),i=null;r&&r.evolution_chain?.url&&(i=await te(r.evolution_chain.url).catch(()=>null)),ce(t,n,r,i)}catch(n){console.error(`Error rendering details:`,n),t.innerHTML=`
      <div class="error-card">
        <h2>Pokémon Not Found</h2>
        <p>Could not find details for "${e}".</p>
        <a href="#search" class="btn btn-primary" style="margin-top: 1rem;">Return to Search</a>
      </div>
    `}}}function ce(e,t,a,o){let s=t.sprites?.other?.[`official-artwork`]?.front_default||t.sprites?.front_default||``,c=`#${String(t.id).padStart(3,`0`)}`,l=n(t.id),u=`No description available.`;if(a&&a.flavor_text_entries){let e=a.flavor_text_entries.find(e=>e.language.name===`en`);e&&(u=e.flavor_text.replace(/[\f\n\r]/g,` `))}let d={},f=0;t.stats.forEach(e=>{d[e.stat.name]=e.base_stat,f+=e.base_stat});let p=t.abilities.map(e=>e.ability.name.replace(`-`,` `)+(e.is_hidden?` (Hidden)`:``)).join(`, `);e.innerHTML=`
    <header class="details-header">
      <div class="details-title-group">
        <h1 class="details-name">${t.name}</h1>
        <span class="details-number">${c}</span>
        <div class="details-types">${y(t.types)}</div>
      </div>
      <button id="fav-btn" class="fav-toggle-btn ${l?`is-fav`:``}" aria-label="Toggle favorite">
        ${l?`❤️`:`🤍`}
      </button>
    </header>

    <div class="details-grid">
      <div class="details-left">
        <div class="details-img-card">
          <img src="${s}" alt="${t.name}" class="details-img">
        </div>
        <p class="flavor-text" style="font-style: italic; margin-top: 1rem; color: var(--color-text-muted);">
          "${u}"
        </p>

        <div class="physical-specs" style="margin-top: 1rem; display: flex; gap: 2rem;">
          <div><strong>Height:</strong> ${(t.height/10).toFixed(1)} m</div>
          <div><strong>Weight:</strong> ${(t.weight/10).toFixed(1)} kg</div>
        </div>
        <div style="margin-top: 0.5rem;">
          <strong>Abilities:</strong> <span style="text-transform: capitalize;">${p}</span>
        </div>

        <div style="margin-top: 1.5rem;">
          <a href="#calculator?pokemon=${t.name}" class="btn btn-secondary">Open in Stat Calculator</a>
        </div>
      </div>

      <div class="details-right">
        <h2 style="font-family: var(--font-heading); margin-bottom: 1rem;">Base Stats</h2>
        <div class="base-stats-list">
          ${I(`HP`,d.hp||0,255)}
          ${I(`Attack`,d.attack||0,190)}
          ${I(`Defense`,d.defense||0,230)}
          ${I(`Sp. Atk`,d[`special-attack`]||0,194)}
          ${I(`Sp. Def`,d[`special-defense`]||0,230)}
          ${I(`Speed`,d.speed||0,180)}
          <div class="stat-total" style="font-weight: 700; margin-top: 0.5rem; text-align: right;">
            Total: ${f}
          </div>
        </div>

        ${L(o)}
      </div>
    </div>
  `;let m=document.getElementById(`fav-btn`);m&&(m.onclick=()=>{n(t.id)?(i(t.id),m.classList.remove(`is-fav`),m.innerHTML=`🤍`,S(`Removed ${t.name} from favorites`,`info`)):(r(t),m.classList.add(`is-fav`),m.innerHTML=`❤️`,S(`Added ${t.name} to favorites!`,`success`))})}function I(e,t,n){let r=Math.min(100,Math.round(t/n*100)),i=`var(--color-primary)`;return t<50?i=`#F08030`:t>=100&&(i=`#78C850`),`
    <div class="stat-bar-container">
      <div class="stat-header">
        <span>${e}</span>
        <span>${t}</span>
      </div>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${r}%; background-color: ${i};"></div>
      </div>
    </div>
  `}function L(e){if(!e||!e.chain)return``;let t=[],n=e.chain;for(;n;)t.push({name:n.species.name,id:R(n.species.url)}),n=n.evolves_to&&n.evolves_to.length>0?n.evolves_to[0]:null;return t.length<=1?``:`
    <div class="evolution-section" style="margin-top: 2rem;">
      <h2 style="font-family: var(--font-heading); margin-bottom: 1rem;">Evolution Line</h2>
      <div class="evo-chain-flex" style="display: flex; align-items: center; gap: 1rem; background-color: var(--color-light); padding: 1rem; border-radius: var(--radius-md);">
        ${t.map((e,n)=>`
    <a href="#details/${e.id}" class="evo-step" style="text-align: center; color: var(--color-dark);">
      <div style="font-weight: 700; text-transform: capitalize;">${e.name}</div>
    </a>
    ${n<t.length-1?`<span style="font-size: 1.2rem; color: var(--color-text-muted);">&rarr;</span>`:``}
  `).join(``)}
      </div>
    </div>
  `}function R(e){let t=e.split(`/`).filter(Boolean);return t[t.length-1]}var z={Hardy:{boost:null,lower:null},Lonely:{boost:`attack`,lower:`defense`},Brave:{boost:`attack`,lower:`speed`},Adamant:{boost:`attack`,lower:`special-attack`},Naughty:{boost:`attack`,lower:`special-defense`},Bold:{boost:`defense`,lower:`attack`},Docile:{boost:null,lower:null},Relaxed:{boost:`defense`,lower:`speed`},Impish:{boost:`defense`,lower:`special-attack`},Lax:{boost:`defense`,lower:`special-defense`},Timid:{boost:`speed`,lower:`attack`},Hasty:{boost:`speed`,lower:`defense`},Jolly:{boost:`speed`,lower:`special-attack`},Naive:{boost:`speed`,lower:`special-defense`},Modest:{boost:`special-attack`,lower:`attack`},Mild:{boost:`special-attack`,lower:`defense`},Quiet:{boost:`special-attack`,lower:`speed`},Bashful:{boost:null,lower:null},Rash:{boost:`special-attack`,lower:`special-defense`},Calm:{boost:`special-defense`,lower:`attack`},Gentle:{boost:`special-defense`,lower:`defense`},Sassy:{boost:`special-defense`,lower:`speed`},Careful:{boost:`special-defense`,lower:`special-attack`},Quirky:{boost:null,lower:null}};function B(e,t=31,n=0,r=50,i=``){if(i.toLowerCase()===`shedinja`)return 1;let a=Math.floor(n/4);return Math.floor((2*e+t+a)*r/100)+r+10}function V(e,t,n=31,r=0,i=50,a=`Hardy`){let o=Math.floor(r/4),s=Math.floor((2*t+n+o)*i/100)+5,c=H(a,e);return Math.floor(s*c)}function H(e,t){let n=z[e];if(!n)return 1;let r=t.toLowerCase().replace(/\s+/g,`-`);return n.boost===r?1.1:n.lower===r?.9:1}function U(e,t=50,n=`Hardy`,r={},i={},a=``){let o={};return e.forEach(e=>{let s=e.stat.name,c=e.base_stat,l=r[s]===void 0?31:parseInt(r[s],10),u=i[s]===void 0?0:parseInt(i[s],10);s===`hp`?o[s]=B(c,l,u,t,a):o[s]=V(s,c,l,u,t,n)}),o}var W=null;async function G(e={}){le(),de();let t=e.pokemon||`pikachu`,n=document.getElementById(`calc-pokemon-input`);n&&(n.value=t),await K(t)}function le(){let e=document.getElementById(`calc-nature`);!e||e.children.length>0||Object.keys(z).forEach(t=>{let n=document.createElement(`option`);n.value=t;let r=z[t],i=t;r.boost&&r.lower?i+=` (+${r.boost}, -${r.lower})`:i+=` (Neutral)`,n.textContent=i,e.appendChild(n)})}async function K(e){try{W=await m(e),ue(),q()}catch(t){console.error(`Calculator failed to load Pokémon:`,t),W=null;let n=document.getElementById(`calc-results-output`);n&&(n.innerHTML=`<p class="error-msg">Could not load Pokémon "${e}". Try another name.</p>`)}}function ue(){let e=document.getElementById(`stat-inputs-container`);!e||!W||(e.innerHTML=`
    <div class="stat-row-control" style="font-weight: 700; border-bottom: 2px solid var(--color-border); padding-bottom: 0.4rem;">
      <span>Stat</span>
      <span>Base</span>
      <span>IV (0-31)</span>
      <span>EV (0-252)</span>
    </div>
  `+[`hp`,`attack`,`defense`,`special-attack`,`special-defense`,`speed`].map(e=>{let t=W.stats.find(t=>t.stat.name===e),n=t?t.base_stat:50;return`
      <div class="stat-row-control">
        <label for="iv-${e}" style="text-transform: capitalize;">${e.replace(`-`,` `)}</label>
        <span class="base-val">${n}</span>
        <input type="number" id="iv-${e}" class="form-input iv-input" min="0" max="31" value="31">
        <input type="number" id="ev-${e}" class="form-input ev-input" min="0" max="252" value="0">
      </div>
    `}).join(``),e.querySelectorAll(`input`).forEach(e=>{e.addEventListener(`input`,q)}))}function de(){let e=document.getElementById(`calc-pokemon-input`),t=document.getElementById(`calc-level`),n=document.getElementById(`calc-level-val`),r=document.getElementById(`calc-nature`);e&&(e.onchange=async()=>{e.value.trim()&&await K(e.value.trim())}),t&&(t.oninput=()=>{n&&(n.textContent=t.value),q()}),r&&(r.onchange=q)}function q(){if(!W)return;let e=parseInt(document.getElementById(`calc-level`)?.value||`50`,10),t=document.getElementById(`calc-nature`)?.value||`Hardy`,n={},r={},i=0;[`hp`,`attack`,`defense`,`special-attack`,`special-defense`,`speed`].forEach(e=>{let t=parseInt(document.getElementById(`iv-${e}`)?.value||`31`,10),a=parseInt(document.getElementById(`ev-${e}`)?.value||`0`,10);n[e]=isNaN(t)?31:Math.max(0,Math.min(31,t)),r[e]=isNaN(a)?0:Math.max(0,Math.min(252,a)),i+=r[e]});let a=document.getElementById(`ev-total-display`);a&&(a.textContent=`Total EVs: ${i} / 510`,i>510?a.classList.add(`exceeded`):a.classList.remove(`exceeded`)),fe(U(W.stats,e,t,n,r,W.name),t)}function fe(e,t){let n=document.getElementById(`calc-results-output`);if(!n||!W)return;let r=W.sprites?.other?.[`official-artwork`]?.front_default||W.sprites?.front_default||``,i=Object.keys(e).map(n=>{let r=H(t,n),i=``;return r===1.1&&(i=` <span style="color: var(--color-success); font-weight:700;">(+10%)</span>`),r===.9&&(i=` <span style="color: var(--color-danger); font-weight:700;">(-10%)</span>`),`
      <tr style="border-bottom: 1px solid var(--color-border);">
        <td style="padding: 0.6rem; text-transform: capitalize; font-weight: 500;">${n.replace(`-`,` `)}${i}</td>
        <td style="padding: 0.6rem; text-align: right; font-weight: 700; font-size: 1.1rem; color: var(--color-primary);">${e[n]}</td>
      </tr>
    `}).join(``);n.innerHTML=`
    <div style="text-align: center; margin-bottom: 1rem;">
      <img src="${r}" alt="${W.name}" style="width: 100px; height: 100px; object-fit: contain; margin: 0 auto;">
      <h3 style="text-transform: capitalize; font-family: var(--font-heading);">${W.name}</h3>
    </div>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: var(--color-light); text-align: left;">
          <th style="padding: 0.6rem;">Stat</th>
          <th style="padding: 0.6rem; text-align: right;">Calculated Value</th>
        </tr>
      </thead>
      <tbody>
        ${i}
      </tbody>
    </table>
  `}var J=[,,,,,,].fill(null);function pe(){Y(),X(),me(),Z()}function Y(){let e=document.getElementById(`team-slots-grid`);e&&(e.innerHTML=J.map((e,t)=>e?`
        <div class="team-slot-card filled">
          <button class="slot-remove-btn" onclick="removeSlotPokemon(${t})" aria-label="Remove Pokémon">&times;</button>
          <img src="${e.sprites?.other?.[`official-artwork`]?.front_default||e.sprites?.front_default||``}" alt="${e.name}" style="width: 90px; height: 90px; object-fit: contain; margin-bottom: 0.5rem;">
          <h4 style="text-transform: capitalize; font-family: var(--font-heading); margin-bottom: 0.4rem;">${e.name}</h4>
          <div>${y(e.types)}</div>
        </div>
      `:`
      <div class="team-slot-card">
        <span style="font-size: 2rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">+</span>
        <p style="font-weight: 500; font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--color-text-muted);">Slot ${t+1}</p>
        <div style="width: 100%;">
          <input type="text" class="form-input slot-search-input" data-index="${t}" placeholder="Add Pokémon…" aria-label="Add Pokémon to slot ${t+1}">
        </div>
      </div>
    `).join(``),e.querySelectorAll(`.slot-search-input`).forEach(e=>{e.addEventListener(`change`,async e=>{let t=parseInt(e.target.dataset.index,10),n=e.target.value.trim();if(n)try{let e=await m(n);J[t]=e,Y(),Z()}catch(e){console.error(`Error adding slot Pokémon:`,e),S(`Could not find Pokémon "${n}"`,`error`)}})}))}window.removeSlotPokemon=function(e){J[e]=null,Y(),Z()};function me(){let e=document.getElementById(`save-team-btn`),t=document.getElementById(`clear-team-btn`),n=document.getElementById(`team-name-input`),r=document.getElementById(`saved-teams-select`);e&&(e.onclick=()=>{let e=n?.value.trim()||`My Dream Team`;if(J.filter(Boolean).length===0){S(`Cannot save an empty team. Add at least 1 Pokémon.`,`error`);return}o(e,J),X(),S(`Team "${e}" saved successfully!`,`success`)}),t&&(t.onclick=()=>{J=[,,,,,,].fill(null),Y(),Z(),S(`Team cleared.`,`info`)}),r&&(r.onchange=()=>{let e=r.value;if(!e)return;let t=a();t[e]&&(J=t[e],n&&(n.value=e),Y(),Z(),S(`Loaded team "${e}"`,`info`))})}function X(){let e=document.getElementById(`saved-teams-select`);if(!e)return;let t=a();e.innerHTML=`<option value="">-- Select Saved Team --</option>`+Object.keys(t).map(e=>`<option value="${e}">${e}</option>`).join(``)}function Z(){let e=document.getElementById(`team-analysis-container`);if(!e)return;let t=J.filter(Boolean);if(t.length===0){e.innerHTML=`
      <h2>Team Strength & Weakness Analyzer</h2>
      <p style="color: var(--color-text-muted);">Add Pokémon to your team slots above to see a detailed type coverage & vulnerability analysis.</p>
    `;return}let n={};t.forEach(e=>{e.types.forEach(e=>{let t=e.type.name;n[t]=(n[t]||0)+1})});let r=Object.keys(n).map(e=>`<span class="type-badge" style="background-color: ${v(e)}; margin-right: 0.3rem;">${e} (${n[e]})</span>`).join(``),i=Object.keys(n).length,a=`Needs Diversity`,o=`var(--color-warning)`;i>=5?(a=`Excellent Type Balance!`,o=`var(--color-success)`):i>=3&&(a=`Good Type Diversity`,o=`var(--color-primary)`),e.innerHTML=`
    <h2 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">Team Analysis (${t.length}/6 Pokémon)</h2>
    <div style="margin-bottom: 1rem;">
      <strong>Team Rating:</strong> <span style="color: ${o}; font-weight: 700;">${a}</span>
    </div>
    <div style="margin-bottom: 1rem;">
      <strong>Types Represented:</strong>
      <div style="margin-top: 0.4rem;">${r}</div>
    </div>
    <div style="background-color: var(--color-light); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);">
      <h4 style="font-family: var(--font-heading); margin-bottom: 0.4rem;">Team Summary</h4>
      <p style="font-size: 0.95rem; color: var(--color-text-muted);">
        Your squad has ${t.length} Pokémon representing ${i} unique elemental types. 
        ${i<4?`Consider adding different types to improve defensive coverage against varied opponents.`:`Your team has strong elemental variety.`}
      </p>
    </div>
  `}function he(){Q()}function Q(){let e=document.getElementById(`favorites-grid`);if(!e)return;let n=t();if(n.length===0){e.innerHTML=`
      <div class="empty-favorites" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">💔</span>
        <h2>No Favorite Pokémon Yet</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">Explore the Pokédex and click the ❤️ icon to save your favorite Pokémon here.</p>
        <a href="#search" class="btn btn-primary">Browse Pokédex</a>
      </div>
    `;return}e.innerHTML=n.map(e=>{let t=`#${String(e.id).padStart(3,`0`)}`;return`
      <article class="pokemon-card" style="position: relative;">
        <button class="slot-remove-btn" onclick="removeFavoritePokemon(${e.id})" aria-label="Remove favorite" style="top: 0.5rem; right: 0.5rem;">&times;</button>
        <div onclick="window.location.hash='#details/${e.id}'" style="cursor: pointer;">
          <span class="pokemon-card__number" style="right: 2.2rem;">${t}</span>
          <div class="pokemon-card__img-container">
            <img src="${e.image}" alt="${e.name}" class="pokemon-card__img" loading="lazy">
          </div>
          <h3 class="pokemon-card__name">${e.name}</h3>
          <div class="pokemon-card__types">
            ${y(e.types)}
          </div>
        </div>
      </article>
    `}).join(``)}window.removeFavoritePokemon=function(e){i(e),Q(),S(`Removed from favorites.`,`info`)};async function ge(){_e(),await be()}function _e(){let e=document.getElementById(`location-search-form`),t=document.getElementById(`location-search-input`);e&&(e.onsubmit=async e=>{e.preventDefault();let n=t?.value.trim();n&&await ve(n)})}async function ve(e){let t=document.getElementById(`location-results-container`);if(t){t.innerHTML=`<div class="spinner" aria-label="Searching locations"></div>`;try{let n=await m(e);ye(t,n,await re(n.id))}catch(n){console.error(`Location search error:`,n),t.innerHTML=`
      <div style="background-color: var(--color-card-bg); padding: 1.5rem; border-radius: var(--radius-md); text-align: center;">
        <h3>No Location Data Found</h3>
        <p style="color: var(--color-text-muted);">Could not find wild encounter locations for "${e}". This Pokémon may be an event exclusive, starter, or legend.</p>
      </div>
    `,S(`No locations found for "${e}"`,`error`)}}}function ye(e,t,n){let r=t.sprites?.other?.[`official-artwork`]?.front_default||t.sprites?.front_default||``;if(!n||n.length===0){e.innerHTML=`
      <div style="background-color: var(--color-card-bg); padding: 1.5rem; border-radius: var(--radius-md); text-align: center;">
        <img src="${r}" alt="${t.name}" style="width: 80px; height: 80px; object-fit: contain; margin: 0 auto 0.5rem auto;">
        <h3 style="text-transform: capitalize;">${t.name}</h3>
        <p style="color: var(--color-text-muted);">No wild encounter locations recorded in PokéAPI for this Pokémon (likely acquired via evolution, trade, or gift).</p>
      </div>
    `;return}let i=n.map(e=>`
      <div style="background-color: var(--color-card-bg); padding: 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-left: 4px solid var(--color-primary);">
        <h4 style="text-transform: capitalize; font-family: var(--font-heading); color: var(--color-dark); margin-bottom: 0.4rem;">${e.location_area.name.replace(/-/g,` `)}</h4>
        <div>${e.version_details.map(e=>`<span style="display: inline-block; background-color: var(--color-light); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.8rem; margin: 0.2rem;">${e.version.name.replace(/-/g,` `)} (${Math.max(...e.encounter_details.map(e=>e.chance))}% chance)</span>`).join(` `)}</div>
      </div>
    `).join(``);e.innerHTML=`
    <div style="background-color: var(--color-card-bg); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
        <img src="${r}" alt="${t.name}" style="width: 60px; height: 60px; object-fit: contain;">
        <div>
          <h2 style="text-transform: capitalize; font-family: var(--font-heading);">${t.name} Locations</h2>
          <p style="color: var(--color-text-muted); font-size: 0.9rem;">Found in ${n.length} location areas across games</p>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${i}
      </div>
    </div>
  `}async function be(){let e=document.getElementById(`regions-grid`);if(e)try{let t=await fetch(`/public/json/regions.json`);if(!t.ok)throw Error(`Failed to load regions.json`);e.innerHTML=(await t.json()).map(e=>`
      <div class="region-card" style="border-left-color: ${e.color||`var(--color-primary)`};">
        <h3>${e.name}</h3>
        <div class="region-gen">Generation ${e.generation}</div>
        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">${e.description}</p>
        <div style="font-size: 0.8rem; font-weight: 500;">
          <strong>Games:</strong> ${e.games.join(`, `)}
        </div>
      </div>
    `).join(``)}catch(e){console.error(`Failed loading regions:`,e)}}function xe(){window.addEventListener(`hashchange`,$),$()}async function $(){let[e,t]=(window.location.hash.slice(1)||`home`).split(`?`),n=e.split(`/`),r=n[0]||`home`,i=n[1]||null,a={};if(t){let e=new URLSearchParams(t);for(let[t,n]of e.entries())a[t]=n}switch(document.querySelectorAll(`.route-section`).forEach(e=>e.hidden=!0),Se(r),window.scrollTo({top:0,behavior:`smooth`}),r){case`home`:{let e=document.getElementById(`section-home`);e&&(e.hidden=!1),await x();break}case`search`:{let e=document.getElementById(`section-search`);e&&(e.hidden=!1),await D(a);break}case`details`:{let e=document.getElementById(`section-details`);e&&(e.hidden=!1),await se(i);break}case`calculator`:{let e=document.getElementById(`section-calculator`);e&&(e.hidden=!1),await G(a);break}case`team`:{let e=document.getElementById(`section-team`);e&&(e.hidden=!1),pe();break}case`favorites`:{let e=document.getElementById(`section-favorites`);e&&(e.hidden=!1),he();break}case`locations`:{let e=document.getElementById(`section-locations`);e&&(e.hidden=!1),await ge();break}default:{let e=document.getElementById(`section-home`);e&&(e.hidden=!1),await x();break}}}function Se(e){document.querySelectorAll(`.nav-link`).forEach(t=>{t.dataset.route===e?(t.classList.add(`active`),t.setAttribute(`aria-current`,`page`)):(t.classList.remove(`active`),t.removeAttribute(`aria-current`))})}document.addEventListener(`DOMContentLoaded`,async()=>{await l(),xe()});