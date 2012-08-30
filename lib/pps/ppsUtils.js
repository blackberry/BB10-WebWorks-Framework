/*
 * Copyright 2010-2011 Research In Motion Limited.
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

JNEXT.PPS_RDONLY = "0";
JNEXT.PPS_WRONLY = "1";
JNEXT.PPS_RDWR = "2";
//NOTE: O_CREAT flag is actually 0x100 (256 decimal), not '400' as is
// implied by trunk/lib/c/public/fcntl.h.
JNEXT.PPS_CREATE = "256";
JNEXT.PPS_RDWR_CREATE = "258";

JNEXT.PPS = function()
{
    var self = this;
    var ppsObj = {};
    var m_strObjId;
    
    self.open = function( strPPSPath, mode, opts ) {
		// LOL
		var opts_str = "";
		
		if(opts) 
			opts_str = " " + opts;
		
		var parameters = strPPSPath + " " + mode + opts_str; 
        var strVal = JNEXT.invoke( self.m_strObjId, "Open", parameters);
        
        var arParams = strVal.split( " " );
        return ( arParams[ 0 ] == "Ok" );
    };
    
    self.read = function() {
    	// Read a line from the file that was previously opened
        var strVal = JNEXT.invoke( self.m_strObjId, "Read" );
        var arParams = strVal.split( " " );
        if ( arParams[ 0 ] != "Ok" ) {
            return null;
        }
		
		var json = strVal.substr( arParams[0].length + 1 );
        //alert('ppsObj ' + json);
        self.ppsObj = JSON.parse(json);
        
        return self.ppsObj;
    };
      
    self.write = function(obj) {
		var jstr = JSON.stringify(obj);
		var strVal = JNEXT.invoke(self.m_strObjId, "Write", jstr);
        var arParams = strVal.split( " " );
        return ( arParams[ 0 ] == "Ok" );
    }
    
    self.close = function() {
        strRes = JNEXT.invoke( self.m_strObjId, "Close" );
        strRes = JNEXT.invoke( self.m_strObjId, "Dispose" );
        JNEXT.unregisterEvents( self );
    };
    
    self.readPPSObject = function(pathToPPS, callback, options) {
        var ppsData = {},
            result;
            
        try {
            self.init();
            if (self.open(pathToPPS, "0", options)) {
                result = self.read();
                if (result) {
                    ppsData = result;
                }
            }
        } finally {
            self.close();
        }
        
        callback(ppsData);
    };
    
    self.getId = function() {
        return self.m_strObjId;
    };
    
    self.onEvent = function( strData ) {
        var arData = strData.split( " " );
        var strEventDesc = arData[ 0 ];
        switch ( strEventDesc )
        {
            case "Error":
            {
                self.onError();
                break;
            }
            
            case "OnChange":
            {
				var jsonData = strData.substr(strEventDesc.length + 1);
				var data = JSON.parse(jsonData);
				//alert('onChange w/data ' + data);
				self.read(); // update pps object 
				if (self.onChange != null)
				{
					self.onChange(data);
				}
				break;
            }
        }
    };
    
    self.onError = function()
    {
        alert( "onError" );
    };
    
    self.init = function() {
        if ( !JNEXT.require( "pps" ) ) {
	    	alert("no pps");
            return false;
        }
        
        self.m_strObjId = JNEXT.createObject( "pps.PPS" );
        if ( self.m_strObjId == "" )  {
            alert( "error initializing pps" );
            return false;
        }
        
        JNEXT.registerEvents( self );
    };
    
    //self.m_strObjId = "";
    //self.init();
    
    return self;
    
};

module.exports = {createObject : function () {return new JNEXT.PPS()}};
