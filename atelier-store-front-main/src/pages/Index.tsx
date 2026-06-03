// src/pages/Index.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import ArtistSection from "@/components/ArtistSection";
import MerchSection from "@/components/MerchSection";
import Footer from "@/components/Footer";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />
      <main>
        <HeroCarousel />
        <ArtistSection />
        <MerchSection />

        
        {user?.isAdmin && (
          <div className="text-center mt-8">
            <Link
              to="/admin"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
            >
              Volver al Panel de Administración
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
