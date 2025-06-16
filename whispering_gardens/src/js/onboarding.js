const circles = document.querySelectorAll('.circle');
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');
const titleText = document.querySelector('#text-title');
const infoText = document.querySelector('#text-info');
const skip = document.querySelector('#skip');
const svgPath = document.querySelector('.green-background path');
let activeIndex = 4;

const text = [
  {title: "Tips Before You Start", info: "There’s no right way to start, just follow what you feel right. Leave your signal on the app and see yours and other creation being displayed at atelier", color: "#BB7CD2"},
  {title: "Your bracelet", info: "It’s your key! Use it to navigate, interact with each zones and join community. The more you explore, the more materials, colors, textures, charms you unlock.",color: "#5F90FF"},
  {title: "Create & Collect", info: "Collect tokens at each zones and exchange them at the atelier to customize your bracelet.", color: "#FF5F00"},
  {title: "The healing journey", info: "You’ll move through 3 interactive zones: Thread – Discover medicinal plants through light, sound, and AR. Pulse – Try out healing methods inspired by nature Signal – Leave your own mark", color: "#FFBF50"},
  {title: "Welkome to ABBY!", info: "This is not just a museum – it’s a journey. You’ve just stepped into a story. Your bracelet holds a key (the little bean). Tap it anytime to come back to this app.", color: "#00A468"},
]

function updateText() {
  const current = text[activeIndex];
  titleText.textContent = current.title;
  infoText.textContent = current.info;
   if (svgPath) {
    svgPath.setAttribute('fill', current.color);
  }
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

function updateButtons() {
  nextBtn.classList.toggle('hidden', activeIndex === 0);
  prevBtn.classList.toggle('hidden', activeIndex === circles.length - 1);
  skip.classList.toggle('continue', activeIndex === 0);
    if (activeIndex === 0) {
    skip.textContent = 'Start Exploring';
    } else {
    skip.textContent = 'Skip onboarding';
    }
}

nextBtn.addEventListener('click', () => {
  if (activeIndex > 0) {
    activeIndex--;
    updateCarousel();
    updateText();
    updateButtons();
  }

});

prevBtn.addEventListener('click', () => {
  if (activeIndex < circles.length - 1) {
    activeIndex++;
    updateCarousel();
    updateText();
    updateButtons();
  }
});


updateCarousel();
updateText();
