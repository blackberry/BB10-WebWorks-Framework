#BlackBerry 10 WebWorks Framework
WebWorks is an application framework and packaging tool that allows a developer to create a standalone BlackBerry application using HTML5/CSS/JavaScript.  Web developers can create a device application experience, including AppWorld distribution and monetization to system security policy enforcement, to deep device system and service integration. All using the technologies they are familiar with, leveraging the power of the industry leading web platform being built for BlackBerry 10.
This repo contains the code for the BlackBerry 10 WebWorks Framework.

##Prerequisites
1. Install [node[v0.6.10] and npm](http://nodejs.org/dist/v0.6.10/) and add to path.
2. Install [BlackBerry Native SDK](https://bdsc.webapps.blackberry.com/native/).
3. [*Windows*] Add Git bin to PATH. i.e. `*Installation Directory*\bin`

##Setup and Build
1. `git clone https://github.com/blackberry-webworks/BB10-WebWorks-Framework.git`
2. `cd BB10-WebWorks-Framework`
3. `git checkout master`
4. **Configuration:**
    - [*Mac/Linux*] `./configure` [from terminal]
    - [*Windows*] `bash configure` [from command prompt]
5. **Setup bbndk environment variables:** (must be done within each session, prior to jake)
    - [*Mac/Linux*] `source *BBNDK installation directory*/bbndk-env.sh`
    - [*Windows*] `*BBNDK installation directory*\bbndk-env.bat`
6. Run `jake` or `jake build` and check that the output folder is created under the "target/zip" subfolder. If on windows, run jake from command prompt.
8. Run `jake test` and check that jake runs and completes

##Running Tests
1. `jake test`  - to run js tests using nodejs
2. `jake native-test` - to run native unit tests
    1. To setup run jake upload-ssh-key[<IP>,<ssh public key location>] eg. `jake upload-ssh-key[169.254.0.1,~/.ssh/id_rsa.pub]`
    2. To run the tests use jake native-test[<device or simulator>,<IP>] eg. `jake native-test[device,169.254.0.1]`
3. `jake deploy-tests` - builds the Framework, creates, packages and deploys Functional test app<br />
       To run the tests use `jake deploy-tests[<pathToPackager>,<packageroptions>,<device|simulator>,<device ip>,<device password>]`<br />
       eg: `jake deploy-tests[/Users/jheifetz/Downloads/BB10webworks-next-42/,-d,device,169.254.0.1,qaqa]`<br /><br />
*Note: To see a full list of commands available with jake, use `jake -T`.*

##Common issues
 ```
Cloning into dependencies/webplatform... error: Couldn't resolve host 'github.rim.net' while accessing
http://github.rim.net/webworks/webplatform.git/info/refs
```
<br />
Solution: This error can be ignored, but please see the "Setup and Build" - "Webplatform setup:" section above for instructions on copying the necessary webplatform files.

##Dependencies
1. cpplint is used for linting Cpp code. Source code is located under dependencies/cpplint
2. JNEXT 1.0.8.3 is used to build extensions.
Original source of JNEXT was downloaded from here - http://jnext.googlecode.com/files/jnext-src-1.0.8.3.zip
Modifications are available in source code and located udner dependencies/jnext_1_0_8_3

## Authors
* [Bryan Higgins](http://github.com/bryanhiggins)
* [Chris Del Col](http://github.com/cdelcol)
* [Daniel Audino](http://github.com/danielaudino)
* [Danyi Lin](http://github.com/dylin)
* [Derek Watson](http://github.com/derek-watson)
* [Eric Li](http://github.com/ericleili)
* [Eric Pearson](http://github.com/pagey)
* [Erik Johnson](http://github.com/erikj54)
* [Gord Tanner](http://github.com/gtanner)
* [Hasan Ahmad](http://github.com/haahmad)
* [Hoyoung Jang](http://github.com/hoyoungjang)
* [Igor Shneur](http://github.com/ishneur)
* [James Keshavarzi](http://github.com/jkeshavarzi)
* [Jeffrey Heifetz](http://github.com/jeffheifetz)
* [Nukul Bhasin](http://github.com/nukulb)
* [Rosa Tse](http://github.com/rwmtse)
* [Rowell Cruz](http://github.com/rcruz)
* [Sergey Golod](http://github.com/tohman)
* [Stephan Leroux](http://github.com/sleroux)

## General Architecture
Controller is initialized as the index.html which can be found dependencies/bootstrap/index.html. This forms the entry point for the Framework.
The controller lib/framework.js goes on to create the client webview which load application content which can be required from lib/webview.js
The framework.js also creates an Overlay Webview to show dialogs and context menus which can be required from lib/overlayWebView.js
The Controller WebView is initialized as an object lib/controllerWebView.js and can be required from there.

- dependencies
    - bootstrap – contains the bootstrap code.
    - require – our own implementation of require
    - Contains other dependencies like jsonCpp, cpplint, gmock, jnext, csslint, jasmine.
- ext -  contains all the extensions
    - push ( illustrates the structure through one extension)
        - index.js – Controller loads this part of the API ( lib/controllerWebview.js)
        - client.js – Client facing push extension, loads in the client webview. (lib/webview.js)
        - manifest.json – metadata for the extension
        - native  contains all the native code for the jnext extension.
            - unitTests – contains all the unit tests code using Gmock and Gtest
- test
    - functional – test app spec using jasmine browser tests.
    - test-app  - test app that is deployed using jake deploy-tests
    - unit – unit tests using jasmine. Keeps the same folder structure as the code.
- lib
    - config – Config files generated by packager to present config.xml data to the framework.
    - policy – all the whitelist parsing and rules.
    - public – Files that are bundled together to form webworks.js
    - request.js – Routes APIs to correct extension through server.js and plugins/
    - event.js – eventing framework for the client to controller communication.
    - utils.js – several utilities used by the framework


## How to build an extension?

Extensions are all under the ext/ folder. An extension must at least contain the following -
* manifest.json – metadata for the extension.
* client.js – Front facing API, this is injected into the App's content.
* index.js – Controller loads this part of the API

If your extension requires native C/C++ code, a native JNEXT extension is needed.

There is sample:  https://github.com/blackberry/WebWorks-Community-APIs/tree/master/BB10/TEMPLATE.

For detailed docs please visit
https://developer.blackberry.com/html5/documentation/creating_extensions_for_bb10_apps.html


## Contributing
**To contribute code to this repository you must be [signed up as an official contributor](http://blackberry.github.com/howToContribute.html).**

To add new Samples or make modifications to existing Samples:

1. Fork the **BB10-WebWorks-Framework** repository
2. Make the changes/additions to your fork
3. Send a pull request from your fork back to the **BB10-WebWorks-Framework** repository
4. If you made changes to code which you own, send a message via github messages to one of the Committers listed below to have your code merged.

## Committers
* [Nukul Bhasin](http://github.com/nukulb)
* [Jeffrey Heifetz](http://github.com/jeffheifetz)
* [Chris Del Col](http://github.com/cdelcol)

## Other related Repos
 * [BlackBerry 10 WebWorks Frameowork](https://github.com/blackberry/BB10-WebWorks-Framework)
 * [BlackBerry 10 WebWorks Samples](https://github.com/blackberry/BB10-WebWorks-Samples)
 * [BlackBerry 10 WebWorks Community APIs](https://github.com/blackberry/WebWorks-Community-APIs/tree/master/BB10)
