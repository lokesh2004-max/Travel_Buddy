import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    image: string;
    value: string;
  }[];
}

const Queera = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Travel preference questions with personality
  const questions: Question[] = [
    {
      id: 'travel_style',
      question: 'What\'s your ideal travel style?',
      options: [
        {
          id: 'adventure',
          text: 'Adventure & Thrills',
          image: '🏔️',
          value: 'adventure'
        },
        {
          id: 'relaxation',
          text: 'Chill & Relaxation',
          image: '🏖️',
          value: 'relaxation'
        },
        {
          id: 'culture',
          text: 'Culture & History',
          image: '🏛️',
          value: 'culture'
        },
        {
          id: 'nightlife',
          text: 'Nightlife & Party',
          image: '🎉',
          value: 'nightlife'
        }
      ]
    },
    {
      id: 'budget',
      question: 'What\'s your travel budget preference?',
      options: [
        {
          id: 'budget',
          text: 'Budget Traveler',
          image: '💰',
          value: 'budget'
        },
        {
          id: 'mid_range',
          text: 'Mid-Range Explorer',
          image: '💳',
          value: 'mid-range'
        },
        {
          id: 'luxury',
          text: 'Luxury Seeker',
          image: '💎',
          value: 'luxury'
        },
        {
          id: 'flexible',
          text: 'Flexible Spender',
          image: '🎯',
          value: 'flexible'
        }
      ]
    },
    {
      id: 'accommodation',
      question: 'Where do you prefer to stay?',
      options: [
        {
          id: 'hostel',
          text: 'Hostels & Shared Spaces',
          image: '🏠',
          value: 'hostel'
        },
        {
          id: 'hotel',
          text: 'Hotels & Resorts',
          image: '🏨',
          value: 'hotel'
        },
        {
          id: 'airbnb',
          text: 'Airbnb & Local Stays',
          image: '🏡',
          value: 'airbnb'
        },
        {
          id: 'camping',
          text: 'Camping & Outdoors',
          image: '⛺',
          value: 'camping'
        }
      ]
    },
    {
      id: 'group_size',
      question: 'What\'s your ideal group size?',
      options: [
        {
          id: 'solo_plus_one',
          text: 'Just You & Me',
          image: '👥',
          value: 'duo'
        },
        {
          id: 'small_group',
          text: 'Small Group (3-4)',
          image: '👨‍👩‍👦',
          value: 'small'
        },
        {
          id: 'medium_group',
          text: 'Medium Group (5-8)',
          image: '👥👥',
          value: 'medium'
        },
        {
          id: 'large_group',
          text: 'Big Adventure Squad',
          image: '👥👥👥',
          value: 'large'
        }
      ]
    },
    {
      id: 'destination',
      question: 'What type of destination calls to you?',
      options: [
        {
          id: 'beach',
          text: 'Tropical Beaches',
          image: '🏖️',
          value: 'beach'
        },
        {
          id: 'mountains',
          text: 'Mountain Adventures',
          image: '⛰️',
          value: 'mountains'
        },
        {
          id: 'cities',
          text: 'Vibrant Cities',
          image: '🏙️',
          value: 'cities'
        },
        {
          id: 'nature',
          text: 'Wild Nature',
          image: '🌲',
          value: 'nature'
        }
      ]
    }
  ];

  const handleOptionSelect = (optionValue: string) => {
    if (isAnimating) return;
    
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: optionValue
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Quiz completed, navigate to results
      localStorage.setItem('queeraAnswers', JSON.stringify(newAnswers));
      navigate('/buddy-match');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-up">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute top-8 left-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Let's Find Your Perfect
            <span className="block ocean-gradient bg-clip-text text-transparent">
              Travel Buddy! ✈️
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Answer a few fun questions to match with amazing travel companions
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Question Card */}
        <Card className={`card-shadow border-0 transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'} animate-bounce-in`}>
          <CardContent className="p-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
              {questions[currentQuestion].question}
            </h2>
            
            {/* Options Grid */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {questions[currentQuestion].options.map((option, index) => (
                <Card
                  key={option.id}
                  className={`card-hover cursor-pointer border-2 transition-all duration-300 ${
                    answers[questions[currentQuestion].id] === option.value
                      ? 'border-primary bg-primary/5 scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleOptionSelect(option.value)}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{option.image}</div>
                    <h3 className="font-semibold text-lg">{option.text}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Select an option to continue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Queera;