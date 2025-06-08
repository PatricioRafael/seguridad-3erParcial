BXI.program.cardAuthentication = {
    blurCard: function () {
        var oculto = $('#card').val();
        var tarj = $('#txtcardnumber').val();
        if (oculto.indexOf('••••••••••••') == -1)
            $("#txtcardnumber").attr("value", oculto);
        else
            if (oculto.substring(12, 16) != tarj.substring(12, 16))
                $("#txtcardnumber").attr("value", tarj.substring(0, 12) + oculto.substring(12, 16));
        if (oculto.length == 16) {
            oculto = "••••••••••••" + oculto.substring(12, 16);
            $("#card").attr("value", oculto);
        }
    },


    init: function () {
        var _cardLogin = Object.create(BXI.program.cardAuthentication);
        (function () {
            $("#txtcaptcha").val("");
            if ($("#txtcardnumber").val().length == 16) {
                $("#card").attr("value", $("#txtcardnumber").val());
                _cardLogin.blurCard();
            }


            $("#refresh").click(function () {
                $("#captcha").attr("src", GetRoute('Account', 'Captcha') + '/create?' + Math.random());
            });
        })();


        $("#card").blur(function () {
            _cardLogin.blurCard();
        });

        $('#card').keypress(function (event) {
            //return BXI.util.IsNumberKey(event)  
            var KeyID = event.keyCode || event.charCode;
            if (KeyID == 8 || KeyID == 46 || KeyID == 9)
                return true; //expcion de las teclas backspace y supr
            else {
                var teclaCHAR = String.fromCharCode(KeyID);
                if (/^([0-9])*$/.test(teclaCHAR)) { //POR VERDAD:Es numero                                                                                         
                    return true;
                } else {//POR FALSO: No es numero                      
                    return false;
                }
            }
        });

    }
}
