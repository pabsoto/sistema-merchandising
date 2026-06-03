import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  image: string;
  stock: number;
  isExclusive: boolean;
}

const Merch = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  
  
  const filter = searchParams.get('filter');

  
  const filterProductsByDescription = (products: Product[], keyword: string) => {
    return products.filter(product => 
      product.description.toLowerCase().includes(keyword.toLowerCase()) ||
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  
  const getPageTitle = () => {
    switch (filter) {
      case 'vinilo':
        return 'Vinilos';
      case 'cd':
        return 'CDs';
      case 'album':
        return 'Álbumes';
      default:
        return 'Toda la Mercancía';
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        console.log("Productos cargados:", response.data);
      } catch (error) {
        console.error("Error al cargar los productos", error);
      }
    };

    fetchProducts();
  }, []);

  // Aplicar filtro cuando cambien los productos o el filtro
  useEffect(() => {
    if (filter && products.length > 0) {
      const filtered = filterProductsByDescription(products, filter);
      setFilteredProducts(filtered);
      console.log(`Productos filtrados por "${filter}":`, filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, filter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <main className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">{getPageTitle()}</h1>
          {filter && (
            <p className="text-slate-300">
              {filteredProducts.length} productos encontrados con "{filter}"
            </p>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              {filter 
                ? `No se encontraron productos con "${filter}" en la descripción.`
                : 'No hay productos disponibles.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item._id}
                className="bg-slate-800 rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/products/${item._id}`)}  
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-slate-300 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-slate-400 text-sm mb-2">Stock: {item.stock}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-purple-300 font-bold text-lg">
                      ${item.price.toFixed(2)}
                    </p>
                    {item.isExclusive && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        Exclusivo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Merch;