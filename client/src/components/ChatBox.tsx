import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send } from "lucide-react";
import Alin from "@/components/Alin";

interface Message {
  from: string;
  text: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
}

interface ChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatBox({ open, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const customerPhone = "customer"; // Default customer

  // Connect to SSE for live updates
  useEffect(() => {
    if (!open) return;
    
    const evtSource = new EventSource("/api/chat/live-updates");
    
    evtSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, {
        from: data.from,
        text: data.text,
        timestamp: new Date(data.timestamp || Date.now()),
        type: 'incoming'
      }]);
    };
    
    return () => evtSource.close();
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      const response = await fetch("/api/chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          recipient: customerPhone, 
          message: input 
        }),
      });
      
      if (response.ok) {
        setMessages(prev => [...prev, {
          from: customerPhone,
          text: input,
          timestamp: new Date(),
          type: 'outgoing'
        }]);
        setInput("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 w-96 h-[500px] z-50 flex flex-col bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border border-[hsl(var(--primary))]/60 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.6),0_0_80px_rgba(236,72,153,.3)] backdrop-blur-xl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--primary))]/40">
        <div className="flex items-center gap-3">
          <Alin size={48} />
          <div>
            <h3 className="text-white font-bold">אלין</h3>
            <p className="text-white/60 text-xs">העוזרת הדיגיטלית שלכם</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-white/60 hover:text-white"
          data-testid="button-close-chat"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
        {messages.length === 0 ? (
          <div className="text-center text-white/60 mt-8">
            <p>היי! 👋</p>
            <p className="mt-2">אני אלין, העוזרת הדיגיטלית שלכם.</p>
            <p className="mt-1">איך אוכל לעזור לכם היום?</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.type === 'outgoing'
                      ? 'bg-[hsl(var(--primary))] text-black'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.type === 'outgoing' ? 'text-black/60' : 'text-white/60'
                  }`}>
                    {msg.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-[hsl(var(--primary))]/40">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="הקלידו הודעה..."
            className="flex-1 bg-white/10 border-[hsl(var(--primary))]/40 text-white placeholder:text-white/40"
            data-testid="input-chat-message"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[hsl(var(--primary))] text-black hover:bg-[hsl(var(--primary))]/90"
            data-testid="button-send-message"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
