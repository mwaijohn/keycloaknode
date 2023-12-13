import { MemoryStore } from "express-session";
import KeycloakConnect from "keycloak-connect";
import Keycloak, { KeycloakConfig } from 'keycloak-connect';

let _keycloak: KeycloakConnect.Keycloak;

function initKeycloak() {


    const port: any = process.env.KEYCLOAK_PORT;
    const keycloakURL: any = process.env.KEYCLOAK_URL;
    const clientID: any = process.env.KEYCLOAK_CLIENT_ID;
    const realmName: any = process.env.KEYCLOAK_REALM;

    const keycloakConfig: KeycloakConfig = {
        "confidential-port": port,
        "auth-server-url": keycloakURL,
        "bearer-only": true,
        "realm": realmName,
        "ssl-required": "false",
        "resource": clientID
    }
    
    if (_keycloak) {
        console.warn("Trying to init Keycloak again!");
        return _keycloak;
    }
    else {
        //console.log("Initializing Keycloak...");
        var memoryStore = new MemoryStore();
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
}

function getKeycloak() {
    if (!_keycloak) {
        console.error('Keycloak has not been initialized. Please called init first.');
    }
    return _keycloak;
}

// console.log(initKeycloak().middleware());

export { initKeycloak, getKeycloak };