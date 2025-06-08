var token = navigator.userAgent.toString();
var trident = token.indexOf('Trident');
if ($.browser.msie && trident < 0) {
    window.location = GetRoute("Common", "Unsupported");
}

window.onload = function () {
    cargando();
}

window.onbeforeunload = function () {
    saliendo();
};

function cargando(anadido) {
    var fondo = $('#fondo');
    fondo.height('100%');
    fondo.width('100%');
    $('#load').hide();
};

function saliendo() {
    $('#load').show();
    clearInterval(interval);
};

$(function () {    
    setInterval(function () {
        if ($('.icon-new').hasClass('on')) {
            $('.icon-new').removeClass('on');
        } else {
            $('.icon-new').addClass('on');
        }
    }, 500);
});

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
};

function createCookie(name, value) {
    document.cookie = name + '=' + value + '; path=/';
};

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};