jQuery.sap.declare("sap.ui.demo.tdg.util.Formatter");

sap.ui.demo.tdg.util.Formatter = {

	uppercaseFirstChar: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},

	discontinuedStatusState: function(sDate) {
		return sDate ? "Error" : "None";
	},

	discontinuedStatusValue: function(sDate) {
		return sDate ? "Discontinued" : "";
	},

	currencyValue: function(value) {
		return parseFloat(value).toFixed(2);
	}

};
