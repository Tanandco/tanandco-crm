import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lock } from 'lucide-react';

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function PasswordDialog({ open, onOpenChange, onSuccess }: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password check - you can change this to whatever you need
    const correctPassword = '1234'; // You can change this or use environment variable
    
    if (password === correctPassword) {
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setError('סיסמא שגויה');
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[hsla(var(--primary)/0.6)] text-white backdrop-blur-xl"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-[hsl(var(--primary))]" />
            <span>כניסה למערכת</span>
          </DialogTitle>
          <DialogDescription className="text-center text-white/70">
            הזן סיסמא לחזרה למסך הראשי
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="הזן סיסמא"
              className="bg-gray-900/50 border-[hsla(var(--primary)/0.4)] text-white text-center text-lg h-12"
              autoFocus
              data-testid="input-password"
            />
            {error && (
              <p className="text-red-400 text-sm text-center" data-testid="text-error">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
              data-testid="button-cancel"
            >
              ביטול
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-black font-bold"
              data-testid="button-submit-password"
            >
              אישור
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
