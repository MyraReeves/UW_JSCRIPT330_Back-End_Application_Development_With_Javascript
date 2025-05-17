# Week 7

This week is an exercise in sever-side rendering with Express. 

## Learning Objectives

At the end of this week, a student should:
- have implemented a simple server-side rendered front end
- use a database to determine the content of the rendered HTML 

## The assignment

The assignment this week is designed to get you to build a simple server-side rendered project. You will build a simple weather app that takes in a location name from a user and then displays a page with the temperature for that location, if available.

### Getting started

1. Make sure you have a recent version of [Node.js](https://nodejs.org/en/download/) installed on your computer. I am using Node v18, but anything above 18 will be fine.
2. Ensure you have git and github set up on your computer. If you do not, please follow this guide: https://help.github.com/en/github/getting-started-with-github.
3. Clone this repository locally locally. 
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

We are building a simple weather application, complete with front end interactions. Here are the routes you will need:

- Landing
  - Hello World: `GET /landing/` - a simple Hello, World page
- Weather
  - Landing: `GET /weather` - get a web page that allows you to enter a location name in a form for submission
  - Location: `GET /weather/location?name=<location name>` - get the temperature for a provided location using a `weather` mongo collection.

There is a `Weather` model provided. Please use it to get temperature data. You do not need to create an API for populating this collection, but you may want to create records manually for local development and testing.
  
Tests for these routes are in place but failing. Your task is to write the additional route, DAO, and model code that will get these tests passing. Doing so will require the use of the [mustache-express](https://www.npmjs.com/package/mustache-express) library (this uses [mustache](https://github.com/janl/mustache.js) under the hood), and is already installed. If you're feeling adventurous, you're also welcome to try using the [react-dom/server](https://react.dev/reference/react-dom/server) library. Either library should give you the ability to render HTML and get the tests to pass.

Once all the provided tests are passing then you should know your code is correct. You should not make any changes to the test files.

### Grading

Component | Points
--------- | --------
All tests, as originally given, are passing | 80
Clear, organized project structure | 20

### Submission

- Accept the assignment in Github Classroom
- Github will automatically create a repository for you to complete your assignment in
- Any changes pushed to the main branch of your repository will be a part of your submission
- A Pull Request is automatically created for your submission and will be where you receive feedback
- Continuous Integration is handled using Github Actions. This will automatically run your tests and show the results on your PR. If you see a red X and a message saying `All checks have failed` then you will not receive full credit. Ensure all tests are passing in order to receive full marks. You can see your automated grade output by clicking on the "Checks" tab of your automated Pull Request. Click on the "Node.js CI" check on the left hand side. Now at the bottom of the page you will see a table with your automatic grade already calculated in a table.
- You do not need to do anything else - as long as you've committed to your repo your assignment will be considered submitted.