import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const VillageHistory = () => {
  const [history, setHistory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('village_info')
          .select('value')
          .eq('key', 'history')
          .single();

        if (error) throw error;
        setHistory(data?.value || "");
      } catch (error) {
        console.error('Error fetching village history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-64 mx-auto" />
            <div className="max-w-4xl mx-auto space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
              <BookOpen className="w-8 h-8" />
              Sejarah Desa Wukirsari
            </h2>
          </div>
          
          <Card className="animate-fade-in">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-foreground">
                {history}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};