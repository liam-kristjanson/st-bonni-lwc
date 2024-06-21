function setLocationCookie(cookieName, cookieValue, expireDays) {
    var day = new Date();
    day.setTime(day.getTime() + expireDays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + day.toUTCString();
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
}

function updateLocationCookie() {
    const newLocation = this.dataset.location;
    setLocationCookie("green_current_location", newLocation, 1);
    setLocationCookie("green_current_location", newLocation, 1);
    location.reload()
}

const locationButtons = document.querySelectorAll('.location-toggle-item');

if (locationButtons.length) {
    locationButtons.forEach(button => button.addEventListener('click', updateLocationCookie))
}