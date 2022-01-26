## Technologies used
* **Backend**: TypeScript, Node.js, Express.js
* **Frontend** Pug template engine, SCSS
* **Database** MongoDB, Mongoose
* **Cloud** Google Cloud Platform - Places API, Static Maps API
* **Test** Jest, SuperTest
* **Auth and Session** Passport.js, session with MongoStore, Flash
* **Tools** Webpack, Airbnb Eslint, Docker, Docker-Compose

## To run

```shell
mv .env.example .env # then fill env variables with your own GCP key and DB credentials
npm install
docker-compose up --build
```
server will start on localhost with the PORT given in .env file
g
