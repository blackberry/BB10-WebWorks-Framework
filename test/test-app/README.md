#Functional Tests Application

run 'jake -T' to see how to use the jake functional test commands

'jake test-app', all tests and dependencies are copied into this application, packagable zip file is produced
'jake deploy-tests' builds test application with packager specified and deploys appliation to the device specified

##Adding new tests
 - Automatic functional tests should have their own file in /test/functional/automatic/
 - Manual functional tests should have their own file in /test/functional/manual/

##Updating the test application (from root folder of application)
 - in config.xml, whitelist the extension you are testing
 
To have jasmine tests (automatic or manual) run in this application you must update the corresponding SpecRunner.htm file
Note: You do not have to move your test files from /test/functional to the spec folder in the project directory of the application (they will be moved there when you run jake)

- in /automatic/SpecRunner.htm add a line including your automatic tests from the /automatic/spec/ folder (inside a script tag)
- in /manual/framework/SpecRuner.htm add a line including your manual tests from the /manual/framework/spec/ folder (inside a script tag)
