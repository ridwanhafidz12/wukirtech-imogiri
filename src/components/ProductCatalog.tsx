import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageCircle, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  whatsapp_number: string;
  category: {
    name: string;
    color: string;
  };
}

export const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('umkm_products')
          .select(`
            id,
            name,
            description,
            price,
            image_url,
            whatsapp_number,
            umkm_categories (
              name,
              color
            )
          `)
          .order('name');

        if (error) throw error;

        const formattedProducts = data.map(product => ({
          ...product,
          category: {
            name: product.umkm_categories?.name || 'Lainnya',
            color: product.umkm_categories?.color || '#6B7280'
          }
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleWhatsAppOrder = (product: Product) => {
    const message = `Halo, saya tertarik dengan produk ${product.name} seharga ${formatPrice(product.price)}. Mohon informasi lebih lanjut.`;
    const whatsappUrl = `https://wa.me/${product.whatsapp_number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Katalog Produk UMKM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section id="products" className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
          <Package className="w-8 h-8" />
          Katalog Produk UMKM
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Dukung produk lokal berkualitas dari UMKM Desa Wukirsari. 
          Produk-produk unggulan yang dibuat dengan cinta dan tradisi turun temurun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Package className="w-16 h-16 text-primary/30" />
                )}
                
                {/* Category Badge */}
                <Badge 
                  className="absolute top-3 right-3"
                  style={{ backgroundColor: product.category.color }}
                >
                  {product.category.name}
                </Badge>
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-primary/80 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleWhatsAppOrder(product)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Pesan via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Belum Ada Produk
          </h3>
          <p className="text-muted-foreground">
            Produk UMKM akan segera ditampilkan di sini.
          </p>
        </div>
      )}
    </section>
  );
};