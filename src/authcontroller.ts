import axios from "axios";
import express, { Router, Request, Response } from "express";
import qs from "qs";
import { jwtDecode } from "jwt-decode";


type User = {
    userName: string;
    password: string
}

class AuthResponse {

    accessToken?: string;
    refreshToken?: string;
    authenticated?: boolean;
    failureReason?: string;
    name?: string;
    username?: string;
    roles?: string[];

    constructor(accessToken?: string, refreshTokem?: string, name?: string, username?: string, authenticated?: boolean,
        failureReason?: string, roles?: string[]) {
        this.accessToken = accessToken;
        this.refreshToken = refreshTokem;
        this.username = username;
        this.name = name;
        this.authenticated = authenticated;
        this.failureReason = failureReason;
        this.roles = roles;
    }
}

const AuthRouter: Router = express.Router();

AuthRouter.post("/login", (req: Request, res: Response) => {
    const payload: User = req.body;
    console.log(process.env.KEYCLOAK_CLIENT_ID)
    const data = qs.stringify({
        'client_id': process.env.KEYCLOAK_CLIENT_ID,
        'username': payload.userName,
        'password': payload.password,
        'grant_type': process.env.KEYCLOAK_GRANT_TYPE,
        'client_secret': process.env.KEYCLOAK_CLIENT_SECRET
    });
    console.log(data)
    var config = {
        method: 'post',
        url: process.env.KEYCLOAK_AUTH_URL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios(config)
        .then((response) => {
            const authResponse = response.data;
            const decoded: any = jwtDecode(authResponse.access_token);
            const roles: string[] = decoded['realm_access']['roles'];
            const username = decoded['preferred_username'];
            const name = decoded['name'];
            const resultData: AuthResponse = new AuthResponse(authResponse.access_token,
                authResponse.refresh_token,
                name, username, true, "", roles
            );
            return res.json(resultData)
        })
        .catch((error) => {
            //console.log(error.response)
            return res.send({
                "authenticated": false,
                "failureReason": error
            })
        });
})

AuthRouter.get("test",(requests,response)=>{
});

export default AuthRouter