![](/screenshots/main.png)

# Travel App Project

This project is for Udacity's [Front End Web Developer Nanodegree Program](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011). It provides information about the trip the user wants to visit and helps them in planning their trip.

## Getting started

### Prerequisites

In this project we are using Node development environment. Node.js and the Node Package Manager (NPM) should be installed on the local machine.

### Installing

To setup local development environment, clone this repo on your machine, navigate to its location in the terminal and run the command:

```
npm install
```

## Environment Variables

```
PORT = the http port of the production mode to listen on. (Default: 3000)

GOENAMES_USERNAME = the username for Geonames account used to integrate with the Geonames API

WEATHERBIT_API_KEY = an API KEY used to integrate with the Weatherbit API

PIXABAY_API_KEY = an API KEY used to integrate with the Pixabay API
```

There are example environment variables in .env.example that you can copy into .env.

## Running the project

### Development mode

To start the development webpack server on port 8080, navigate to project's location in the terminal and run:

```
npm run dev
```

### Production mode

To start the express server (default port 3000), navigate to project's location in the terminal and run:

```
npm run build
```

After that,

```
npm run start
```

## Technologies

| Tech                                    | Description                                           |
| --------------------------------------- | ----------------------------------------------------- |
| [Node.js](https://nodejs.org/en/)       | JavaScript runtime for the backend                    |
| [Express](https://expressjs.com/)       | Server framework                                      |
| [Axios](https://github.com/axios/axios) | Promise based HTTP client for the browser and node.js |
| [Webpack](https://webpack.js.org/)      | Asset bundler                                         |
| [Sass](https://sass-lang.com/)          | Style preprocessor                                    |
| [Jest](https://jestjs.io/)              | Unit testing framework                                |

## Screenshots

### Search for a destination

Users can search for any destination in the world to get some information that will help them in planning their trip

![](/screenshots/search.gif)

### Save trip feature

Users can save the trip information on the local storage so that when they revisit the page, their information is still there

![](/screenshots/save.gif)

### Delete trip feature

Users can delete the trip information from the local storage

![](/screenshots/delete.gif)

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE) file for details
