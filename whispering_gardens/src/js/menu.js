/**
 * Menu Selection Application
 * Handles activity selection and navigation
 */

const gsap = window.gsap;

class MenuApp {
  constructor() {
    this.selectedActivity = null
    this.init()
  }

  init() {
    this.setupAnimations()
    this.setupEventListeners()
  }

  setupAnimations() {
    // Animate elements on page load
    gsap.from(".menu__header", {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    })

    gsap.from(".activity", {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.3,
      ease: "power2.out",
    })
  }

  setupEventListeners() {
    // Add hover animations for activity cards
    const activities = document.querySelectorAll(".activity")

    activities.forEach((activity) => {
      activity.addEventListener("mouseenter", () => {
        gsap.to(activity, {
          scale: 1.02,
          duration: 0.2,
          ease: "power2.out",
        })
      })

      activity.addEventListener("mouseleave", () => {
        gsap.to(activity, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        })
      })
    })

    // Close button animation
    const closeBtn = document.querySelector(".menu__close-btn")
    if (closeBtn) {
      closeBtn.addEventListener("mouseenter", () => {
        gsap.to(closeBtn, { scale: 1.1, duration: 0.2 })
      })

      closeBtn.addEventListener("mouseleave", () => {
        gsap.to(closeBtn, { scale: 1, duration: 0.2 })
      })
    }
  }

  selectActivity(activityType) {
    this.selectedActivity = activityType
    console.log(`Selected activity: ${activityType}`)

    // Add selection animation
    const selectedCard = event.currentTarget

    gsap.to(selectedCard, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        this.navigateToActivity(activityType)
      },
    })
  }

  navigateToActivity(activityType) {
    // Add exit animation
    gsap.to(".menu", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Navigate based on activity type
        switch (activityType) {
          case "deep-breathing":
            window.location.href = "deepbreathing.html"
            break
          case "slow-movement":
            console.log("Navigating to slow movement (not implemented)")
            window.location.href = 'movement.html';
            break
          case "step-calm":
            console.log("Navigating to step calm (not implemented)")
            window.location.href = 'calm.html';
            break
          default:
            console.log("Unknown activity type")
        }
      },
    })
  }
}

/**
 * Navigation Functions
 */
function selectActivity(activityType) {
  if (window.menuApp) {
    window.menuApp.selectActivity(activityType)
  }
}

function closeMenu() {
  console.log("Closing menu")

  // Add exit animation
  gsap.to(".menu", {
    scale: 0.9,
    opacity: 0,
    duration: 0.4,
    ease: "power2.inOut",
    onComplete: () => {
      // Navigate back to zone
      window.location.href = "Pulse.html"
    },
  })
}

/**
 * Initialize the application
 */
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.menuApp = new MenuApp()
    console.log("Menu app initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Menu app:", error)
  }
})
