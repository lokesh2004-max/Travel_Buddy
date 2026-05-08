import React from 'react';
import { Star, BadgeCheck, MapPin } from 'lucide-react';
import type { Guide } from '@/services/guidesService';

const fallback = 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop';

const GuideCard: React.FC<{ guide: Guide }> = ({ guide }) => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 group">
    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
      <img
        src={guide.avatar_url || fallback}
        alt={guide.full_name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {guide.is_verified && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-semibold bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-blue-700">
          <BadgeCheck size={14} /> Verified
        </span>
      )}
      {guide.is_online && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-semibold bg-green-500/95 text-white px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Online
        </span>
      )}
      <div className="absolute bottom-3 left-4 text-white">
        <h4 className="font-bold text-lg">{guide.full_name}</h4>
        <p className="text-xs flex items-center gap-1 text-white/90">
          <MapPin size={12} /> {guide.city}
        </p>
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-gray-800">{Number(guide.rating).toFixed(1)}</span>
          <span className="text-gray-500 text-sm">({guide.reviews_count})</span>
        </div>
        <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ₹{Number(guide.hourly_price).toFixed(0)}
          <span className="text-xs text-gray-500 font-medium">/hr</span>
        </p>
      </div>
      {guide.expertise && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.expertise}</p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {(guide.categories ?? []).slice(0, 3).map((t) => (
          <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
            {t}
          </span>
        ))}
        {(guide.languages ?? []).slice(0, 2).map((l) => (
          <span key={l} className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            {l}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default GuideCard;
