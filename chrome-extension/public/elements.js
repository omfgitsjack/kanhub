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

    return {
        getRepoNavBar,
        getRepoContainer,
		createRepoTab,
	};
})();