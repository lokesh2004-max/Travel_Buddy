import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Camera, ImagePlus, Loader2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PostCard, { type PostData } from '@/components/moments/PostCard';

interface MomentRow {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

const FAKE_POSTS: PostData[] = [
  {
    id: 'fake-1',
    username: 'rahul_explorer',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    caption: 'Lost in the mountains of Manali 🏔️✨ #wanderlust',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'fake-2',
    username: 'priya_travels',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    caption: 'Goa sunsets hit different 🌅🧡',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'fake-3',
    username: 'arjun.wanderer',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    caption: 'Kerala backwaters — pure bliss 🛶🌿',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'fake-4',
    username: 'sneha_adventures',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    caption: 'Taj Mahal at sunrise — bucket list ✅',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'fake-5',
    username: 'vikram_hills',
    avatarUrl: 'https://i.pravatar.cc/150?img=53',
    imageUrl: 'https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=800',
    caption: 'Camping under the stars in Himachal ⛺🌌',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'fake-6',
    username: 'meera_globe',
    avatarUrl: 'https://i.pravatar.cc/150?img=23',
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    caption: 'Jaipur — the Pink City never disappoints 🏰💖',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

const Moments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
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

    const dbPosts: PostData[] = (data as MomentRow[] | null)?.map((m) => ({
      id: m.id,
      username: 'traveler_' + m.user_id.slice(0, 4),
      imageUrl: m.image_url,
      caption: m.caption,
      createdAt: m.created_at,
    })) ?? [];

    // Merge real posts first, then fake posts
    setPosts(dbPosts.length > 0 ? dbPosts : FAKE_POSTS);
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
    const { error } = await supabase.from('moments').insert({
      user_id: session.user.id,
      image_url: imageUrl.trim(),
      caption: caption.trim() || null,
    });

    if (error) {
      toast({ title: 'Failed to post', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Moment shared! 📸' });
      setImageUrl('');
      setCaption('');
      setShowCompose(false);
      await fetchMoments();
    }
    setPosting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="h-9 w-9">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Moments
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCompose(!showCompose)}
              className="h-9 w-9"
            >
              {showCompose ? <X size={20} /> : <Plus size={20} />}
            </Button>
            <Camera size={20} className="text-muted-foreground" />
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        {/* Compose Panel */}
        {showCompose && (
          <div className="border-b border-border bg-card p-4 space-y-3 animate-slide-in-up">
            <div className="space-y-1.5">
              <Label htmlFor="img-url" className="text-xs font-medium text-muted-foreground">Image URL</Label>
              <Input
                id="img-url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            {imageUrl.trim() && (
              <div className="rounded-xl overflow-hidden aspect-video bg-muted">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="cap" className="text-xs font-medium text-muted-foreground">Caption</Label>
              <Textarea
                id="cap"
                placeholder="Write a caption…"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                className="text-sm resize-none"
              />
            </div>
            <Button
              onClick={handlePost}
              disabled={!imageUrl.trim() || posting}
              className="w-full"
              size="sm"
            >
              {posting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Share Moment
            </Button>
          </div>
        )}

        {/* Feed */}
        <div className="py-4 px-4 space-y-5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="w-full aspect-square" />
                <div className="px-4 py-3 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <Camera size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p className="font-semibold text-foreground">No moments yet</p>
              <p className="text-sm text-muted-foreground mt-1">Be the first to share a travel moment!</p>
              <Button onClick={() => setShowCompose(true)} className="mt-4" size="sm">
                <ImagePlus size={16} className="mr-2" /> Create Post
              </Button>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Moments;
