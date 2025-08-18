# art-portfolio
A simple full‑stack gallery app with user authentication, categories, and image uploads. The frontend is React + Vite + Tailwind; the backend is Node.js + Express + MySQL. Users can sign up, log in, create artworks with images, filter by categories, and view/edit/delete their artworks.

TECH STACK

- Frontend

- React (Vite)

- React Router

- Tailwind CSS

- Axios 

Backend

- Node.js + Express

- MySQL (mysql2/promise)

- JWT auth (jsonwebtoken)

- bcrypt for password hashing

- express‑validator for request validation

- Multer for file uploads

API OVERVIEW

Auth

POST /users — create user

body: { email, password }

201 on success; 409 if email exists

POST /users/sign-in — login

body: { email, password }

200: { token } (JWT)

Categories (protected)

GET /categories — list categories

Artworks (protected)

GET /artworks?category_id=ID — list my artworks, optionally filtered

GET /artworks/:id — get one of my artworks

POST /artworks — create (multipart/form-data)

fields: title, description?, category_id?, image?

PUT /artworks/:id — update text fields (title/description/category)

DELETE /artworks/:id — delete

The backend reads JWT from Authorization: Bearer <token>; the auth middleware sets req.userId.


PLEASE USE THIS ACCOUNT TO LOGIN IN ORDER TO SEE ARTS
- EMAIL: mrmaki@demo.local
- PASSWORD: Maki123!