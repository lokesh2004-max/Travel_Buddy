import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Wallet, Users, Award, MapPin, Camera, Utensils,
  Mountain, Landmark, BadgeCheck, CreditCard, Shield, Star, UserPlus,
  Calendar, ChevronDown, TrendingUp,
} from 'lucide-react';
import GuideRegistrationForm from '@/components/guides/GuideRegistrationForm';
import GuideCard from '@/components/guides/GuideCard';
import GuideCardSkeleton from '@/components/guides/GuideCardSkeleton';
import { useGuides } from '@/hooks/useGuides';

const guideRoles = [
  { icon: MapPin, label: 'Local Guide', color: 'from-blue-500 to-cyan-500' },
  { icon: Camera, label: 'Photographer', color: 'from-pink-500 to-rose-500' },
  { icon: Utensils, label: 'Food Explorer', color: 'from-amber-500 to-orange-500' },
  { icon: Mountain, label: 'Adventure Expert', color: 'from-emerald-500 to-teal-500' },
  { icon: Landmark, label: 'Culture Guide', color: 'from-purple-500 to-indigo-500' },
];

const guideFaqs = [
  { q: 'Who can become a guide on Travel Buddy?', a: 'Anyone 18+ with great local knowledge of their city — students, working professionals, photographers, foodies and adventure enthusiasts. Verification is required.' },
  { q: 'How much can I realistically earn?', a: 'Most active guides earn between ₹5,000 – ₹50,000 per month depending on city, hours and tour categories. Top guides in metros cross ₹1 lakh.' },
  { q: 'When do I get paid?', a: 'Payouts are processed securely to your bank account within 24 hours of tour completion via our trusted payment partners.' },
  { q: 'Is there any registration fee?', a: 'No. Creating a guide profile is completely free. We only take a small platform fee from confirmed bookings.' },
];

const BecomeGuide: React.FC = () => {
  const navigate = useNavigate();
  const { guides, loading, prepend } = useGuides();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scrollToForm = () => {
    document.getElementById('guide-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      {/* Sticky back bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Become a Local Guide
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-24 w-[28rem] h-[28rem] bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/60 shadow-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="text-purple-600" size={16} />
            <span className="text-xs font-bold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EARN WITH TRAVEL BUDDY
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
            Turn Your City Into{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Income
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Share what you love about your hometown with travelers from around the world — and get paid for every story, walk and meal you host.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {[
              { icon: Wallet, label: '₹5k–₹50k/mo' },
              { icon: Users, label: 'Global travelers' },
              { icon: Award, label: 'Earn from skills' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-full px-4 py-2 shadow-sm">
                <b.icon size={16} className="text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">{b.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={scrollToForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
          >
            <UserPlus size={18} /> Register Now
          </button>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Choose Your Guide Role</h2>
          <p className="text-gray-600">Register as the kind of expert you already are</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {guideRoles.map((r, i) => (
            <button
              key={i}
              onClick={scrollToForm}
              className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <r.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{r.label}</h3>
              <p className="text-xs text-gray-500">Tap to register</p>
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic guides list */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Meet Our Guides</h2>
              <p className="text-gray-600">Real people, real income — be the next.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
              <TrendingUp size={14} /> {guides.length} active guides
            </span>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <GuideCardSkeleton key={i} />)}
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <UserPlus size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Be the first guide!</h3>
              <p className="text-gray-600 mb-6">No guides registered yet. Get featured at the top.</p>
              <button
                onClick={scrollToForm}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 rounded-full font-semibold hover:shadow-xl transition-all"
              >
                Register Now
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((g) => <GuideCard key={g.id} guide={g} />)}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-600">Start earning in three simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: UserPlus, step: '01', title: 'Create Your Profile', desc: 'Add your skills, languages and tour categories. Get verified in under 24 hours.' },
            { icon: Calendar, step: '02', title: 'Get Bookings', desc: 'Travelers discover and book you directly through Travel Buddy. Manage your calendar.' },
            { icon: Wallet, step: '03', title: 'Earn Money', desc: 'Get paid securely after every tour. Withdraw anytime to your bank account.' },
          ].map((s, i) => (
            <div key={i} className="relative bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group">
              <span className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm px-3 py-1 rounded-full shadow-md">{s.step}</span>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                <s.icon size={26} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Registration form */}
      <section id="guide-form" className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Register as a Guide</h2>
            <p className="text-gray-600">Fill in your details and start earning this week</p>
          </div>
          <GuideRegistrationForm onSuccess={prepend} />
        </div>
      </section>

      {/* Safety */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-3xl p-10 lg:p-14 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl" />
          <div className="relative grid lg:grid-cols-4 gap-8 items-center">
            <div className="lg:col-span-1">
              <h3 className="text-3xl font-bold mb-3">Safety & Trust</h3>
              <p className="text-blue-100 text-sm">Built-in protection for every guide and traveler.</p>
            </div>
            <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: BadgeCheck, label: 'Verified Profiles' },
                { icon: CreditCard, label: 'Trusted Payments' },
                { icon: Shield, label: 'Secure Bookings' },
                { icon: Star, label: 'Review System' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300">
                  <s.icon size={26} className="mb-3" />
                  <p className="font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Guide FAQs</h2>
          <p className="text-gray-600">Everything you need to know before signing up</p>
        </div>
        <div className="space-y-4">
          {guideFaqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-white/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base lg:text-lg font-semibold text-gray-800">{f.q}</span>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 shrink-0 ml-3 ${isOpen ? 'rotate-180' : ''}`}
                    size={22}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-gray-600 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default BecomeGuide;
