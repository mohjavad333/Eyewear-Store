import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  discount?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating = 4.5,
  reviews = 0,
  isNew = false,
  discount,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isSaved } = useWishlist();
  const isFavorite = isSaved(id);

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({
        productId: id,
        name,
        price,
        originalPrice,
        image,
        category,
        quantity: 1,
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleFavoriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const wishlistItem = {
      productId: id,
      name,
      price,
      originalPrice,
      image,
      category,
      rating,
      reviews,
      discount,
      inStock: true,
      stockCount: 0,
      isNew,
    };

    try {
      if (isFavorite) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(wishlistItem);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <div className="group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative mb-4 overflow-hidden rounded-lg bg-muted aspect-square flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              New
            </span>
          )}
          {discount && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-danger text-danger" : "text-foreground"
            }`}
          />
        </button>

        {/* Add to Cart Button */}
        <Button
          className="absolute bottom-3 left-3 right-3 bg-primary text-primary-foreground hover:bg-primary/90 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      {/* Content */}
      <Link to={`/product/${id}`} className="flex-1 flex flex-col">
        <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
          {category}
        </p>
        <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-xs">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.floor(rating)
                      ? "text-accent"
                      : "text-muted-foreground"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-bold text-foreground">${price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
