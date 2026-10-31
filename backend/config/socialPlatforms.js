// config/socialPlatforms.js — the social platforms an account can have.
// Shared by the client-facing socials routes and the admin account page so the
// two never drift apart.

const SOCIAL_PLATFORMS = {
  facebook:  'Facebook',
  instagram: 'Instagram',
  linkedin:  'LinkedIn',
  tiktok:    'TikTok',
  google:    'Google Business Profile',
  youtube:   'YouTube',
  twitter:   'X (Twitter)',
  pinterest: 'Pinterest',
  snapchat:  'Snapchat',
  threads:   'Threads',
};

const ALLOWED_PLATFORMS = Object.keys(SOCIAL_PLATFORMS);

// 'facebook' → 'Facebook'. Falls back to whatever was passed in.
const platformName = id => SOCIAL_PLATFORMS[id] || id;

module.exports = { SOCIAL_PLATFORMS, ALLOWED_PLATFORMS, platformName };
