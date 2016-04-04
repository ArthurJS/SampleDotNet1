$(document).ready(function() {
    var slided = false;
    $("#slideButton").click(function() {
        if (slided == false) {
            $("#navDiv").animate(
            {
                marginLeft: "-240px"
            });
            setTimeout(function() {
                $("#slideButton i").removeClass("fa-caret-square-o-left").addClass("fa-caret-square-o-right");
                $("#navDiv").addClass("slided");
            }, 1100);
            slided = true;

        } else {
            $("#navDiv").animate(
            {
                marginLeft: "-20px"
            });
            setTimeout(function() {
                $("#slideButton i").removeClass("fa-caret-square-o-right").addClass("fa-caret-square-o-left");
            }, 700);
            slided = false;
            $("#navDiv").removeClass("slided");
        }
    });
});