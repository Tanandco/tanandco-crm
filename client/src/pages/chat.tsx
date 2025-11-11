import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface Message {
  from: string;
  text: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
}

interface Contact {
  phone: string;
  name?: string;
  lastMessage?: string;
  unreadCount?: number;
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Connect to SSE for live updates
  useEffect(() => {
    const evtSource = new EventSource("/api/chat/live-updates");
    
    evtSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, {
        from: data.from,
        text: data.text,
        timestamp: new Date(data.timestamp || Date.now()),
        type: 'incoming'
      }]);
      
      // Update contacts list
      setContacts((prev) => {
        const existing = prev.find(c => c.phone === data.from);
        if (existing) {
          return prev.map(c => 
            c.phone === data.from 
              ? { ...c, lastMessage: data.text }
              : c
          );
        } else {
          return [...prev, { 
            phone: data.from, 
            lastMessage: data.text 
          }];
        }
      });
    };
    
    return () => evtSource.close();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !selectedContact) return;
    
    try {
      const response = await fetch("/api/chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          recipient: selectedContact, 
          message: input 
        }),
      });
      
      if (response.ok) {
        // Add to local messages
        setMessages(prev => [...prev, {
          from: selectedContact,
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

  const selectedMessages = messages.filter(
    m => m.from === selectedContact
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-4">
        <div>
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            size="icon"
            data-testid="button-back"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 flex gap-4">
          {/* Contacts Sidebar */}
          <Card className="w-80 flex flex-col bg-slate-800/50 border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-pink-500" />
                צ'אט WhatsApp
              </h2>
            </div>
            
            <ScrollArea className="flex-1">
              {contacts.length === 0 ? (
                <div className="p-4 text-center text-slate-400">
                  אין שיחות פעילות
                </div>
              ) : (
                <div className="p-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.phone}
                      data-testid={`contact-${contact.phone}`}
                      className={`p-3 mb-2 rounded-lg cursor-pointer transition-all hover-elevate ${
                        selectedContact === contact.phone
                          ? "bg-pink-500/20 border border-pink-500/50"
                          : "bg-slate-700/30"
                      }`}
                      onClick={() => setSelectedContact(contact.phone)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-pink-500">
                            {contact.name?.[0] || contact.phone[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white">
                            {contact.name || contact.phone}
                          </div>
                          {contact.lastMessage && (
                            <div className="text-sm text-slate-400 truncate">
                              {contact.lastMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col bg-slate-800/50 border-slate-700">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700 bg-slate-800/80">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-pink-500">
                      {selectedContact[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-white">
                      {selectedContact}
                    </div>
                    <div className="text-sm text-slate-400">
                      WhatsApp
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {selectedMessages.length === 0 ? (
                  <div className="text-center text-slate-400 mt-8">
                    אין הודעות עדיין
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedMessages.map((msg, i) => (
                      <div
                        key={i}
                        data-testid={`message-${i}`}
                        className={`flex ${
                          msg.type === 'outgoing' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-2xl ${
                            msg.type === 'outgoing'
                              ? 'bg-pink-500 text-white'
                              : 'bg-slate-700 text-white'
                          }`}
                        >
                          <div className="text-sm">{msg.text}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString('he-IL', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-700 bg-slate-800/80">
                <div className="flex gap-2">
                  <Input
                    data-testid="input-message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="הקלד הודעה..."
                    className="flex-1 bg-slate-700 border-slate-600 text-white"
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button
                    data-testid="button-send"
                    onClick={handleSend}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              בחר איש קשר כדי להתחיל שיחה
            </div>
          )}
        </Card>
        </div>
      </div>
    </div>
  );
}
