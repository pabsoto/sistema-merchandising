import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Artist {
  nombre: string;
  descripcion?: string;
  imagenes: {
    foto_perfil: string;
  };
}

interface ArtistModalProps {
  artist: Artist;
  isOpen: boolean;
  onClose: () => void;
}

const ArtistModal = ({ artist, isOpen, onClose }: ArtistModalProps) => {
  if (!artist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{artist.nombre}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <img
            src={artist.imagenes.foto_perfil}
            alt={artist.nombre}
            className="w-full h-64 object-cover rounded-lg border border-purple-500"
          />
          <p className="text-slate-300 whitespace-pre-line">
            {artist.descripcion || "Este artista aún no tiene una biografía disponible."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistModal;
