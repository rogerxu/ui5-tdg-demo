jQuery.sap.declare("sap.ui.demo.tdg.Component");
jQuery.sap.require("sap.ui.demo.tdg.MyRouter");

sap.ui.core.UIComponent.extend("sap.ui.demo.tdg.Component", {
	metadata: {
		name: "TDG Demo App",
		version: "1.0",
		includes: [],
		dependencies: {
			libs: ["sap.m", "sap.ui.layout"],
			components: []
		},
		rootView: "sap.ui.demo.tdg.view.App",
		config: {
			resourceBundle: "i18n/messageBundle.properties",
			serviceConfig: {
				name: "Northwind",
				serviceUrl: "http://services.odata.org/V2/(S(sapuidemotdg))/OData/OData.svc/"
			}
		},
		routing: {
			config: {
				routerClass: sap.ui.demo.tdg.MyRouter,
				viewType: "XML",
				viewPath: "sap.ui.demo.tdg.view",
				targetAggregation: "detailPages",
				clearTarget: false
			},
			routes: [
				{
					pattern: "",
					name: "main",
					view: "Master",
					targetAggregation: "masterPages",
					targetControl: "idAppControl",
					subroutes: [
						{
							pattern: "{product}/:tab:",
							name: "product",
							view: "Detail"
						}
					]
				},
				{
					name: "catchallMaster",
					view: "Master",
					targetAggregation: "masterPages",
					targetControl: "idAppControl",
					subroutes: [
						{
							pattern: ":all*:",
							name: "catchallDetail",
							view: "NotFound"
						}
					]
				}
			]
		},

		init: function() {
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

			var config = this.getMetadata().getConfig();

			// always use absolute paths relative to our own component
			var rootPath = jQuery.sap.getModulePath("sap.ui.demo.tdg");

			// set i18n model
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: [rootPath, config.resourceBundle].join("/")
			});
			this.setModel(i18nModel, "i18n");

			// create and set domain model to the component
			var serviceUrl = config.serviceConfig.serviceUrl;
			var model = new sap.ui.model.odata.ODataModel(serviceUrl, true);
			this.setModel(model);

			// set device model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone,
				listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
				listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
			});
			deviceModel.setDefaultBindingMode("OneWay");
			this.setModel(deviceModel, "device");

			this.getRouter().initialize();
		}
	}
});
