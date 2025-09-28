import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, MapPin, X, Minimize2, Maximize2, ExternalLink, Compass, ZoomIn, ZoomOut, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  recommendation?: {
    name: string;
    description: string;
    maps_url?: string;
    image_url?: string;
  };
  showMap?: boolean;
}

interface Destination {
  id: string;
  name: string;
  description: string;
  maps_url: string;
  image_url?: string;
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
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [mapState, setMapState] = useState({
    zoom: 1,
    position: { x: 0, y: 0 },
    isDragging: false,
    startPos: { x: 0, y: 0 }
  });
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fetch destinations from Supabase
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from("tourist_destinations")
          .select("*")
          .order("name");

        if (error) throw error;
        setDestinations(data || []);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  // Auto scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Map interaction functions
  const handleMouseDown = (e: React.MouseEvent) => {
    setMapState(prev => ({
      ...prev,
      isDragging: true,
      startPos: { x: e.clientX - prev.position.x, y: e.clientY - prev.position.y }
    }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapState.isDragging) return;
    
    const newX = e.clientX - mapState.startPos.x;
    const newY = e.clientY - mapState.startPos.y;
    
    const maxMove = 100 * mapState.zoom;
    setMapState(prev => ({
      ...prev,
      position: {
        x: Math.max(-maxMove, Math.min(maxMove, newX)),
        y: Math.max(-maxMove, Math.min(maxMove, newY))
      }
    }));
  };

  const handleMouseUp = () => {
    setMapState(prev => ({ ...prev, isDragging: false }));
  };

  const handleZoomIn = () => {
    setMapState(prev => ({ ...prev, zoom: Math.min(2, prev.zoom + 0.2) }));
  };

  const handleZoomOut = () => {
    setMapState(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.2) }));
  };

  const resetView = () => {
    setMapState({ zoom: 1, position: { x: 0, y: 0 }, isDragging: false, startPos: { x: 0, y: 0 } });
  };

  const openInMaps = (mapsUrl: string) => {
    if (mapsUrl) {
      window.open(mapsUrl, "_blank");
    } else {
      toast({
        title: "Error",
        description: "Link Google Maps tidak tersedia untuk destinasi ini.",
        variant: "destructive",
      });
    }
  };

  const generateMarkerPositions = (count: number) => {
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      const distance = 30 + (index % 3) * 15;
      return {
        left: 50 + Math.cos(angle) * distance,
        top: 50 + Math.sin(angle) * distance
      };
    });
  };

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
      const response = await generateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        recommendation: response.recommendation,
        showMap: response.showMap
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

  const generateAIResponse = async (message: string): Promise<{ 
    text: string; 
    recommendation?: any;
    showMap?: boolean;
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();
    
    // Response untuk pertanyaan wisata dengan data real dari database
    if (lowerMessage.includes("wisata") || lowerMessage.includes("destinasi") || lowerMessage.includes("tempat") || lowerMessage.includes("pariwisata")) {
      const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
      
      if (randomDestination) {
        return {
          text: `Desa Wukirsari memiliki banyak destinasi wisata menarik! Salah satunya adalah **${randomDestination.name}**. ${randomDestination.description}`,
          recommendation: {
            name: randomDestination.name,
            description: randomDestination.description,
            maps_url: randomDestination.maps_url,
            image_url: randomDestination.image_url
          },
          showMap: true
        };
      }
      
      return {
        text: "Desa Wukirsari memiliki banyak destinasi wisata menarik seperti Kebun Teh Nglinggo, Curung Pulosari, dan berbagai spot wisata alam lainnya. Ingin tahu lebih detail tentang destinasi tertentu?",
        showMap: true
      };
    }
    
    if (lowerMessage.includes("map") || lowerMessage.includes("peta") || lowerMessage.includes("lokasi")) {
      return {
        text: "Berikut peta interaktif destinasi wisata di Desa Wukirsari. Anda bisa menjelajahi peta dengan drag dan zoom untuk melihat berbagai lokasi wisata.",
        showMap: true
      };
    }
    
    if (lowerMessage.includes("umkm") || lowerMessage.includes("produk") || lowerMessage.includes("oleh-oleh")) {
      return {
        text: "Desa Wukirsari terkenal dengan produk UMKM berkualitas! Kami memiliki berbagai kategori seperti kuliner tradisional, kerajinan tangan, dan produk pertanian organik. Anda bisa melihat katalog lengkapnya di bagian Produk UMKM di website ini."
      };
    }
    
    if (lowerMessage.includes("sejarah") || lowerMessage.includes("desa") || lowerMessage.includes("wukirsari")) {
      return {
        text: "Desa Wukirsari adalah salah satu Desa Wisata Terbaik yang diakui UNWTO (United Nations World Tourism Organization). Desa ini terletak di Bantul, Yogyakarta, dan dikenal dengan keindahan alamnya, budaya yang kaya, serta masyarakat yang ramah dan gotong royong."
      };
    }
    
    if (lowerMessage.includes("rekomendasi") || lowerMessage.includes("sarankan")) {
      const topDestinations = destinations.slice(0, 3);
      const destinationList = topDestinations.map(dest => `• ${dest.name}`).join('\n');
      
      return {
        text: `Berikut beberapa rekomendasi destinasi wisata terpopuler di Wukirsari:\n${destinationList}\n\nMau tahu lebih detail tentang salah satunya?`,
        showMap: true
      };
    }
    
    return {
      text: "Terima kasih atas pertanyaannya! Saya dapat membantu Anda dengan informasi tentang wisata, peta lokasi, produk UMKM, sejarah desa, dan berbagai informasi lainnya tentang Desa Wukirsari. Ada yang ingin Anda ketahui lebih lanjut?"
    };
  };

  const renderMap = () => {
    const markerPositions = generateMarkerPositions(destinations.length);

    return (
      <div className="mt-3 border rounded-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 overflow-hidden">
          {/* Map Background */}
          <div 
            className={`absolute inset-0 transition-transform duration-200 ${
              mapState.isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `translate(${mapState.position.x}px, ${mapState.position.y}px) scale(${mapState.zoom})`,
              backgroundImage: `
                linear-gradient(rgba(120, 180, 240, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(120, 180, 240, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${40 * mapState.zoom}px ${40 * mapState.zoom}px`,
              backgroundPosition: 'center center'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Water bodies */}
            <div className="absolute w-32 h-32 bg-blue-100 rounded-full top-12 left-12 opacity-30"></div>
            <div className="absolute w-24 h-24 bg-blue-100 rounded-full bottom-10 right-16 opacity-30"></div>
            
            {/* Roads */}
            <div className="absolute w-full h-1.5 bg-yellow-100 top-1/2 left-0 transform -translate-y-1/2 opacity-60"></div>
            <div className="absolute w-1.5 h-full bg-yellow-100 left-1/2 top-0 transform -translate-x-1/2 opacity-60"></div>
            
            {/* Green areas */}
            <div className="absolute w-32 h-24 bg-green-100 rounded-2xl top-6 right-10 opacity-40"></div>
            <div className="absolute w-28 h-32 bg-green-100 rounded-2xl bottom-6 left-8 opacity-40"></div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Button 
              size="sm" 
              onClick={handleZoomIn}
              className="bg-white text-gray-700 hover:bg-gray-50 shadow-md w-8 h-8 p-0"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button 
              size="sm" 
              onClick={handleZoomOut}
              className="bg-white text-gray-700 hover:bg-gray-50 shadow-md w-8 h-8 p-0"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
          </div>

          {/* Map Title */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs shadow-md border">
            <div className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-primary" />
              <span className="font-medium">Peta Wisata</span>
            </div>
          </div>

          {/* Markers */}
          {destinations.map((destination, index) => (
            <button
              key={destination.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
              style={{
                left: `${markerPositions[index]?.left || 50}%`,
                top: `${markerPositions[index]?.top || 50}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Add message about this destination
                const newMessage: Message = {
                  id: Date.now().toString(),
                  text: `Ini adalah **${destination.name}** - ${destination.description}`,
                  isUser: false,
                  timestamp: new Date(),
                  recommendation: destination
                };
                setMessages(prev => [...prev, newMessage]);
              }}
            >
              <div className="p-1.5 rounded-full bg-white border-2 border-primary shadow-lg">
                <MapPin className="w-3 h-3 text-primary" />
              </div>
            </button>
          ))}
        </div>

        {/* Map Footer */}
        <div className="bg-white/80 backdrop-blur-sm p-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {destinations.length} destinasi tersedia
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={resetView}
              className="h-6 px-2 text-xs"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
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
      <Card className={`${isMobile ? 'w-full' : 'w-96'} shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-14' : isMobile ? 'h-[80vh]' : 'h-[600px]'
      }`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
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
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col" style={{ 
            height: isMobile ? 'calc(80vh - 3.5rem)' : 'calc(600px - 3.5rem)' 
          }}>
            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'} space-y-3`}
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${isMobile ? 'max-w-[85%]' : 'max-w-[80%]'} p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                      : 'bg-gray-100 border'
                  }`}>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} whitespace-pre-wrap`}>
                      {message.text}
                    </p>
                    
                    {/* Recommendation Card */}
                    {message.recommendation && (
                      <div className="mt-2 p-2 bg-white/20 rounded border border-white/30">
                        <h4 className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {message.recommendation.name}
                        </h4>
                        <p className={`${isMobile ? 'text-xs' : 'text-xs'} opacity-90 mt-1`}>
                          {message.recommendation.description}
                        </p>
                        {message.recommendation.maps_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={`mt-2 ${isMobile ? 'h-6 text-xs px-2' : 'h-7 text-xs'}`}
                            onClick={() => openInMaps(message.recommendation!.maps_url!)}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Lihat di Maps
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {/* Interactive Map */}
                    {message.showMap && destinations.length > 0 && renderMap()}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className={`${isMobile ? 'p-3' : 'p-4'} border-t bg-gray-50`}>
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
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
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