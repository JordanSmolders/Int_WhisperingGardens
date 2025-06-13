  let currentStep = 1
  const totalSteps = 5
  const formSteps = document.querySelectorAll(".form-step")
  const progressSteps = document.querySelectorAll(".progress-step")
  const prevBtn = document.querySelector("#prevBtn")
  const nextBtn = document.querySelector("#nextBtn")
  const closeBtn = document.querySelector("#closeForm")
  const form = document.querySelector("#multiStepForm")
  const optionBtns = document.querySelectorAll(".option-btn")
  const eventTypeInput = document.querySelector("#eventType")

  updateStepDisplay()
  updateProgressBar()


  optionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      optionBtns.forEach((b) => b.classList.remove("selected"))
      btn.classList.add("selected")
      eventTypeInput.value = btn.dataset.value
    })
  })

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--
      updateStepDisplay()
      updateProgressBar()
    }
  })

  nextBtn.addEventListener("click", () => {
      if (currentStep < totalSteps) {
        currentStep++
        updateStepDisplay()
        updateProgressBar()
      }
  });

function updateStepDisplay() {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index + 1 === currentStep)
  })

  toggleVisibility(prevBtn, currentStep !== 1)
  toggleVisibility(nextBtn, currentStep !== totalSteps)
}

function toggleVisibility(e, show) {
  e.style.visibility = show ? "visible" : "hidden"
}

  function updateProgressBar() {
    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1
      step.classList.toggle("active", stepNumber === currentStep)
      step.classList.toggle("completed", stepNumber < currentStep)
    })
  }

  const picker = new Litepicker({
      element: document.getElementById("dateRange"),
      singleMode: false,
      format: "DD/MM/YYYY",
      autoApply: true,
      setup: (picker) => {
        document.querySelector(".calendar-btn").addEventListener("click", () => {
          picker.show();
        });
      }
    });
