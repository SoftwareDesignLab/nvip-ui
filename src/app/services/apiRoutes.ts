import { environment } from '../../environments/environment';

/** Tomcat web backend endpoint name when deploying WAR file */
export const apiURL: string = environment.ApiUrl;
/** proxy routes to each web backend servlet */
export const Routes = {
    vulnerability: apiURL + '/vulnerability',
    cve: apiURL + '/cve',
    ssvc: apiURL + '/ssvc',
};
