/**
 * MatchesList Component
 * Displays list of buddy matches with status indicators
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X, MessageCircle, Clock, Users } from 'lucide-react';
import type { MatchWithProfile } from '@/hooks/useBuddyMatches';
import { cn } from '@/lib/utils';

interface MatchesListProps {
  matches: MatchWithProfile[];
  isLoading: boolean;
  currentUserId: string | null;
  onSelectMatch: (match: MatchWithProfile) => void;
  onAccept: (matchId: string) => void;
  onReject: (matchId: string) => void;
}

export const MatchesList: React.FC<MatchesListProps> = ({
  matches,
  isLoading,
  currentUserId,
  onSelectMatch,
  onAccept,
  onReject,
}) => {
  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge className="bg-primary text-primary-foreground">
            <Check className="h-3 w-3 mr-1" />
            Matched
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  // Check if current user is the one who received the match request
  const isReceivedRequest = (match: MatchWithProfile) => {
    return match.user2_id === currentUserId && match.status === 'pending';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Travel Buddies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Travel Buddies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No matches yet</p>
            <p className="text-sm text-muted-foreground">
              Start swiping to find your travel buddy!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Your Travel Buddies ({matches.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className={cn(
              'flex items-center gap-3 p-3 border rounded-lg transition-colors',
              match.status === 'accepted'
                ? 'hover:bg-muted/50 cursor-pointer'
                : 'bg-muted/30'
            )}
            onClick={() => match.status === 'accepted' && onSelectMatch(match)}
          >
            {/* Avatar */}
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={match.buddy_profile?.avatar_url || undefined}
                alt={match.buddy_profile?.full_name || 'Buddy'}
              />
              <AvatarFallback>
                {getInitials(match.buddy_profile?.full_name)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {match.buddy_profile?.full_name || 'Unknown Buddy'}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {match.buddy_profile?.location || 'Location unknown'}
              </p>
              <div className="mt-1">{getStatusBadge(match.status)}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isReceivedRequest(match) ? (
                // Show accept/reject buttons for received requests
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 text-primary hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAccept(match.id);
                    }}
                    aria-label="Accept match"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(match.id);
                    }}
                    aria-label="Decline match"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : match.status === 'accepted' ? (
                // Show chat button for accepted matches
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9"
                  aria-label="Open chat"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
