document.addEventListener("DOMContentLoaded", () => {
  let qrScanner = null
  const videoElement = document.getElementById("videoElement")
  const permissionDialog = document.getElementById("permissionDialog")
  const allowButton = document.getElementById("allowButton")
  const denyButton = document.getElementById("denyButton")
  const closeButton = document.getElementById("closeButton")
  const arOverlay = document.getElementById("arOverlay")
  const arContent = document.getElementById("arContent")
  const arClose = document.getElementById("arClose")

  const plantDatabase = {
    chamomile: {
      name: "Chamomile",
      scientific: "Matricaria chamomilla",
      icon: "🌼",
      description:
        "Known as the 'ground apple' for its sweet, apple-like fragrance, chamomile has been treasured for centuries as a gentle healer and peaceful companion.",
      medicinalProperties: [
        "Anti-inflammatory and soothing for skin irritations",
        "Natural sedative promoting restful sleep",
        "Digestive aid for stomach discomfort",
        "Antimicrobial properties for wound healing",
        "Anxiety and stress relief",
      ],
      currentUses: [
        "Chamomile tea for relaxation and sleep",
        "Topical creams for eczema and dermatitis",
        "Essential oil for aromatherapy",
        "Bath soaks for skin soothing",
      ],
      healingRituals: [
        "Brew fresh chamomile flowers in hot water for 5-7 minutes",
        "Add honey for sweetness and additional healing properties",
        "Drink 30 minutes before bedtime for peaceful sleep",
        "Save the used flowers to create a soothing face mask",
      ],
    },
    mint: {
      name: "Mint",
      scientific: "Mentha",
      icon: "🌿",
      description:
        "A refreshing and invigorating herb that awakens the senses and clears the mind. Mint has been used across cultures for its cooling properties.",
      medicinalProperties: [
        "Digestive stimulant and antispasmodic",
        "Decongestant for respiratory issues",
        "Natural breath freshener and oral antiseptic",
        "Cooling effect for headaches and muscle pain",
        "Mental clarity and focus enhancement",
      ],
      currentUses: [
        "Peppermint tea for digestion and nausea",
        "Essential oil for headache relief",
        "Fresh leaves in cooking and beverages",
        "Aromatherapy for mental alertness",
      ],
      healingRituals: [
        "Crush fresh mint leaves to release aromatic oils",
        "Steep in hot water for 3-5 minutes for digestive tea",
        "Add to morning meditation practice for mental clarity",
        "Create mint-infused oil by soaking leaves in carrier oil",
      ],
    },
    lavender: {
      name: "Lavender",
      scientific: "Lavandula",
      icon: "💜",
      description:
        "The 'queen of herbs,' lavender embodies tranquility and grace. Its distinctive purple flowers and calming scent have made it a symbol of peace.",
      medicinalProperties: [
        "Powerful relaxant and sleep inducer",
        "Anti-anxiety and mood stabilizing",
        "Antiseptic and wound healing properties",
        "Pain relief for headaches and muscle tension",
        "Skin regeneration and scar reduction",
      ],
      currentUses: [
        "Lavender tea for stress relief and sleep",
        "Essential oil for aromatherapy and massage",
        "Dried flowers in sachets and potpourri",
        "Natural perfume and fragrance",
      ],
      healingRituals: [
        "Create a lavender sachet for your pillow",
        "Brew dried lavender buds for evening tea",
        "Add a few drops of oil to a warm bath",
        "Practice mindful breathing with lavender scent",
      ],
    },
  }


  const QrScanner = window.QrScanner

  allowButton.addEventListener("click", startCamera)
  denyButton.addEventListener("click", () => {
    alert("Camera access is required to scan QR codes.")
  })

  closeButton.addEventListener("click", () => {
    if (qrScanner) {
      qrScanner.stop()
    }
    window.location.href = "thread.html"
  })

  async function startCamera() {
    try {
      permissionDialog.style.display = "none"
      videoElement.style.display = "block"

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      videoElement.srcObject = stream

      qrScanner = new QrScanner(videoElement, handleQRResult, {
        highlightScanRegion: false,
        highlightCodeOutline: false,
      })
      await qrScanner.start()
    } catch (error) {
      console.error("Camera error:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  function handleQRResult(result) {
    const plantKey = result.data

    if (plantDatabase[plantKey]) {
      if (qrScanner) qrScanner.pause()
      showPlantInfo(plantKey)
    }
  }

  function showPlantInfo(plantKey) {
    const plant = plantDatabase[plantKey]

    arContent.innerHTML = `
            <button class="ar-close" onclick="closeAR()">×</button>
            <span class="plant-card__icon">${plant.icon}</span>
            <h1 class="plant-card__title">${plant.name}</h1>
            <p class="plant-card__subtitle">${plant.scientific}</p>
            
            <div class="plant-card__section">
                <p class="plant-card__description">${plant.description}</p>
            </div>

            <div class="plant-card__section">
                <h3 class="plant-card__section-title">🌱 Medicinal Properties</h3>
                <ul class="plant-card__list">
                    ${plant.medicinalProperties.map((prop) => `<li class="plant-card__list-item">${prop}</li>`).join("")}
                </ul>
            </div>

            <div class="plant-card__section">
                <h3 class="plant-card__section-title">🍃 Current Uses</h3>
                <ul class="plant-card__list">
                    ${plant.currentUses.map((use) => `<li class="plant-card__list-item">${use}</li>`).join("")}
                </ul>
            </div>

            <div class="plant-card__section">
                <div class="plant-card__ritual">
                    <h3 class="plant-card__ritual-title">🔮 Healing Ritual</h3>
                    <ol class="plant-card__ritual-steps">
                        ${plant.healingRituals.map((step) => `<li class="plant-card__ritual-step">${step}</li>`).join("")}
                    </ol>
                </div>
            </div>
        `

    arOverlay.style.display = "flex"
  }

  function closeAR() {
    arOverlay.style.display = "none"
    if (qrScanner) qrScanner.start()
  }

  window.closeAR = closeAR

  arClose.addEventListener("click", closeAR)

  window.addEventListener("beforeunload", () => {
    if (qrScanner) {
      qrScanner.stop()
    }
  })
})
