# Restaurant Reservation API - Interview Coding Challenge

Hello! This project is a RESTful API for managing restaurant reservations, developed as a coding challenge for an interview.

It allows clients to:
*   Create users (with a name and a unique email address).
*   Create reservations for users (linking users to reservations).
*   Fetch a list of existing reservations within a given date range.

The restaurant is assumed to have 5 tables, each with 4 seats. Reservations are for 1-hour slots, and the restaurant is open daily from 19:00 (7 PM) to 24:00 (12 AM), meaning the last reservation slot starts at 23:00 (11 PM).

## Core Technologies Used

*   **Node.js** with **TypeScript** for the application runtime and language.
*   **Express.js** as the web framework for building the API.
*   **PostgreSQL** as the SQL database to store user and reservation data.
*   **Prisma** as the ORM (Object-Relational Mapper) to interact with the PostgreSQL database.
*   **Zod** for data validation (ensuring input data like emails, dates, etc., are correct).
*   **Docker** and **Docker Compose** for containerizing the application and database, making it easy to set up and run anywhere.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Docker Desktop**: Make sure you have Docker Desktop installed and running on your system. You can download it from the [official Docker website](https://www.docker.com/products/docker-desktop/).
*   **Git**: To clone the repository.
*   A **terminal** or command prompt.

### Setup and Running the Application

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Create the `.env` file:**
    This project uses a single `.env` file in the root directory to manage environment variables. This file provides settings for Docker Compose, for your local Prisma commands, and for running the app locally (if you choose to do so outside Docker).
    **Important:** This `.env` file should NOT be committed to Git if it contains sensitive passwords. Please ensure it's listed in your `.gitignore` file.

    *   Create a new file named `.env` in the root directory of the project.
    *   Copy the following template into it. You should customize the `POSTGRES_PASSWORD`.

        ```env
        # .env (Main configuration file - Add to .gitignore if it contains real secrets)

        # Variables for PostgreSQL service AND for local connection to it
        POSTGRES_USER=postgres
        POSTGRES_PASSWORD=yourDevPassword123 # Important: Change this to your desired password
        POSTGRES_DB=restaurant_db

        # Port for the API service (used by docker-compose and local execution)
        PORT=3000

        # DATABASE_URL for LOCAL Prisma CLI and LOCAL `npm run dev` (connects to localhost)
        # This allows `npx prisma migrate dev` to work from your host machine against the Dockerized DB.
        DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"
        ```
        *How this works:*
        *   `docker-compose.yml` will read `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `PORT` from this file to configure the services.
        *   When you run Prisma commands like `npx prisma migrate dev` from your local machine, Prisma will use the `DATABASE_URL` from this file (which correctly points to `localhost`).
        *   The `api` service *inside Docker* gets its `DATABASE_URL` specially constructed within `docker-compose.yml` to point to the `postgres` service name, using the same user/password/db name from this `.env` file.

3.  **Build and Run with Docker Compose:**
    Open your terminal in the project's root directory and run:
    ```bash
    docker-compose up --build -d
    ```
    *   `--build`: This tells Docker Compose to build the application image.
    *   `-d`: This runs the containers in the background.

    This command will start the PostgreSQL database and the API application containers.

4.  **Apply Database Migrations:**
    Once the containers are running (especially the database), set up the database schema. Open a new terminal window in the project root and run:
    ```bash
    npx prisma migrate dev --name initial-setup
    ```
    *   This command uses Prisma (a dev dependency) and the `DATABASE_URL` from your `.env` file to connect to the PostgreSQL database running in Docker (via `localhost:5432`) and applies the schema.

    The application API should now be running and accessible at `http://localhost:3000` (or the `PORT` you set in your `.env` file).

### Stopping the Application

To stop the application and the database containers:
```bash
docker-compose down
```
To stop and remove the database volume (all data will be lost):
```bash
docker-compose down -v
```

## Testing the API

You can test the API using any API client tool like Postman, Insomnia, or `curl`.
The base URL for the API is `http://localhost:3000/api` (or `http://localhost:${PORT}/api` if you changed the `PORT` in `.env`).

### Available Endpoints:

*   **`GET /`** (Root path)
    *   A simple endpoint to check if the API is responsive.
    *   Example: `GET http://localhost:3000/`
    *   Expected Response: `{"message":"Restaurant Reservation API is running!"}` 

**Users:**

*   **`POST /api/users`** - Create a new user.
    *   Request Body (JSON):
        ```json
        {
          "name": "John Doe",
          "email": "john.doe@example.com"
        }
        ```

**Reservations:**

*   **`POST /api/reservations`** - Create a new reservation.
    *   Request Body (JSON):
        ```json
        {
          "email": "diego.dev@gmail.com",         
          "seats": 2,          
          "date": "2024-12-24T19:00:00.000Z" // ISO 8601 DateTime string (UTC for simplicity)
        }
        ```

*   **`GET /api/reservations`** - Get a list of reservations within a date range.
    *   Query Parameters: `from` (ISO DateTime), `to` (ISO DateTime), `page` (optional, e.g., 1), `limit` (optional, e.g., 10).
    *   Example: `GET http://localhost:3000/api/reservations?from=2024-07-01T00:00:00Z&to=2024-07-31T23:59:59Z`

*   **`DELETE /api/reservations/:id`** - Delete a reservation by its ID.
    *   Example: `DELETE http://localhost:3000/api/reservations/1`


## How It Was Built (Brief Overview)

1.  **Project Setup:** Node.js with TypeScript.
2.  **Database Schema:** Prisma ORM (`prisma/schema.prisma`) for `User` and `Reservation` models, including relations and constraints.
3.  **API Controllers:** `userController.ts` and `reservationController.ts` handle the business logic for user and reservation management, using Zod for input validation.
4.  **API Routes:** Express.js router (`src/routes/`) defines the HTTP endpoints and maps them to controller functions.
5.  **Server Configuration:** The main Express server is set up in `src/main.ts`, including middleware for JSON parsing and route mounting.
6.  **Containerization:** A `Dockerfile` defines the application image. `docker-compose.yml` orchestrates the `api` application service and the `postgres` database service.
7.  **Configuration & Constants:** A single `.env` file at the project root manages environment variables. Business rule constants (like opening hours) are in `src/lib/constants.ts`.

## Further Potential Improvements (Nice-to-haves if time permitted)

*   More detailed and structured error responses.
*   Comprehensive logging.
*   Unit and integration tests.
*   OpenAPI (Swagger) documentation for the API.
*   More advanced validation rules based on business logic.

Thank you for the opportunity to work on this challenge!
