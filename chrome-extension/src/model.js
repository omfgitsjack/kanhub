const SERVER_ROUTE = process.env.REACT_APP_SERVER_ROUTE;
const GITHUB_API_ROUTE = process.env.REACT_APP_GITHUB_API_ROUTE;

function createRequest(method, url, body, jsonreq) {
    var settings = {};

    settings.method = method;
    settings.mode = 'cors';
    settings.credentials = 'include';

    if (jsonreq) {
        settings.headers = new Headers({'Content-Type': 'application/json'});
        settings.body = body ? JSON.stringify(body) : null;
    }

    return new Request(SERVER_ROUTE + url, settings);
}

function createGithubRequest(method, url) {
    var settings = {};

    settings.method = method;
    settings.credentials = 'include';

    return new Request(GITHUB_API_ROUTE + url, settings);
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
    });
}

export function getTeamGroups(data, callback) {
    const getGroups = createRequest('GET', '/api/repository/' + data.repo + '/teams/', null, false);

    Promise.all(createPromises([getGroups]))
    .then((res) => { callback({groups: res[0]}); })
}

export function getTeamMembers(data, callback) {
    const getMembers = createRequest('GET', '/api/repository/' + data.repo + '/teams/' + data.id + '/members/', null, false);

    Promise.all(createPromises([getMembers]))
    .then((res) => {getTeamMembersInfo({ members: res[0]}, callback); })
}

export function createTeamGroup(data, callback) {

    const createGroup = createRequest('POST', '/api/repository/' + data.repo + '/teams', data.rawTeam, true);

    fetch(createGroup)
        .then((resp) => resp.json())
        .then((resp) => callback(resp))
}

export function joinTeamGroup(data, callback) {
    const joinGroup = createRequest('POST', '/api/repository/' + data.repo + '/teams/' + data.id + '/members/', {username: data.username}, true);

    const fetchGroup = fetch(joinGroup)
        .then((res) => { return checkPromise(res); });

    Promise.all([fetchGroup])
    .then((res) => { callback({data: res[0]}); })
}

export function doAuth(callback) {

    const auth = createRequest('GET', '/api/auth/github/', null, false);

    fetch(auth)
        .then((resp) => console.log(resp))
}

export function getTeamMembersInfo(data, callback) {
    
    const requests = data.members.map(function(member) {
        return createGithubRequest('GET', '/users/' + member.username);
    });

    Promise.all(createPromises(requests))
    .then((res) => { callback({members: res}); })
}
