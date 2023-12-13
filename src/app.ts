import express, { Application } from 'express';
import { initKeycloak } from './keycloak-config';
import session, { MemoryStore } from 'express-session';
import bodyParser from 'body-parser';
import TestController from './testcontroller'
import AuthRouter from './authcontroller';


var cors = require('cors')
//configure log4js

// dotenv.config()
const memoryStore = new MemoryStore()
const keycloak = initKeycloak();


const app: Application = express();
app.use(cors());
app.use(bodyParser.json());

//configure session
const mySession = {
    secret: 'thescret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}

app.use(session(mySession));
//configure keycloak
app.use(keycloak.middleware());


app.use("/user", AuthRouter)
app.use("/test", TestController)


app.listen(process.env.RUNNING_PORT, () => {
    console.warn(`Started application: ${process.env.RUNNING_PORT}`);
});


// node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/.env dotenv_config_debug=true
