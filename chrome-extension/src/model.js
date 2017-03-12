const SERVER_ROUTE = process.env.REACT_APP_SERVER_ROUTE;

function createRequest(method, url, body, jsonreq) {
    var settings = {};

    settings.method = method;
    settings.mode = 'cors';

    if (jsonreq) {
        settings.headers = new Headers({'Content-Type': 'application/json'});
        settings.body = body ? JSON.stringify(body) : null;
    }

    return new Request(SERVER_ROUTE + url, settings);
}

function checkPromise(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function createPromises(requests) {
    return requests.map(function(req) {
        return fetch(req)
                .then((res) => { return checkPromise(res); })
                .then((res) => res.json())
                .catch((err) => console.log('Fetch error: ' + err));
    });
}

export function getTeamGroups(data, callback) {
    const getGroups = createRequest('GET', '/api/repository/' + data.repo + '/teams/', null, false);

    Promise.all(createPromises([getGroups]))
    .then((res) => { callback({groups: res[0]}); })
    .catch((err) => console.log("promise error: " + err));
}

export function getTeamMembers(data, callback) {
    const getMembers = createRequest('GET', '/api/repository/' + data.repo + '/teams/' + data.id + '/members/', null, false);

    Promise.all(createPromises([getMembers]))
    .then((res) => { callback({members: res[0]}); })
    .catch((err) => console.log("promise error: " + err));
}

export function createTeamGroup(data, callback) {

    const createGroup = createRequest('POST', '/api/repository/' + data.repo + '/teams', data.rawTeam, true);

    fetch(createGroup)
        .then((resp) => resp.json())
        .then((resp) => callback(resp))
        .catch((err) => console.log(err));
}

export function joinTeamGroup(data, callback) {
    const joinGroup = createRequest('POST', '/api/repository/' + data.repo + '/teams/' + data.id + '/members/', {username: "wow"}, true);

    Promise.all(createPromises([joinGroup]))
    .then((res) => { callback({data: res[0]}); })
    .catch((err) => console.log("promise error: " + err));
}
