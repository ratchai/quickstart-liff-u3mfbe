const body = document.getElementById("testtext");
console.log("query string =" + window.location.search);
var urlParams = new URLSearchParams(window.location.search);
const action = urlParams.get("purpose");
