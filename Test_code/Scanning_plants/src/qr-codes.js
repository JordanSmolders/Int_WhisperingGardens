document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, generating QR codes...")

  // Check if QRious library is loaded
  if (typeof window.QRious === "undefined") {
    console.error("QRious library not loaded, falling back to manual QR codes")
    createFallbackQRCodes()
    return
  }

  // Generate QR codes using QRious
  const plants = [
    { key: "chamomile", element: "chamomileQR" },
    { key: "mint", element: "mintQR" },
    { key: "lavender", element: "lavenderQR" },
  ]

  plants.forEach((plant) => {
    try {
      const qr = new window.QRious({
        element: document.getElementById(plant.element),
        value: plant.key,
        size: 200,
        background: "white",
        foreground: "#2c3e50",
        level: "M",
      })
      console.log(`QR code generated for ${plant.key}`)
    } catch (error) {
      console.error(`Error generating QR code for ${plant.key}:`, error)
      createFallbackQR(plant.element, plant.key)
    }
  })

  // Check if images are loading
  const qrImages = document.querySelectorAll(".qr-image")

  qrImages.forEach((img, index) => {
    const plantNames = ["chamomile", "mint", "lavender"]

    img.onload = () => {
      console.log(`QR code loaded successfully for ${plantNames[index]}`)
    }

    img.onerror = () => {
      console.log(`QR code failed to load for ${plantNames[index]}, showing fallback`)
      img.style.display = "none"
      img.nextElementSibling.style.display = "block"
    }
  })

  // Add a backup timer in case images take too long
  setTimeout(() => {
    qrImages.forEach((img, index) => {
      if (!img.complete || img.naturalHeight === 0) {
        console.log(`QR code timeout for ${["chamomile", "mint", "lavender"][index]}, showing fallback`)
        img.style.display = "none"
        img.nextElementSibling.style.display = "block"
      }
    })
  }, 5000) // 5 second timeout
})

// Fallback function to create simple QR codes if library fails
function createFallbackQRCodes() {
  const plants = [
    { key: "chamomile", element: "chamomileQR" },
    { key: "mint", element: "mintQR" },
    { key: "lavender", element: "lavenderQR" },
  ]

  plants.forEach((plant) => {
    createFallbackQR(plant.element, plant.key)
  })
}

function createFallbackQR(elementId, value) {
  const element = document.getElementById(elementId)
  if (element) {
    // Use Google Charts API as fallback
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=2c3e50`
    element.innerHTML = `<img src="${qrUrl}" alt="QR Code for ${value}" style="border: 3px solid #2c3e50; border-radius: 10px; background: white;">`
    console.log(`Fallback QR code created for ${value}`)
  }
}
