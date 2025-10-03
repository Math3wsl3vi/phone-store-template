// src/components/admin/AdminRoute.tsx
import { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { ProductForm } from './ProductForm';
import { Product } from '../../store/adminStore';
import { useAdminStore } from '../../store/adminStore';

export function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { fetchProducts, fetchOrders } = useAdminStore();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuthenticated');
    setIsAuthenticated(!!auth);
    
    if (!auth) {
      // Pre-load data when authenticated
      fetchProducts();
      fetchOrders();
    }
  }, [fetchProducts, fetchOrders]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchProducts();
    fetchOrders();
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <>
      <AdminDashboard 
        onShowProductForm={() => setShowProductForm(true)}
        onEditProduct={setEditingProduct}
      />
      
      {(showProductForm || editingProduct) && (
        <ProductForm 
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </>
  );
}