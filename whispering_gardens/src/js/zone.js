/**
 * Zone Starting Screen Application
 * Handles the initial zone introduction and navigation
 */

const gsap = window.gsap;

class ZoneApp {
  constructor() {
    this.init()
  }

  init() {
    this.setupAnimations()
    this.setupEventListeners()
  }

  setupAnimations() {
    // Animate elements on page load
    gsap.from(".zone__hero", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    })

    gsap.from(".zone__logo", {
      scale: 0,
      duration: 0.6,
      delay: 0.3,
      ease: "back.out(1.7)",
    })

    gsap.from(".zone__title", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
      ease: "power2.out",
    })

    gsap.from(".zone__description", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.7,
      ease: "power2.out",
    })

    gsap.from(".zone__start-btn", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.9,
      ease: "power2.out",
    })

    gsap.from(".zone__footer", {
      y: 50,
      opacity: 0,
      duration: 0.6,
      delay: 1.1,
      ease: "power2.out",
    })
  }

  setupEventListeners() {
    // Add hover animations for interactive elements
    const startBtn = document.querySelector(".zone__start-btn")
    const calendarBtn = document.querySelector(".zone__calendar-btn")
    const closeBtn = document.querySelector(".zone__close-btn")

    if (startBtn) {
      startBtn.addEventListener("mouseenter", () => {
        gsap.to(startBtn, { scale: 1.05, duration: 0.2 })
      })

      startBtn.addEventListener("mouseleave", () => {
        gsap.to(startBtn, { scale: 1, duration: 0.2 })
      })
    }

    if (calendarBtn) {
      calendarBtn.addEventListener("mouseenter", () => {
        gsap.to(calendarBtn, { scale: 1.05, duration: 0.2 })
      })

      calendarBtn.addEventListener("mouseleave", () => {
        gsap.to(calendarBtn, { scale: 1, duration: 0.2 })
      })
    }

    if (closeBtn) {
      closeBtn.addEventListener("mouseenter", () => {
        gsap.to(closeBtn, { scale: 1.1, duration: 0.2 })
      })

      closeBtn.addEventListener("mouseleave", () => {
        gsap.to(closeBtn, { scale: 1, duration: 0.2 })
      })
    }
  }
}

/**
 * Navigation Functions
 */
function startPulse() {
  console.log("Starting pulse - navigating to menu")

  // Add exit animation
  gsap.to(".zone", {
    opacity: 0,
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => {
      // Navigate to menu page
      window.location.href = "Pulse_menu.html"
    },
  })
}

function viewCalendar() {
  console.log("Opening calendar")
  // Add your calendar navigation logic here
  // window.open('calendar.html', '_blank')
}

function closeZone() {
  console.log("Closing zone")

  // Add exit animation
  gsap.to(".zone", {
    scale: 0.9,
    opacity: 0,
    duration: 0.4,
    ease: "power2.inOut",
    onComplete: () => {
    window.location.href = "home.html"
    
    },
  })
}

/**
 * Initialize the application
 */
let zoneApp

document.addEventListener("DOMContentLoaded", () => {
  try {
    zoneApp = new ZoneApp()
    console.log("Zone app initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Zone app:", error)
  }
})
