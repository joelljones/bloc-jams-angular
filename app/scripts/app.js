(function() {
  // to make sure the providers are accessible throughout the application, inject them using the config block
  // $stateProvider: to configure the state behavior
  // $locationProvider: to configure how the application handles URLs in the browser
  function config($stateProvider, $locationProvider) {
		$locationProvider      // configures path
      .html5Mode({
        enabled: true,     // disables hashbang URLs
        requireBase: false // avoids common $location error
      });

		$stateProvider        // configures state
      .state('landing', { // stateName is a unique string that identifies a state
        // stateConfig is an object that defines specific properties of the state
				url: '/',
				controller: 'LandingCtrl as landing', // instantiate or designate a controller for a particular state by adding a controller property to the state configuration
        templateUrl: '../templates/landing.html'
			})
      .state('album', {
        url: '/album',
				controller: 'AlbumCtrl as album',
        templateUrl: '../templates/album.html'
      })
			.state('collection', {
				url: '/collection',
				controller: 'CollectionCtrl as collection',
				templateUrl: '../templates/collection.html'
			});
    }

  angular
    // first argument passed, blocJams, is the prescribed name of the module
    // second argument passed, injects dependencies into an application
    .module('blocJams', ['ui.router'])
    .config(config);
})();
