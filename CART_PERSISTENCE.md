# Cart Persistence System

Complete guide to the cart persistence feature that saves items to the database.

## Overview

Users can now:
- ✅ Add items to cart (persisted to MongoDB)
- ✅ Update quantities
- ✅ Remove items
- ✅ Cart syncs across sessions
- ✅ Cart shows badge count in header
- ✅ Requires authentication to save

---

## How It Works

### Architecture

```
Frontend (React)          Backend (Node.js)        Database (MongoDB)
───────────────          ─────────────────        ─────────────────
CartContext          →    /api/cart routes    →   Cart collection
  ├─ items          →    GET, POST, PUT, DELETE   ├─ userId
  ├─ itemCount      →    ├─ Get cart             ├─ items[]
  └─ functions      →    ├─ Add item              ├─ shippingMethod
     ├─ addItem          ├─ Update quantity       └─ coupon
     ├─ removeItem       └─ Remove item
     ├─ updateQuantity
     └─ clearCart
```

### Data Flow: User Adds Item to Cart

```
1. User clicks "Add to Cart" on product
   ↓
2. Frontend calls: useCart().addItem(item)
   ↓
3. POST /api/cart/items { productId, name, price, ... }
   ↓
4. Backend saves to MongoDB Cart collection
   ↓
5. Returns updated items array
   ↓
6. Frontend updates CartContext state
   ↓
7. Header badge updates automatically
   ↓
8. User sees item count in header
```

---

## API Endpoints

### GET /api/cart
**Get user's cart**
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3001/api/cart
```

**Response:**
```json
{
  "cart": {
    "items": [
      {
        "productId": "1",
        "name": "Classic Aviator",
        "price": 199,
        "quantity": 2,
        "image": "...",
        "category": "Sunglasses",
        "variant": "Gold / Brown"
      }
    ],
    "shippingMethod": "standard",
    "coupon": null
  }
}
```

### POST /api/cart/items
**Add item to cart**
```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "1",
    "name": "Classic Aviator",
    "price": 199,
    "originalPrice": 249,
    "image": "...",
    "category": "Sunglasses",
    "quantity": 1,
    "variant": "Gold / Brown"
  }' \
  http://localhost:3001/api/cart/items
```

**Response:**
```json
{
  "message": "Item added to cart",
  "cart": {
    "items": [...],
    "itemCount": 3
  }
}
```

### PUT /api/cart/items/:productId
**Update item quantity**
```bash
curl -X PUT \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5, "variant": "Gold"}' \
  http://localhost:3001/api/cart/items/1
```

### DELETE /api/cart/items/:productId
**Remove item from cart**
```bash
curl -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"variant": "Gold"}' \
  http://localhost:3001/api/cart/items/1
```

### DELETE /api/cart
**Clear entire cart**
```bash
curl -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/cart
```

### PUT /api/cart/shipping
**Update shipping & options**
```bash
curl -X PUT \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingMethod": "express",
    "giftWrap": true,
    "coupon": "SAVE10"
  }' \
  http://localhost:3001/api/cart/shipping
```

---

## Frontend Components

### CartContext (`client/context/CartContext.tsx`)

**State:**
```typescript
interface CartContextType {
  items: CartItem[];           // Array of cart items
  itemCount: number;           // Total quantity
  loading: boolean;            // Loading state
  
  // Functions
  addItem: (item) => Promise<void>;
  removeItem: (productId, variant) => Promise<void>;
  updateQuantity: (productId, quantity, variant) => Promise<void>;
  clearCart: () => Promise<void>;
  updateShipping: (method, giftWrap, coupon) => Promise<void>;
  loadCart: () => Promise<void>;
}
```

**Usage:**
```typescript
import { useCart } from "@/context/CartContext";

function MyComponent() {
  const { items, itemCount, addItem, removeItem } = useCart();

  return (
    <div>
      Items in cart: {itemCount}
      {items.map(item => (
        <div key={item.productId}>
          {item.name} × {item.quantity}
          <button onClick={() => removeItem(item.productId)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

### Updated Components

**Header** (`client/components/Header.tsx`)
- Shows item count badge
- Updates automatically when cart changes
- Requires CartProvider wrapper

**Cart Page** (`client/pages/Cart.tsx`)
- Fully integrated with CartContext
- Loads from database on page load
- Updates persist to database
- Shows login prompt if not authenticated

---

## Database Schema

### Cart Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),    // User who owns cart
  items: [
    {
      productId: String,           // Product ID
      name: String,                // Product name
      price: Number,               // Current price
      originalPrice: Number,       // Original price (optional)
      image: String,               // Product image URL
      category: String,            // Product category
      quantity: Number,            // Quantity
      variant: String,             // Variant (optional - "Gold")
      addedAt: Date                // When added
    }
  ],
  shippingMethod: String,          // "standard", "express", "overnight"
  giftWrap: Boolean,               // Gift wrap option
  coupon: String,                  // Applied coupon code
  createdAt: Date,
  updatedAt: Date
}
```

---

## Integration Points

### ProductCard Component
When user clicks "Add to Cart", the component should call:
```typescript
const { addItem } = useCart();

await addItem({
  productId: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  category: product.category,
  quantity: 1
});
```

### Checkout Flow
Cart items are automatically loaded from database when user reaches checkout. When order is placed, cart should be cleared:
```typescript
const { clearCart } = useCart();
await clearCart(); // After successful checkout
```

---

## Features

### Automatic Syncing
- Cart automatically loads when user logs in
- Cart clears when user logs out
- Updates sync to database in real-time

### Cart Badge
- Header shows total item count
- Updates immediately when items added/removed
- Works on both desktop and mobile

### Persistence
- Items saved to MongoDB per user
- Survives browser refresh
- Survives logout/login
- Each user has separate cart

### Validation
- Only authenticated users can save
- Quantity must be positive
- Duplicate items increase quantity (don't duplicate entry)
- Removing all quantities deletes item

---

## Security

✅ **Authenticated Only**
- Only logged-in users can access /api/cart routes
- JWT token required in Authorization header
- Backend validates user ID matches cart

✅ **User Isolation**
- Each user's cart is separate
- Can only access own cart
- userId stored with each cart

✅ **Input Validation**
- Quantity validation (min 1)
- Required fields checked
- Invalid data rejected

---

## Error Handling

### Common Issues

**"Not authenticated"**
- User must login to save cart
- Cart stored locally during guest checkout (can be added later)

**"Item not found"**
- Item was removed from another session
- Refresh cart and try again

**"Invalid quantity"**
- Quantity must be 1 or higher
- 0 quantity removes the item

---

## Testing

### Test Flow

```bash
# 1. Start servers
mongod                          # Terminal 1
npm run seed                    # Create demo users
pnpm run dev &                  # Terminal 2
npm run dev:backend             # Terminal 3

# 2. Test in browser
# http://localhost:8080/login
# Email: demo@example.com
# Password: password123

# 3. Add items to cart
# Visit /shop → Click "Add to Cart" on products
# Check header badge updates

# 4. Visit /cart
# Should show persisted items
# Modify quantities, remove items
# All persist to database

# 5. Logout and login again
# Cart should still be there

# 6. Test API directly
curl http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Database Queries

### View user's cart
```javascript
// In MongoDB shell
use optics_store
db.carts.findOne({ userId: ObjectId("...") })
```

### View all carts
```javascript
db.carts.find()
```

### Delete a user's cart
```javascript
db.carts.deleteOne({ userId: ObjectId("...") })
```

---

## Next Steps

After cart persistence is working:

1. **Order History** - Save carts as orders on checkout
2. **Wishlist Sync** - Similar persistence for wishlist
3. **Cart Recovery** - Recover abandoned carts
4. **Analytics** - Track add-to-cart events
5. **Recommendations** - Based on cart contents

---

## Code Examples

### Add Item from Product Page
```typescript
import { useCart } from "@/context/CartContext";

function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        quantity: 1,
        variant: selectedColor, // if applicable
      });
      // Show success toast
    } catch (error) {
      // Show error toast
    }
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### Clear Cart After Order
```typescript
async function completeOrder() {
  const { clearCart } = useCart();

  try {
    // Process payment
    await processPayment(orderData);

    // Clear cart
    await clearCart();

    // Redirect to success
    navigate("/order-confirmation");
  } catch (error) {
    console.error("Order failed:", error);
  }
}
```

### Custom Hook for Cart Summary
```typescript
function useCartSummary() {
  const { items } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    itemCount: items.length,
    subtotal,
    tax: subtotal * 0.08,
    total: subtotal + subtotal * 0.08,
  };
}
```

---

## Performance

- Cart loads once on authentication
- Updates are optimistic (update UI immediately, sync to DB)
- Failed updates are rolled back
- No unnecessary API calls
- Badge updates are instant

---

## Files Created/Modified

**Created:**
- `server/models/Cart.ts` - Cart MongoDB model
- `server/routes/cart.ts` - Cart API endpoints
- `client/context/CartContext.tsx` - Cart state management
- `CART_PERSISTENCE.md` - This documentation

**Modified:**
- `server/index.ts` - Added cart routes
- `client/App.tsx` - Added CartProvider
- `client/components/Header.tsx` - Show cart badge
- `client/pages/Cart.tsx` - Use CartContext
- `package.json` - Backend scripts

---

**Status:** ✅ Complete and tested  
**Last Updated:** July 30, 2026
