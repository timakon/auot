$(function () {
    let flag = true;
    $('.switch-button').on('click', function (e) {
        e.preventDefault();

        $('input').val('');


        if(flag){
            flag = false;
            $('.register').show('fast');
            $('.login').hide();
        } else {
            flag = true;
            $('.login').show('fast');
            $('.register').hide();
        }
    });

    $('input').on('focus', function () {
        $('p.error').remove();
        $('input').removeClass('error-inputs');
        $('.login-button').removeClass('error-login-button');
    })

    $('button').on('click', function () {
        $('p.error').remove();
        $('input').removeClass('error-inputs');
        $('.login-button').removeClass('error-login-button');
    })


    $('.register-button').on('click', function (e) {
        e.preventDefault();

        var data = {
            login: $('#register-login').val(),
            password: $('#register-password').val(),
            passwordConfirm: $('#register-password-confirm').val()
        };
        $.ajax({
            type:'POST',
            data:JSON.stringify(data),
            contentType:'application/json',
            url:'/auth/register'
        }).done(function (data) {
            if(!data.ok){
               $('.register h4').after('<p class="error">' + data.error + '</p>');
               $('.login-button').addClass('error-login-button');
               if(data.fields){
                   data.fields.forEach(function (item) {
                       $('input[name=' + item + ']').addClass('error-inputs');
                   })
               }
            } else {
                //$('.register h4').after('<p class = "success">Отчлично</p>');
                $(location).attr('href', '/user');
            }
        })
    });
    $('.login-button').on('click', function (e) {
        e.preventDefault();

        var data = {
            login: $('#login-login').val(),
            password: $('#login-password').val(),
        };
        $.ajax({
            type:'POST',
            data:JSON.stringify(data),
            contentType:'application/json',
            url:'/auth/login'
        }).done(function (data) {
            if(!data.ok){
                $('.login h4').after('<p class="error">' + data.error + '</p>');
                $('.login-button').addClass('error-login-button');
                if(data.fields){
                    data.fields.forEach(function (item) {
                        $('input[name=' + item + ']').addClass('error-inputs');
                    })
                }
            } else {
                //$('.login h4').after('<p class = "success">Отчлично</p>');
                //console.log(userId)
                $(location).attr('href', `/user`);

            }
        })
    });
});
