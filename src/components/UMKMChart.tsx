import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CategoryData {
  id: string;
  name: string;
  color: string;
  count: number;
}

export const UMKMChart = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch categories with product counts
        const { data: categories, error: categoriesError } = await supabase
          .from('umkm_categories')
          .select('*');

        if (categoriesError) throw categoriesError;

        // Get product counts for each category
        const categoryDataWithCounts = await Promise.all(
          categories.map(async (category) => {
            const { count, error } = await supabase
              .from('umkm_products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id);

            if (error) throw error;

            return {
              id: category.id,
              name: category.name,
              color: category.color || '#10B981',
              count: count || 0
            };
          })
        );

        setCategoryData(categoryDataWithCounts);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Sebaran UMKM Berdasarkan Kategori
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalProducts = categoryData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <ShoppingBag className="w-5 h-5" />
          Sebaran UMKM Berdasarkan Kategori
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="count"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} produk`, name]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Category List */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground">Detail Kategori:</h4>
          {categoryData.map((category) => (
            <div key={category.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary/50">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {category.count} unit ({Math.round((category.count / totalProducts) * 100)}%)
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-center">
            <span className="text-lg font-bold text-primary">{totalProducts}</span>
            <span className="text-sm text-muted-foreground ml-1">Total UMKM Terdaftar</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};