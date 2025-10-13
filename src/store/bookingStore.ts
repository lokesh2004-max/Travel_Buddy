import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Destination {
  id: string;
  name: string;
  emoji: string;
  description: string;
  approximateCost: string;
  duration: string;
  imageUrl: string;
  rating: number;
  tags: string[];
  tripHighlights: string[];
}

interface Buddy {
  id: string;
  name: string;
  image: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  matchPercentage: number;
}

interface User {
  email: string;
  name: string;
}

interface QuizAnswers {
  travel_style?: string;
  budget?: string;
  accommodation?: string;
  group_size?: string;
  destination_type?: string;
}

interface BookingState {
  // Trip selection
  selectedTrip: Destination | null;
  setSelectedTrip: (trip: Destination | null) => void;

  // User info
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;

  // Quiz answers
  quizAnswers: QuizAnswers;
  setQuizAnswers: (answers: QuizAnswers) => void;

  // Buddy selection
  selectedBuddy: Buddy | null;
  setSelectedBuddy: (buddy: Buddy | null) => void;

  // Progress tracking
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Reset all
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      // Initial state
      selectedTrip: null,
      user: null,
      isAuthenticated: false,
      quizAnswers: {},
      selectedBuddy: null,
      currentStep: 1,

      // Actions
      setSelectedTrip: (trip) => set({ selectedTrip: trip }),
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      setQuizAnswers: (answers) => set({ quizAnswers: answers }),
      setSelectedBuddy: (buddy) => set({ selectedBuddy: buddy }),
      setCurrentStep: (step) => set({ currentStep: step }),

      resetBooking: () =>
        set({
          selectedTrip: null,
          user: null,
          isAuthenticated: false,
          quizAnswers: {},
          selectedBuddy: null,
          currentStep: 1,
        }),
    }),
    {
      name: 'booking-storage',
    }
  )
);
