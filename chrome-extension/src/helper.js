/* global chrome */
/*
    Some helper functions
*/

export function openNewTab(url) {
    if (chrome.tabs) {
        chrome.tabs.create({ 'url': url }, tab => {

        });
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

export function getUsernameCookie() {
    if (!chrome) {
        return Promise.reject();
    } else {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({op: "getUsernameCookie"}, function(cookie) {
                if (cookie) {
                    resolve(cookie)
                } else {
                    reject()
                }
            });
        })
    }
}

export function getTokenCookie() {
    if (!chrome) {
        return Promise.reject();
    } else {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({op: "getTokenCookie"}, function(cookie) {
                if (cookie) {
                    resolve(cookie)
                } else {
                    reject()
                }
            });
        })
    }
}

// from: http://stackoverflow.com/a/33890907
export function getColorByBgColor(bgColor) {
    if (!bgColor) { return '#000'; }
    return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
}

export function isIssueNumber(text) {
    const result = /#\d+/.exec(text);
    return result;
}