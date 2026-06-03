import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArtistSection = () => {
  const [artistas, setArtistas] = useState([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/artists")
      .then((res) => {
        setArtistas(res.data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar artistas", err);
      });
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="px-16 py-10 bg-gradient-to-b from-[#1a1d23] to-[#2c2c34] text-white relative">
      {/* Título y botón "ver más" */}
      <div className="flex items-center justify-start mb-6 gap-4">
        <h2 className="text-3xl font-bold">Artistas Destacados</h2>
        <button
          onClick={() => navigate("/artists")}
          className="text-sm text-purple-400 hover:underline"
        >
          ver más
        </button>
      </div>

      {/* Flecha izquierda */}
      <button
        onClick={scrollLeft}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 p-2 rounded-full"
        aria-label="Scroll izquierda"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>

      {/* Carrusel de artistas */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll gap-8 px-6 py-2 hide-scrollbar"
      >
        {artistas.map((artista: any) => (
          <div
            key={artista._id} // ✅ Cambiado de artista.id a artista._id
            className="text-center flex-shrink-0 w-40 cursor-pointer"
            onClick={() => navigate(`/artists/${artista._id}`)} // ✅ Cambiado de artista.id a artista._id
          >
            <div className="w-32 h-32 mx-auto overflow-hidden rounded-full border-4 border-purple-500 transition-transform duration-300 hover:scale-110">
              <img
                src={artista.imagenes.foto_perfil}
                alt={artista.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mt-3">{artista.nombre}</h3>
          </div>
        ))}
      </div>

      {/* Flecha derecha */}
      <button
        onClick={scrollRight}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 p-2 rounded-full"
        aria-label="Scroll derecha"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>
    </section>
  );
};

export default ArtistSection;