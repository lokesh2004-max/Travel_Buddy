import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Camera, User, MapPin, FileText, Tag, Globe,
  Compass, Wallet, Save, X, Plus, Loader2, CheckCircle2
} from 'lucide-react';
import ProfileCompletionChecklist from '@/components/ProfileCompletionChecklist';

const INTEREST_OPTIONS = [
  'Trekking', 'Beaches', 'Culture', 'Food', 'Adventure', 'Wildlife',
  'Photography', 'History', 'Backpacking', 'Luxury', 'Road Trips', 'Camping',
];

const LANGUAGE_OPTIONS = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
  'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'French', 'Spanish',
];

const TRAVEL_STYLES = [
  { value: 'adventure', label: '🧗 Adventure' },
  { value: 'luxury', label: '🏨 Luxury' },
  { value: 'backpacking', label: '🎒 Backpacking' },
  { value: 'cultural', label: '🎭 Cultural' },
  { value: 'relaxation', label: '🏖️ Relaxation' },
  { value: 'budget', label: '💸 Budget' },
];

const BUDGET_RANGES = [
  { value: '5k-10k', label: '₹5k – ₹10k' },
  { value: '10k-25k', label: '₹10k – ₹25k' },
  { value: '25k-50k', label: '₹25k – ₹50k' },
  { value: '50k+', label: '₹50k+' },
];

interface ProfileForm {
  full_name: string;
  bio: string;
  location: string;
  interests: string[];
  languages: string[];
  travel_style: string;
  budget_range: string;
  avatar_url: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    full_name: '',
    bio: '',
    location: '',
    interests: [],
    languages: [],
    travel_style: '',
    budget_range: '',
    avatar_url: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/'); return; }
      setUserId(session.user.id);

      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) {
        setForm({
          full_name: data.full_name || '',
          bio: data.bio || '',
          location: data.location || '',
          interests: data.interests || [],
          languages: (data as any).languages || [],
          travel_style: (data as any).travel_style || '',
          budget_range: (data as any).budget_range || '',
          avatar_url: data.avatar_url || '',
        });
        setAvatarPreview(data.avatar_url || '');
      }
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const toggleArrayItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      let avatar_url = form.avatar_url;

      // Upload avatar if changed
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `avatars/${userId}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true });

        if (uploadErr) {
          // If storage bucket doesn't exist, just use the data URL
          avatar_url = avatarPreview;
        } else {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
          avatar_url = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        full_name: form.full_name,
        bio: form.bio,
        location: form.location,
        interests: form.interests,
        languages: form.languages,
        travel_style: form.travel_style,
        budget_range: form.budget_range,
        avatar_url,
        updated_at: new Date().toISOString(),
      } as any);

      if (error) throw error;

      setForm(prev => ({ ...prev, avatar_url }));
      toast({ title: 'Profile saved!', description: 'Your profile has been updated successfully.' });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Profile save error:', err);
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const profileForChecklist = {
    avatar_url: avatarPreview || form.avatar_url,
    bio: form.bio,
    location: form.location,
    interests: form.interests,
    languages: form.languages,
    travel_style: form.travel_style,
    budget_range: form.budget_range,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft size={18} /> Dashboard
          </Button>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Profile
          </span>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Checklist */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ProfileCompletionChecklist profile={profileForChecklist} />
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <Card className="rounded-2xl shadow-md border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-gray-700">
                <User size={18} className="text-blue-600" /> Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                      {form.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-7 w-7 flex items-center justify-center shadow-md transition-colors"
                  >
                    <Camera size={14} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Profile Photo</p>
                  <p className="text-xs text-gray-400">Click the camera icon to upload</p>
                  {avatarPreview && (
                    <Badge variant="outline" className="mt-1 text-green-600 border-green-200 bg-green-50 text-xs gap-1">
                      <CheckCircle2 size={10} /> Photo added
                    </Badge>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="Your name"
                  value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-600" /> Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell travel buddies about yourself — your travel style, dream destinations, etc."
                  value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label htmlFor="location" className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-blue-600" /> Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Mumbai, India"
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Travel Preferences */}
          <Card className="rounded-2xl shadow-md border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-gray-700">
                <Tag size={18} className="text-purple-600" /> Travel Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => setForm(p => ({ ...p, interests: toggleArrayItem(p.interests, interest) }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      form.interests.includes(interest)
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    {form.interests.includes(interest) ? '✓ ' : ''}{interest}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="rounded-2xl shadow-md border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-gray-700">
                <Globe size={18} className="text-green-600" /> Languages Spoken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setForm(p => ({ ...p, languages: toggleArrayItem(p.languages, lang) }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      form.languages.includes(lang)
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    {form.languages.includes(lang) ? '✓ ' : ''}{lang}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Travel Style */}
          <Card className="rounded-2xl shadow-md border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-gray-700">
                <Compass size={18} className="text-orange-500" /> Travel Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TRAVEL_STYLES.map(style => (
                  <button
                    key={style.value}
                    onClick={() => setForm(p => ({ ...p, travel_style: p.travel_style === style.value ? '' : style.value }))}
                    className={`p-3 rounded-xl text-sm font-medium text-center transition-all border-2 ${
                      form.travel_style === style.value
                        ? 'border-orange-400 bg-orange-50 text-orange-700'
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Range */}
          <Card className="rounded-2xl shadow-md border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-gray-700">
                <Wallet size={18} className="text-blue-600" /> Budget Range (per trip)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BUDGET_RANGES.map(range => (
                  <button
                    key={range.value}
                    onClick={() => setForm(p => ({ ...p, budget_range: p.budget_range === range.value ? '' : range.value }))}
                    className={`p-3 rounded-xl text-sm font-medium text-center transition-all border-2 ${
                      form.budget_range === range.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-base h-12 gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
