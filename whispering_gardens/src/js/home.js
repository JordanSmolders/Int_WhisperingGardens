const mapTab = document.querySelector("#mapTab");
const zonesTab = document.querySelector("#zonesTab");
const mapContent = document.querySelector("#mapContent");
const zonesContent = document.querySelector("#zonesContent");
const menuButton = document.querySelector(".menu-btn");
const closeButton = document.querySelector("#closeNav");
const navOverlay = document.querySelector("#navOverlay");
const infoButton = document.querySelector(".info-btn");
const infoOverlay = document.querySelector('.info-overlay');
const imageUrl = "src/assets/map-refine.svg";
const zoomLevel = 20;
const gardenBounds = [
  [50.828992, 3.26934],
  [50.829571, 3.270335],
];

const getUrlParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

infoButton.addEventListener("click", () => {
  infoOverlay.classList.toggle('active');
});

const switchTab = (activeTab, inactiveTab, showContent, hideContent) => {
  activeTab.classList.add("active");
  inactiveTab.classList.remove("active");
  hideContent.style.display = "none";
  showContent.style.display = "block";
};

const initializeTabFromUrl =() => {
  const tabParam = getUrlParameter("tab");
  if (tabParam === "zones") {
    switchTab(zonesTab, mapTab, zonesContent, mapContent);
  } else {
    switchTab(mapTab, zonesTab, mapContent, zonesContent);
  }
}

initializeTabFromUrl();

mapTab.addEventListener("click", () => {
  if (!mapTab.classList.contains("active")) {
    switchTab(mapTab, zonesTab, mapContent, zonesContent);
  }
});

zonesTab.addEventListener("click", () => {
  if (!zonesTab.classList.contains("active")) {
    switchTab(zonesTab, mapTab, zonesContent, mapContent);
  }
});

menuButton.addEventListener("click", () => {
  navOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeButton.addEventListener("click", () => {
  navOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
});

const getBoundsCenter = (bounds) => {
  return [
    (bounds[0][0] + bounds[1][0]) / 2,
    (bounds[0][1] + bounds[1][1]) / 2,
  ];
};

const isWithinBounds = ([lat, lng], bounds) => {
  return (
    lat >= bounds[0][0] &&
    lat <= bounds[1][0] &&
    lng >= bounds[0][1] &&
    lng <= bounds[1][1]
  );
};

const initializeMap = (containerId) => {
  const center = getBoundsCenter(gardenBounds);
const map = L.map(containerId, {
  zoomControl: false,
  minZoom: 19,   
  maxZoom: 22,
  maxBounds: gardenBounds,
  maxBoundsViscosity: 1.0
}).setView(center, zoomLevel);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.imageOverlay(imageUrl, gardenBounds).addTo(map);
  
  return map;
};

const createUserMarker = (map) => {
  const userIcon = L.icon({
    iconUrl: 'src/assets/bouncing_ball.gif',
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  });
  const marker = L.marker([0, 0], { icon: userIcon }).addTo(map);
  return marker;
};

const trackUserLocation = (marker) => {
  if (!("geolocation" in navigator)) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.watchPosition(
    (pos) => {
      const latlng = [pos.coords.latitude, pos.coords.longitude];
      marker.setLatLng(isWithinBounds(latlng, gardenBounds) ? latlng : [0, 0]);
    },
    (err) => {
      console.error("Location error", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000,
    }
  );
};

const createLabelMarker = (map, latlng, labelText) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40">
      <rect width="100" height="40" fill="#00A468" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        fill="white" font-size="20" font-family="GT Walsheim Medium, Arial">${labelText}</text>
    </svg>
  `;

  const labelIcon = L.divIcon({
    className: 'label',
    html: svg,
    iconSize: [209, 81],
    iconAnchor: [104, 40],
  });

  const labelMarker = L.marker(latlng, { icon: labelIcon }).addTo(map);
  labelMarker.on("click", () => {
  window.location.href = `${labelText.toLowerCase()}.html`;
});

};

const setupGardenMap = () => {
  const map = initializeMap("map");

  const userMarker = createUserMarker(map);
  trackUserLocation(userMarker);

  createLabelMarker(map, [50.82925, 3.2697], "PULSE");
  createLabelMarker(map, [50.82932, 3.2700], "THREAD");
};

setupGardenMap();
