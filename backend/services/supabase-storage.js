const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  return createClient(url, key);
}

const LOGO_BUCKET    = 'brand-assets';
const CONTENT_BUCKET = 'brand-assets';

async function uploadLogo(clientId, buffer, mimetype, originalName) {
  const supabase = getSupabase();
  const ext  = originalName.split('.').pop().toLowerCase();
  const path = `logos/${clientId}/logo.${ext}`;
  const { error } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(path, buffer, { contentType: mimetype, upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadContentFile(clientId, buffer, mimetype, originalName) {
  const supabase = getSupabase();
  const ext       = originalName.split('.').pop().toLowerCase();
  const timestamp = Date.now();
  const safe      = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path      = `content/${clientId}/${timestamp}-${safe}`;
  const { error } = await supabase.storage
    .from(CONTENT_BUCKET)
    .upload(path, buffer, { contentType: mimetype, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(CONTENT_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

async function deleteFile(storagePath) {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(CONTENT_BUCKET).remove([storagePath]);
  if (error) throw error;
}

module.exports = { uploadLogo, uploadContentFile, deleteFile };
