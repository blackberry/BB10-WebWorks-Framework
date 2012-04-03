BBX-Framework Setup
---------------------------

For Mac:

1. Install Ripple

2. git clone https://github.com/blackberry-webworks/BBX-Framework.git

3. cd BBX-Framework

4. git checkout next

5. ./configure (sudo ./configure if you get permission errors)

6. cd BBX-Framework\dependencies\BBX-Emulator

7. Start emulator server on port 8472 with:
    jake start
8. Send a command to start Ripple with: 
    curl http://localhost:8472/webview/create
9. Check that Ripple starts up.

10. cd back to BBX-Framework\

11. Run 'jake test' and check that jake runs and completes

12. Run 'jake' or 'jake build' and check that the output folder is created under the "target/zip" subfolder


For Windows:

1. Install Ripple

2. Follow npm install instructions:
    http://npmjs.org/doc/README.html#Installing-on-Windows-Experimental

3. Install the latest node.exe for Windows (Currently 0.5.10):
    http://nodejs.org/#download
    
4. git clone https://github.com/blackberry-webworks/BBX-Framework.git

5. cd BBX-Framework

6. git checkout next

7. Run configure.bat 
    (If you have trouble with npm install express, get it from here: 
        git clone http://git.rim.net/rcruz/BBX-Framework.git )

8. Open git shell, navigate to BBX-Framework and run:
    git submodule update --init

9. Run the unit tests:
    jake test

10. Run 'jake' or 'jake build' and check that the output folder is created under the "target/zip" subfolder
