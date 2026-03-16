
---

# API Endpoints Documentation

## Overview

This project exposes a RESTful API built with Next.js App Router. The API includes authentication (NextAuth), user management, task management, and file upload functionality.

---

## Authentication

### `GET/POST /api/auth/[...nextauth]`

NextAuth.js authentication handlers for session management.

| Method | Description
|-----|-----
| `GET` | Handles authentication callbacks, CSRF token, session info
| `POST` | Handles sign-in/sign-out operations


---

## User Endpoints

### `GET /api/user`

Retrieves all users or a specific user by email.

| Auth Required | Role Required
|-----|-----
| Yes | Admin


**Query Parameters:**

| Parameter | Type | Required | Description
|-----|-----|------|-----|
| `email` | string | No | Filter by user email


**Responses:**

- `200`: List of users or single user object
- `404`: User not found (when filtering by email)
- `500`: Server error


---

### `POST /api/user`

Authenticates a user (login verification).

| Auth Required | Role Required
|-----|-----
| No | None


**Request Body:**

```json
{
  "username": "string (email)",
  "password": "string"
}
```

**Responses:**

- `200`: User object (id, name, email, isAdmin)
- `401`: Invalid password
- `404`: User not found
- `500`: Server error


---

### `POST /api/user/register`

Registers a new user (public endpoint).

| Auth Required | Role Required
|-----|-----
| No | None


**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "isAdmin": "boolean (optional, default: false)"
}
```

**Responses:**

- `201`: Created user object
- `500`: Server error


---

### `GET /api/user/[id]`

Retrieves a specific user by ID.

| Auth Required | Role Required
|-----|-----
| Yes | Owner or Admin


**Path Parameters:**

| Parameter | Type | Description
|-----|-----|-----
| `id` | string | User ID


**Responses:**

- `200`: User object
- `400`: User ID is required
- `403`: Forbidden (not owner or admin)
- `404`: User not found
- `500`: Server error


---

### `PATCH /api/user/[id]`

Updates a user's information.

| Auth Required | Role Required
|-----|-----
| Yes | Owner only


**Path Parameters:**

| Parameter | Type | Description
|-----|-----|-----
| `id` | string | User ID


**Request Body (partial):**

```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)"
}
```

> Note: `isAdmin` field cannot be changed via this endpoint.



**Responses:**

- `200`: Updated user object
- `400`: User ID is required
- `403`: Forbidden / Cannot change admin status
- `404`: User not found
- `500`: Server error


---

### `DELETE /api/user/[id]`

Deletes a user.

| Auth Required | Role Required
|-----|-----
| Yes | Owner only


**Path Parameters:**

| Parameter | Type | Description
|-----|-----|-----
| `id` | string | User ID


**Responses:**

- `200`: `{ "message": "User deleted successfully" }`
- `400`: User ID is required
- `403`: Forbidden
- `500`: Server error


---

## Task Endpoints

### `GET /api/task`

Retrieves tasks based on user role and query parameters.

| Auth Required | Role Required
|-----|-----
| Yes | Authenticated


**Query Parameters:**

| Parameter | Type | Required | Description
|-----|-----|-----|-----
| `userId` | string | No | Filter tasks by user ID (Admin only for other users)


**Behavior:**

- Admin: Returns all tasks (or filtered by userId if provided)
- Regular user: Returns only their own tasks


**Responses:**

- `200`: Array of task objects
- `403`: Forbidden (non-admin querying other user's tasks)
- `500`: Server error


---

### `POST /api/task`

Creates a new task.

| Auth Required | Role Required
|-----|-----
| No (implied) | None


**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "priority": "LOW | MEDIUM | HIGH",
  "status": "PENDING | IN_PROGRESS | DONE",
  "deadline": "string (ISO date)",
  "fileUrl": "string (optional)",
  "userId": "string",
  "user": "UserModel object"
}
```

**Responses:**

- `201`: Created task object
- `500`: Server error


---

### `GET /api/task/[id]`

Retrieves a specific task by ID.

| Auth Required | Role Required
|-----|-----
| Yes | Owner or Admin


**Path Parameters:**

| Parameter | Type | Description
|-----|-----|-----
| `id` | string | Task ID


**Responses:**

- `200`: Task object
- `400`: Task ID is required
- `403`: Forbidden
- `404`: Task not found
- `500`: Server error


---

### `PATCH /api/task/[id]`

Updates a specific task.

| Auth Required | Role Required
|-----|-----
| Yes | Owner or Admin


**Path Parameters:**

| Parameter | Type | Description
|-----|-----|-----
| `id` | string | Task ID


**Request Body (partial):**

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "priority": "LOW | MEDIUM | HIGH (optional)",
  "status": "PENDING | IN_PROGRESS | DONE (optional)",
  "deadline": "string (optional)",
  "fileUrl": "string (optional)"
}
```

**Responses:**

- `200`: Updated task object
- `400`: Task ID is required
- `403`: Forbidden
- `404`: Task not found
- `500`: Server error


---

### `DELETE /api/task/[id]`

Deletes a specific task.

| Auth Required | Role Required
|-----|-----
| Yes | Owner or Admin


**Path Parameters:**

| Parameter | Type | Description
|-----|-----|-----
| `id` | string | Task ID


**Responses:**

- `200`: `{ "message": "Task deleted successfully" }`
- `400`: Task ID is required
- `403`: Forbidden
- `404`: Task not found
- `500`: Server error


---

## Upload Endpoint

### `POST /api/upload`

Uploads a file to Supabase storage.

| Auth Required | Role Required
|-----|-----
| No (implied) | None


**Request:** `multipart/form-data`

| Field | Type | Description
|-----|-----|-----
| `file` | File | The file to upload


**Allowed File Types:**

- `application/pdf`
- `image/jpeg`
- `image/png`


**Max File Size:** 50MB

**Responses:**

- `200`:

```json
{
  "url": "string (public URL)",
  "path": "string (storage path)",
  "fileName": "string (original file name)"
}
```


- `400`: No file provided / File type not allowed / File size exceeds limit
- `500`: Server error


---

## Summary Table

| Endpoint | Method | Auth | Role | Description
|-----|-----|-----|-----|-----
| `/api/auth/[...nextauth]` | GET/POST | - | - | NextAuth handlers
| `/api/user` | GET | Yes | Admin | List users / Get by email
| `/api/user` | POST | No | - | Login verification
| `/api/user/register` | POST | No | - | Register new user
| `/api/user/[id]` | GET | Yes | Owner/Admin | Get user by ID
| `/api/user/[id]` | PATCH | Yes | Owner | Update user
| `/api/user/[id]` | DELETE | Yes | Owner | Delete user
| `/api/task` | GET | Yes | Auth | List tasks
| `/api/task` | POST | No | - | Create task
| `/api/task/[id]` | GET | Yes | Owner/Admin | Get task by ID
| `/api/task/[id]` | PATCH | Yes | Owner/Admin | Update task
| `/api/task/[id]` | DELETE | Yes | Owner/Admin | Delete task
| `/api/upload` | POST | No | - | Upload file
