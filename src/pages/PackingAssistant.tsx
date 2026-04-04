import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Luggage, Sparkles } from 'lucide-react';

interface PackingItem {
  name: string;
  checked: boolean;
}

const winterItems = [
  'Heavy jacket', 'Thermal wear', 'Woolen socks', 'Gloves', 'Beanie/Cap',
  'Scarf', 'Boots', 'Moisturizer', 'Lip balm', 'Sunglasses',
  'Warm pajamas', 'Hot water bottle', 'Hand warmers',
];

const summerItems = [
  'Sunscreen SPF 50+', 'Sunglasses', 'Flip flops', 'Swimwear',
  'Light cotton clothes', 'Hat/Cap', 'Shorts', 'Tank tops',
  'Beach towel', 'Aloe vera gel', 'Water bottle', 'Sandals',
];

const generalItems = [
  'Clothes (3-5 sets)', 'Comfortable shoes', 'Toiletries kit',
  'Phone charger & power bank', 'ID & documents', 'Medicines',
  'Water bottle', 'Snacks', 'Sunscreen', 'Umbrella',
  'First aid kit', 'Travel pillow',
];

const winterDestinations = ['manali', 'shimla', 'kashmir', 'leh', 'ladakh', 'darjeeling', 'mussoorie'];
const summerDestinations = ['goa', 'kerala', 'pondicherry', 'andaman', 'lakshadweep', 'mumbai'];

function getPackingItems(destination: string, days: number): string[] {
  const dest = destination.toLowerCase().trim();
  let items: string[];

  if (winterDestinations.some(w => dest.includes(w))) {
    items = [...winterItems];
  } else if (summerDestinations.some(s => dest.includes(s))) {
    items = [...summerItems];
  } else {
    items = [...generalItems];
  }

  if (days > 5) {
    items.push('Laundry bag', 'Extra underwear', 'Travel detergent');
  }
  if (days > 10) {
    items.push('Sewing kit', 'Extra shoes');
  }

  return items;
}

const PackingAssistant = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [packingList, setPackingList] = useState<PackingItem[]>([]);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!destination.trim()) return;
    const items = getPackingItems(destination, days);
    setPackingList(items.map(name => ({ name, checked: false })));
    setGenerated(true);
  };

  const toggleItem = (index: number) => {
    setPackingList(prev =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = packingList.filter(i => i.checked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </Button>
          <Luggage size={24} className="text-primary" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Packing Assistant
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles size={20} className="text-accent" /> Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="e.g. Manali, Goa, Kerala..."
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="days">Number of Days</Label>
                <Input
                  id="days"
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={e => setDays(Number(e.target.value))}
                />
              </div>
            </div>
            <Button
              className="w-full sm:w-auto"
              onClick={handleGenerate}
              disabled={!destination.trim()}
            >
              🧳 Generate Packing List
            </Button>
          </CardContent>
        </Card>

        {generated && (
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Packing List for {destination} ({days} days)
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {checkedCount}/{packingList.length} packed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${packingList.length ? (checkedCount / packingList.length) * 100 : 0}%` }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packingList.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      item.checked ? 'bg-primary/10 border-primary/30 line-through text-muted-foreground' : 'bg-card hover:bg-muted/50'
                    }`}
                    onClick={() => toggleItem(i)}
                  >
                    <Checkbox checked={item.checked} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PackingAssistant;
