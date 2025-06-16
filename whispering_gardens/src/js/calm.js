/**
 * Step Calm Application
 * Handles the 5-4-3-2-1 grounding technique
 */

// Import or declare gsap variable here
const gsap = window.gsap;

class CalmApp {
  constructor() {
    this.senses = document.querySelectorAll(".calm__sense")
    this.progressFill = document.getElementById("progressFill")
    this.progressText = document.getElementById("progressText")
    this.nextBtn = document.getElementById("nextBtn")
    this.resetBtn = document.getElementById("resetBtn")

    this.currentStep = 0
    this.totalSteps = 5
    this.isComplete = false

    // Sense data
    this.senseData = [
      {
        title: "See",
        text: "Notice 5 things you can see around you",
        icon: "👁️",
        count: 5,
      },
      {
        title: "Touch",
        text: "Feel 4 things you can touch",
        icon: "✋",
        count: 4,
      },
      {
        title: "Hear",
        text: "Listen to 3 sounds around you",
        icon: "👂",
        count: 3,
      },
      {
        title: "Smell",
        text: "Notice 2 scents you can smell",
        icon: "👃",
        count: 2,
      },
      {
        title: "Taste",
        text: "Identify 1 taste in your mouth",
        icon: "👅",
        count: 1,
      },
    ]

    this.init()
  }

  init() {
    this.setupInitialAnimations()
    this.setupEventListeners()
    this.updateProgress()
  }

  setupInitialAnimations() {
    // Animate elements on page load
    gsap.from(".header", {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    })

    gsap.from(".calm__sense", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.3,
      ease: "power2.out",
    })

    gsap.from(".calm__progress", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: "power2.out",
    })

    gsap.from(".calm__controls", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 1,
      ease: "power2.out",
    })
  }

  setupEventListeners() {
    // Add click listeners to sense cards
    this.senses.forEach((sense, index) => {
      sense.addEventListener("click", () => {
        if (index === this.currentStep) {
          this.nextSense()
        }
      })
    })
  }

  nextSense() {
    if (this.isComplete) return

    // Animate current sense out
    const currentSense = this.senses[this.currentStep]
    gsap.to(currentSense, {
      scale: 0.9,
      opacity: 0.4,
      duration: 0.3,
      ease: "power2.inOut",
    })

    this.currentStep++

    if (this.currentStep >= this.totalSteps) {
      this.completeExercise()
      return
    }

    // Animate next sense in
    const nextSense = this.senses[this.currentStep]
    nextSense.classList.add("calm__sense--active")

    gsap.to(nextSense, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      delay: 0.2,
      ease: "back.out(1.7)",
    })

    this.updateProgress()
    this.updateButtonState()

    console.log(`Advanced to step ${this.currentStep + 1}`)
  }

  completeExercise() {
    this.isComplete = true

    // Animate completion
    gsap.to(this.progressFill, {
      width: "100%",
      duration: 0.5,
      ease: "power2.out",
    })

    this.progressText.textContent = "Complete! Well done."

    // Celebrate animation
    gsap.to(".calm__progress", {
      scale: 1.05,
      duration: 0.3,
      yoyo: true,
      repeat: 3,
      ease: "power2.inOut",
    })

    // Update button
    this.nextBtn.textContent = "Completed ✓"
    this.nextBtn.disabled = true

    console.log("Calm exercise completed!")

    // Auto-reset after 3 seconds
    setTimeout(() => {
      this.resetCalm()
    }, 3000)
  }

  resetCalm() {
    this.currentStep = 0
    this.isComplete = false

    // Reset all senses
    this.senses.forEach((sense, index) => {
      sense.classList.remove("calm__sense--active")
      if (index === 0) {
        sense.classList.add("calm__sense--active")
      }
    })

    // Reset animations
    gsap.set(this.senses, {
      scale: 1,
      opacity: (index) => (index === 0 ? 1 : 0.4),
    })

    this.updateProgress()
    this.updateButtonState()

    // Animate reset
    gsap.from(".calm__sense--active", {
      scale: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
    })

    console.log("Calm exercise reset")
  }

  updateProgress() {
    const progressPercent = ((this.currentStep + 1) / this.totalSteps) * 100

    gsap.to(this.progressFill, {
      width: `${progressPercent}%`,
      duration: 0.5,
      ease: "power2.out",
    })

    this.progressText.textContent = `Step ${this.currentStep + 1} of ${this.totalSteps}`
  }

  updateButtonState() {
    if (this.isComplete) {
      this.nextBtn.textContent = "Completed ✓"
      this.nextBtn.disabled = true
    } else {
      const currentSenseData = this.senseData[this.currentStep]
      this.nextBtn.textContent = `Next: ${currentSenseData.title}`
      this.nextBtn.disabled = false
    }
  }
}

/**
 * Navigation Functions
 */
function nextSense() {
  if (window.calmApp) {
    window.calmApp.nextSense()
  }
}

function resetCalm() {
  if (window.calmApp) {
    window.calmApp.resetCalm()
  }
}

function goBack() {
  console.log("Going back to Pulse menu")

  gsap.to("body", {
    opacity: 0,
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => {
      window.location.href = "Pulse_menu.html"
    },
  })
}

/**
 * Initialize the application
 */
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.calmApp = new CalmApp()
    console.log("Calm app initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Calm app:", error)
  }
})
