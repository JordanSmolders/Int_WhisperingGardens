  const mapTab = document.querySelector("#mapTab")
  const zonesTab = document.querySelector("#zonesTab")
  const mapContent = document.querySelector("#mapContent")
  const zonesContent = document.querySelector("#zonesContent")
  const menuButton = document.querySelector(".menu-btn");
  const closeButton = document.querySelector("#closeNav");
  const navOverlay = document.querySelector("#navOverlay")



  function switchTab(activeTab, inactiveTab, showContent, hideContent) {
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

  document.querySelector(".menu-btn").addEventListener("click", () => {
    navOverlay.classList.add("active")
    document.body.style.overflow = "hidden" 
  })

  document.getElementById("closeNav").addEventListener("click", () => {
    navOverlay.classList.remove("active")
    document.body.style.overflow = "auto" 
  })


   const gardenBounds = [
        [50.828992, 3.26934],
        [50.829571, 3.270335],
      ];

      const center = [
        (gardenBounds[0][0] + gardenBounds[1][0]) / 2,
        (gardenBounds[0][1] + gardenBounds[1][1]) / 2,
      ];

      const zoom = 20;

      const map = L.map("map", { zoomControl: false }).setView(center, zoom);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      const imageUrl = "src/assets/map.png";

      const imageOverlay = L.imageOverlay(imageUrl, gardenBounds).addTo(map);

      const userMarker = L.circleMarker([0, 0], {
        radius: 8,
        color: "white",
        fillColor: "red",
        fillOpacity: 1,
        weight: 2,
      }).addTo(map);

      userMarker.bringToFront();

      if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
          (pos) => {
            const latlng = [pos.coords.latitude, pos.coords.longitude];
            if (
              latlng[0] >= gardenBounds[0][0] &&
              latlng[0] <= gardenBounds[1][0] &&
              latlng[1] >= gardenBounds[0][1] &&
              latlng[1] <= gardenBounds[1][1]
            ) {
              userMarker.setLatLng(latlng);
            } else {
              userMarker.setLatLng([0, 0]);
            }
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
      } else {
        alert("Geolocation not supported.");
      }

