// Import stylesheets
//import "./style.css";

// Body element
const body = document.getElementById("body");

// Button elements
const btnSend = document.getElementById("btnSend");
const btnClose = document.getElementById("btnClose");
const btnShare = document.getElementById("btnShare");
const btnLogIn = document.getElementById("btnLogIn");
const btnLogOut = document.getElementById("btnLogOut");
const btnScanCode = document.getElementById("btnScanCode");
const btnOpenWindow = document.getElementById("btnOpenWindow");

// Profile elements
const email = document.getElementById("email");
const userId = document.getElementById("userId");
const pictureUrl = document.getElementById("pictureUrl");
const statusMessage = document.getElementById("statusMessage");

// QR element
const code = document.getElementById("code");
const friendShip = document.getElementById("friendShip");

//custom design part
const timeDisplay = document.getElementById("time");
const dateDisplay = document.getElementById("date");
const greetingText = document.getElementById("greeting");
var profile;
var userlocation;

async function getUserProfile() {
  //pictureUrl.src = profile.pictureUrl;
  greetingText.innerHTML = "สวัสดีคุณ" + profile.displayName;
}

function refreshTime() {
  //test//
  var options = { dateStyle: "long", timeStyle: "medium" };
  var dateString = new Date().toLocaleString("th-TH", options);
  var formattedTimeString = dateString.substring(dateString.length - 8);
  var formattedDateString = dateString.substring(0, dateString.length - 8);
  // formattedDateString = formattedDateString.replace("256", "6");
  formattedTimeString = formattedTimeString.replace(/:/g, " : ");
  timeDisplay.innerHTML = formattedTimeString;
  dateDisplay.innerHTML = formattedDateString;
  dateDisplay.innerHTML = formattedDateString;
}

setInterval(refreshTime, 1000);

var map, infoWindow, marker;

function CustomMarker(latlng, map, imageSrc) {
  this.latlng_ = latlng;
  this.imageSrc = imageSrc;
  // Once the LatLng and text are set, add the overlay to the map.  This will
  // trigger a call to panes_changed which should in turn call draw.
  this.setMap(map);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function() {
  // Check if the div has been created.
  var div = this.div_;
  if (!div) {
    // Create a overlay text DIV
    div = this.div_ = document.createElement("div");
    // Create the DIV representing our CustomMarker
    div.className = "customMarker";

    var img = document.createElement("img");
    img.src = this.imageSrc;
    div.appendChild(img);
    var me = this;
    google.maps.event.addDomListener(div, "click", function(event) {
      google.maps.event.trigger(me, "click");
    });

    // Then add the overlay to the DOM
    var panes = this.getPanes();
    panes.overlayImage.appendChild(div);
  }

  // Position the overlay
  var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
  if (point) {
    div.style.left = point.x + "px";
    div.style.top = point.y + "px";
  }
};

CustomMarker.prototype.remove = function() {
  // Check if the overlay was on the map and needs to be removed.
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

CustomMarker.prototype.getPosition = function() {
  return this.latlng_;
};

function initMap(profileimageURL) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 18,
    disableDefaultUI: true,
    gestureHandling: "none"
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        userlocation = pos;
        map.setCenter(pos);
        new CustomMarker(
          new google.maps.LatLng(pos.lat, pos.lng),
          map,
          profileimageURL
        );
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
function on_btnCheckin_click() {
  liff.sendMessages([
    {
      type: "text",
      text:
        "คุณได้เข้างานเมื่อวันที่  " +
        formattedDateString +
        " เวลา" +
        formattedTimeString +
        " เรียบร้อยแล้ว"
    }
  ]);
  liff.sendMessages([
    {
      type: "sticker",
      packageId: 446,
      stickerId: 1989
    }
  ]);
  liff.closeWindow();
}

async function main() {
  await liff.init({ liffId: "1655863402-51ngLPwJ" });
  if(!liff.isLoggedIn())
  await liff.login();
   profile =  await liff.getProfile();
  greetingText.innerHTML = "สวัสดีคุณ" + profile.displayName;
  initMap(profile.pictureUrl);
}
main();
