const circles = document.querySelectorAll('.circle');
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');

let activeIndex = 4;

function updateCarousel() {
  const centerX = 150;
  const centerY = 150;
  const radius = 180;

  const maxVisible = 4;
  const angleStep = 30;
  const startAngle = -90 + (maxVisible * angleStep) / 2;

  circles.forEach((circle, i) => {
    const relativeIndex = i - activeIndex;
    const angle = startAngle + (relativeIndex + maxVisible) * angleStep;
    const rad = angle * (Math.PI / 180);

    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.transform = `translate(-50%, -50%) rotateX(-70deg)`;
    circle.style.zIndex = Math.round(100 - Math.abs(relativeIndex) * 10);

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
