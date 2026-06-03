import { useState } from "react";
import { Link } from "react-router-dom";

interface Artist {
  _id: string;
  nombre: string;
  descripcion: string;
}

interface ArtistCommunityTabsProps {
  artist: Artist;
}

const ArtistCommunityTabs: React.FC<ArtistCommunityTabsProps> = ({ artist }) => {
  const [activeTab, setActiveTab] = useState<"artist" | "media" | "membership">("artist");

  return (
    <div className="bg-black text-white rounded-xl shadow-lg px-8 py-10 w-full max-w-5xl mx-auto">
      
      <nav className="flex gap-6 justify-center border-b border-gray-700 pb-4 mb-8">
        <button
          onClick={() => setActiveTab("artist")}
          className={`text-lg font-semibold px-4 py-2 rounded-md transition ${
            activeTab === "artist" ? "bg-purple-700 text-white" : "bg-slate-800 text-white"
          } hover:bg-purple-600`}
        >
          Artista
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`text-lg font-semibold px-4 py-2 rounded-md transition ${
            activeTab === "media" ? "bg-purple-700 text-white" : "bg-slate-800 text-white"
          } hover:bg-purple-600`}
        >
          Media
        </button>
        <button
          onClick={() => setActiveTab("membership")}
          className={`text-lg font-semibold px-4 py-2 rounded-md transition ${
            activeTab === "membership" ? "bg-purple-700 text-white" : "bg-slate-800 text-white"
          } hover:bg-purple-600`}
        >
          Membresía
        </button>
      </nav>

     
      <div className="space-y-4">
        {activeTab === "artist" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Sobre {artist.nombre}</h2>
            <p className="text-gray-300">{artist.descripcion}</p>
          
          </div>
        )}

        {activeTab === "media" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Contenido multimedia</h2>
            <p className="text-gray-300">
              Aquí podrías mostrar fotos, videos o publicaciones de {artist.nombre}.
            </p>
          </div>
        )}

        {activeTab === "membership" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Contenido exclusivo</h2>
            <p className="text-gray-300 mb-4">
              Compra una membresía para acceder a contenido exclusivo de {artist.nombre}.
            </p>
            <Link
              to={`/membership/${artist._id}`}
              className="inline-block bg-purple-700 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Comprar membresía
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistCommunityTabs;
