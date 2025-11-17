import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Search, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ManualEntry() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handleBackToFaceId = () => {
    navigate('/face-id');
  };

  const handleSearch = () => {
    // TODO: Implement customer search logic
  };

  const handleContinue = () => {
    // TODO: Validate and proceed to services
    navigate('/services');
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            הזנת פרטי לקוח
          </h1>
          <p className="text-xl text-gray-300">
            חפש לקוח קיים או הזן פרטים חדשים
          </p>
        </div>

        <div className="space-y-6">
          {/* Customer Search */}
          <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2"
                style={{
                  borderColor: 'rgba(236, 72, 153, 0.6)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
                }}>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                <Search className="h-6 w-6 text-pink-400" />
                חיפוש לקוח קיים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-gray-300">
                  שם, טלפון או אימייל
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="הזן פרטי לקוח לחיפוש..."
                    className="bg-black/50 border-gray-600 text-white"
                    data-testid="input-search"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    data-testid="button-search"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Entry */}
          <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2"
                style={{
                  borderColor: 'rgba(236, 72, 153, 0.6)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
                }}>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                <User className="h-6 w-6 text-pink-400" />
                הזנת פרטים חדשים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  שם מלא *
                </Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="הזן שם מלא..."
                  className="bg-black/50 border-gray-600 text-white"
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">
                  מספר טלפון *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="050-1234567"
                    className="bg-black/50 border-gray-600 text-white pl-10"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  כתובת אימייל
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className="bg-black/50 border-gray-600 text-white pl-10"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <Button
                onClick={handleContinue}
                disabled={!customerData.name || !customerData.phone}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50"
                data-testid="button-continue"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                המשך לבחירת שירותים
              </Button>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="text-center">
            <Button
              onClick={handleBackToFaceId}
              variant="outline"
              className="border-pink-500/50 text-pink-400 hover:bg-pink-500/20"
              data-testid="button-back-face-id"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              חזרה לזיהוי פנים
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
