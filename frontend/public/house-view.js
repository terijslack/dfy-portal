// house-view.js — One login for Teri.
// Admin pages: adds a "DFY's client view" button next to Sign out, which opens
// the client portal as DFY's own client account.
// Client pages: while the admin is in that view, shows a bar at the top with
// "Back to admin". Real clients never see either.
(function () {
  const isAdminPage = location.pathname.startsWith('/admin');

  async function post(url) {
    const r = await fetch(url, { method: 'POST' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(d.error || 'Something went wrong. Try again.'), { redirect: d.redirect });
    return d;
  }

  function adminButton() {
    const logout = document.getElementById('logoutBtn');
    if (!logout || document.getElementById('houseViewBtn')) return;
    const b = document.createElement('button');
    b.id = 'houseViewBtn';
    b.className = 'btn-secondary';
    b.type = 'button';
    b.textContent = "DFY's client view";
    b.title = "Open the client portal as Done For You Marketing's own client account";
    b.addEventListener('click', async () => {
      b.disabled = true;
      try {
        const d = await post('/api/auth/house-view');
        location.href = d.redirect || '/dashboard';
      } catch (err) {
        b.disabled = false;
        alert(err.message);
      }
    });
    logout.parentNode.insertBefore(b, logout);
  }

  async function clientBar() {
    let me;
    try { me = await fetch('/api/auth/me').then(r => r.ok ? r.json() : null); } catch { return; }
    if (!me || !me.user || !me.user.viewing_as_admin || document.getElementById('houseViewBar')) return;

    const bar = document.createElement('div');
    bar.id = 'houseViewBar';
    bar.setAttribute('role', 'status');
    bar.style.cssText = 'position:sticky;top:0;z-index:1000;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;' +
      'padding:9px 16px;background:#1F3D2C;color:#F5F2EA;font:500 13px/1.4 Inter,sans-serif;';
    bar.innerHTML = '<span>You’re in DFY’s own client account. Clients see the portal just like this.</span>';
    const back = document.createElement('button');
    back.type = 'button';
    back.textContent = 'Back to admin';
    back.style.cssText = 'background:#EBC99B;color:#1F3D2C;border:none;border-radius:6px;padding:6px 14px;font:600 12px Inter,sans-serif;cursor:pointer;';
    back.addEventListener('click', async () => {
      back.disabled = true;
      try {
        const d = await post('/api/auth/back-to-admin');
        location.href = d.redirect || '/admin/dashboard';
      } catch (err) {
        location.href = err.redirect || '/login';
      }
    });
    bar.appendChild(back);
    document.body.prepend(bar);
  }

  function start() { if (isAdminPage) adminButton(); else clientBar(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
