import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Filter, Plus, Check } from 'lucide-react';

interface SearchableCategorySelectProps {
  categories: string[];
  selected: string;
  onChange: (value: string) => void;
  onAddNewClick: () => void;
}

export const SearchableCategorySelect = React.memo(({
  categories,
  selected,
  onChange,
  onAddNewClick
}: SearchableCategorySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const sortedAndFiltered = useMemo(() => {
    return categories
      .filter(c => c.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
  }, [categories, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-4 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 bg-white cursor-pointer flex justify-between items-center shadow-sm hover:border-slate-400 transition-all text-sm"
      >
        <span className={selected ? "text-slate-800" : "text-slate-400"}>
          {selected || "Select or Search Category..."}
        </span>
        <Filter size={16} className="text-slate-400" />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-100">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search categories..." 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500 bg-white" 
              onClick={e => e.stopPropagation()} 
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {sortedAndFiltered.map(c => (
              <div 
                key={c} 
                onClick={() => { 
                  onChange(c); 
                  setIsOpen(false); 
                  setSearch(''); 
                }} 
                className={`px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 cursor-pointer flex justify-between items-center ${selected === c ? 'bg-blue-50 text-blue-700' : ''}`}
              >
                <span>{c}</span>
                {selected === c && <Check size={14} className="text-blue-600" />}
              </div>
            ))}
            {sortedAndFiltered.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-400 font-medium text-center">
                No categories found
              </div>
            )}
          </div>
          <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-center">
            <button 
              type="button" 
              onClick={(e) => { 
                e.stopPropagation(); 
                onAddNewClick(); 
                setIsOpen(false); 
              }} 
              className="w-full text-xs font-bold text-blue-600 flex items-center justify-center gap-1 hover:text-blue-800 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus size={14}/> Add Custom Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

SearchableCategorySelect.displayName = 'SearchableCategorySelect';
