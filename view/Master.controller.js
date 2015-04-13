jQuery.sap.require("sap.ui.demo.tdg.util.Formatter");

sap.ui.core.mvc.Controller.extend("sap.ui.demo.tdg.view.Master", {

	onInit: function() {
		this.oUpdateFinishedDeferred = jQuery.Deferred();

		this.getView().byId("list").attachEventOnce("updateFinished", function() {
			this.oUpdateFinishedDeferred.resolve();
		}, this);

		this.getRouter().attachRoutePatternMatched(this.onRouterMatched, this);
	},

	onRouterMatched: function(event) {
		var list = this.getView().byId("list");
		var name = event.getParameter("name");
		var oArguments = event.getParameter("arguments");

		// wait for the list to be loaded
		jQuery.when(this.oUpdateFinishedDeferred).then(jQuery.proxy(function() {
			var items;

			// on the empty hash select the first item
			if (name ==="main") {
				this.selectDetail();
			}

			// try to select the item in the list
			if (name === "product") {
				items = list.getItems();
				for (var i = 0; i < items.length; i++) {
					if (items[i].getBindingContext().getPath() === "/" + oArguments.product) {
						list.setSelectedItem(items[i], true);
						break;
					}
				}
			}
		}, this);
	},

	selectDetail: function() {
		if (!sap.ui.Device.system.phone) {
			var list = this.getView().byId("list");
			var items = list.getItems();
			if (items.length && !list.getSelectedItem()) {
				list.setSelectedItem(items[0], true);
				this.showDetail(items[0]);
			}
		}
	},

	onSearch: function() {
		// add filter for search
		var filters = [];
		var searchString = this.getView().byId("searchField").getValue();
		if (searchString && searchString.length > 0) {
			filters = [new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, searchString)];
		}

		// update list binding
		this.getView().byId("list").getBinding("items").filter(filters);
	},

	onSelect: function(event) {
		// get the list item, either form the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode).
		this.showDetail(event.getParameter("listItem") || event.getSource());
	},

	showDetail: function(item) {
		// if we're on a phone, include nav in history; if not, don't.
		var replace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("product", {
			from: "master",
			product: item.getBindingContext().getPath().substr(1),
			tab: "supplier"
		}, replace);
	},

	onAddProduct: function() {
		sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "sap.ui.demo.tdg.view.AddProduct",
			targetViewType: "XML",
			transition: "slide"
		});
	}
});
