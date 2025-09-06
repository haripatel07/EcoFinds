# EcoFinds API Testing Guide with Postman

This guide provides step-by-step instructions on how to test the EcoFinds backend API using [Postman](https://www.postman.com/downloads/).

## 1. Prerequisites

1.  **Postman App**: Make sure you have the Postman desktop application installed.
2.  **Running Backend Server**: The EcoFinds backend server must be running. By default, it runs at `http://localhost:3000`.
3.  **Running MongoDB**: Ensure your MongoDB database is running and accessible to the backend.

## 2. Postman Setup

### Step 2.1: Create a Collection

A Postman Collection helps you organize your API requests.

1.  Open Postman and click **File > New**.
2.  Select **Collection**.
3.  Name it `EcoFinds API` and click **Create**.

### Step 2.2: Set Up Environment Variables

Environments let you store and reuse values like URLs and authentication tokens. This is highly recommended.

1.  Click the **"Environments"** tab on the left sidebar.
2.  Click the **`+`** button to create a new environment.
3.  Name it `EcoFinds Local`.
4.  Add the following variables:

| Variable | Initial Value | Description |
| :--- | :--- | :--- |
| `baseUrl` | `http://localhost:3000` | The base URL of your running server. |
| `authToken` | | This will store the JWT token after you log in. |
| `productId` | | This will store the ID of a product you create. |
| `categoryId`| | This will store the ID of a category. |

5.  Click **Save**.
6.  In the top-right corner of Postman, select the **"EcoFinds Local"** environment from the dropdown menu to make it active.

![Postman Environment Selector](https://i.imgur.com/sBvYqg1.png)

## 3. Authentication Flow

First, you need to register a user and log in to get an authentication token.

### Request 1: Register a New User

1.  In your `EcoFinds API` collection, click **"Add a request"**.
2.  Set the request details:
    *   **Method**: `POST`
    *   **URL**: `{{baseUrl}}/api/auth/register`
    *   **Body** tab:
        *   Select **raw** and **JSON**.
        *   Enter the following JSON:
            ```json
            {
                "username": "testuser1",
                "email": "testuser1@example.com",
                "password": "password123"
            }
            ```
3.  Click **Send**. You should receive a `201 Created` response with the user object and a token.

### Request 2: Login and Capture Token

1.  Create another request:
    *   **Method**: `POST`
    *   **URL**: `{{baseUrl}}/api/auth/login`
    *   **Body** tab (raw, JSON):
        ```json
        {
            "email": "testuser1@example.com",
            "password": "password123"
        }
        ```
2.  Go to the **"Tests"** tab for this request and add the following script. This script will automatically grab the token from the response and save it to your `authToken` environment variable.

    ```javascript
    // Postman test script to automatically save the auth token
    const response = pm.response.json();
    if (response.token) {
        pm.environment.set("authToken", response.token);
        console.log("Auth Token saved!");
    }
    ```
3.  Click **Send**. You should get a `200 OK` response. Check the Postman console (`Ctrl+Alt+C`) to see the "Auth Token saved!" message. Your `authToken` variable is now set.

**Note on Email Verification**: For testing, the seed script sets the first user as verified. For new users, you would need to manually set `isVerified: true` in the database, as the verification email link won't work in a local test environment.

## 4. Testing API Endpoints

For all subsequent requests that require authentication, you need to add the JWT token to the `Authorization` header.

### How to Add the Auth Token

1.  For any new request, go to the **"Authorization"** tab.
2.  Select **"Bearer Token"** from the dropdown.
3.  In the "Token" field, enter `{{authToken}}`. Postman will replace this with the value from your environment.

![Postman Bearer Token](https://i.imgur.com/v1fKqD9.png)

---

### Users

#### Get Current User (`/api/users/me`)

*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/api/users/me`
*   **Authorization**: Bearer Token `{{authToken}}`
*   Click **Send**. You should get your user's details.

---

### Products

#### Create a Product (`/api/products`)

*   **Method**: `POST`
*   **URL**: `{{baseUrl}}/api/products`
*   **Authorization**: Bearer Token `{{authToken}}`
*   **Body** (raw, JSON):
    ```json
    {
        "name": "Sustainable Bamboo Toothbrush",
        "description": "A great eco-friendly alternative to plastic toothbrushes.",
        "price": 5.99,
        "category": "60c72b2f9b1d8c001f8e4c5e", // Replace with a real category ID from your DB
        "stock": 100
    }
    ```
*   **Tests** tab (to save the new product's ID):
    ```javascript
    const response = pm.response.json();
    if (response.product && response.product._id) {
        pm.environment.set("productId", response.product._id);
        console.log("Product ID saved!");
    }
    ```
*   Click **Send**.

#### Get All Products (`/api/products`)

*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/api/products`
*   No authorization needed.

#### Get a Single Product (`/api/products/:id`)

*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/api/products/{{productId}}`
*   No authorization needed.

---

### Cart

#### Add Item to Cart (`/api/cart`)

*   **Method**: `POST`
*   **URL**: `{{baseUrl}}/api/cart`
*   **Authorization**: Bearer Token `{{authToken}}`
*   **Body** (raw, JSON):
    ```json
    {
        "productId": "{{productId}}",
        "quantity": 2
    }
    ```

#### Get Cart (`/api/cart`)

*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/api/cart`
*   **Authorization**: Bearer Token `{{authToken}}`

---

### Checkout and Orders

#### Checkout (`/api/cart/checkout`)

*   **Method**: `POST`
*   **URL**: `{{baseUrl}}/api/cart/checkout`
*   **Authorization**: Bearer Token `{{authToken}}`
*   **Body** (raw, JSON):
    ```json
    {
        "shippingAddress": "123 Green Way, Eco City, 12345"
    }
    ```

#### Get My Orders (`/api/orders`)

*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/api/orders`
*   **Authorization**: Bearer Token `{{authToken}}`

This guide covers the main testing flows. You can expand your collection by adding requests for all other endpoints (updating, deleting, reviews, etc.) following the same principles. Happy testing!
