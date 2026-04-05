import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import IndiaAnalysis from './pages/IndiaAnalysis';
import WorldAnalysis from './pages/WorldAnalysis';
import Comparison from './pages/Comparison';
import { FilterProvider } from './context/FilterContext';

export default function App() {
  return (
    <FilterProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndiaAnalysis />} />
            <Route path="world" element={<WorldAnalysis />} />
            <Route path="comparison" element={<Comparison />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FilterProvider>
  );
}
