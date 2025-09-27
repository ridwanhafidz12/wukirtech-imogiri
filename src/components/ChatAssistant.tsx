import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, MapPin, X, Minimize2, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  recommendation?: {
    name: string;
    description: string;
    coordinates?: [number, number];
  };
}

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Halo! Saya asisten wisata WukirTech. Tanya saya tentang destinasi wisata, produk UMKM, atau informasi lain tentang Desa Wukirsari!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response - in production, integrate with OpenAI/Gemini API
      const response = await generateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        recommendation: response.recommendation
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        title: "Error",
        description: "Maaf, terjadi kesalahan. Coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (message: string): Promise<{ text: string; recommendation?: any }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("wisata") || lowerMessage.includes("destinasi") || lowerMessage.includes("tempat")) {
      return {
        text: "Desa Wukirsari memiliki banyak destinasi wisata menarik! Berikut rekomendasi saya:",
        recommendation: {
          name: "Kebun Teh Nglinggo",
          description: "Kebun teh dengan pemandangan indah dan udara sejuk. Cocok untuk wisata keluarga dan fotografi.",
          coordinates: [-7.9344, 110.4578] as [number, number]
        }
      };
    }
    
    if (lowerMessage.includes("umkm") || lowerMessage.includes("produk") || lowerMessage.includes("oleh-oleh")) {
      return {
        text: "Desa Wukirsari terkenal dengan produk UMKM berkualitas! Kami memiliki berbagai kategori seperti kuliner tradisional, kerajinan tangan, dan produk pertanian organik. Anda bisa melihat katalog lengkapnya di bagian Produk UMKM di website ini."
      };
    }
    
    if (lowerMessage.includes("sejarah") || lowerMessage.includes("desa")) {
      return {
        text: "Desa Wukirsari adalah salah satu Desa Wisata Terbaik yang diakui UNWTO (United Nations World Tourism Organization). Desa ini terletak di Bantul, Yogyakarta, dan dikenal dengan keindahan alamnya, budaya yang kaya, serta masyarakat yang ramah dan gotong royong."
      };
    }
    
    if (lowerMessage.includes("cuaca") || lowerMessage.includes("iklim")) {
      return {
        text: "Untuk informasi cuaca terkini di Desa Wukirsari, Anda bisa melihat widget cuaca di bagian atas website ini. Kami menampilkan suhu, kondisi cuaca, dan prakiraan harian secara real-time."
      };
    }
    
    return {
      text: "Terima kasih atas pertanyaannya! Saya dapat membantu Anda dengan informasi tentang wisata, produk UMKM, sejarah desa, cuaca, dan berbagai informasi lainnya tentang Desa Wukirsari. Ada yang ingin Anda ketahui lebih lanjut?"
    };
  };

  const openInMaps = (coordinates: [number, number]) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`;
    window.open(url, '_blank');
  };

  if (!isOpen) {
    return (
      <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50`}>
        <Button
          onClick={() => setIsOpen(true)}
          size={isMobile ? "default" : "lg"}
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className={`${isMobile ? 'w-5 h-5 mr-1' : 'w-6 h-6 mr-2'}`} />
          {isMobile ? 'Chat' : 'Chat AI'}
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${isMobile ? 'bottom-4 right-4 left-4' : 'bottom-6 right-6'} z-50`}>
      <Card className={`${isMobile ? 'w-full' : 'w-96'} shadow-2xl transition-all duration-300 ${isMinimized ? 'h-14' : isMobile ? 'h-[70vh]' : 'h-96'}`}>
        <CardHeader className="pb-2 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center gap-2`}>
              <MessageCircle className="w-5 h-5" />
              {isMobile ? 'Asisten AI' : 'Asisten Wisata AI'}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col" style={{ height: isMobile ? 'calc(70vh - 3.5rem)' : '20rem' }}>
            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'} space-y-3`}
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${isMobile ? 'max-w-[85%]' : 'max-w-[80%]'} p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{message.text}</p>
                    {message.recommendation && (
                      <div className="mt-2 p-2 bg-background/20 rounded border">
                        <h4 className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>{message.recommendation.name}</h4>
                        <p className={`${isMobile ? 'text-xs' : 'text-xs'} opacity-90 mt-1`}>{message.recommendation.description}</p>
                        {message.recommendation.coordinates && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={`mt-2 ${isMobile ? 'h-6 text-xs px-2' : 'h-7'}`}
                            onClick={() => openInMaps(message.recommendation!.coordinates!)}
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Lihat Lokasi
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className={`${isMobile ? 'p-3' : 'p-4'} border-t`}>
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isMobile ? "Tanya tentang wisata..." : "Tanya tentang wisata Wukirsari..."}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  className={isMobile ? 'text-sm' : ''}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};