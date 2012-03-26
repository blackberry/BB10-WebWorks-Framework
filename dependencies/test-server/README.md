#BB10 WebWorks Jasmine Functional Tests
#### Automated Testing on a Blackberry Tablet

### Requirements
- Playbook device/simulator
- node & npm

### Instructions
###### Setup
`~ git clone http://adrilee@github.rim.net/adrilee/BB10-WebWorks-BrowserTest.git`<br/>
`~ ./configure`<br/>
###### Configure server
Open `lib/job.js` and edit the varibles `DEVICE_IP` & `DEVICE_PASSWORD`
###### Run server
`node app.js`

### How to use
Send a HTTP GET request to 
`http://<server-hostname-ip>/job/<job-name-on-hudson>`
and expect response to be results of tests.


### Todo

- config.xml generator
- document.body as HTTP GET response
- hook up to Hudson CI