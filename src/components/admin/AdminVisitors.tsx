import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VisitorData {
  id: string;
  week_start: string;
  visitor_count: number;
}

export const AdminVisitors = () => {
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVisitor, setEditingVisitor] = useState<VisitorData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    week_start: "",
    visitor_count: ""
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_visitors')
        .select('*')
        .order('week_start', { ascending: false });

      if (error) throw error;
      setVisitors(data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengunjung",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const visitorData = {
        week_start: formData.week_start,
        visitor_count: parseInt(formData.visitor_count)
      };

      if (editingVisitor) {
        const { error } = await supabase
          .from('weekly_visitors')
          .update(visitorData)
          .eq('id', editingVisitor.id);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Data pengunjung berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('weekly_visitors')
          .insert([visitorData]);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Data pengunjung berhasil ditambahkan",
        });
      }

      setIsOpen(false);
      setEditingVisitor(null);
      setFormData({
        week_start: "",
        visitor_count: ""
      });
      fetchVisitors();
    } catch (error) {
      console.error('Error saving visitor data:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data pengunjung",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (visitor: VisitorData) => {
    setEditingVisitor(visitor);
    setFormData({
      week_start: visitor.week_start,
      visitor_count: visitor.visitor_count.toString()
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data pengunjung ini?")) return;

    try {
      const { error } = await supabase
        .from('weekly_visitors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Data pengunjung berhasil dihapus",
      });
      fetchVisitors();
    } catch (error) {
      console.error('Error deleting visitor data:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus data pengunjung",
        variant: "destructive",
      });
    }
  };

  const handleNewVisitor = () => {
    setEditingVisitor(null);
    setFormData({
      week_start: "",
      visitor_count: ""
    });
    setIsOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Kelola Data Pengunjung Mingguan
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewVisitor}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingVisitor ? "Edit Data Pengunjung" : "Tambah Data Pengunjung"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="week_start">Tanggal Mulai Minggu</Label>
                  <Input
                    id="week_start"
                    type="date"
                    value={formData.week_start}
                    onChange={(e) => setFormData({...formData, week_start: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="visitor_count">Jumlah Pengunjung</Label>
                  <Input
                    id="visitor_count"
                    type="number"
                    value={formData.visitor_count}
                    onChange={(e) => setFormData({...formData, visitor_count: e.target.value})}
                    placeholder="100"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSave}>
                    {editingVisitor ? "Update" : "Simpan"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {visitors.map((visitor) => (
            <div key={visitor.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">
                    Minggu {formatDate(visitor.week_start)}
                  </h3>
                  <p className="text-muted-foreground">
                    Jumlah pengunjung: <span className="font-medium text-primary">
                      {visitor.visitor_count.toLocaleString('id-ID')} orang
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(visitor)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(visitor.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {visitors.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Belum ada data pengunjung. Tambahkan yang pertama!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};