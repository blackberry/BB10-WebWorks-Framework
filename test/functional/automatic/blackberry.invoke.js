describe("Invocation", function () {
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
