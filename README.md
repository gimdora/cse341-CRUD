# Books API

A simple CRUD API for managing books and reviews. Built with Node.js, Express, and MongoDB.

## Collections

- **books**: title, author, isbn, genre, publishedYear, publisher, pageCount, language, summary, rating
- **reviews**: bookId, reviewerName, rating, comment, createdAt

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the project root (use `.env.example` as a template):
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   HOST=localhost:3000
   ```

3. Generate the Swagger documentation:
   ```
   npm run swagger
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open `http://localhost:3000/api-docs` in your browser to view the API documentation.

## Endpoints

### Books
- `GET /books` - get all books
- `GET /books/:id` - get one book
- `POST /books` - create a new book
- `PUT /books/:id` - update a book
- `DELETE /books/:id` - delete a book

### Reviews
- `GET /reviews` - get all reviews
- `GET /reviews/:id` - get one review
- `POST /reviews` - create a new review
- `PUT /reviews/:id` - update a review
- `DELETE /reviews/:id` - delete a review

## Deployment

This project is deployed on Render. Make sure to add the same environment variables (`MONGODB_URI`, `HOST`) as config vars in the Render dashboard.

Set `HOST` to your Render URL without `https://` (for example, `my-app.onrender.com`).
