  const mapTab = document.querySelector("#mapTab")
  const zonesTab = document.querySelector("#zonesTab")
  const mapContent = document.querySelector("#mapContent")
  const zonesContent = document.querySelector("#zonesContent")

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

