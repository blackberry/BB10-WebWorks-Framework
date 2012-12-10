function onInvokeSuccess (msg) {
    console.log("Invocation Success" + msg);
}

function onInvokeError (msg) {
  console.log("Invocation Error: " + msg);
}

function shareCardJPEG() {
	var request = {
        action : 'bb.action.SHARE',
        uri : 'local:///manual/InvocationTest/test_image.png',
        target_type: ["CARD"]
    };

    blackberry.invoke.card.invokeTargetPicker(request, "Share Card JPEG", onInvokeSuccess, onInvokeError);
}

function shareCardFileJPEG() {
	var request = {
        action : 'bb.action.SHARE',
        uri : 'file://' + blackberry.io.home  + '/../app/native/manual/InvocationTest/test_image.png',
        target_type: ["CARD"]
    };

    blackberry.invoke.card.invokeTargetPicker(request, "Share JPEGS Card", onInvokeSuccess, onInvokeError);
}

function sharePNG() {
	var request = {
        action : 'bb.action.SHARE',
        uri : 'local:///manual/InvocationTest/test_image.png',
        target_type: ["APPLICATION", "VIEWER", "CARD"]
    };

    blackberry.invoke.card.invokeTargetPicker(request, "Shared PNG", onInvokeSuccess, onInvokeError);
}

function sharePDFNoURI() {
	var request = {
        action : 'bb.action.SHARE',
        uri : 'local:///manual/InvocationTest/test.pdf',
        target_type: ["APPLICATION", "VIEWER", "CARD"]
    };
    blackberry.invoke.card.invokeTargetPicker(request, "Shared PDF", onInvokeSuccess, onInvokeError);
}

function shareDocNoURI() {
	var request = {
        action : 'bb.action.SHARE',
        uri : 'local:///manual/InvocationTest/test.docx',
        target_type: ["APPLICATION", "VIEWER", "CARD"]
    };
    blackberry.invoke.card.invokeTargetPicker(request, "Share Word Document", onInvokeSuccess, onInvokeError);
}

function shareRemoteURL() {
	var request = {
        action : 'bb.action.SHARE',
        uri : 'http://google.com',
        target_type: ["APPLICATION", "VIEWER", "CARD"]
    };
    blackberry.invoke.card.invokeTargetPicker(request, "Shared Remote URL", onInvokeSuccess, onInvokeError);
}

function shareTextMockingSelection() {
	var request = {
        action : 'bb.action.SHARE',
        mime : 'text/plain',
        data : 'Some awesome text',
        target_type: ["APPLICATION", "VIEWER", "CARD"]
    };
    blackberry.invoke.card.invokeTargetPicker(request, "Sharing Text", onInvokeSuccess, onInvokeError);
}

function shareLinkURISpaces() {
	var request = {
        action : 'bb.action.SHARE',
        uri : 'http://local/link with space/some_page.html',
        target_type: ["APPLICATION", "VIEWER", "CARD"]
    };
    blackberry.invoke.card.invokeTargetPicker(request, "Sharing Text", onInvokeSuccess, onInvokeError);
}

function shareLinkWeirdCharacters() {
	var request = {
        action : 'bb.action.SHARE',
        uri : 'http://local/$test%somestuff*tothrow@you/some_page.html',
        target_type: ["APPLICATION", "VIEWER", "CARD"]
    };
    blackberry.invoke.card.invokeTargetPicker(request, "Sharing Text", onInvokeSuccess, onInvokeError);
}

function registerInvocationInterrupter() {
    blackberry.invoke.interrupter = function (request) {
        alert("You should see this dialog but the invocation should proceed.");
        return request;
    };
}

function registerInvocationInterrupterCanceller() {
    blackberry.invoke.interrupter = function (request) {
        alert("You should see this dialog and the invocation should be cancelled.");
        return null;
    };
}

function clearInvocationInterrupter() {
    blackberry.invoke.interrupter = null;
}


