# EXPENZZA V2 API DOCUMENTATION

Welcome to the Expenzza V2 API documentation! Expenzza is a simple expense tracker designed to help you manage your finances effortlessly. This API provides basic CRUD (Create, Read, Update, Delete) functionalities for managing expenses, categories, and users.

## Getting Started

1. Set up a MongoDB Atlas account. _To learn how to set up a mongodb atlas account, please visit [MongoDB Create Atlas Account](https://www.mongodb.com/cloud/atlas/register)_.

2. Set up a Cloudinary account. _To learn how to set up a cloudinary account, please visit [Cloudinary Get Started](https://cloudinary.com/users/register_free)_.

3. Upload any image of your choice for default image to your cloudinary cloud base. Take  note of this image's public_id and secure_url as provided by cloudinary when uploaded.

## Setup

1. Install all dependencies by using your preferred package installer.
   Using npm:

      ```cmd
        npm install
      ```

2. Create a .env file in the project root and add variables:

      - MONGO URI \<**Required**\>. _Set to your mongoDb connection string. To learn how to get a mongodb connection string, please visit the [MongoDB Docs](https://www.mongodb.com/docs/guides/atlas/connection-string/)_.

      - PRIVATE KEY \<**Required**\>. _Set to your-256-bit-secret for signing JWT token._
      - MONGO DBNAME \<**Required**\>. _Set to any name of choice for your database._
      - CLOUDINARY_API_SECRET \<**Required**\>. _Set to your cloudinary api secret._
      - CLOUDINARY_API_KEY \<**Required**\>. _Set to your cloudinary api key_.
      - CLOUDINARY_CLOUD_NAME \<**Required**\>. _Set to your cloudinary cloud name_.
      - DEFAULT_IMAGE_ID \<**Required**\>. _Set to your default image public\_id._
      - DEFAULT_IMAGE \<**Required**\>. _Set to your default image secure\_url._
      - PORT \<**Optional**\>. _By default, 5000 is used_.
      - TOKENLIFETIME \<**Optional**\>. _By default, 30d is used_.

3. Open a shell terminal in your project root and run the following script:
      ```cmd
      npm start
      ```

## Base URL

The base URL for all API requests is: `http://localhost:PORT/api/v1`.

PORT is as specified in .env or 5000 if none specified.

## Endpoints

### Auth

### `POST /auth/register`
Register a user to the database.

### Request
The request body **MUST** contain the following fields: 
- `username` : Username must contain at least 3 characters, begin with a letter or an underscore and contain at least two letters (and/or numbers).
- `email` : Must be a valid email.
- `password` : Password must be at least 6 characters long with at least one lowercase letter and one number.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `user` : A JSON Object with the following properties:
     - `email` : User's email.
     - `username` : User's username.
     - `image` : Default Image.
     - `createdAt` : Date of account creation.

### Example
Request:
```json
// Request Body
{
    "username": "user",
    "email": "user@dev.com",
    "password": "user123"
}
```

Response:
```json
{
    "success": true,
    "user": {
        "email": "user@dev.com",
        "username": "user",
        "image": "default",
        "createdAt": "Today"
    }
}
```

### `POST /auth/login`
Logs in user.

### Request
The request body **MUST** contain the following fields: `email` and `password`.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `user` : A JSON Object with the following properties:
     - `email` : User's email.
     - `username` : User's username.
     - `image` : User's image.
     - `createdAt` : Date of account creation.

### Example
Request:
```json
// Request Body
{
    "email": "user@dev.com",
    "password": "user123"
}
```

Response:
```json
{
    "success": true,
    "user": {
        "email": "user@dev.com",
        "username": "user",
        "image": "User's image",
        "createdAt": "Today"
    }
}
```

### `GET /auth/logout`
Logs out current user.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `message` : Custom message from server.

### Example
Request:
    
    GET /auth/logout

Response:
```json
{
    "success": true,
    "message": "Logged Out"
}   
```

### Profile

### `GET /profile`
Shows user's profile information.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `user` : A JSON Object with the following properties:
     - `email` : User's email.
     - `username` : User's username.
     - `image` : User's image.
     - `createdAt` : Date of account creation.

### Example
Request:
    
    GET /profile

Response:
```json
{
    "success": true,
    "user": {
        "email": "user@dev.com",
        "username": "user",
        "image": "User's image",
        "createdAt": "Today"
    }
}
```

### `PUT /profile/uploadImage`
Update user's image in the database.

### Request
The request body **MUST** contain an `image` field populated with an image file.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `user` : A JSON Object with the following properties:
     - `email` : User's email.
     - `username` : User's username.
     - `image` : Given image from request body.
     - `createdAt` : Date of account creation.

### Example
Request:
```json
// Request Body
{
    "image": "myself"
}
```

Response:
```json
{
    "success": true,
    "user": {
        "email": "user@dev.com",
        "username": "user",
        "image": "myself",
        "createdAt": "Today"
    }
}
```

### `DELETE /profile/deleteImage`
Resets user's image to default image provided by server.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `user` : A JSON Object with the following properties:
     - `email` : User's email.
     - `username` : User's username.
     - `image` : Default Image.
     - `createdAt` : Date of account creation.

### Example
Request:
    
    DELETE /profile/deleteImage

Response:
```json
{
    "success": true,
    "user": {
        "email": "user@dev.com",
        "username": "user",
        "image": "default",
        "createdAt": "Today"
    }
}
```

### `DELETE /profile`
Removes user from database.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `message` : Custom message from server.

### Example
Request:
    
    DELETE /profile

Response:
```json
{
    "success": true,
    "message": "Account Deleted"
}
```

### `PATCH /profile/updateEmail`
Updates user's email in the database.

### Request
The request body **MUST** contain an `email` field.

`email` : Must be a valid email.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `user` : A JSON Object with the following properties:
     - `email` : User's updated email.
     - `username` : User's username.
     - `image` : User's image.
     - `createdAt` : Date of account creation.

### Example
Request:
```json
// Request Body
{
    "email": "user2@dev.com"
}
```

Response:
```json
{
    "success": true,
    "user": {
        "email": "user2@dev.com",
        "username": "user",
        "image": "User's image",
        "createdAt": "Today"
    }
}
```

### `PATCH /profile/updateUsername`
Updates user's username in the database.

### Request
The request body **MUST** contain a `username` field.

`username`: Username must contain at least 3 characters, begin with a letter or an underscore and contain at least two letters (and/or numbers).

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `user` : A JSON Object with the following properties:
     - `email` : User's email.
     - `username` : User's updated username.
     - `image` : User's image.
     - `createdAt` : Date of account creation.

### Example
Request:
```json
// Request Body
{
    "username": "user2"
}
```

Response:
```json
{
    "success": true,
    "user": {
        "email": "user@dev.com",
        "username": "user2",
        "image": "User's image",
        "createdAt": "Today"
    }
}
```

### `PATCH /profile/updatePassword`
Updates user's password in the database.

### Request
The request body **MUST** contain the following fields: 
- `oldpassword` : Must match current password.
- `password` : Password must be at least 6 characters long with at least one lowercase letter and one number.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `message` : Custom message from server.

### Example
Request:
```json
// Request Body
{
    "oldpassword": "user123",
    "password": "user321"
}
```

Response:
```json
{
    "success": true,
    "message": "Password updated"
}
```

### Expenses

### `POST /expenses`
Creates a new expense for a user in the database.

### Request
The request body contains the following fields:
- `description` : \<**Required**\>. Must not be empty.
- `amount` : \<**Required**\>. Must be an amount greater than 0
- `category` : \<**Optional**\>. If empty or not provided, will default to 'miscellaneous'. If provided, must match to any of the options below:
```js
["groceries", "utilities", "rent", "transportation", "food", "entertainment", "healthcare", "education", "clothing", "travel", "gifts", "charity", "investments", "gambling", "personal care", "home improvement", "miscellaneous"]
```

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `expense` : A JSON Object with the following properties:
    - `id` : Expense ID.
    - `description` : Expense description.
    - `amount` : Expense amount.
    - `category` : Expense category.
    - `createdAt` : Date of Expense Creation.

### Example
Request:
```json
// Request Body
{
    "amount": "150",
    "description": "Gym membership fee"
}
```

Response:
```json
{
    "success": true,
    "expense": {
        "id": "1",
        "description": "Gym membership fee",
        "amount": 150,
        "category": "miscellaneous",
        "createdAt": "Today"
    }
}
```

### `GET /expenses`
Retrieves all expenses created by a user from the database.

### Query Parameters
- `page` : \<**Optional**\>. The page number to return. Default is 1.
- `limit` : \<**Optional**\>. The number of expenses to return. Default is 10.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `expense` : An array of JSON objects representing an expense, each with the following properties:
    - `id` : Expense ID.
    - `description` : Expense description.
    - `amount` : Expense amount.
    - `category` : Expense category.
    - `createdAt` : Date of Expense Creation.
- `page` : Current page number.
- `count` : Total count of expenses in current page.
- `totalCount` : Total count of expenses created by user found in database.
- `numOfPages` : Total number of pages.

### Example
Request:
    
    GET /expenses?page=1&limit=5

Response:
```json
{
    "success": true,
    "expense": [
        {
            "_id": "1",
            "description": "Gym membership fee",
            "amount": 150,
            "category": "miscellaneous",
            "createdAt": "Today"
        },
        {
            "_id": "2",
            "description": "Netflix subscription",
            "amount": 370,
            "category": "entertainment",
            "createdAt": "Today"
        },
        {
            "_id": "3",
            "description": "Horse Racing",
            "amount": 100,
            "category": "gambling",
            "createdAt": "Today"
        },
        {
            "_id": "4",
            "description": "Birthday Cake",
            "amount": 400,
            "category": "miscellaneous",
            "createdAt": "Today"
        },
        {
            "_id": "5",
            "description": "Beach Outing",
            "amount": 400,
            "category": "entertainment",
            "createdAt": "Today"
        }
    ],
    "page": 1,
    "count": 5,
    "totalCount": 11,
    "numOfPages": 3
}
```

### `GET /expenses/showAnalytics`
Provides a summary of expenses recorded by a user.

### Query Parameters
- `page` : \<**Optional**\>. The page number to return. Default is 1.
- `limit` : \<**Optional**\>. The number of expense summaries to return. Default is 10.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `analytics` : An array of JSON objects representing a summary, each with only one property (giving it a general name: category summary, for ease of explanation) named after the expense category it summarizes. Each category summary is a JSON object with the following properties:
    - `expenseCount` : The total number of expenses recorded under a category for a user.
    - `totalExpense` : The total amount spent under a category for a user.
- `page` : Current page number.
- `count` : Total count of summary in current page.
- `totalCount` : Total count of summaries.
- `numOfPages` : Total number of pages.

### Example
Request:
    
    GET /expenses/showAnalytics?limit=2&page=1

Response:
```json
{
    "success": true,
    "analytics": [
        {
            "entertainment": {
                "expenseCount": 2,
                "totalExpense": 770
            },
            "gambling": {
                "expenseCount": 1,
                "totalExpense": 100
            }
        }
    ],
    "page": 1,
    "count": 2,
    "totalCount": 3,
    "numOfPages": 2
}
```

### `GET expenses/:id`
Retrieve a specific expense by its ID.

### Parameters
- `id` : The unique identifier of the expense.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `expense` : A JSON Object with the following properties:
    - `id` : Expense ID.
    - `description` : Expense description.
    - `amount` : Expense amount.
    - `category` : Expense category.
    - `createdAt` : Date of Expense Creation.

### Example
Request:
    
    GET /expenses/1

Response:
```json
{
    "success": true,
    "expense": {
        "id": "1",
        "description": "Gym membership fee",
        "amount": 150,
        "category": "miscellaneous",
        "createdAt": "Today"
    }
}
```

### `PATCH /expenses/:id`
Update a specified expense in the database

### Parameters
- `id` : The unique identifier of the expense.

### Request
The request body can contain one or more of the following fields:
- `description` : \<**Optional**\>. If provided, must not be empty.
- `amount` : \<**Optional**\>. If provided, must be an amount greater than 0
- `category` : \<**Optional**\>. If provided and empty,will default to 'miscellaneous'. If provided and not empty, must match to any of the options below:
```js
["groceries", "utilities", "rent", "transportation", "food", "entertainment", "healthcare", "education", "clothing", "travel", "gifts", "charity", "investments", "gambling", "personal care", "home improvement", "miscellaneous"]
```
### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `expense` : A JSON Object with the following properties:
    - `id` : Expense ID.
    - `description` : Expense description.
    - `amount` : Expense amount.
    - `category` : Expense category.
    - `createdAt` : Date of Expense Creation.

### Example
Request:
```json
// Request Body
{
    "category": "healthcare"
}
```

Response:
```json
{
    "success": true,
    "expense": {
        "id": "1",
        "description": "Gym membership fee",
        "amount": 150,
        "category": "healthcare",
        "createdAt": "Today"
    }
}
```

### `DELETE /expenses/:id`
Removes a specified expense from the database.

### Parameters
- `id` : The unique identifier of the expense.

### Response
Returns a JSON Object with the following properties:
- `success` : The status of the request.
- `message` : Custom message from server.

### Example
Request:

    DELETE /expenses/1

Response:
```json
{
    "success": true,
    "message": "Deleted"
}
```

## Error Responses
In case of errors, this API returns a JSON Object with the following properties:
- `success` : The status of the request. It is **FALSE** in the case of an error.
- `message` : Custom message from server describing the error.

## Error Codes
This API uses the following error codes:
- `400 Bad Request` : The request was malformed or missing required parameters. Missing fields in received input may throw this error.
- `401 Unauthorized` : The request lacks valid authentication credentials or the provided API key was invalid or missing.
- `404 Not Found` : The requested resource could not be found on the server.
- `409 Conflict` : The request could not be completed due to a conflict with the current state of the resource. Typically, duplicate key errors and is thrown when a resource to stored in the database already exists in the database.
- `422 Unprocessable Entity` : The server understands the content type of the request entity, but it was unable to process the contained instructions due to semantic errors or validation failures. Typically validation errors and thrown when invalid input is received.
- `500 Internal Server Error` : An unexpected error occurred on the server, indicating a problem with the server's configuration or processing logic.



