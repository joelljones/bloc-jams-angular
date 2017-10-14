(function() {
  function seekBar($document) {
  // calculates the horizontal percent along the seek bar where the event (passed in from the view as  $event) occurred
	var calculatePercent = function(seekBar, event) {
		var offsetX = event.pageX - seekBar.offset().left;
		var seekBarWidth = seekBar.width();
		var offsetXPercent = offsetX / seekBarWidth;
		offsetXPercent = Math.max(0, offsetXPercent);
		offsetXPercent = Math.min(1, offsetXPercent);
		return offsetXPercent;
	};

		return {
      // Specifies a URL from which the directive will load a template
			templateUrl: '../../templates/directives/seek_bar.html',  // specifies the path to the HTML template that the directive will use
      /*
      Specifies what the template should replace. If true, the template replaces the directive's element. If false, the template replaces the contents of the directive's element.
      */
      replace: true,  // instructs Angular to completely replace the <seek-bar> element with the directive's HTML template rather than insert the HTML between the  <seek-bar></seek-bar> tags
      /*
      Restricts the directive to a specific declaration style: element E, attribute A, class C, and comment M. If omitted, the defaults (E and A) are used. Multiple restrictions are stringed together, for example AE or AEC.
      */
      restrict: 'E',  // instructs Angular to treat this directive as an element. For example, Angular will run the code if it finds <seek-bar> in the HTML, but not if it finds  <div seek-bar>
      // Specifies that a new scope be created for the directive
			scope: {
				onChange: '&' // the & binding type provides a way to execute an expression in the context of the parent scope
			},
      // Responsible for registering DOM listeners and updating the DOM. This is where we put most of the directive logic.
      /*
      The link function is automatically generated and scoped to the element defining the directive. Think of it as a function that executes when the directive is instantiated in the view. This is where all logic related to DOM manipulation will go.
      */
      /*
      The link method's first argument is its scope object. Attributes and methods on the scope object are accessible within the directive's view.
      The second argument is the jqLite-wrapped element that the directive matches.
      The third argument is a hash of attributes with which the directive was declared. If we declare <seek-bar> with no attributes in the HTML, then this hash will be empty.
      */
      link: function(scope, element, attributes) {
				// directive logic to return
        // holds the value of the seek bar, such as the currently playing song time or the current volume
				scope.value = 0;  // default value is 0
        // Holds the maximum value of the song and volume seek bars
				scope.max = 100;  // default value is 100

        // holds the element that matches the directive (<seek-bar>) as a jQuery object so we can call jQuery methods on it
				var seekBar = $(element);

				attributes.$observe('value', function(newValue) {
					scope.value = newValue;
				});

				attributes.$observe('max', function(newValue) {
					scope.max = newValue;
				});

        // function that calculates a percent based on the value and maximum value of a seek bar
        var percentString = function () {
					var value = scope.value;
					var max = scope.max;
					var percent = value / max * 100;
					return percent + "%";
				};

        // returns the width of the seek bar fill element based on the calculated percent
				scope.fillStyle = function() {
					return {width: percentString()};
				};

        // updates the seek bar value based on the seek bar's width and the location of the user's click on the seek bar
				scope.onClickSeekBar = function(event) {
					var percent = calculatePercent(seekBar, event);
					scope.value = percent * scope.max;
					notifyOnChange(scope.value);
				};

        // similar to scope.onClickSeekBar, but uses $apply to constantly apply the change in value of  scope.value as the user drags the seek bar thumb
				scope.trackThumb = function() {
					$document.bind('mousemove.thumb', function(event) {
						var percent = calculatePercent(seekBar, event);
						scope.$apply(function() {
							scope.value = percent * scope.max;
							notifyOnChange(scope.value);
						});
					});

					$document.bind('mouseup.thumb', function() {
						$document.unbind('mousemove.thumb');
						$document.unbind('mouseup.thumb');
					});
				};

				var notifyOnChange = function(newValue) {
          /*
          Test to make sure that scope.onChange is a function. If a future developer fails to pass a function to the on-change attribute in the HTML, the next line will not be reached, and no error will be thrown
          */
					if (typeof scope.onChange === 'function') {
            /*
            Pass a full function call to the on-change attribute in the HTML –  scope.onChange() calls the function in the attribute
            The function passed in the HTML has an argument, value, which isn't defined in the view (remember that it's not the same as scope.value). Using built-in Angular functionality, specify the value of this argument using hash syntax. Effectively telling Angular to insert the local newValue variable as the value argument passed into the SongPlayer.setCurrentTime() function called in the view.
            */
						scope.onChange({value: newValue});
					}
				};

        // updates the position of the seek bar thumb
				scope.thumbStyle = function() {
					return {left: percentString()};
				};
        	}
    	};
    }

  angular
      .module('blocJams')
      .directive('seekBar', ['$document', seekBar]);
})();
