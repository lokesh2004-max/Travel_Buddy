import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PostData {
  id: string;
  username: string;
  avatarUrl?: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
}

const PostCard: React.FC<{ post: PostData }> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 200) + 10);
  const [saved, setSaved] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const lastTap = useRef(0);

  const toggleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  const handleDoubleClick = () => {
    if (!liked) toggleLike();
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) handleDoubleClick();
    lastTap.current = now;
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [...prev, commentText.trim()]);
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Travel Moment', text: post.caption ?? '', url: window.location.href }).catch(() => {});
    } else {
      alert('Shared! 🔗');
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar className="h-9 w-9 ring-2 ring-primary/30">
          <AvatarImage src={post.avatarUrl} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
            {post.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold text-sm text-foreground">{post.username}</span>
      </div>

      {/* Image */}
      <div
        className="relative w-full aspect-square bg-muted cursor-pointer select-none"
        onDoubleClick={handleDoubleClick}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={post.imageUrl}
          alt={post.caption ?? 'Travel moment'}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
        />
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce-in">
            <Heart size={80} className="text-white fill-white drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="transition-transform active:scale-125" aria-label="Like">
              <Heart
                size={26}
                className={cn(
                  'transition-colors',
                  liked ? 'text-destructive fill-destructive' : 'text-foreground'
                )}
              />
            </button>
            <button aria-label="Comment">
              <MessageCircle size={24} className="text-foreground hover:text-muted-foreground transition-colors" />
            </button>
            <button onClick={handleShare} aria-label="Share">
              <Send size={22} className="text-foreground hover:text-muted-foreground transition-colors" />
            </button>
          </div>
          <button onClick={() => setSaved(!saved)} aria-label="Save">
            <Bookmark
              size={24}
              className={cn(
                'transition-colors',
                saved ? 'text-foreground fill-foreground' : 'text-foreground'
              )}
            />
          </button>
        </div>

        <p className="font-semibold text-sm mt-2 text-foreground">{likeCount.toLocaleString()} likes</p>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm mt-1 text-foreground">
            <span className="font-semibold mr-1.5">{post.username}</span>
            {post.caption}
          </p>
        )}

        {/* Comments */}
        {comments.length > 0 && (
          <div className="mt-2 space-y-1">
            {comments.map((c, i) => (
              <p key={i} className="text-sm text-foreground">
                <span className="font-semibold mr-1.5">you</span>{c}
              </p>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2 mb-1">{timeAgo(post.createdAt)}</p>
      </div>

      {/* Comment input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
        <Input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addComment()}
          placeholder="Add a comment…"
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8 px-0"
        />
        {commentText.trim() && (
          <Button variant="ghost" size="sm" onClick={addComment} className="text-primary font-semibold text-sm px-2 h-8">
            Post
          </Button>
        )}
      </div>
    </article>
  );
};

export default PostCard;
