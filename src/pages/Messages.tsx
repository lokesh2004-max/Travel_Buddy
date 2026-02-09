/**
 * Messages Page
 * Main messaging interface for chatting with travel buddies
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useBuddyMatches, MatchWithProfile } from '@/hooks/useBuddyMatches';
import { MatchesList } from '@/components/chat/MatchesList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogIn } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithProfile | null>(null);

  const {
    matches,
    isLoading,
    currentUserId,
    acceptMatch,
    rejectMatch,
  } = useBuddyMatches();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <LogIn className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your messages and chat with travel buddies.
          </p>
          <Button onClick={() => setShowAuthModal(true)} size="lg">
            Sign In
          </Button>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {selectedMatch ? (
          // Show chat window when a match is selected
          <ChatWindow
            matchId={selectedMatch.id}
            currentUserId={currentUserId || ''}
            buddyName={selectedMatch.buddy_profile?.full_name || 'Travel Buddy'}
            buddyAvatar={selectedMatch.buddy_profile?.avatar_url}
            onBack={() => setSelectedMatch(null)}
            isMatchAccepted={selectedMatch.status === 'accepted'}
          />
        ) : (
          // Show matches list
          <MatchesList
            matches={matches}
            isLoading={isLoading}
            currentUserId={currentUserId}
            onSelectMatch={setSelectedMatch}
            onAccept={acceptMatch}
            onReject={rejectMatch}
          />
        )}
      </main>
    </div>
  );
};

export default MessagesPage;
