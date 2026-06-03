import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    province: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: ""
  });

  const bolivianDepartments = [
    "La Paz", "Cochabamba", "Santa Cruz", "Oruro", "Potosí", 
    "Tarija", "Chuquisaca", "Beni", "Pando"
  ];

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/');
    return null;
  }

  const [isProcessing, setIsProcessing] = useState(false);  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Validación básica
    if (!formData.firstName || !formData.lastName || !formData.department || !formData.province) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }
    setTimeout(() => {
      const newOrderNumber = `ATL-${Date.now()}`;
      setOrderNumber(newOrderNumber);
      setShowConfirmation(true);
      setIsProcessing(false);
    }, 2000);

  };
  
  const handleCloseModal = () => {
    setShowConfirmation(false);
    clearCart();
    setTimeout(() => {
    navigate('/');
    }, 300); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Link to="/">
            <h1 className="text-2xl font-bold text-white">ATELIER STORE</h1>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="text-purple-300 hover:text-white flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            Continuar comprando
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Información de envío</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">Nombre *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">Apellido *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="department" className="text-white">Departamento *</Label>
                    <Select onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Selecciona un departamento" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {bolivianDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept} className="text-white">
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="province" className="text-white">Provincia *</Label>
                    <Input
                      id="province"
                      value={formData.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-600">
                    <h3 className="text-white text-lg font-semibold mb-4">Información de pago</h3>
                    
                    <div>
                      <Label htmlFor="cardName" className="text-white">Nombre en la tarjeta</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="cardNumber" className="text-white">Número de tarjeta</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-white">Fecha de expiración</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          placeholder="MM/AA"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-white">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          placeholder="123"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button 
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
                    >
                      {isProcessing ? 'Procesando Pago...' : 'Procesar Pago'}
                      
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300"
                      onClick={() => navigate('/')}
                    >
                      Continuar Comprando
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-slate-600">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{item.name}</h3>
                        
                        <p className="text-purple-300 font-bold">{item.price}</p>
                      </div>
                      <div className="text-white">
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-slate-600">
                    <div className="flex justify-between items-center text-xl font-bold text-white">
                      <span>Total:</span>
                      <span className="text-purple-300">{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-slate-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">¡Pedido Confirmado!</DialogTitle>
              <DialogDescription asChild>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-300">Tu pedido ha sido procesado exitosamente</p>
                  <p className="text-purple-400 font-semibold">Número de pedido: {orderNumber}</p>
                  <p className="text-sm text-gray-400">
                    Recibirás un correo electrónico con los detalles de tu pedido y el seguimiento del envío.
                   </p>
                  <div className="flex space-x-4 justify-center mt-6">
                    <button
                      onClick={handleCloseModal}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                      >
                      Continuar Comprando
                    </button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
      </Dialog>  
    </div>
  );
};

export default Checkout;