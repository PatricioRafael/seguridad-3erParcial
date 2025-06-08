(function () {
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() { }
            F.prototype = o;
            return new F();
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fun /*, thisp */) {
            "use strict";

            if (this === void 0 || this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
                throw new TypeError();

            var res = [];
            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, t))
                        res.push(val);
                }
            }

            return res;
        };
    }

    $(':input').attr('autocomplete', 'off');


})();

function Buscador(lista, parametro, propiedad) {
    /// <summary>Metodo buscador,busca en una lista de objetos un parametro y propiedad</summary>
    /// <param name="lista" type="string">Lista de objetos a realizar la busqueda</param>
    /// <param name="parametro" type="string">El parametro co el cual se realizara la busqueda en la lista</param>
    /// <param name="propiedad" type="string">La propiedad con la cual se realizara la busqueda</param>
    /// <returns type="string">el objeto que cumple con el parametro, propiedad</returns>
    return lista.filter(function (item) {
        return item[propiedad] == parametro;
    })[0];
}

//Funciones Generales
function CreateSpan(valor, clase) {
    /// <summary>Crea un Span </summary>
    /// <param name="valor" type="string">Texto que se desplegara en el Span</param>
    /// <param name="clase" type="string">Class que tendra el span error-msg,warning-msg,success-msg</param>
    /// <returns type="string"> String del span en html</returns>
    return '<span class="' + clase + '">' + valor + '</span>';
}
function CreateA(clase, data, valor) {
    /// <summary>Crea una a</summary>
    /// <param name="clase" type="string">class que tendra el a</param>
    /// <param name="data" type="string">data que contendra el a Ej. data-id="a" data-t="34"</param>
    /// <param name="valor" type="string">Value, Texto del a</param>
    /// <returns type="string">string del a creado en Html </returns>
    return '<a class="' + clase + '" ' + data + '>' + valor + '</a>';
}

function Createtr(valor) {
    /// <summary>Crea una fila tr, que contendra td</summary>
    /// <param name="valor" type="string">Array de los td que se crearan/param>
    /// <returns type="string">String con las fila de td en html</returns>
    var trCreated = '<tr>';
    $.each(valor, function (key, value) {
        if (value instanceof Array)
        { trCreated = trCreated + Createtd(value[0], value[1]); }
        else
        { trCreated = trCreated + Createtd(value); }
    });
    trCreated = trCreated + '</tr>';
    return trCreated;
}

function Createtd(valor, clase) {
    /// <summary>Crea un td con el valor indicado </summary>
    /// <param name="valor" type="string">El contenido que tendra el td</param>
    /// <returns type="string">String con el td en html</returns>
    var classe = clase == 'undefined' ? '' : clase;
    return '<td class="' + classe + '">' + valor + '</td>';
}

function Createtrth(valor) {
    /// <summary>Crea una fila tr, que contendra th </summary>
    /// <param name="valor" type="Array">Array de los th que se crearan</param>
    /// <returns type="string">String con las fila de th en html</returns>
    var thCreated = '<tr>';
    $.each(valor, function (key, value) {
        if (value instanceof Array)
        { thCreated = thCreated + Createth(value[0], value[1]); }
        else
        { thCreated = thCreated + Createth(value); }
    });
    thCreated = thCreated + '</tr>';
    return thCreated;
}

function Createth(valor, clase) {
    /// <summary>Crea un th con el valor indicado </summary>
    /// <param name="valor" type="string">El contenido que tendra el th</param>
    /// <returns type="string">String con el th en html </returns>
    var classe = clase == 'undefined' ? '' : clase;
    return '<th class="' + classe + '">' + valor + '</th>';
}

function LoadAccountData(accounts, selectedValue, propiedad, idMoneda, idSaldo) {
    /// <summary>Carga los datos (moneda,saldo) de una cuenta insertada a los campos indicados </summary>
    /// <param name="accounts" type="string">Lista de objetos cuenta cuentas</param>
    /// <param name="selectedValue" type="string">El numero de cuenta que se buscara en la lista</param>
    /// <param name="propiedad" type="string">La propiedad con la cual se realizara la busqueda</param>
    /// <param name="idMoneda" type="string">El id del input moneda donde se cargara el resultado de la busqueda</param>
    /// <param name="idSaldo" type="string">El id del input saldo donde se cargara el resultado de la busqueda</param>
    /// <returns type="string">los campos seran cargados con el valor, paropiedad seleccionado</returns>
    var cuenta = Buscador(accounts, selectedValue, propiedad)
    $(idMoneda).attr('value', cuenta.MonedaCuenta);
    $(idSaldo).attr('value', cuenta.SaldoCuenta);
}

function LoadCreditCardData(cards, selectedValue, numeroTarjeta, idTitular, idMonto, idMoneda) {
    var card = Buscador(cards, selectedValue, numeroTarjeta)

    $('#' + idTitular).attr('value', card.Titular);
    $('#' + idMonto).attr('value', card.MontoUtilizado);
    $('#' + idMoneda).attr('value', card.MonedaCuenta);
}

function clearValidationSummary() {
    $('.validation-summary-errors ul').empty();
    $('.validation-summary-errors').removeClass('validation-summary-errors').addClass('validation-summary-valid');
}

//function formato_numero(numero, decimales, separador_decimal, separador_miles) {
//    /// <summary>Convierte un numero en formato de miles y con los decimales que se desee</summary>
//    /// <param name="numero" type="decimal/int">Numero que se va a convertir</param>
//    /// <param name="decimales" type="int">Cantidad de decimales con los que se mostrara el numero</param>
//    /// <param name="separador_decimal" type="string">El signo que representara el punto decimal(se manda un punto por lo general)</param>
//    /// <param name="separador_miles" type="string">El signo que representara a los millares(por lo general es una coma)</param>
//    /// <returns type="string">string que con el numero formado</returns>
//    numero = numero.toString().replace(",", ".");
//    numero = parseFloat(numero);
//    if (isNaN(numero)) {
//        return "";
//    }
//    if (decimales !== undefined) {
//        numero = numero.toFixed(decimales);
//    }
//    numero = numero.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ",");
//    if (separador_miles) {
//        var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
//        while (miles.test(numero)) {
//            numero = numero.replace(miles, "$1" + separador_miles + "$2");
//        }
//    }
//    return numero;
//}

var BXI = BXI || {};
BXI.program = {};
BXI.util = {
    Search: function (lista, parametro, propiedad) {
        if (lista == null) {
            return false;
        }
        return lista.filter(function (item) {
            return item[propiedad] == parametro;
        })[0];
    },
    CreateSpan: function (valor, clase) {
        /// <summary>Crea un Span </summary>
        /// <param name="valor" type="string">Texto que se desplegara en el Span</param>
        /// <param name="clase" type="string">Class que tendra el span error-msg,warning-msg,success-msg</param>
        /// <returns type="string"> String del span en html</returns>
        return '<span class="' + clase + '">' + valor + '</span>';
    },
    CreateA: function (clase, data, valor) {
        /// <summary>Crea una a</summary>
        /// <param name="clase" type="string">class que tendra el a</param>
        /// <param name="data" type="string">data que contendra el a Ej. data-id="a" data-t="34"</param>
        /// <param name="valor" type="string">Value, Texto del a</param>
        /// <returns type="string">string del a creado en Html </returns>
        return '<a class="' + clase + '" ' + data + '>' + valor + '</a>';
    },
    Createtr: function (valor) {
        /// <summary>Crea una fila tr, que contendra td</summary>
        /// <param name="valor" type="string">Array de los td que se crearan/param>
        /// <returns type="string">String con las fila de td en html</returns>
        var trCreated = '<tr>';
        ////////////////////
        $.each(valor, function (key, value) {
            if (value instanceof Array)
            { trCreated = trCreated + Createtd(value[0], value[1]); }
            else
            { trCreated = trCreated + Createtd(value); }
        });
        trCreated = trCreated + '</tr>';
        return trCreated;
    },
    Createtd: function (valor, clase) {
        /// <summary>Crea un td con el valor indicado </summary>
        /// <param name="valor" type="string">El contenido que tendra el td</param>
        /// <returns type="string">String con el td en html</returns>
        var classe = clase == 'undefined' ? '' : clase;
        return '<td class="' + classe + '">' + valor + '</td>';
    },
    Createtrth: function (valor) {
        /// <summary>Crea una fila tr, que contendra th </summary>
        /// <param name="valor" type="Array">Array de los th que se crearan</param>
        /// <returns type="string">String con las fila de th en html</returns>
        var thCreated = '<tr>';
        $.each(valor, function (key, value) {
            if (value instanceof Array)
            { thCreated = thCreated + Createth(value[0], value[1]); }
            else
            { thCreated = thCreated + Createth(value); }
        });
        thCreated = thCreated + '</tr>';
        return thCreated;
    },
    Createth: function (valor, clase) {
        /// <summary>Crea un th con el valor indicado </summary>
        /// <param name="valor" type="string">El contenido que tendra el th</param>
        /// <returns type="string">String con el th en html </returns>
        var classe = clase == 'undefined' ? '' : clase;
        return '<th class="' + classe + '">' + valor + '</th>';
    },
    LoadAccountData: function (accounts, selectedValue, numeroCuenta, idMoneda, idSaldo, idEstado) {
        var cuenta = BXI.util.Search(accounts, selectedValue, numeroCuenta)
        $(idMoneda).attr('value', cuenta.MonedaCuenta);
        $(idSaldo).attr('value', cuenta.SaldoCuenta);
        $(idEstado).attr('value', cuenta.EstadoCuenta);
    },    
    LoadCreditCardData: function (cards, selectedValue, numeroTarjeta, idTitular, idMonto, idMoneda) {
        var card = BXI.util.Search(cards, selectedValue, numeroTarjeta)        
        //$(idTitular).attr('value', card.Titular);
        $(idTitular).val(card.Titular);
        //$(idMonto).attr('value', card.MontoUtilizado);
        $(idMonto).val(card.MontoUtilizado);
        //$(idMoneda).attr('value', card.MonedaCuenta);        
        $(idMoneda).val(card.MonedaCuenta);
    },
    ClearValidationSummary: function () {
        $('.validation-summary-errors ul').empty();
        $('.validation-summary-errors').removeClass('validation-summary-errors').addClass('validation-summary-valid');
    },
    AddSumaryError: function (id, error) {
        $('.validation-summary-valid').removeClass('validation-summary-valid').addClass('validation-summary-errors');
        if (!$('#vs-' + id).length) {
            $('.validation-summary-errors ul').append('<li id="vs-' + id + '">' + error + '</li>');
        }
        this.SetFocus('.validation-summary-errors');
    },
    ValidateField: function (idform, fieldToValidate) {
        _this = this;
        this.ClearValidationSummary();
        var result = false;
        if (!$(idform).validate().element("#" + fieldToValidate)) {
            var validator = $(idform).validate();
            $.each(validator.errorMap, function (field, error) {
                if (field == fieldToValidate) {
                    _this.AddSumaryError(field, error)
                    result = true;
                    return result;
                }
            });
        }
        return result;
    },
    Scroll: function (selector) {
        $('html,body').animate({
            scrollTop: selector.offset() != null ? selector.offset().top - 50 : 0
        }, 10);
    },
    SetFocus: function (idField) {
        _this = this;
        //$(idField).focus(function () {
        _this.Scroll($(idField));
        //});
    },
    formatDate: function (format, date, settings) {
        if (!date)
            return '';
        //var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
        //var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
        //var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
        //var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;

        var dayNamesShort = (settings ? settings.dayNamesShort : null);
        var dayNames = (settings ? settings.dayNames : null);
        var monthNamesShort = (settings ? settings.monthNamesShort : null);
        var monthNames = (settings ? settings.monthNames : null);
        // Check whether a format character is doubled
        var lookAhead = function (match) {
            var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
            if (matches)
                iFormat++;
            return matches;
        };
        // Format a number, with leading zero if necessary
        var formatNumber = function (match, value, len) {
            var num = '' + value;
            if (lookAhead(match))
                while (num.length < len)
                    num = '0' + num;
            return num;
        };
        // Format a name, short or long as requested
        var formatName = function (match, value, shortNames, longNames) {
            return (lookAhead(match) ? longNames[value] : shortNames[value]);
        };
        var output = '';
        var literal = false;
        if (date)
            for (var iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal)
                    if (format.charAt(iFormat) == "'" && !lookAhead("'"))
                        literal = false;
                    else
                        output += format.charAt(iFormat);
                else
                    switch (format.charAt(iFormat)) {
                        case 'd':
                            output += formatNumber('d', date.getDate(), 2);
                            break;
                        case 'D':
                            output += formatName('D', date.getDay(), dayNamesShort, dayNames);
                            break;
                        case 'o':
                            output += formatNumber('o',
                                Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                            break;
                        case 'm':
                            output += formatNumber('m', date.getMonth() + 1, 2);
                            break;
                        case 'M':
                            output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
                            break;
                        case 'y':
                            output += (lookAhead('y') ? date.getFullYear() :
                                (date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
                            break;
                        case '@':
                            output += date.getTime();
                            break;
                        case '!':
                            output += date.getTime() * 10000 + this._ticksTo1970;
                            break;
                        case "'":
                            if (lookAhead("'"))
                                output += "'";
                            else
                                literal = true;
                            break;
                        default:
                            output += format.charAt(iFormat);
                    }
            }
        return output;
    },
    formatNumber: function (numero, decimales, separador_decimal, separador_miles) {
        /// <summary>Convierte un numero en formato de miles y con los decimales que se desee</summary>
        /// <param name="numero" type="decimal/int">Numero que se va a convertir</param>
        /// <param name="decimales" type="int">Cantidad de decimales con los que se mostrara el numero</param>
        /// <param name="separador_decimal" type="string">El signo que representara el punto decimal(se manda un punto por lo general)</param>
        /// <param name="separador_miles" type="string">El signo que representara a los millares(por lo general es una coma)</param>
        /// <returns type="string">string que con el numero formado</returns>
        numero = numero.toString().replace(",", ".");
        numero = parseFloat(numero);
        if (isNaN(numero)) {
            return "";
        }
        if (decimales !== undefined) {
            numero = numero.toFixed(decimales);
        }
        numero = numero.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ",");
        if (separador_miles) {
            var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
            while (miles.test(numero)) {
                numero = numero.replace(miles, "$1" + separador_miles + "$2");
            }
        }
        return numero;
    },
    IsNumberKey: function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode != 46 && charCode > 31
          && (charCode < 48 || charCode > 57))
            return false;
        return true;
    },
    AlignVertically: function (hijo, tipoPadre, paddingExtra) {
        /// <summary>alinea verticalmente una imagen a su contenedor</summary>
        /// <param name="hijo" type="string">clase o id del elemento a alinear #elemento, .figura</param>
        /// <param name="tipoPadre" type="string">tipo del padre al cual se alineara el elmento div, span, etc</param>
        /// <param name="paddingExtra" type="string">padding extra que se quiera dar al hijo al alinear horizontalmente el mismo</param>
        /// <returns type="string">el hijo estara horizontalmente alineado al padre contenedor</returns>
        var userheight = parseInt($(hijo).css('height'));
        var rowheight = parseInt($(hijo).parent(tipoPadre).css('height'));
        if (userheight < rowheight) {
            $(hijo).css('padding-top', (((rowheight - userheight) / 2) + paddingExtra))
        }
    },
    detectIE: function () {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // IE 12 => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }
        return false;
    }
};

BXI.GraphicMenu = {
    CreateGraphicMenu: function (parent) {
        _this = this;
        var menuHtml = "<div id='graphic-menu' class=row>";
        $("div[data-parent='" + parent + "']").children().each(function () {
            menuHtml = menuHtml + _this.InsertItemGraphicMenu($(this).data('action'), $(this).data('controller'), $(this).data('class'))
        });
        $('#main-content').html(menuHtml + '</div>');
        if ($('#main-content').prev().length > 0) {
            $('#main-content').prev().remove();
        }
        $('.ibk-tooltip').tooltip();
    },
    InsertItemGraphicMenu: function (action, controller, name) {
        return ('<div class="col-md-3 col-sm-3 col-xs-6 margin-bottom">' +
            '<a href="' + GetRoute(controller, action) + '" data-toogle="tooltip" data-placement="right" title="' + name + '" class="ibk-tooltip">' +
            '<div class="border ' + name + '-logo"></div></a></div>');
    }
}

BXI.ajax = {
    Unauthorized: function () {
        window.location = GetRoute("Account", "Login");
    }
};