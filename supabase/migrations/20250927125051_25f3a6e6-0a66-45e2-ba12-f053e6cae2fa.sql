-- Create UMKM categories table
CREATE TABLE public.umkm_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create UMKM products table
CREATE TABLE public.umkm_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  whatsapp_number TEXT,
  category_id UUID REFERENCES public.umkm_categories(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tourist destinations table
CREATE TABLE public.tourist_destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly visitors table
CREATE TABLE public.weekly_visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE NOT NULL,
  visitor_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create village info table
CREATE TABLE public.village_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.umkm_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourist_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for viewing)
CREATE POLICY "Allow public read for umkm_categories" ON public.umkm_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read for umkm_products" ON public.umkm_products FOR SELECT USING (true);
CREATE POLICY "Allow public read for tourist_destinations" ON public.tourist_destinations FOR SELECT USING (true);
CREATE POLICY "Allow public read for weekly_visitors" ON public.weekly_visitors FOR SELECT USING (true);
CREATE POLICY "Allow public read for village_info" ON public.village_info FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_umkm_categories_updated_at BEFORE UPDATE ON public.umkm_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_umkm_products_updated_at BEFORE UPDATE ON public.umkm_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tourist_destinations_updated_at BEFORE UPDATE ON public.tourist_destinations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_weekly_visitors_updated_at BEFORE UPDATE ON public.weekly_visitors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_village_info_updated_at BEFORE UPDATE ON public.village_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.umkm_categories (name, color) VALUES 
('Kuliner', '#10B981'),
('Kerajinan', '#F59E0B'),
('Fashion', '#EF4444'),
('Pertanian', '#22C55E');

INSERT INTO public.umkm_products (name, description, price, category_id, whatsapp_number) VALUES
('Gudeg Kaleng Bu Tini', 'Gudeg tradisional Jogja dalam kemasan praktis kaleng', 25000, (SELECT id FROM public.umkm_categories WHERE name = 'Kuliner' LIMIT 1), '628123456789'),
('Keripik Singkong', 'Keripik singkong renyah dengan berbagai varian rasa', 15000, (SELECT id FROM public.umkm_categories WHERE name = 'Kuliner' LIMIT 1), '628123456790'),
('Tas Anyaman Pandan', 'Tas anyaman dari daun pandan berkualitas tinggi', 85000, (SELECT id FROM public.umkm_categories WHERE name = 'Kerajinan' LIMIT 1), '628123456791');

INSERT INTO public.tourist_destinations (name, description, latitude, longitude) VALUES
('Goa Selarong', 'Goa bersejarah tempat pangeran Diponegoro bermeditasi', -7.8234567, 110.2987654),
('Sungai Opak', 'Spot river tubing dan wisata air yang menyenangkan', -7.8345678, 110.3098765),
('Bukit Bintang', 'Spot terbaik melihat sunset dan pemandangan desa dari ketinggian', -7.8456789, 110.3209876);

INSERT INTO public.weekly_visitors (week_start, visitor_count) VALUES
(CURRENT_DATE - INTERVAL '6 weeks', 1250),
(CURRENT_DATE - INTERVAL '5 weeks', 1180),
(CURRENT_DATE - INTERVAL '4 weeks', 1420),
(CURRENT_DATE - INTERVAL '3 weeks', 1350),
(CURRENT_DATE - INTERVAL '2 weeks', 1680),
(CURRENT_DATE - INTERVAL '1 week', 1890),
(CURRENT_DATE, 1750);

INSERT INTO public.village_info (key, value) VALUES
('history', 'Desa Wisata Wukirsari merupakan desa wisata yang terletak di Kecamatan Imogiri, Kabupaten Bantul. Desa ini telah diakui sebagai salah satu Desa Wisata Terbaik oleh UNWTO (United Nations World Tourism Organization). Dengan kekayaan budaya, alam, dan tradisi yang masih terjaga, Wukirsari menjadi destinasi wisata unggulan di Yogyakarta.'),
('contact_phone', '+62 274 123456'),
('contact_email', 'info@wukirsari.id'),
('address', 'Wukirsari, Imogiri, Bantul, Daerah Istimewa Yogyakarta'),
('instagram', '@wukirsari_village'),
('facebook', 'Desa Wisata Wukirsari');