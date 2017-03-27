import { getUsernameCookie, getTokenCookie,
createRequest, createGithubRequest,
checkPromise, createPromise, createPromises,
getAuthUser } from '../../modelCommon';

export function getTeam(data) {
    const teamReq = createRequest('GET', '/api/repository/' + data.repo + '/teams/' + data.id, null, false);

    return createPromise(teamReq);
}

export function getTeams(data) {
    const getTeams = createRequest('GET', '/api/repository/' + data.repo + '/teams/', null, false);

    return createPromise(getTeams);
}

export function editTeam(data) {
    const editReq = createRequest('PUT', '/api/repository/' + data.repo + '/teams/' + data.id, data.teamEdit, true);

    return createPromise(editReq, true);
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
    const joinTeam = createRequest('POST', '/api/repository/' + data.repo + '/teams/' + data.id + '/members/', null, false);

    return createPromise(joinTeam, true);
}

export function leaveTeam(data) {
    const leaveTeam = createRequest('DELETE', '/api/repository/' + data.repo + '/teams/' + data.id + '/members/' + data.username, null, false);

    return createPromise(leaveTeam, true);
}

export function getTeamStandups(data) {
    const standupReq = createRequest('GET', '/api/repository/' + data.repo + '/teams/' + data.id + '/standups', null, false);

    return createPromise(standupReq);
}

export function getStandupCards(data) {
    const cardReq = createRequest('GET', '/api/repository/' + data.repo + '/teams/' + data.id + '/standups/' + data.standupId + '/cards', null, false);

    return createPromise(cardReq);
}
