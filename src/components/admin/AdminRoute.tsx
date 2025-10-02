// src/components/admin/AdminRoute.tsx
import { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { ProductForm } from './ProductForm';
import { Product } from '../../store/adminStore';

export function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuthenticated');
    setIsAuthenticated(!!auth);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
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
      
      {showProductForm && (
        <ProductForm 
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
      
      {editingProduct && (
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