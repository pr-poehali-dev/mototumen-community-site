import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import ServiceHero from "@/components/services/ServiceHero";
import ServicePageFilters from "@/components/services/ServicePageFilters";
import ServiceList from "@/components/services/ServiceList";
import { ServiceData } from "@/components/services/types";
import { serviceData } from "@/components/services/data";

const Service = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ServiceData[]>(serviceData);

  const filteredServices = editData.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Все" || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEdit = (id: number, field: keyof ServiceData, value: string | number) => {
    setEditData(prev => prev.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Все");
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <ServiceHero />
        <ServicePageFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          filteredCount={filteredServices.length}
          totalCount={editData.length}
          onClearFilters={clearFilters}
        />
        <ServiceList
          services={filteredServices}
          isEditing={isEditing}
          onEdit={handleEdit}
        />
      </div>
    </PageLayout>
  );
};

export default Service;