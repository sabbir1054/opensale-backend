# OpenSale Backend - API Documentation

**Base URL:** `http://localhost:5000/api/v1`

**Authentication:** JWT Bearer token in `Authorization` header

**Roles:** `ADMIN`, `USER`, `WORKER`, `AGENT`, `INVESTOR`

---

## Auth Module

### Register User

`POST /auth/register`

**Auth:** Required (AGENT, USER, INVESTOR, WORKER)

**Request:**

```json
{
  "fullName": "John Doe",
  "phone": "01712345678",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User registered",
  "data": {
    "id": "uuid",
    "role": "USER",
    "fullName": "John Doe",
    "phone": "01712345678",
    "email": "john@example.com",
    "createdAt": "2026-03-26T00:00:00.000Z",
    "updatedAt": "2026-03-26T00:00:00.000Z"
  }
}
```

---

### Register Super Admin

`POST /auth/register-s-admin`

**Auth:** None

**Request:** Same as Register User

---

### Register Admin

`POST /auth/register-admin`

**Auth:** Required (ADMIN)

**Request:** Same as Register User

---

### Login

`POST /auth/login`

**Auth:** None

**Request:**

```json
{
  "phone": "01712345678",
  "password": "password123"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

> `refreshToken` is set in HTTP-only cookie.

---

### Refresh Token

`GET /auth/refresh-token`

**Auth:** None (uses `refreshToken` cookie)

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Change Password

`PATCH /auth/change-password`

**Auth:** Required (all roles)

**Request:**

```json
{
  "oldPassword": "password123",
  "newPassword": "newPassword456"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User password changed successfully",
  "data": {
    "id": "uuid",
    "role": "USER",
    "fullName": "John Doe",
    "phone": "01712345678",
    "email": "john@example.com",
    "createdAt": "2026-03-26T00:00:00.000Z",
    "updatedAt": "2026-03-26T00:00:00.000Z"
  }
}
```

---

### Forgot Password - Send OTP

`POST /auth/forgot-password`

**Auth:** None

**Request:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "OTP sent to your email",
  "data": null
}
```

---

### Forgot Password - Verify OTP & Reset

`POST /auth/forgot-password/verify`

**Auth:** None

**Request:**

```json
{
  "email": "john@example.com",
  "otp": "482916",
  "newPassword": "newPassword456"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

---

## Post Category Module

### Create Post Category

`POST /post-categories`

**Auth:** Required (ADMIN)

**Content-Type:** `multipart/form-data`

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `categoryName` | string | Yes      |
| `image`        | file   | No       |

**Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Post category created successfully",
  "data": {
    "id": "uuid",
    "categoryName": "Electronics",
    "createdAt": "2026-03-26T00:00:00.000Z",
    "updatedAt": "2026-03-26T00:00:00.000Z",
    "image": {
      "id": "uuid",
      "url": "uploads/1711432800000--123456789-photo.jpg",
      "postCategoryId": "uuid",
      "createdAt": "2026-03-26T00:00:00.000Z",
      "updatedAt": "2026-03-26T00:00:00.000Z"
    }
  }
}
```

---

### Get All Post Categories

`GET /post-categories`

**Auth:** None

**Query Parameters:**

| Param      | Type   | Description              |
| ---------- | ------ | ------------------------ |
| searchTerm | string | Search by category name  |
| page       | number | Page number (default: 1) |
| limit      | number | Items per page (default: 10) |
| sortBy     | string | Sort field (default: createdAt) |
| sortOrder  | string | `asc` or `desc` (default: desc) |

**Example:** `GET /post-categories?searchTerm=elec&page=1&limit=10`

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Post categories retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5
  },
  "data": [
    {
      "id": "uuid",
      "categoryName": "Electronics",
      "createdAt": "2026-03-26T00:00:00.000Z",
      "updatedAt": "2026-03-26T00:00:00.000Z",
      "image": null
    }
  ]
}
```

---

### Get Single Post Category

`GET /post-categories/:id`

**Auth:** None

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Post category retrieved successfully",
  "data": {
    "id": "uuid",
    "categoryName": "Electronics",
    "createdAt": "2026-03-26T00:00:00.000Z",
    "updatedAt": "2026-03-26T00:00:00.000Z",
    "image": null
  }
}
```

---

### Update Post Category

`PATCH /post-categories/:id`

**Auth:** Required (ADMIN)

**Content-Type:** `multipart/form-data`

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `categoryName` | string | No       |
| `image`        | file   | No       |

**Response:** Same structure as Create

---

### Delete Post Category

`DELETE /post-categories/:id`

**Auth:** Required (ADMIN)

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Post category deleted successfully",
  "data": {
    "id": "uuid",
    "categoryName": "Electronics",
    "createdAt": "2026-03-26T00:00:00.000Z",
    "updatedAt": "2026-03-26T00:00:00.000Z"
  }
}
```

---

## Post Module

### Create Post

`POST /posts`

**Auth:** Required (ADMIN, USER)

**Content-Type:** `multipart/form-data`

| Field              | Type    | Required | Description                       |
| ------------------ | ------- | -------- | --------------------------------- |
| `title`            | string  | Yes      | Post title                        |
| `description`      | string  | No       | Post description                  |
| `price`            | number  | No       | Price (default: 0)                |
| `isNegotiable`     | boolean | No       | Default: true                     |
| `productCondition` | string  | No       | `NEW`, `USED`, `LIKE_NEW`         |
| `name`             | string  | Yes      | Seller name                       |
| `phone`            | string  | Yes      | Seller phone                      |
| `postCategoryId`   | string  | Yes      | Category UUID                     |
| `division`         | string  | No       | Division (e.g. Dhaka)             |
| `district`         | string  | No       | District (e.g. Mirpur)            |
| `area`             | string  | No       | Area details                      |
| `photos`           | file[]  | No       | Up to 10 images                   |

**Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "uuid",
    "title": "iPhone 15 Pro",
    "description": "Brand new iPhone",
    "price": 150000,
    "isNegotiable": true,
    "productCondition": "NEW",
    "name": "John Doe",
    "phone": "01712345678",
    "postCategoryId": "uuid",
    "createdAt": "2026-03-26T00:00:00.000Z",
    "updatedAt": "2026-03-26T00:00:00.000Z",
    "category": {
      "id": "uuid",
      "categoryName": "Electronics"
    },
    "address": {
      "id": "uuid",
      "division": "Dhaka",
      "district": "Mirpur",
      "area": "Section 10",
      "postId": "uuid"
    },
    "photos": [
      {
        "id": "uuid",
        "url": "uploads/1711432800000--123456789-photo.jpg",
        "postId": "uuid"
      }
    ]
  }
}
```

---

### Get All Posts (Advanced Search & Filter)

`GET /posts`

**Auth:** None

**Query Parameters:**

| Param              | Type   | Description                                    |
| ------------------ | ------ | ---------------------------------------------- |
| `searchTerm`       | string | Searches in `title`, `name`, `description`     |
| `postCategoryId`   | string | Filter by category UUID                        |
| `productCondition` | string | `NEW`, `USED`, `LIKE_NEW`                      |
| `isNegotiable`     | string | `true` or `false`                              |
| `minPrice`         | string | Minimum price                                  |
| `maxPrice`         | string | Maximum price                                  |
| `division`         | string | Filter by division (case-insensitive contains) |
| `district`         | string | Filter by district (case-insensitive contains) |
| `page`             | number | Page number (default: 1)                       |
| `limit`            | number | Items per page (default: 10)                   |
| `sortBy`           | string | Sort field (default: createdAt)                |
| `sortOrder`        | string | `asc` or `desc` (default: desc)                |

**Example:**

```
GET /posts?searchTerm=iphone&division=Dhaka&district=Mirpur&minPrice=1000&maxPrice=200000&productCondition=NEW&page=1&limit=10&sortBy=price&sortOrder=asc
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Posts retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  },
  "data": [
    {
      "id": "uuid",
      "title": "iPhone 15 Pro",
      "description": "Brand new iPhone",
      "price": 150000,
      "isNegotiable": true,
      "productCondition": "NEW",
      "name": "John Doe",
      "phone": "01712345678",
      "postCategoryId": "uuid",
      "createdAt": "2026-03-26T00:00:00.000Z",
      "updatedAt": "2026-03-26T00:00:00.000Z",
      "category": {
        "id": "uuid",
        "categoryName": "Electronics"
      },
      "address": {
        "id": "uuid",
        "division": "Dhaka",
        "district": "Mirpur",
        "area": "Section 10"
      },
      "photos": []
    }
  ]
}
```

---

### Get Single Post

`GET /posts/:id`

**Auth:** None

**Response:** Same structure as single post object above

---

### Update Post

`PATCH /posts/:id`

**Auth:** Required (ADMIN, USER)

**Content-Type:** `multipart/form-data`

All fields from Create are optional. New photos are appended (not replaced).

**Response:** Same structure as Create

---

### Delete Post

`DELETE /posts/:id`

**Auth:** Required (ADMIN, USER)

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Post deleted successfully",
  "data": {
    "id": "uuid",
    "title": "iPhone 15 Pro"
  }
}
```

---

### Delete Post Photo

`DELETE /posts/photo/:photoId`

**Auth:** Required (ADMIN, USER)

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Photo deleted successfully",
  "data": {
    "id": "uuid",
    "url": "uploads/1711432800000--123456789-photo.jpg",
    "postId": "uuid"
  }
}
```

---

## Wishlist Module

### Add to Wishlist

`POST /wishlists`

**Auth:** Required (all roles)

**Request:**

```json
{
  "postId": "post-uuid-here"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Post added to wishlist",
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "postId": "post-uuid",
    "createdAt": "2026-03-26T00:00:00.000Z",
    "post": {
      "id": "post-uuid",
      "title": "iPhone 15 Pro",
      "price": 150000,
      "productCondition": "NEW",
      "category": {
        "id": "uuid",
        "categoryName": "Electronics"
      },
      "address": {
        "division": "Dhaka",
        "district": "Mirpur",
        "area": "Section 10"
      },
      "photos": []
    }
  }
}
```

---

### Get My Wishlist

`GET /wishlists`

**Auth:** Required (all roles)

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Wishlist retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "postId": "post-uuid",
      "createdAt": "2026-03-26T00:00:00.000Z",
      "post": {
        "id": "post-uuid",
        "title": "iPhone 15 Pro",
        "price": 150000,
        "productCondition": "NEW",
        "category": {
          "id": "uuid",
          "categoryName": "Electronics"
        },
        "address": {
          "division": "Dhaka",
          "district": "Mirpur",
          "area": "Section 10"
        },
        "photos": []
      }
    }
  ]
}
```

---

### Remove from Wishlist

`DELETE /wishlists/:postId`

**Auth:** Required (all roles)

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Post removed from wishlist",
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "postId": "post-uuid",
    "createdAt": "2026-03-26T00:00:00.000Z"
  }
}
```

---

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "errorMessages": [
    {
      "path": "",
      "message": "Detailed error message"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

**Common Error Codes:**

| Code | Description          |
| ---- | -------------------- |
| 400  | Bad Request / Validation Error |
| 401  | Unauthorized         |
| 403  | Forbidden            |
| 404  | Not Found            |
| 500  | Internal Server Error |
