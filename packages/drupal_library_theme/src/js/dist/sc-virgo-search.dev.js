"use strict";

function searchVirgo4() {
  var query = encodeURIComponent(document.getElementById("scQuery").value);
  var url = "https://search.lib.virginia.edu/?mode=advanced&q=keyword:%20{".concat(query, "}&pool=uva_library&filter=%7B%22FilterLibrary%22%3A%5B%22Special%20Collections%22%5D%7D");
  location = url;
  return false;
}

;