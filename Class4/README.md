# Week 4

This week is an exercise in authentication and middleware.

## Learning Objectives

At the end of this week, a student should:

- have implemented an authenticated API with signup and login
- have used bcrypt to securely store passwords
- have used middleware for authentication enforcement and error handling

## The assignment

The assignment this week is designed to get you to build a simple authenticated API. You will build the common routes for signup and login. Then you will ensure that only authenticated users can access your protected API routes while ensuring they cannot access data that is not theirs.

### Getting started

1. Make sure you have a recent version of [Node.js](https://nodejs.org/en/download/) installed on your computer. Node v22 or higher is recommended.
2. Ensure you have git and github set up on your computer. If you do not, please follow this guide: https://help.github.com/en/github/getting-started-with-github.
3. Clone this repository locally.
4. In your terminal, from inside this project directory, run `npm install` to install the project dependencies.
5. Download and install [MongoDB](https://www.mongodb.com/try/download/community). This project uses the default MongoDB configuration. If you run Mongo in a non-standard way you may need to update the configuration in `index.js` to match. If you have issues, reference the [Mongoose Connection Guide](https://mongoosejs.com/docs/connections.html).
6. Run `npm start` to start your local server. You should see a logged statement telling you `Server is listening on http://localhost:3000`.
7. Download [Postman](https://www.postman.com/) or an API client of your choice. Browse the various endpoints contained in this project. Practice calling all of them and getting 200 HTTP responses.
8. Run the unit tests of this project: `npm test`. Your test output should end in something like this:

```
Test Suites: 1 failed, 1 passed, 2 total
Tests:       8 failed, 52 passed, 60 total
```

### Your Task

We are working on an API for notes. A user should be able to create and access notes, but they should only be able to access their own notes. In order to do that, we will need to identify them using authentication.

We will need routes for a user to signup and login. This will use a `User` model. Then we will need routes for notes that only logged in users can access, which will use a `Note` model. The `User` and `Note` models are provided, but you may want to modify them.

There is a complete set of tests already provided for these two sets of routes. However, there are no routes defined. You will need to write the following routes:

- Auth
  - Signup: `POST /auth/signup`
  - Login: `POST /auth/login`
- Notes (requires authentication)
  - Create: `POST /notes`
  - Get all of my notes: `GET /notes`
  - Get a single note: `GET /notes/:id`

Tests for these routes are in place but mostly failing. Your task is to write the additional route, DAO, and model code that will get these tests passing. Doing so will require the use of the [bcrypt](https://www.npmjs.com/package/bcrypt) library for securely storing passwords and [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for creating JWTs. Please use middleware to enforce authentication on the `/notes` routes.

Once all the provided tests are passing then you should know your code is correct. You should not make any changes to the test files.

## Hints

Below I have outlined the DAO methods I think you will need, as well as some pointers for your routes, middleware, and models.

#### DAOs:

User:

- createUser(userObj) - should store a user record
- getUser(email) - should get a user record using their email

Note:

- createNote(userId, noteObj) - should create a note for the given user
- getNote(userId, noteId) - should get note for userId and noteId (\_id)
- getUserNotes(userId) - should get all notes for userId

#### Routes:

Auth:

- POST /signup - should use bcrypt on the incoming password. Store user with their email and encrypted password, handle conflicts when the email is already in use.
- POST /login - find the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a JWT and return it to the user.

Notes:

- POST / - If the user is logged in, it should store the incoming note along with their userId
- GET / - If the user is logged in, it should get all notes for their userId
- GET /:id - If the user is logged in, it should get the note with the provided id and that has their userId

Middleware

- isLoggedIn(req, res, next) - should check if the user has a valid token and if so make req.userId = the userId associated with that token. The token will be coming in as a bearer token in the authorization header (i.e. req.headers.authorization = 'Bearer 1234abcd') and you will need to extract just the token text. Any route that says "If the user is logged in" should use this middleware function.
- Error handling - router.use(error, req, res, next) - Can be used to handle errors where the provided note id is not a valid ObjectId. This can be done without middleware though.

Models

- A user's email should not appear more than once in your collection (i.e. use a unique index)
- A user should only need an email and password field.

### Grading

| Component                                   | Points |
| ------------------------------------------- | ------ |
| All tests, as originally given, are passing | 60     |
| Passwords are stored and managed securely   | 20     |
| Clear, organized project structure          | 20     |

### Submission

- Accept the assignment in Github Classroom
- Github will automatically create a repository for you to complete your assignment in
- Any changes pushed to the main branch of your repository will be a part of your submission
- A Pull Request is automatically created for your submission and will be where you receive feedback
- Continuous Integration is handled using Github Actions. This will automatically run your tests and show the results on your PR. If you see a red X and a message saying `All checks have failed` then you will not receive full credit. Ensure all tests are passing in order to receive full marks. You can see your automated grade output by clicking on the "Checks" tab of your automated Pull Request. Click on the "Node.js CI" check on the left hand side. Now at the bottom of the page you will see a table with your automatic grade already calculated in a table.
- You do not need to do anything else - as long as you've committed to your repo your assignment will be considered submitted.
