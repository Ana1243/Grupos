const SCRIPT_URL = 'https://formspree.io/f/mkoyjvgy';
 
const DAYS  = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const HOURS = ['10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h'];
 
const selected = new Set();
 
function buildGrid() {
  const table = document.getElementById('avail-grid');
 
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  const emptyTh = document.createElement('th');
  emptyTh.className = 'hour-col';
  headRow.appendChild(emptyTh);
 
  DAYS.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day.slice(0, 3);
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);
 
  const tbody = document.createElement('tbody');
  HOURS.forEach(hour => {
    const tr = document.createElement('tr');
 
    const hourTd = document.createElement('td');
    hourTd.className = 'hour-col';
    const hourLabel = document.createElement('span');
    hourLabel.style.cssText = 'font-size:11px;color:var(--ink-faint);padding-right:8px;';
    hourLabel.textContent = hour;
    hourTd.appendChild(hourLabel);
    tr.appendChild(hourTd);
 
    DAYS.forEach(day => {
      const td = document.createElement('td');
      const btn = document.createElement('button');
      btn.className = 'cell-btn';
      btn.type = 'button';
      btn.dataset.slot = `${day}|${hour}`;
      btn.setAttribute('aria-label', `${day} ${hour}`);
      btn.addEventListener('click', () => toggleSlot(btn));
      td.appendChild(btn);
      tr.appendChild(td);
    });
 
    tbody.appendChild(tr);
  });
 
  table.appendChild(tbody);
}
 
function toggleSlot(btn) {
  const slot = btn.dataset.slot;
  if (selected.has(slot)) {
    selected.delete(slot);
    btn.classList.remove('on');
  } else {
    selected.add(slot);
    btn.classList.add('on');
  }
}
 
function submitForm() {
  const nome     = document.getElementById('f-nome').value.trim();
  const contacto = document.getElementById('f-contacto').value.trim();
  const turma    = document.getElementById('f-turma').value.trim();
  const escola   = document.getElementById('f-escola').value.trim();
  const notas    = document.getElementById('f-notas').value.trim();
 
  const err = document.getElementById('error-msg');
 
  if (!nome || !contacto || !turma || !escola || selected.size === 0) {
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';
 
  document.getElementById('submit-btn').disabled = true;
 
  const dispStr = [...selected]
    .sort((a, b) => {
      const [dayA, hA] = a.split('|');
      const [dayB, hB] = b.split('|');
      const di = d => DAYS.indexOf(d);
      const hi = h => HOURS.indexOf(h);
      return di(dayA) !== di(dayB) ? di(dayA) - di(dayB) : hi(hA) - hi(hB);
    })
    .map(s => s.replace('|', ' '))
    .join(', ');
 
  const payload = { nome, contacto, turma, escola, disponibilidade: dispStr, notas };
 
  fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});
 
  document.getElementById('form-card').style.display = 'none';
  document.querySelector('.header').style.display = 'none';
  document.getElementById('success-screen').style.display = 'block';
}
 
document.addEventListener('DOMContentLoaded', buildGrid);