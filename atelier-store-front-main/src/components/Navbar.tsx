import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, ChevronDown, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./Cart/CartDrawer";
import UserPanel from "./UserPanel";// 👈 Nuevo import
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  artistName?: string;
}

// Interfaz para el artista basada en tu estructura de DB
interface Artist {
  _id: string;
  id: string;
  nombre: string;
  descripcion: string;
  imagenes: {
    foto_perfil: string;
    imagen_fondo: string;
    // ... otros campos de imágenes
  };
}

const Navbar = ({ artistName }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // 👈 Nuevo estado
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, token } = useAuth(); // 👈 Agregamos token
  const { getTotalItems } = useCart();

  // Productos de prueba para búsqueda
  const testProducts = [
    { id: 1, title: "Eternal Sunshine (Lp-Vinilo)", description: "Vinilo 180g con sus últimos sencillos.", price: "$32.97", stock: 15 },
    { id: 2, title: "To Hell With It - CD", description: "CD con booklet de 24 páginas", price: "$14.97", stock: 25 },
    { id: 3, title: "Planet Her - Vinyl", description: "Vinilo 150g con música pop.", price: "$35.99", stock: 8 },
    { id: 4, title: "TYLA (Lp - Vinilo)", description: "Vinilo 150g con música afro pop.", price: "$28.83", stock: 12 },
    { id: 5, title: "Moodswings In This Order - CD", description: "CD con el último lanzamiento.", price: "$29.99", stock: 18 },
    { id: 6, title: "SOUR - CD", description: "CD con un booklet.", price: "$16.99", stock: 22 },
    { id: 7, title: "Tyler Cole Vinyl", description: "Vinilo 180g con música alternativa.", price: "$24.99", stock: 10 },
    { id: 8, title: "SOLO - Single CD", description: "CD del single debut del artista.", price: "$12.99", stock: 30 }
  ];

  const merchCategories = [
    { id: 'vinilo', name: 'Vinilos', keyword: 'vinilo' },
    { id: 'cd', name: 'CDs', keyword: 'cd' },
    { id: 'album', name: 'Álbumes', keyword: 'album' }
  ];

  // Función para cargar artistas desde la API
  const fetchArtists = async () => {
    setIsLoadingArtists(true);
    try {
      const response = await axios.get("http://localhost:5000/api/artists");
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
      // Opcional: mostrar un toast o mensaje de error al usuario
    } finally {
      setIsLoadingArtists(false);
    }
  };

  // Cargar artistas al montar el componente
  useEffect(() => {
    fetchArtists();
  }, []);

  // Función para manejar búsqueda
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = testProducts.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Función para manejar click en resultado de búsqueda
  const handleResultClick = (product: any) => {
    navigate(`/merch/${product.id}`);
    setShowResults(false);
    setSearchQuery("");
  };

  // Función para navegar a la página del artista
  const handleArtistClick = (artist: Artist) => {
    // Usando _id como en tu ejemplo funcional
    navigate(`/artists/${artist._id}`);
  };

  // Función para manejar el filtro de merch por descripción
  const handleMerchFilter = (category: { id: string; name: string; keyword: string }) => {
    // Navegar a la página de merch con el parámetro de filtro
    navigate(`/merch?filter=${category.keyword}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 👈 Nueva función para abrir el panel
  const handlePanelOpen = () => {
    setIsPanelOpen(true);
  };

  return (
    <>
      <nav className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-2xl font-bold text-white">
                  ATELIER STORE
                  {artistName && (
                    <span className="text-lg font-normal text-purple-300 ml-2">
                      - {artistName}
                    </span>
                  )}
                </h1>
              </Link>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar merch..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-b-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                    {searchResults.map((product, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white flex items-center transition-colors"
                        onClick={() => handleResultClick(product)}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-slate-400">{product.description}</div>
                          <div className="text-sm text-purple-300 font-semibold">{product.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Menú de Artistas - Ahora dinámico */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-purple-300 flex items-center gap-1">
                    Artistas
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700 w-screen max-w-sm">
                  {isLoadingArtists ? (
                    <div className="p-4 text-center text-slate-400">
                      Cargando artistas...
                    </div>
                  ) : artists.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {artists.map((artist) => (
                          <DropdownMenuItem 
                            key={artist._id}
                            className="text-white hover:bg-slate-700 cursor-pointer"
                            onClick={() => handleArtistClick(artist)}
                          >
                            {artist.nombre}
                          </DropdownMenuItem>
                        ))}
                      </div>
                      <DropdownMenuSeparator className="bg-slate-600" />
                      <DropdownMenuItem 
                        className="text-purple-300 hover:bg-slate-700 cursor-pointer font-medium"
                        onClick={() => navigate("/artists")}
                      >
                        Ver todos los artistas
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <div className="p-4 text-center text-slate-400">
                      No se encontraron artistas
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Menú de Merch */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-purple-300 flex items-center gap-1">
                    Merch
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700 z-50">
                  {merchCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category.id}
                      className="text-white hover:bg-slate-700 cursor-pointer"
                      onClick={() => handleMerchFilter(category)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-slate-600" />
                  <DropdownMenuItem 
                    className="text-purple-300 hover:bg-slate-700 cursor-pointer font-medium"
                    onClick={() => navigate("/merch")}
                  >
                    Ver toda la mercancía
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Menú de Usuario - 👈 ACTUALIZADO */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:text-purple-300">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700 min-w-[200px]">
                  {isAuthenticated && user ? (
                    <>
                      <DropdownMenuItem className="text-white font-medium cursor-default">
                        {user.name}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-400 text-sm cursor-default">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-600" />
                      
                      {/* 👈 NUEVA OPCIÓN DE PANEL */}
                      <DropdownMenuItem
                        className="text-white hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                        onClick={handlePanelOpen}
                      >
                        <Settings className="w-4 h-4" />
                        Panel
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        className="text-white hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        className="text-white hover:bg-slate-700"
                        onClick={() => navigate("/login")}
                      >
                        Iniciar Sesión
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-white hover:bg-slate-700"
                        onClick={() => navigate("/register")}
                      >
                        Registrarse
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Ícono de carrito con contador */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-purple-300 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer del carrito */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* 👈 NUEVO: Panel de Usuario */}
      <UserPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        user={user}
        token={token}
      />
    </>
  );
};

export default Navbar;