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

12. Run 'jake' or 'jake build' and check that a zip file named "BBXwebworks.zip" is created under the "target" subfolder


For Windows:

1. Install Ripple

2. Follow npm install instructions:
    http://npmjs.org/doc/README.html#Installing-on-Windows-Experimental

3. Install the latest node.exe for Windows (Currently 0.5.10):
    http://nodejs.org/#download
    
4. Download Info-ZIP's zip.exe from ftp://ftp.info-zip.org/pub/infozip/win32/zip300xn.zip

5. Add the folder that contains zip.exe to the PATH environment variable. Type "zip" in command prompt to verify the setting.
    
6. git clone https://github.com/blackberry-webworks/BBX-Framework.git

7. cd BBX-Framework

8. git checkout next

9. Run configure.bat 
    (If you have trouble with npm install express, get it from here: 
        git clone http://git.rim.net/rcruz/BBX-Framework.git )

10. Open git shell, navigate to BBX-Framework and run:
    git submodule update --init

11. Run the unit tests:
    jake test

12. Run 'jake' or 'jake build' and check that a zip file named "BBXwebworks.zip" is created under the "target" subfolder
