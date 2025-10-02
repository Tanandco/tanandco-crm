import { useLocation } from 'wouter';
import { ArrowLeft, Calendar, Clock, CreditCard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Services() {
  const [, navigate] = useLocation();

  const handleBackToMain = () => {
    navigate('/');
  };

  const handleBookService = (serviceType: string) => {
    // TODO: Implement service booking logic
  };

  const services = [
    {
      id: 'sun-beds',
      title: 'מיטות שיזוף',
      description: 'שיזוף מקצועי במיטות חדישות',
      duration: '20-30 דקות',
      price: '50-80 ₪'
    },
    {
      id: 'spray-tan',
      title: 'שיזוף בהתזה',
      description: 'שיזוף טבעי ובטוח בהתזה',
      duration: '15-20 דקות',
      price: '80-120 ₪'
    },
    {
      id: 'hair-salon',
      title: 'מספרה',
      description: 'שירותי מספרה מקצועיים',
      duration: '30-60 דקות',
      price: '80-200 ₪'
    },
    {
      id: 'cosmetics',
      title: 'קוסמטיקה',
      description: 'טיפולי פנים וקוסמטיקה',
      duration: '45-90 דקות',
      price: '150-300 ₪'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            בחירת שירותים
          </h1>
          <p className="text-xl text-gray-300">
            בחר את השירות הרצוי ותאם תור
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service) => (
            <Card 
              key={service.id}
              className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2 hover:scale-105 transition-transform duration-300"
              style={{
                borderColor: 'rgba(236, 72, 153, 0.6)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
              }}
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white text-center">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-center">
                  {service.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      משך זמן:
                    </span>
                    <span className="text-white font-medium">
                      {service.duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-400">
                      <CreditCard className="h-4 w-4" />
                      מחיר:
                    </span>
                    <span className="text-pink-400 font-bold">
                      {service.price}
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleBookService(service.id)}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  data-testid={`button-book-${service.id}`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  תאום תור
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Button
            onClick={handleBackToMain}
            variant="outline"
            className="border-pink-500/50 text-pink-400 hover:bg-pink-500/20"
            data-testid="button-back-main"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            חזרה לעמוד הראשי
          </Button>
        </div>
      </div>
    </div>
  );
}