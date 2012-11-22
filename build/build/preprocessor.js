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
var fs = require('fs');

function LineObj(line) {
    this.addComment = false;
    this.ifValue = false;
    this.text = line;
    this.index = -1;
}

function trim(str) {
    return str.replace(/^\s\s*/, '')
                .replace(/\s\s*$/, '');
}

function parseIf(str) {
    return  trim(str.replace(/^\s*\/\/@if\b/, ''));
}

function include(arr, obj) {
    return (arr.indexOf(obj) !== -1);
}

function processIf(ifLineObj, defines) {
    var pv,
        pa,
        i;

    pv = parseIf(ifLineObj.text);
    pa = pv.split(',');
    for (i = 0; i < pa.length; i++) {
        if (include(defines, pa[i])) {
            ifLineObj.ifValue = true;
            break;
        }
    }
}

function start(options) {
    var lines = [],
        i,
        temparr,
        codeData = "";

    temparr = fs.readFileSync(options.src, 'utf8').split('\n');

    for (i = 0; i < temparr.length; i++) {
        lines.push(new LineObj(temparr[i]));
    }

    process(lines, options.defines);

    for (i = 0; i < lines.length; i++) {
        if (!lines[i].addComment) {
            codeData += lines[i].text + '\n';
        }
    }

    fs.writeFileSync(options.dst, codeData);
}

function process(arr, defines) {
    var ifPattern = /^\s*\/\/@if\b/g,
        elsePattern = /^\s*\/\/@else/g,
        endifPattern = /^\s*\/\/@endif/g,
        i,
        ifLineObj,
        elseLineObj,
        endifLineObj,
        j;

    //iterate over the lines
    for (i = 0; i < arr.length; i++) {
        if (ifPattern.test(arr[i].text)) {
            ifLineObj = arr[i];
            processIf(ifLineObj, defines);
            ifLineObj.index = i;

        } else if (elsePattern.test(arr[i].text)) {
            elseLineObj = arr[i];
            elseLineObj.index = i;
        } else if (endifPattern.test(arr[i].text)) {
            endifLineObj = arr[i];
            endifLineObj.index = i;
            //an endif has been found now process all the block
            if (ifLineObj.ifValue) {
                //comment out the else block if it exists
                if (elseLineObj) {
                    for (j = elseLineObj.index + 1 ; j <= endifLineObj.index - 1; j++) {
                        arr[j].addComment = true;
                    }
                }

            } else {
                // commend out the if block
                if (elseLineObj) { // from if till else
                    for (j = ifLineObj.index + 1 ; j <= elseLineObj.index - 1; j++) {
                        arr[j].addComment = true;
                    }
                } else { // from if till endif
                    for (j = ifLineObj.index + 1 ; j <= endifLineObj.index - 1; j++) {
                        arr[j].addComment = true;
                    }
                }
            }
            if (ifLineObj) {
                ifLineObj.addComment = true;
            }
            if (elseLineObj) {
                elseLineObj.addComment = true;
            }
            if (endifLineObj) {
                endifLineObj.addComment = true;
            }
            //unset all locations;
            ifLineObj = null;
            elseLineObj = null;
            endifLineObj = null;
        }
    }
}

module.exports = {
    preprocess: start
};
