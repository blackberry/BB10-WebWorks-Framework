BBX-Framework Setup
---------------------------

For Mac:

1. Install Ripple

2. git clone https://github.com/blackberry-webworks/BBX-Framework.git

3. git checkout next

4. ./configure (sudo ./configure if you get permission errors)

5. cd BBX-Framework\dependencies\BBX-Emulator

6. Start emulator server on port 8475 with:
    jake 
7. Send a command to start Ripple with: 
    curl http://localhost:8475/webview/create
