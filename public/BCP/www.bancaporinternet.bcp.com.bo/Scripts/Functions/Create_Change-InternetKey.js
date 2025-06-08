BXI.program.forgotInternetKey = {
    init: function () {
        $('#email-confir').live('cut copy paste', function (e) {
            e.preventDefault();
        });
        $('#reject').click(function () {
            window.location.replace(GetRoute('Account', 'BCPKey'));
        });
        $('#return').click(function () {
            window.location.replace(GetRoute('Account', 'BCPKey'));
        });
    }
}

BXI.program.constancyFIK = {
    init: function () {
        $('#cuentas').click(function () {
            window.location.replace(GetRoute('Account', 'Login'));
        });
    }
}

BXI.program.createInternetKey = {
    init: function () {
        (function () {
            $('#teclado').hide();
            $('#email').val($('#Email').val());
            $('#email-confir').val($('#Email').val());
            $('#Telefono').val($('#Celular').val());
            $('input').not('#reject').attr('disabled', 'disabled');
            $('#return').removeAttr('disabled', 'disabled');
            $('#UserName').removeAttr('disabled', 'disabled');
            $('#VerificationCode').removeAttr('disabled', 'disabled');
            $('#verifica-username').removeAttr('disabled', 'disabled');
            $('#text_pass').removeAttr('disabled', 'disabled');
            $('#text_passconf').removeAttr('disabled', 'disabled');
            $('#acept').attr('disabled', 'disabled');
            $('#antiForgeryToken>input').removeAttr('disabled', 'disabled');
            $('#ClientName').removeAttr('disabled', 'disabled');
            $('#acept').css('display', 'none');
            $('#acept').css('float', 'right');
            $('#deny-contract').click();
            $('select').attr('disabled', 'disabled');
            $('#button-verify-code').removeAttr('disabled', 'disabled');
            setTimeout(function () { $("#UserName").focus(); }, 260);
        })();

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

        $('#email-confir').live("cut copy paste", function (e) {
            e.preventDefault();
        });

        $('#acept-contract').click(function () {
            $('#pin4').show();
            $("#pin4").css("overflow", "visible");
            $('#acept').removeAttr('disabled');
            $('#acept').css('display', 'inline');
        });

        $('#deny-contract').click(function () {
            $("#pin4").hide("slow");
            $('#acept').attr('disabled', 'disabled');
            $('#acept').css('display', 'none');
        });

        $('#reject').click(function () {
            window.location.replace(GetRoute('Account', 'BCPKey'));
        });

        $('#return').click(function () {
            window.location.replace(GetRoute('Account', 'BCPKey'));
        });

        $('#acept').click(function () {
            $('#TipoDocumento').attr('value', $("#ListaTipoDocumento option:selected").text());
            $('#Extension').attr('value', $('#ExtensionTipoDocumento option:selected').val());
        });

        $('#ListaTipoDocumento').change(function () {
            var value = $("#ListaTipoDocumento option:selected").text();
            $('#lbl-cedula').html(value.toLowerCase());
            if (value == "CEDULA DE IDENTIDAD") {
                $('#extension-div').show();
            }
            else {
                $('#extension-div').hide();
            }
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
                //async: false,
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
            var Tarjeta = $('#SendCardNumber').val();
            $.ajax({
                url: GetRoute('Account', 'SendCode'),
                //data: $(".sendajax").serialize(),
                data: {
                    SendNumberCellPhone: Celular,
                    SendEmail: Correo,
                    SendCardNumber: Tarjeta,
                    ResetPassword: false,
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
                $('#formKeyCreate').submit();
            }
        });

        //$("#button-verify-code").click(function (event) {
        //    alert(1);
        //    if ($('#VerificationCode').val() == "") {
        //        cargarErrorPersonal('VerificationCode', resources.ErrorRequiredCode);
        //        event.preventDefault();
        //        return false;
        //    }
        //    else {
        //        var $this = $(this);
        //        var Celular = $('#SendNumberCellPhone').val();
        //        var Correo = $('#SendEmail').val();
        //        var Tarjeta = $('#SendCardNumber').val();
        //        var Codigo = $('#VerificationCode').val();
        //        $.ajax({
        //            url: GetRoute('Account', 'VerifyCode'),
        //            data: {
        //                SendNumberCellPhone: Celular,
        //                SendEmail: Correo,
        //                SendCardNumber: Tarjeta,
        //                PasswordEncrypt: Codigo,
        //            },
        //            type: "post",
        //            async: false,
        //            beforeSend: function () {
        //                $('#button-verify-code').hide();
        //                $('#loadingVerify').show();
        //                $('#VerifyResult').empty();
        //            },
        //            statusCode: {
        //                403: BXI.ajax.Unauthorized
        //            },
        //            success: function (result) {
        //                $('#VerifyResult').html(result);
        //                $('#button-verify-code').show();
        //                $('#VerifyResult').show();
        //            },
        //            complete: function () {
        //                $('#loadingVerify').hide();
        //                //if ($("#VerifyResult").contains("message-notification")) {
        //                //if ($("#VerifyResult>.field-validation-error").contains("message-notification")) {
        //                if ($('#VerifyResult>.message-notification').is(":visible")) {
        //                    //alert('success');
        //                    Desencriptar();
        //                    $('#Data1').show();
        //                    $('#Data2').show();
        //                    $('#button-verify-code').attr('disabled', true);
        //                    $('#button-verify-code').addClass('btn');
        //                    $('#VerificationCode').attr('disabled', true);
        //                    $('#send-code').attr('disabled', true);
        //                    $('#send-code').addClass('btn');
        //                    //$('#CellPhone').val();
        //                    $('#email').val($('#DecryptedEmail').val());
        //                    $('#email-confir').val($('#DecryptedEmail').val());
        //                    $('#Telefono').val($('#DecryptedPhone').val());
        //                    $('#return').hide();
        //                    $('#Data').empty();
        //                }
        //            }
        //        });
        //    }
        //});

        $("#verifica-username").click(function (event) {
            $('#teclado').hide();
            $('#UserName').attr('value', $.trim($('#UserName').val()));
            $('input').not('#reject').attr('disabled', 'disabled');
            $('#UserName').removeAttr('disabled', 'disabled');
            $('#verifica-username').removeAttr('disabled', 'disabled');
            if ($('#UserName').val() != "") {
                $("#verifica-username").hide();
                $('#loading').show();
                event.preventDefault();
                $.ajax({
                    url: GetRoute('Account', 'VerificaNombreUsuario'),
                    type: "post",
                    dataType: "json",
                    data: {
                        nombreUsuario: $("#UserName").val(),
                        ipClient: $("#IpCliente").val(),
                        __RequestVerificationToken: $('#antiForgeryToken [name="__RequestVerificationToken"]').val()
                    },
                    success: function (result) {
                        $("#UserName").removeAttr('disabled', 'disabled');
                        $('#verifica-username').removeAttr('disabled', 'disabled');
                        $('#loading').hide();
                        $("#verifica-username").show();
                        if (result.Codigo == GetUSR01()) {
                            $('span[data-valmsg-for="UserName"]').removeClass('field-validation-error');
                            $('span[data-valmsg-for="UserName"]').html("<span class='field-validation-error verifica-error'>" + result.Mensaje + "</span>");
                        }
                        else {
                            if (result.Codigo == GetOk000()) {
                                $('span[data-valmsg-for="UserName"]').removeClass('field-validation-error');
                                $('span[data-valmsg-for="UserName"]').html("<span class='message-notification verifica-error'>" + result.Mensaje + "</span>")
                                $('#teclado').show();
                                $('input').removeAttr('disabled', 'disabled');
                                $('select').removeAttr('disabled', 'disabled');
                                $('#verify-user-msg').hide();
                                $('#Telefono').attr('readonly', true);
                                $('#email').attr('readonly', true);
                                $('#email-confir').attr('readonly', true);
                            }
                            else {
                                $('span[data-valmsg-for="UserName"]').removeClass('field-validation-error');
                                $('span[data-valmsg-for="UserName"]').html("<span class='field-validation-error verifica-error'>" + result.Mensaje + "</span>");
                            }
                        }
                    },
                    statusCode: {
                        403: BXI.ajax.Unauthorized
                    },
                    complete: function (xhr, textStatus) {
                        if (textStatus != "error") {
                            $('#panel-2 .login').height($('#panel-1 .login').height());
                            $('#panel-2 .login .box').height($('#panel-1 .login .box').height());
                        }
                    }
                });
            }
            else {
                $('span[data-valmsg-for="UserName"]').html(GetRequiredUserName());
                $('span[data-valmsg-for="UserName"]').addClass('field-validation-error');
                $('span[data-valmsg-for="UserName"]').removeClass('field-validation-valid');
                $("#verifica-username").show();
                setTimeout(function () { $('.verifica-error').hide(); }, 2000);
            }
        });
    }
}

BXI.program.constancyCIK = {
    init: function () {
        (function () {
            $('form').submit(function (event) {
                $('#descarga').hide();
                setTimeout(function () {
                    cargando(1);
                }, 1);
            });
        })();
        $('#cuentas').click(function () {
            window.location.replace(GetRoute('Account', 'Login'));
        });

        $("#reject").click(function (evt) {
            $("#SendConstancy").hide("slow");
            $("#constancia").show("slow");
        });
    }
}