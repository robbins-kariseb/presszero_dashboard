import { API_REFERENCE, API_TOKEN } from "./api.controller";

export default class Users  {
    signIn = async ({password, username}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": username,
            "password": password
        });
          
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/user/authentication`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }
}