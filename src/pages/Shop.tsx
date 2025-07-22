import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import ShopHero from "@/components/shop/ShopHero";
import ShopPageFilters from "@/components/shop/ShopPageFilters";
import ShopList from "@/components/shop/ShopList";
import { ShopData } from "@/components/shop/types";
import { shopData } from "@/components/shop/data";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ShopData[]>(shopData);

  const filteredShops = editData.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Все" || shop.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEdit = (id: number, field: keyof ShopData, value: string | number) => {
    setEditData(prev => prev.map(shop => 
      shop.id === id ? { ...shop, [field]: value } : shop
    ));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Все");
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <ShopHero />
        <ShopPageFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          filteredCount={filteredShops.length}
          totalCount={editData.length}
          onClearFilters={clearFilters}
        />
        <ShopList
          shops={filteredShops}
          isEditing={isEditing}
          onEdit={handleEdit}
        />
      </div>
    </PageLayout>
  );
};

export default Shop;