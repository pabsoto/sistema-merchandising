import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  isExclusive: boolean;
};

type User = {
  _id: string;
  name: string;
  email: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"users" | "products">("users");
  
  // Estados para usuarios
  const [editingUser, setEditingUser] = useState<null | {
    id: string;
    name: string;
    email: string;
  }>(null);

  // Estados para productos
  const [editingProduct, setEditingProduct] = useState<null | (Product & { id: string })>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
    isExclusive: false
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // ========================= USUARIOS =========================

  // Fetch users
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/auth/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al obtener usuarios");
    }
    return await res.json();
  };

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: activeTab === "users",
  });

  // Delete user mutation
  const deleteUser = async (userId: string) => {
    const res = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al eliminar usuario");
    }
    return res.json();
  };

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario eliminado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update user mutation
  const updateUser = async (userData: {
    id: string;
    name: string;
    email: string;
  }) => {
    const res = await fetch(`http://localhost:5000/api/auth/users/${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
      }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al actualizar usuario");
    }
    return res.json();
  };

  const { mutate: updateUserMutation } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
      toast.success("Usuario actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (userId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      deleteUserMutation(userId);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUserMutation(editingUser);
    }
  };

  // ========================= PRODUCTOS =========================

  // Fetch products
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al obtener productos");
    }
    return await res.json();
  };

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    enabled: activeTab === "products",
  });

  // Add product mutation
  const addProduct = async (productData: typeof newProduct) => {
    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productData),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al agregar producto");
    }
    return res.json();
  };

  const { mutate: addProductMutation } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowAddModal(false);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        image: "",
        isExclusive: false
      });
      toast.success("Producto agregado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete product mutation
  const deleteProduct = async (productId: string) => {
    const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al eliminar producto");
    }
    return res.json();
  };

  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update product mutation
  const updateProduct = async (productData: Product & { id: string }) => {
    const res = await fetch(`http://localhost:5000/api/products/${productData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        image: productData.image,
        isExclusive: productData.isExclusive
      }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al actualizar producto");
    }
    return res.json();
  };

  const { mutate: updateProductMutation } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
      toast.success("Producto actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      deleteProductMutation(productId);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({
      ...product,
      id: product._id
    });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProductMutation(newProduct);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation(editingProduct);
    }
  };

  return (
    <div className="p-8 text-white bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administrador</h1>
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="text-white hover:text-purple-300"
        >
          Volver a la Tienda
        </Button>
      </div>

      <p className="text-lg mb-6">Bienvenido al panel administrativo. Desde aquí puedes gestionar usuarios y productos.</p>

      <div className="my-6 flex gap-4">
        <Button
          onClick={() => setActiveTab("users")}
          className={activeTab === "users" 
            ? "bg-green-600 hover:bg-green-700 text-white" 
            : "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
          }
        >
          Usuarios
        </Button>
        <Button
          onClick={() => setActiveTab("products")}
          className={activeTab === "products" 
            ? "bg-green-600 hover:bg-green-700 text-white" 
            : "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
          }
        >
          Productos
        </Button>
      </div>

      {/* ========================= SECCIÓN USUARIOS ========================= */}
      {activeTab === "users" && (
        <div>
          {loadingUsers ? (
            <p className="text-white">Cargando usuarios...</p>
          ) : (
            <>
              {/* Modal de edición de usuario */}
              {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-xl font-bold mb-4">Editar Usuario</h3>
                    <form onSubmit={handleUpdateSubmit}>
                      <div className="mb-4">
                        <label className="block mb-2">Nombre</label>
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, name: e.target.value })
                          }
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2">Email</label>
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, email: e.target.value })
                          }
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingUser(null)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">Guardar Cambios</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Tabla de usuarios */}
              <table className="w-full text-left border border-gray-600 mt-4">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-2">Nombre</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: User) => (
                    <tr key={user._id} className="border-t border-gray-600">
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2 flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* ========================= SECCIÓN PRODUCTOS ========================= */}
      {activeTab === "products" && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAddModal(true)}>
              Agregar Producto
            </Button>
          </div>

          {loadingProducts ? (
            <p className="text-white">Cargando productos...</p>
          ) : (
            <>
              {/* Modal para agregar producto */}
              {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-xl font-bold mb-4">Agregar Producto</h3>
                    <form onSubmit={handleAddProduct}>
                      <div className="mb-4">
                        <label className="block mb-2">Nombre</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2">Descripción</label>
                        <textarea
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2">Precio</label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2">Stock</label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2">URL de la imagen</label>
                        <input
                          type="text"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4 flex items-center">
                        <input
                          type="checkbox"
                          id="isExclusive"
                          checked={newProduct.isExclusive}
                          onChange={(e) => setNewProduct({...newProduct, isExclusive: e.target.checked})}
                          className="mr-2"
                        />
                        <label htmlFor="isExclusive">Producto Exclusivo</label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">Agregar</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal para editar producto */}
              {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-xl font-bold mb-4">Editar Producto</h3>
                    <form onSubmit={handleUpdateProduct}>
                      <div className="mb-4">
                        <label className="block mb-2">Nombre</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2">Descripción</label>
                        <textarea
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2">Precio</label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2">Stock</label>
                        <input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2">URL de la imagen</label>
                        <input
                          type="text"
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                          className="w-full p-2 rounded bg-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="mb-4 flex items-center">
                        <input
                          type="checkbox"
                          id="editIsExclusive"
                          checked={editingProduct.isExclusive}
                          onChange={(e) => setEditingProduct({...editingProduct, isExclusive: e.target.checked})}
                          className="mr-2"
                        />
                        <label htmlFor="editIsExclusive">Producto Exclusivo</label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingProduct(null)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">Guardar Cambios</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Tabla de productos */}
              <table className="w-full text-left border border-gray-600 mt-4">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-2">Nombre</th>
                    <th className="p-2">Descripción</th>
                    <th className="p-2">Precio</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product: Product) => (
                    <tr key={product._id} className="border-t border-gray-600">
                      <td className="p-2">{product.name}</td>
                      <td className="p-2 max-w-xs truncate">{product.description}</td>
                      <td className="p-2">${product.price.toFixed(2)}</td>
                      <td className="p-2">{product.stock}</td>
                      <td className="p-2 flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;