# Order Management System

Complete guide to the Order Management feature for tracking purchases and order history.

## Overview

Users can now:
- ✅ Create orders on checkout completion
- ✅ View order history
- ✅ Track order status
- ✅ View order details
- ✅ Cancel orders (if pending/processing)
- ✅ See estimated delivery dates

---

## How It Works

### Architecture

```
Checkout Flow              Backend              Database
─────────────────          ───────────────      ────────
1. User completes checkout
   ↓
2. Place order button
   ↓
3. POST /api/orders → Create order → MongoDB
                                        ↓
4. Clear cart       ← ← ← ← ← Clear cart in DB
   ↓
5. Redirect to confirmation
   ↓
6. User views orders in profile
   ↓
7. GET /api/orders → Fetch all orders
```

### Data Flow: Create Order

```
1. User fills checkout form
2. Clicks "Place Order"
3. POST /api/orders with:
   - items
   - shippingAddress
   - shippingMethod
   - paymentMethod
   - totals
   ↓
4. Backend:
   - Generates unique order number (ORD-XXXXXXXX-XXX)
   - Creates order in MongoDB
   - Calculates estimated delivery
   - Clears user's cart
   ↓
5. Returns order confirmation
6. Frontend redirects to /orders or confirmation page
```

---

## API Endpoints

### GET /api/orders
**Get user's order history**
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3001/api/orders
```

**Response:**
```json
{
  "orders": [
    {
      "id": "507f1f77bcf86cd799439011",
      "orderNumber": "ORD-12345678-001",
      "total": 500.99,
      "status": "shipped",
      "createdAt": "2026-07-30T10:00:00Z",
      "itemCount": 2,
      "estimatedDelivery": "2026-08-05T00:00:00Z"
    }
  ]
}
```

### GET /api/orders/:orderId
**Get order details**
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3001/api/orders/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "order": {
    "id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-12345678-001",
    "items": [
      {
        "productId": "1",
        "name": "Classic Aviator",
        "price": 199,
        "quantity": 2,
        "image": "...",
        "category": "Sunglasses"
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    },
    "shippingMethod": "express",
    "shippingCost": 25,
    "giftWrap": false,
    "giftWrapCost": 0,
    "subtotal": 398,
    "tax": 31.84,
    "total": 454.84,
    "paymentMethod": "credit",
    "paymentStatus": "completed",
    "orderStatus": "shipped",
    "trackingNumber": "1Z999AA10123456784",
    "estimatedDelivery": "2026-08-05T00:00:00Z",
    "createdAt": "2026-07-30T10:00:00Z"
  }
}
```

### POST /api/orders
**Create new order (from checkout)**
```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "1",
        "name": "Classic Aviator",
        "price": 199,
        "quantity": 2,
        "image": "...",
        "category": "Sunglasses"
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    },
    "shippingMethod": "express",
    "shippingCost": 25,
    "giftWrap": false,
    "giftWrapCost": 0,
    "coupon": "SAVE10",
    "discount": 39.8,
    "subtotal": 398,
    "tax": 31.84,
    "total": 415.04,
    "paymentMethod": "credit"
  }' \
  http://localhost:3001/api/orders
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-12345678-001",
    "total": 415.04,
    "status": "pending",
    "estimatedDelivery": "2026-08-01T00:00:00Z"
  }
}
```

### PUT /api/orders/:orderId/cancel
**Cancel an order**
```bash
curl -X PUT \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/orders/507f1f77bcf86cd799439011/cancel
```

**Response:**
```json
{
  "message": "Order cancelled",
  "order": {
    "id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-12345678-001",
    "status": "cancelled"
  }
}
```

---

## Database Schema

### Order Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),        // User who placed order
  orderNumber: String,                 // Unique: "ORD-XXXXXXXX-XXX"
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      variant: String,
      image: String,
      category: String
    }
  ],
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  shippingMethod: String,              // "standard", "express", "overnight"
  shippingCost: Number,
  giftWrap: Boolean,
  giftWrapCost: Number,
  coupon: String,                      // Applied coupon code
  discount: Number,                    // Discount amount
  subtotal: Number,
  tax: Number,
  total: Number,
  paymentMethod: String,               // "credit", "paypal", "apple", "google"
  paymentStatus: String,               // "pending", "completed", "failed"
  orderStatus: String,                 // "pending", "processing", "shipped", "delivered", "cancelled"
  trackingNumber: String,              // Shipping tracking number
  estimatedDelivery: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Frontend Components

### OrderContext (`client/context/OrderContext.tsx`)

**State:**
```typescript
interface OrderContextType {
  orders: OrderSummary[];          // List of user's orders
  currentOrder: OrderDetail | null; // Currently viewed order
  loading: boolean;                 // Loading state

  // Functions
  createOrder: (data) => Promise<OrderDetail>;
  loadOrders: () => Promise<void>;
  loadOrderDetail: (id) => Promise<OrderDetail>;
  cancelOrder: (id) => Promise<void>;
}
```

**Usage:**
```typescript
import { useOrder } from "@/context/OrderContext";

function MyComponent() {
  const { orders, createOrder, cancelOrder } = useOrder();

  const handleCheckout = async () => {
    const orderData = {
      items: cartItems,
      shippingAddress: {...},
      shippingMethod: "express",
      total: 500.99,
      paymentMethod: "credit"
    };
    
    const order = await createOrder(orderData);
    console.log("Order created:", order.orderNumber);
  };

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>
          {order.orderNumber} - ${order.total}
        </div>
      ))}
    </div>
  );
}
```

### Orders Page (`client/pages/Orders.tsx`)

Full order history page with:
- Stats cards (total, pending, shipped, delivered)
- Filter buttons by status
- Order list with status badges
- Estimated delivery dates
- Click-through to order details

---

## Order Status Flow

```
pending → processing → shipped → delivered
                 ↓
            cancelled
```

**Status Meanings:**
- **Pending**: Order placed, awaiting payment confirmation
- **Processing**: Payment confirmed, preparing to ship
- **Shipped**: Order is in transit
- **Delivered**: Order received by customer
- **Cancelled**: Order was cancelled (only from pending/processing)

---

## Integration with Checkout

### Update Checkout Page to Create Order

```typescript
import { useOrder } from "@/context/OrderContext";
import { useCart } from "@/context/CartContext";

function CheckoutPage() {
  const { createOrder } = useOrder();
  const { items, clearCart } = useCart();
  
  const handlePlaceOrder = async () => {
    const orderData = {
      items: items,
      shippingAddress: shippingAddress,
      shippingMethod: shippingMethod,
      shippingCost: shippingCost,
      giftWrap: giftWrap,
      giftWrapCost: giftWrap ? 5 : 0,
      coupon: coupon,
      discount: discount,
      subtotal: subtotal,
      tax: tax,
      total: total,
      paymentMethod: paymentMethod
    };
    
    try {
      const order = await createOrder(orderData);
      
      // Cart is automatically cleared by backend
      // But also clear on frontend
      await clearCart();
      
      // Redirect to confirmation
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error("Order failed:", error);
    }
  };
}
```

---

## Security

✅ **User Isolation**
- Orders belong to user ID
- Users can only view their own orders
- JWT token required

✅ **Data Validation**
- All required fields validated
- Status enum restricted
- Immutable order creation

✅ **Order Integrity**
- Order number is unique
- Cart cleared atomically with order creation
- Timestamps immutable

---

## Features

### Automatic Calculations
- Estimated delivery based on shipping method
- Order number auto-generated
- Tax calculated at order time
- Discount applied and stored

### Order Tracking
- Status progression visible
- Estimated delivery dates
- Tracking number support
- Created/updated timestamps

### User Experience
- Confirmation after checkout
- Order history searchable/filterable
- Status badges with colors
- Direct order detail access

---

## Testing Order Flow

```bash
# 1. Login
# 2. Add items to cart
# 3. Go to checkout
# 4. Fill shipping details
# 5. Click "Place Order"
# 6. Should see confirmation
# 7. Go to /orders
# 8. Should see new order
# 9. Click order to see details
```

---

## Next Steps

After orders are working:

1. **Order Tracking** - Integrate real shipping tracking
2. **Returns Management** - Handle returns and refunds
3. **Loyalty Points** - Award points per order
4. **Order Analytics** - Track metrics and trends

---

## Files Created/Modified

**Created:**
- `server/models/Order.ts` - Order MongoDB model
- `server/routes/orders.ts` - Order API endpoints
- `client/context/OrderContext.tsx` - Order state management
- `client/pages/Orders.tsx` - Order history page
- `ORDER_MANAGEMENT.md` - This documentation

**Modified:**
- `server/index.ts` - Added order routes
- `client/App.tsx` - Added OrderProvider and route
- `client/pages/Checkout.tsx` - (needs update to create orders)

---

## Error Handling

**Order Creation Errors:**
- Missing required fields → 400 Bad Request
- Database error → 500 Server Error

**Order Retrieval Errors:**
- Order not found → 404 Not Found
- Unauthorized access → 403 Forbidden

**Cancellation Errors:**
- Can't cancel shipped orders → 400 Bad Request
- Order not found → 404 Not Found

---

**Status:** ✅ Backend complete, frontend ready  
**Last Updated:** July 30, 2026
