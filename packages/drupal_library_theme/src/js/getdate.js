(function ($) {
	"use strict";

	var options = { weekday: "long", month: "long", day: "numeric" };
	var prnDt = " " + new Date().toLocaleDateString("en-us", options);
	$("#homehoursdate").html(prnDt);

	var getYear = new Date().getFullYear();
	$(".currentYear").html(getYear);
})(jQuery);

/*{ 
  EVENTS STYLING FOR DATE
  <p class=“event-date”>
    <span id="homehoursMonth"></span>
    <span id="homehoursDay"></span> 
    <span id="homehoursWeekDay"></span>
	</p>
*/

// (function ($) {
// 	"use strict";
// 	var optionswkday = { weekday: "short" };
// 	var optionsmonth = { month: "short" };
// 	var optionsday = { day: "numeric" };
// 	var prnDay = new Date().toLocaleDateString("en-us", optionsday) + ",";
// 	var prnMonth = " " + new Date().toLocaleDateString("en-us", optionsmonth);
// 	var prnWkDay = " " + new Date().toLocaleDateString("en-us", optionswkday);
// 	$("#homehoursDay").html(prnDay);
// 	$("#homehoursMonth").html(prnMonth);
// 	$("#homehoursWeekDay").html(prnWkDay);
// })(jQuery);
