/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function onInvoked(onInvokedInfo) {
	if (onInvokedInfo.source) {
		alert("Source: " + onInvokedInfo.source);
	}
	if (onInvokedInfo.target) {
		alert("Target: " + onInvokedInfo.target);
	}
	if (onInvokedInfo.action) {
		alert("Action: " + onInvokedInfo.action);
	}
	if (onInvokedInfo.type) {
		alert("Type: " + onInvokedInfo.type);
	}
	if (onInvokedInfo.uri) {
		alert("URI: " + onInvokedInfo.uri);
	}
	if (onInvokedInfo.data) {
		var decodedData = window.atob(onInvokedInfo.data);
		alert("Data: " + decodedData);
	}
}

function cardPeek() {
    try {
        console.log("Calling cardPeek..");
        blackberry.invoked.cardStartPeek("root");
    }
    catch (e) {
        alert("Error cardPeek: " + e);
    }
}

function sendCardDone() {
    try {
        console.log("Calling sendCardDone..");
        blackberry.invoked.cardRequestClosure({
            reason: "No Reason.",
            type: "application/*",
            data: "Just for a demo."
        });
    }
    catch (e) {
        alert("Error sendCardDone: " + e);
    }
}

function onResizeDone() {
    try {
        console.log("Calling onResizeDone..");
        blackberry.invoked.cardResizeDone();
    }
    catch (e) {
        alert("Error onResizeDone: " + e);
    }
}

function onCardResize(info) {
    try {
        console.log("onCardResize Info: ");
        console.log(info);
        alert("onCardResize Info: " + "\nWidth: " + info.width + "\nHeight: " + info.height + "\nOrientation: " + info.orientation + "\nEdge: " + info.edge + "\nid ?: "  + info.id);
    }
    catch (e) {
        alert("Error onCardResized: " + e);
    }
}

function onCardClosed(info) {
    try {
        console.log("onCardClose info: ");
        console.log(info);
        alert("onCardClosed request: \nReason: " + info.reason + "\nType: " + info.type + "\nData: " + info.data);
    }
    catch (e) {
        alert("Error onCardClosed: " + e);
    }
}
