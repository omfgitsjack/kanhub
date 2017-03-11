window.elements = (() => {

    getRepoNavBar = () => {
        return $('.reponav.js-repo-nav');
    };

    getRepoContainer = () => {
        return $('.container.new-discussion-timeline.experiment-repo-nav');
    };
   
    createRepoTab = (label, icon, url, customClass) => {
        return $(`
            <a href=${url} class="js-selected-navigation-item reponav-item ${customClass}">
                ${icon}
                ${label}
            </a>
        `);
    };

    createRepoContent = () => {
        return $('<div class="repository-content"></div>');
    };

    createSubNav = () => {
        return $('<nav class="subnav"></nav>');
    };

    createSubNavTab = (label, url, customClass) => {
        return $(`
            <a href=${url} class="js-selected-navigation-item subnav-item ${customClass}" role="tab">
                ${label}
            </a>
        `);
    };

    return {
        getRepoNavBar,
        getRepoContainer,
		createRepoTab,
        createRepoContent,
        createSubNav,
        createSubNavTab
	};
})();