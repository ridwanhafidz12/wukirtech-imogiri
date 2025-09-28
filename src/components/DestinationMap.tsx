import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Compass, ZoomIn, ZoomOut, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Destination {
  id: string;
  name: string;
  description: string;
  maps_url: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
}

export const DestinationMap = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from("tourist_destinations")
          .select("*")
          .order("name");

        if (error) throw error;
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const openInMaps = (destination: Destination) => {
    if (destination.maps_url) {
      window.open(destination.maps_url, "_blank");
    } else {
      alert("Link Google Maps tidak tersedia untuk destinasi ini.");
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    
    // Batasi pergerakan peta
    const maxMove = 100 * zoom;
    setPosition({
      x: Math.max(-maxMove, Math.min(maxMove, newX)),
      y: Math.max(-maxMove, Math.min(maxMove, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(2, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.2));
  };

  const resetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Generate positions for markers
  const generateMarkerPositions = () => {
    return destinations.map((_, index) => {
      const angle = (index / destinations.length) * Math.PI * 2;
      const distance = 30 + (index % 3) * 15;
      return {
        left: 50 + Math.cos(angle) * distance,
        top: 50 + Math.sin(angle) * distance
      };
    });
  };

  const markerPositions = generateMarkerPositions();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Jelajahi Peta Destinasi Wisata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mb-4 animate-bounce"></div>
              <div>Memuat peta...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in shadow-lg border-0" id="destinations">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
        <CardTitle className="flex items-center gap-2 text-primary">
          <MapPin className="w-6 h-6" />
          Jelajahi Peta Destinasi Wisata Wukirsari
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Enhanced Map Container */}
        <div className="relative h-96 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 overflow-hidden">
          {/* Map Background dengan grid pattern yang lebih detail */}
          <div 
            className={`absolute inset-0 transition-transform duration-200 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              backgroundImage: `
                linear-gradient(rgba(120, 180, 240, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(120, 180, 240, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
              backgroundPosition: 'center center'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Water bodies */}
            <div className="absolute w-40 h-40 bg-blue-100 rounded-full top-20 left-20 opacity-30"></div>
            <div className="absolute w-32 h-32 bg-blue-100 rounded-full bottom-16 right-24 opacity-30"></div>
            
            {/* Roads */}
            <div className="absolute w-full h-2 bg-yellow-100 top-1/2 left-0 transform -translate-y-1/2 opacity-60"></div>
            <div className="absolute w-2 h-full bg-yellow-100 left-1/2 top-0 transform -translate-x-1/2 opacity-60"></div>
            
            {/* Green areas */}
            <div className="absolute w-48 h-32 bg-green-100 rounded-2xl top-10 right-16 opacity-40"></div>
            <div className="absolute w-36 h-48 bg-green-100 rounded-2xl bottom-8 left-12 opacity-40"></div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button 
              size="sm" 
              onClick={handleZoomIn}
              className="bg-white text-gray-700 hover:bg-gray-50 shadow-md w-10 h-10 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={handleZoomOut}
              className="bg-white text-gray-700 hover:bg-gray-50 shadow-md w-10 h-10 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={resetView}
              className="bg-white text-gray-700 hover:bg-gray-50 shadow-md w-10 h-10 p-0"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom Level Display */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium shadow-md">
            Zoom: {Math.round(zoom * 100)}%
          </div>

          {/* Map Title */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <div>
                <h3 className="font-semibold text-primary">Peta Wisata Wukirsari</h3>
                <p className="text-xs text-muted-foreground">Drag untuk menjelajahi • Klik marker untuk detail</p>
              </div>
            </div>
          </div>

          {/* Enhanced Markers */}
          {destinations.map((destination, index) => (
            <button
              key={destination.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                selectedDestination?.id === destination.id
                  ? 'z-20 scale-125'
                  : 'z-10 hover:scale-110'
              }`}
              style={{
                left: `${markerPositions[index]?.left || 50}%`,
                top: `${markerPositions[index]?.top || 50}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDestination(destination);
              }}
            >
              <div className={`relative ${
                selectedDestination?.id === destination.id 
                  ? 'animate-pulse' 
                  : ''
              }`}>
                <div className={`p-2 rounded-full shadow-lg border-2 ${
                  selectedDestination?.id === destination.id
                    ? 'bg-primary border-white scale-110'
                    : 'bg-white border-primary hover:bg-primary hover:border-white'
                } transition-all duration-200`}>
                  <MapPin className={`w-5 h-5 ${
                    selectedDestination?.id === destination.id
                      ? 'text-white'
                      : 'text-primary'
                  }`} />
                </div>
                {selectedDestination?.id === destination.id && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
                    {destination.name}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Destination Details */}
        <div className="p-6">
          {selectedDestination ? (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 animate-fade-in shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-primary mb-2">{selectedDestination.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedDestination.description}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => openInMaps(selectedDestination)} 
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-md"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Buka di Google Maps
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground bg-gray-50 rounded-xl">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Pilih destinasi di peta</p>
              <p className="text-sm mt-1">Klik marker untuk melihat detail destinasi wisata</p>
            </div>
          )}

          {/* Enhanced Destination List */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg text-primary">Destinasi Wisata Unggulan</h4>
              <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                {destinations.length} destinasi
              </span>
            </div>
            <div className="grid gap-3">
              {destinations.map((destination) => (
                <button
                  key={destination.id}
                  className={`p-4 text-left rounded-xl transition-all duration-200 border ${
                    selectedDestination?.id === destination.id
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg transform scale-105"
                      : "bg-white hover:bg-gray-50 hover:shadow-md border-gray-200"
                  }`}
                  onClick={() => setSelectedDestination(destination)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      selectedDestination?.id === destination.id
                        ? "bg-white/20"
                        : "bg-primary/10"
                    }`}>
                      <MapPin className={`w-4 h-4 ${
                        selectedDestination?.id === destination.id
                          ? "text-white"
                          : "text-primary"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-base">{destination.name}</div>
                      <div className={`text-sm mt-1 line-clamp-2 ${
                        selectedDestination?.id === destination.id
                          ? "text-white/90"
                          : "text-muted-foreground"
                      }`}>
                        {destination.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};