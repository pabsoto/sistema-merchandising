import { useCart } from "@/contexts/CartContext";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importar useNavigate

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cartItems, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate(); // 👈 Hook para redireccionar

  // Prevenir scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay/Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            Carrito ({cartItems.length})
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-2">¡Añade algunos productos increíbles!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Cantidad: {item.quantity}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-semibold text-purple-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botones */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-purple-600">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3">
              <button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => {
                  onClose(); // Cierra el drawer
                  navigate("/checkout"); // 👈 Redirige a la página de checkout
                }}
              >
                Proceder al Checkout
              </button>
              
              <button 
                onClick={onClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
