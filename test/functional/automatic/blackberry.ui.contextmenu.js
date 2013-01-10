
describe('blackberry.ui.contextmenu', function () {

    it('expect contextmenu to exist', function () {
        expect(blackberry.ui.contextmenu).toBeDefined();
    });

    it('expect addItem to exist', function () {
        expect(blackberry.ui.contextmenu.addItem).toBeDefined();
    });

    it('expect removeItem to exist', function () {
        expect(blackberry.ui.contextmenu.removeItem).toBeDefined();
    });

    it('expect defineCustomContext to exist', function () {
        expect(blackberry.ui.contextmenu.defineCustomContext).toBeDefined();
    });

    it('expect context menu contexts to be defined properly', function () {
        expect(blackberry.ui.contextmenu.CONTEXT_ALL).toEqual("ALL");
        expect(blackberry.ui.contextmenu.CONTEXT_IMAGE).toEqual("IMAGE");
        expect(blackberry.ui.contextmenu.CONTEXT_IMAGE_LINK).toEqual("IMAGE_LINK");
        expect(blackberry.ui.contextmenu.CONTEXT_LINK).toEqual("LINK");
        expect(blackberry.ui.contextmenu.CONTEXT_INPUT).toEqual("INPUT");
        expect(blackberry.ui.contextmenu.CONTEXT_TEXT).toEqual("TEXT");
    });

    it('expect context menu action Ids to be defined properly', function () {
        expect(blackberry.ui.contextmenu.ACTION_CANCEL).toEqual("Cancel");
        expect(blackberry.ui.contextmenu.ACTION_CLEAR_FIELD).toEqual("ClearField");
        expect(blackberry.ui.contextmenu.ACTION_COPY).toEqual("Copy");
        expect(blackberry.ui.contextmenu.ACTION_COPY_IMAGE_LINK).toEqual("CopyImageLink");
        expect(blackberry.ui.contextmenu.ACTION_COPY_LINK).toEqual("CopyLink");
        expect(blackberry.ui.contextmenu.ACTION_CUT).toEqual("Cut");
        expect(blackberry.ui.contextmenu.ACTION_INSPECT_ELEMENT).toEqual("InspectElement");
        expect(blackberry.ui.contextmenu.ACTION_PASTE).toEqual("Paste");
        expect(blackberry.ui.contextmenu.ACTION_SAVE_IMAGE).toEqual("SaveImage");
        expect(blackberry.ui.contextmenu.ACTION_SAVE_LINK_AS).toEqual("SaveLinkAs");
        expect(blackberry.ui.contextmenu.ACTION_VIEW_IMAGE).toEqual("ViewImage");
        expect(blackberry.ui.contextmenu.ACTION_SELECT).toEqual("Select");
    });

});
