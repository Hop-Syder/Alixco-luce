# Alixco - Luce Application

Alixco-luce is a specialized application for managing lighting and greenhouse operations, built with the latest web technologies.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: >= 16.0.0
*   **npm** (usually comes with Node.js) or **yarn**
*   **MongoDB** (for development and production, unless using Atlas)

### 1. Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd Alixco-luce
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### 2. Configuration

1.  Copy the environment variables file:
    ```bash
    cp .env.example .env
    ```

2.  Edit the `.env` file with your specific configuration (database URLs, API keys, ports, etc.).

### 3. Running the App

*   **Development Mode**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will start the server, usually on `http://localhost:3000`.

*   **Production Build**:
    ```bash
    npm run build
    # or
    yarn build
    ```

*   **Production Run**:
    ```bash
    npm start
    # or
    yarn start
    ```

### 4. Database

*   **Migrations**:
    ```bash
    npm run migrate:up
    # or
    yarn migrate:up
    ```

## 🛠️ Technology Stack

*   **Framework**: NestJS
*   **Database**: MongoDB (via Mongoose)
*   **Language**: TypeScript
*   **Authentication**: JWT (JSON Web Tokens)
*   **Validation**: class-validator, class-transformer
*   **Monitoring**: Winston
*   **Testing**: Jest, Supertest

## 📂 Project Structure

```
Alixco-luce/
├── src/
│   ├── api/              # API Routes & Controllers
│   ├── modules/          # Feature Modules (core, database, auth, etc.)
│   │   └── greenhouse/   # Greenhouse specific logic (screens, greenhouses, zones, etc.)
│   ├── database/         # Database configuration & migrations
│   ├── shared/           # Shared services, interceptors, guards
│   └── utils/            # Utility functions
├── test/                 # Test suites
├── migrations/           # Database migration scripts
├── .env.example          # Environment variable template
└── package.json          # Project dependencies
```

## 📜 License

This project is proprietary software. All rights reserved. Contact the owners for usage rights.

## 🤝 Contributing

Contributions are welcome! Please follow the standard contribution guidelines:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This is a private project. For commercial licensing and usage rights, please contact the project owners.
