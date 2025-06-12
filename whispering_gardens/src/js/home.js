  const mapTab = document.querySelector("#mapTab")
  const zonesTab = document.querySelector("#zonesTab")
  const mapContent = document.querySelector("#mapContent")
  const zonesContent = document.querySelector("#zonesContent")
  const menuButton = document.querySelector(".menu-btn");
  const closeButton = document.querySelector("#closeNav");
  const navOverlay = document.querySelector("#navOverlay")
  const infoButton = document.querySelector(".info-btn");
  const infoOverlay = document.querySelector('.info-overlay');
  const imageUrl = "src/assets/map.png";
  const zoomLevel = 20;
  const gardenBounds = [
  [50.828992, 3.26934],
  [50.829571, 3.270335],
  ];


  infoButton.addEventListener("click", ()=>{
    infoOverlay.classList.toggle('active');
  })

  const switchTab = (activeTab, inactiveTab, showContent, hideContent) => {
    activeTab.classList.add("active")
    inactiveTab.classList.remove("active")

    hideContent.style.display = "none"
    showContent.style.display = "block"
  }

  mapTab.addEventListener("click", () => {
    if (!mapTab.classList.contains("active")) {
      switchTab(mapTab, zonesTab, mapContent, zonesContent)
    }
  })

  zonesTab.addEventListener("click", () => {
    if (!zonesTab.classList.contains("active")) {
      switchTab(zonesTab, mapTab, zonesContent, mapContent)
    }
  })

  menuButton.addEventListener("click", () => {
    navOverlay.classList.add("active")
    document.body.style.overflow = "hidden" 
  })

  closeButton.addEventListener("click", () => {
    navOverlay.classList.remove("active")
    document.body.style.overflow = "auto" 
  })

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
  const map = L.map(containerId, { zoomControl: false }).setView(center, zoomLevel);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.imageOverlay(imageUrl, gardenBounds).addTo(map);
  return map;
};

const createUserMarker = (map) => {
  const marker = L.circleMarker([0, 0], {
    radius: 8,
    color: "white",
    fillColor: "red",
    fillOpacity: 1,
    weight: 2,
  }).addTo(map);
  marker.bringToFront();
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

const setupGardenMap = () => {
  const map = initializeMap("map");
  const userMarker = createUserMarker(map);
  trackUserLocation(userMarker);
};

setupGardenMap();