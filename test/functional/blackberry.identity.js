function testValue(field) {
    expect(blackberry.identity[field]).toBeDefined();
    expect(blackberry.identity[field]).toEqual(jasmine.any(String));
    expect(blackberry.identity[field]).not.toEqual("");
}

function testReadOnly(field) {
    var before = blackberry.identity[field];
    blackberry.identity[field] = "MODIFIED";
    expect(blackberry.identity[field]).toEqual(before);
}

describe("blackberry.identity", function () {
    it('blackberry.identity.uuid should exist', function () {
        testValue("uuid");
    });

    it('blackberry.identity.uuid should be read-only', function () {
        testReadOnly("uuid");
    });
});