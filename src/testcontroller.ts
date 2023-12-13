import express,{Router,Request,Response} from 'express';
import { initKeycloak } from './keycloak-config';


const keycloak = initKeycloak();


const TestControlRouter: Router = express.Router();

TestControlRouter.get('/anonymous',  keycloak.protect('realm:bankingly_checker'),function(req: Request, res: Response){
    res.send("Hello Anonymous");
});
TestControlRouter.get('/user', function(req: Request, res: Response){
    res.send("Hello User");
});

TestControlRouter.get('/admin', function(req: Request, res: Response){
    res.send("Hello Admin");
});

TestControlRouter.get('/all-user', function(req: Request, res: Response){
    res.send("Hello All User");
});

export  default TestControlRouter;