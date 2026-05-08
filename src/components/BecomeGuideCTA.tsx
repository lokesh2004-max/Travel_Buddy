import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, BadgeCheck, MapPin, Wallet, ArrowRight, TrendingUp } from 'lucide-react';

/**
 * Compact, premium homepage entry point for the "Become a Local Guide" feature.
 * Click → navigates to the full /become-guide experience.
 */
const BecomeGuideCTA: React.FC = () => {
  const navigate = useNavigate();
  const goToGuide = () => navigate('/become-guide');

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      {/* Floating gradient blurs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem] bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          onClick={goToGuide}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goToGuide()}
          className="group relative cursor-pointer rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
        >
          {/* Animated gradient ring on hover */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-10 p-8 lg:p-12 items-center">
            {/* LEFT */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/60 shadow-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="text-purple-600" size={16} />
                <span className="text-xs font-bold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NEW INCOME FEATURE
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Turn Your City Into{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Income
                </span>
              </h2>
              <p className="text-base lg:text-lg text-gray-600 mb-6 leading-relaxed max-w-lg">
                Share what you love about your hometown with travelers from around the world — and get paid for every story, walk and meal you host.
              </p>

              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl px-4 py-3 mb-7 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Earn</p>
                  <p className="text-sm font-bold text-gray-900">₹5,000 – ₹50,000<span className="text-gray-500 font-medium">/month</span></p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); goToGuide(); }}
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3.5 rounded-full font-semibold transform hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-2xl"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-60 group-hover:opacity-90 transition-opacity -z-10" />
                  Become a Guide
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                  <TrendingUp size={14} className="text-emerald-600" /> Trusted by 1,200+ guides
                </span>
              </div>
            </div>

            {/* RIGHT — Floating preview card */}
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[2rem] blur-2xl" />

              <div className="relative bg-white/90 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl p-6 transform group-hover:-translate-y-2 transition-all duration-500 animate-fade-in">
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                      alt="Guide avatar"
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                      loading="lazy"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 truncate">Ananya Rao</h3>
                      <BadgeCheck className="text-blue-500 fill-blue-100 shrink-0" size={18} />
                    </div>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <MapPin size={12} /> Bengaluru, India
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={13} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-800 text-xs">4.95</span>
                      <span className="text-gray-500 text-[11px]">(218)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">Online</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-2.5 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">Tours</p>
                    <p className="text-sm font-bold text-gray-800">218</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-2.5 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">Earned</p>
                    <p className="text-sm font-bold text-gray-800">₹4.2L</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-2.5 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">Rating</p>
                    <p className="text-sm font-bold text-gray-800">4.95★</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-500">Starting at</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹750<span className="text-xs text-gray-500 font-medium">/hr</span>
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Explore <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Floating earnings chip */}
              <div className="hidden md:flex absolute -left-4 -bottom-4 bg-white/95 backdrop-blur-md border border-white/70 shadow-xl rounded-2xl px-4 py-2.5 items-center gap-2 animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                  <Wallet size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">New booking</p>
                  <p className="text-xs font-bold text-gray-800">+ ₹2,250</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeGuideCTA;
