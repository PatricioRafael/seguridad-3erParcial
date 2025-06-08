BXI.program.forgottenKey = {
    init: function () {
        $("#Pass1").removeClass("col-md-8");
        $("#Pass1").addClass("col-md-12");
        $("#Pass2").removeClass("col-md-8");
        $("#Pass2").addClass("col-md-12");

        $('#continue').attr('disabled', 'disabled');
        $('#continue').css('display', 'none');
        $('#continue').css('float', 'right');
        $("#loginForm #txtcaptcha").val("");
        $('#antiForgeryToken>input').removeAttr('disabled', 'disabled');
        

        $("#loginForm #refresh").click(function () {            
            $("#loginForm #captcha").attr("src", GetRoute('Account', 'Captcha') + '/change?' + Math.random());
        });

        $("#loginForm #send").click(function () {
            $("#loginForm #lblcaptcha").hide();

            BXI.util.ClearValidationSummary();
            var captcha = $('#loginForm #txtcaptcha').val();
            $.ajax({
                url: GetRoute("Account", "ValidateCaptcha"),
                data: { 'captcha': captcha, '__RequestVerificationToken': $('#antiForgeryToken [name="__RequestVerificationToken"]').val() },
                type: 'POST',
                success: function (res) {
                    if (res) {
                        $('#loginForm form').submit();
                    }
                    else {                        
                        $("#loginForm #txtcaptcha").val("");
                        $('#loginForm .validation-summary-valid').removeClass('validation-summary-valid').addClass('validation-summary-errors');
                        $('#loginForm .validation-summary-errors ul').empty();
                        $('#loginForm .validation-summary-errors ul').append('<li>' + GetErrorCaptcha() + '</li>');
                    }
                }
            });
            return (false);
        });

        var limpiarErrores = function () {
            $('.field-validation-error').html('');
            $('.field-validation-error').removeClass('field-validation-error');
            $('.field-validation-error').addClass('field-validation-valid');
        }

        var cargarErrorPersonal = function (atributo, mensaje) {
            var $fieldError = $('[data-valmsg-for="' + atributo + '"]');
            $fieldError.html('<span for="' + atributo + '" generated="true">' + mensaje + '</span>');
            $fieldError.removeClass('field-validation-valid');
            $fieldError.addClass('field-validation-error');
            $('#' + atributo.replace('.', '_')).focus();
        }

        var limpiarErrorPersonal = function (atributo) {
            var $fieldError = $('[data-valmsg-for="' + atributo + '"]');
            $fieldError.html('');
            $fieldError.removeClass('field-validation-error')
            $fieldError.addClass('field-validation-valid')
        }

        $('#reject').click(function () {
            window.location.replace(GetRoute('Account', 'BCPKeyForgotten'));
        });

        $('#acept').click(function () {
            window.location.replace(GetRoute('Account', 'Login'));
        });

        $('#return').click(function () {
            window.location.replace(GetRoute('Account', 'BCPKeyForgotten'));
        });

        var Desencriptar = function () {
            var Celular = $('#SendNumberCellPhone').val();
            var Correo = $('#SendEmail').val();
            $.ajax({
                url: GetRoute('Account', 'DecryptData'),
                //data: $(".sendajax").serialize(),
                data: {
                    SendNumberCellPhone: Celular,
                    SendEmail: Correo,
                },
                type: "post",
                async: false,
                beforeSend: function () {
                    $('#Data').empty();
                },
                statusCode: {
                    403: BXI.ajax.Unauthorized
                },
                success: function (result) {
                    $('#Data').html(result);
                },
                complete: function () {

                }
            });
        }

        $("#send-code").click(function (event) {
            var $this = $(this);
            var Celular = $('#SendNumberCellPhone').val();
            var Correo = $('#SendEmail').val();
            var Usuario = $('#ClientName').val();
            //alert(Celular + Correo + Usuario)
            $.ajax({
                url: GetRoute('Account', 'SendCode'),
                //data: $(".sendajax").serialize(),
                data: {
                    SendNumberCellPhone: Celular,
                    SendEmail: Correo,
                    ResetPassword: true,
                    ClientName: Usuario,
                },
                type: "post",
                beforeSend: function () {
                    $('#send-code').hide();
                    $('#loadingSend').show();
                    $('#SendResult').empty();
                },
                statusCode: {
                    403: BXI.ajax.Unauthorized
                },
                success: function (result) {
                    $('#SendResult').empty();
                    $('#SendResult').html(result);
                    $('#send-code').show();
                    $('#SendResult').show();
                    $this.hide();
                    var cad = parseInt($this.data('time'));
                    var timeShowButton = setInterval(function () {
                        cad--;
                        if (cad < 1) {
                            $this.show();
                            $('#message-verification-code').hide();
                            clearInterval(timeShowButton);
                        }

                        $('#time').html(cad);
                    }, 1000);
                    //$('#ModelDescripcionServicio').val($('#DescripcionServicio').val());
                },
                complete: function () {
                    $('#loadingSend').hide();
                    $('#Data').empty();
                    if ($('#SendResult>.message-notification').is(":visible")) {
                    }
                    else {
                        $this.show();
                    }
                }
            });
        });

        $("#button-verify-code").click(function (event) {
            event.preventDefault();
            if ($('#VerificationCode').val() == "") {
                cargarErrorPersonal('VerificationCode', resources.ErrorRequiredCode);
                return false;
            }
            else {
                $('#SendCardNumber').removeAttr('disabled', 'disabled');
                $('#SendEmail').removeAttr('disabled', 'disabled');
                $('#SendNumberCellPhone').removeAttr('disabled', 'disabled');
                $('#formKeyReset').submit();
            }
        });
    }
};