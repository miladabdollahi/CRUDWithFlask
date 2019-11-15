var create_likes = function () {
    $('.create_like_btn').each(function (index, item) {
        $(item).off('click');
        $(item).on('click', function (event) {
            event.preventDefault();
            $.ajax({
                type: $(item).attr('method'),
                url: $(item).attr('action'),
                data: $(item).serialize(),
                success: function (data) {
                    $('.like_of_post').each(function (index, item) {
                        if ($(item).attr('value') == data['post_id']) {
                            if (data['liked']) {
                                $(item).next().children().next().text('پسندیدم (' + data["number_of_likes"] + ')')
                                $(item).next().children(':first').removeClass('far').addClass('fas');
                            } else {
                                $(item).next().children().next().text('پسندیدم (' + data["number_of_likes"] + ')')
                                $(item).next().children(':first').removeClass('fas').addClass('far');
                            }
                        }
                    });
                }
            });
        });
    });
}

var create_comments = function () {
    $('.create_comments_btn').each(function (index, item) {
        $(item).off('click');
        $(item).on('click', function (event) {
            event.preventDefault();
            $.ajax({
                type: $(item).parent().parent().attr('method'),
                url: $(item).parent().parent().attr('action'),
                data: $(item).parent().parent().serialize(),
                success: function (data) {
                    $('.post_card').each(function (index, item) {
                        var local_post_id = $(item).find('.post_id').attr('value');
                        var response_post_id = $($.parseHTML(data)[3]).attr('value');
                        if (local_post_id == response_post_id) {
                            var response_card = $($.parseHTML(data)[5]);
                            response_card.insertBefore($(item).find('.create_comments_btn').prev().prev());
                            $(item).find('.create_comments_btn').prev().prev().val('');
                            $(item).find('.show_comments_btn').children('span').text('نظرات (' + $($.parseHTML(data)[1]).attr('value') + ')')
                            delete_comments();
                        }
                    });
                }
            });
        });
    });
}


var delete_comments = function () {
    $('.delete_comments').each(function (index, item) {
        $(item).off('click');
        $(item).on('click', function (event) {
            event.preventDefault();
            $.ajax({
                type: $(item).attr('method'),
                url: $(item).attr('action'),
                data: $(item).serialize(),
                success: function (data) {
                    $('.comment_id').each(function (index, item) {
                        if ($(item).attr('value') == data['comment_id']) {
                            var post = $(item).parents().eq(6);
                            post.find('.show_comments_btn').children('span').text('نظرات (' + data['number_of_comments'] + ')');
                            $(item).parent().remove();
                        }
                    });
                }
            });
        });
    });
}

var delete_posts = function () {
    $('.delete_posts').each(function (index, item) {
        $(item).off('click');
        $(item).on('click', function (event) {
            event.preventDefault();
            $.ajax({
                type: $(item).attr('method'),
                url: $(item).attr('action'),
                data: $(item).serialize(),
                success: function (data) {
                    $('.post_id').each(function (index, item) {
                        if ($(item).attr('value') == data['post_id']) {
                            $(item).parent().remove();
                        }
                    });
                }
            });
        });
    });
}


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
        if (user.loading) {
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

    $('.load_image_btn').on('click', function () {
        $('input[name="image"]').click();
    });

    $('.load_sound_btn').on('click', function () {
        $('input[name="sound"]').click();
    });

    $('.load_video_btn').on('click', function () {
        $('input[name="video"]').click();
    });

    $('.show_comments_btn').each(function (index, item) {
        $(item).on('click', function (event) {
            event.preventDefault();
            $(item).blur();
            $(this).parent().parent().next().next().next().toggle();
        });
    });
    var last_page = parseInt($('.number_of_pages').text());

    if (last_page)
        $('.posts_container').infiniteScroll({
            path: function () {
                var next_page = this.loadCount + 2;
                if (next_page <= last_page) {
                    return '?_page=' + next_page;
                }
            },
            append: '.post_card',
            history: false,
            prefill: true
        });

    create_comments();
    create_likes();
    delete_comments();
    delete_posts();

    $('.posts_container').on('append.infiniteScroll', function () {
        $('.show_comments_btn').each(function (index, item) {
            $(item).off('click');
            $(item).on('click', function (event) {
                event.preventDefault();
                $(item).blur();
                $(this).parent().parent().next().next().next().toggle();
            })
        });

        create_comments();
        create_likes();
        delete_comments();
        delete_posts();
    });

    $("input[name='image']").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.image_preview').attr('src', e.target.result);
                $("input[name='sound']").val('');
                $("input[name='video']").val('');
                $('.image_preview').css('display', 'unset');
                $('.sound_preview').css('display', 'none');
                $('.video_preview').css('display', 'none');
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    $("input[name='sound']").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.sound_preview').children(':first').attr('src', e.target.result);
                $("input[name='image']").val('');
                $("input[name='video']").val('');
                $('.sound_preview').css('display', 'unset');
                $('.image_preview').css('display', 'none');
                $('.video_preview').css('display', 'none');
                $('.sound_preview')[0].load();
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    $("input[name='video']").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.video_preview').children(':first').attr('src', e.target.result);
                $("input[name='image']").val('');
                $("input[name='sound']").val('');
                $('.video_preview').css('display', 'unset');
                $('.image_preview').css('display', 'none');
                $('.sound_preview').css('display', 'none');
                $('.video_preview')[0].load();
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
});
