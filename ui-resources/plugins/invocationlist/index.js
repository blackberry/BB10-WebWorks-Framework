/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var isShowing = false,
    userEvents = ['mousedown', 'mouseup', 'click', 'touchstart', 'touchmove', 'touchend'],
    PREVENT_INTERACTION_TIMEOUT = 2000, // 2 seconds
    SCREEN_TRANSITION_TIME = 250,
    SCREEN_TRANSITION_TIMEOUT = SCREEN_TRANSITION_TIME + 200,
    SCREEN_TRANSITION_TYPE = '-webkit-transform',
    SCREEN_TRANSITION_STYLE = SCREEN_TRANSITION_TYPE + ' ' + SCREEN_TRANSITION_TIME + 'ms ease-out',
    interactionTimeoutId = 0,
    zIndex = 100,
    invocationListScreen,
    listItems,
    request,
    results,
    self,
    title,
    touchDownPosition,
    pendingAnimationQueue = [],
    animationBlockers = 0,
    offscreenLocation = { LEFT: 'translate(-120%, 0)',
                          RIGHT: 'translate(120%, 0)',
                          TOP: 'translate(0, -120%)',
                          BOTTOM: 'translate(0, 120%)',
                          ONSCREEN: 'translate(0, 0)' },
    ScreenObj = function (domElement) {
        return {
            pushing: false,
            popping: false,
            popped: false,
            pushed: false,
            domElement: domElement
        };
    };

/*
    Screen Animation Coordinator
 */
function tryStartAnimating() {
    if (animationBlockers === 0) {
        var animation;
        while ((animation = pendingAnimationQueue.shift())) {
            animation();
        }
    }
}

function unblockAnimating() {
    animationBlockers--;
    if (animationBlockers < 0) {
        throw new Error('Attempt to unblock animations when there are none');
    }
    tryStartAnimating();
}

function blockAnimating() {
    animationBlockers++;
}

function forceLayout(element) {
    /* When animating elements that were just added to the DOM
       they first need to layed out or else the style will only
       calculated once and the transition animation will not occur */
    return document.defaultView.getComputedStyle(element, "").display;
}

function appendAnimation(animation) {
    pendingAnimationQueue.push(animation);
}

function animate() {
    tryStartAnimating();
}

function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

function allowUserInteraction() {
    if (interactionTimeoutId === 0) {
        return;
    }
    clearTimeout(interactionTimeoutId);
    interactionTimeoutId = 0;
    console.log("allowing user interaction");
    userEvents.forEach(function (eventType) {
        document.removeEventListener(eventType, stopEvent, true);
    });
}

function preventUserInteraction() {
    if (interactionTimeoutId !== 0) {
        console.log('user interaction is already disabled');
        return;
    }

    userEvents.forEach(function (eventType) {
        document.addEventListener(eventType, stopEvent, true);
    });

    interactionTimeoutId = setTimeout(function () {
        console.error('prevent user interaction timeout occured');
        allowUserInteraction();
    }, PREVENT_INTERACTION_TIMEOUT);
}

function transitionWithTimeout(element, transition, transitionTimeout, callback) {
    var boundEvent,
       timeoutId,
       onEvent;

    onEvent = function (timeoutId, event) {
        if (event.target === element) {
            clearTimeout(timeoutId);
            element.removeEventListener("webkitTransitionEnd", boundEvent, false);
            if (callback) {
                callback();
            }
        }
    };

    if (callback) {
        // Last resort timer in case all frames of transition are dropped and webKitTransitionEnd event never fires
        timeoutId = setTimeout(function () {
            console.log("transistion timed out for " + element.id);
            element.removeEventListener("webkitTransitionEnd", boundEvent, false);
            callback();
        }, transitionTimeout);
        boundEvent = onEvent.bind(this, timeoutId);
        element.addEventListener("webkitTransitionEnd", boundEvent, false);
    }

    transition();
    return timeoutId; 
}

/*
    Screen Pushing / Popping Abstractions
 */

function screenPushed(screenObj) {
    allowUserInteraction();
    isShowing = true;
    screenObj.pushing = false;
    screenObj.domElement.style.webkitTransition = '';
    setTimeout(function () {
        screenObj.domElement.style.webkitTransition = SCREEN_TRANSITION_STYLE;
    }, 0);
}

function screenPopped(screenObj) {
    allowUserInteraction();
    screenObj.domElement.style.webkitTransition = '';
    isShowing = false;
    screenObj.popped = false;
    setTimeout(function () {
        screenObj.domElement.classList.add('removed');
        screenObj.domElement.style.webkitTransition = SCREEN_TRANSITION_STYLE;
        screenObj.domElement.removeEventListener('webkitTransitionEnd', screenObj.transitionEndListener);
    }, 0);
}

function animatePushScreen(screenObj) {
    screenObj.pushing = true;

    transitionWithTimeout(screenObj.domElement, function () {
        screenObj.domElement.style.webkitTransform = offscreenLocation.ONSCREEN;
    }, SCREEN_TRANSITION_TIMEOUT, screenPushed.bind(this, screenObj));
}

function animatePopScreen(screenObj) {
    screenObj.popping = true;

    transitionWithTimeout(screenObj.domElement, function () {
        screenObj.domElement.style.webkitTransform = offscreenLocation.BOTTOM;
    }, SCREEN_TRANSITION_TIMEOUT, screenPopped.bind(this, screenObj));

    zIndex -= 10;
}

function showActivityIndicator() {
    /// Hide the list and show the activity indicator
    document.getElementById('invocationListContent').classList.add('hidden');
    document.getElementById('targetLoader').classList.remove('hidden');
}

function invokeApp(key) {
    // invoke some app based on ID
    var invokeRequest = listItems[key],
        args = [invokeRequest];

    showActivityIndicator();

    // Callback for invoking an invocation is to hide the invocation list screen
    window.qnx.webplatform.getController().remoteExec(1, "invocation.invoke", args, function (error, response) {
        if (error) {
            //showError();
        } else {
            animatePopScreen(invocationListScreen);
        }
    });
}

function getInvocationListItemAtPosition(currentYPosition, elementHeight) {
    var list = document.getElementById('invocationListContent');

    if (currentYPosition >= list.offsetTop && currentYPosition <= list.offsetTop + list.clientHeight) {
        return (currentYPosition - list.offsetTop) / elementHeight | 0;
    } else {
        return -1;
    }
}

function handleListItemTouchStart(evt) {
    var currentYPosition = evt.touches[0].clientY;
    touchDownPosition = getInvocationListItemAtPosition(currentYPosition, evt.currentTarget.getBoundingClientRect().height);
}

function handleListItemTouchEnd(targets, evt) {
    var currentYPosition = evt.changedTouches[0].clientY,
        touchEndPosition = getInvocationListItemAtPosition(currentYPosition, evt.currentTarget.getBoundingClientRect().height);

    // Invoke app if we touch ended on the active element
    if (touchDownPosition === touchEndPosition) {
        invokeApp(targets[touchDownPosition].key);
    }
}

/*
    UI Widget Builders
 */

function populateList(parentId, targets, request) {
    var listContent = document.getElementById(parentId),
        listItem,
        iconDiv,
        textDiv,
        i;

    listItems = [];

    // Reset listContent
    listContent.innerHTML = "";
    listContent.setAttribute('class', 'invocationListContainer');

    // create a bunch of subdivs
    for (i in targets) {
        if (targets.hasOwnProperty(i)) {
            listItem = document.createElement('div');

            iconDiv = document.createElement('div');
            iconDiv.setAttribute('class', 'invocationListItemIconDiv');

            iconDiv.style.backgroundImage = 'url(file://' + targets[i].icon + ')';

            textDiv = document.createElement('div');
            textDiv.setAttribute('class', 'invocationListItemText');
            textDiv.innerHTML = targets[i].label;

            listItem.appendChild(iconDiv);
            listItem.appendChild(textDiv);

            listItem.setAttribute('class', 'invocationListItem');
            listItem.addEventListener('touchstart', handleListItemTouchStart, false);
            listItem.addEventListener('touchend', handleListItemTouchEnd.bind(this, targets), false);

            listItems[targets[i].key] = {
                target : targets[i].key,
                action : request.action,
                type: request.type,
                uri : request.uri,
                data : window.btoa(request.data)
            };
            listContent.appendChild(listItem);
        }
    }
}

function createTitleWithCancel(parentId, titleText, cancelCallback) {
    var titleBarDiv = document.createElement('div'),
        title = document.createElement('div'),
        parentDiv = document.getElementById(parentId),
        cancelButton;

    parentDiv.innerHTML = '';

    titleBarDiv.setAttribute('class', 'cancelTitlebar');

    cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel';
    cancelButton.addEventListener('click', function (evt) { 
        evt.preventDefault(); 
        cancelCallback(); 
    });
    titleBarDiv.appendChild(cancelButton);

    title.setAttribute('class', 'cancelTitlebarTitle');
    title.innerText = titleText;
    title.style.marginRight = '230px';
    titleBarDiv.appendChild(title);

    parentDiv.appendChild(titleBarDiv);
}

function init() {
    var screenDiv = document.getElementById('invocationlist');

    createTitleWithCancel('cancelTitlebar', title, self.hide);
    
    invocationListScreen = new ScreenObj(screenDiv);
    invocationListScreen.domElement.style.webkitTransform = offscreenLocation.BOTTOM;
    invocationListScreen.domElement.style.webkitTransition = SCREEN_TRANSITION_STYLE;

    // Need to force layout for DOM element to recognize style changes
    forceLayout(invocationListScreen.domElement);
}

// Expects a JSON objects with this structure:
//
// {
//  “action”:<action>,
//  "icon":<action_icon>,
//  "label":<action_label>,
//  "default":<target_default>,
//  "targets":
//  [
//     {
//       "key":<target_key>,
//       "icon":<target_icon>,
//       "splash":<target_splash>,
//       "label":<target_label>,
//       "type": <target_type>
//     }
//  ]
// }
function setContext(context) {
    request = context.request;
    results = context.results;
}

function show() {
    if (invocationListScreen.pushing || isShowing) {
        return;
    }

    preventUserInteraction();
    populateList('invocationListContent', results[0].targets, request);

    // Hide the activity indicator for now
    document.getElementById('targetLoader').classList.add('hidden');

    // Make sure the keyboard focus is cleared when switching views
    document.activeElement.blur();

    appendAnimation(animatePushScreen.bind(self, invocationListScreen));

    zIndex += 10;
    invocationListScreen.domElement.style.zIndex = zIndex;
    invocationListScreen.domElement.classList.remove('removed');

    // Need to force layout for DOM element to recognize style changes
    forceLayout(invocationListScreen.domElement);
    animate();    
}

self = {
    hide: function () {
        if (invocationListScreen.popping || !isShowing) {
            return;
        }

        preventUserInteraction();

        // Make sure the keyboard focus is cleared when switching screens
        document.activeElement.blur();

        appendAnimation(animatePopScreen.bind(self, invocationListScreen));
        animate();
    },

    show: function (args) {
        var currentContext = args[0];

        title = args[1];

        init();
        setContext(currentContext);
        show();
    }
};

module.exports = self;