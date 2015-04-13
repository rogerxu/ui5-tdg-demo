sap.ui.core.mvc.Controller.extend("sap.ui.demo.tdg.view.Detail", {

	onInit: function() {
		var view = this.getView();

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(event) {
			// when detail navigation occurs, update the binding context
			if (event.getParameter("name") === "product") {
				var productPath = "/" + event.getParameter("arguments").product;
				view.bindElement(productPath);

				// check that the product specified actually was found
				view.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
					var data = view.getModel().getData(productPath);
					if (!data) {
						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							currentView: view,
							targetViewName: "sap.ui.demo.tdg.view.NotFound",
							targetViewType: "XML"
						});
					}
				}, this));

				// make sure the master is here
				var iconTabBar = view.byId("idIconTabBar");
				iconTabBar.getItems().forEach(function(item) {
					item.bindElement(sap.ui.demo.tdg.util.Formatter.uppercaseFirstChar(item.getKey()));
				});

				// which tab?
				var tabKey = parameters.arguments.tab || "supplier";
				if (iconTabBar.getSelectedKey() !== tabKey) {
					iconTabBar.setSelectedKey(tabKey);
				}
			}
		}, this);
	},

	onNavBack: function() {
		// this is only relevant wen running on phone devices
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("main");
	},

	onDetailSelect: function(event) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("product", {
			product: event.getSource().getBindingContext().getPath().slice(1),
			tab: event.getParameter("selectedKey")
		}, true);
	},

	onRouteMatched: function(event) {
		var parameters = event.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {
			var view = this.getView();

			// when detail navigation occurs, update the binding context
			if (parameters.name !== "product") {
				return;
			}

			var productPath = "/" + parameters.arguments.product;
			this.bindView(productPath);

			var iconTabBar = view.byId("idIconTabBar");
			iconTabBar.getItems().forEach(function(item) {
				item.bindElement(sap.ui.demo.tdg.util.Formatter.uppercaseFirstChar(item.getKey()));
			});

			// which tab?
			var tabKey = parameters.arguments.tab || "supplier";
			this.getEventBus().publish("Detail", "TabChanged", {tabKey: tabKey});

			if (iconTabBar.getSelectedKey() !== tabKey) {
				iconTabBar.setSelectedKey(tabKey);
			}
		}, this));
	},

	bindView: function(productPath) {
		var view = this.getView();
		vew.bindElement(productPath);

		// check if the data is already on the client
		if (!view.getModel().getData(productPath)) {
			// check that the product specified actually was found
			view.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var data = view.getModel().getData(productPath);
				if (!data) {
					this.showEmptyView();
					this.fireDetailNotFound();
				} else {
					this.fireDetailChanged(productPath);
				}
			}, this));
		} else {
			this.fireDetailChanged(productPath);
		}
	}
});
