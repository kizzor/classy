import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './views/HomePage';
import { ProductDetailPage } from './views/ProductDetailPage';
import { UserProfilePage } from './views/UserProfilePage';
import { PostAdModal } from './components/product/PostAdModal';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
          
          {/* Global Sandbox Gated Ad Poster Modal */}
          <PostAdModal />
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
