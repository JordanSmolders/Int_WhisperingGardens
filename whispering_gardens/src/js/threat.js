const gsap = window.gsap;

document.addEventListener("DOMContentLoaded", () => {

  const tl = gsap.timeline()

  tl.from(".header__leaf", {
    duration: 1,
    y: -100,
    rotation: 0,
    stagger: 0.2,
    ease: "bounce.out",
  })
    .from(
      ".hero__eye",
      {
        duration: 0.8,
        scale: 0,
        rotation: 360,
        ease: "back.out(1.7)",
      },
      "-=0.5",
    )
    .from(
      ".hero__title",
      {
        duration: 0.6,
        opacity: 0,
        y: 30,
        ease: "power2.out",
      },
      "-=0.3",
    )
    .from(
      ".hero__description",
      {
        duration: 0.6,
        opacity: 0,
        y: 20,
        ease: "power2.out",
      },
      "-=0.2",
    )
    .from(
      ".hero__button",
      {
        duration: 0.6,
        opacity: 0,
        scale: 0.8,
        ease: "back.out(1.7)",
      },
      "-=0.2",
    )
    .from(
      ".footer",
      {
        duration: 0.6,
        opacity: 0,
        y: 50,
        ease: "power2.out",
      },
      "-=0.3",
    )

  const startButton = document.getElementById("startButton")
  startButton.addEventListener("click", () => {

    gsap.to(startButton, {
      duration: 0.1,
      scale: 0.95,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
  
        window.location.href = "scanner.html"
      },
    })
  })

  const eye = document.querySelector(".hero__pupil")
  const eyeContainer = document.querySelector(".hero__eye")

  document.addEventListener("mousemove", (e) => {
    if (eyeContainer) {
      const rect = eyeContainer.getBoundingClientRect()
      const eyeCenterX = rect.left + rect.width / 2
      const eyeCenterY = rect.top + rect.height / 2

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX)
      const distance = Math.min(
        8,
        Math.sqrt(Math.pow(e.clientX - eyeCenterX, 2) + Math.pow(e.clientY - eyeCenterY, 2)) / 10,
      )

      const pupilX = Math.cos(angle) * distance
      const pupilY = Math.sin(angle) * distance

      gsap.to(eye, {
        duration: 0.3,
        x: pupilX,
        y: pupilY,
        ease: "power2.out",
      })
    }
  })
  document.getElementById('landingCloseBtn').addEventListener('click', () => {
        window.location.href = 'home.html';
    });

  const footerButton = document.querySelector(".footer__button")
  if (footerButton) {
    footerButton.addEventListener("mouseenter", () => {
      gsap.to(footerButton, {
        duration: 0.3,
        scale: 1.05,
        ease: "power2.out",
      })
    })

    footerButton.addEventListener("mouseleave", () => {
      gsap.to(footerButton, {
        duration: 0.3,
        scale: 1,
        ease: "power2.out",
      })
    })
  }
})
