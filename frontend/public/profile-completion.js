// profile-completion.js — How complete a client's Business Profile is.
// Used by both the dashboard banner and the Business Profile page, so the two
// always show the same number. To change what counts, change ITEMS below.
//
// If they chose "Do it for me" for Brand Identity, brand voice and target
// audience are ours to fill in, so they count as done.

window.profileCompletion = function (p) {
  const has = v => (typeof v === 'string' ? v.trim() !== '' : !!v);
  const forUs = p.brandIdentityMode === 'import';
  const ITEMS = [
    ['Business name', p.businessName],
    ['Industry', p.industry],
    ['City', p.city],
    ['Business phone', p.phone],
    ['Website', p.website],
    ['At least one social account', p.socialsCount > 0],
    ['Brand voice', forUs || p.brandVoice],
    ['Target audience', forUs || p.targetAudience],
    ['Main goal', p.primaryGoal],
  ];
  const missing = ITEMS.filter(([, v]) => !has(v)).map(([label]) => label);
  return {
    pct: Math.round((ITEMS.length - missing.length) / ITEMS.length * 100),
    missing,
  };
};
