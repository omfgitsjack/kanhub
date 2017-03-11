export function isGist() {
	return location.hostname === 'gist.github.com';
}

export function isRepo() {
	return !isGist() && /^\/[^/]+\/[^/]+/.test(location.pathname);	
}

export function isStandup() {
	return isRepo() && location.hash === "#Standup";
}