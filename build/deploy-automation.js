/*
 *  Copyright 2012 Research In Motion Limited.
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
var childProcess = require('child_process'),
    conf = require('./build/conf'),
    utils = require('./build/utils');

function getTestForAgentCmd(ip) {
    return "ssh root@" + ip + " '[ -f /var/automation/ui-agent ] && echo 1 || " +
        "(echo 0 ; mkdir -p /var/automation)'";
}

function getCopyAgentCmd(ip, user) {
    return "mkdir -p /Volumes/QNXAutomation && " +
        "mount -t smbfs //'RIMNET;" + user + "'@javasrv50.devlab2k.testnet.rim.net/QNX%20Automation%20Agents /Volumes/QNXAutomation && " +
        "scp /Volumes/QNXAutomation/agents_v1.0.0.0/target/arm/agents/ui-agent root@" + ip + ":/var/automation/ui-agent || " +
        "umount /Volumes/QNXAutomation";
}

function getRunAgentCmd(ip) {
    return ["root@" + ip, 
        "if ! pidin | grep ui-agent > /dev/null; then " +
        "/var/automation/ui-agent > /dev/null & " +
        "sleep 2; " +
        "chmod 666 /pps/services/agent/ui-agent/control; " +
        "else echo 'ui-agent is already running'; " +
        "fi;"];
}

function onError(stderr) {
    console.log(stderr);
    console.log('FAILURE');
    process.exit(1);
}

function execAgent(ip) {
    console.log('Starting ui-agent...');
    childProcess.spawn('ssh', getRunAgentCmd(ip), [], { stdio: 'inherit', detached: true });
}

function execCopy(ip, user) {
    childProcess.exec(getCopyAgentCmd(ip, user), function (error, stdout, stderr) {
        if (error) {
            onError(stderr);
        } else {
            execAgent(ip);
        }
    });
}

function exec(ip, user) {
    console.log('Checking if ui-agent is installed...');
    childProcess.exec(getTestForAgentCmd(ip), function (error, stdout, stderr) {
        if (error) {
            onError(stderr);
        } else {
            if (stdout.toString()[0] === "0") {
                console.log('ui-agent is not installed. Copying from shared drive...');
                execCopy(ip, user);
            } else {
                execAgent(ip);
            }
        }
    });
}

module.exports = function () {
    var ip = arguments[0] || conf.USB_IP,
        user = arguments[1] || "";
    if (utils.isWindows()) {
        console.log("This command is not supported in Windows.");
    } else {
        exec(ip, user);
    }
};
