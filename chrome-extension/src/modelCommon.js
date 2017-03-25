const SERVER_ROUTE = process.env.REACT_APP_SERVER_ROUTE;
const GITHUB_API_ROUTE = process.env.REACT_APP_GITHUB_API_ROUTE;

export function getUsernameCookie() {
    return new Promise((resolve, reject) => {
        try {
            chrome.runtime.sendMessage({op: "getUsernameCookie"}, function(cookie) {
                if (cookie) {
                    resolve(cookie);
                } else {
                    reject();
                }
            });
        } catch (e) {
            return reject(e);
        }
    })
}

export function getTokenCookie() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({op: "getTokenCookie"}, function(cookie) {
            if (cookie) {
                resolve(cookie);
            } else {
                reject();
            }
        });
    })
}


export function createRequest(method, url, body, jsonreq) {
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

export function createGithubRequest(method, url, token) {

    var settings = {};

    settings.method = method;
    settings.credentials = 'include';

    if (token) {
        settings.headers = new Headers({'Authorization': 'token ' + token});
    }

    return new Request(GITHUB_API_ROUTE + url, settings);
}

export function checkPromise(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

export function createPromise(request, notJson) {
    return fetch(request)
        .then((res) => { return checkPromise(res); })
        .then((res) => { return notJson ? res : res.json() });
}

export function createPromises(requests) {
    return requests.map(function(req) {
        return createPromise(req);
    });
}

export function logout() {
    return createPromise(createRequest('GET', '/api/auth/logout', null, false), true)
}

export function getAuthUser() {
    return getTokenCookie().then((token) => {
        const getUser = createGithubRequest('GET', '/user', token);

        return createPromise(getUser);
    });
}

export function authKanhub() {
    const authReq = createRequest('GET', '/api/auth/github', null, false);

    return createPromise(authReq, true);
}

export function getSocketToken() {
    const tokenReq = createRequest('GET', '/api/auth/socket', null, false);

    return createPromise(tokenReq);
}

export function getRepoIssues(data) {

    const label = data.label ? '/issues?labels=' + data.label + '&' : '/issues?';

    return getTokenCookie().then((token) => {
        const issueReq = createGithubRequest('GET', '/repos/' + data.owner + '/' + data.repo + label + 'state=all', token);

        return createPromise(issueReq);
    });
}

export function getRepoLabels(data) {

    return getTokenCookie().then((token) => {
        const labelReq = createGithubRequest('GET', '/repos/' + data.owner + '/' + data.repo + '/labels', token);

        return createPromise(labelReq);
    });
}

export function getSingleLabel(data) {
    
    return getTokenCookie().then((token) => {
        const labelReq = createGithubRequest('GET', '/repos/' + data.owner + '/' + data.repo + '/labels/' + data.label, token);

        return createPromise(labelReq);
    });
}