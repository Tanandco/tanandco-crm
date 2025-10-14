import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Instagram, Facebook, Upload, Image as ImageIcon } from 'lucide-react';

export default function SocialDemo() {
  const [step, setStep] = useState(1);
  const [selectedPage, setSelectedPage] = useState('');
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const pages = [
    { id: '1', name: 'Tan & Co - תאן אנד קו', platform: 'Instagram', followers: '12.5K' },
    { id: '2', name: 'Tan & Co Official', platform: 'Facebook', followers: '8.3K' },
  ];

  const sampleImages = [
    { id: '1', url: '/IMG_9288_1760435215183.png', label: 'לפני - Browlift' },
    { id: '2', url: '/IMG_9289_1760435215183.png', label: 'אחרי - Eyebrows Shaping' },
  ];

  const handleSelectPage = (pageId: string) => {
    setSelectedPage(pageId);
  };

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleSubmit = () => {
    setStep(4);
    // Simulate posting
    setTimeout(() => {
      setStep(5);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900/20 via-black to-purple-900/20 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Tan & Co CRM
          </h1>
          <p className="text-gray-400">שתף תוצאות מדהימות לרשתות החברתיות</p>
        </div>

        {/* Step 1: Select Page */}
        {step === 1 && (
          <Card className="bg-black/40 border-pink-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Instagram className="w-6 h-6 text-pink-400" />
                בחר עמוד לפרסום
              </CardTitle>
              <CardDescription className="text-gray-400">
                בחר את העמוד שאליו תרצה לפרסם את התוצאות
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => handleSelectPage(page.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPage === page.id
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-gray-700 bg-gray-900/50 hover:border-pink-500/50'
                    }`}
                    data-testid={`select-page-${page.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {page.platform === 'Instagram' ? (
                          <Instagram className="w-8 h-8 text-pink-400" />
                        ) : (
                          <Facebook className="w-8 h-8 text-blue-400" />
                        )}
                        <div>
                          <p className="text-white font-semibold">{page.name}</p>
                          <p className="text-sm text-gray-400">{page.followers} עוקבים</p>
                        </div>
                      </div>
                      {selectedPage === page.id && (
                        <CheckCircle2 className="w-6 h-6 text-pink-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleNext}
                disabled={!selectedPage}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                data-testid="button-next-step1"
              >
                המשך
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Select Image */}
        {step === 2 && (
          <Card className="bg-black/40 border-pink-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-pink-400" />
                בחר תמונה
              </CardTitle>
              <CardDescription className="text-gray-400">
                בחר את התמונה שתרצה לשתף
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {sampleImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => handleSelectImage(img.url)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img.url
                        ? 'border-pink-500 ring-2 ring-pink-500/50'
                        : 'border-gray-700 hover:border-pink-500/50'
                    }`}
                    data-testid={`select-image-${img.id}`}
                  >
                    <img 
                      src={img.url} 
                      alt={img.label}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                      <p className="text-white text-sm text-center">{img.label}</p>
                    </div>
                    {selectedImage === img.url && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-6 h-6 text-pink-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
                data-testid="button-back-step2"
              >
                חזור
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedImage}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                data-testid="button-next-step2"
              >
                המשך
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Add Text */}
        {step === 3 && (
          <Card className="bg-black/40 border-pink-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">הוסף טקסט לפוסט</CardTitle>
              <CardDescription className="text-gray-400">
                כתוב את הטקסט שילווה את התמונה
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-text" className="text-white">טקסט הפוסט</Label>
                <Textarea
                  id="post-text"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="תוצאה מדהימה של Browlift ב-Tan & Co! ✨"
                  className="bg-gray-900/50 border-gray-700 text-white min-h-32"
                  data-testid="input-post-text"
                />
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">תצוגה מקדימה:</p>
                {selectedImage && (
                  <img 
                    src={selectedImage} 
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="text-white">{postText || 'הטקסט שלך יופיע כאן...'}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1"
                data-testid="button-back-step3"
              >
                חזור
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!postText}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                data-testid="button-publish"
              >
                פרסם עכשיו
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Publishing */}
        {step === 4 && (
          <Card className="bg-black/40 border-pink-500/30 backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto"></div>
                <h3 className="text-2xl font-bold text-white">מפרסם...</h3>
                <p className="text-gray-400">הפוסט שלך מועלה לרשתות החברתיות</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto" />
                <h3 className="text-3xl font-bold text-white">פורסם בהצלחה! 🎉</h3>
                <p className="text-gray-400">הפוסט שלך פורסם לעמוד {pages.find(p => p.id === selectedPage)?.name}</p>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 text-right">
                  <div className="flex items-center gap-3 mb-3">
                    <Instagram className="w-8 h-8 text-pink-400" />
                    <div>
                      <p className="text-white font-semibold">{pages.find(p => p.id === selectedPage)?.name}</p>
                      <p className="text-sm text-gray-400">עכשיו ב-Instagram</p>
                    </div>
                  </div>
                  {selectedImage && (
                    <img 
                      src={selectedImage} 
                      alt="Posted"
                      className="w-full rounded-lg mb-3"
                    />
                  )}
                  <p className="text-white">{postText}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  setStep(1);
                  setSelectedPage('');
                  setSelectedImage('');
                  setPostText('');
                }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                data-testid="button-post-another"
              >
                פרסם עוד פוסט
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Footer - Replit Badge */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Built on <span className="text-pink-400 font-semibold">Replit</span> • Tan & Co CRM
          </p>
        </div>
      </div>
    </div>
  );
}
