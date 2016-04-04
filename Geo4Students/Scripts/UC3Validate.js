$(document).ready(function(graph, juisteId) {
    $("#DeterminatieValidate").submit(function(e) {
        e.preventDefault();
        alert("intercepted");

        this.submit();
    });
});