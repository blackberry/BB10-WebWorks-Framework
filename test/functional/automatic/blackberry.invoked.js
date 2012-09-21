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
describe("blackberry.invoked", function () {
    it('blackberry.invoked should exist', function () {
        expect(blackberry.invoked).toBeDefined();
    });
    
    it("should sucessfully send and receive invocations", function () {
        var onSuccess = jasmine.createSpy(),
            onError = jasmine.createSpy(),
            invocationHandled = false,
            invokedTarget, invokedType, invokedAction, invokedData;
        
        blackberry.event.addEventListener("invoked", function (invocationInfo) {
            if (invocationInfo.target) {
                invokedTarget = invocationInfo.target;
            }
            if (invocationInfo.type) {
                invokedType = invocationInfo.type;
            }
            if (invocationInfo.action) {
                invokedAction = invocationInfo.action;
            }
            if (invocationInfo.data) {
                invokedData = atob(invocationInfo.data);
            }
            invocationHandled = true;
        });
        
        runs(function () {
            blackberry.invoke.invoke({
                target: "net.rim.webworks.SmokeTest",
                action: "bb.action.OPEN",
                type: "text/plain",
                data: "Hello from SmokeTest"
            }, onSuccess, onError);
        });

        waitsFor(function () {
            return invocationHandled;
        }, "invocation handler did not finish", 1000);

        runs(function () {
            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
            expect(invokedTarget).toBe("net.rim.webworks.SmokeTest");
            expect(invokedType).toBe("text/plain");
            expect(invokedAction).toBe("bb.action.OPEN");
            expect(invokedData).toBe("Hello from SmokeTest");
        });
    }); 
});
