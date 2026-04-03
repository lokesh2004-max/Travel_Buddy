import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Check, Users, MessageCircle } from 'lucide-react';
import { useBuddyMatches } from '@/hooks/useBuddyMatches';

const MyRequests: React.FC = () => {
  const navigate = useNavigate();
  const { matches, isLoading } = useBuddyMatches();

  const getInitials = (name: string | null) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              My Buddy Matches ({matches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No buddy matches yet</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Take the quiz and find your travel companions!</p>
                <Button onClick={() => navigate('/queera')}>Find Buddies</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map(match => {
                  const buddy = match.buddy_profile;

                  return (
                    <div key={match.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={buddy?.avatar_url || undefined} />
                        <AvatarFallback>{getInitials(buddy?.full_name)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{buddy?.full_name || 'Unknown Buddy'}</p>
                        <p className="text-sm text-muted-foreground truncate">{buddy?.location || 'Location unknown'}</p>
                        <div className="mt-1">
                          <Badge variant="default" className="text-xs">
                            <Check className="h-3 w-3 mr-1" /> Matched
                          </Badge>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" onClick={() => navigate('/messages')}>
                        <MessageCircle className="h-4 w-4 mr-1" /> Chat
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyRequests;
