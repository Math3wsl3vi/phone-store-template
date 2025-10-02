import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedProduct } from '../components/home/FeaturedProduct';
import { ProductCatalog } from '../components/home/ProductCatalog';
import Hero from '../components/home/Hero';
export function HomePage() {
  return <>
  <Hero/>
      <HeroSection />
      <FeaturedProduct />
      <ProductCatalog />
    </>;
}