import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VillageInfo {
  id: string;
  key: string;
  value: string | null;
}

export const AdminVillageInfo = () => {
  const [villageInfo, setVillageInfo] = useState<VillageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInfo, setEditingInfo] = useState<VillageInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    key: "",
    value: ""
  });

  useEffect(() => {
    fetchVillageInfo();
  }, []);

  const fetchVillageInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('village_info')
        .select('*')
        .order('key');

      if (error) throw error;
      setVillageInfo(data);
    } catch (error) {
      console.error('Error fetching village info:', error);
      toast({
        title: "Error",
        description: "Gagal memuat informasi desa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const infoData = {
        key: formData.key,
        value: formData.value
      };

      if (editingInfo) {
        const { error } = await supabase
          .from('village_info')
          .update(infoData)
          .eq('id', editingInfo.id);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Informasi desa berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('village_info')
          .insert([infoData]);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Informasi desa berhasil ditambahkan",
        });
      }

      setIsOpen(false);
      setEditingInfo(null);
      setFormData({
        key: "",
        value: ""
      });
      fetchVillageInfo();
    } catch (error) {
      console.error('Error saving village info:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan informasi desa",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (info: VillageInfo) => {
    setEditingInfo(info);
    setFormData({
      key: info.key,
      value: info.value || ""
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus informasi ini?")) return;

    try {
      const { error } = await supabase
        .from('village_info')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Informasi desa berhasil dihapus",
      });
      fetchVillageInfo();
    } catch (error) {
      console.error('Error deleting village info:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus informasi desa",
        variant: "destructive",
      });
    }
  };

  const handleNewInfo = () => {
    setEditingInfo(null);
    setFormData({
      key: "",
      value: ""
    });
    setIsOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Kelola Informasi Desa
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewInfo}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Informasi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingInfo ? "Edit Informasi" : "Tambah Informasi Baru"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="key">Kunci Informasi</Label>
                  <Input
                    id="key"
                    value={formData.key}
                    onChange={(e) => setFormData({...formData, key: e.target.value})}
                    placeholder="sejarah, visi_misi, kontak, dll"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value">Nilai/Konten</Label>
                  <Textarea
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    placeholder="Masukkan konten informasi"
                    rows={5}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSave}>
                    {editingInfo ? "Update" : "Simpan"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {villageInfo.map((info) => (
            <div key={info.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg capitalize">
                    {info.key.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-muted-foreground mt-1 line-clamp-3">
                    {info.value}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(info)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(info.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {villageInfo.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Belum ada informasi desa. Tambahkan yang pertama!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};