import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MapSection } from "@/components/sections/MapSection";
import { PlacesSection } from "@/components/sections/PlacesSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ProfileSection } from "@/components/sections/ProfileSection";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("map");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "map":
        return <MapSection />;
      case "places":
        return <PlacesSection />;
      case "blog":
        return <BlogSection />;
      case "profile":
        return <ProfileSection />;
      default:
        return <MapSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 p-6 md:ml-0">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
