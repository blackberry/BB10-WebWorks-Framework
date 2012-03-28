
describe("blackberry.invoke", function () {
	it('invoke should exist', function () {
		expect(blackberry.invoke).toBeDefined();
	});

    it('BrowserArguments should exist', function () {
        expect(blackberry.invoke.BrowserArguments).toBeDefined();
    });

    it('invoke should invoke google.com', function () {
        var args = new blackberry.invoke.BrowserArguments("http://www.google.com"),
        	confirm;

        try {
     	   blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
        } catch(e) {
        	console.log(e);
        }

        confirm = window.confirm("Did it invoke?");

        expect(confirm).toEqual(true);
    });

    it('invoke should invoke user specified link', function () {
        var url = window.prompt("Please enter a URL");
        	args = new blackberry.invoke.BrowserArguments(url),
        	confirm;

        try {
     	   blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
        } catch(e) {
        	console.log(e);
        }

        confirm = window.confirm("Did it invoke?");

        expect(confirm).toEqual(true);
    });
});