jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
jQuery.sap.require("sap.ui.core.routing.Router");
jQuery.sap.declare("sap.ui.demo.tdg.MyRouter");

sap.ui.core.routing.Router.extend("sap.ui.demo.tdg.MyRouter", {

	constructor: function() {
		sap.ui.core.routing.Router.apply(this, arguments);
		this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this);
	},

	myNavBack: function(route, data) {
		var history = sap.ui.core.routing.History.getInstance();
		var previousHash = history.getPreviousHash();

		// The history contains a previous entry
		if (previousHash !== undefined) {
			window.history.go(-1);
		} else {
			var replace = true; // otherwise we go backwards with a forward history
			this.navTo(route, data, replace);
		}
	},

	myNavToWithoutHash: function(options) {
		var splitApp = this._findSplitApp(options.currentView);

		// load view, add it to the page aggregation, and navigate to it
		var view = this.getView(options.targetViewName, options.targetViewType);
		splitApp.addPage(view, options.isMaster);
		splitApp.to(view.getId(), options.transition || "show", options.data);
	},

	backWithoutHash: function(currentView, isMaster) {
		var backMethod = isMaster ? "backMaster" : "backDetail";
		this._findSplitApp(currentView)[backMethod]();
	},

	destroy: function() {
		sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
		this._oRouteMatchedHandler.destroy();
	},

	_findSplitApp: function(control) {
		var ancestorControlName = "idAppControl";

		if (control instanceof sap.ui.core.mvc.View && control.byId(ancestorControlName)) {
			return control.byId(ancestorControlName);
		}

		return control.getParent() ? this._findSplitApp(control.getParent(), ancestorControlName) : null;
	}
});
