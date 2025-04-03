
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, ShoppingCart, Plus, Minus, PhoneCall } from "lucide-react";

const Pharmacy = () => {
  const { t, isRTL } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMeds, setSearchedMeds] = useState(false);
  const [cart, setCart] = useState<{id: number, name: string, price: number, quantity: number}[]>([]);

  // Sample medication categories
  const categories = [
    "Pain Relief", "Antibiotics", "Cold & Flu", "Allergy", 
    "Vitamins", "Skin Care", "First Aid", "Diabetes"
  ];

  // Sample medications
  const medications = [
    { id: 1, name: "Paracetamol 500mg", category: "Pain Relief", price: 5.99, prescription: false, image: "https://placehold.co/100x100/e2e8f0/64748b?text=Med" },
    { id: 2, name: "Amoxicillin 250mg", category: "Antibiotics", price: 12.50, prescription: true, image: "https://placehold.co/100x100/e2e8f0/64748b?text=Med" },
    { id: 3, name: "Cetirizine 10mg", category: "Allergy", price: 8.75, prescription: false, image: "https://placehold.co/100x100/e2e8f0/64748b?text=Med" },
    { id: 4, name: "Vitamin D3 1000IU", category: "Vitamins", price: 15.99, prescription: false, image: "https://placehold.co/100x100/e2e8f0/64748b?text=Med" },
    { id: 5, name: "Cold & Flu Relief", category: "Cold & Flu", price: 7.25, prescription: false, image: "https://placehold.co/100x100/e2e8f0/64748b?text=Med" },
    { id: 6, name: "Hydrocortisone Cream", category: "Skin Care", price: 9.50, prescription: false, image: "https://placehold.co/100x100/e2e8f0/64748b?text=Med" },
    { id: 7, name: "Antiseptic Wipes", category: "First Aid", price: 4.25, prescription: false, image: "https://placehold.co/100x100/e2e8f0/64748b?text=Med" },
    { id: 8, name: "Glucose Test Strips", category: "Diabetes", price: 18.99, prescription: false, image: "https://placehold.co/100x100/e2e8f0/64748b?text=Med" },
  ];

  // Sample pharmacies
  const pharmacies = [
    { 
      id: 1, 
      name: "HealthPlus Pharmacy", 
      address: "123 Medical Blvd, City Center", 
      distance: "0.8 miles", 
      hours: "8:00 AM - 10:00 PM",
      rating: 4.8,
      image: "https://placehold.co/300x200/e2e8f0/64748b?text=Pharmacy",
      phone: "+1-234-567-8901" 
    },
    { 
      id: 2, 
      name: "MediCare Pharmacy", 
      address: "456 Health St, Westside", 
      distance: "1.2 miles", 
      hours: "24 hours",
      rating: 4.6,
      image: "https://placehold.co/300x200/e2e8f0/64748b?text=Pharmacy",
      phone: "+1-234-567-8902" 
    },
    { 
      id: 3, 
      name: "QuickRx Pharmacy", 
      address: "789 Wellness Ave, Eastside", 
      distance: "1.5 miles", 
      hours: "7:00 AM - 11:00 PM",
      rating: 4.7,
      image: "https://placehold.co/300x200/e2e8f0/64748b?text=Pharmacy",
      phone: "+1-234-567-8903" 
    },
  ];

  // Filter medications based on search
  const filteredMedications = medications.filter(med => {
    return (
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      med.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSearch = () => {
    setSearchedMeds(true);
  };

  const addToCart = (medication: {id: number, name: string, price: number}) => {
    const existingItem = cart.find(item => item.id === medication.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === medication.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...medication, quantity: 1 }]);
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
    alert(t('pharmacy.orderPlaced'));
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('pharmacy.title')}
        </h1>

        <Tabs defaultValue="medications" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="medications">{t('pharmacy.medications')}</TabsTrigger>
            <TabsTrigger value="pharmacies">{t('pharmacy.pharmacies')}</TabsTrigger>
          </TabsList>

          <TabsContent value="medications">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left sidebar - search and filters */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('pharmacy.findMedication')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search input */}
                    <div className="relative">
                      <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={18} />
                      <Input
                        type="text"
                        placeholder={t('pharmacy.searchMedications')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>

                    <Button 
                      className="w-full bg-medical-blue hover:bg-medical-blue/90"
                      onClick={handleSearch}
                    >
                      {t('pharmacy.search')}
                    </Button>

                    {/* Categories */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">{t('pharmacy.categories')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setSearchTerm(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Cart */}
                    {cart.length > 0 && (
                      <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          {t('pharmacy.cart')}
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.name}</p>
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
                                <span className="text-sm mx-1">{item.quantity}</span>
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
                        <div className="mt-4 pt-3 border-t">
                          <div className="flex justify-between mb-4">
                            <span className="font-medium">{t('pharmacy.total')}</span>
                            <span className="font-bold">${getTotalPrice()}</span>
                          </div>
                          <Button 
                            className="w-full bg-medical-blue hover:bg-medical-blue/90"
                            onClick={handleCheckout}
                          >
                            {t('pharmacy.checkout')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Main content - medication list */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('pharmacy.availableMedications')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!searchedMeds && searchTerm === "" ? (
                      <div className="text-center py-10">
                        <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">{t('pharmacy.startSearching')}</p>
                      </div>
                    ) : filteredMedications.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">{t('pharmacy.noMedicationsFound')}</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredMedications.map((medication) => (
                          <div key={medication.id} className="border rounded-lg overflow-hidden">
                            <div className="flex p-4">
                              <div className="flex-shrink-0 mr-4">
                                <img 
                                  src={medication.image} 
                                  alt={medication.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{medication.name}</h3>
                                <p className="text-sm text-gray-500">{medication.category}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="font-bold text-medical-blue">${medication.price}</span>
                                  {medication.prescription ? (
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                      {t('pharmacy.prescriptionRequired')}
                                    </Badge>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      className="bg-medical-blue hover:bg-medical-blue/90"
                                      onClick={() => addToCart(medication)}
                                    >
                                      <ShoppingCart className="h-4 w-4 mr-1" />
                                      {t('pharmacy.addToCart')}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pharmacies">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pharmacies.map((pharmacy) => (
                <Card key={pharmacy.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={pharmacy.image} 
                      alt={pharmacy.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{pharmacy.name}</h3>
                    <div className="flex items-center text-gray-500 mb-2 text-sm">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>{pharmacy.address} ({pharmacy.distance})</span>
                    </div>
                    <p className="text-sm mb-3">
                      <span className="font-medium">{t('pharmacy.hours')}:</span> {pharmacy.hours}
                    </p>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(pharmacy.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{pharmacy.rating}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        className="flex-1 bg-medical-blue hover:bg-medical-blue/90 flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {t('pharmacy.orderDelivery')}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <PhoneCall className="h-4 w-4" />
                        {t('pharmacy.call')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Pharmacy;
