import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

interface Artista {
  _id: string;
  nombre: string;
  descripcion: string;
  imagenes: {
    foto_perfil: string;
  };
}

const Artists = () => {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/artists")
      .then((res) => {
        setArtistas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudieron cargar los artistas.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <main className="py-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Todos los Artistas</h1>

        {loading ? (
          <p className="text-white">Cargando artistas...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artistas.map((artist) => (
              <Link
                to={`/artists/${artist._id}`}
                key={artist._id}
                className="bg-slate-800 rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={artist.imagenes.foto_perfil}
                  alt={artist.nombre}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2">{artist.nombre}</h3>
                  <p className="text-slate-300 text-sm">{artist.descripcion}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Artists;
