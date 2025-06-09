const circles = document.querySelectorAll('.circle');
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');
let activeIndex = 4;

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
  }
});

prevBtn.addEventListener('click', () => {
  if (activeIndex < circles.length - 1) {
    activeIndex++;
    updateCarousel();
  }
});

updateCarousel();
