jQuery(document).ready(function() {
    $("#jaarSelect").detach();
    $("#veranderJaar").show();
    $("#slideButton").show();
    $("#boodschap").show();
    $("#navDiv ul li a").each(function(i) {
        $(this).show();
    });
});