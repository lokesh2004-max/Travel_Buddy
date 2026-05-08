import { supabase } from '@/integrations/supabase/client';

export interface Guide {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  city: string;
  country: string;
  languages: string[] | null;
  expertise: string | null;
  categories: string[] | null;
  hourly_price: number;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_online: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export interface GuideInput {
  full_name: string;
  email: string;
  phone?: string;
  city: string;
  country: string;
  languages: string[];
  expertise?: string;
  categories: string[];
  hourly_price: number;
  bio?: string;
  avatar_url?: string;
}

export const guidesService = {
  async list(): Promise<Guide[]> {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(24);
    if (error) throw error;
    return (data ?? []) as Guide[];
  },

  async create(payload: GuideInput, userId: string): Promise<Guide> {
    const { data, error } = await supabase
      .from('guides')
      .insert({ ...payload, user_id: userId })
      .select('*')
      .single();
    if (error) throw error;
    return data as Guide;
  },

  async uploadAvatar(file: File, userId: string): Promise<string> {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('guide-avatars')
      .upload(path, file, { cacheControl: '3600', upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('guide-avatars').getPublicUrl(path);
    return data.publicUrl;
  },
};
