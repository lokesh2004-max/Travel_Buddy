import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProgressBar from '@/components/ProgressBar';

// Image imports
import adventureImg from '@/assets/quiz/adventure.jpg';
import relaxationImg from '@/assets/quiz/relaxation.jpg';
import cultureImg from '@/assets/quiz/culture.jpg';
import nightlifeImg from '@/assets/quiz/nightlife.jpg';
import budgetImg from '@/assets/quiz/budget.jpg';
import midRangeImg from '@/assets/quiz/mid_range.jpg';
import luxuryImg from '@/assets/quiz/luxury.jpg';
import flexibleImg from '@/assets/quiz/flexible.jpg';
import hostelImg from '@/assets/quiz/hostel.jpg';
import hotelImg from '@/assets/quiz/hotel.jpg';
import airbnbImg from '@/assets/quiz/airbnb.jpg';
import campingImg from '@/assets/quiz/camping.jpg';
import duoImg from '@/assets/quiz/duo.jpg';
import smallGroupImg from '@/assets/quiz/small_group.jpg';
import mediumGroupImg from '@/assets/quiz/medium_group.jpg';
import largeGroupImg from '@/assets/quiz/large_group.jpg';
import beachImg from '@/assets/quiz/beach.jpg';
import mountainsImg from '@/assets/quiz/mountains.jpg';
import citiesImg from '@/assets/quiz/cities.jpg';
import natureImg from '@/assets/quiz/nature.jpg';

const BOOKING_STEPS = [
  { number: 1, name: 'Search', description: 'Find trips' },
  { number: 2, name: 'Login', description: 'Sign in' },
  { number: 3, name: 'Quiz', description: 'Preferences' },
  { number: 4, name: 'Buddy', description: 'Find match' },
  { number: 5, name: 'Book', description: 'Confirm' },
];

interface QuizOption {
  id: string;
  text: string;
  image: string;
  value: string;
}

interface Question {
  id: string;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

const questions: Question[] = [
  {
    id: 'travel_style',
    question: "What's your ideal travel style?",
    subtitle: 'Choose the vibe that speaks to your soul',
    options: [
      { id: 'adventure', text: 'Adventure & Thrills', image: adventureImg, value: 'adventure' },
      { id: 'relaxation', text: 'Chill & Relaxation', image: relaxationImg, value: 'relaxation' },
      { id: 'culture', text: 'Culture & History', image: cultureImg, value: 'culture' },
      { id: 'nightlife', text: 'Nightlife & Party', image: nightlifeImg, value: 'nightlife' },
    ],
  },
  {
    id: 'budget',
    question: "What's your travel budget?",
    subtitle: 'Every budget unlocks amazing experiences',
    options: [
      { id: 'budget', text: 'Budget Traveler', image: budgetImg, value: 'budget' },
      { id: 'mid_range', text: 'Mid-Range Explorer', image: midRangeImg, value: 'mid_range' },
      { id: 'luxury', text: 'Luxury Seeker', image: luxuryImg, value: 'luxury' },
      { id: 'flexible', text: 'Flexible Spender', image: flexibleImg, value: 'flexible' },
    ],
  },
  {
    id: 'accommodation',
    question: 'Where do you prefer to stay?',
    subtitle: 'Your home away from home matters',
    options: [
      { id: 'hostel', text: 'Hostels & Shared', image: hostelImg, value: 'hostel' },
      { id: 'hotel', text: 'Hotels & Resorts', image: hotelImg, value: 'hotel' },
      { id: 'airbnb', text: 'Airbnb & Local Stays', image: airbnbImg, value: 'airbnb' },
      { id: 'camping', text: 'Camping & Outdoors', image: campingImg, value: 'camping' },
    ],
  },
  {
    id: 'group_size',
    question: "What's your ideal group size?",
    subtitle: 'More the merrier or intimate vibes?',
    options: [
      { id: 'duo', text: 'Just You & Me', image: duoImg, value: 'duo' },
      { id: 'small', text: 'Small Group (3-4)', image: smallGroupImg, value: 'small' },
      { id: 'medium', text: 'Medium Group (5-8)', image: mediumGroupImg, value: 'medium' },
      { id: 'large', text: 'Big Adventure Squad', image: largeGroupImg, value: 'large' },
    ],
  },
  {
    id: 'destination_type',
    question: 'What destination calls to you?',
    subtitle: 'Close your eyes... where do you see yourself?',
    options: [
      { id: 'beach', text: 'Tropical Beaches', image: beachImg, value: 'beach' },
      { id: 'mountains', text: 'Mountain Adventures', image: mountainsImg, value: 'mountains' },
      { id: 'cities', text: 'Vibrant Cities', image: citiesImg, value: 'cities' },
      { id: 'nature', text: 'Wild Nature', image: natureImg, value: 'nature' },
    ],
  },
];

const motivationalTexts = [
  "Let's discover your travel personality! ✨",
  "Great choice! Keep going... 🚀",
  "You're building your perfect trip! 🌍",
  "Almost there! One more question... 🎯",
  "Finding your perfect travel vibe... ✈️",
];

const Queera = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedTrip, setQuizAnswers, setCurrentStep } = useBookingStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => { setCurrentStep(3); }, [setCurrentStep]);

  const saveToSupabase = useCallback(async (finalAnswers: Record<string, string>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('quiz_answers').upsert({
      user_id: user.id,
      travel_style: finalAnswers.travel_style ?? null,
      budget: finalAnswers.budget ?? null,
      accommodation: finalAnswers.accommodation ?? null,
      group_size: finalAnswers.group_size ?? null,
      destination_type: finalAnswers.destination_type ?? null,
    }, { onConflict: 'user_id' });
  }, []);

  const handleOptionSelect = async (optionValue: string) => {
    if (isAnimating || isSaving) return;

    const newAnswers = { ...answers, [questions[currentQuestion].id]: optionValue };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => { setCurrentQuestion(q => q + 1); setIsAnimating(false); }, 400);
    } else {
      setIsSaving(true);
      setQuizAnswers(newAnswers);
      await saveToSupabase(newAnswers);
      setIsSaving(false);
      toast({ title: 'Quiz completed! 🎉', description: "Let's find your perfect travel buddy" });
      navigate('/buddy-match');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => { setCurrentQuestion(q => q - 1); setIsAnimating(false); }, 300);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const q = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <ProgressBar currentStep={3} steps={BOOKING_STEPS} />

      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute top-20 left-4 md:left-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Question {currentQuestion + 1} of {questions.length}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-foreground">
            {q.question}
          </h1>
          <p className="text-muted-foreground text-lg">
            {q.subtitle}
          </p>

          {/* Progress */}
          <div className="max-w-sm mx-auto mt-6">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {motivationalTexts[currentQuestion]}
            </p>
          </div>
        </div>

        {/* Option Cards */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-4xl mx-auto transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {q.options.map((option, index) => {
            const isSelected = answers[q.id] === option.value;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.value)}
                className="group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Background Image */}
                <img
                  src={option.image}
                  alt={option.text}
                  loading="lazy"
                  width={640}
                  height={512}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                    isSelected ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-t from-primary/80 via-primary/30 to-primary/10'
                    : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60'
                }`} />

                {/* Glassmorphism border glow */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-3xl ring-4 ring-primary/60 shadow-[0_0_30px_rgba(var(--primary),0.3)]" />
                )}

                {/* Check badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-bounce-in z-10">
                    <Check className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className={`font-bold text-sm md:text-base leading-tight transition-colors duration-300 ${
                    isSelected ? 'text-primary-foreground' : 'text-white'
                  }`}>
                    {option.text}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isAnimating}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <p className="text-sm text-muted-foreground">
            {isSaving ? 'Saving your answers…' : 'Tap a card to continue'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Queera;
