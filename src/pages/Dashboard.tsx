import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Users, MapPin, MessageCircle, Globe, Bell, Zap,
  Calendar, ArrowRight, UserPlus, PlaneTakeoff, Pencil,
  LogOut, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  interests: string[] | null;
  location: string | null;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  status: string;
  trip_id: string;
  created_at: string;
}

interface Trip {
  id: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  buddy_id: string | null;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  match_id: string;
  created_at: string;
}

const recommendedDestinations = [
  { name: 'Goa', image: 'https://www.holidify.com/images/bgImages/GOA.jpg', tag: 'Beach' },
  { name: 'Manali', image: 'https://i0.wp.com/www.tusktravel.com/blog/wp-content/uploads/2021/11/Bandli-Sanctuary-Himachal.jpg?resize=750%2C550&ssl=1', tag: 'Mountains' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', tag: 'Backwaters' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [matchProfiles, setMatchProfiles] = useState<Record<string, Profile>>({});

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
      await fetchDashboardData(session.user.id);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchDashboardData = async (userId: string) => {
    setLoading(true);
    try {
      const [profileRes, matchesRes, tripsRes, notifRes, messagesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('buddy_matches').select('*').or(`user1_id.eq.${userId},user2_id.eq.${userId}`).eq('status', 'accepted').order('created_at', { ascending: false }).limit(5),
        supabase.from('trips').select('*').eq('user_id', userId).neq('status', 'completed').order('start_date', { ascending: true }).limit(5),
        supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
        supabase.from('messages').select('*').eq('sender_id', userId).order('created_at', { ascending: false }).limit(5),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (matchesRes.data) {
        setMatches(matchesRes.data);
        // Fetch profiles for matched buddies
        const buddyIds = matchesRes.data.map(m => m.user1_id === userId ? m.user2_id : m.user1_id);
        if (buddyIds.length > 0) {
          const { data: profiles } = await supabase.from('profiles').select('*').in('id', buddyIds);
          if (profiles) {
            const map: Record<string, Profile> = {};
            profiles.forEach(p => { map[p.id] = p; });
            setMatchProfiles(map);
          }
        }
      }
      if (tripsRes.data) setTrips(tripsRes.data);
      if (notifRes.data) setNotifications(notifRes.data);
      if (messagesRes.data) setRecentMessages(messagesRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = (() => {
    if (!profile) return 0;
    let score = 0;
    if (profile.avatar_url) score += 25;
    if (profile.bio) score += 25;
    if (profile.interests && profile.interests.length > 0) score += 25;
    if (profile.location) score += 25;
    return score;
  })();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const userName = profile?.full_name || 'Traveler';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl">🌍</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Travel Buddy</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
              <MessageCircle size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => {}}>
              <Bell size={20} />
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </Button>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your travels</p>
        </div>

        {/* Profile Completion */}
        <Card className="mb-8 border-none shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Profile Completion</h3>
                <p className="text-blue-100 text-sm mb-3">Complete your profile to get better buddy matches</p>
                <Progress value={profileCompletion} className="h-2.5 bg-white/20 [&>div]:bg-white" />
              </div>
              <span className="text-3xl font-bold">{profileCompletion}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 1: My Matches */}
          <Card className="shadow-md hover:shadow-xl transition-shadow rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Users size={20} className="text-blue-600" /> My Matches</CardTitle>
              <Badge variant="secondary">{matches.length}</Badge>
            </CardHeader>
            <CardContent>
              {matches.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No matches yet. Start swiping!</p>
              ) : (
                <div className="space-y-3">
                  {matches.slice(0, 3).map(match => {
                    const buddyId = match.user1_id === profile?.id ? match.user2_id : match.user1_id;
                    const buddy = matchProfiles[buddyId];
                    return (
                      <div key={match.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={buddy?.avatar_url || ''} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                              {(buddy?.full_name || '?').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{buddy?.full_name || 'Unknown'}</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => navigate('/messages')}>
                          <MessageCircle size={14} className="mr-1" /> Chat
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Upcoming Trips */}
          <Card className="shadow-md hover:shadow-xl transition-shadow rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><PlaneTakeoff size={20} className="text-green-600" /> Upcoming Trips</CardTitle>
              <Badge variant="secondary">{trips.length}</Badge>
            </CardHeader>
            <CardContent>
              {trips.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No upcoming trips. Plan one now!</p>
              ) : (
                <div className="space-y-3">
                  {trips.slice(0, 3).map(trip => (
                    <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-sm">{trip.destination}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {trip.start_date || 'TBD'} — {trip.end_date || 'TBD'}
                        </p>
                      </div>
                      <Badge className="capitalize">{trip.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Recent Chats */}
          <Card className="shadow-md hover:shadow-xl transition-shadow rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><MessageCircle size={20} className="text-purple-600" /> Recent Chats</CardTitle>
            </CardHeader>
            <CardContent>
              {recentMessages.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No messages yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentMessages.slice(0, 4).map(msg => (
                    <div key={msg.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg" onClick={() => navigate('/messages')}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">💬</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{msg.content}</p>
                        <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => navigate('/messages')}>
                View All Messages <ArrowRight size={14} className="ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 4: Recommended Destinations */}
          <Card className="shadow-md hover:shadow-xl transition-shadow rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Globe size={20} className="text-orange-500" /> Recommended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendedDestinations.map((dest, i) => (
                  <div key={i} className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/search-results?query=${encodeURIComponent(dest.name)}`)}>
                    <img src={dest.image} alt={dest.name} className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{dest.name}</p>
                      <Badge variant="outline" className="text-xs">{dest.tag}</Badge>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Notifications */}
          <Card className="shadow-md hover:shadow-xl transition-shadow rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Bell size={20} className="text-red-500" /> Notifications</CardTitle>
              {notifications.filter(n => !n.is_read).length > 0 && (
                <Badge variant="destructive">{notifications.filter(n => !n.is_read).length} new</Badge>
              )}
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No notifications.</p>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 4).map(n => (
                    <div key={n.id} className={`p-3 rounded-xl text-sm ${n.is_read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'}`}>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-gray-500 text-xs truncate">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 6: Quick Actions */}
          <Card className="shadow-md hover:shadow-xl transition-shadow rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Zap size={20} className="text-yellow-500" /> Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 rounded-xl hover:bg-blue-50 hover:border-blue-200" onClick={() => navigate('/swipe-match')}>
                  <UserPlus size={22} className="text-blue-600" />
                  <span className="text-xs">Find Buddy</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 rounded-xl hover:bg-green-50 hover:border-green-200" onClick={() => navigate('/destination-recommendations')}>
                  <PlaneTakeoff size={22} className="text-green-600" />
                  <span className="text-xs">Plan Trip</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 rounded-xl hover:bg-purple-50 hover:border-purple-200" onClick={() => navigate('/messages')}>
                  <MessageCircle size={22} className="text-purple-600" />
                  <span className="text-xs">Messages</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 rounded-xl hover:bg-orange-50 hover:border-orange-200" onClick={() => {}}>
                  <Pencil size={22} className="text-orange-600" />
                  <span className="text-xs">Edit Profile</span>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
