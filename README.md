# GongCha POS System

A Point Of Sale (POS) system developed for GongCha, implemented using the PERN stack (PostgreSQL, Express, React, and Node.js).

![GongCha Logo](GongChaPOS/src/assets/images/GongChaLogo.png)

## Introduction

GongCha, a renowned beverage brand, required a modern and efficient POS system. Our team took this challenge and crafted a solution leveraging the capabilities of the PERN stack.

## Features

- **User-Friendly Interface**: A GUI developed with React ensures smooth interactions.
- **Reliable Data Storage**: Uses PostgreSQL to securely and efficiently handle transaction data.
- **Fast Server Responses**: Using Express for a speedy backend.
- **Scalability**: Designed to cater to outlets of all sizes, from small kiosks to large stores.
- [Add other features as necessary]

## Installation

1. Ensure you have Node.js version 16, npm, and PostgreSQL installed.

2. Clone the repository:
   ```bash
   git clone https://github.com/csce-315-331-2023c/project-3-csce331_900_00g.git

3. Ensure that you create a file called server.ts in the directory GongChaPOS/src/server
    ```javascript
    import pkg from 'pg';
    const { Pool } = pkg;

    const pool = new Pool({
    user: 'your_username',
    password: 'your_password',
    host: 'localhost',
    port: 5432, // default Postgres port
    database: 'your_database_name'
    });
    
    export const db = (text: string, params?: any[]) => pool.query(text, params);

4. Navigate to the project directory and install dependencies:
   ```bash
   cd gongchapos
   npm install

5. Start the development server:
   ```bash
   npm run dev

6. Ensure your PostgreSQL instance is running and properly set up.

7. For production builds, run:
   ```bash
   npm run dev
Run express server:
   ```bash
   ts-node-esm  src/server/api.ts


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
