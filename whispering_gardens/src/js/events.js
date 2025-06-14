const menuButton = document.querySelector(".menu-btn");
const closeButton = document.querySelector("#closeNav");
const navOverlay = document.querySelector("#navOverlay")
const tagFilter = document.querySelector("#tagFilter")
const showAllBtn = document.querySelector("#showAllBtn")
const eventCards = document.querySelectorAll(".event-card")
 
 menuButton.addEventListener("click", () => {
    navOverlay.classList.add("active")
    document.body.style.overflow = "hidden" 
  })

  closeButton.addEventListener("click", () => {
    navOverlay.classList.remove("active")
    document.body.style.overflow = "auto" 
  })

  tagFilter.addEventListener("change", (e) => {
    const selectedTag = e.target.value
    filterEvents(selectedTag)
  })

  showAllBtn.addEventListener("click", () => {
    tagFilter.value = ""
    filterEvents("")
  })

  const filterEvents = (selectedTag) => {
    eventCards.forEach((card) => {
      const cardTags = card.getAttribute("data-tags").split(",")

      if (selectedTag === "" || cardTags.includes(selectedTag)) {
        card.classList.remove("hidden")
        card.style.animation = "fadeIn 0.5s ease-in-out"
      } else {
        card.classList.add("hidden")
      }
    })

    if (selectedTag === "") {
      showAllBtn.textContent = "Show all"
    } else {
      showAllBtn.textContent = "Show all"
    }
  }