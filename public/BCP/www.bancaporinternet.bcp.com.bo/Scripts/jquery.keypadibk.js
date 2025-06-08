(function ($) {
    $.fn.extend({
        keypadibk: function (options) {
            var defaults = {
                meterPassword: '#password',
                maxLength: 20,
                minLength: 7,
                minValue: 31,
                message: {
                    weak: "Débil",
                    medium: "Medio",
                    strong: "Fuerte",
                    errorCompareKey: 'El password y su confirmación son distintos'
                }
            };
            var options = $.extend(defaults, options);

            var layout = {
                'name': "Spanish",
                'keys': [
				  [["1", "1"], ["2", '2'], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["0", "0"]],
				  [["q", "Q"], ["w", "W"], ["e", "E"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"]],
				  [["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u00f1", "\u00d1"]],
				  [[["Abc", "ABC", "abc"], "shift"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], ["\u232b", "bksp"]],
                ],
                'lang': ["es"]
            };

            var $password = $('[data-field-type=password]');
            var $passwordConfirm = $('[data-field-type=confirm_password]');
            if (options.password) {
                $password = $(options.password);
            }

            if (options.passwordConfirm) {
                $passwordConfirm = $(options.passwordConfirm);
            }

            var isValidationActive = false;

            var layoutProgressBar = '<div class="row"><div class="panel-bar-progress col-md-10"><div class="progress">';
            layoutProgressBar += '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
            layoutProgressBar += '<span class="text-strength"></span></div></div>';
            layoutProgressBar += '</div></div>'

            var buildRowKeyPad = function (array, shiftState) {
                var html = '<tr>';
                var isMayus = shiftState == 1 || shiftState == 2 ? 1 : 0;
                $.each(array, function (index, value) {
                    if (value[1] == 'shift') {
                        var _class = ' ';
                        if (shiftState == 1) {
                            _class += 'active';
                        } else if (shiftState == 2) {
                            _class += 'mayusc';
                        }
                        html += '<td class="shift' + _class + '">' + value[0][shiftState] + '</td>';
                    } else if (value[1] == 'bksp') {
                        html += '<td class="bksp">' + value[0] + '</td>'
                    } else {
                        html += '<td>' + value[isMayus] + '</td>'
                    }
                });
                html += '</tr>';
                return html;
            }

            var buildKeyPad = function ($container, shiftState) {
                $container.html('');
                $.each(layout.keys, function (index, value) {
                    if (value != undefined) {
                        $container.append('<table>' + buildRowKeyPad(value, shiftState) + '</table>');
                    }
                });
            }

            var getToPoint = function (word) {
                var mask = '';
                for (var i = 0; i < word.length; i++) {
                    mask = mask + unescape('%u25CF');
                }
                return mask;
            }

            var getPointWithLetter = function (word) {
                var mask = '';
                for (var i = 0; i < word.length - 1; i++) {
                    mask = mask + unescape('%u25CF');
                }
                return word.length > 0 ? mask + word[word.length - 1] : '';
            }

            var waitpreview = null;
            var returnFocus = null;
            var statewaiting = 0;

            var clearTimer = function () {
                clearInterval(waitpreview);
                clearInterval(returnFocus);
            }
            var manageWritingPreview = function ($inputpwd) {
                $inputfake = $('#_' + $inputpwd.attr('id'));
                if (statewaiting == 1) {
                    clearTimer();
                    statewaiting = 0;
                }
                if (statewaiting == 0) {
                    $inputfake.val(getPointWithLetter($inputpwd.val()));
                    statewaiting = 1;
                    waitpreview = setTimeout(function () {
                        $inputfake.val(getToPoint($inputpwd.val()));
                        statewaiting = 0;
                    }, 1000);
                    //returnFocus = setTimeout(function () {
                    //    $inputfake.focus();
                    //}, 1001);
                }

                return $inputfake;
            }


            var createBarMenterPassword = function () {
                $(options.meterPassword)
            }

            var getValuePassword = function (password) {
                var IsMin = function (c) {
                    if (c.match(/[a-z]/)) return true;
                    return false;
                }
                var IsMay = function (c) {
                    if (c.match(/[A-Z]/)) return true;
                    return false;
                }
                var IsNum = function (c) {
                    if (c.match(/[0-9]/)) return true;
                    return false;
                }

                var multiplicadores =
                {
                    tamanoCadena: 1,
                    mayusculas: 3,
                    minusculas: 3,
                    numeros: 3
                };

                var positionLastUC = -1,
                positionLastLC = -1,
                positionLastNumber = -1,
                nConsecutiveCharType = 0,
                nNumber = 0,
                nAlphaUC = 0,
                nAlphaLC = 0,
                nRepChar = 0,
                nReqChar = 0,
                nMinPwdLen = 0,
                nSequencedChar = 0,
                nMinDiferentChar = 0,

                sAlphaUC = 3,
                sAlphaLC = 3,
                sNumber = 3,
                sConsecutiveCharType = 1,
                sConsecutiveChar = 0,
                sTotalConsecutiveChar = 0,
                sSequence = 0,
                sTotalSequence = 0,
                sNegative = 0,
                diferentChar = "",
                //cadena = el.val();
                cadena = password,
                score = cadena.length * multiplicadores.tamanoCadena;

                //Control de caracteres individual

                for (var a = 0; a < cadena.length; a++) {
                    if (diferentChar.indexOf(cadena[a]) < 0) {
                        diferentChar += cadena[a];
                    }

                    if (cadena[a].match(/[0-9]/g)) {
                        if (positionLastNumber == a - 1 && positionLastNumber > -1) {
                            nConsecutiveCharType++;
                        }
                        positionLastNumber = a;
                        nNumber++;
                    }
                    else if (cadena[a].match(/[A-Z,Ñ]/g)) {
                        if (positionLastUC == a - 1 && positionLastUC > -1) {
                            nConsecutiveCharType++
                        }
                        positionLastUC = a;
                        nAlphaUC++;
                    }
                    else if (cadena[a].match(/[a-z,ñ]/g)) {
                        if (positionLastLC == a - 1 && positionLastLC > -1) {
                            nConsecutiveCharType++
                        }
                        positionLastLC = a;
                        nAlphaLC++;
                    }
                }

                for (i = 0; i < cadena.length - 2; i++) {
                    if (cadena[i] == cadena[i + 1] && cadena[i + 1] == cadena[i + 2]) {
                        if (nRepChar == 0) nRepChar = 3;
                        else nRepChar++;

                        sConsecutiveChar = parseInt(nRepChar * cadena.length / 2);

                        if (nRepChar > Math.ceil(cadena.length / 4)) {
                            sConsecutiveChar = sConsecutiveChar * 4;
                        }
                        if (i + 1 < cadena.length - 2) {
                            if (cadena[i + 2] != cadena[i + 3]) {
                                sTotalConsecutiveChar += sConsecutiveChar;
                                nRepChar = 0;
                            }
                        }
                        else {
                            nRepChar = 0;
                            sTotalConsecutiveChar += sConsecutiveChar;
                        }
                    }
                }

                for (i = 0; i < cadena.length - 2; i++) {
                    if ((IsMin((cadena[i]).toLowerCase()) && IsMin((cadena[i + 1]).toLowerCase()) && IsMin((cadena[i + 2]).toLowerCase())) || (IsNum(cadena[i]) && IsNum(cadena[i + 1]) && IsNum(cadena[i + 2]))) {
                        if (((cadena[i]).charCodeAt() - (cadena[i + 1]).charCodeAt()) == ((cadena[i + 1]).charCodeAt() - (cadena[i + 2]).charCodeAt()) && Math.abs((cadena[i]).charCodeAt() - (cadena[i + 1]).charCodeAt()) == 1) {
                            if (nSequencedChar == 0) nSequencedChar = 3;
                            else nSequencedChar++;

                            sSequence = nSequencedChar * cadena.length / 2;

                            if (nSequencedChar > Math.ceil(cadena.length / 4)) {
                                sSequence = sSequence * 4;
                            }
                            if (i + 1 < cadena.length - 2) {
                                if (((cadena[i + 1]).charCodeAt() - (cadena[i + 2]).charCodeAt()) != ((cadena[i + 2]).charCodeAt() - (cadena[i + 3]).charCodeAt())) {
                                    sTotalSequence += sSequence;
                                    nSequencedChar = 0;
                                }
                            }
                            else {
                                nSequencedChar = 0;
                                sTotalSequence += sSequence;
                            }
                        }
                    }
                }

                if (nAlphaUC > 0 && nAlphaUC < cadena.length) {
                    score = score + ((cadena.length - nAlphaUC) * sAlphaUC);
                }
                if (nAlphaLC > 0 && nAlphaLC < cadena.length) {
                    score = score + ((cadena.length - nAlphaLC) * sAlphaLC);
                }
                if (nNumber > 0 && nNumber < cadena.length) {
                    score = score + ((cadena.length - nNumber) * sNumber);
                }

                if (nNumber > 0) nReqChar++;
                if (nAlphaUC > 0) nReqChar++;
                if (nAlphaLC > 0) nReqChar++;

                score = score + nReqChar * 4;

                if (score > 100) score = 100;
                else if (score < 0) score = 0;

                if (nConsecutiveCharType > 0) {
                    score = score - (nConsecutiveCharType * sConsecutiveCharType);
                    sNegative += (nConsecutiveCharType * sConsecutiveCharType);
                }
                if (sTotalSequence > 0) {
                    score = score - sTotalSequence;
                    sNegative += sTotalSequence;
                }
                if (sTotalConsecutiveChar > 0) {
                    score = score - sTotalConsecutiveChar;
                    sNegative += sTotalConsecutiveChar;
                }

                if (nAlphaLC == cadena.length || nAlphaUC == cadena.length || nNumber == cadena.length) {
                    score += cadena.length * 2;
                }

                score = score > 100 ? 100 : score;
                score = score < 0 ? 0 : score;

                nMinDiferentChar = Math.ceil(cadena.length / 2);

                if (cadena.length < options.minLength || nReqChar < 2) {
                    score /= 2;
                }
                else if (cadena.length > options.maxLength) {
                    score /= 4;
                }
                else if (diferentChar.length < nMinDiferentChar) {
                    score /= 2;
                    if (score >= options.minValue) {
                        score = options.minValue - 1;
                    }
                }
                score = parseInt(score);

                if (cadena.length <= 0) {
                    score = 5;
                }

                ultimalongitud = cadena.length;
                ultimoscore = score;

                score = score > 98 ? 98 : score;
                score = score < 5 ? 5 : score;
                return score;
            }

            var measuringPassword = function (password) { }

            var activeValidateEqualPassword = function ($container) {
                return $container.find('input[data-field-type="password"]').val().length <= $container.find('input[data-field-type="confirm_password"]').val().length;
            }

            var isEqualsPasswordAndConfirmation = function ($container) {
                return $container.find('input[data-field-type="password"]').val() == $container.find('input[data-field-type="confirm_password"]').val();
            }

            var loadError = function (atributo, mensaje) {
                var $fieldError = $('[data-valmsg-for="' + atributo + '"]');
                $fieldError.html('<span for="' + atributo + '" generated="true">' + mensaje + '</span>');
                $fieldError.removeClass('field-validation-valid');
                $fieldError.addClass('field-validation-error');
                $('#' + atributo.replace('.', '_')).focus();
            }

            var cleanError = function (atributo) {
                var $fieldError = $('[data-valmsg-for="' + atributo + '"]');
                $fieldError.html('');
                $fieldError.removeClass('field-validation-error')
                $fieldError.addClass('field-validation-valid')
            }

            this.each(function () {
                var $this = $(this);
                var shiftState = 0;
                $this.append('<div class="keyboard-container margin-top" style="display:none;"><div class="keyboardMaster keyboardSize2"><div class="containerKeypad"></div></div></div>');

                buildKeyPad($this.find('.containerKeypad'), shiftState);
                $this.find('.keyboardMaster').prepend('<div class="lupas"><div id="mas" class="lupa-mas ibk-tooltip" title="Ampliar Teclado" data-placement="right" data-toggle="tooltip"></div><div id="menos" class="lupa-menos ibk-tooltip" title="Reducir Teclado" data-placement="right" data-toggle="tooltip"></div></div>');
                if (!$this.find('input[type=radio]').is('checked')) {
                    $this.find('input[type=radio]:first').attr('checked', 'checked');
                }

                $this.find('#' + $this.find('input[type=radio]:checked').attr('data-input')).addClass('inputactive');

                var validateConfirmPassword = function () {
                    if (isValidationActive) {
                        if (!isEqualsPasswordAndConfirmation($this)) {
                            loadError($passwordConfirm.attr('id'), options.message.errorCompareKey);
                        } else {
                            cleanError($passwordConfirm.attr('id'));
                        }
                    } else {
                        cleanError($passwordConfirm.attr('id'));
                    }
                }


                $this.find('input').each(function (index, value) {
                    var $input = $(this);
                    var $fakeinput = $('<input type="text" id="_' + $(this).attr('id') + '" class="form-control input-without-x fake-input" maxlength="20" autocomplete="off" style="display:none;" ' + ($this.data('is-mobile') ? 'readonly=readonly' : '') + ' />');
                    if ($(this).is(':radio')) {
                        $(this).click(function () {
                            if ($('#_' + $(this).attr('data-input')).is(':visible')) {
                                $('#_' + $(this).attr('data-input')).focus();
                            } else {
                                $('#' + $(this).attr('data-input')).focus();
                            }
                        });
                    }
                    if ($(this).is(':password') || $(this).is(':text')) {
                        //$this.on('keyup, keydown, keypress', 'input:password, input:text', function (event) {
                        //    event.preventDefault();
                        //});

                        //$fakeinput.on('keypress, keyup, keydown', function (event) {
                        //    event.preventDefault();
                        //    return null;
                        //});

                        $(this).before($fakeinput);

                        if ($this.data('is-mobile')) {
                            //$input.show();
                            //$fakeinput.hide();
                            $('#_Password').attr('readonly', false);
                            $("#_Password").hide();
                            $("#Password").show();
                            $("#Password").prop({ type: "password" });
                        } else {
                            //$input.hide();
                            //$fakeinput.show();

                            $('#_Password').attr('readonly', false);
                            $("#_Password").show();
                            $("#Password").hide();
                        }


                        


                        $fakeinput.on('focus, blur', function () {
                            $('#_' + $this.find('input.inputactive').attr('id')).val(function () {
                                return getToPoint($(this).val());
                            });
                            $this.find('input').removeClass('inputactive');
                            $('input[data-input="' + $input.attr('id') + '"]').attr('checked', 'checked');
                            $input.addClass('inputactive');
                        });

                        //$fakeinput.focus(function () {
                        //    $('#_' + $this.find('input.inputactive').attr('id')).val(function () {
                        //        return getToPoint($(this).val());
                        //    });
                        //    $this.find('input').removeClass('inputactive');
                        //    $('input[data-input="' + $input.attr('id') + '"]').attr('checked', 'checked');
                        //    $input.addClass('inputactive');
                        //});


                        $input.focus(function () {
                            $this.find('input').removeClass('inputactive');
                            $('input[data-input="' + $input.attr('id') + '"]').attr('checked', 'checked');
                            $input.addClass('inputactive');
                        });

                        $this.find('input[type="password"]:first').addClass('inputactive');

                        if (/chrome/.test(navigator.userAgent.toLowerCase()) || $.browser.msie) {
                            $fakeinput.on('keydown', function (e) {
                                if (e.which == 46) {
                                    return false;
                                }
                            });
                        }

                        $fakeinput.on('keyup', function (e) {
                            //clearTimer();
                            e.preventDefault();
                            //if (e.which == 46) {
                            //    return;
                            //}
                            var $popover = null;
                            if (e.which == 8) {
                                clearTimer();
                                $this.find('input.inputactive').val(function () {
                                    //$('#_' + $(this).attr('id')).val(getToPoint($(this).val().substring(0, $(this).val().toString().length - 1)));
                                    $('#_' + $(this).attr('id')).val(getToPoint($('#_' + $(this).attr('id')).val()));
                                    //return $(this).val().substring(0, $(this).val().toString().length - 1);                                    
                                    return $(this).val().substring(0, $('#_' + $(this).attr('id')).val().length);
                                });
                                $popover = $('#' + $('#_' + $this.find('input.inputactive').attr('id')).attr('aria-describedby'));
                                if ($popover) {                                    
                                    measuringPassword($this.find('input.inputactive').val(), $popover);
                                }
                            }

                            if ($this.find('input.inputactive').val().length <= 0) {
                                if ($popover) {
                                    $popover.hide();
                                }
                            }
                        });

                        //}

                        var validarletra = function (letra) {
                            var l = String.fromCharCode(letra);
                            if (l == '\u00f1' || l == '\u00D1' || /[A-Za-z0-9-!#$%&'()*+,-./:;=?@[\]^_{}]/.test(l)) {
                                return true;
                            }
                            return false;
                        }

                        //$fakeinput.keypress(function (e) {
                        /*****************************key android****************************/

                        $fakeinput.on('keypress', function (e) {
                            
                            // e.preventDefault();
                            if (!e.ctrlKey) {
                                e.preventDefault();
                                if (e.which == 0) {
                                    return;
                                } if (e.which == 8) {
                                    clearTimer();
                                    $this.find('input.inputactive').val(function () {
                                        $('#_' + $(this).attr('id')).val(getToPoint($(this).val().substring(0, $(this).val().toString().length - 1)));
                                        //$('#_' + $(this).attr('id')).val(getToPoint($('#_' + $(this).attr('id')).val()));
                                        return $(this).val().substring(0, $(this).val().toString().length - 1);
                                        //return $(this).val().substring(0, $('#_' + $(this).attr('id')).val().length);
                                    });
                                    $popover = $('#' + $('#_' + $this.find('input.inputactive').attr('id')).attr('aria-describedby'));
                                    if ($popover) {
                                        measuringPassword($this.find('input.inputactive').val(), $popover);
                                    }
                                } else {

                                    var key = String.fromCharCode(e.which);
                                    if ($this.find('input.inputactive').val().length >= options.maxLength) {
                                        return;
                                    }
                                    if (!validarletra(e.which)) {
                                        return;
                                    }

                                    $this.find('input.inputactive').val(function () {
                                        return $(this).val() + key;
                                    });

                                    manageWritingPreview($this.find('input.inputactive'));

                                    if ($(options.meterPassword).hasClass('inputactive')) {
                                        $popover = $('#' + $('#_' + $this.find('input.inputactive').attr('id')).attr('aria-describedby'));
                                        $('#_' + $(options.meterPassword).attr('id')).on('shown.bs.popover', function () {
                                            $popover = $('#' + $('#_' + $this.find('input.inputactive').attr('id')).attr('aria-describedby'));
                                            measuringPassword($this.find('input.inputactive').val(), $popover);
                                        });
                                        if (!$popover.is(':visible')) {
                                            $('#_' + $(options.meterPassword).attr('id')).popover('show');
                                        }
                                        if ($popover) {
                                            measuringPassword($this.find('input.inputactive').val(), $popover);
                                        }
                                    }
                                }

                                if (!isValidationActive) {
                                    if ($this.find('input[type="password"]').length > 1) {
                                        if ($password.val().length > 0 && $password.val().length <= $passwordConfirm.val().length) {
                                            isValidationActive = true;
                                        }
                                    }
                                }

                                if ($this.find('input.inputactive').val().length <= 0) {
                                    $popover.hide();
                                }

                                validateConfirmPassword();
                            }
                        });

                        $input.on('keyup', function (e) {
                            if ($(options.meterPassword).hasClass('inputactive')) {
                                $popover = $('#' + $('#' + $this.find('input.inputactive').attr('id')).attr('aria-describedby'));
                                if (!$popover.is(':visible')) {
                                    $('#' + $(options.meterPassword).attr('id')).popover('show');
                                }
                                if ($popover) {
                                    measuringPassword($this.find('input.inputactive').val(), $popover);
                                }
                            }

                            if (!isValidationActive) {
                                if ($this.find('input[type="password"]').length > 1) {
                                    if ($password.val().length > 0 && $password.val().length <= $passwordConfirm.val().length) {
                                        isValidationActive = true;
                                    }
                                }
                            }

                            validateConfirmPassword();
                        });
                    }
                });

                $('.btn-showkeyboard').click(function () {
                    //var $inputfake = $('#_' + $('input.inputactive').attr('id'));
                    //$inputfake.val(getToPoint($('input.inputactive').val()));
                    $this.find('input[type=password]').each(function () {
                        $e = $(this);
                        var $inputfake = $('#_' + $e.attr('id'));
                        $inputfake.val(getToPoint($e.val()));
                    });
                    $('.popover').hide();

                    var $thisbtn = $(this);
                    if ($thisbtn.data('state') != 'press') {
                        $thisbtn.addClass('btn-showkeyboard-press');
                        $thisbtn.data('state', 'press');
                        $('.keyboard-container').show();
                        if ($this.data('is-mobile')) {
                            //$inputfake.show();
                            $this.find('.fake-input').show();
                            //$('input.inputactive').hide();
                            $this.find('input[type=password]').hide();
                        }
                        $thisbtn.attr('data-original-title', $thisbtn.data('title-inactive'))
                        $('#' + $thisbtn.attr('aria-describedby') + ' .tooltip-inner').html($thisbtn.data('title-inactive'));
                    } else {
                        $thisbtn.removeClass('btn-showkeyboard-press');
                        $thisbtn.removeData('state');
                        $('.keyboard-container').hide();
                        if ($this.data('is-mobile')) {
                            $this.find('.fake-input').hide();
                            $this.find('input[type=password]').show();
                        }
                        $thisbtn.attr('data-original-title', $thisbtn.data('title-active'))
                        $('#' + $thisbtn.attr('aria-describedby') + ' .tooltip-inner').html($thisbtn.data('title-active'));
                    }
                });


                if ($(options.meterPassword).length > 0) {
                    $('#_' + $(options.meterPassword).attr('id'))
                        .attr('data-container', 'body')
                        .attr('data-toggle', 'popover')
                        .attr('data-placement', 'right')
                        .attr('data-selector', 'right')
                        //.attr('data-title', '<span class="text-strength">&nbsp</span><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
                        .attr('data-content', layoutProgressBar)
                        .attr('data-html', true);

                    $('#' + $(options.meterPassword).attr('id'))
                        .attr('data-container', 'body')
                        .attr('data-toggle', 'popover')
                        .attr('data-placement', 'right')
                        .attr('data-selector', 'right')
                        //.attr('data-title', '<span class="text-strength">&nbsp</span><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
                        .attr('data-content', layoutProgressBar)
                        .attr('data-html', true);

                    measuringPassword = function (password, $popover) {
                        var cleanBarProgress = function () {
                            $popover.find('.panel-bar-progress .progress-bar').removeClass('progress-bar-invalid progress-bar-acceptable progress-bar-valid');
                        }
                        var valuePassword = getValuePassword(password);
                        if (valuePassword < options.minValue) {
                            cleanBarProgress();
                            $popover.find('.panel-bar-progress .progress-bar').addClass('progress-bar-invalid').attr('aria-valuenow', valuePassword).css('width', valuePassword + '%');
                            $popover.find('.text-strength').html(options.message.weak);
                        }
                        else if (valuePassword < options.acceptValue) {
                            cleanBarProgress();
                            $popover.find('.panel-bar-progress .progress-bar').addClass('progress-bar-acceptable').attr('aria-valuenow', valuePassword).css('width', valuePassword + '%');
                            $popover.find('.text-strength').html(options.message.medium);
                        }
                        else if (valuePassword >= 98) {
                            cleanBarProgress();
                            $popover.find('.panel-bar-progress .progress-bar').addClass('progress-bar-valid').attr('aria-valuenow', valuePassword).css('width', valuePassword + '%');
                            $popover.find('.text-strength').html(options.message.strong);
                        }
                        else {
                            cleanBarProgress();
                            $popover.find('.panel-bar-progress .progress-bar').addClass('progress-bar-valid').attr('aria-valuenow', valuePassword).css('width', valuePassword + '%');
                            $popover.find('.text-strength').html(options.message.strong);
                        }
                    }
                }
                $this.find('input').val('');

                $this.on('click', '.keyboardMaster td', function () {
                    $td = $(this);
                    $('#_' + $this.find('input.inputactive').attr('id')).focus();
                    var $popover = $('#' + $('#_' + $this.find('input.inputactive').attr('id')).attr('aria-describedby'));
                    if ($(this).hasClass('shift')) {
                        if (shiftState == 0) {
                            shiftState = 1;
                        }
                        else if (shiftState == 1) {
                            shiftState = 2;
                        }
                        else if (shiftState == 2) {
                            shiftState = 0;
                        }
                        buildKeyPad($this.find('.containerKeypad'), shiftState);
                    }
                    else if ($(this).hasClass('bksp')) {
                        //clearInterval(waitpreview);
                        clearTimer();
                        $this.find('input.inputactive').val(function () {
                            $('#_' + $(this).attr('id')).val(getToPoint($(this).val().substring(0, $(this).val().toString().length - 1)));
                            return $(this).val().substring(0, $(this).val().toString().length - 1);
                        });
                        $popover = $('#' + $('#_' + $this.find('input.inputactive').attr('id')).attr('aria-describedby'));
                        if ($popover) {
                            measuringPassword($this.find('input.inputactive').val(), $popover);
                        }
                    }
                    else {
                        if ($this.find('input.inputactive').val().length >= options.maxLength) {
                            if (shiftState == 1) {
                                shiftState = 0;
                                buildKeyPad($this.find('.containerKeypad'), shiftState);
                            }
                            return false;
                        }

                        $this.find('input.inputactive').val(function () {
                            return $(this).val() + $td.html();
                        });

                        manageWritingPreview($this.find('input.inputactive'));
                        if ($(options.meterPassword).hasClass('inputactive')) {
                            $popover = $('#' + $('#_' + $this.find('input.inputactive').attr('id')).attr('aria-describedby'));
                            $('#_' + $(options.meterPassword).attr('id')).on('shown.bs.popover', function () {
                                $popover = $('#' + $('#_' + $this.find('input.inputactive').attr('id')).attr('aria-describedby'));
                                measuringPassword($this.find('input.inputactive').val(), $popover);
                            });
                            if (!$popover.is(':visible')) {
                                $('#_' + $(options.meterPassword).attr('id')).popover('show');
                            }
                            if ($popover) {
                                measuringPassword($this.find('input.inputactive').val(), $popover);
                            }
                        }
                        if (shiftState == 1) {
                            shiftState = 0;
                            buildKeyPad($this.find('.containerKeypad'), shiftState);
                        }
                    }

                    if (!isValidationActive) {
                        if ($this.find('input[type="password"]').length > 1) {
                            if ($password.val().length > 0 && $password.val().length <= $passwordConfirm.val().length) {
                                isValidationActive = true;
                            }
                        }
                    }

                    if ($this.find('input.inputactive').val().length <= 0) {
                        $popover.hide();
                    }

                    validateConfirmPassword();
                });

                $('body').on('click', '.popover', function () {
                    $(this).popover('hide');
                });
            });
            
        }
    });
})(jQuery);