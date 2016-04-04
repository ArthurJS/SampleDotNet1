$(document).ready(function() {
    $(".toggleButton").click(function() {
        var clicked = $(this);
        if (!clicked.hasClass("slided")) {
            slideUpCustom(clicked);
        } else {
            slideDownCustom(clicked);
        }
    });

});

function slideUpCustom(clicked) {
    clicked.parents(".mainContent").find(".content").children().css("opacity", "0");
    clicked.parents(".mainContent").find(".content").slideUp(800);
    setTimeout(function() {
        clicked.removeClass("fa-caret-square-o-up").addClass("fa-caret-square-o-down");
    }, 800);
    clicked.addClass("slided");
}

function slideDownCustom(clicked) {
    clicked.parents(".mainContent").find(".content").slideDown(800);
    setTimeout(function() {
        clicked.parents(".mainContent").find(".content").children().css("opacity", "1");
        clicked.removeClass("fa-caret-square-o-down").addClass("fa-caret-square-o-up");
    }, 800);
    clicked.removeClass("slided");
}