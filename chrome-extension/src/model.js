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
    if (response.status > 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function toJson(response) {
    return response.json;
}

function createPromises(requests) {
    return requests.map(function(req) {
        fetch(req)
            .then(checkPromise)
            .then(toJson)
            .catch(function(err) {
                console.log("Fetch error: " + err);
            });
    });
}

export function getTeamGroup(data, callback) {
    var getGroups = createRequest('GET', '/api/repo/' + data.repo + '/groups', false);
    var getGroupData = createRequest('GET', '/api/repo/' + data.repo + '/group/' + data.groupId, false);

    const requests = [getGroups, getGroupData];
    const promises = createPromises(requests);

    Promise.all(promises)
        .then(function(responses) {
            console.log(responses);
        })
        .catch(function(err) {
            console.log(err);
        });
};