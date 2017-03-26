
import Peer from 'peerjs';

var getUsernameCookie = function (cb) {
    chrome.cookies.get({
        url: process.env.REACT_APP_SERVER_ROUTE,
        name: 'kh_username'
    }, cb)
}

var getTokenCookie = function (cb) {
    chrome.cookies.get({
        url: process.env.REACT_APP_SERVER_ROUTE,
        name: 'kh_github_token'
    }, cb)
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        if (request.op === 'getUsernameCookie') {
            getUsernameCookie(function (cookie) {
                console.log("GOT THE userCOOKIE", cookie);
                sendResponse(cookie ? cookie.value : null)
            })
        } else if (request.op === 'getTokenCookie') {
            getTokenCookie(function (cookie) {
                console.log("GOT THE tokenCOOKIE", cookie);
                sendResponse(cookie ? cookie.value : null)
            })
        } else if (request.op === 'streamVoice') {
            let username = request.username,
                peer = new Peer(username, { host: process.env.REACT_APP_HOST, port: 9000, path: '/', secure: true }),
                otherUser = username === 'omfgitsjack' ? 'omfgtsalex' : 'omfgitsjack';

            peer.on('open', function (id) {
                console.log('My peer ID is: ' + id);

                if (otherUser === 'omfgtsalex') {
                    var conn = peer.connect(otherUser);
                    conn.on('error', err => {
                        console.log("failed to connect to alex");
                    })
                    conn.on('open', function () {
                        console.log('sending hi to ', otherUser);
                        conn.send('hi!');
                    });

                    // var getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                        var call = peer.call(otherUser, stream);
                        call.on('stream', function (remoteStream) {
                            // Show stream in some video/canvas element.
                            console.log('getting something back..');

                            var audio = new Audio();
                            audio.src = window.URL.createObjectURL(remoteStream);
                            audio.onloadedmetadata = function (e) {
                                console.log("playing audio!");
                                audio.play();
                            }

                            // var mediaStreamSource = audioContext.createMediaStreamSource(remoteStream);
                            // mediaStreamSource.connect(audioContext.destination);
                        });
                        call.on('error', err => console.log(err));
                    }, function (err) {
                        console.log('Failed to get local stream', err);
                    });
                } else {
                    peer.on('connection', function (conn) {
                        conn.on('data', function (data) {
                            // Will print 'hi!'
                            console.log(data, 'from ', otherUser);
                        });
                    });

                    // var getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    peer.on('call', function (call) {
                        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                            call.answer(stream); // Answer the call with an A/V stream.
                            call.on('stream', function (remoteStream) {
                                // Show stream in some video/canvas element.

                                var audio = new Audio();
                                audio.src = window.URL.createObjectURL(remoteStream);
                                audio.onloadedmetadata = function (e) {
                                    console.log("playing audio!");
                                    audio.play();
                                }
                            });
                        }, function (err) {
                            console.log('Failed to get local stream', err);
                        });
                    });
                }
            })

            // let stream = request.stream;

            // var audio = new Audio();
            // audio.src = stream;
            // audio.onloadedmetadata = function(e) {
            //     console.log("playing audio!");
            //     audio.play();
            // }
        }

        return true; // need this to indicate that we're going to respond in async
    });