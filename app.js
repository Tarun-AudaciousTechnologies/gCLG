const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const http = require('http')
const path = require('path')
require('dotenv').config();
const cors = require("cors")
const routes = require("./src/router")
const {defaultDb} = require("./src/seeder")

;(async () => {
    try {
       await mongoose.connect(process.env.DB_URL, {});
       console.log('Successfully connected database')
       const app = express();
       app.use(cors());
       app.use(bodyParser.urlencoded({extended: false}));
       app.use(bodyParser.json());
       await defaultDb();
       app.use('/docs',express.static(path.join(__dirname, '../documentation')));
       app.use('/api/v1', routes);
       app.use('/uploads',express.static('uploads'))
       const server = http.createServer(app);
       const port = process.env.PORT || 8000;
       server.listen(port).on('listening', () => console.log(`App is starting on port: ${port}`)).on('error', (err) => console.log(`An error occured while starting server`, err))
   } catch (error) {
       console.log(error)
       console.log(`An error is happening with DB URL connection string`)
       process.exit(1);
   };
})();