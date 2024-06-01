# HR Management System

## Overview

This project is an HR Management System built using the following technologies:
- **Next.js** for the frontend framework
- **Tailwind CSS** for styling
- **Node.js** for the backend server
- **React ApexCharts** for data visualization
- **MongoDB** for the database
- **Material UI** for additional UI components

## Features

- **Employee Management**: Add, edit, and delete employee records.
- **Attendance Tracking**: Monitor employee attendance.
- **Leave Management**: Apply for and manage employee leave requests.
- **Payroll Management**: Calculate and manage employee salaries.
- **Performance Tracking**: Track and analyze employee performance using interactive charts.

## Installation

To get started with the project, follow these steps:

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running.

### Clone the Repository

```bash
git clone https://github.com/yourusername/hr-management-system.git
cd hr-management-system
```

### Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root of the `backend` directory and add your MongoDB connection string and any other necessary environment variables.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the Application

```bash
# Run the backend server
cd backend
npm start

# Run the frontend development server
cd ../frontend
npm run dev
```

The backend server will run on `http://localhost:5000` and the frontend on `http://localhost:3000`.

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register or log in with your credentials.
3. Start managing your HR tasks with the available features.

## Project Structure

```plaintext
hr-management-system/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── config.js
│   └── .env
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── public/
│   ├── tailwind.config.js
│   └── next.config.js
│
├── README.md
└── package.json
```

## Technologies Used

### Frontend

- **Next.js**: A React framework for server-side rendering and static site generation.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Material UI**: A popular React UI framework with pre-built components.
- **React ApexCharts**: A modern charting library to visualize data.

### Backend

- **Node.js**: A JavaScript runtime for building scalable network applications.
- **Express.js**: A web application framework for Node.js.
- **MongoDB**: A NoSQL database for storing and managing data.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
