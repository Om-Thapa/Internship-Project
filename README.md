# Project Structure

## Frontend Structure

```text
/
└── src/
    ├── components/
    │   ├── ui/                       # Preserved shadcn/ui components
    │   ├── ProtectedRoute.jsx        # Authentication route guard
    │   └── ScrollToTop.jsx           # Resets scroll position on route changes
    │
    ├── pages/
    │   ├── Login.jsx                 # User login page
    │   ├── Register.jsx              # User registration page
    │   ├── VerifyEmail.jsx           # Email verification flow
    │   ├── Checkout.jsx              # Checkout and order placement
    │   ├── OrderSuccess.jsx          # Order confirmation page
    │   ├── MyOrders.jsx              # Customer order history
    │   └── OrderDetails.jsx          # Detailed order tracking and timeline
    │
    ├── store/
    │   └── authStore.js              # Authentication state management
    │
    ├── utils/
    │   └── analytics.js              # Google Analytics & Microsoft Clarity integration
    │
    ├── App.jsx                       # Application routing configuration
    └── main.jsx                      # React application entry point
```

---

## Backend Structure

```text
/
├── src/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection configuration
│   │   └── razorpay.js               # Razorpay payment gateway setup
│   │
│   ├── controllers/
│   │   ├── auth.controller.js        # Authentication business logic
│   │   ├── product.controller.js     # Product management logic
│   │   ├── order.controller.js       # Order processing logic
│   │   └── payment.controller.js     # Payment handling logic
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT authentication middleware
│   │   └── error.middleware.js       # Global error handler
│   │
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   ├── Product.js                # Product schema
│   │   ├── Order.js                  # Order schema
│   │   └── Payment.js                # Payment schema
│   │
│   ├── routes/
│   │   ├── auth.routes.js            # Authentication routes
│   │   ├── product.routes.js         # Product routes
│   │   ├── order.routes.js           # Order routes
│   │   └── payment.routes.js         # Payment routes
│   │
│   ├── services/
│   │   └── email.service.js          # Email service provider
│   │
│   ├── utils/
│   │   └── catchAsync.js             # Async error wrapper utility
│   │
│   └── server.js                     # Express server entry point
│
├── .env.example                      # Environment variable template
└── package.json                      # Project dependencies and scripts
```

---

## Architecture Overview

### Frontend
- React + Vite
- React Router DOM
- Zustand State Management
- shadcn/ui Components
- Tailwind CSS
- Protected Authentication Routes
- Google Analytics 4 Integration
- Microsoft Clarity Integration

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Razorpay Payment Gateway
- Email Verification System
- Order Management System
- Centralized Error Handling

### Key Features
- User Authentication
- Email Verification
- Product Catalog
- Secure Checkout
- Razorpay Payments
- Order Tracking
- Order History
- Protected Routes
- Analytics Tracking
- Responsive Design