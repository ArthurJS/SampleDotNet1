$(document).ready(function() {
    $("#jaarSelect").appendTo("#navDiv");
    $("#veranderJaar, #slideButton").toggle();
    $("#navDiv ul li").each(function(i) {
        $(this).hide();
    });
    $("#boodschap").html("<h3>Welkom!</h3>");
    $("#navDiv").removeClass("left").addClass("center");
    $("#button").click(function(e) {
        e.preventDefault();
        $("#navDiv").removeClass("center");
        $("#navDiv").addClass("left");
        setTimeout(function() {
            $("#testForm").submit();
        }, 600);
    });
});