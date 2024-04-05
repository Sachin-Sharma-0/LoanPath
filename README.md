# LoanPath

LoanPath is a credit approval system built using Node.js and Express. It assesses the creditworthiness of customers based on historical loan data and other financial parameters.

## Features

- **Credit Approval**: Automatically assesses the creditworthiness of customers and approves loans based on predefined criteria.
- **Data Ingestion**: Ingests existing customer and loan data from Excel files into the system.
- **API Endpoints**: Provides RESTful API endpoints for registering customers, checking eligibility, creating loans, making payments, and viewing statements.
- **Database Integration**: Persists data using MySQL/PostgreSQL database with Sequelize ORM.
- **Dockerized**: Entire application and dependencies are containerized using Docker for easy deployment.
- **Error Handling**: Implements appropriate error handling with descriptive error messages and status codes.
- **Input Validation**: Validates request payloads and query parameters to ensure data integrity.
- **Unit Tests**: Includes unit tests for critical components to ensure code reliability.
- **Configuration**: Configures environment variables for easy setup and deployment.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Docker installed (optional, for running in containers).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sachin-Sharma-0/LoanPath.git

2. Install dependencies:

   ```bash
   cd LoanPath
   npm install

3. Set up environment variables:
   Create a .env file in the root directory and add necessary environment variables.

4. Start the application:

   ```bash
   npm start

## Usage

- Register new customers using the `/register` endpoint.
- Check loan eligibility with the `/check-eligibility` endpoint.
- Create new loans with the `/create-loan` endpoint.
- Make payments towards EMIs using the `/make-payment` endpoint.
- View loan statements with the `/view-statement` endpoint.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.
