import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  Heart,
  Download,
  Mail,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import ProgressBar from '@/components/ProgressBar';

const BOOKING_STEPS = [
  { number: 1, name: 'Search', description: 'Find trips' },
  { number: 2, name: 'Login', description: 'Sign in' },
  { number: 3, name: 'Quiz', description: 'Preferences' },
  { number: 4, name: 'Buddy', description: 'Find match' },
  { number: 5, name: 'Book', description: 'Confirm' },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    selectedTrip,
    selectedBuddy,
    user,
    quizAnswers,
    setCurrentStep,
    setSelectedTrip,
    setSelectedBuddy,
  } = useBookingStore();

  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userName, setUserName] = useState(user?.name || '');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    setCurrentStep(5);

    // Try to load from localStorage if Zustand store is empty
    if (!selectedTrip) {
      const storedTrip = localStorage.getItem('selectedDestination');
      if (storedTrip) {
        setSelectedTrip(JSON.parse(storedTrip));
      } else {
        toast({
          title: 'No Trip Selected',
          description: 'Please select a trip first',
          variant: 'destructive',
        });
        navigate('/search-results');
        return;
      }
    }

    if (!selectedBuddy) {
      const storedBuddy = localStorage.getItem('selectedBuddy');
      if (storedBuddy) {
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
      } else {
        toast({
          title: 'No Buddy Selected',
          description: 'Please select a travel buddy',
          variant: 'destructive',
        });
        navigate('/buddy-match');
        return;
      }
    }
  }, [selectedTrip, selectedBuddy, navigate, setCurrentStep, toast, setSelectedTrip, setSelectedBuddy]);

  // Generate PDF Itinerary
  const generatePDF = (): Blob | null => {
    if (!selectedTrip || !selectedBuddy) return null;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Header
      doc.setFillColor(66, 135, 245);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Travel Booking Itinerary', pageWidth / 2, 25, { align: 'center' });

      yPosition = 50;
      doc.setTextColor(0, 0, 0);

      // Trip Details Section
      doc.setFontSize(18);
      doc.setTextColor(66, 135, 245);
      doc.text('Trip Details', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Destination: ${selectedTrip.emoji} ${selectedTrip.name}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Duration: ${selectedTrip.duration}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Cost: ${selectedTrip.approximateCost}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Rating: ${selectedTrip.rating} ⭐`, 20, yPosition);
      yPosition += 10;

      // Description
      doc.setFontSize(10);
      const splitDescription = doc.splitTextToSize(selectedTrip.description, pageWidth - 40);
      doc.text(splitDescription, 20, yPosition);
      yPosition += splitDescription.length * 5 + 10;

      // Trip Highlights
      doc.setFontSize(14);
      doc.setTextColor(66, 135, 245);
      doc.text('Trip Highlights', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      selectedTrip.tripHighlights.slice(0, 5).forEach((highlight) => {
        doc.text(`• ${highlight}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 5;

      // Travel Buddy Section
      doc.setFontSize(18);
      doc.setTextColor(66, 135, 245);
      doc.text('Your Travel Buddy', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${selectedBuddy.name}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Age: ${selectedBuddy.age}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Location: ${selectedBuddy.location}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Match Percentage: ${selectedBuddy.matchPercentage}%`, 20, yPosition);
      yPosition += 10;

      // Buddy Bio
      doc.setFontSize(10);
      const splitBio = doc.splitTextToSize(selectedBuddy.bio, pageWidth - 40);
      doc.text(splitBio, 20, yPosition);
      yPosition += splitBio.length * 5 + 8;

      // Buddy Interests
      doc.setFontSize(12);
      doc.text('Interests:', 20, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.text(selectedBuddy.interests.join(', '), 25, yPosition);
      yPosition += 10;

      // Customer Details
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(18);
      doc.setTextColor(66, 135, 245);
      doc.text('Customer Details', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${userName}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Email: ${userEmail}`, 20, yPosition);
      yPosition += 15;

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        'Thank you for choosing us! We hope you have an amazing journey!',
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: 'center' }
      );

      return doc.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'PDF Generation Failed',
        description: 'Unable to generate itinerary PDF',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Download PDF
  const handleDownloadPDF = () => {
    if (!selectedTrip) return;

    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      const pdfBlob = generatePDF();

      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedTrip.name.replace(/\s+/g, '-')}-Itinerary.pdf`;
        link.click();
        URL.revokeObjectURL(url);

        toast({
          title: 'PDF Downloaded!',
          description: 'Your itinerary has been saved',
        });
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Send Email with Supabase Edge Function
  const handleSendEmail = async () => {
    if (!userEmail || !userName) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your name and email',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingEmail(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          userEmail,
          userName,
          trip: {
            name: selectedTrip.name,
            duration: selectedTrip.duration,
            approximateCost: selectedTrip.approximateCost,
            description: selectedTrip.description,
            tripHighlights: selectedTrip.tripHighlights,
          },
          buddy: {
            name: selectedBuddy.name,
            age: selectedBuddy.age,
            location: selectedBuddy.location,
            bio: selectedBuddy.bio,
            interests: selectedBuddy.interests,
            matchPercentage: selectedBuddy.matchPercentage,
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Email Sent! ✉️',
        description: 'Booking confirmation sent to your email',
      });

      setBookingConfirmed(true);
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: 'Email Failed',
        description: 'Booking confirmed but email could not be sent',
        variant: 'default',
      });
      
      // Still confirm booking even if email fails
      setBookingConfirmed(true);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Confirm Booking (Download + Email)
  const handleConfirmBooking = async () => {
    handleDownloadPDF();
    await handleSendEmail();
  };

  if (!selectedTrip || !selectedBuddy) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <ProgressBar currentStep={5} steps={BOOKING_STEPS} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/destination-recommendations')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {bookingConfirmed ? (
          // Success State
          <Card className="max-w-2xl mx-auto text-center p-12">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-24 w-24 text-success animate-scale-in" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your travel itinerary has been sent to <strong>{userEmail}</strong>
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/')}
              className="ocean-gradient hover:opacity-90 card-shadow"
            >
              Back to Home
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Trip & Buddy Details */}
            <div className="space-y-6">
              {/* Trip Card */}
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={selectedTrip.imageUrl}
                    alt={selectedTrip.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                      <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                      {selectedTrip.rating}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {selectedTrip.emoji} {selectedTrip.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{selectedTrip.description}</p>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">{selectedTrip.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm">{selectedTrip.approximateCost}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Trip Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrip.tripHighlights.map((highlight, idx) => (
                        <Badge key={idx} variant="secondary">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buddy Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Your Travel Buddy
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{selectedBuddy.image}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedBuddy.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedBuddy.age} years • {selectedBuddy.location}
                      </p>
                      <Badge className="mt-1 ocean-gradient">
                        {selectedBuddy.matchPercentage}% Match
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{selectedBuddy.bio}</p>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Common Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBuddy.interests.slice(0, 5).map((interest, idx) => (
                        <Badge key={idx} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Your Booking</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button
                      className="w-full ocean-gradient hover:opacity-90 card-shadow animate-bounce-in"
                      size="lg"
                      onClick={handleConfirmBooking}
                      disabled={
                        !userName ||
                        !userEmail ||
                        isGeneratingPDF ||
                        isSendingEmail
                      }
                    >
                      {isSendingEmail ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isGeneratingPDF ? 'Generating...' : 'Download Itinerary'}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By confirming, you agree to receive booking details via email
                  </p>
                </CardContent>
              </Card>

              {/* EmailJS Configuration Notice */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex gap-2">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Email Configuration Required</p>
                      <p className="text-muted-foreground text-xs">
                        To enable email confirmations, configure EmailJS in{' '}
                        <code className="bg-background px-1 rounded">
                          BookingPage.tsx
                        </code>{' '}
                        with your service ID, template ID, and public key.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
