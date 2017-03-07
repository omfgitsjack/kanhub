function injectResources() {
    const injectDOM = document.createElement('div');
    injectDOM.className = 'inject-react-example';
    injectDOM.style.textAlign = 'center';
    injectDOM.innerHTML = "hello1"
    document.body.appendChild(injectDOM);

    // alert();

    var style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", "chrome-extension://" + chrome.runtime.id + "/style/popup.css");

    document.body.appendChild(style);

}

document.addEventListener('DOMContentLoaded', function () {
    injectResources();
})

