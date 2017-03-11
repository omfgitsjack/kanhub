window.detectPage = (() => {
	const isGist = () => location.hostname === 'gist.github.com';

	const isRepo = () => !isGist() && /^\/[^/]+\/[^/]+/.test(location.pathname);

	return {
		isGist,	
		isRepo,
	};
})();