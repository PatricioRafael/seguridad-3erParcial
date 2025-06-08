(function () {
    var getBrowserInfo = function () {
        var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    };
    $(document).ready(function () {
        var expReg_IE11     = /IE 11/;
        var expReg_IE       = /MSIE/;
        var expReg_FireFox  = /Firefox/;
        var expReg_Safari   = /Safari/;
        if (getBrowserInfo().match(expReg_IE)) {            
            $('#header').addClass('header_IE9');
            $('ol.carousel-indicators').css('top', '250px');
            $('#results-area-table').css({
                'padding-left': '5px'
            });
        }        
        else if (getBrowserInfo().match(expReg_IE11)) {
            $('ol.carousel-indicators').css('top', '250px');
            $('.form-input--tall').css('padding', '0px 4px');
        }
        else if (getBrowserInfo().match(expReg_FireFox)) {
            $('.short-month').css({
                'margin-left'     : '-50px',
                'float'           : 'right',
                'margin-top'      : '10px',
                'padding-right'   : '5px'
            });

            $('#Monto,#Glosa,.form-input').css({
                'height'    : '30px',
                'padding'   : '0'
            });

            $('#results-area-table').css({
                'padding-left': '5px'
            });
        }
        else if (getBrowserInfo().match(expReg_Safari)) {
            $('#header').addClass('header_IE9');
            //$('.form-control').css({
            //    'font-size': '15px'
            //});
            //$('input,label,a,button,li,.centrarTextoLogin,.importante__foot-note,.descripcion').css({
            //    'font-size': '15px'
            //});
            //$('span,input,label,a,button,li,p,strong,.centrarTextoLogin,.importante__foot-note').css({
            //    'font-family': 'flexodemi'
            //});
            document.body.style.fontFamily = 'flexodemi';
            $('.select.ibk-tooltip,.ui-selectmenu-menu-item-header,a').css({
                'font-family': 'flexodemi'
            });
            $('.month-icon').css('display', 'compact');
            //$('.productSideSubMenu li a').hide();
            $('.pointer').click(function () {
                $('.productSideSubMenu li a').hide();
                $('.productSideSubMenu li a').show('fast');
            });
            
        }
    });    
})();
