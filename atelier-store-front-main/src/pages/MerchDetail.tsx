
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MerchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const merchItems = [
    {
      id: 1,
      title: "Eternal Sunshine (Lp-Vinilo)",
      price: "$32.97",
      artist: "Ariana Grande",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      description: "Vinilo oficial del álbum 'Eternal Sunshine' de Ariana Grande. Edición limitada con arte exclusivo.",
      details: ["Vinilo de 180g", "Gatefold sleeve", "Incluye letras", "Edición limitada"]
    },
    {
      id: 2,
      title: "To Hell With It - CD",
      price: "$14.97",
      artist: "PinkPantheress",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      description: "CD oficial del mixtape debut 'To Hell With It' de PinkPantheress.",
      details: ["CD en jewel case", "Booklet de 8 páginas", "Audio remasterizado", "Tracks bonus"]
    },
    {
      id: 3,
      title: "Moodswings In This Order - CD",
      price: "$29.99",
      artist: "DPR IAN",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      description: "Álbum debut oficial de DPR IAN con su distintivo sonido alternativo R&B.",
      details: ["CD en digipak", "Artwork exclusivo", "16 tracks", "Producción premium"]
    },
    {
      id: 4,
      title: "TYLA (Lp - Vinilo)",
      price: "$28.83",
      artist: "Tyla",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      description: "Vinilo del álbum debut de Tyla, la sensación del Afrobeats mundial.",
      details: ["Vinilo de colores", "180g heavyweight", "Sleeve premium", "Insert con fotos"]
    },
    {
      id: 5,
      title: "Planet Her - Vinyl",
      price: "$35.99",
      artist: "Doja Cat",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      description: "Vinilo oficial del aclamado álbum 'Planet Her' de Doja Cat.",
      details: ["Doble LP", "Vinilo transparente", "Gatefold artwork", "Poster incluido"]
    },
    {
      id: 6,
      title: "SOUR - CD",
      price: "$16.99",
      artist: "Olivia Rodrigo",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      description: "CD debut de Olivia Rodrigo que conquistó las listas mundiales.",
      details: ["CD estándar", "Booklet con letras", "11 tracks", "Calidad de audio superior"]
    },
    {
      id: 7,
      title: "Tyler Cole Vinyl",
      price: "$24.99",
      artist: "Tyler Cole",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      description: "Vinilo coleccionable del talentoso artista R&B Tyler Cole.",
      details: ["Edición especial", "Vinilo negro 180g", "Sleeve firmado", "Numerado"]
    },
    {
      id: 8,
      title: "SOLO - Single CD",
      price: "$12.99",
      artist: "JENNIE",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      description: "Single CD oficial de 'SOLO' de JENNIE de BLACKPINK.",
      details: ["Single CD", "Photocard incluida", "Caso especial", "Edición coreana"]
    }
  ];

  const item = merchItems.find(item => item.id === parseInt(id || '0'));

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <main className="py-12 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Producto no encontrado</h1>
          <Button onClick={() => navigate('/merch')} className="bg-purple-600 hover:bg-purple-700">
            Volver a Merch
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión requerido",
        description: "Debes iniciar sesión para añadir productos al carrito",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      artist: item.artist
    });

    toast({
      title: "¡Añadido al carrito!",
      description: `${item.title} ha sido añadido a tu carrito`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <main className="py-12 px-4 max-w-7xl mx-auto">
        <Link to="/merch" className="inline-flex items-center text-purple-300 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Merch
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <p className="text-purple-300 text-lg mb-2">{item.artist}</p>
              <h1 className="text-4xl font-bold text-white mb-4">{item.title}</h1>
              <p className="text-3xl font-bold text-purple-300">{item.price}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Descripción</h3>
              <p className="text-slate-300 leading-relaxed">{item.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Detalles</h3>
              <ul className="space-y-2">
                {item.details.map((detail, index) => (
                  <li key={index} className="text-slate-300 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={handleAddToCart}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Añadir al Carrito
            </Button>

            {!isAuthenticated && (
              <p className="text-yellow-400 text-sm text-center">
                Necesitas iniciar sesión para añadir productos al carrito
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MerchDetail;
