# QuickBite

A full-stack food delivery application with a **Spring Boot REST API**, a **customer-facing web app**, and a separate **admin panel** for managing food items and orders. Payments are processed through **Razorpay** and food images are stored on **AWS S3**.

## Repository layout

```
QuickBite Project/
├── quickbite/                      # Backend — Spring Boot REST API (port 8088)
├── quickbite-frontend/
│   ├── quickbite-client/           # Customer web app — React + Vite
│   └── admin panel/                # Admin web app — React + Vite
└── .gitignore
```

## Tech stack

| Layer      | Technology |
|------------|-----------|
| Backend    | Java 21, Spring Boot 4.1.1, Spring Security, JWT (JJWT 0.11.5), MongoDB, AWS SDK S3 2.30.31, Razorpay Java SDK 1.4.5, Lombok |
| Databases  | MongoDB (database `quickbite`, local `mongodb://127.0.0.1:27017`) |
| Frontend   | React 19, Vite 7, React Router 7, axios, Bootstrap 5, React Toastify |
| Payments   | Razorpay Checkout (client side) + order creation/verification (server side) |
| Storage    | AWS S3 bucket `tanu-quickbite` (region `ap-south-1`) |

## Features

### Backend (`quickbite/`)
- **Authentication & users** — register, login, JWT-based auth with a Spring Security filter chain (`JwtAuthenticationFilter`, `SecurityConfig`, `JwtUtil`).
- **Foods** — create, list, get one, delete food items; images uploaded to AWS S3.
- **Cart** — add, list, update quantity, remove items per authenticated user.
- **Orders** — create a Razorpay order (`/create`), verify payment signature (`/verify`), list user orders, list all orders, update order status, delete orders.
- **Config** — MongoDB, AWS S3, Razorpay keys and JWT secret are read from environment variables / properties.

### Customer app (`quickbite-frontend/quickbite-client`)
- Browse and explore the menu with category filtering, food detail pages, cart management (Context-based `StoreContext`), **Razorpay checkout** during order placement, order history (`MyOrders`), and contact page. Login/Register are handled through the auth service.

### Admin panel (`quickbite-frontend/admin panel`)
- Sidebar + top menu navigation, **Add Food** (with image upload), **List Food**, and **Orders** management (view/update status) pages.

## Backend API

Base URL: `http://localhost:8088/api`

| Method | Endpoint                 | Description |
|--------|--------------------------|-------------|
| POST   | `/api/register`          | Register a new user |
| POST   | `/api/login`             | Login, returns JWT |
| POST   | `/api/foods`             | Create a food item |
| GET    | `/api/foods`             | List all food items |
| GET    | `/api/foods/{id}`        | Get one food item |
| DELETE | `/api/foods/{id}`        | Delete a food item |
| POST   | `/api/cart`              | Add item to cart |
| GET    | `/api/cart`              | Get current user's cart |
| DELETE | `/api/cart`              | Clear cart |
| POST   | `/api/cart/remove`       | Remove an item from the cart |
| POST   | `/api/orders/create`     | Create a Razorpay order |
| POST   | `/api/orders/verify`     | Verify payment and mark order paid |
| GET    | `/api/orders`            | Current user's orders |
| GET    | `/api/orders/all`        | All orders (admin) |
| PATCH  | `/api/orders/status/{orderId}` | Update order status |
| DELETE | `/api/orders/{orderId}`  | Delete an order |

## Setup & running locally

### Prerequisites
- JDK 21, Maven (wrapper `mvnw` is included)
- MongoDB running locally on `127.0.0.1:27017`
- Node.js 18+ and npm

### 1. Backend

Set the required environment variables (never commit real values):

```
AWS_ACCESS_KEY=<your aws access key>
AWS_SECRET_KEY=<your aws secret key>
RAZORPAY_KEY=<razorpay key id>
RAZORPAY_SECRET=<razorpay key secret>
```

Then run from the `quickbite/` folder:

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8088`.

### 2. Customer app

From `quickbite-frontend/quickbite-client`:

```bash
npm install
```

Create a `.env` file next to the existing `.env.example` (which is committed) and set your public Razorpay Key ID:

```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
```

Then start the dev server:

```bash
npm run dev
```

### 3. Admin panel

From `quickbite-frontend/admin panel`:

```bash
npm install
npm run dev
```

Both frontends call the backend directly at `http://localhost:8088/api`.

## Security notes

- Secrets (AWS, Razorpay, JWT) must come from environment variables or a local `.env` file — these files are `.gitignore`d.
- `.env.example` shows the variables a developer needs to set but contains no real values.
- If a key was ever committed, rotate/revoke it and rewrite the git history (the repository history was already scrubbed of a leaked Razorpay key ID).