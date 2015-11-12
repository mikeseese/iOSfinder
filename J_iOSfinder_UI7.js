var PingSensor = (function (api) {
	// example of unique identifier for this plugin...
	var uuid = 'A9B3F798-1357-464B-86AD-451C57B69F92';
	var pingsensor_svs = 'urn:demo-ron-seese:serviceId:iOSfinder1';
	var myModule = {};
	
	var deviceID = api.getCpanelDeviceId();
	
	function onBeforeCpanelClose(args){
        console.log('handler for before cpanel close');
    }
    
	function init(){
        // register to events...
        api.registerEventHandler('on_ui_cpanel_before_close', myModule, 'onBeforeCpanelClose');
    }
	
	///////////////////////////
	function address_set(deviceID, varVal) {
	  //set_device_state(deviceID,  pingsensor_svs, 'Address', varVal);
	  api.setDeviceStateVariablePersistent(deviceID, pingsensor_svs, "Address", varVal, 0);
	}
	function address2_set(deviceID, varVal) {
	  //set_device_state(deviceID,  pingsensor_svs, 'Address2', varVal);
	  api.setDeviceStateVariablePersistent(deviceID, pingsensor_svs, "Address2", varVal, 0);
	}
	function address3_set(deviceID, varVal) {
	  //set_device_state(deviceID,  pingsensor_svs, 'Address3', varVal);
	  api.setDeviceStateVariablePersistent(deviceID, pingsensor_svs, "Address3", varVal, 0);
	}

	function update_timeout(deviceID) {
	  var period  = api.getDeviceState(deviceID,  pingsensor_svs, 'Period');
	  var timeout  = api.getDeviceState(deviceID,  pingsensor_svs, 'AllowedFailure')*period;
	  if(isNaN(timeout)) timeout = 0;
	  $('#ping_timeout').val(timeout);
	}

	function timeout_set(deviceID, varVal) {
		if (varVal.search(/^\d+$/) == 0) {
			var period  = api.getDeviceState(deviceID,  pingsensor_svs, 'Period');
		var timeout = Math.round(varVal/period);
		if(isNaN(timeout)) timeout = 0;
			//set_device_state(deviceID,  pingsensor_svs, 'AllowedFailure', timeout);
			api.setDeviceStateVariable(deviceID, pingsensor_svs, "AllowedFailure", varVal, 0);
		} else {
			$('#ping_timeout').val("");
		}
	}
	
	function period_set(deviceID, varVal) {
		if (varVal.search(/^\d+$/) == 0) {
			//set_device_state(deviceID,  pingsensor_svs, 'Period', varVal);
			api.setDeviceStateVariable(deviceID, pingsensor_svs, "Period", varVal, 0);
		timeout_set(deviceID, $('#ping_timeout').val());
		update_timeout(deviceID);
		} else {
			$('#ping_period').val("");
		}
	}
	
	function ReloadEngine(){
		api.luReload();
	}
	
	function PingSensorSettings(deviceID) {
		try {
			init();
			
			var period  = api.getDeviceState(deviceID,  pingsensor_svs, 'Period');
			var address  = api.getDeviceState(deviceID,  pingsensor_svs, 'Address');
			var timeout  = api.getDeviceState(deviceID,  pingsensor_svs, 'AllowedFailure')*period;
			var address2  = api.getDeviceState(deviceID,  pingsensor_svs, 'Address2');
			var address3  = api.getDeviceState(deviceID,  pingsensor_svs, 'Address3');
			
			if(isNaN(timeout)) timeout = 0;

			var html =  '<table>' +
			' <tr><td>Address </td><td><input  type="text" id="ping_address" size=10 value="' +  address + '" onchange="PingSensor.address_set(' + deviceID + ', this.value);"></td></tr>' +
			  ' <tr><td>Address2 </td><td><input  type="text" id="ping_address2" size=10 value="' +  address2 + '" onchange="PingSensor.address2_set(' + deviceID + ', this.value);"></td></tr>' +
			  ' <tr><td>Address3 </td><td><input  type="text" id="ping_address3" size=10 value="' +  address3 + '" onchange="PingSensor.address3_set(' + deviceID + ', this.value);"></td></tr>' +
				' <tr><td>Poll Period </td><td><input  type="text" id="ping_period" size=10 value="' +  period + '" onchange="PingSensor.period_set(' + deviceID + ', this.value);"> seconds</td></tr>' +
				' <tr><td>Device Timeout </td><td><input type="text" id="ping_timeout" size=10 value="' +  timeout + '" onblur="PingSensor.update_timeout(' + deviceID + ');" onchange="PingSensor.timeout_set(' + deviceID + ', this.value);"> seconds</td></tr>' +
				'</table>';
			html += '<input type="button" value="Save and Reload" onClick="PingSensor.ReloadEngine()"/>';
			api.setCpanelContent(html);
			//set_panel_html(html);
		} catch (e) {
            Utils.logError('Error in PingSensor.PingSensorSettings(): ' + e);
        }
	}
	///////////////////////////
	myModule = {
		uuid: uuid,
		init : init,
		onBeforeCpanelClose: onBeforeCpanelClose,
		PingSensorSettings : PingSensorSettings,
		address_set: address_set,
		address2_set: address2_set,
		address3_set: address3_set,
		period_set: period_set,
		timeout_set: timeout_set,
		ReloadEngine: ReloadEngine,
		update_timeout: update_timeout
	};

	return myModule;

})(api);


//*****************************************************************************
// Extension of the Array object:
//  indexOf : return the index of a given element or -1 if it doesn't exist
//*****************************************************************************
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (element /*, from*/) {
        var len = this.length;

        var from = Number(arguments[1]) || 0;
        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === element) {
                return from;
            }
        }
        return -1;
    };
}