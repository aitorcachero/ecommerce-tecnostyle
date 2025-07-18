import React, { useState, useEffect, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';
import { useProducts } from '../../contexts/ProductsContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
// Eliminamos la importación del MultiRangeSlider
// import MultiRangeSlider from '../../components/MultiRangeSlider/MultiRangeSlider';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductsPage() {
  const { products, loading, getProducts } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    'Todas las categorías'
  );
  const [selectedOrder, setSelectedOrder] = useState('Ordenar por');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Estado simplificado para el rango de precio
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });

  const categories = [
    'Todas las categorías',
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
    'furniture',
    'tops',
    'womens-dresses',
    'womens-shoes',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'sunglasses',
    'automotive',
    'motorcycle',
    'lighting',
  ];

  const orderOptions = [
    'Ordenar por',
    'Precio: Menor a Mayor',
    'Precio: Mayor a Menor',
    'Nombre: A-Z',
    'Nombre: Z-A',
    'Rating: Mayor a Menor',
  ];

  // Cargar productos al montar el componente
  useEffect(() => {
    if (!products.length) {
      getProducts();
    }
  }, [products.length, getProducts]);

  // Filtrar y ordenar productos
  useEffect(() => {
    let filtered = [...products];

    // Filtrar por categoría
    if (selectedCategory !== 'Todas las categorías') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Ordenar productos
    switch (selectedOrder) {
      case 'Precio: Menor a Mayor':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Precio: Mayor a Menor':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Nombre: A-Z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Nombre: Z-A':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'Rating: Mayor a Menor':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedOrder, priceRange, searchTerm]);

  // Handlers
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleOrderChange = (orderType) => {
    setSelectedOrder(orderType);
  };

  // Handler para el slider de precio mínimo
  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange((prev) => ({
      min: value,
      max: Math.max(value, prev.max),
    }));
  };

  // Handler para el slider de precio máximo
  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange((prev) => ({
      min: Math.min(prev.min, value),
      max: value,
    }));
  };

  // Handler para inputs de precio
  const handleMinInputChange = (e) => {
    const value = Math.max(
      0,
      Math.min(parseInt(e.target.value) || 0, priceRange.max)
    );
    setPriceRange((prev) => ({ ...prev, min: value }));
  };

  const handleMaxInputChange = (e) => {
    const value = Math.min(
      2000,
      Math.max(parseInt(e.target.value) || 0, priceRange.min)
    );
    setPriceRange((prev) => ({ ...prev, max: value }));
  };

  const handleReset = () => {
    setSelectedCategory('Todas las categorías');
    setSelectedOrder('Ordenar por');
    setSearchTerm('');
    setPriceRange({ min: 0, max: 2000 });
  };

  const activeFiltersCount = [
    selectedCategory !== 'Todas las categorías',
    selectedOrder !== 'Ordenar por',
    priceRange.min > 0 || priceRange.max < 2000,
    searchTerm.trim().length > 0,
  ].filter(Boolean).length;

  if (loading) {
    return <Loader />;
  }

  // Efecto para mostrar/ocultar el botón de scroll to top
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300); // Mostrar después de 300px de scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para hacer scroll al top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Productos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra amplia selección de productos de alta calidad
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Botón de filtros móvil */}
          <div className="mt-6 lg:hidden flex justify-center">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar de filtros */}
          <aside
            className={`lg:col-span-1 ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Header de filtros */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2 text-blue-500" />
                  Filtros
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden p-1 text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Filtro de categoría */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Categoría
                </h3>
                <Listbox
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {({ open }) => (
                    <>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-xl border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                          <span className="block truncate font-medium">
                            {selectedCategory}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={React.Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {categories.map((category) => (
                              <Listbox.Option
                                key={category}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? 'bg-blue-50 text-blue-600'
                                      : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50 transition-colors duration-150'
                                  )
                                }
                                value={category}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected
                                          ? 'font-semibold text-blue-600'
                                          : 'font-normal',
                                        'block truncate'
                                      )}
                                    >
                                      {category}
                                    </span>
                                    {selected && (
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <CheckIcon className="h-5 w-5 text-blue-600" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>

              {/* Filtro de orden */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ordenar por
                </h3>
                <Listbox value={selectedOrder} onChange={handleOrderChange}>
                  {({ open }) => (
                    <>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-xl border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                          <span className="block truncate font-medium">
                            {selectedOrder}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={React.Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {orderOptions.map((orderType) => (
                              <Listbox.Option
                                key={orderType}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? 'bg-blue-50 text-blue-600'
                                      : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50 transition-colors duration-150'
                                  )
                                }
                                value={orderType}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected
                                          ? 'font-semibold text-blue-600'
                                          : 'font-normal',
                                        'block truncate'
                                      )}
                                    >
                                      {orderType}
                                    </span>
                                    {selected && (
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <CheckIcon className="h-5 w-5 text-blue-600" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>

              {/* Filtro de rango de precio - NUEVO SLIDER MODERNO */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rango de Precio
                </h3>
                <div className="space-y-6">
                  {/* Valores actuales */}
                  <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                      ${priceRange.min}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                      ${priceRange.max}
                    </span>
                  </div>

                  {/* Slider dual moderno */}
                  <div className="relative px-2">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      {/* Barra de progreso */}
                      <div
                        className="absolute h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        style={{
                          left: `${(priceRange.min / 2000) * 100}%`,
                          width: `${
                            ((priceRange.max - priceRange.min) / 2000) * 100
                          }%`,
                        }}
                      />

                      {/* Slider mínimo */}
                      <input
                        type="range"
                        min={0}
                        max={2000}
                        step={10}
                        value={priceRange.min}
                        onChange={handleMinPriceChange}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                        style={{ zIndex: 1 }}
                      />

                      {/* Slider máximo */}
                      <input
                        type="range"
                        min={0}
                        max={2000}
                        step={10}
                        value={priceRange.max}
                        onChange={handleMaxPriceChange}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                        style={{ zIndex: 2 }}
                      />
                    </div>
                  </div>

                  {/* Inputs de precio */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Mínimo
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={2000}
                        value={priceRange.min}
                        onChange={handleMinInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Máximo
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={2000}
                        value={priceRange.max}
                        onChange={handleMaxInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de productos */}
          <main className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Mostrando{' '}
                <span className="font-medium">{filteredProducts.length}</span>{' '}
                productos
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500 mb-4">
                  Intenta ajustar los filtros para encontrar lo que buscas
                </p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Botón Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Volver arriba"
        >
          <ChevronUpIcon className="h-6 w-6" />
        </button>
      )}

      {/* Estilos CSS para el slider */}
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .slider-thumb:focus {
          outline: none;
        }

        .slider-thumb:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
}
