BXI.program.login = {
    init: function () {
        (function () {
            //$("#login #captcha").attr("src", GetRoute('Account', 'CaptchaImage') + "?nocache" + Math.random());
            $("#login #txtcaptcha").attr("value", "");
            setTimeout(function () { $("#login #UserName").focus(); }, 260);
            $("#login #refresh").click(function () {
                $("#login #captcha").attr("src", GetRoute('Account', 'Captcha') + '/login?'+Math.random());
            });
        })();

        $("#login #send").click(function (event) {
            BXI.util.ClearValidationSummary();
            //VALIDACION DE LONGITUD DE CARACTERES DEL PASSWORD
            if ($("#Password").val().length < 7) {
                BXI.util.AddSumaryError("PassErrorv", GetErrorLengthPassword());
                $('#_Password').focus();
                event.preventDefault();
                return;
            }
            else {
                $('#form-login').submit();
                localStorage.removeItem('logout');
            }
            return (false);
        });
    }
}