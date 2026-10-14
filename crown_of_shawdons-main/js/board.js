/* ============================================
   CROWN OF SHADOWS — board.js
   Dashboard RPG Homepage interactions
   ============================================ */

const HBoard = {

  /* ── Navegação entre seções ── */
  nav(btn, section) {
    // atualiza sidebar
    document.querySelectorAll('.hb-nav-btn').forEach(b => b.classList.remove('hb-active'));
    if (btn) btn.classList.add('hb-active');
    else {
      const match = document.querySelector(`.hb-nav-btn[data-section="${section}"]`);
      if (match) match.classList.add('hb-active');
    }

    // fecha dropdowns
    this._closeAll();

    // troca seção com fade
    const current = document.querySelector('.hb-section.hb-active');
    const next    = document.getElementById('hbs-' + section);
    if (!next || next === current) return;

    if (current) {
      current.style.opacity = '0';
      setTimeout(() => {
        current.classList.remove('hb-active');
        current.style.opacity = '';
        next.classList.add('hb-active');
        // força reflow para animação
        requestAnimationFrame(() => { next.style.opacity = '1'; });
        // partículas no mapa
        if (section === 'mapa') setTimeout(() => MapBoard.spawnParticles(), 200);
      }, 200);
    } else {
      next.classList.add('hb-active');
    }

    // fecha sidebar mobile
    document.getElementById('hb-sidebar').classList.remove('hb-open');
  },

  /* ── Toggle sidebar mobile ── */
  toggleSidebar() {
    document.getElementById('hb-sidebar').classList.toggle('hb-open');
  },

  /* ── Dropdowns ── */
  toggleNotif() {
    const el = document.getElementById('hb-notif-drop');
    const msg = document.getElementById('hb-msg-drop');
    const prof = document.getElementById('hb-profile-drop');
    msg.classList.add('hidden');
    prof.classList.add('hidden');
    el.classList.toggle('hidden');
  },
  toggleMsg() {
    const el = document.getElementById('hb-msg-drop');
    const notif = document.getElementById('hb-notif-drop');
    const prof  = document.getElementById('hb-profile-drop');
    notif.classList.add('hidden');
    prof.classList.add('hidden');
    el.classList.toggle('hidden');
  },
  toggleProfile() {
    const el = document.getElementById('hb-profile-drop');
    const notif = document.getElementById('hb-notif-drop');
    const msg   = document.getElementById('hb-msg-drop');
    notif.classList.add('hidden');
    msg.classList.add('hidden');
    el.classList.toggle('hidden');
  },
  _closeAll() {
    ['hb-notif-drop','hb-msg-drop','hb-profile-drop','hb-search-drop']
      .forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
  },

  /* ── Search ── */
  _searchData: [
    { name: 'Harley',             type: 'Personagem',  section: 'personagens' },
    { name: 'Morgan',             type: 'Personagem',  section: 'personagens' },
    { name: 'Lyria',              type: 'Personagem',  section: 'personagens' },
    { name: 'Mago',               type: 'Classe',      section: 'classes'     },
    { name: 'Guerreiro',          type: 'Classe',      section: 'classes'     },
    { name: 'Ladino',             type: 'Classe',      section: 'classes'     },
    { name: 'Arqueira Sombria',   type: 'Classe',      section: 'classes'     },
    { name: 'Castelo Real',       type: 'Localização', section: 'mapa'        },
    { name: 'Vila de Elden',      type: 'Localização', section: 'mapa'        },
    { name: 'Floresta de Mirval', type: 'Localização', section: 'mapa'        },
    { name: 'Ruínas de Valdor',   type: 'Localização', section: 'mapa'        },
    { name: 'Portal das Trevas',  type: 'Missão',      section: 'missoes'     },
    { name: 'Relíquias Perdidas', type: 'Missão',      section: 'missoes'     },
  ],

  search(val) {
    const drop = document.getElementById('hb-search-drop');
    if (!val.trim()) { drop.classList.add('hidden'); return; }
    const q = val.toLowerCase();
    const results = this._searchData.filter(d => d.name.toLowerCase().includes(q)).slice(0, 6);
    if (!results.length) { drop.classList.add('hidden'); return; }
    drop.innerHTML = results.map(r =>
      `<div class="hb-search-item" onclick="HBoard.nav(null,'${r.section}');document.getElementById('hb-search').value='';document.getElementById('hb-search-drop').classList.add('hidden')">
        <span class="hb-search-item-name">${r.name}</span>
        <span class="hb-search-item-type">${r.type}</span>
      </div>`
    ).join('');
    drop.classList.remove('hidden');
  },
  searchFocus() {
    const val = document.getElementById('hb-search').value;
    if (val.trim()) this.search(val);
  },
  searchBlur() {
    setTimeout(() => {
      const drop = document.getElementById('hb-search-drop');
      if (drop) drop.classList.add('hidden');
    }, 200);
  },

  /* ── Atualiza nome do jogador na topbar ── */
  updateProfile() {
    const user = Auth && Auth.getUser ? Auth.getUser() : null;
    const nameEl = document.getElementById('hb-profile-name');
    if (nameEl && user) nameEl.textContent = user.name || 'Aventureiro';
  },

  /* ── Init ── */
  init() {
    this.updateProfile();
    // fecha dropdowns ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.hb-icon-btn') &&
          !e.target.closest('.hb-profile-wrap') &&
          !e.target.closest('.hb-search-wrap')) {
        this._closeAll();
      }
    });
  }
};

/* Inicia quando o board fica ativo */
document.addEventListener('DOMContentLoaded', () => {
  HBoard.init();
});
