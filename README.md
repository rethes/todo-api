# todo-api
A simple todo app API 

## Features:

### For TODOs
- CRUD todo details
- Get a list of paginated items

### For Users
- Register a user with social auth and jwt tokens using PassportJs
- Login a user
- Get a list of paginated users
- Upload user images using cloudinary

### Quick Set-up

Ensure you have the following installed locally:

* [Postgres](https://www.postgresql.org/)

* [Node](https://nodejs.org/en/)

Clone repo:
```
git clone https://github.com/rethes/todo-api.git
```

Navigate to repo:
```
cd todo-api
```

Install all dependencies:

```
npm install
```

Start Postgres and create `todo-app` database if it does not exist.

Set up the environment variables appropriately by renaming `.env.example` to `.env` and updating it with the required values described below:
- NODE_ENV : environment you are running on (`development` for local setup)
- DATABASE_URL : Postgres url for the database (`postgres://localhost:5432/todo-app` for local setup)
- PORT : port in which the app will be listening (`8000` for local setup)
- JWT_SECRET : secret key used to generate the api tokens

Setup database url for migrations:
```
export DATABASE_URL = postgres://localhost:5432/todo-app
```

Start the dev server:

```
npm start
```

Navigate to the port and test the endpoints on postman

### Features

#### Categories
1. Get all categories

#### Todo
1. CRUD Todo
2. Pagination

#### Users
1. Jwt Authentication with PassportJs
2. Create, View and Update user details 
3. Profile upload with Cloudinary
4. Pagination

### Screenshots
<img width="1421" alt="Screenshot 2019-03-22 at 22 56 57" src="https://user-images.githubusercontent.com/27001310/54849606-d8d44800-4cf5-11e9-93c3-469bae3fdc02.png">

### Api Documentation
The API documentation can be found here: 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/7a007728a6cb7b2379df)
