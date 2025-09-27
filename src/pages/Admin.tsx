import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDestinations } from "@/components/admin/AdminDestinations";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminCategories } from "@/components/admin/AdminCategories";
import { AdminVisitors } from "@/components/admin/AdminVisitors";
import { AdminVillageInfo } from "@/components/admin/AdminVillageInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Website
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Admin Panel WukirTech</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="destinations">Destinasi Wisata</TabsTrigger>
            <TabsTrigger value="products">Produk UMKM</TabsTrigger>
            <TabsTrigger value="categories">Kategori UMKM</TabsTrigger>
            <TabsTrigger value="visitors">Data Pengunjung</TabsTrigger>
            <TabsTrigger value="village">Info Desa</TabsTrigger>
          </TabsList>

          <TabsContent value="destinations">
            <AdminDestinations />
          </TabsContent>

          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>

          <TabsContent value="categories">
            <AdminCategories />
          </TabsContent>

          <TabsContent value="visitors">
            <AdminVisitors />
          </TabsContent>

          <TabsContent value="village">
            <AdminVillageInfo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;