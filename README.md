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
   - Enable Authentication (Email/Password) and Firestore Database
   - Copy your Firebase configuration from Project Settings
   - Create a `.env` file in the root directory (use `.env.example` as a template)
   - Add your Firebase configuration to the `.env` file

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## User Roles

The application supports three user roles:

- **Cashier**: Can process orders and manage the menu
- **Manager**: Has cashier permissions plus inventory management
- **Owner**: Has full access to all features including analytics

## License

This project is licensed under the MIT License - see the LICENSE file for details.
