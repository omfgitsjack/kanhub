import { getUsernameCookie, getTokenCookie,
createRequest, createGithubRequest,
checkPromise, createPromise, createPromises,
getAuthUser } from '../../modelCommon';

export function getTeams(data) {
    const getTeams = createRequest('GET', '/api/repository/' + data.repo + '/teams/', null, false);

    return createPromise(getTeams);
}

export function getTeamMembers(data) {
    const getMembers = createRequest('GET', '/api/repository/' + data.repo + '/teams/' + data.id + '/members/', null, false);

    return createPromise(getMembers);
}

export function getTeamMembersInfo(data) {
    
    return getTokenCookie().then((token) => {
        const requests = data.members.map(function(member) {
            return createGithubRequest('GET', '/users/' + member.username, token);
        });

        return Promise.all(createPromises(requests));
    });

}

export function createTeam(data) {
    const createTeam = createRequest('POST', '/api/repository/' + data.repo + '/teams', data.rawTeam, true);

    return createPromise(createTeam);
}

export function joinTeam(data) {
    
    return getAuthUser().then((user) => {
        const joinTeam = createRequest('POST', '/api/repository/' + data.repo + '/teams/' + data.id + '/members/', {username: user.login}, true);

        return fetch(joinTeam)
            .then((res) => { return checkPromise(res); });
    });

}
