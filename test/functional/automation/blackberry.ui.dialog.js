/*
 * Copyright 2013 Research In Motion Limited.
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

describe('blackberry.ui.dialog', function () {

    var timeout = 500;

    it('blackerry.ui.dialog.customAskAsync should be able to create a dialog', function () {
        var buttons = ['Ok'],
            settings = { title: 'Dialog' },
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.customAskAsync('customAskAsync', buttons, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch(screen.availWidth / 2, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout * 2);

            runs(function () {
                expect(callback).toHaveBeenCalledWith(0);
            });
        });
    });


    it('blackerry.ui.dialog.customAskAsync should be able to create a dialog with two buttons and a title', function () {
        var buttons = ['Hello', 'Ok'],
            settings = {title : 'Dialog'},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.customAskAsync('customAskAsync 2', buttons, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch(screen.availWidth / 2, 500);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout * 2);

            runs(function () {
                expect(callback).toHaveBeenCalledWith(1);
            });
        });
    });

    it('blackerry.ui.dialog.customAskAsync should be able to create a global dialog with three buttons and a title', function () {
        var buttons = ['Hello', 'World', 'Ok'],
            settings = {title : 'Dialog', global: true},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.customAskAsync('customAskAsync 3', buttons, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch(screen.availWidth / 2, 600);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith(2);
            });
        });

    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create an Ok dialog and return Ok', function () {
        var type = blackberry.ui.dialog.D_OK,
            settings = {title : 'Ok Dialog'},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync('standardAskAsync', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch((screen.availWidth / 2) - 50, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith({return: 'Ok'});
            });
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create a Delete dialog and return Delete', function () {
        var type = blackberry.ui.dialog.D_DELETE,
            settings = {title : 'Delete Dialog'},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.standardAskAsync('standardAskAsync Delete', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch((screen.availWidth / 2) + 50, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith({return: 'Delete'});
            });
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create a Delete dialog and return Cancel', function () {
        var type = blackberry.ui.dialog.D_DELETE,
            settings = {title : 'Delete Dialog'},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.standardAskAsync('standardAskAsync Delete-Cancel', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch((screen.availWidth / 2) - 50, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith({return: 'Cancel'});
            });
        });
    });


    it('blackberry.ui.dialog.standardAskAsync should be able to create a Yes/No dialog and return Yes', function () {
        var type = blackberry.ui.dialog.D_YES_NO,
            settings = { title : 'Yes/No Dialog' },
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync('Yes/No - Yes', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch((screen.availWidth / 2) + 50, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith({return: 'Yes'});
            });
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create a Yes/No dialog and return No', function () {
        var type = blackberry.ui.dialog.D_YES_NO,
            settings = {title : 'Yes/No Dialog'},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync('Yes/No - No', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch((screen.availWidth / 2) - 50, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith({return: 'No'});
            });
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create an Ok/Cancel dialog and return Ok', function () {
        var type = blackberry.ui.dialog.D_OK_CANCEL,
            settings = {title : 'Ok/Cancel'},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync('Ok/Cancel - Ok', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch((screen.availWidth / 2) + 50, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith({return: 'Ok'});
            });
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create an Ok/Cancel dialog and return Cancel', function () {
        var type = blackberry.ui.dialog.D_OK_CANCEL,
            settings = {title : 'Ok/Cancel'},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync('Ok/Cancel - Cancel', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch((screen.availWidth / 2) - 50, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith({return: 'Cancel'});
            });
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should return the correct option index and return Save', function () {
        var type = blackberry.ui.dialog.D_SAVE,
            settings = {title : 'Save Dialog'},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync('Save Dialog', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch((screen.availWidth / 2) + 50, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith({return: 'Save'});
            });
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should return the correct option index and return Discard', function () {
        var type = blackberry.ui.dialog.D_SAVE,
            settings = {title : 'Save Dialog, Click Discard'},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync('Save Dialog - Discard', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch((screen.availWidth / 2) - 50, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout);

            runs(function () {
                expect(callback).toHaveBeenCalledWith({return: 'Discard'});
            });
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should return the correct option for Prompt dialog and return when Ok', function () {
        var type = blackberry.ui.dialog.D_PROMPT,
            settings = {title : 'Prompt Dialog'},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync('Prompt - OK', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch(screen.availWidth / 2, 400);

            waits(timeout);

            runs(function () {

                internal.automation.injectText('test');

                waits(timeout * 4);

                runs(function () {

                    internal.automation.touch((screen.availWidth / 2) + 50, 450);

                    waitsFor(function () {
                        return callback.argsForCall.length > 0;
                    }, 'dialog callback was never called', timeout * 5);

                    runs(function () {
                        expect(callback).toHaveBeenCalledWith({return: 'Ok', promptText: 'test'});
                    });
                });
            });
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should return the correct option for Prompt dialog and return when Cancel', function () {
        var type = blackberry.ui.dialog.D_PROMPT,
            settings = {title : 'Prompt Dialog'},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync('Prompt - Cancel', type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch(screen.availWidth / 2, 400);

            waits(timeout);

            runs(function () {

                internal.automation.injectText('test');

                waits(timeout * 4);

                runs(function () {

                    internal.automation.touch((screen.availWidth / 2) - 50, 450);

                    waitsFor(function () {
                        return callback.argsForCall.length > 0;
                    }, 'dialog callback was never called', timeout * 5);

                    runs(function () {
                        expect(callback).toHaveBeenCalledWith({return: 'Cancel', promptText: null});
                    });
                });
            });
        });
    });
    
    it("blackerry.ui.dialog.customAskAsync should be able to create a dialog with use of '", function () {
        var buttons = ["'"],
            settings = { title: "'" },
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.customAskAsync("'", buttons, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch(screen.availWidth / 2, 450);

            waitsFor(function () {
                return callback.argsForCall.length > 0;
            }, 'dialog callback was never called', timeout * 2);

            runs(function () {
                expect(callback).toHaveBeenCalledWith(0);
            });
        });
    });
    
    it("blackberry.ui.dialog.standardAskAsync should allow use of ' for display and input text", function () {
        var type = blackberry.ui.dialog.D_PROMPT,
            settings = {title : "'"},
            callback = jasmine.createSpy('callback');

        blackberry.ui.dialog.standardAskAsync("'", type, callback, settings);

        waits(timeout);

        runs(function () {

            internal.automation.touch(screen.availWidth / 2, 400);

            waits(timeout);

            runs(function () {

                internal.automation.injectText("'");

                waits(timeout * 4);

                runs(function () {

                    internal.automation.touch((screen.availWidth / 2) + 50, 450);

                    waitsFor(function () {
                        return callback.argsForCall.length > 0;
                    }, 'dialog callback was never called', timeout * 5);

                    runs(function () {
                        expect(callback).toHaveBeenCalledWith({return: 'Ok', promptText: "'"});
                    });
                });
            });
        });
    });
});
