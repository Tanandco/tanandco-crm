import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ProductImageProcessorProps {
  onImagesProcessed: (images: string[]) => void;
}

export function ProductImageProcessor({ onImagesProcessed }: ProductImageProcessorProps) {
  const [images, setImages] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = () => {
    onImagesProcessed(images);
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h2 className="text-2xl font-bold text-white">עיבוד תמונות מוצרים</h2>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-pink-500/30 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-pink-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-4">גרור תמונות לכאן או לחץ להעלאה</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button asChild className="bg-gradient-to-r from-pink-600 to-purple-600">
            <span>בחר תמונות</span>
          </Button>
        </label>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-3">תמונות שנבחרו ({images.length})</h3>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={image}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={images.length === 0}
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 disabled:opacity-50"
      >
        עבד תמונות ({images.length})
      </Button>
    </div>
  );
}
