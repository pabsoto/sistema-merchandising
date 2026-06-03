import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArtistModal from "@/components/ArtistModal";

interface Artist {
  _id: string;
  nombre: string;
  descripcion: string;
  imagenes: {
    foto_perfil: string;
    imagen_fondo: string;  
  };
}

interface Merch {
  id: string;
  titulo: string;
  precio: string;
  imagen: string;
  stock: number;
}

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistMerch, setArtistMerch] = useState<Merch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No se proporcionó ID del artista");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener artista
        const artistRes = await axios.get(`http://localhost:5000/api/artists/${id}`);
        setArtist(artistRes.data);

        // Obtener merch del artista
        const merchRes = await axios.get(`http://localhost:5000/api/merch/artist/${id}`);
        setArtistMerch(merchRes.data);
      } catch (err: any) {
        console.error(err);
        setError("Error al cargar datos del artista.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="gradient-background">
        <Navbar />
        <main className="py-12 px-4 max-w-7xl mx-auto text-center text-white">
          <div className="space-y-4">
            <p>Cargando artista...</p>
            <p className="text-sm text-gray-300">ID buscado: {id}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="gradient-background">
        <Navbar />
        <main className="py-12 px-4 max-w-7xl mx-auto text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-300 mb-4">{error || "Artista no encontrado"}</p>
          <div className="text-sm text-gray-300 mb-6 space-y-2">
            <p>ID buscado: <code className="bg-gray-800 px-2 py-1 rounded">{id}</code></p>
            <p>Longitud: {id?.length} caracteres</p>
            <p>¿Es ObjectId válido? {id && id.length === 24 && /^[0-9a-fA-F]+$/.test(id) ? '✅ Sí' : '❌ No'}</p>
          </div>
          <Button onClick={() => window.history.back()} className="bg-purple-600 hover:bg-purple-700">
            Volver
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-950 via-black to-purple-950">
      <Navbar />
      <main className="py-12 px-4 max-w-4xl mx-auto">
        <Link to="/artists" className="inline-flex items-center text-purple-300 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Artistas
        </Link>

        
        <div className="mb-12">
          
          <div className="relative w-full h-96 md:h-[28rem] rounded-lg overflow-hidden shadow-lg">
            <img
              src={artist.imagenes.imagen_fondo}
              alt={`${artist.nombre} fondo`}
              className="w-full h-full object-cover"
            />
          </div>

          
          <div
            className="relative w-64 h-64 mx-auto -mt-32 rounded-lg overflow-hidden shadow-2xl cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setShowModal(true)}
          >
            <img
              src={artist.imagenes.foto_perfil}
              alt={artist.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          
          <h1 className="text-4xl font-bold text-white text-center mt-6">{artist.nombre}</h1>

          
          <div className="text-center mt-4">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30"
            >
              Ver Biografía
            </Button>
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Productos del Artista</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistMerch.length === 0 && (
              <p className="text-white text-center col-span-full">No hay productos disponibles.</p>
            )}
            {artistMerch.map((item) => (
              <Link key={item.id} to={`/merch/${item.id}`}>
                <div className="group cursor-pointer hover:scale-105 transition-transform p-4 bg-white/5 backdrop-blur-lg rounded-xl shadow-md min-h-[22rem] flex flex-col justify-between">
                  <div className="w-full h-60 overflow-hidden rounded-lg mb-4 bg-black">
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-white font-semibold text-base line-clamp-2">
                      {item.titulo}
                    </h3>
                    <p className="text-purple-300 font-bold">Precio: ${item.precio}</p>
                    <p className="text-gray-300 text-sm">Stock disponible: {item.stock}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        
        <div className="text-center">
          <Link to={`/community/${artist._id}`}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
              Ir a Comunidad
            </Button>
          </Link>
        </div>
      </main>
      <Footer />

      
      <ArtistModal
        artist={artist}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ArtistDetail;
