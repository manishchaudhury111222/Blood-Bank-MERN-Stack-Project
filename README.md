
# Blood Bank Application

## Project Overview

The **Blood Bank Application** is a full-stack web application designed to streamline and manage the process of blood donation, inventory, and distribution. It serves as a centralized platform connecting blood bank organizations, donors, and hospitals, providing a secure and efficient way to manage critical blood resources.

-----

## Features

The application provides a comprehensive set of features tailored to different user roles, ensuring secure and role-specific access to data and functionalities.

  * **Secure User Authentication**:
      * **JWT-Based Authentication**: Implements a secure token-based system for user login and registration.
      * **Password Hashing**: Protects user credentials using `bcryptjs` for robust security.
  * **Role-Based Access Control**:
      * **Admin**: Full oversight with the ability to manage all user accounts, including deleting user records.
      * **Organization**: Manages inventory by recording blood donations (`in`) and distributions (`out`) to hospitals.
      * **Hospital**: Requests blood and views their transaction history.
      * **Donor**: Records their donations and views their past donation history.
  * **Inventory Management**:
      * **Blood Stock Tracking**: Organizations can track and update the quantity of blood for each blood group.
      * **Transaction Logging**: All blood transfers between organizations and hospitals are logged and easily accessible.
  * **Analytics Dashboard**:
      * A dedicated analytics page provides real-time data on blood group availability (total `in`, `out`, and available blood).
  * **Dynamic User Interfaces**:
      * Dashboards and navigation menus change dynamically based on the logged-in user's role.

-----

## User Roles and Access

| Role | Key Features | Description |
| :--- | :--- | :--- |
| **Admin** | **Dashboard Overview**<br>**User Management**<br>**Analytics** | Manages all aspects of the application. Can view and delete users (donors, hospitals, organizations) and monitor system-wide analytics. |
| **Organization** | **Inventory Management**<br>**Add/Receive Blood**<br>**Dashboard** | The central hub for blood inventory. Records blood received from donors and blood sent to hospitals, manages stock, and views related reports. |
| **Hospital** | **Request Blood**<br>**Transaction History**<br>**Dashboard** | Requests blood from various organizations, tracks their incoming blood inventory, and views their transaction history. |
| **Donor** | **Donation History**<br>**Dashboard** | Views their personal history of blood donations, including the organization they donated to and the date. |

-----

## Technology Stack

This project is built using a robust and popular technology stack.

  * **Frontend**: `React.js`
      * **State Management**: `Redux Toolkit`
      * **Routing**: `React Router DOM`
      * **UI Components**: `Ant Design`
  * **Backend**: `Node.js` with `Express.js`
      * **Middleware**: `Morgan` and `CORS`
      * **Authentication**: `jsonwebtoken`
  * **Database**: `MongoDB`
      * **ORM**: `Mongoose`

-----

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

  * Node.js (v14 or higher)
  * npm (v6 or higher)
  * A running instance of MongoDB (either locally or a cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/blood-bank-management-system.git
    cd blood-bank-management-system
    ```
2.  **Install backend dependencies:**
    ```bash
    cd server
    npm install
    ```
3.  **Install frontend dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Configuration

1.  Create a `.env` file in the **`server`** directory.
2.  Add your MongoDB connection string and a secret key for JWT.
    ```env
    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET=your_super_secure_secret_key
    ```
3.  Ensure your `MONGO_URL` is correct to connect to your database.

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd server
    npm run dev
    ```
2.  **Start the frontend application:**
    ```bash
    cd ../client
    npm start
    ```

The application will now be running on `http://localhost:3000`.
