#BB10 WebWorks Jasmine Functional Tests
#### Automated Testing on a Blackberry Tablet

### Requirements
- Playbook device/simulator
- node & npm

### Instructions
###### Setup
`~ ./configure`<br/>

###### Configuration
- Open `job.js` and edit 
  - variables `DEVICE_IP` & `DEVICE_PASSWORD` & `LOCAL_PACKAGER`
- Open `widget/config.xml` and edit 
  - Whitelist your features/extensions
  - `<content src="http://<server-hostname-ip>:3000">`
  - `<access uri="http://<server-hostname-ip>:3000">`
- Open `public/index.html` and edit the specs to import
  - e.g. `<script type="text/javascript" src="spec/blackberry.app.js"></script>`

###### Run server
`~ node app.js`

### How to use
###### Testing on your local machine
- Make sure `LOCAL_PACKAGER` has been specified as the absolute path to your Webworks Packager
- Use Browser 
###### Testing using Hudson
Send a HTTP GET request to 
`http://<server-hostname-ip>/run/<job-name-on-hudson>`
and expect response to be results of tests.
and visit site `http://<server-hostname-ip>/run`
