
describe('blackberry.ui.contextmenu', function () {
    it('exists', function () {
        expect(blackberry.ui.contextmenu).toBeDefined();
    });

    xit('launches the context menu on longpress', function () {
        var link = document.createElement('a'),
            evt,
            evt2,
            touch,
            touchList,
            pageX, pageY;

        link.setAttribute('href', '#');
        link.textContent = 'Hello, world!';

        link.addEventListener('touchstart', function (e) {
            console.log(e);
        });

        document.body.appendChild(link);

        pageX = link.offsetLeft + 30;
        pageY = link.offsetTop;

        evt = document.createEvent('TouchEvent');
        evt2 = document.createEvent('TouchEvent');

        touch = document.createTouch(
            window,
            link,
            0,
            pageX,
            pageY,
            pageX,
            pageY,
            pageX,
            pageY
        );

        touchList = document.createTouchList(touch);

        evt.initTouchEvent(touchList, touchList, touchList, 'touchstart', window, pageX, pageY, pageX, pageY);
        evt2.initTouchEvent(touchList, touchList, touchList, 'touchmove', window, pageX, pageY, pageX, pageY);

        runs(function () {
            link.dispatchEvent(evt);
        });

        waits(1000);
    });
});
