import React, { createContext, useContext, useState, useMemo } from 'react';
import { startupData, Startup } from '../data';

interface FilterContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  filteredData: Startup[];
  countries: string[];
  industries: string[];
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const countries = useMemo(() => ['All', ...Array.from(new Set(startupData.map(s => s.Country))).sort()], []);
  const industries = useMemo(() => ['All', ...Array.from(new Set(startupData.map(s => s.Industry))).sort()], []);

  const filteredData = useMemo(() => {
    return startupData.filter(s => {
      const countryMatch = selectedCountry === 'All' || s.Country === selectedCountry;
      const industryMatch = selectedIndustry === 'All' || s.Industry === selectedIndustry;
      return countryMatch && industryMatch;
    });
  }, [selectedCountry, selectedIndustry]);

  return (
    <FilterContext.Provider value={{ 
      selectedCountry, setSelectedCountry, 
      selectedIndustry, setSelectedIndustry, 
      filteredData, countries, industries 
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
