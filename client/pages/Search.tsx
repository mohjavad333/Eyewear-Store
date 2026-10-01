import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, Filter, X, Grid, List } from "lucide-react";
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

// Complete product database
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
    originalPrice: 349,
    discount: 14,
  },
  {
    id: "10",
    name: "Budget Blue Light",
    price: 89,
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Computer Glasses",
    rating: 4.2,
    reviews: 34,
    brand: "Store Brand",
    material: "Plastic",
    color: "Black",
    gender: "Unisex",
    lensType: "Blue Light Filter",
    frameSize: "Medium",
    isNew: true,
  },
  {
    id: "11",
    name: "Trendy Cat Eye",
    price: 169,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.5,
    reviews: 78,
    brand: "Zara Home",
    material: "Acetate",
    color: "Pink",
    gender: "Women",
    lensType: "UV Protection",
    frameSize: "Small",
    isNew: false,
  },
  {
    id: "12",
    name: "Classic Rectangle",
    price: 159,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.6,
    reviews: 92,
    brand: "Calvin Klein",
    material: "Metal",
    color: "Silver",
    gender: "Men",
    lensType: "UV Protection",
    frameSize: "Large",
    isNew: false,
  },
];

type SortOption = "relevance" | "newest" | "price-low" | "price-high" | "rating";

export default function Search() {
  const { products: allProducts } = useProducts(fallbackProducts);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(query);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [priceRange, setPriceRange] = useState([0, 500]);

  // Filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedLensTypes, setSelectedLensTypes] = useState<string[]>([]);

  // Extract unique filter options
  const brands = [...new Set(allProducts.map((p) => p.brand))].sort();
  const categories = [...new Set(allProducts.map((p) => p.category))].sort();
  const materials = [...new Set(allProducts.map((p) => p.material))].sort();
  const genders = [...new Set(allProducts.map((p) => p.gender))].sort();
  const lensTypes = [...new Set(allProducts.map((p) => p.lensType))].sort();

  // Search and filter logic
  const filteredProducts = useMemo(() => {
    let results = allProducts.filter((product) => {
      // Text search
      const searchLower = localQuery.toLowerCase();
      const matchesQuery =
        !localQuery ||
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.lensType.toLowerCase().includes(searchLower);

      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      // Brand filter
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      // Material filter
      const matchesMaterial =
        selectedMaterials.length === 0 || selectedMaterials.includes(product.material);

      // Gender filter
      const matchesGender =
        selectedGenders.length === 0 || selectedGenders.includes(product.gender);

      // Lens type filter
      const matchesLensType =
        selectedLensTypes.length === 0 || selectedLensTypes.includes(product.lensType);

      return (
        matchesQuery &&
        matchesPrice &&
        matchesCategory &&
        matchesBrand &&
        matchesMaterial &&
        matchesGender &&
        matchesLensType
      );
    });

    // Sorting
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Relevance sorting
        if (localQuery) {
          results.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const searchLower = localQuery.toLowerCase();

            const aIndex = aName.indexOf(searchLower);
            const bIndex = bName.indexOf(searchLower);

            if (aIndex !== bIndex) return aIndex - bIndex;
            return a.rating - b.rating;
          });
        }
    }

    return results;
  }, [
    localQuery,
    priceRange,
    selectedBrands,
    selectedCategories,
    selectedMaterials,
    selectedGenders,
    selectedLensTypes,
    sortBy,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: localQuery });
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const handleGenderToggle = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  const handleLensTypeToggle = (lensType: string) => {
    setSelectedLensTypes((prev) =>
      prev.includes(lensType) ? prev.filter((l) => l !== lensType) : [...prev, lensType]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedGenders([]);
    setSelectedLensTypes([]);
    setPriceRange([0, 500]);
    setLocalQuery("");
    setSearchParams({});
  };

  const activeFilters =
    selectedBrands.length +
    selectedCategories.length +
    selectedMaterials.length +
    selectedGenders.length +
    selectedLensTypes.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Search Hero */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Search Eyewear</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search by name, brand, category..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="hidden lg:block space-y-6">
              {/* Clear Filters */}
              {activeFilters > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                  size="sm"
                >
                  <X size={16} className="mr-2" />
                  Clear Filters ({activeFilters})
                </Button>
              )}

              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold">Brand</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center gap-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => handleBrandToggle(brand)}
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold">Material</h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <div key={material} className="flex items-center gap-2">
                      <Checkbox
                        id={`material-${material}`}
                        checked={selectedMaterials.includes(material)}
                        onCheckedChange={() => handleMaterialToggle(material)}
                      />
                      <Label htmlFor={`material-${material}`} className="text-sm cursor-pointer">
                        {material}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold">Gender</h3>
                <div className="space-y-2">
                  {genders.map((gender) => (
                    <div key={gender} className="flex items-center gap-2">
                      <Checkbox
                        id={`gender-${gender}`}
                        checked={selectedGenders.includes(gender)}
                        onCheckedChange={() => handleGenderToggle(gender)}
                      />
                      <Label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer">
                        {gender}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lens Type Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold">Lens Type</h3>
                <div className="space-y-2">
                  {lensTypes.map((lensType) => (
                    <div key={lensType} className="flex items-center gap-2">
                      <Checkbox
                        id={`lens-${lensType}`}
                        checked={selectedLensTypes.includes(lensType)}
                        onCheckedChange={() => handleLensTypeToggle(lensType)}
                      />
                      <Label htmlFor={`lens-${lensType}`} className="text-sm cursor-pointer">
                        {lensType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" className="w-full">
                  <Filter size={16} className="mr-2" />
                  Filters ({activeFilters})
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  {activeFilters > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearFilters}
                      size="sm"
                    >
                      <X size={16} className="mr-2" />
                      Clear Filters
                    </Button>
                  )}

                  {/* Category */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Category</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center gap-2">
                          <Checkbox
                            id={`m-cat-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                          />
                          <Label htmlFor={`m-cat-${category}`} className="text-sm cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Brand</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand} className="flex items-center gap-2">
                          <Checkbox
                            id={`m-brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandToggle(brand)}
                          />
                          <Label htmlFor={`m-brand-${brand}`} className="text-sm cursor-pointer">
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Material */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Material</h3>
                    <div className="space-y-2">
                      {materials.map((material) => (
                        <div key={material} className="flex items-center gap-2">
                          <Checkbox
                            id={`m-material-${material}`}
                            checked={selectedMaterials.includes(material)}
                            onCheckedChange={() => handleMaterialToggle(material)}
                          />
                          <Label
                            htmlFor={`m-material-${material}`}
                            className="text-sm cursor-pointer"
                          >
                            {material}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Gender</h3>
                    <div className="space-y-2">
                      {genders.map((gender) => (
                        <div key={gender} className="flex items-center gap-2">
                          <Checkbox
                            id={`m-gender-${gender}`}
                            checked={selectedGenders.includes(gender)}
                            onCheckedChange={() => handleGenderToggle(gender)}
                          />
                          <Label htmlFor={`m-gender-${gender}`} className="text-sm cursor-pointer">
                            {gender}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lens Type */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Lens Type</h3>
                    <div className="space-y-2">
                      {lensTypes.map((lensType) => (
                        <div key={lensType} className="flex items-center gap-2">
                          <Checkbox
                            id={`m-lens-${lensType}`}
                            checked={selectedLensTypes.includes(lensType)}
                            onCheckedChange={() => handleLensTypeToggle(lensType)}
                          />
                          <Label htmlFor={`m-lens-${lensType}`} className="text-sm cursor-pointer">
                            {lensType}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">
                  {localQuery ? `Results for "${localQuery}"` : "All Products"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Type Toggle */}
                <div className="flex gap-1 border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewType("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewType === "grid"
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewType("list")}
                    className={`p-2 rounded transition-colors ${
                      viewType === "list"
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <SearchIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  {localQuery
                    ? `We couldn't find anything matching "${localQuery}". Try a different search.`
                    : "Try adjusting your filters to find what you're looking for."}
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewType === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={product.image}
                        category={product.category}
                        rating={product.rating}
                        reviews={product.reviews}
                        isNew={product.isNew}
                        discount={product.discount}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewType === "list" && (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex gap-4 p-4 border border-border rounded-lg hover:border-border/75 transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-primary uppercase mb-1">
                            {product.category}
                          </p>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors mb-2">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full ${
                                    i < Math.floor(product.rating)
                                      ? "bg-primary"
                                      : "bg-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {product.material} • {product.gender} • {product.lensType}
                          </p>
                        </div>
                        <div className="text-right flex flex-col justify-between">
                          <div>
                            <p className="font-semibold">${product.price}</p>
                            {product.originalPrice && (
                              <p className="text-xs text-muted-foreground line-through">
                                ${product.originalPrice}
                              </p>
                            )}
                          </div>
                          <Link to={`/product/${product.id}`}>
                            <Button size="sm">View</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
