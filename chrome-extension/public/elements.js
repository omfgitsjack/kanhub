window.elements = (() => {

    createTab = (label, icon, dataSelectedLinks) => {
        let newTab = document.createElement('div');
        newTab.innerHTML = `
            <a href="/" class="js-selected-navigation-item reponav-item" data-selected-links=${dataSelectedLinks}>
                ${icon}
                ${label}
            </a>
        `;

        return newTab;
    };

    return {
		createTab,
	};
})();