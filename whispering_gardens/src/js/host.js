 const menuButton = document.querySelector(".menu-btn");
  const closeButton = document.querySelector("#closeNav");
  const navOverlay = document.querySelector("#navOverlay")
 
 
 
 menuButton.addEventListener("click", () => {
    navOverlay.classList.add("active")
    document.body.style.overflow = "hidden" 
  })

  closeButton.addEventListener("click", () => {
    navOverlay.classList.remove("active")
    document.body.style.overflow = "auto" 
  })