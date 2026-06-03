import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share, CreditCard, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Artist {
  _id: string;
  nombre: string;
  descripcion: string;
  image?: string;
}

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("artist");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: ""
  });
  
  
  const [hasMembership, setHasMembership] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (!id) {
      setError("No se proporcionó ID del artista");
      setLoading(false);
      return;
    }

    const fetchArtist = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:5000/api/artists/${id}`);
        if (!res.ok) throw new Error("Error al obtener artista");
        const data = await res.json();
        setArtist(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  
  useEffect(() => {
    const savedMembership = localStorage.getItem(`membership_${user?.id}_${id}`);
    if (savedMembership === 'true') {
      setHasMembership(true);
    }
  }, [user?.id, id]);

  
  const handlePayment = async () => {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.name) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    
    setTimeout(() => {
      setIsProcessing(false);
      
      
      setHasMembership(true);
      
      
      if (user && id) {
        localStorage.setItem(`membership_${user.id}_${id}`, 'true');
      }
      
      toast({
        title: "¡Membresía activada!",
        description: `Ahora tienes acceso al contenido exclusivo de ${artist?.nombre || 'este artista'}`
      });
      
      setShowPaymentForm(false);
      
      setPaymentData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        name: ""
      });
    }, 2000);
  };

  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Datos locales de ejemplo para posts, videos y contenido exclusivo
  const posts = [
    {
      id: 1,
      artist: artist?.nombre || "Artista",
      time: "Jun 10, 2024 7:48 a.m.",
      content: "¡Hola a todos! Espero que tengan un día increíble. Pronto les compartiré nueva música, ¡manténganse atentos!",
      image: null,
      reactions: { heart: 15420, like: 8932 },
      comments: 2341,
      isExclusive: false
    },
    {
      id: 2,
      artist: artist?.nombre || "Artista",
      time: "Jun 10, 2024 9:12 a.m.",
      content: "Trabajando en algo especial para ustedes. La creatividad no tiene límites y espero poder compartir pronto este nuevo proyecto que tengo entre manos.",
      image: "https://res.cloudinary.com/dkrugfamf/image/upload/v1749809768/descarga_27_uivcbf.jpg",
      reactions: { heart: 9876, like: 5432 },
      comments: 1234,
      isExclusive: false
    }
  ];

  const videos = [
    {
      id: 1,
      title: `${artist?.nombre || "Artista"} - Boys a Liar Video Oficial`,
      thumbnail: "https://res.cloudinary.com/dkrugfamf/image/upload/v1749915491/pinkpantheress_ice_spice_boys_a_liar_pt_2_photoshoot_owpy4k.jpg",
      url: "https://youtu.be/oftolPu9qp4?si=tQD8I_POh-eflcb1"
    },
    {
      id: 2,
      title: `${artist?.nombre || "Artista"} - Illegal Video Oficial`,
      thumbnail: "https://res.cloudinary.com/dkrugfamf/image/upload/v1749915571/descarga_33_zfrpim.jpg",
      url: "https://youtu.be/TFWXqLSr4ZM?si=l2ax-UKaLX0f5UpB"
    }
  ];

  const exclusiveContent = [
    {
      id: 1,
      artist: artist?.nombre || "Artista",
      time: "Jun 9, 2024 3:30 p.m.",
      content: "¡Contenido exclusivo para miembros! Aquí tienes un adelanto de mi próxima canción...",
      image: null,
      reactions: { heart: 25680, like: 15432 },
      comments: 4521,
      isExclusive: true
    }
  ];

  const handleReaction = (postId: number, type: string) => {
    console.log(`Reacting to post ${postId} with ${type}`);
  };

  const openYouTubeVideo = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <Navbar artistName="Cargando..." />
        <main className="py-12 px-4 max-w-7xl mx-auto text-center">
          <div className="text-white text-xl">Cargando comunidad...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <Navbar artistName="Error" />
        <main className="py-12 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error: {error}</h1>
          <Link
            to="/artists"
            className="text-purple-400 hover:underline inline-block"
          >
            ← Volver a artistas
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <Navbar artistName="Comunidad no encontrada" />
        <main className="py-12 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Comunidad no encontrada</h1>
          <Link
            to="/artists"
            className="text-purple-400 hover:underline inline-block"
          >
            ← Volver a artistas
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Navbar artistName={artist.nombre} />
      
      <main className="py-8 px-4 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 mb-6">
            <TabsTrigger value="artist" className="text-white data-[state=active]:bg-purple-600">
              Artista
            </TabsTrigger>
            <TabsTrigger value="media" className="text-white data-[state=active]:bg-purple-600">
              Media
            </TabsTrigger>
            <TabsTrigger value="membership" className="text-white data-[state=active]:bg-purple-600">
              Membresía
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artist" className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Publicaciones Públicas</h2>
            {posts.map((post) => (
              <div key={post.id} className="bg-slate-800/50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={artist.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"} 
                    alt={post.artist}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="text-white font-medium">{post.artist} - Publicación</h3>
                    <p className="text-slate-400 text-sm">{post.time}</p>
                  </div>
                </div>
                <p className="text-white mb-4">{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="Post content" className="w-full rounded-lg mb-4" />
                )}
                <div className="flex items-center space-x-6 text-slate-400">
                  <button 
                    className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    onClick={() => handleReaction(post.id, 'heart')}
                  >
                    <Heart className="w-5 h-5" />
                    <span>{post.reactions.heart}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                    <Share className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div 
                  key={video.id} 
                  className="cursor-pointer group"
                  onClick={() => openYouTubeVideo(video.url)}
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors">{video.title}</h3>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="membership" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contenido Exclusivo</h2>
              {!hasMembership ? (
                <>
                  <p className="text-slate-400 mb-4">
                    Únete a la membresía para acceder a contenido exclusivo
                  </p>
                  {!showPaymentForm ? (
                    <Button 
                      onClick={() => setShowPaymentForm(true)}
                      className="bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                      Obtener Membresía - $9.99/mes
                    </Button>
                  ) : null}
                </>
              ) : (
                <p className="text-slate-400 mb-4">
                  ¡Bienvenido al contenido exclusivo!
                </p>
              )}
            </div>

            {/* Formulario de pago */}
            {showPaymentForm && !hasMembership && (
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-white">
                    Membresía Premium - {artist.nombre}
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Completa tu información de pago para activar la membresía
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-medium text-white mb-3">Beneficios incluidos:</h3>
                    <ul className="text-slate-300 space-y-2 text-sm">
                      <li>• Publicaciones exclusivas del artista</li>
                      <li>• Merchandise exclusivo para miembros</li>
                      <li>• Acceso anticipado a nuevos lanzamientos</li>
                      <li>• Contenido behind-the-scenes</li>
                      <li>• Descuentos especiales en productos</li>
                    </ul>
                  </div>

                  
                  <div className="text-center bg-purple-600/20 p-4 rounded-lg border border-purple-500">
                    <div className="text-2xl font-bold text-white">$9.99</div>
                    <div className="text-slate-300">por mes</div>
                  </div>

                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Lock className="w-4 h-4" />
                      Transacción segura y encriptada
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName" className="text-white">Nombre en la tarjeta</Label>
                      <Input
                        id="cardName"
                        value={paymentData.name}
                        onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                        placeholder="John Doe"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber" className="text-white">Número de tarjeta</Label>
                      <Input
                        id="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiryDate" className="text-white">Vencimiento</Label>
                        <Input
                          id="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData({ ...paymentData, expiryDate: formatExpiryDate(e.target.value) })}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-white">CVV</Label>
                        <Input
                          id="cvv"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })}
                          placeholder="123"
                          maxLength={3}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setShowPaymentForm(false)}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isProcessing ? (
                        "Procesando..."
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pagar $9.99/mes
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    Al completar la compra, aceptas nuestros términos y condiciones. 
                    La membresía se renovará automáticamente cada mes.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {hasMembership && (
              <div className="space-y-6">
                {exclusiveContent.map((post) => (
                  <div key={post.id} className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-lg p-6 border border-purple-500">
                    <div className="flex items-center mb-4">
                      <img 
                        src={artist.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"} 
                        alt={post.artist}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="text-white font-medium">{post.artist} - Contenido Exclusivo</h3>
                        <p className="text-slate-400 text-sm">{post.time}</p>
                      </div>
                    </div>
                    <p className="text-white mb-4">{post.content}</p>
                    {post.image && (
                      <img src={post.image} alt="Exclusive content" className="w-full rounded-lg mb-4" />
                    )}
                    <div className="flex items-center space-x-6 text-slate-400">
                      <button 
                        className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                        onClick={() => handleReaction(post.id, 'heart')}
                      >
                        <Heart className="w-5 h-5" />
                        <span>{post.reactions.heart}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                        <Share className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!hasMembership && !showPaymentForm && (
              <div className="bg-slate-800/30 rounded-lg p-8 text-center border border-slate-600">
                <p className="text-slate-400 text-lg">
                  El contenido exclusivo está disponible solo para miembros
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Obtén tu membresía para desbloquear publicaciones exclusivas, merchandise especial y más contenido único
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        
        <div className="text-center mt-8">
          <Link
            to={`/artists/${artist._id}`}
            className="text-purple-400 hover:underline inline-block transition-colors"
          >
            ← Volver al detalle del artista
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommunityPage;