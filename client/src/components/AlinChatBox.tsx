import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AlinChatBoxProps {
  isSelfServicePage?: boolean;
  contextMessage?: string;
}

export default function AlinChatBox({ isSelfServicePage = false, contextMessage }: AlinChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { 
      text: contextMessage || 'היי! אני אלין, עוזרת וירטואלית של Tan & Co. איך אני יכולה לעזור לך היום?', 
      sender: 'bot' 
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: 'תודה על הפנייה! אני כאן לעזור. בקרוב נוסיף תכונות נוספות לצ\'אט הזה.', 
        sender: 'bot' 
      }]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="fixed z-40" dir="rtl">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="
            w-[67px] h-[67px] rounded-full 
            bg-gradient-to-r from-pink-600 to-purple-600 
            hover:from-pink-700 hover:to-purple-700
            shadow-lg hover:shadow-xl
            transition-all duration-300
          "
          data-testid="button-chat"
        >
          <MessageCircle className="w-[29px] h-[29px]" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="
            w-80 h-96 
            bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 
            border border-pink-500/30 
            rounded-xl shadow-2xl
            flex flex-col
            backdrop-blur-sm
          "
          data-testid="chat-window"
        >
          {/* Header */}
          <div className="
            flex justify-between items-center 
            p-4 
            border-b border-pink-500/20
            bg-gradient-to-r from-amber-900/30 to-purple-900/30
          ">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">אלין - עוזרת וירטואלית</span>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              data-testid="button-close-chat"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`
                  flex 
                  ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}
                `}
              >
                <div
                  className={`
                    max-w-[80%] p-3 rounded-lg text-sm
                    ${msg.sender === 'user' 
                      ? 'bg-pink-600 text-white' 
                      : 'bg-gray-700 text-gray-100'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-pink-500/20">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="הקלד/י הודעה..."
                className="bg-gray-800 border-gray-600 text-white"
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSend}
                className="bg-pink-600 hover:bg-pink-700"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
