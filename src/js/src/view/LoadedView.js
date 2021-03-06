/*global window:true, _:true, Backbone:true, jQuery:true, umobile:true, config:true, Handlebars:true, console:true */
(function ($, _, Backbone, umobile, config) {
	'use strict';

	/**
	Class abstraction. Defines properties and methods
	for all loaded views.

	@class LoadedView
	@submodule view
	@namespace view
	@constructor
	**/
	umobile.view.LoadedView = umobile.view.Base.extend({
		/**
		Property houses the name of the loaded view.

		@property name
		@type String
		**/
		name: 'base',

		/**
		Property houses root DOM element.

		@property el
		@type Object
		**/
		el: '#view',

		/**
		Method returns the name of the loaded view.

		@method getViewName
		@return {String} Name of the loaded view.
		**/
		getViewName: function () {
			return this.name;
		},

		/**
		Method is meant to be overwritten. This method is
		a placeholder for child views to place their custom
		view error content.

		@method renderError
		**/
		renderError: function () {},

		/**
		Method is meant to be overwritten. This method is
		a placeholder for child views to place their custom
		view content.

		@method renderContent
		@param {Object} collection Reference to ModuleCollection.
		**/
		renderContent: function (collection) {},

		/**
		Method shows the loading mask when switching views.

		@method showLoader
		**/
		showLoader: function () {
			var loader = $('#contentLoader');
			loader.show();
		},

		/**
		Method hides the loading mask when switching views.

		@method hideLoader
		**/
		hideLoader: function () {
			var loader = $('#contentLoader');
			loader.fadeOut();
		},

		/**
		Method renders the UI for all loaded views.

		@method render
		@override Base
		@return {Object} Reference to loaded view.
		**/
		render: function () {
			// Loader.
			this.showLoader();

			// Define & Initialize.
			var collection = this.moduleCollection.toJSON(),
				viewManager = umobile.app.viewManager,
				currentView = viewManager.currentView.getViewName();

			// The render method gets called numerous time in the present architecture.
			// We only want to move forward when actual data is available.
			if (!_.isEmpty(collection)) {

				// We want to make sure we are not calling loaded views that have
				// been unloaded. To insure this, we compare the current view name
				// on the 'this' object with the view stored in the ViewManager.
				// The ViewManager will always have the correct view to load.
				if (this.getViewName() === currentView) {
					// Render main template.
					this.$el.addClass('hidden')
						.html(this.template(this.options))
						.removeClass('hidden');

					// Render custom content for the loaded view.
					if (collection[0].fname === 'fname') {
						this.renderError();
					} else {
						this.renderContent(collection);
					}

					// Append '#view' to '#viewLoader'.
					$('#viewLoader').append(this.$el);

					// Delegate Events.
					this.delegateEvents(this.events);

					// Loader.
					this.hideLoader();
				}
			}

			return this;
		},

		/**
		Method is triggered when the Module Collection is reset.

		@method onCollectionReset
		@override Base
		**/
		onCollectionReset: function () {
			this.render();
		}

	});

})(jQuery, _, Backbone, umobile, config);