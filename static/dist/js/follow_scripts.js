$(document).ready(function () {
    $('.select2bs4').select2({
        placeholder: "جستجوی افراد",
        theme: 'bootstrap4',
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: '/username_search/',
            dataType: 'json',
            delay: 500,
        },
        templateResult: search_result
    });

    function search_result(user) {
        if(user.loading){
            return '';
        }

        var container = $('<div class="user_search_div"><div class="user_search_panel_avatar"></div><span class="user_search_fullname"></span></div>');
        $(container).find('.user_search_panel_avatar').css('background-image', 'url("' + user.avatar + '")');
        $(container).find('.user_search_fullname').text(user.text);
        return container
    }

    $('.select2bs4').on('select2:select', function (e) {
        window.location.href = '/user/' + e.params.data.id + '/';
    });
});