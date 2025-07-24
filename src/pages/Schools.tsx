import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import SchoolHero from "@/components/schools/SchoolHero";
import SchoolPageFilters from "@/components/schools/SchoolPageFilters";
import SchoolList from "@/components/schools/SchoolList";
import { SchoolData } from "@/components/schools/types";
import { schoolData } from "@/components/schools/data";

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<SchoolData[]>(schoolData);

  const filteredSchools = editData.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Все" || school.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEdit = (id: number, field: keyof SchoolData, value: string | number) => {
    setEditData(prev => prev.map(school => 
      school.id === id ? { ...school, [field]: value } : school
    ));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Все");
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <SchoolHero />
        <SchoolPageFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          filteredCount={filteredSchools.length}
          totalCount={editData.length}
          onClearFilters={clearFilters}
        />
        <SchoolList
          schools={filteredSchools}
          isEditing={isEditing}
          onEdit={handleEdit}
        />
      </div>
    </PageLayout>
  );
};

export default Schools;