import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
}

export const Footer = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "",
    email: "",
    address: "",
    instagram: "",
    facebook: ""
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('village_info')
          .select('key, value')
          .in('key', ['contact_phone', 'contact_email', 'address', 'instagram', 'facebook']);

        if (error) throw error;

        const contactData = data.reduce((acc, item) => {
          switch (item.key) {
            case 'contact_phone':
              acc.phone = item.value || '';
              break;
            case 'contact_email':
              acc.email = item.value || '';
              break;
            case 'address':
              acc.address = item.value || '';
              break;
            case 'instagram':
              acc.instagram = item.value || '';
              break;
            case 'facebook':
              acc.facebook = item.value || '';
              break;
          }
          return acc;
        }, {} as ContactInfo);

        setContactInfo(contactData);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div>
            <h3 className="text-2xl font-bold mb-4">WukirTech</h3>
            <p className="text-primary-foreground/80 mb-4">
              Portal digital resmi Desa Wisata Wukirsari, menyajikan informasi lengkap 
              tentang destinasi wisata dan produk UMKM terbaik.
            </p>
            <div className="text-sm text-primary-foreground/70">
              Diakui sebagai Best Tourism Village oleh UNWTO
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <div className="space-y-3">
              {contactInfo.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-primary-foreground/80">
                    {contactInfo.address}
                  </span>
                </div>
              )}
              
              {contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <a 
                    href={`tel:${contactInfo.phone}`}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              )}
              
              {contactInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Sosial Media</h4>
            <div className="space-y-3">
              {contactInfo.instagram && (
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 flex-shrink-0" />
                  <a 
                    href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {contactInfo.instagram}
                  </a>
                </div>
              )}
              
              {contactInfo.facebook && (
                <div className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 flex-shrink-0" />
                  <a 
                    href={`https://facebook.com/${contactInfo.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {contactInfo.facebook}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h5 className="font-semibold mb-2">Navigasi Cepat</h5>
              <div className="space-y-2">
                <button 
                  onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Destinasi Wisata
                </button>
                <button 
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Produk UMKM
                </button>
                <a 
                  href="/admin"
                  className="block text-xs text-primary-foreground/60 hover:text-primary-foreground/80 transition-colors mt-4 border-t border-primary-foreground/20 pt-2"
                >
                  🔒 Admin Panel
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2024 WukirTech - Desa Wisata Wukirsari. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/50 mt-1">
            Dikembangkan dengan ❤️ untuk kemajuan Desa Wukirsari
          </p>
        </div>
      </div>
    </footer>
  );
};