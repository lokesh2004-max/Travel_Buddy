import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Camera, ImagePlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Moment {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

const Moments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('moments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setMoments(data as Moment[]);
    setLoading(false);
  };

  const handlePost = async () => {
    if (!imageUrl.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: 'Please log in first', variant: 'destructive' });
      return;
    }

    setPosting(true);
    const { error } = await supabase.from('moments').insert([{
      user_id: session.user.id,
      image_url: imageUrl.trim(),
      caption: caption.trim() || null,
    }] as any);

    if (error) {
      toast({ title: 'Failed to post', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Moment shared! 📸' });
      setImageUrl('');
      setCaption('');
      await fetchMoments();
    }
    setPosting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </Button>
          <Camera size={24} className="text-primary" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Travel Moments
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Post Section */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImagePlus size={20} className="text-primary" /> Share a Moment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/photo.jpg"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="What's your travel story?"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={2}
              />
            </div>
            <Button onClick={handlePost} disabled={!imageUrl.trim() || posting}>
              {posting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : '📸'} Post Moment
            </Button>
          </CardContent>
        </Card>

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : moments.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Camera size={48} className="mx-auto mb-4 opacity-40" />
              <p className="font-medium">No moments yet</p>
              <p className="text-sm">Be the first to share a travel moment!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {moments.map(m => (
              <Card key={m.id} className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <img
                  src={m.image_url}
                  alt={m.caption || 'Travel moment'}
                  className="w-full h-52 object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
                <CardContent className="p-4">
                  {m.caption && <p className="text-sm font-medium mb-1">{m.caption}</p>}
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Moments;
