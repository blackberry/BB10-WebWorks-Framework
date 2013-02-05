function changeValues()
{
	blackberry.connection.type = 10;
	blackberry.connection.BB = 10;
	blackberry.connection.BLUETOOTH_DUN = 10;
	blackberry.connection.CELLULAR = 10;
	blackberry.connection.ETHERNET = 10;
	blackberry.connection.NONE = 10;
	blackberry.connection.UNKNOWN = 10;
	blackberry.connection.USB = 10;
	blackberry.connection.VPN = 10;
	blackberry.connection.WIFI = 10;
}

function onConnectionChange(info) {
	alert("Previous connection type: " + info.oldType + ". New connection type: " + info.newType);
}

function onBatteryStatusChange(info) {
  alert("Status Change Listener - Battery level: " + info.level + ". Battery status: " + info.isPlugged + ".");
}