/* =========================
   KASHIN COMIC VIEWER
========================= */

const KASCAP_ASSET_API = "https://kascap-auth.mr0834gogo.workers.dev";

const params = new URLSearchParams(window.location.search);

const chapter = params.get("chapter") || "1";
const lang = params.get("lang") || "jp";
const isProtected = params.get("protected") === "1";
const accessToken = params.get("token") || sessionStorage.getItem("kascapChapter2Token") || "";

const totalPagesByChapter = {
  "1": 16,
  "2": 17,
};

const totalPages = totalPagesByChapter[chapter] || 16;
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
  const pageName = `${padPageNumber(currentPage)}.webp`;

  if (chapter === "2" || isProtected) {
    const tokenParam = accessToken ? `?token=${encodeURIComponent(accessToken)}` : "";
    return `${KASCAP_ASSET_API}/protected/comics/kashin/${lang}/chapter2/${pageName}${tokenParam}`;
  }

  const chapterFolder = getChapterFolder(chapter);
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

if ((chapter === "2" || isProtected) && !accessToken) {
  window.location.href = "./index.html";
} else {
  updateViewer();
}
