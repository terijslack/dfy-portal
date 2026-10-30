// admin-common.js — small helpers shared by the admin Contacts and Pipeline pages
window.Admin = (() => {
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  async function api(url, opts = {}) {
    const res = await fetch(url, {
      ...opts,
      headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    let data = {};
    try { data = await res.json(); } catch (_) {}
    if (!res.ok) throw new Error(data.error || 'Something went wrong. Try again.');
    return data;
  }

  // Send non-admins away before showing anything
  async function requireAdmin() {
    try {
      const me = await api('/api/auth/me');
      if (me.user && me.user.is_admin) return me.user;
      window.location.href = me.user ? '/dashboard' : '/login';
    } catch (_) {
      window.location.href = '/login';
    }
    return new Promise(() => {}); // never resolves while redirecting
  }

  const money = v => (v === null || v === undefined || v === '') ? '' :
    Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const date = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  function ago(d) {
    if (!d) return '';
    const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    return date(d);
  }

  function when(d) {
    if (!d) return '';
    return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function bindLogout() {
    const b = document.getElementById('logoutBtn');
    if (b) b.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    });
  }

  function setMsg(el, text, kind) {
    el.textContent = text || '';
    el.className = 'msg' + (kind ? ' ' + kind : '');
  }

  function stageOptions(stages, selected) {
    return stages.map(s => `<option value="${esc(s.key)}" ${s.key === selected ? 'selected' : ''}>${esc(s.label)}</option>`).join('');
  }

  return { esc, api, requireAdmin, money, date, ago, when, bindLogout, setMsg, stageOptions };
})();
