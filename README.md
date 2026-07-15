# Orders Admin Management System - Frontend

## Description

This project is the frontend of the **Orders Admin Management System**, developed using **React Native** and **Expo**.

The application provides dedicated interfaces for both administrators and customers, allowing users to manage products, orders, customers, shopping carts, profiles, languages, currencies, and application settings through a modern and user-friendly mobile interface.

---

## Technologies Used

- React Native
- Expo
- JavaScript
- Axios
- AsyncStorage
- Context API
- React Hooks

---

## Main Features

### Admin

- Secure admin login
- Dashboard with statistics
- Manage products
- Add product images
- Manage customer orders
- Update order status
- Manage customers
- View reports and revenue statistics
- Application settings
- Multi-language support

### Customer

- User registration and login
- Browse products
- Search products
- View product details
- Shopping cart
- Checkout and place orders
- View order history
- Edit or cancel orders (when allowed)
- Profile management
- Change language
- Change currency
- Light / Dark Mode
- Logout

---

## Supported Languages

- English
- Arabic
- Hebrew

---

## Supported Currencies

- Israeli Shekel (₪)
- US Dollar ($)
- Euro (€)

---

## Installation

Install the required packages:

```bash
npm install
```

---

## API Configuration

Open the following file:

```text
src/constants/appConstants.js
```

Update the backend API URL:

```javascript
export const API_BASE_URL = "http://YOUR_IP_ADDRESS:5000/api";
```

Example:

```javascript
export const API_BASE_URL = "http://192.168.1.101:5000/api";
```

---

## Running the Application

Start the Expo development server:

```bash
npx expo start -c
```

Scan the QR code using the **Expo Go** application.

---

## Project Structure

```
src/
components/
screens/
navigation/
context/
services/
assets/
constants/
```

---

## Skills Demonstrated

- React Native Development
- Mobile UI Design
- REST API Integration
- Context API
- State Management
- CRUD Operations
- Authentication
- AsyncStorage
- Multi-language Support
- Dark Mode Implementation

---

## Notes

- The backend server must be running before starting the application.
- The mobile device and computer must be connected to the same Wi-Fi network.
- Update the API IP address if the network changes.
- Do not upload the `node_modules` folder to GitHub.

---

## Author

**Gharam Aluka**

Software Engineering Student  
Full Stack Developer
