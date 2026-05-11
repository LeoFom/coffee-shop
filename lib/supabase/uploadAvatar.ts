import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function uploadAvatar(file: File, userId: string) {
  const filePath = `avatars/${userId}-${Date.now()}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (error) throw error;

  // отримати URL
  const { data: publicUrl } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}