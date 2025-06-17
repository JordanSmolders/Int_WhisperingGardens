

const gsap = window.gsap;


class MovementApp {
  constructor() {
    this.figure = document.getElementById("figure")
    this.leftArm = document.getElementById("leftArm")
    this.rightArm = document.getElementById("rightArm")
    this.leftLeg = document.getElementById("leftLeg")
    this.rightLeg = document.getElementById("rightLeg")
    this.movementText = document.getElementById("movementText")
    this.playBtn = document.getElementById("playBtn")
    this.playText = document.getElementById("playText")

    this.isPlaying = false
    this.currentExercise = 0
    this.animationRunning = false


    this.exercises = [
      {
        name: "Stretch up",
        duration: 3,
        animation: () => this.stretchUp(),
      },
      {
        name: "Side bend",
        duration: 4,
        animation: () => this.sideBend(),
      },
      {
        name: "Arm circles",
        duration: 4,
        animation: () => this.armCircles(),
      },
      {
        name: "Gentle twist",
        duration: 3,
        animation: () => this.gentleTwist(),
      },
      {
        name: "Relax",
        duration: 2,
        animation: () => this.relax(),
      },
    ]

    this.init()
  }

  init() {
    this.setupInitialAnimations()
    this.setupEventListeners()
  }

  setupInitialAnimations() {
   
    gsap.from(".header", {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    })

    gsap.from(".movement__figure", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "back.out(1.7)",
    })

    gsap.from(".movement__text", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.6,
      ease: "power2.out",
    })

    gsap.from(".movement__controls", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: "power2.out",
    })
  }

  setupEventListeners() {
   
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isPlaying) {
        this.pauseMovement()
      }
    })
  }

  toggleMovement() {
    if (this.isPlaying) {
      this.pauseMovement()
    } else {
      this.startMovement()
    }
  }

  startMovement() {
    if (this.animationRunning) return

    this.isPlaying = true
    this.animationRunning = true
    this.playText.textContent = "Pause"
    this.currentExercise = 0

    console.log("Starting movement sequence")
    this.runExerciseSequence()
  }

  pauseMovement() {
    this.isPlaying = false
    this.animationRunning = false
    this.playText.textContent = "Resume"

    
    gsap.killTweensOf([this.figure, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg])

    console.log("Movement paused")
  }

  stopMovement() {
    this.isPlaying = false
    this.animationRunning = false
    this.playText.textContent = "Start"
    this.currentExercise = 0

  
    this.resetPosition()
    this.updateText("Stretch up")

    console.log("Movement stopped")
  }

  runExerciseSequence() {
    if (!this.animationRunning) return

    const exercise = this.exercises[this.currentExercise]
    if (!exercise) {
   
      this.currentExercise = 0
      setTimeout(() => {
        if (this.animationRunning) {
          this.runExerciseSequence()
        }
      }, 1000)
      return
    }

    console.log(`Starting exercise: ${exercise.name}`)
    this.updateText(exercise.name, () => {
      exercise.animation()

      setTimeout(() => {
        if (this.animationRunning) {
          this.currentExercise++
          this.runExerciseSequence()
        }
      }, exercise.duration * 1000)
    })
  }

  updateText(text, callback) {
    gsap.to(this.movementText, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.movementText.textContent = text
        gsap.to(this.movementText, {
          opacity: 0.8,
          duration: 0.3,
          onComplete: callback,
        })
      },
    })
  }

  resetPosition() {
    gsap.set(this.figure, { rotation: 0, x: 0 })
    gsap.set(this.leftArm, { rotation: -20 })
    gsap.set(this.rightArm, { rotation: 20 })
    gsap.set(this.leftLeg, { rotation: 0 })
    gsap.set(this.rightLeg, { rotation: 0 })
  }

  
  stretchUp() {
    gsap.to(this.leftArm, {
      rotation: -160,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
    })

    gsap.to(this.rightArm, {
      rotation: 160,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
    })
  }

  sideBend() {
    gsap.to(this.figure, {
      rotation: 15,
      duration: 1.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.to(this.figure, {
          rotation: -15,
          duration: 1.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        })
      },
    })
  }

  armCircles() {
    gsap.to(this.leftArm, {
      rotation: -200,
      duration: 2,
      ease: "none",
      repeat: 1,
    })

    gsap.to(this.rightArm, {
      rotation: 200,
      duration: 2,
      ease: "none",
      repeat: 1,
    })
  }

  gentleTwist() {
    gsap.to(this.figure, {
      x: 20,
      rotation: 10,
      duration: 1.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.to(this.figure, {
          x: -20,
          rotation: -10,
          duration: 1.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        })
      },
    })
  }

  relax() {
    this.resetPosition()
    gsap.to(this.figure, {
      scale: 1.05,
      duration: 1,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
    })
  }
}


function toggleMovement() {
  if (window.movementApp) {
    window.movementApp.toggleMovement()
  }
}

function goBack() {
  if (window.movementApp) {
    window.movementApp.stopMovement()
  }

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

document.addEventListener("DOMContentLoaded", () => {
  try {
    window.movementApp = new MovementApp()
    console.log("Movement app initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Movement app:", error)
  }
})


window.addEventListener("beforeunload", () => {
  if (window.movementApp) {
    window.movementApp.stopMovement()
  }
})
