import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Destination {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}

export const DestinationMap = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from('tourist_destinations')
          .select('*')
          .order('name');

        if (error) throw error;
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const openInMaps = (destination: Destination) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`;
    window.open(url, '_blank');
  };

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
            <div className="animate-pulse">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in" id="destinations">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <MapPin className="w-5 h-5" />
          Jelajahi Peta Destinasi Wisata
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Interactive Map Placeholder */}
        <div className="h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDU5NjY5IiBmaWxsLW9wYWNpdHk9IjAuMSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')]" />
          
          {/* Map Markers */}
          {destinations.map((destination, index) => (
            <button
              key={destination.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110 ${
                selectedDestination?.id === destination.id 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-white text-primary shadow-md hover:bg-primary hover:text-primary-foreground'
              }`}
              style={{
                left: `${30 + (index * 20)}%`,
                top: `${40 + (index % 2 === 0 ? 10 : -10)}%`
              }}
              onClick={() => setSelectedDestination(destination)}
            >
              <MapPin className="w-4 h-4" />
            </button>
          ))}
          
          {/* Map Title */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <h3 className="font-semibold text-primary">Peta Wisata Wukirsari</h3>
            <p className="text-xs text-muted-foreground">Klik marker untuk detail</p>
          </div>
        </div>
        
        {/* Destination Details */}
        {selectedDestination ? (
          <div className="p-4 border rounded-lg bg-card animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg text-primary">{selectedDestination.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedDestination.description}</p>
              </div>
            </div>
            <Button 
              onClick={() => openInMaps(selectedDestination)}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Lihat di Google Maps
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Klik marker di peta untuk melihat detail destinasi wisata</p>
          </div>
        )}
        
        {/* Destination List */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Destinasi Wisata Unggulan:</h4>
          <div className="grid gap-2">
            {destinations.map((destination) => (
              <button
                key={destination.id}
                className={`p-3 text-left rounded-lg transition-colors ${
                  selectedDestination?.id === destination.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
                onClick={() => setSelectedDestination(destination)}
              >
                <div className="font-medium">{destination.name}</div>
                <div className="text-sm opacity-90 line-clamp-2">{destination.description}</div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};