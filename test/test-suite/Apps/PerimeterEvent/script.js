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
function onLocked() {
    alert("Locked!");
}

function onUnlocked() {
    alert("Unlocked!");
}

function startListenLock() {
    alert("before start listen locked");
    blackberry.event.addEventListener("perimeterlocked", onLocked);
    alert("after start listen locked");
}

function startListenUnlock() {
    alert("before start listen unlocked");
    blackberry.event.addEventListener("perimeterunlocked", onUnlocked);
    alert("after start listen unlocked");
}

function stopListenLock() {
    alert("before stop listen locked");
    blackberry.event.removeEventListener("perimeterlocked", onLocked);
    alert("after stop listen locked");
}

function stopListenUnlock() {
    alert("before stop listen unlocked");
    blackberry.event.removeEventListener("perimeterunlocked", onUnlocked);
    alert("after stop listen unlocked");
}