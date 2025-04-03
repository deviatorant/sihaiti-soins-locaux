
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Plus, Minus, Heart } from "lucide-react";

const Shop = () => {
  const { t, isRTL } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{id: number, name: string, price: number, quantity: number}[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Product categories
  const categories = [
    "Vitamins", "Personal Care", "Baby Products", "Medical Devices", 
    "First Aid", "Orthopaedic", "Elderly Care", "Wellness"
  ];

  // Sample products
  const products = [
    { id: 1, name: "Multivitamin Complex", category: "Vitamins", price: 24.99, rating: 4.5, sale: false, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 2, name: "Blood Pressure Monitor", category: "Medical Devices", price: 89.99, rating: 4.8, sale: true, salePrice: 69.99, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 3, name: "Baby Thermometer", category: "Baby Products", price: 34.50, rating: 4.7, sale: false, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 4, name: "First Aid Kit", category: "First Aid", price: 45.00, rating: 4.9, sale: false, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 5, name: "Omega-3 Fish Oil", category: "Vitamins", price: 19.99, rating: 4.6, sale: true, salePrice: 15.99, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 6, name: "Wrist Brace", category: "Orthopaedic", price: 29.99, rating: 4.4, sale: false, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 7, name: "Mobility Walker", category: "Elderly Care", price: 125.00, rating: 4.7, sale: true, salePrice: 99.99, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 8, name: "Essential Oil Diffuser", category: "Wellness", price: 39.99, rating: 4.5, sale: false, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 9, name: "Moisturizing Cream", category: "Personal Care", price: 15.99, rating: 4.3, sale: false, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 10, name: "Digital Scale", category: "Wellness", price: 49.99, rating: 4.6, sale: false, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 11, name: "Baby Monitor", category: "Baby Products", price: 129.99, rating: 4.8, sale: true, salePrice: 99.99, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
    { id: 12, name: "Glucose Meter", category: "Medical Devices", price: 59.99, rating: 4.7, sale: false, image: "https://placehold.co/300x300/e2e8f0/64748b?text=Product" },
  ];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    return (
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === null || product.category === selectedCategory)
    );
  });

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const toggleFavorite = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const addToCart = (product: {id: number, name: string, price: number, sale?: boolean, salePrice?: number}) => {
    const price = product.sale && product.salePrice ? product.salePrice : product.price;
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    console.log("Checkout with items:", cart);
    alert(t('shop.orderPlaced'));
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('shop.title')}
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar with filters and cart */}
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="sticky top-20">
                {/* Search */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={18} />
                      <Input
                        type="text"
                        placeholder={t('shop.searchProducts')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>
                    
                    <h3 className="font-medium mb-2">{t('shop.categories')}</h3>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <div 
                          key={category} 
                          className={`px-2 py-1 rounded cursor-pointer text-sm ${
                            selectedCategory === category ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleCategoryFilter(category)}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shopping Cart */}
                {cart.length > 0 && (
                  <Card className="mb-6">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3 flex items-center">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {t('shop.cart')} ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                      </h3>
                      
                      <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                            <div className="flex-1">
                              <p className="font-medium truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">${item.price} × {item.quantity}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm w-4 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">{t('shop.total')}</span>
                          <span className="font-bold">${getTotalPrice()}</span>
                        </div>
                        <Button 
                          className="w-full bg-medical-blue hover:bg-medical-blue/90"
                          onClick={handleCheckout}
                        >
                          {t('shop.checkout')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Main content - products */}
            <div className="flex-1">
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">{t('shop.allProducts')}</TabsTrigger>
                  <TabsTrigger value="sale">{t('shop.onSale')}</TabsTrigger>
                  <TabsTrigger value="favorites">{t('shop.favorites')}</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length === 0 ? (
                      <div className="col-span-3 text-center py-8">
                        <p className="text-gray-500">{t('shop.noProductsFound')}</p>
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            {product.sale && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {t('shop.sale')}
                              </div>
                            )}
                            <button 
                              className="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <Heart 
                                className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                              />
                            </button>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-56 object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                            
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                {product.sale ? (
                                  <div className="flex items-center">
                                    <span className="text-lg font-bold text-medical-blue">${product.salePrice}</span>
                                    <span className="text-sm text-gray-400 line-through ml-2">${product.price}</span>
                                  </div>
                                ) : (
                                  <span className="text-lg font-bold text-medical-blue">${product.price}</span>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-medical-blue hover:bg-medical-blue/90"
                                onClick={() => addToCart(product)}
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="sale" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.filter(p => p.sale).length === 0 ? (
                      <div className="col-span-3 text-center py-8">
                        <p className="text-gray-500">{t('shop.noSaleProducts')}</p>
                      </div>
                    ) : (
                      filteredProducts.filter(p => p.sale).map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              {t('shop.sale')}
                            </div>
                            <button 
                              className="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <Heart 
                                className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                              />
                            </button>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-56 object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                            
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-lg font-bold text-medical-blue">${product.salePrice}</span>
                                <span className="text-sm text-gray-400 line-through ml-2">${product.price}</span>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-medical-blue hover:bg-medical-blue/90"
                                onClick={() => addToCart(product)}
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="favorites" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.filter(p => favorites.includes(p.id)).length === 0 ? (
                      <div className="col-span-3 text-center py-8">
                        <p className="text-gray-500">{t('shop.noFavorites')}</p>
                      </div>
                    ) : (
                      filteredProducts.filter(p => favorites.includes(p.id)).map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            {product.sale && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {t('shop.sale')}
                              </div>
                            )}
                            <button 
                              className="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </button>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-56 object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                            
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                {product.sale ? (
                                  <div className="flex items-center">
                                    <span className="text-lg font-bold text-medical-blue">${product.salePrice}</span>
                                    <span className="text-sm text-gray-400 line-through ml-2">${product.price}</span>
                                  </div>
                                ) : (
                                  <span className="text-lg font-bold text-medical-blue">${product.price}</span>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-medical-blue hover:bg-medical-blue/90"
                                onClick={() => addToCart(product)}
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;
