import React from "react";
import { MapSection } from "@/components/sections/MapSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { BlogSection } from "@/components/sections/BlogSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Profile Section */}
        <ProfileSection />
        
        {/* Map Section */}
        <MapSection />
        
        {/* Categories Section */}
        <CategoriesSection />
        
        {/* Blog Section */}
        <BlogSection />
      </main>
    </div>
  );
}
