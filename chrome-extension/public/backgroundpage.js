
var getUsernameCookie = function(cb) {
    chrome.cookies.get({
        url: 'https://localhost:8080',
        name: 'kh_username' }, cb)
}

var getTokenCookie = function(cb) {
    chrome.cookies.get({
        url: 'https://localhost:8080',
        name: 'kh_github_token' }, cb)
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    if (request.op === 'getUsernameCookie') {
        getUsernameCookie(function(cookie) {
            console.log("GOT THE userCOOKIE", cookie);
            sendResponse(cookie ? cookie.value: null)
        })
    } else if (request.op === 'getTokenCookie') {
        getTokenCookie(function(cookie) {
            console.log("GOT THE tokenCOOKIE", cookie);
            sendResponse(cookie ? cookie.value : null)
        })
    }

    return true; // need this to indicate that we're going to respond in async
});