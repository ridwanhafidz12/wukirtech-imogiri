import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDestinations } from "@/components/admin/AdminDestinations";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminCategories } from "@/components/admin/AdminCategories";
import { AdminVisitors } from "@/components/admin/AdminVisitors";
import { AdminVillageInfo } from "@/components/admin/AdminVillageInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Admin = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Kembali ke Website</span>
                <span className="sm:hidden">Kembali</span>
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                <h1 className="text-lg md:text-2xl font-bold">Admin Panel</h1>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            {/* {isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </Button>
            )} */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <Tabs defaultValue="destinations" className="space-y-4 md:space-y-6">
          {/* Desktop Tabs */}
          <TabsList className="hidden md:grid w-full grid-cols-5">
            <TabsTrigger value="destinations">Destinasi Wisata</TabsTrigger>
            <TabsTrigger value="products">Produk UMKM</TabsTrigger>
            <TabsTrigger value="categories">Kategori UMKM</TabsTrigger>
            <TabsTrigger value="visitors">Data Pengunjung</TabsTrigger>
            <TabsTrigger value="village">Info Desa</TabsTrigger>
          </TabsList>

          {/* Mobile Tabs - Horizontal Scroll */}
          {isMobile && (
            <div className="md:hidden">
              <TabsList className="flex w-full overflow-x-auto pb-2 scrollbar-hide">
                <TabsTrigger 
                  value="destinations" 
                  className="flex-shrink-0 px-3 text-xs"
                >
                  Destinasi
                </TabsTrigger>
                <TabsTrigger 
                  value="products" 
                  className="flex-shrink-0 px-3 text-xs"
                >
                  Produk
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="flex-shrink-0 px-3 text-xs"
                >
                  Kategori
                </TabsTrigger>
                <TabsTrigger 
                  value="visitors" 
                  className="flex-shrink-0 px-3 text-xs"
                >
                  Pengunjung
                </TabsTrigger>
                <TabsTrigger 
                  value="village" 
                  className="flex-shrink-0 px-3 text-xs"
                >
                  Info Desa
                </TabsTrigger>
              </TabsList>
            </div>
          )}

          {/* Alternative Mobile Navigation - Dropdown */}
          {isMobile && mobileMenuOpen && (
            <div className="md:hidden bg-white border rounded-lg shadow-lg p-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  document.querySelector('[data-value="destinations"]')?.click();
                  setMobileMenuOpen(false);
                }}
              >
                📍 Destinasi Wisata
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  document.querySelector('[data-value="products"]')?.click();
                  setMobileMenuOpen(false);
                }}
              >
                🛍️ Produk UMKM
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  document.querySelector('[data-value="categories"]')?.click();
                  setMobileMenuOpen(false);
                }}
              >
                📂 Kategori UMKM
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  document.querySelector('[data-value="visitors"]')?.click();
                  setMobileMenuOpen(false);
                }}
              >
                👥 Data Pengunjung
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  document.querySelector('[data-value="village"]')?.click();
                  setMobileMenuOpen(false);
                }}
              >
                🏡 Info Desa
              </Button>
            </div>
          )}

          {/* Tab Contents */}
          <div className={isMobile ? "pt-2" : ""}>
            <TabsContent value="destinations" className="mt-0">
              <AdminDestinations />
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <AdminProducts />
            </TabsContent>

            <TabsContent value="categories" className="mt-0">
              <AdminCategories />
            </TabsContent>

            <TabsContent value="visitors" className="mt-0">
              <AdminVisitors />
            </TabsContent>

            <TabsContent value="village" className="mt-0">
              <AdminVillageInfo />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Mobile Bottom Navigation
      {isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 flex justify-around items-center shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs"
            onClick={() => document.querySelector('[data-value="destinations"]')?.click()}
          >
            <span className="text-lg">📍</span>
            <span>Destinasi</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs"
            onClick={() => document.querySelector('[data-value="products"]')?.click()}
          >
            <span className="text-lg">🛍️</span>
            <span>Produk</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs"
            onClick={() => document.querySelector('[data-value="visitors"]')?.click()}
          >
            <span className="text-lg">👥</span>
            <span>Pengunjung</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs"
            onClick={() => document.querySelector('[data-value="village"]')?.click()}
          >
            <span className="text-lg">🏡</span>
            <span>Desa</span>
          </Button>
        </div>
      )} */}

      {/* Padding untuk bottom navigation */}
      {isMobile && <div className="h-16" />}
    </div>
  );
};

export default Admin;