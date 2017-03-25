import { getUsernameCookie, getTokenCookie,
createRequest, createGithubRequest,
checkPromise, createPromise, createPromises,
getAuthUser } from '../../modelCommon';

export function getAllUserInfo(data) {
    
    return getTokenCookie().then((token) => {
        const requests = data.users.map(function(username) {
            return createGithubRequest('GET', '/users/' + username, token);
        });

        return Promise.all(createPromises(requests));
    });

}

export function getUserInfo(data) {
    return getTokenCookie().then((token) => {
        const userReq = createGithubRequest('GET', '/users/' + data.username, token);

        return createPromise(userReq);
    });
}

export function getUserTeams(data) {
    const teamReq = createRequest('GET', '/users/' + data.username, null, false);

    return createPromise(teamReq);
}
