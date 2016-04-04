$(document).ready(function() {
    $("#testForm").submit(function(e) {
        e.preventDefault();
        alert("intercepted");
        $("#jaarSelect").detach();
        $("#navDiv ul li a").each(function(i) {
            $(this).show();
        });
        $("#navDiv").removeClass("center");
        $("#navDiv").addClass("left");
        this.submit();
    });
});