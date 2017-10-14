/*
A controller is a JavaScript object created by a constructor function.
Controllers contain the "business logic" that apply functions and values to the scope.
When Angular instantiates a new Controller object, a child scope is created and made available as an injectable parameter to the Controller's constructor function as $scope.

We should only use a controller for two things:
1. To initialize the state of the $scope object.
2. To add behavior to the $scope object.
*/
(function() {
  function LandingCtrl() {  // The name of the controller
		this.heroTitle = "Turn the Music Up!";
  }

  angular
    .module('blocJams')
    .controller('LandingCtrl', LandingCtrl);  // A callback function or an array that injects dependencies, with a callback function as the last item in the array
})();
