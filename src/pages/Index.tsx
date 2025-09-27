import { Hero } from "@/components/Hero";
import { VisitorsChart } from "@/components/VisitorsChart";
import { WeatherWidget } from "@/components/WeatherWidget";
import { UMKMChart } from "@/components/UMKMChart";
import { DestinationMap } from "@/components/DestinationMap";
import { ProductCatalog } from "@/components/ProductCatalog";
import { VillageHistory } from "@/components/VillageHistory";
import { Footer } from "@/components/Footer";
import { ChatAssistant } from "@/components/ChatAssistant";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Stats & Weather Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VisitorsChart />
          <WeatherWidget />
        </div>
        
        {/* UMKM Chart */}
        <UMKMChart />
        
        {/* Destination Map */}
        <DestinationMap />
        
        {/* Product Catalog */}
        <ProductCatalog />
      </main>
      
      {/* Village History */}
      <VillageHistory />
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
};

export default Index;
