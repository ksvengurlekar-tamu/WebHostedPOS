# GongCha POS System

A Point Of Sale (POS) system developed for GongCha, implemented using the PERN stack (PostgreSQL, Express, React, and Node.js).

![GongCha Logo](src/assets/images/GongChaLogo.png)

## Introduction

GongCha, a renowned beverage brand, required a modern and efficient POS system. Our team took this challenge and crafted a solution leveraging the capabilities of the PERN stack.

## Features

- **User-Friendly Interface**: A GUI developed with React ensures smooth interactions.
- **Reliable Data Storage**: Uses PostgreSQL to securely and efficiently handle transaction data.
- **Fast Server Responses**: Using Express for a speedy backend.
- **Scalability**: Designed to cater to outlets of all sizes, from small kiosks to large stores.
- [Add other features as necessary]

## Installation

1. Ensure you have Node.js, npm, and PostgreSQL installed.
2. Clone the repository:
   \```
   git clone https://github.com/csce-315-331-2023c/project-3-csce331_900_00g.git
   \```

3. Navigate to the project directory and install dependencies (Node.js version 16):
   \```
   cd gongchapos
   npm install
   \```

4. Start the development server:
   \```
   npm run dev
   \```

5. Ensure your PostgreSQL instance is running and properly set up.

6. For production builds, run:
   \```
   npm run dev
   \```

7. Ensure that a class is created with the necessary configuration to access your PostgreSQL database.

## Dependencies

Here's a breakdown of the main dependencies used:

### Frontend:

- `react`
- `react-dom`
- `react-router-dom`

### Backend:

- `express`
- `pg`
- `cors`

### Styling:

- `bootstrap`

Remember to always refer to the `package.json` for a full list of dependencies and their versions.
