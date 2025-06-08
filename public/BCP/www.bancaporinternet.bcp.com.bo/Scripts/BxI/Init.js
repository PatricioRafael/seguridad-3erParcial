$(function () {
    if (localStorage['offersCount'] !== undefined) {
        if (localStorage['offersCount'] > 0) {
            BXI.program.balances.loadValuesCount('#badge-fb-pa', localStorage['offersCount'])
        }
        else {
            BXI.program.balances.noValuesCount('#badge-fb-pa');
        }
    }
    
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', GetAnalytics(), 'auto');
    ga('send', 'pageview');

    if ($('#ActiveCreditokenUsers').val() == 'true') {
        var urltv = GetRoute("TokenVirtual", "").toString();
        urltv = urltv.substr(0, urltv.length - 1).toLowerCase();

        if (location.href.toLowerCase().indexOf(urltv) != -1) {
            if (localStorage['isAllowedCTV'] != 'true') {
                location.href = GetRoute("Balances", "Index");
            }
        }

        if (localStorage['isAllowedCTV'] == 'true') {
            $('#creditoken-virtual').show();
        } else {
            $('#creditoken-virtual').hide();
        }
    }

    var panelFIxed = function () {
        var position = $('.panel-fixed.launch-fixed').offset();
        if ($(window).scrollTop() > position.top) {

        }
        $('.panel-fixed').affix({
            bottom: 245
        });
    };

    (function () {
        var t = eval($('.contenedor_BXI').data('execute'));
        if (t !== undefined) {
            t['init']();
        }
        if ($('#bill-count').data('href') === undefined) {
            function checkFields($el) {
                tbs = $el.val();
                if (tbs.indexOf('<') != -1 || tbs.indexOf('>') != -1) {
                    return false;
                }
                return true;
            }

            $('a[href="' + GetHostname() + '/alianzabills/"]').click(function (e) {
                e.preventDefault();
                $('#AdviceAlianzaUrl').modal('show');
            });

            $("#btnAceptAlianzaAdvice").click(function (e) {
                $('#AdviceAlianzaUrl').modal('hide');
                window.open('http://www.alianza.com.bo/awc/', '_blank');
            });

            $('.feedback-btn').click(function () {
                $('#feedback-Comments').attr('class', 'form-control bg-' + $(this).data('class'));
                $('#feedback-Category').attr('value', $(this).data('text'));
            });

            $('.sp-main-feedback-1').tooltip('show');
            setTimeout(function () {
                $('.sp-main-feedback-1').tooltip('hide');
            }, 2000);


            $('.sp-main-feedback-1').click(function () {
                $('#feedbackModal').modal('show');
                $('#send-Feedback').show();
                $('#fb-thanks-messsage').hide();
                $('#fb-main-content').show();
                $('#feedback-Comments').attr('class', 'form-control bg-success');
                $('#feedback-Category').attr('value', 'Sugerencia');
                $('#feedback-Comments').attr('value', '');
            });

            $('#send-Feedback').click(function () {
                $('#description-error').hide();
                if (!checkFields($('#feedback-Comments'))) {
                    $('#injection-error').show();
                    return;
                } else {
                    $('#injection-error').hide();
                }

                if ($('#feedback-Comments').val() == '') {
                    $('#description-error').show();
                    return;
                } else {
                    $('#description-error').hide();
                }

                $(this).hide();
                //$(this).after('<img id="d-loading" src="../Content/Images/loading.gif" />');
                $.ajax({
                    url: GetRoute("Common", "SendFeedback"),
                    data: { 'AditionalData': navigator.userAgent, 'Category': $('#feedback-Category').val(), 'Detail': $('#feedback-Comments').val() },
                    type: 'POST',
                    success: function (res) {
                        $('#fb-main-content').hide();
                        $('#fb-thanks-messsage').html(res);
                        $('#fb-thanks-messsage').show();
                    },
                    complete: function (xhr, textStatus) {
                        if (textStatus != "error") {
                            $('#d-loading').remove();
                            setTimeout(function () {
                                $('#feedbackModal').modal('hide');
                            }, 1500);
                        }
                    },
                    statusCode: {
                        403: BXI.ajax.Unauthorized
                    }

                });
            });
        }
    }())
});