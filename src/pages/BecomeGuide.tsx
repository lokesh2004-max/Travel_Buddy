import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BecomeGuideSection from '@/components/BecomeGuideSection';

const BecomeGuide: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white animate-fade-in">
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
      <BecomeGuideSection />
    </div>
  );
};

export default BecomeGuide;
