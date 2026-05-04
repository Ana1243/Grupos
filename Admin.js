const ADMIN_PASSWORD = 'casajuventude';
const FORMSPREE_ID   = 'mkoyjvgy';
 
const DAY_ORDER = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
 
const PALETTES = [
  { dot:'#c1440e', bg:'#f5ddd5', text:'#7a2508', pillBg:'#fae8e1', pillText:'#7a2508' },
  { dot:'#2d6a4f', bg:'#d8f0e5', text:'#1a3f2f', pillBg:'#e8f7ef', pillText:'#1a3f2f' },
  { dot:'#1d4e89', bg:'#dceaf8', text:'#0e2d50', pillBg:'#eaf2fb', pillText:'#0e2d50' },
  { dot:'#7b5ea7', bg:'#ede5f7', text:'#4a3465', pillBg:'#f4eefb', pillText:'#4a3465' },
  { dot:'#9e6b00', bg:'#faecd0', text:'#5e3f00', pillBg:'#fdf4e3', pillText:'#5e3f00' },
];
 
let allData = [];
 
// ── LOGIN ──────────────────────────────────────────────────
function doLogin() {
  const pw = document.getElementById('pw-input').value;
  if (pw === ADMIN_PASSWORD) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-screen').style.display = 'block';
    loadData();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}
 
function logout() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-screen').style.display = 'none';
  document.getElementById('pw-input').value = '';
}
 
// ── DATA ───────────────────────────────────────────────────
async function loadData() {
  const container = document.getElementById('rooms-container');
  container.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div> A carregar...</div>';
 
  try {
    const res  = await fetch(`https://formspree.io/api/0/forms/${FORMSPREE_ID}/submissions`, {
      headers: { 'Accept': 'application/json' }
    });
    const json = await res.json();
 
    if (json.submissions) {
      allData = json.submissions.map(s => ({
        timestamp:       s.date,
        nome:            s.data?.nome            || s.data?.Nome            || '',
        contacto:        s.data?.contacto        || s.data?.Contacto        || '',
        turma:           s.data?.turma           || s.data?.Turma           || '',
        escola:          s.data?.escola          || s.data?.Escola          || '',
        disponibilidade: s.data?.disponibilidade || s.data?.Disponibilidade || '',
        notas:           s.data?.notas           || s.data?.Notas           || '',
      }));
      renderRooms();
    } else {
      // API não disponível no plano gratuito — mostra mensagem
      container.innerHTML = `
        <div class="empty-state">
          <span>🔒</span>
          A API do Formspree requer plano pago.<br><br>
          <a href="https://formspree.io/forms/${FORMSPREE_ID}/submissions" target="_blank" style="color:var(--accent);font-weight:500;">
            Ver inscrições no Formspree →
          </a>
        </div>`;
    }
  } catch (e) {
    container.innerHTML = `
      <div class="empty-state">
        <span>⚠️</span>
        Não foi possível carregar os dados.<br><br>
        <a href="https://formspree.io/forms/${FORMSPREE_ID}/submissions" target="_blank" style="color:var(--accent);font-weight:500;">
          Ver inscrições no Formspree →
        </a>
      </div>`;
  }
}
 
// ── RENDER ─────────────────────────────────────────────────
function getInitials(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}
 
function renderRooms() {
  const container = document.getElementById('rooms-container');
  document.getElementById('total-badge').textContent =
    allData.length + (allData.length === 1 ? ' inscrito' : ' inscritos');
 
  if (allData.length === 0) {
    container.innerHTML = '<div class="empty-state"><span>📋</span>Ainda não há inscrições.</div>';
    return;
  }
 
  const rooms = {};
  allData.forEach(row => {
    const slots = (row.disponibilidade || '').split(',').map(s => s.trim()).filter(Boolean);
    slots.forEach(slot => {
      if (!rooms[slot]) rooms[slot] = [];
      rooms[slot].push(row);
    });
  });
 
  const sortedSlots = Object.keys(rooms).sort((a, b) => {
    const [dayA, hourA] = a.split(' ');
    const [dayB, hourB] = b.split(' ');
    const di = d => DAY_ORDER.indexOf(d);
    const hi = h => parseInt(h);
    return di(dayA) !== di(dayB) ? di(dayA) - di(dayB) : hi(hourA) - hi(hourB);
  });
 
  const grid = document.createElement('div');
  grid.className = 'rooms-grid';
 
  sortedSlots.forEach((slot, idx) => {
    const pal    = PALETTES[idx % PALETTES.length];
    const people = rooms[slot];
 
    const card = document.createElement('div');
    card.className = 'room-card';
    card.style.animationDelay = (idx * 0.05) + 's';
 
    const rows = people.map(p => `
      <tr>
        <td>
          <div class="avatar-cell">
            <div class="avatar" style="background:${pal.bg};color:${pal.text}">${getInitials(p.nome)}</div>
            <span>${p.nome}</span>
          </div>
        </td>
        <td>${p.contacto}</td>
        <td>${p.turma}</td>
        <td>${p.escola}</td>
        <td>${p.notas || '—'}</td>
      </tr>`).join('');
 
    card.innerHTML = `
      <div class="room-header" onclick="this.closest('.room-card').classList.toggle('open')">
        <div class="room-dot" style="background:${pal.dot}"></div>
        <div class="room-day">${slot}</div>
        <div class="room-meta">${people.length} ${people.length === 1 ? 'pessoa' : 'pessoas'}</div>
        <div class="room-chevron">▼</div>
      </div>
      <div class="room-body">
        <table>
          <thead><tr>
            <th>Nome</th>
            <th>Contacto</th>
            <th>Turma</th>
            <th>Escola</th>
            <th>Notas</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
 
    grid.appendChild(card);
  });
 
  container.innerHTML = '';
  container.appendChild(grid);
}
 
// ── EXPORT CSV ─────────────────────────────────────────────
function exportCSV() {
  if (allData.length === 0) { alert('Não há dados para exportar.'); return; }
 
  const headers = ['Nome', 'Contacto', 'Turma', 'Escola', 'Disponibilidade', 'Notas', 'Data'];
  const rows = allData.map(r =>
    [r.nome, r.contacto, r.turma, r.escola, r.disponibilidade, r.notas, r.timestamp]
      .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
      .join(',')
  );
 
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'inscricoes.csv';
  a.click();
  URL.revokeObjectURL(url);
}
 
// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pw-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});
