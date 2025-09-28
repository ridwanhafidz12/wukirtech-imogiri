import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, MapPin, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Destination {
  id: string;
  name: string;
  description: string | null;
  maps_url: string | null;
  image_url: string | null;
}

export const AdminDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maps_url: "",
    image_url: ""
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('tourist_destinations')
        .select('*')
        .order('name');

      if (error) throw error;
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data destinasi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const destinationData = {
        name: formData.name,
        description: formData.description || null,
        maps_url: formData.maps_url || null,
        image_url: formData.image_url || null
      };

      if (editingDestination) {
        const { error } = await supabase
          .from('tourist_destinations')
          .update(destinationData)
          .eq('id', editingDestination.id);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Destinasi berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('tourist_destinations')
          .insert([destinationData]);

        if (error) throw error;
        toast({
          title: "Berhasil",
          description: "Destinasi berhasil ditambahkan",
        });
      }

      setIsOpen(false);
      setEditingDestination(null);
      setFormData({
        name: "",
        description: "",
        maps_url: "",
        image_url: ""
      });
      fetchDestinations();
    } catch (error) {
      console.error('Error saving destination:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan destinasi",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description || "",
      maps_url: destination.maps_url || "",
      image_url: destination.image_url || ""
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus destinasi ini?")) return;

    try {
      const { error } = await supabase
        .from('tourist_destinations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Destinasi berhasil dihapus",
      });
      fetchDestinations();
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus destinasi",
        variant: "destructive",
      });
    }
  };

  const handleNewDestination = () => {
    setEditingDestination(null);
    setFormData({
      name: "",
      description: "",
      maps_url: "",
      image_url: ""
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
            <MapPin className="w-5 h-5" />
            Kelola Destinasi Wisata
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewDestination}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Destinasi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingDestination ? "Edit Destinasi" : "Tambah Destinasi Baru"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Destinasi</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Masukkan nama destinasi"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Masukkan deskripsi destinasi"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maps_url">Link Google Maps</Label>
                  <Input
                    id="maps_url"
                    value={formData.maps_url}
                    onChange={(e) => setFormData({...formData, maps_url: e.target.value})}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image_url">URL Gambar</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSave}>
                    {editingDestination ? "Update" : "Simpan"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {destinations.map((destination) => (
            <div key={destination.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{destination.name}</h3>
                  <p className="text-muted-foreground mt-1">{destination.description}</p>
                  {destination.maps_url && (
                    <a
                      href={destination.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 mt-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" /> Lihat di Google Maps
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(destination)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(destination.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {destinations.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Belum ada destinasi wisata. Tambahkan yang pertama!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
