import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import StarRating from './StarRating';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeedbackModal = ({ open, onOpenChange }: FeedbackModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    // Auto-fill from auth profile
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? '');
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();
        if (profile?.full_name) setName(profile.full_name);
      }
    })();
  }, [open]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setRating(0);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    if (rating === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({ title: 'Please sign in to submit feedback', variant: 'destructive' });
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rating,
        message: message.trim(),
      });

      if (error) throw error;

      toast({ title: 'Thank you for your feedback ❤️' });
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: 'Failed to submit feedback', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Share Your Feedback</DialogTitle>
          <DialogDescription>We'd love to hear about your experience!</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="fb-name">Name</Label>
            <Input id="fb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required maxLength={100} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-email">Email</Label>
            <Input id="fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required maxLength={255} />
          </div>

          <div className="space-y-1.5">
            <Label>Rating</Label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-message">Message</Label>
            <Textarea id="fb-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you think…" required maxLength={1000} rows={4} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
