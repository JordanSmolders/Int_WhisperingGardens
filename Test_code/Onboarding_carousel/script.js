const circles = document.querySelectorAll('.circle');
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');

let activeIndex = 0;

function updateCarousel() {
  const centerX = 200;
  const spacing = 80;

  circles.forEach((circle, i) => {
    const offset = i - activeIndex;
    const left = centerX + offset * spacing;

    circle.style.left = `${left}px`;
    circle.classList.toggle('active', i === activeIndex);
  });
}

nextBtn.addEventListener('click', () => {
  if (activeIndex < circles.length - 1) {
    activeIndex++;
    updateCarousel();
  }
});

prevBtn.addEventListener('click', () => {
  if (activeIndex > 0) {
    activeIndex--;
    updateCarousel();
  }
});

updateCarousel();
