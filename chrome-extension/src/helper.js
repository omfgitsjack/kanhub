/* global chrome */
/*
    Some helper functions
*/

export function openNewTab(url) {
    if (chrome.tabs) {
        chrome.tabs.create({ 'url': url});
    } else {
        window.open(url, '_blank');
    }
}

export function getExtension(path) {
    if (chrome.extension) {
        return chrome.extension.getURL(path);
    }

    return path;
}
