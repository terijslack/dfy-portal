// newsletter-nav.js — Adds "Newsletter" to every client's sidebar, with a
// badge when one is waiting for their approval. Included on every client page (one script tag), so
// the sidebar markup in each page doesn't need editing.
(function () {
  var ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="6" y1="13" x2="14" y2="13"/></svg>';

  function badgeHtml(n) {
    return n > 0 ? '<span class="sidebar-subitem-badge" id="newsletterNavBadge">' + n + '</span>' : '';
  }

  function render(waiting) {
    var existing = document.getElementById('newsletterNav');
    if (existing) { // newsletter.html has it built in — just refresh the badge
      var b = document.getElementById('newsletterNavBadge');
      if (b) b.remove();
      if (waiting > 0) existing.insertAdjacentHTML('beforeend', badgeHtml(waiting));
      return;
    }
    var gbp = document.querySelector('.portal-sidebar nav a[href="/gbp"]');
    if (!gbp) return;
    var a = document.createElement('a');
    a.href = '/newsletter';
    a.className = 'sidebar-nav-item';
    a.id = 'newsletterNav';
    a.innerHTML = '<span class="sidebar-nav-icon">' + ICON + '</span>Newsletter' + badgeHtml(waiting);
    gbp.parentNode.insertBefore(a, gbp);
  }

  function load() {
    render(0); // show the link right away; the badge fills in below
    fetch('/api/newsletters', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var list = (d && d.newsletters) || [];
        render(list.filter(function (n) { return n.status === 'pending'; }).length);
        window.dispatchEvent(new CustomEvent('newsletters:loaded', { detail: list }));
      })
      .catch(function () {});
  }

  window.refreshNewsletterNav = load;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
