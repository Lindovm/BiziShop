# BiziShop - Point of Sale System

A modern point of sale system built with React, TypeScript, and Firebase.

## Features

- User authentication with role-based access control
- Dashboard for business analytics
- Order management
- Menu management
- Inventory tracking
- Messaging system
- Settings and configuration

## Technology Stack

- React with TypeScript
- Firebase (Authentication, Firestore)
- Vite for fast development
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/BiziShop.git
   cd BiziShop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Set the project ID to 'bizibase' or update the .env file with your project ID
   - Enable Authentication (Email/Password) and Firestore Database
   - Copy your Firebase configuration from Project Settings
   - Create a `.env` file in the root directory (use `.env.example` as a template)
   - Add your Firebase configuration to the `.env` file

4. Initialize Firebase Collections:
   - Run the collection check script to ensure all required collections exist:
   ```bash
   npm run check-collections
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## User Onboarding Flow

The application includes a complete user onboarding flow:

1. **Basic Information**: Users enter their name, email, and password
2. **Role Selection**: Users select their role (owner, manager, or cashier)
3. **Profile Details**: Users add profile information including profile picture, phone, and address
4. **Shop Setup**:
   - Owners create a new shop/restaurant
   - Managers and cashiers select an existing shop to join

## Firebase Collections

The application uses the following Firebase collections:

- `users`: User profiles and authentication information
- `restaurants`: Restaurant/shop information
- `shopMembers`: Associations between users and shops
- `products`: Menu items and products
- `categories`: Product categories
- `inventory`: Inventory items and stock levels
- `orders`: Customer orders
- `notifications`: User notifications
- `settings`: Application settings

## Role-Based Access

The application implements role-based access control:

- **Owners**: Full access to all features including analytics
- **Managers**: Access to dashboard, orders, menu, inventory, and settings
- **Cashiers**: Limited access to orders, menu, and basic settings

## License

This project is licensed under the MIT License - see the LICENSE file for details.
