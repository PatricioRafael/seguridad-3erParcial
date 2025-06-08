var interval;
$(document).ready(function () {

    $('#print').click(function () {
        window.print();
        return false;
    });
    var tiempo = GetTimeCloseWindow();
    var reinicio = tiempo;
    var ventana = window;
    var interval = setInterval(function () {
        $('.time').html(GetResCloseWindow() + '<strong> ' + tiempo + ' ' + GetResSeconds() + ' </strong>');
        if (tiempo > 30) {
            if ($("#closeSesionTimeModal").css("display") != "none") {
                $("#closeSesionTimeModal").modal('hide');
            }
        }
        else {
            if ($("#closeSesionTimeModal").css("display") == "none") {
                $("#closeSesionTimeModal").modal('show');
            }
            $('#closeSessionModalCounter').html(tiempo);
        }
        tiempo = tiempo - 1;
        if (tiempo <= 0) {
            clearInterval(interval);
            if ($("#logoutTimeForm").length == 0) {
                window.location = "https://www.bcp.com.bo/";
            }
            else {
                $("#logoutTimeForm").submit();
                window.location = GetRoute('Common', 'ExpiredSession');
            }
        }
    }, 1000);

    $('html').on('click keypress keyup keydown mousedown mouseup scroll resize', '*', function () {
        tiempo = reinicio;
    });
});

(function ($) {   

    $(document).ready(function () {

        function getCookie(name) {
            var dc = document.cookie;
            var prefix = name + "=";
            var begin = dc.indexOf("; " + prefix);
            if (begin == -1) {
                begin = dc.indexOf(prefix);
                if (begin != 0) return null;
            }
            else {
                begin += 2;
                var end = document.cookie.indexOf(";", begin);
                if (end == -1) {
                    end = dc.length;
                }
            }
            return unescape(dc.substring(begin + prefix.length, end));
        }
        function createCookie(name, value) {
            document.cookie = name + '=' + value + '; path=/';
        }

        function deleteCookie(name) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        var timeout = 50;
        var timerobj = window.setInterval(function () {
            var selector_show = "span[class^='skype_c2c_print_container'],span[class*=' skype_c2c_print_container']";
            var selector_hide = "span[class^='skype_c2c_container'],span[class*=' skype_c2c_container']";
            $(selector_show).each(function () {
                var original_number = $(this).text();
                var prev_tag = $(this);
                for (var i = 0; i < original_number.length; i++) {
                    var new_tag = $("<span />").text(original_number[i]).css("display", "inline");
                    prev_tag.after(new_tag);
                    prev_tag = new_tag;
                }
                $(this).remove();
            });
            $(selector_hide).each(function () {
                $(this).remove();
            });
        }, timeout);
        setTimeout(function () {
            clearInterval(timerobj);
        }, 5000);

        $('#language-selector .select').on('click', function () {

            var myCookie = getCookie('_culture');
            createCookie('_culture', $(this).data('value'));
            window.location.reload();
        });

    });
})(jQuery);

$(function () {
    var nua = navigator.userAgent
    var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1)
    if (isAndroid) {
        $('select.form-control').removeClass('form-control').css('width', '100%');
    }
})
