

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AdminSeedProducts() {
  const [result, setResult] = useState<any>(null);

  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/seed/tanning-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to seed products');
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Seed Tanning Products</h1>

        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <p className="text-gray-300 mb-6">
            This will add the three tanning product images to the database:
          </p>
          <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2">
            <li>Thatso Spray Tan</li>
            <li>Jet Set Sun Tanning Lotion</li>
            <li>Glam Body Extra Dark Bronzer</li>
          </ul>

          <Button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600"
          >
            {seedMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Seeding Products...
              </>
            ) : (
              'Seed Products'
            )}
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="font-semibold text-white">
                  {result.success ? 'Success!' : 'Failed'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">Created: {result.data?.created || 0}</p>
                <p className="text-gray-300">Skipped: {result.data?.skipped || 0}</p>
                {result.data?.errors && result.data.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-red-400 font-semibold mb-2">Errors:</p>
                    <ul className="list-disc list-inside text-red-300">
                      {result.data.errors.map((err: string, idx: number) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        <div className="mt-8">
          <p className="text-gray-400 text-sm text-center">
            After seeding, the products will appear in the TanningProductCarousel
          </p>
        </div>
      </div>
    </div>
  );
}
