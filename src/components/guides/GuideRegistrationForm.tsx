import React, { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Upload, UserPlus, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { guidesService, type Guide } from '@/services/guidesService';

const guideSchema = z.object({
  full_name: z.string().trim().min(2, 'Name is too short').max(80),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City is required').max(60),
  country: z.string().trim().min(2).max(60),
  languages: z.string().trim().min(1, 'Add at least one language').max(200),
  expertise: z.string().trim().max(120).optional().or(z.literal('')),
  categories: z.string().trim().min(1, 'Add at least one category').max(200),
  hourly_price: z.coerce.number().min(50, 'Minimum ₹50/hr').max(100000),
  bio: z.string().trim().max(800).optional().or(z.literal('')),
});

type FormState = z.input<typeof guideSchema>;

const initial: FormState = {
  full_name: '',
  email: '',
  phone: '',
  city: '',
  country: 'India',
  languages: '',
  expertise: '',
  categories: '',
  hourly_price: 750 as any,
  bio: '',
};

interface Props {
  onSuccess: (g: Guide) => void;
}

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800 placeholder:text-gray-400';

const GuideRegistrationForm: React.FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (k: keyof FormState, v: string) => {
    setForm((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const handleAvatar = (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = guideSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fe[i.path[0] as string] = i.message;
      });
      setErrors(fe);
      toast.error('Please fix the highlighted fields');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to register as a guide');
      return;
    }

    setSubmitting(true);
    try {
      let avatar_url: string | undefined;
      if (avatarFile) {
        avatar_url = await guidesService.uploadAvatar(avatarFile, user.id);
      }
      const created = await guidesService.create(
        {
          full_name: parsed.data.full_name,
          email: parsed.data.email,
          phone: parsed.data.phone || undefined,
          city: parsed.data.city,
          country: parsed.data.country,
          languages: parsed.data.languages.split(',').map((s) => s.trim()).filter(Boolean),
          expertise: parsed.data.expertise || undefined,
          categories: parsed.data.categories.split(',').map((s) => s.trim()).filter(Boolean),
          hourly_price: parsed.data.hourly_price,
          bio: parsed.data.bio || undefined,
          avatar_url,
        },
        user.id,
      );
      toast.success('🎉 You are now a Travel Buddy guide!');
      onSuccess(created);
      setForm(initial);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: any) {
      toast.error(err.message ?? 'Could not register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-8 lg:p-10 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
          <UserPlus size={22} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Register as a Guide</h3>
          <p className="text-sm text-gray-600">Takes less than 2 minutes</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 ring-4 ring-white shadow-md flex items-center justify-center">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Upload size={28} className="text-gray-400" />
          )}
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all">
          <Upload size={16} />
          {avatarFile ? 'Change Photo' : 'Upload Photo'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatar(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Full Name *" error={errors.full_name}>
          <input className={inputCls} value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} placeholder="Ananya Rao" />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input type="email" className={inputCls} value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input className={inputCls} value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 98xxxxxxxx" />
        </Field>
        <Field label="Hourly Pricing (₹) *" error={errors.hourly_price}>
          <input type="number" min={50} className={inputCls} value={form.hourly_price as any} onChange={(e) => handleChange('hourly_price', e.target.value)} />
        </Field>
        <Field label="City *" error={errors.city}>
          <input className={inputCls} value={form.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="Bengaluru" />
        </Field>
        <Field label="Country *" error={errors.country}>
          <input className={inputCls} value={form.country} onChange={(e) => handleChange('country', e.target.value)} />
        </Field>
        <Field label="Languages * (comma separated)" error={errors.languages}>
          <input className={inputCls} value={form.languages} onChange={(e) => handleChange('languages', e.target.value)} placeholder="English, Hindi, Kannada" />
        </Field>
        <Field label="Expertise" error={errors.expertise}>
          <input className={inputCls} value={form.expertise} onChange={(e) => handleChange('expertise', e.target.value)} placeholder="Heritage walks, cafés" />
        </Field>
        <Field label="Tour Categories * (comma separated)" error={errors.categories} className="md:col-span-2">
          <input className={inputCls} value={form.categories} onChange={(e) => handleChange('categories', e.target.value)} placeholder="Walking Tours, Street Food, Photography" />
        </Field>
        <Field label="Bio" error={errors.bio} className="md:col-span-2">
          <textarea
            rows={4}
            className={inputCls}
            value={form.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Tell travelers what makes your tours special..."
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <CheckCircle2 size={18} /> Become a Guide
          </>
        )}
      </button>
    </form>
  );
};

const Field: React.FC<{ label: string; error?: string; className?: string; children: React.ReactNode }> = ({
  label,
  error,
  className,
  children,
}) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default GuideRegistrationForm;
