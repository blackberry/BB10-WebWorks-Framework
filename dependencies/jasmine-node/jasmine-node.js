/* This is a hack to avoid an exception from jasmine
 * The following code has been taken from jasmine-1.0.1.js and the modified
 * line has been clearly marked.
 */
var jasmine = require('jasmine-node');
jasmine.Queue.prototype.next_ = function() {
    var self = this;
    var goAgain = true;

    while (goAgain) {
        goAgain = false;

        if (self.index < self.blocks.length && !(this.abort && !this.ensured[self.index])) {
            var calledSynchronously = true;
            var completedSynchronously = false;

            var onComplete = function () {
                if (jasmine.Queue.LOOP_DONT_RECURSE && calledSynchronously) {
                    completedSynchronously = true;
                    return;
                }
                /***************************************************************************/
                //This line has been modified to add check for self.blocks[self.index]
                if (self.blocks[self.index] && self.blocks[self.index].abort) {
                    self.abort = true;
                }
                /***************************************************************************/

                self.offset = 0;
                self.index++;

                var now = new Date().getTime();
                if (self.env.updateInterval && now - self.env.lastUpdate > self.env.updateInterval) {
                    self.env.lastUpdate = now;
                    self.env.setTimeout(function() {
                        self.next_();
                    }, 0);
                } else {
                    if (jasmine.Queue.LOOP_DONT_RECURSE && completedSynchronously) {
                        goAgain = true;
                    } else {
                        self.next_();
                    }
                }
            };
            self.blocks[self.index].execute(onComplete);

            calledSynchronously = false;
            if (completedSynchronously) {
                onComplete();
            }

        } else {
            self.running = false;
            if (self.onComplete) {
                self.onComplete();
            }
        }
    }
};

