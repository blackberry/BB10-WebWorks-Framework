/*
 * Copyright (C) Research In Motion Limited 2012. All rights reserved.
 */

var dialog,
    utils;

function requireLocal(id) {
    return require(!!require.resolve ? "../../" + id.replace(/\/chrome/, "") : id);
}

function hide(evt) {
    if (!x$('#dialog').hasClass('hidden')) {
        x$('#dialog').addClass('hidden');
    }
}

function show(desc) {
    var dialog = x$('#dialog'),
        panel = x$('#dialog-panel'),
        header = x$(document.createElement('div')),
        content = x$(document.createElement('div')),
        inputContainer,
        inputDesc,
        input,
        inputDesc2,
        input2,
        buttons = x$(document.createElement('div')),
        divider,
        divider2,
        button = x$(document.createElement('button')),
        button2,
        button3,
        classAutofill,
        res = {},
        url;

    //Check and parse the incoming description, since we use the executeJS into this context
    desc = typeof desc === 'string' ? JSON.parse(desc) : desc;
    url = desc.url;
    utils  = requireLocal("../chrome/lib/utils");

    if (!dialog.hasClass('hidden')) {
        dialog.addClass('hidden');
    }
    panel.html('inner', '');

    header.addClass('dialog-header');
    content.addClass('dialog-content');
    buttons.addClass('dialog-buttons');
    button.addClass('dialog-button');

    switch (desc.dialogType) {
    case 'JavaScriptAlert':
        header.bottom(x$(document.createTextNode(desc.title ? desc.title : "JavaScript Alert")));
        content.bottom(desc.htmlmessage ? desc.htmlmessage : x$(document.createTextNode(desc.message)));
        button.bottom(x$(document.createTextNode(desc.oklabel ? desc.oklabel : "OK")))
              .on('click', hide);
        panel.bottom(header)
             .bottom(content)
             .bottom(buttons
                .bottom(button));
        res.ok = button[0];
        break;
    case 'SSLCertificateException':
        header.bottom(x$(document.createTextNode(desc.title ? desc.title : "SSL Certificate Exception")));
        content.bottom(desc.htmlmessage ? desc.htmlmessage : x$(document.createTextNode(desc.message)));
        button.bottom(x$(document.createTextNode(desc.savelabel ? desc.savelabel : "Add Exception")))
            .on('click', hide);
        divider = x$(document.createElement('div'))
            .addClass('dialog-button-divider');
        button2 = x$(document.createElement('button'))
            .addClass('dialog-button')
            .bottom(x$(document.createTextNode(desc.cancellabel ? desc.cancellabel : "Don't Trust")))
            .on('click', hide);
        panel.bottom(header)
            .bottom(content)
            .bottom(buttons
                .bottom(button)
                .bottom(divider)
                .bottom(button2));
        res.save = button[0];
        res.cancel = button2[0];
        break;
    case 'InsecureSubresourceLoadPolicyConfirm':
        desc.title = "Insecure Contents Confirm";
        desc.oklabel = "Yes";
        desc.cancellabel = "No";
        /* falls through */
    case 'JavaScriptConfirm':
        header.bottom(x$(document.createTextNode(desc.title ? desc.title : "JavaScript Confirm")));
        content.bottom(desc.htmlmessage ? desc.htmlmessage : x$(document.createTextNode(desc.message)));
        button.bottom(x$(document.createTextNode(desc.oklabel ? desc.oklabel : "OK")))
              .on('click', hide);
        divider = x$(document.createElement('div'))
            .addClass('dialog-button-divider');
        button2 = x$(document.createElement('button'))
            .addClass('dialog-button')
            .bottom(x$(document.createTextNode(desc.cancellabel ? desc.cancellabel : "Cancel")))
            .on('click', hide);

        panel.bottom(header)
             .bottom(content)
             .bottom(buttons
                .bottom(button)
                .bottom(divider)
                .bottom(button2));

        if (desc.thirdOptionLabel) {
            button3 = x$(document.createElement('button'))
                .addClass('dialog-button')
                .bottom(x$(document.createTextNode(desc.thirdOptionLabel)))
                .on('click', hide);
            buttons
                .bottom(x$(document.createElement('div'))
                    .addClass('dialog-button-divider'))
                .bottom(button3);
            res.thirdOptionButton = button3[0];
        }

        res.ok = button[0];
        res.cancel = button2[0];
        res.oktext = 'true';
        break;
    case 'JavaScriptPrompt':
        header.bottom(x$(document.createTextNode(desc.title ? desc.title : "JavaScript Prompt")));
        input = x$(document.createElement('input'))
            .attr('type', 'text')
            .addClass('dialog-input')
            .on('keydown', function (keyEvent) {
                if (parseInt(keyEvent.keyCode, 10) === 13) {
                    button.click();
                }
            });
        content.bottom(desc.htmlmessage ? desc.htmlmessage : x$(document.createTextNode(desc.message)));
        button.bottom(x$(document.createTextNode(desc.oklabel ? desc.oklabel : "OK")))
              .on('click', hide);
        divider = x$(document.createElement('div'))
            .addClass('dialog-button-divider');
        button2 = x$(document.createElement('button'))
            .addClass('dialog-button')
            .bottom(x$(document.createTextNode(desc.cancellabel ? desc.cancellabel : "Cancel")))
            .on('click', hide);

        panel.bottom(header)
             .bottom(content
                .bottom(input))
             .bottom(buttons
                .bottom(button)
                .bottom(divider)
                .bottom(button2));

        res.ok = button[0];
        res.cancel = button2[0];
        res.__defineGetter__('oktext', function () {
            return input[0].value;
        });
        break;
    case 'AuthenticationChallenge':
        header.bottom(x$(document.createTextNode(desc.title ? desc.title : (desc.isProxy ? "Proxy Authentication Required" : "Authentication Required"))));
        content.bottom(x$(document.createElement('div')).inner("Connecting to " + utils.parseUri(url).host));
        if (url.indexOf("https://") === 0) {
            content.bottom(x$(document.createElement('div')).inner("via SSL connection"));
        }
        content.bottom(desc.htmlmessage ? desc.htmlmessage : x$(document.createTextNode(desc.message)));
        inputContainer = x$(document.createElement('div'))
            .addClass('dialog-input-container');
        classAutofill = 'dialog-input-autofill';
        inputDesc = x$(document.createTextNode('User Name:'));
        input = x$(document.createElement('input'))
            .attr('type', 'text')
            .attr('autocomplete', 'off')
            .addClass('dialog-input')
            .on('keydown', function (keyEvent) {
                if (parseInt(keyEvent.keyCode, 10) === 13) {
                    input2[0].focus();
                    return;
                }
                if (input.hasClass(classAutofill)) {
                    input.removeClass(classAutofill);
                    input2.removeClass(classAutofill);
                    input2[0].value = '';
                }
            });
        if (desc.username) {
            input.attr('value', decodeURIComponent(desc.username)).addClass(classAutofill);
        }
        inputDesc2 = x$(document.createTextNode('Password:'));
        input2 = x$(document.createElement('input'))
            .attr('type', 'password')
            .addClass('dialog-input')
            .on('keydown', function (keyEvent) {
                if (parseInt(keyEvent.keyCode, 10) === 13) {
                    button.click();
                    return;
                }
                if (input2.hasClass(classAutofill)) {
                    input2.removeClass(classAutofill);
                }
            });
        if (desc.password) {
            input2.attr('value', decodeURIComponent(desc.password)).addClass(classAutofill);
        }
        button.bottom(x$(document.createTextNode(desc.oklabel ? desc.oklabel : "OK")))
                .on('click', hide);
        divider = x$(document.createElement('div'))
            .addClass('dialog-button-divider');
        button2 = x$(document.createElement('button'))
            .addClass('dialog-button')
            .bottom(x$(document.createTextNode(desc.cancellabel ? desc.cancellabel : "Cancel")))
            .on('click', hide);

        panel.bottom(header)
            .bottom(content
                .bottom(inputContainer
                    .bottom(inputDesc)
                    .bottom(input)
                    .bottom(inputDesc2)
                    .bottom(input2)))
            .bottom(buttons
                .bottom(button)
                .bottom(divider)
                .bottom(button2));

        res.ok = button[0];
        res.cancel = button2[0];
        res.__defineGetter__('username', function () {
            return input[0].value;
        });
        res.__defineGetter__('password', function () {
            return input2[0].value;
        });
        res.oktext = 'true';
        break;
    case 'SaveCredential':
        header.bottom(x$(document.createTextNode(desc.title ? desc.title : "Signing In")));
        content.bottom(desc.htmlmessage ? desc.htmlmessage : x$(document.createTextNode(desc.message)));
        button.bottom(x$(document.createTextNode(desc.oklabel ? desc.oklabel : "Save")))
            .on('click', hide);
        divider = x$(document.createElement('div'))
            .addClass('dialog-button-divider');
        button2 = x$(document.createElement('button'))
            .addClass('dialog-button')
            .bottom(x$(document.createTextNode(desc.neverlabel ? desc.neverlabel : "Never")))
            .on('click', hide);
        divider2 = x$(document.createElement('div'))
            .addClass('dialog-button-divider');
        button3 = x$(document.createElement('button'))
            .addClass('dialog-button')
            .bottom(x$(document.createTextNode(desc.cancellabel ? desc.cancellabel : "Ignore")))
            .on('click', hide);
        panel.bottom(header)
            .bottom(content)
            .bottom(buttons
                .bottom(button)
                .bottom(divider)
                .bottom(button2)
                .bottom(divider2)
                .bottom(button3));
        res.save = button[0];
        res.never = button2[0];
        res.cancel = button3[0];
        break;

    case 'Generic':
    case 'GeolocationPermission':
    case 'NotificationPermission':
    case 'DatabaseQuotaExceeded':
        /* falls through */
    default:
        return;
    }
    dialog.removeClass('hidden');

    /*
     * This call is executed from a different context, therefore we can't
     * really return a value. We need to expose a call through the controller
     * publish remote function
     */

    return res;
}

function showDialog(description) {

    var res = show(description),
        returnValue = {};
    if (res) {
        if (res.ok) {
            x$(res.ok).on('click', function () {
                returnValue.username = res.hasOwnProperty('username') ? encodeURIComponent(res.username) : '';
                returnValue.password = res.hasOwnProperty('password') ? encodeURIComponent(res.password) : '';
                returnValue.oktext = res.hasOwnProperty('oktext') ? encodeURIComponent(res.oktext) : '';
                returnValue.ok = true;
                window.qnx.webplatform.getController().remoteExec(1, 'dialog.result', [returnValue]);
            });
        }
        if (res.cancel) {
            x$(res.cancel).on('click', function () {
                returnValue.cancel = true;
                window.qnx.webplatform.getController().remoteExec(1, 'dialog.result', [returnValue]);
            });
        }
        if (res.save) {
            x$(res.save).on('click', function () {
                returnValue.save = true;
                window.qnx.webplatform.getController().remoteExec(1, 'dialog.result', [returnValue]);
            });
        }
        if (res.never) {
            x$(res.never).on('click', function () {
                returnValue.never = true;
                window.qnx.webplatform.getController().remoteExec(1, 'dialog.result', [returnValue]);
            });
        }
    }
}

dialog = {
    /**
     * description can have
     *   title - the title of the dialog
     *   message - the dialog's message. Text only
     *   htmlmessage - alternate message content, can contain HTML
     *   oklabel - the label for the primary/action/OK button
     *   cancellabel - the label for the secondary/dismiss/Cancel button
     *   neverlabel - the label for "never remember this site" action of save credential dialog
     *
     * @returns object res
     *   ok - The ok button element. Attach your click handlers here
     *   cancel - The cancel button element. Attach your click handlers here
     *   oktext - The string "true" for hitting OK on a Confirm, the input's value for hitting OK on a Prompt, or absent
     *   username - User name for authentication challenge dialog
     *   password - Password for authentication challenge dialog
     */
    showDialog: showDialog,
};

module.exports = dialog;
