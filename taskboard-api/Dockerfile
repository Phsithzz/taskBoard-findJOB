# Stage 1: Build the Go binary
FROM golang:alpine AS builder

WORKDIR /app

# Install ca-certificates and git
RUN apk add --no-cache ca-certificates git

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and build statically linked binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server .

# Stage 2: Minimal runtime image
FROM alpine:3.21

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata && \
    adduser -D -g '' appuser

COPY --from=builder /app/server /app/server

USER appuser

ENV GIN_MODE=release \
    PORT=8080

EXPOSE 8080

CMD ["/app/server"]
