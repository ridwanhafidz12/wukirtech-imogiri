-- Enable full CRUD operations for tourist_destinations table
CREATE POLICY "Allow public insert for tourist_destinations" 
ON public.tourist_destinations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update for tourist_destinations" 
ON public.tourist_destinations 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete for tourist_destinations" 
ON public.tourist_destinations 
FOR DELETE 
USING (true);

-- Enable full CRUD operations for umkm_categories table
CREATE POLICY "Allow public insert for umkm_categories" 
ON public.umkm_categories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update for umkm_categories" 
ON public.umkm_categories 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete for umkm_categories" 
ON public.umkm_categories 
FOR DELETE 
USING (true);

-- Enable full CRUD operations for umkm_products table
CREATE POLICY "Allow public insert for umkm_products" 
ON public.umkm_products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update for umkm_products" 
ON public.umkm_products 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete for umkm_products" 
ON public.umkm_products 
FOR DELETE 
USING (true);

-- Enable full CRUD operations for village_info table
CREATE POLICY "Allow public insert for village_info" 
ON public.village_info 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update for village_info" 
ON public.village_info 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete for village_info" 
ON public.village_info 
FOR DELETE 
USING (true);

-- Enable full CRUD operations for weekly_visitors table
CREATE POLICY "Allow public insert for weekly_visitors" 
ON public.weekly_visitors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update for weekly_visitors" 
ON public.weekly_visitors 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete for weekly_visitors" 
ON public.weekly_visitors 
FOR DELETE 
USING (true);