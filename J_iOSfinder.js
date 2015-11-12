var pingsensor_svs = 'urn:demo-ron-seese:serviceId:iOSfinder1';

function pingsensor_settings(deviceID) {
    var period  = get_device_state(deviceID,  pingsensor_svs, 'Period');
    var address  = get_device_state(deviceID,  pingsensor_svs, 'Address');
    var timeout  = get_device_state(deviceID,  pingsensor_svs, 'AllowedFailure')*period;
    
    if(isNaN(timeout)) timeout = 0;

    var html =  '<table>' +
	' <tr><td>Address </td><td><input  type="text" id="ping_address" size=10 value="' +  address + '" onchange="address_set(' + deviceID + ', this.value);"></td></tr>' +
        ' <tr><td>Poll Period </td><td><input  type="text" id="ping_period" size=10 value="' +  period + '" onchange="period_set(' + deviceID + ', this.value);"> seconds</td></tr>' +
        ' <tr><td>Device Timeout </td><td><input type="text" id="ping_timeout" size=10 value="' +  timeout + '" onblur="update_timeout(' + deviceID + ');" onchange="timeout_set(' + deviceID + ', this.value);"> seconds</td></tr>' +
        '</table>';
    set_panel_html(html);
}

function address_set(deviceID, varVal) {
  set_device_state(deviceID,  pingsensor_svs, 'Address', varVal);
}

function period_set(deviceID, varVal) {
    if (varVal.search(/^\d+$/) == 0) {
        set_device_state(deviceID,  pingsensor_svs, 'Period', varVal);
	timeout_set(deviceID, $('ping_timeout').value);
	update_timeout(deviceID);
    } else {
        $('ping_period').value = "";
    }
}

function update_timeout(deviceID) {
  var period  = get_device_state(deviceID,  pingsensor_svs, 'Period');
  var timeout  = get_device_state(deviceID,  pingsensor_svs, 'AllowedFailure')*period;
  if(isNaN(timeout)) timeout = 0;
  $('ping_timeout').value = timeout;
}

function timeout_set(deviceID, varVal) {
    if (varVal.search(/^\d+$/) == 0) {
    	var period  = get_device_state(deviceID,  pingsensor_svs, 'Period');
	var timeout = Math.round(varVal/period);
  	if(isNaN(timeout)) timeout = 0;
        set_device_state(deviceID,  pingsensor_svs, 'AllowedFailure', timeout);
    } else {
        $('ping_timeout').value = "";
    }
}
