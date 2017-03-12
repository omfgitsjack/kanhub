export function isGist() {
	return location.hostname === 'gist.github.com';
}

export function isRepo() {
	return !isGist() && /^\/[^/]+\/[^/]+/.test(location.pathname);	
}

export function getLocationHash() {
	const location = /^#[^\?]*/.exec(window.location.hash);
	return location && location[0];
}

export function getQuery() {
	const query = /\?(.*)/.exec(window.location.hash);
  	return query && query[1];
}

export function changeLocationHash(location) {
	window.location.hash = location;
}

// function from: http://stackoverflow.com/a/8649003
// queryString eg. abc=123&def=w&thx=jak
export function queryToObject(queryString) {
    return queryString ? JSON.parse('{"' + queryString.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                 function(key, value) { return key === "" ? value:decodeURIComponent(value) }) : {};
}


