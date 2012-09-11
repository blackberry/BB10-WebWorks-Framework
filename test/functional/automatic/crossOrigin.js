describe("Cross Origin Request", function () {
    it("should not be blocked for a whitelisted domain", function () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'http://www.w3.org/html/logo/downloads/HTML5_Logo_512.png', false);
        xhr.send();
        expect(xhr.status).toBe(200);
    });
    
    it("should be blocked for a non-whitelisted domain", function () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'http://www.nba.com/', false);
        spyOn(window, "alert");
        xhr.send();
        expect(window.alert).toHaveBeenCalledWith('Access to "http://www.nba.com/" not allowed');
    });
});
