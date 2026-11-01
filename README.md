# TaskBoard - FindJOB

A Full-Stack Task Board / To-Do Management application.

## Project Structure

```text
taskBoard-findJOB/
├── backend/            # Backend API (Golang + Gin)
│   ├── handlers/       # Request handlers / controllers
│   ├── models/         # Data models and structures
│   ├── store/          # Data storage / database layer
│   ├── go.mod          # Go dependencies
│   ├── go.sum
│   └── main.go         # Server entry point
├── frontend/           # Frontend client (Coming soon)
│   └── README.md
├── .gitignore
└── README.md
```

## Backend Getting Started

### Prerequisites
- [Go](https://go.dev/) (version 1.21+ recommended)

### Running the Backend

```bash
cd backend
go run .
```

The API will start listening on `http://localhost:8080`.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check endpoint |
| GET | `/tasks` | Retrieve all tasks |

## Frontend

Coming soon...
