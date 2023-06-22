"use strict";

(function ($) {
  "use strict";

  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  var prnDt = ' ' + new Date().toLocaleDateString('en-us', options);
  $('#homehoursdate').html(prnDt);
})(jQuery);