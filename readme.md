# Backend Stage 2 Task: User Authentication & Organisation

This project implements user authentication and organization management using a backend framework of your choice. Follow the acceptance criteria carefully.

## Acceptance Criteria
1. **Database Connection**: Connect your application to a PostgreSQL database server (optional: use any ORM of your choice).
2. **User Model**: Create a User model with the properties below. Ensure `userId` and `email` are unique:
    ```json
    {
      "userId": "string", // must be unique
      "firstName": "string", // must not be null
      "lastName": "string", // must not be null
      "email": "string", // must be unique and must not be null
      "password": "string", // must not be null
      "phone": "string"
    }
    ```
3. **Validation**: Provide validation for all fields. Return status code 422 with the following payload on validation error:
    ```json
    {
      "errors": [
        {
          "field": "string",
          "message": "string"
        }
      ]
    }
    ```
4. **User Authentication**: Implement user authentication using the schema above.
    - **User Registration**:
        - Endpoint: [POST] `/auth/register`
        - Hash the user’s password before storing it in the database.
        - Successful response: Return payload with a 201 success status code.
    - **User Login**:
        - Endpoint: [POST] `/auth/login`
        - Use the returned JWT token to access protected endpoints.
5. **Organisation Management**:
    - A user can belong to multiple organisations.
    - An organisation can contain multiple users.
    - On registration, an organisation must be created with the user's first name appended with "Organisation".
    - Logged-in users can access organisations they belong to or created.


## Thank you
