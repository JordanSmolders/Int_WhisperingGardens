/**
 * Pulse Deep Breathing Application
 * Handles the breathing animation and user interactions
 */

// Import gsap library
const gsap = window.gsap;

class PulseApp {
  constructor() {
    this.circle = document.getElementById("circle")
    this.pulseText = document.getElementById("pulseText")
    this.pulse = document.getElementById("pulse")
    this.isInhaling = true
    this.animationRunning = false
    this.currentCycle = 0

    // Breathing timing configuration
    this.config = {
      inhaleTime: 4, // seconds
      exhaleTime: 4, // seconds
      holdTime: 1, // seconds
      textFadeTime: 0.3, // seconds
    }

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupInitialAnimations()

    // Start the breathing animation after a short delay
    setTimeout(() => {
      this.startPulseCycle()
    }, 1000)
  }

  setupInitialAnimations() {
    // Animate elements on page load
    gsap.from(".header", {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    })

    gsap.from(".pulse__circle", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "back.out(1.7)",
    })

    gsap.from(".pulse__text", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.6,
      ease: "power2.out",
    })
  }

  setupEventListeners() {
    // Handle page visibility changes to pause/resume animation
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pausePulse()
      } else {
        this.resumePulse()
      }
    })

    // Handle window focus/blur
    window.addEventListener("blur", () => this.pausePulse())
    window.addEventListener("focus", () => this.resumePulse())
  }

  startPulseCycle() {
    if (this.animationRunning) return

    this.animationRunning = true
    this.currentCycle++

    console.log(`Starting pulse cycle ${this.currentCycle}`)
    this.pulseCycle()
  }

  pulseCycle() {
    if (!this.animationRunning) return

    if (this.isInhaling) {
      this.inhale()
    } else {
      this.exhale()
    }
  }

  inhale() {
    this.updateText("Breath in", () => {
      // Scale up circle for inhale
      gsap.to(this.circle, {
        scale: 1,
        duration: this.config.inhaleTime,
        ease: "power2.inOut",
        onComplete: () => {
          if (!this.animationRunning) return

          // Hold for specified time, then switch to exhale
          setTimeout(() => {
            if (!this.animationRunning) return
            this.isInhaling = false
            this.pulseCycle()
          }, this.config.holdTime * 1000)
        },
      })
    })
  }

  exhale() {
    this.updateText("Breath out", () => {
      // Scale down circle for exhale
      gsap.to(this.circle, {
        scale: 0.4,
        duration: this.config.exhaleTime,
        ease: "power2.inOut",
        onComplete: () => {
          if (!this.animationRunning) return

          // Hold for specified time, then switch to inhale
          setTimeout(() => {
            if (!this.animationRunning) return
            this.isInhaling = true
            this.pulseCycle()
          }, this.config.holdTime * 1000)
        },
      })
    })
  }

  updateText(text, callback) {
    // Fade out current text
    gsap.to(this.pulseText, {
      opacity: 0,
      duration: this.config.textFadeTime,
      onComplete: () => {
        // Update text content
        this.pulseText.textContent = text

        // Fade in new text
        gsap.to(this.pulseText, {
          opacity: 0.8,
          duration: this.config.textFadeTime,
          onComplete: callback,
        })
      },
    })
  }

  pausePulse() {
    if (!this.animationRunning) return

    this.animationRunning = false
    gsap.killTweensOf([this.circle, this.pulseText])
    console.log("Pulse paused")
  }

  resumePulse() {
    if (this.animationRunning) return

    setTimeout(() => {
      this.startPulseCycle()
    }, 500)
    console.log("Pulse resumed")
  }

  stopPulse() {
    this.animationRunning = false
    gsap.killTweensOf([this.circle, this.pulseText])

    // Reset to initial state
    gsap.set(this.circle, { scale: 1 })
    gsap.set(this.pulseText, { opacity: 0.8 })
    this.pulseText.textContent = "Breath in"
    this.isInhaling = true
    this.currentCycle = 0

    console.log("Pulse stopped")
  }
}

/**
 * Navigation Functions
 */
function goBack() {
  if (window.pulseApp) {
    window.pulseApp.stopPulse()
  }

  console.log("Going back to Pulse menu")

  // Add exit animation
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
    window.pulseApp = new PulseApp()
    console.log("Pulse app initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Pulse app:", error)
  }
})

/**
 * Cleanup when page is about to unload
 */
window.addEventListener("beforeunload", () => {
  if (window.pulseApp) {
    window.pulseApp.stopPulse()
  }
})
