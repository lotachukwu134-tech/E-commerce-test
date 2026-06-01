# E-Commerce REST API
Backend for an online store. Node.js + Express + MongoDB.

## Setup
1. npm install
2. Create.env file from.env.example
3. npm start
Server runs on http://localhost:9000

## Endpoints
POST /auth/register | POST /auth/login
GET /product/getProducts | POST /product/createProduct[Admin]
GET /cart | POST /cart/add
POST /orders | GET /orders

## Auth
Use header: Authorization: Bearer <token>
