import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-cover bg-center text-primary-foreground">
      {/* Background Image dengan Overlay Gelap 50% */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://png.pngtree.com/thumb_back/fh260/background/20230803/pngtree-a-field-of-green-rice-and-mountain-views-image_12983894.jpg")',
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Admin Access Button */}
        <div className="absolute top-4 right-4">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-sm"
            onClick={() => navigate('/admin')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          {/* UNWTO Award Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in border border-white/20">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">UNWTO Best Tourism Village</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            WukirTech
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/90">
              Jelajahi Keindahan Desa Wisata Wukirsari
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in leading-relaxed">
            Temukan pesona desa wisata terbaik di Yogyakarta dengan kekayaan budaya, 
            wisata alam yang menawan, dan produk UMKM berkualitas tinggi.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              variant="secondary" 
              className="group bg-white text-gray-900 hover:bg-white/90 shadow-lg"
              onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Jelajahi Wisata
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-sm"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Lihat Produk UMKM
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 text-white">
        <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L50 105C100 90 200 60 300 50C400 40 500 50 600 55C700 60 800 60 900 50C1000 40 1100 20 1150 10L1200 0V120H0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};