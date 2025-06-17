document.addEventListener("DOMContentLoaded", () => {
  let qrScanner = null
  let activeARElements = []
  const scannedPlants = new Set()
  let scanCooldown = false
  let isTracking = false
  const lastQRPositions = new Map() // Track previous QR positions for movement calculation
  const videoElement = document.getElementById("videoElement")
  const permissionDialog = document.getElementById("permissionDialog")
  const allowButton = document.getElementById("allowButton")
  const denyButton = document.getElementById("denyButton")
  const closeButton = document.getElementById("closeButton")

  // Plant database with enhanced AR data
  const plantDatabase = {
    chamomile: {
      name: "Chamomile",
      scientific: "Matricaria chamomilla",
      icon: "🌼",
      color: "#FFC107",
      description: "Natural sleep aid and gentle healer known for its calming properties",
      properties: ["Sleep aid", "Anti-inflammatory", "Digestive support", "Anxiety relief", "Skin healing"],
      uses: ["Chamomile tea for relaxation", "Topical creams for skin", "Essential oil aromatherapy", "Bath soaks"],
      ritual:
        "Brew fresh chamomile flowers in hot water for 5-7 minutes. Add honey for sweetness and drink 30 minutes before bedtime for peaceful sleep.",
    },
    mint: {
      name: "Mint",
      scientific: "Mentha",
      icon: "🌿",
      color: "#2ECC71",
      description: "Refreshing herb for clarity and digestion with cooling properties",
      properties: ["Digestive aid", "Mental clarity", "Cooling effect", "Breath freshener", "Decongestant"],
      uses: ["Peppermint tea for digestion", "Essential oil for headaches", "Fresh leaves in cooking", "Aromatherapy"],
      ritual:
        "Crush fresh mint leaves to release aromatic oils. Steep in hot water for 3-5 minutes and add to morning meditation for mental clarity.",
    },
    lavender: {
      name: "Lavender",
      scientific: "Lavandula",
      icon: "💜",
      color: "#9370DB",
      description: "Queen of herbs for relaxation and healing with distinctive purple flowers",
      properties: ["Stress relief", "Skin healing", "Aromatherapy", "Sleep inducer", "Pain relief"],
      uses: ["Lavender tea for stress", "Essential oil for massage", "Dried flowers in sachets", "Natural perfume"],
      ritual:
        "Create a lavender sachet for your pillow. Brew dried lavender buds for evening tea and practice mindful breathing with the scent.",
    },
  }

  // Import QrScanner
  const QrScanner = window.QrScanner

  // Camera permission handlers
  allowButton.addEventListener("click", startCamera)
  denyButton.addEventListener("click", () => {
    alert("Camera access is required to scan QR codes.")
  })

  // Close button handler
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
        returnDetailedScanResult: true,
        maxScansPerSecond: 20, 
      })
      await qrScanner.start()
      isTracking = true
    } catch (error) {
      console.error("Camera error:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  
  function handleQRResult(result) {
    const plantKey = result.data
    const qrPosition = result.cornerPoints

    if (plantDatabase[plantKey] && qrPosition) {
     
      const existingElement = document.querySelector(`[data-plant="${plantKey}"]`)

      if (!existingElement && !scanCooldown) {
      
        scanCooldown = true
        scannedPlants.add(plantKey)
        playARScanSound()
        showARPlantInfo(plantKey, qrPosition)

       
        lastQRPositions.set(plantKey, qrPosition)

        setTimeout(() => {
          scanCooldown = false
        }, 3000)
      } else if (existingElement && isTracking) {
       
        updateARSpatialPosition(plantKey, qrPosition)

       
        lastQRPositions.set(plantKey, qrPosition)
      }
    }
  }


  function playARScanSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log("Audio not available")
    }
  }

 
  function calculateQRSpatialData(qrPosition) {
   
    const width = Math.abs(qrPosition[1].x - qrPosition[0].x)
    const height = Math.abs(qrPosition[2].y - qrPosition[1].y)
    const qrSize = Math.sqrt(width * width + height * height)

    
    const centerX = qrPosition.reduce((sum, point) => sum + point.x, 0) / 4
    const centerY = qrPosition.reduce((sum, point) => sum + point.y, 0) / 4

   
    const baseSize = 200
    const distance = Math.max(0.3, Math.min(1.5, baseSize / qrSize))

    const topWidth = Math.abs(qrPosition[1].x - qrPosition[0].x)
    const bottomWidth = Math.abs(qrPosition[2].x - qrPosition[3].x)
    const leftHeight = Math.abs(qrPosition[3].y - qrPosition[0].y)
    const rightHeight = Math.abs(qrPosition[2].y - qrPosition[1].y)

  
    const horizontalTilt = ((topWidth - bottomWidth) / Math.max(topWidth, bottomWidth)) * 30 // Max 30 degrees
    const verticalTilt = ((leftHeight - rightHeight) / Math.max(leftHeight, rightHeight)) * 20 // Max 20 degrees

    return {
      centerX,
      centerY,
      distance,
      qrSize,
      width,
      height,
      horizontalTilt,
      verticalTilt,
    }
  }

  function showARPlantInfo(plantKey, qrPosition) {
    const plant = plantDatabase[plantKey]
    const arElement = document.createElement("div")
    arElement.className = `ar-plant-marker ar-plant-marker--${plantKey}`
    arElement.dataset.plant = plantKey

    const spatialData = calculateQRSpatialData(qrPosition)
    const position = calculateOptimalSpatialPosition(spatialData)

    arElement.style.left = `${position.x}px`
    arElement.style.top = `${position.y}px`
    arElement.style.transform = `scale(${position.scale}) rotateX(${position.rotateX}deg) rotateY(${position.rotateY}deg) rotateZ(${position.rotateZ}deg)`
    arElement.style.opacity = position.opacity

    arElement.innerHTML = `
      <div class="ar-ground-shadow" style="transform: scale(${position.scale}) translateX(-50%) perspective(500px) rotateX(85deg)"></div>
      <div class="ar-connection-beam"></div>
      
      <div class="ar-hologram-container">
        <div class="ar-hologram-card" style="--plant-color: ${plant.color}">
          <div class="ar-scan-lines"></div>
          
          <div class="ar-card-layer ar-card-back"></div>
          <div class="ar-card-layer ar-card-front">
            <div class="ar-card-content">
              <div class="ar-info-header">
                <div class="ar-icon-container">
                  <span class="ar-info-icon">${plant.icon}</span>
                  <div class="ar-icon-glow"></div>
                </div>
                <div class="ar-info-title">
                  <h3>${plant.name}</h3>
                  <p>${plant.scientific}</p>
                </div>
              </div>
              
              <div class="ar-scrollable-content">
                <div class="ar-section">
                  <p class="ar-description">${plant.description}</p>
                </div>
                
                <div class="ar-section">
                  <h4 class="ar-section-title">🌱 Properties</h4>
                  <div class="ar-properties">
                    ${plant.properties.map((prop) => `<span class="ar-property-tag">${prop}</span>`).join("")}
                  </div>
                </div>
                
                <div class="ar-section">
                  <h4 class="ar-section-title">🍃 Uses</h4>
                  <ul class="ar-list">
                    ${plant.uses.map((use) => `<li class="ar-list-item">${use}</li>`).join("")}
                  </ul>
                </div>
                
                <div class="ar-section">
                  <h4 class="ar-section-title">🔮 Healing Ritual</h4>
                  <p class="ar-ritual">${plant.ritual}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ar-edge-light ar-edge-light--top"></div>
          <div class="ar-edge-light ar-edge-light--right"></div>
          <div class="ar-edge-light ar-edge-light--bottom"></div>
          <div class="ar-edge-light ar-edge-light--left"></div>
        </div>
        
        <div class="ar-energy-field">
          <div class="ar-energy-particle"></div>
          <div class="ar-energy-particle"></div>
          <div class="ar-energy-particle"></div>
          <div class="ar-energy-particle"></div>
          <div class="ar-energy-particle"></div>
          <div class="ar-energy-particle"></div>
        </div>
      </div>
      
      <div class="ar-close-btn" onclick="window.removeARElement('${plantKey}')">×</div>
    `

    document.querySelector(".scanner__camera-container").appendChild(arElement)
    activeARElements.push(arElement)

    setTimeout(() => {
      arElement.classList.add("ar-visible")
    }, 100)


    setTimeout(() => {
      window.removeARElement(plantKey)
    }, 30000)
  }

  function calculateOptimalSpatialPosition(spatialData) {
    const videoRect = videoElement.getBoundingClientRect()
    const scaleX = videoRect.width / videoElement.videoWidth
    const scaleY = videoRect.height / videoElement.videoHeight

    const screenX = spatialData.centerX * scaleX
    const screenY = spatialData.centerY * scaleY

    const scale = spatialData.distance
    const opacity = Math.max(0.4, Math.min(1.0, scale))

 
    const rotateX = 5 + spatialData.verticalTilt * 0.5 // Subtle X rotation
    const rotateY = -5 + spatialData.horizontalTilt * 0.3 // Subtle Y rotation
    const rotateZ = spatialData.horizontalTilt * 0.2 // Slight Z rotation for realism

    
    const baseCardWidth = 220 
    const baseCardHeight = 280 
    const cardWidth = baseCardWidth * scale
    const cardHeight = baseCardHeight * scale

    const margin = 20

    
    const baseOffsetX = 60 
    const baseOffsetY = 40 

    
    const horizontalOffset = baseOffsetX * (2 - scale)
    const verticalOffset = baseOffsetY * scale

    
    let optimalX = screenX + horizontalOffset 
    let optimalY = screenY - verticalOffset

  
    const leftSpace = screenX
    const rightSpace = videoRect.width - screenX
    const topSpace = screenY
    const bottomSpace = videoRect.height - screenY

   
    if (leftSpace > rightSpace && leftSpace > cardWidth + margin) {
      optimalX = screenX - cardWidth - horizontalOffset 
    }

    
    if (topSpace < cardHeight + margin) {
      optimalY = screenY + verticalOffset 
    }

    if (optimalY + cardHeight > videoRect.height - margin) {
      optimalY = videoRect.height - cardHeight - margin 
    }

    
    optimalX = Math.max(margin, Math.min(optimalX, videoRect.width - cardWidth - margin))
    optimalY = Math.max(margin, Math.min(optimalY, videoRect.height - cardHeight - margin))

    return {
      x: optimalX,
      y: optimalY,
      scale: scale,
      opacity: opacity,
      rotateX: rotateX,
      rotateY: rotateY,
      rotateZ: rotateZ,
      horizontalOffset: horizontalOffset,
      verticalOffset: verticalOffset,
    }
  }

 
  function updateARSpatialPosition(plantKey, qrPosition) {
    const arElement = document.querySelector(`[data-plant="${plantKey}"]`)
    if (!arElement) return

    const spatialData = calculateQRSpatialData(qrPosition)
    const position = calculateOptimalSpatialPosition(spatialData)

   
    const lastPosition = lastQRPositions.get(plantKey)
    let transitionSpeed = "0.05s"

    if (lastPosition) {
      const lastCenter = {
        x: lastPosition.reduce((sum, point) => sum + point.x, 0) / 4,
        y: lastPosition.reduce((sum, point) => sum + point.y, 0) / 4,
      }
      const currentCenter = { x: spatialData.centerX, y: spatialData.centerY }
      const movement = Math.sqrt(
        Math.pow(currentCenter.x - lastCenter.x, 2) + Math.pow(currentCenter.y - lastCenter.y, 2),
      )

      
      if (movement > 50) {
        transitionSpeed = "0.02s"
      } else if (movement > 20) {
        transitionSpeed = "0.03s"
      }
    }

    arElement.style.transition = `left ${transitionSpeed} ease-out, top ${transitionSpeed} ease-out, transform 0.1s ease-out, opacity 0.15s ease-out`
    arElement.style.left = `${position.x}px`
    arElement.style.top = `${position.y}px`
    arElement.style.transform = `scale(${position.scale}) rotateX(${position.rotateX}deg) rotateY(${position.rotateY}deg) rotateZ(${position.rotateZ}deg)`
    arElement.style.opacity = position.opacity

    
    const groundShadow = arElement.querySelector(".ar-ground-shadow")
    if (groundShadow) {
      groundShadow.style.transform = `scale(${position.scale}) translateX(-50%) perspective(500px) rotateX(85deg)`
      groundShadow.style.opacity = position.opacity * 0.6
    }


    const beam = arElement.querySelector(".ar-connection-beam")
    if (beam) {
      const videoRect = videoElement.getBoundingClientRect()
      const scaleX = videoRect.width / videoElement.videoWidth
      const scaleY = videoRect.height / videoElement.videoHeight
      const qrScreenX = spatialData.centerX * scaleX
      const qrScreenY = spatialData.centerY * scaleY

      const deltaX = qrScreenX - position.x
      const deltaY = qrScreenY - position.y
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      beam.style.width = `${Math.min(distance * 0.8, 150)}px`
      beam.style.transform = `translateY(-50%) rotate(${angle}deg)`
      beam.style.opacity = position.opacity * 0.8
    }

    const particles = arElement.querySelectorAll(".ar-energy-particle")
    particles.forEach((particle, index) => {
      particle.style.opacity = position.opacity * 0.8
      particle.style.animationDuration = `${(6 + index) / position.scale}s`
    })


    const edgeLights = arElement.querySelectorAll(".ar-edge-light")
    edgeLights.forEach((light) => {
      light.style.opacity = position.opacity * 0.6
    })

   
    const hologramContainer = arElement.querySelector(".ar-hologram-container")
    if (hologramContainer) {
      hologramContainer.style.filter = `brightness(${0.8 + position.scale * 0.4}) contrast(${0.9 + position.scale * 0.3})`
    }


    const cardContent = arElement.querySelector(".ar-card-content")
    if (cardContent) {
      if (position.scale < 0.5) {
        cardContent.style.opacity = "0.3"
        cardContent.style.pointerEvents = "none"
        cardContent.style.filter = "blur(1px)"
      } else if (position.scale < 0.7) {
        cardContent.style.opacity = "0.7"
        cardContent.style.pointerEvents = "limited"
        cardContent.style.filter = "blur(0.5px)"
      } else {
        cardContent.style.opacity = "1"
        cardContent.style.pointerEvents = "all"
        cardContent.style.filter = "none"
      }
    }
  }

  window.removeARElement = (plantKey) => {
    const element = document.querySelector(`[data-plant="${plantKey}"]`)
    if (element) {
      element.classList.add("ar-dematerializing")
      setTimeout(() => {
        element.remove()
        activeARElements = activeARElements.filter((el) => el !== element)
        scannedPlants.delete(plantKey)
        lastQRPositions.delete(plantKey)
      }, 800)
    }
  }

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      activeARElements.forEach((element) => element.remove())
      activeARElements = []
      scannedPlants.clear()
      lastQRPositions.clear()
    }, 500)
  })

  window.addEventListener("resize", () => {
    activeARElements.forEach((element) => element.remove())
    activeARElements = []
    scannedPlants.clear()
    lastQRPositions.clear()
  })


  window.addEventListener("beforeunload", () => {
    if (qrScanner) {
      qrScanner.stop()
    }
  })
})
