import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  Grid,
  List,
  Filter,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";

// Mock product data - Extended collection
const fallbackProducts = [
  {
    id: "1",
    name: "Classic Aviator",
    price: 199,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.8,
    reviews: 124,
    brand: "Ray-Ban",
    material: "Metal",
    color: "Gold",
    gender: "Unisex",
    lensType: "UV Protection",
    frameSize: "Large",
    isNew: false,
    originalPrice: 249,
    discount: 20,
  },
  {
    id: "2",
    name: "Modern Round Frame",
    price: 179,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.6,
    reviews: 89,
    brand: "Warby Parker",
    material: "Acetate",
    color: "Black",
    gender: "Unisex",
    lensType: "Blue Light Filter",
    frameSize: "Medium",
    isNew: true,
  },
  {
    id: "3",
    name: "Minimal Cat Eye",
    price: 149,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.7,
    reviews: 156,
    brand: "Gucci",
    material: "Acetate",
    color: "Tortoise",
    gender: "Women",
    lensType: "Polarized",
    frameSize: "Small",
    isNew: false,
  },
  {
    id: "4",
    name: "Premium Blue Light",
    price: 159,
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Computer Glasses",
    rating: 4.5,
    reviews: 67,
    brand: "Warby Parker",
    material: "Metal",
    color: "Silver",
    gender: "Unisex",
    lensType: "Blue Light Filter",
    frameSize: "Large",
    isNew: true,
  },
  {
    id: "5",
    name: "Sports Performance",
    price: 249,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sports",
    rating: 4.9,
    reviews: 201,
    brand: "Oakley",
    material: "Plastic",
    color: "Black",
    gender: "Unisex",
    lensType: "Polarized",
    frameSize: "Large",
    isNew: false,
    originalPrice: 299,
    discount: 17,
  },
  {
    id: "6",
    name: "Elegant Rectangle",
    price: 189,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.4,
    reviews: 45,
    brand: "Prada",
    material: "Metal",
    color: "Rose Gold",
    gender: "Women",
    lensType: "UV Protection",
    frameSize: "Small",
    isNew: false,
  },
  {
    id: "7",
    name: "Vintage Wayfarer",
    price: 179,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.6,
    reviews: 98,
    brand: "Ray-Ban",
    material: "Acetate",
    color: "Brown",
    gender: "Men",
    lensType: "Polarized",
    frameSize: "Large",
    isNew: false,
  },
  {
    id: "8",
    name: "Minimalist Clear",
    price: 139,
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.3,
    reviews: 76,
    brand: "Warby Parker",
    material: "Acetate",
    color: "Clear",
    gender: "Unisex",
    lensType: "Standard",
    frameSize: "Medium",
    isNew: true,
  },
  {
    id: "9",
    name: "Luxury Oversized",
    price: 299,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.8,
    reviews: 142,
    brand: "Chanel",
    material: "Acetate",
    color: "Black",
    gender: "Women",
    lensType: "Polarized",
    frameSize: "Extra Large",
    isNew: false,
  },
  {
    id: "10",
    name: "Classic Round",
    price: 169,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.5,
    reviews: 88,
    brand: "Oakley",
    material: "Metal",
    color: "Gold",
    gender: "Unisex",
    lensType: "Blue Light Filter",
    frameSize: "Medium",
    isNew: false,
  },
  {
    id: "11",
    name: "Urban Streetwear",
    price: 159,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.7,
    reviews: 112,
    brand: "Warby Parker",
    material: "Acetate",
    color: "Tortoise",
    gender: "Men",
    lensType: "UV Protection",
    frameSize: "Medium",
    isNew: true,
  },
  {
    id: "12",
    name: "Premium Titanium",
    price: 279,
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.9,
    reviews: 167,
    brand: "Gucci",
    material: "Titanium",
    color: "Silver",
    gender: "Unisex",
    lensType: "Standard",
    frameSize: "Medium",
    isNew: false,
  },
];

interface ShopProps {
  initialCategory?: string;
}

export default function Shop({ initialCategory }: ShopProps) {
  const navigate = useNavigate();
  const { products: allProducts } = useProducts(fallbackProducts);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = initialCategory || searchParams.get("category")?.toLowerCase() || "";
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedLensTypes, setSelectedLensTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  useEffect(() => {
    const brand = searchParams.get("brand")?.toLowerCase();
    const material = searchParams.get("material")?.toLowerCase();
    const lens = searchParams.get("lens")?.toLowerCase().replace(/-/g, " ");
    const style = searchParams.get("style");

    setSelectedBrands(brand ? [allProducts.find((product) => product.brand?.toLowerCase() === brand)?.brand || brand] : []);
    setSelectedMaterials(material ? [allProducts.find((product) => product.material?.toLowerCase() === material)?.material || material] : []);
    setSelectedLensTypes(lens ? [allProducts.find((product) => product.lensType?.toLowerCase().includes(lens))?.lensType || lens] : []);
    setSearchQuery(style || searchParams.get("q") || "");
  }, [allProducts, searchParams]);

  // Filter options
  const brands = Array.from(new Set(allProducts.map((product) => product.brand).filter((value): value is string => Boolean(value))));
  const materials = Array.from(new Set(allProducts.map((product) => product.material).filter((value): value is string => Boolean(value))));
  const colors = Array.from(new Set(allProducts.map((product) => product.color).filter((value): value is string => Boolean(value))));
  const genders = ["Men", "Women", "Unisex"];
  const lensTypes = Array.from(new Set(allProducts.map((product) => product.lensType).filter((value): value is string => Boolean(value))));
  const frameSizes = ["Small", "Medium", "Large", "Extra Large"];

  // Filter and sort products
  let filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand || "").toLowerCase().includes(searchQuery.toLowerCase());

    const category = (product.category || "").toLowerCase();
    const lensType = (product.lensType || "").toLowerCase();
    const matchesCategory =
      !categoryFilter ||
      (categoryFilter === "blue-light"
        ? category.includes("computer") || lensType.includes("blue light")
        : category.includes(categoryFilter));
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || "");
    const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(product.material || "");
    const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
    const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(product.gender);
    const matchesLensType = selectedLensTypes.length === 0 || selectedLensTypes.includes(product.lensType);
    const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(product.frameSize);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesMaterial &&
      matchesColor &&
      matchesGender &&
      matchesLensType &&
      matchesSize &&
      matchesPrice
    );
  });

  // Sort products
  if (sortBy === "newest") {
    filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (sortBy === "popular") {
    filteredProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  } else if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleGender = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  const toggleLensType = (type: string) => {
    setSelectedLensTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedMaterials.length > 0 ||
    selectedColors.length > 0 ||
    selectedGenders.length > 0 ||
    selectedLensTypes.length > 0 ||
    selectedSizes.length > 0 ||
    searchQuery ||
    categoryFilter;

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setSelectedGenders([]);
    setSelectedLensTypes([]);
    setSelectedSizes([]);
    setSearchQuery("");
    setPriceRange([0, 500]);
    setSortBy("newest");
    if (initialCategory) navigate("/shop", { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-20"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-20"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            ${priceRange[0]} - ${priceRange[1]}
          </p>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Frame Material */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Frame Material</h3>
        <div className="space-y-2">
          {materials.map((material) => (
            <div key={material} className="flex items-center gap-2">
              <Checkbox
                id={`material-${material}`}
                checked={selectedMaterials.includes(material)}
                onCheckedChange={() => toggleMaterial(material)}
              />
              <Label htmlFor={`material-${material}`} className="text-sm cursor-pointer">
                {material}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Color</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center gap-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <Label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Gender</h3>
        <div className="space-y-2">
          {genders.map((gender) => (
            <div key={gender} className="flex items-center gap-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={selectedGenders.includes(gender)}
                onCheckedChange={() => toggleGender(gender)}
              />
              <Label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer">
                {gender}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Lens Type */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Lens Type</h3>
        <div className="space-y-2">
          {lensTypes.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`lens-${type}`}
                checked={selectedLensTypes.includes(type)}
                onCheckedChange={() => toggleLensType(type)}
              />
              <Label htmlFor={`lens-${type}`} className="text-sm cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Frame Size */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Frame Size</h3>
        <div className="space-y-2">
          {frameSizes.map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={() => toggleSize(size)}
              />
              <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-primary/5 border-b border-border">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {categoryFilter ? `${categoryFilter === "blue-light" ? "Blue Light Glasses" : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Collection` : "Shop Our Collection"}
            </h1>
            <p className="text-muted-foreground">
              Discover premium eyewear from the world's finest designers
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar - Desktop */}
            <div className="hidden md:block">
              <div className="sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto">
                <FilterPanel />
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} results
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="flex gap-1 border border-border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="w-10 h-10"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="w-10 h-10"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="md:hidden">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterPanel />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Products Grid/List */}
              {filteredProducts.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                      : "space-y-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    <div key={product.id}>
                      {viewMode === "grid" ? (
                        <ProductCard {...product} />
                      ) : (
                        <Link to={`/product/${product.id}`}>
                          <div className="flex gap-4 p-4 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1 font-medium uppercase">
                                {product.category}
                              </p>
                              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary">
                                {product.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mb-3">
                                {product.brand} • {product.material}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                  <span className="font-bold text-foreground">
                                    ${product.price}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="text-muted-foreground line-through text-sm">
                                      ${product.originalPrice}
                                    </span>
                                  )}
                                </div>
                                {product.reviews && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <span className="text-accent">★</span>
                                    <span className="text-muted-foreground">
                                      ({product.reviews})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">
                    No products found matching your filters.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
