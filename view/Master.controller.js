{
	onInit: function() {

		// on phones, we will not have to select anything in the list so we don't need to attach to events
		if (sap.ui.Device.system.phone) {
			return;
		}

		this.getRouter().attachRoutePatternMatched(this.onRouterMatched, this);
	},

	onRouterMatched: function(event) {
		var name = event.getParameter("name");

		if (name !== "main") {
			return;
		}

		// load the detail view in desktop
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "sap.ui.demo.tdg.view.Detail",
			targetViewType: "XML"
		})

		// wait for the list to be loaded once
		this.waitForInitialListLoading(function() {
			// on the empty hash selected the first item
			this.selectFirstItem();
		});
	}

}
