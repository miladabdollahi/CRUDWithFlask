$(document).ready(function () {
    $('a[class="nav-link"]').each(function (index, item) {
        var href = $(item).prop('href');
        if(href == window.location.href) {
            $(item).addClass('active');
            $(item).parent().parent().parent().children().click();
            $(item).parent().parent().parent().children().addClass('active');
        }
    })
});