import React, { useState } from 'react';
import {
  Sparkles, Clock, Users, Award, MapPin, Star, Shield, CheckCircle2,
  MessageCircle, Camera, Utensils, Mountain, Landmark, BadgeCheck,
  Wallet, CreditCard, UserPlus, Calendar, TrendingUp, ChevronDown,
} from 'lucide-react';

const guideRoles = [
  { icon: MapPin, label: 'Local Guide', color: 'from-blue-500 to-cyan-500' },
  { icon: Camera, label: 'Photographer', color: 'from-pink-500 to-rose-500' },
  { icon: Utensils, label: 'Food Explorer', color: 'from-amber-500 to-orange-500' },
  { icon: Mountain, label: 'Adventure Expert', color: 'from-emerald-500 to-teal-500' },
  { icon: Landmark, label: 'Culture Guide', color: 'from-purple-500 to-indigo-500' },
];

const topGuides = [
  {
    name: 'Aarav Mehta', city: 'Jaipur', rating: 4.9, reviews: 142, price: 650,
    tags: ['Heritage', 'Hindi', 'English'],
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop',
  },
  {
    name: 'Meera Iyer', city: 'Kochi', rating: 4.8, reviews: 98, price: 550,
    tags: ['Food Tours', 'Malayalam', 'English'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
  },
  {
    name: 'Tenzin Norbu', city: 'Leh', rating: 5.0, reviews: 76, price: 900,
    tags: ['Trekking', 'Ladakhi', 'English'],
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
  },
];

const guideFaqs = [
  { q: 'Who can become a guide on Travel Buddy?', a: 'Anyone 18+ with great local knowledge of their city — students, working professionals, photographers, foodies and adventure enthusiasts. Verification is required.' },
  { q: 'How much can I realistically earn?', a: 'Most active guides earn between ₹5,000 – ₹50,000 per month depending on city, hours and tour categories. Top guides in metros cross ₹1 lakh.' },
  { q: 'When do I get paid?', a: 'Payouts are processed securely to your bank account within 24 hours of tour completion via our trusted payment partners.' },
  { q: 'Is there any registration fee?', a: 'No. Creating a guide profile is completely free. We only take a small platform fee from confirmed bookings.' },
];

const BecomeGuideSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number>(0);

  return (
    <section id="become-guide" className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 overflow-hidden">
      {/* Floating gradient blurs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-24 w-[28rem] h-[28rem] bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero block: heading + mockup card ── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-slide-in-up">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/60 shadow-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="text-purple-600" size={16} />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                New • Earn With Travel Buddy
              </span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
              Turn Your City Into{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Income
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Share what you love about your hometown with travelers from around the world — and get paid for every story, walk, and meal you host.
            </p>

            <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg p-5 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Wallet size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average earnings</p>
                <p className="text-xl font-bold text-gray-900">₹5,000 – ₹50,000<span className="text-sm text-gray-500 font-medium">/month</span></p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {[
                { icon: Clock, label: 'Flexible work hours' },
                { icon: Users, label: 'Meet global travelers' },
                { icon: Award, label: 'Earn from your skills' },
                { icon: MapPin, label: 'Showcase your city' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3 hover:shadow-md transition-all duration-200">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    <b.icon size={16} />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3.5 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                <UserPlus size={18} /> Become a Guide
              </button>
              <button className="bg-white/80 backdrop-blur-md border border-gray-200 text-gray-800 px-7 py-3.5 rounded-full font-semibold hover:shadow-lg hover:border-blue-400 transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                <TrendingUp size={18} /> Start Earning
              </button>
            </div>
          </div>

          {/* Mockup guide card */}
          <div className="relative animate-fade-in-delayed">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[2rem] blur-2xl" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl p-6 transform hover:-translate-y-2 transition-all duration-500">
              <div className="flex items-start gap-4 mb-5">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                    alt="Guide avatar"
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">Ananya Rao</h3>
                    <BadgeCheck className="text-blue-500 fill-blue-100" size={20} />
                  </div>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <MapPin size={12} /> Bengaluru, India
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-800 text-sm">4.95</span>
                    <span className="text-gray-500 text-xs">(218 reviews)</span>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Online</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold mb-1">Languages</p>
                  <p className="text-sm font-semibold text-gray-800">EN · HI · KN</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-3">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold mb-1">Expertise</p>
                  <p className="text-sm font-semibold text-gray-800">Heritage · Cafes</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {['Walking Tours', 'Street Food', 'Photography'].map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 font-medium shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Starting at</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹750<span className="text-sm text-gray-500 font-medium">/hr</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <MessageCircle size={18} className="text-gray-700" />
                  </button>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Floating mini cards */}
            <div className="hidden md:flex absolute -left-6 top-12 bg-white/90 backdrop-blur-md border border-white/70 shadow-xl rounded-2xl px-4 py-3 items-center gap-2 animate-bounce-in">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500">New booking</p>
                <p className="text-sm font-bold text-gray-800">+ ₹2,250</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Guide roles ── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Choose Your Guide Role</h3>
            <p className="text-gray-600">Register as the kind of expert you already are</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {guideRoles.map((r, i) => (
              <button
                key={i}
                className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <r.icon size={22} />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{r.label}</h4>
                <p className="text-xs text-gray-500">Tap to register</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Top guides preview ── */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Top Earning Guides</h3>
              <p className="text-gray-600">Real people, real income — be the next.</p>
            </div>
            <button className="text-blue-600 font-semibold hover:text-purple-600 transition-colors">
              View all guides →
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {topGuides.map((g, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                  <img src={g.avatar} alt={g.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-semibold bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-blue-700">
                    <BadgeCheck size={14} /> Verified
                  </span>
                  <div className="absolute bottom-3 left-4 text-white">
                    <h4 className="font-bold text-lg">{g.name}</h4>
                    <p className="text-xs flex items-center gap-1 text-white/90"><MapPin size={12} /> {g.city}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-800">{g.rating}</span>
                      <span className="text-gray-500 text-sm">({g.reviews})</span>
                    </div>
                    <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{g.price}<span className="text-xs text-gray-500 font-medium">/hr</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">How It Works</h3>
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
                <h4 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h4>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Safety / verification ── */}
        <div className="mb-20 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-3xl p-10 lg:p-14 text-white relative overflow-hidden">
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

        {/* ── Testimonials ── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Guides Earning With Us</h3>
            <p className="text-gray-600">Stories from people just like you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Rohan • Udaipur', earn: '₹38k/mo', text: '“Travel Buddy turned my weekend heritage walks into a full-time income. I love every booking.”' },
              { name: 'Lakshmi • Pondicherry', earn: '₹22k/mo', text: '“As a college student, this is the best side income I could ask for. Flexible and fun.”' },
              { name: 'Imran • Old Delhi', earn: '₹54k/mo', text: '“My food walks are now booked weeks in advance. The platform handles everything.”' },
            ].map((t, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-7 border border-white/60 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, k) => <Star key={k} size={16} className="text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-gray-700 italic leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <span className="text-sm font-bold bg-white px-3 py-1 rounded-full text-emerald-600 shadow-sm">{t.earn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Guide FAQs</h3>
            <p className="text-gray-600">Everything you need to know before signing up</p>
          </div>
          <div className="space-y-4">
            {guideFaqs.map((f, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-white/60 transition-colors"
                >
                  <span className="text-base lg:text-lg font-semibold text-gray-800">{f.q}</span>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    size={22}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeGuideSection;
