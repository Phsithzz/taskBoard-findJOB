# TaskBoard - FindJOB

A Full-Stack Task Board / To-Do Management application.

## Project Structure

```text
taskBoard-findJOB/
├── taskboard-api/       # Backend API (Golang + Gin)
│   ├── handlers/        # Request handlers / controllers
│   ├── models/          # Data models and structures
│   ├── store/           # Data storage / database layer
│   ├── go.mod           # Go dependencies
│   ├── go.sum
│   └── main.go          # Server entry point
├── taskboard-web/       # Frontend Web client (Coming soon)
│   └── README.md
├── .gitignore
└── README.md
```

## Backend Getting Started

### Prerequisites
- [Go](https://go.dev/) (version 1.21+ recommended)

### Running the API

```bash
cd taskboard-api
go run .
```

The API will start listening on `http://localhost:8080`.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check endpoint |
| GET | `/tasks` | Retrieve all tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

## Frontend (taskboard-web)

Coming soon...
