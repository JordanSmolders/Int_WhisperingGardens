let currentStep = 1
const totalSteps = 5
const formSteps = document.querySelectorAll(".form-step")
const progressSteps = document.querySelectorAll(".progress-step")
const prevBtn = document.querySelector("#prevBtn")
const nextBtn = document.querySelector("#nextBtn")
const submitBtn = document.querySelector("#submitBtn")
const closeBtn = document.querySelector("#closeForm")
const form = document.querySelector("#multiStepForm")
const optionBtns = document.querySelectorAll(".option-btn")
const eventTypeInput = document.querySelector("#eventType")
const confirmBtn = document.querySelector("#confirm");
const confirmYes = document.querySelector("#confirmYes");
const confirmNo = document.querySelector("#confirmNo");
const buttonGroup = document.querySelector(".button-group")


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
  if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
      currentStep++
      updateStepDisplay()
      updateProgressBar()
    }
  }
})

function updateStepDisplay() {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index + 1 === currentStep)
  })

  toggleVisibility(prevBtn, currentStep !== 1)
  
  if (currentStep === totalSteps) {
    toggleVisibility(nextBtn, false)
    toggleDisplay(submitBtn, true)
  } else {
    toggleVisibility(nextBtn, true)
    toggleDisplay(submitBtn, false)
  }
}

function toggleDisplay(e, show){
  e.style.display = show ? "block" : 'none';
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

closeBtn.addEventListener("click", () => {
  confirmBtn.classList.remove("hidden");
});

confirmYes.addEventListener("click", () => {
  window.location.href = "host.html";
});

confirmNo.addEventListener("click", () => {
  confirmBtn.classList.add("hidden");
});

const validateCurrentStep = () => {
  const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`)
  const requiredInputs = currentStepElement.querySelectorAll("input[required], textarea[required]")
  let isValid = true

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "#e74c3c"
      isValid = false

      setTimeout(() => {
        input.style.borderColor = "#000"
      }, 3000)
    } else {
      input.style.borderColor = "#000"
    }
  })

  if (currentStep === 2) {
    const eventType = document.querySelector("#eventType")
    if (!eventType.value) {
      const message = document.createElement('p');
      message.innerText = 'Please select the type of event'
      message.classList.add('message');
      buttonGroup.appendChild(message);
      isValid = false
    }
  }

  if (!isValid) {
    currentStepElement.style.animation = "shake 0.5s ease-in-out"
    setTimeout(() => {
      currentStepElement.style.animation = ""
    }, 500)
  }

  return isValid
}

const style = document.createElement("style")
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`
document.head.appendChild(style)