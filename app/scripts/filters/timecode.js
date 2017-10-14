/*
Filters format data used in Angular applications. Can be used either directly with an expression in a view, or as an injectable service in the JavaScript logic of other Angular components. Angular has several built-in filters that illustrate the types of intended use cases for filters, like formatting numbers for currency and dates, or strings with a particular capitalization.
*/
(function() {
  function timecode() {
    return function(seconds) {
			var seconds = Number.parseFloat(seconds);

      // condition that checks for NaN
      if (Number.isNaN(seconds)) {
        return '-:--';
      }

      var wholeSeconds = Math.floor(seconds);
      var minutes = Math.floor(wholeSeconds / 60);
      var remainingSeconds = wholeSeconds % 60;

      var output = minutes + ':';

			if (remainingSeconds < 10) {
				output += '0';
			}

      output += remainingSeconds;

      return output;
    };
  }

  angular
    .module('blocJams')
    .filter('timecode', timecode);
})();
