window.onload = function() {
    var showInstructions = false;
    
    document.getElementById('download').onclick = function(e) {
        showInstructions = true;

        if (showInstructions) {
            document.getElementById('instructions').style.display = "block";
        }
    }
}