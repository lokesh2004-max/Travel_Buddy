/**
 * Custom Hook: useBookingData
 * Manages booking state with automatic localStorage synchronization
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';
import { useToast } from '@/hooks/use-toast';

export const useBookingData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    selectedTrip,
    selectedBuddy,
    user,
    setCurrentStep,
    setSelectedTrip,
    setSelectedBuddy,
  } = useBookingStore();

  useEffect(() => {
    // Set current booking step
    setCurrentStep(5);

    // Load trip from localStorage if not in Zustand store
    if (!selectedTrip) {
      const storedTrip = localStorage.getItem('selectedDestination');
      if (storedTrip) {
        try {
          setSelectedTrip(JSON.parse(storedTrip));
        } catch (error) {
          console.error('Failed to parse stored trip:', error);
          redirectToSearch();
        }
      } else {
        redirectToSearch();
      }
    }

    // Load buddy from localStorage if not in Zustand store
    if (!selectedBuddy) {
      const storedBuddy = localStorage.getItem('selectedBuddy');
      if (storedBuddy) {
        try {
          const parsedBuddy = JSON.parse(storedBuddy);
          setSelectedBuddy({
            id: parsedBuddy.id,
            name: parsedBuddy.name,
            image: parsedBuddy.image,
            age: parsedBuddy.age,
            location: parsedBuddy.location,
            bio: parsedBuddy.bio,
            interests: parsedBuddy.interests,
            matchPercentage: parsedBuddy.matchPercentage,
          });
        } catch (error) {
          console.error('Failed to parse stored buddy:', error);
          redirectToBuddy();
        }
      } else {
        redirectToBuddy();
      }
    }
  }, [selectedTrip, selectedBuddy, navigate, setCurrentStep, setSelectedTrip, setSelectedBuddy]);

  const redirectToSearch = () => {
    toast({
      title: 'No Trip Selected',
      description: 'Please select a trip first',
      variant: 'destructive',
    });
    navigate('/search-results');
  };

  const redirectToBuddy = () => {
    toast({
      title: 'No Buddy Selected',
      description: 'Please select a travel buddy',
      variant: 'destructive',
    });
    navigate('/buddy-match');
  };

  return {
    selectedTrip,
    selectedBuddy,
    user,
    isDataReady: Boolean(selectedTrip && selectedBuddy),
  };
};
