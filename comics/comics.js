/* =========================
   KASHIN COMIC VIEWER
========================= */

const params = new URLSearchParams(window.location.search);

const chapter = params.get("chapter") || "1";
const lang = params.get("lang") || "jp";

const totalPages = 16;
let currentPage = 1;

const comicImage = document.getElementById("comicImage");
const currentPageText = document.getElementById("currentPage");
const totalPagesText = document.getElementById("totalPages");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

totalPagesText.textContent = totalPages;

function padPageNumber(num) {
  return String(num).padStart(3, "0");
}

function getChapterFolder(chapterNumber) {
  return `ch${String(chapterNumber).padStart(2, "0")}`;
}

function getImagePath() {
  const chapterFolder = getChapterFolder(chapter);
  const pageName = `${padPageNumber(currentPage)}.webp`;

  return `../assets/comics/kashin/${chapterFolder}/${lang}/${pageName}`;
}

function updateViewer() {
  comicImage.src = getImagePath();
  currentPageText.textContent = currentPage;

  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    updateViewer();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    updateViewer();
  }
}

nextBtn.addEventListener("click", nextPage);
prevBtn.addEventListener("click", prevPage);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextPage();
  }

  if (event.key === "ArrowLeft") {
    prevPage();
  }
});

/* =========================
   SWIPE SUPPORT
========================= */

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) < 50) return;

  if (swipeDistance < 0) {
    nextPage();
  } else {
    prevPage();
  }
}

updateViewer();