/ (Root Frontend Structure)
├── src/
│   ├── components/
│   │   ├── ui/                       # Preserved shadcn components
│   │   ├── ProtectedRoute.jsx        # Route Guard Wrapper
│   │   └── ScrollToTop.jsx           # Global route layout reset
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── MyOrders.jsx              # Customer orders directory
│   │   └── OrderDetails.jsx          # Status & timeline tracking
│   ├── store/
│   │   └── authStore.js
│   ├── utils/
│   │   └── analytics.js              # GA4 + Clarity tracking facades
│   ├── App.jsx                       # Routing declarations
│   └── main.jsx                      # Hydrated init containing analytics hooks


/ (Root Backend Structure)
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── razorpay.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   └── payment.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   └── payment.routes.js
│   ├── services/
│   │   └── email.service.js
│   ├── utils/
│   │   └── catchAsync.js
│   └── server.js
├── .env.example
└── package.json