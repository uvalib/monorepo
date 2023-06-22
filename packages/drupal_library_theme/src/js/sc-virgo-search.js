function searchVirgo4() {
  var query = encodeURIComponent(document.getElementById("scQuery").value);
  var url = `https://search.lib.virginia.edu/?mode=advanced&q=keyword:%20{${query}}&pool=uva_library&filter=%7B%22FilterLibrary%22%3A%5B%22Special%20Collections%22%5D%7D`;
  location = url;
  return false;
};

function searchVirgo4Libra() {
    var query = encodeURIComponent(document.getElementById("libraQuery").value);
    var url = `https://search.lib.virginia.edu/?mode=advanced&q=keyword:%20{${query}}&pool=uva_library&filter=%7B%22FilterDigitalCollection%22%3A%5B%22Libra%20Data%20Repository%22%2C%22Libra%20ETD%20Repository%22%2C%22Libra%20Open%20Repository%22%5D%7D`;
    location = url;
    return false;
};