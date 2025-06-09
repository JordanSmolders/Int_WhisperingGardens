const circles = document.querySelectorAll('.circle');
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');
const titleText = document.querySelector('#text-title');
const infoText = document.querySelector('#text-info');
let activeIndex = 4;

const text = [
  {title: "Ready when you are", info: "Abby is yours to explore. Tap the map, follow a feeling, or just take a breath.There’s no rush. Everything you need is already here."},
  {title: "Your voice, without sound", info: "Leave a signal — a photo, a thought, a movement. It becomes part of a glowing sculpture that grows with every response. The more we interact, the brighter it glows."},
  {title: "A journey you can wear", info: "In each zone, you’ll collect a token. The more you explore, the more materials, colors, textures, charms you unlock. You’ll use them to craft your own bracelet. A reminder of your journey."},
  {title: "Every part counts", info: "Move through the garden at your own pace. Zone 1: Heal your body with real plants Zone 2: Calm your mind with guided breathing Zone 3: Leave a mark. Find connection"},
  {title: "Welkome to ABBY!", info: "You’ve just stepped into Abby — va garden designed to help you slow down, heal, and connect. There’s no right way to start. Just follow what feels right."},
]

function updateText() {
  const current = text[activeIndex];
  titleText.textContent = current.title;
  infoText.textContent = current.info;
}

function circleSize(relativeIndex) {
  const sizeMap = {
    0: 200,
    1: 77,
    2: 50,
    3: 28,
    4: 20
  };

  const distance = Math.abs(relativeIndex);
  return sizeMap[distance] || 0;
}

function updateCarousel() {
  const centerX = 50;
  const centerY = 300;
  const radius = 250;

  const angleStep = 25;
  const startAngle = 0;

  circles.forEach((circle, i) => {
    const relativeIndex = i - activeIndex;
    const angle = startAngle + (relativeIndex) * angleStep;
    const rad = angle * (Math.PI / 180);

    const x = centerX + (radius * 0.5) * Math.cos(rad);
    const y = centerY + (radius * 0.9) * Math.sin(rad);
    const size = circleSize(relativeIndex);

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.transform = `translate(-50%, -50%)`;

    circle.classList.toggle('active', i === activeIndex);
  });
}

nextBtn.addEventListener('click', () => {
  if (activeIndex > 0) {
    activeIndex--;
    updateCarousel();
    updateText();
  }
});

prevBtn.addEventListener('click', () => {
  if (activeIndex < circles.length - 1) {
    activeIndex++;
    updateCarousel();
    updateText();
  }
});

updateCarousel();
updateText();
