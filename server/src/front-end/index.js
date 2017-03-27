var url = "https://chrome.google.com/webstore/detail/peacnodjjlhhodekaiafamddcgpjnbdo"

window.onload = function() {
    var showInstructions = false;
    
    document.getElementById('download').onclick = function(e) {
        showInstructions = true;

        chrome.webstore.install(url, function() {
            if (showInstructions) {
                document.getElementById('instructions').style.display = "block";
            }    
        }, function(err) {
            console.log(err)
        })
    }
}