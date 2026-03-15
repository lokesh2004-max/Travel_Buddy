/**
 * Profile completion checklist.
 * Only tracks identity fields — matching preferences live in quiz_answers.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Circle,
  Camera, FileText, MapPin, Tag, Globe, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileData {
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  interests?: string[] | null;
  languages?: string[] | null;
  // Legacy fields kept for backward compat but not used in checklist
  travel_style?: string | null;
  budget_range?: string | null;
  accommodation?: string | null;
  group_size?: string | null;
  destination_type?: string | null;
}

interface ChecklistItem {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
}

interface Props {
  profile: ProfileData | null;
}

const ProfileCompletionChecklist: React.FC<Props> = ({ profile }) => {
  const navigate = useNavigate();

  const items: ChecklistItem[] = [
    {
      key: 'avatar',
      label: 'Add profile photo',
      description: 'Let buddies put a face to your name',
      icon: Camera,
      completed: !!profile?.avatar_url,
    },
    {
      key: 'bio',
      label: 'Add a bio',
      description: 'Tell others about yourself',
      icon: FileText,
      completed: !!profile?.bio,
    },
    {
      key: 'location',
      label: 'Add location',
      description: 'Where are you based?',
      icon: MapPin,
      completed: !!profile?.location,
    },
    {
      key: 'interests',
      label: 'Add travel interests',
      description: 'Mountains, beaches, culture...',
      icon: Tag,
      completed: !!(profile?.interests && profile.interests.length > 0),
    },
    {
      key: 'languages',
      label: 'Add languages spoken',
      description: 'Connect across cultures',
      icon: Globe,
      completed: !!(profile?.languages && profile.languages.length > 0),
    },
  ];

  const completedCount = items.filter(i => i.completed).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg">Complete Your Profile</h3>
            <p className="text-blue-100 text-sm mt-0.5">Better profiles get 3× more matches</p>
          </div>
          <span className="text-4xl font-extrabold tabular-nums">{percentage}%</span>
        </div>
        <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-blue-100 text-xs mt-2">{completedCount} of {items.length} tasks completed</p>
      </div>

      {/* Checklist */}
      <div className="px-4 py-3 divide-y divide-gray-50">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className={cn(
                'flex items-center gap-3 py-3 px-2 rounded-xl transition-colors',
                item.completed ? 'opacity-70' : 'hover:bg-blue-50/50 cursor-pointer'
              )}
              onClick={() => !item.completed && navigate('/profile')}
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 shrink-0" />
              )}

              <div className={cn(
                'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                item.completed ? 'bg-green-50' : 'bg-blue-50'
              )}>
                <Icon className={cn('h-4 w-4', item.completed ? 'text-green-500' : 'text-blue-600')} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium',
                  item.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                )}>
                  {item.label}
                </p>
                {!item.completed && (
                  <p className="text-xs text-gray-400 truncate">{item.description}</p>
                )}
              </div>

              {!item.completed && (
                <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {percentage < 100 && (
        <div className="px-4 pb-4">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
            onClick={() => navigate('/profile')}
          >
            Complete Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      {percentage === 100 && (
        <div className="px-4 pb-4">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <p className="text-green-700 text-sm font-medium">Profile complete! You're ready to find buddies.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionChecklist;
