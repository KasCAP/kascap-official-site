/* =========================
   KASHIN CHAPTER 2 HOLDER GATE
   Step B: Kasware connect + signature check entry
========================= */

const KASCAP_AUTH_API = "https://kascap-auth.mr0834gogo.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("chapterGateModal");
  const closeBtn = document.getElementById("gateCloseBtn");
  const connectBtn = document.getElementById("connectWalletBtn");
  const statusText = document.getElementById("gateStatus");
  const titleText = document.getElementById("gateTitle");
  const chapterButtons = document.querySelectorAll(".chapter2-btn");

  let selectedChapter = "2";
  let selectedLang = "jp";

  function setStatus(message, type = "") {
    statusText.textContent = message;
    statusText.classList.remove("success", "error");
    if (type) statusText.classList.add(type);
  }

  function openGate(button) {
    selectedChapter = button.dataset.chapter || "2";
    selectedLang = button.dataset.lang || "jp";
    titleText.textContent = `Chapter ${selectedChapter}`;

    setStatus("Connect your wallet to verify your KASHIN holdings.");
    connectBtn.disabled = false;
    connectBtn.textContent = "CONNECT WALLET";

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeGate() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  async function postJson(url, body) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || "Request failed.");
    }

    return data;
  }

  async function getKaswareAddress() {
    if (!window.kasware) {
      throw new Error("Kasware Wallet was not found.\n\nPlease install Kasware Wallet and try again.");
    }

    let accounts = [];

    if (typeof window.kasware.requestAccounts === "function") {
      accounts = await window.kasware.requestAccounts();
    } else if (typeof window.kasware.getAccounts === "function") {
      accounts = await window.kasware.getAccounts();
    } else {
      throw new Error("Kasware connection method was not found.");
    }

    const address = Array.isArray(accounts) ? accounts[0] : accounts;

    if (!address) {
      throw new Error("Could not get your wallet address.");
    }

    return address;
  }

  async function signKaswareMessage(message) {
    if (typeof window.kasware.signMessage === "function") {
      return await window.kasware.signMessage(message);
    }

    if (typeof window.kasware.sign === "function") {
      return await window.kasware.sign(message);
    }

    throw new Error("Kasware signature method was not found.");
  }

  chapterButtons.forEach((button) => {
    button.addEventListener("click", () => openGate(button));
  });

  closeBtn.addEventListener("click", closeGate);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeGate();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeGate();
    }
  });

  connectBtn.addEventListener("click", async () => {
    try {
      connectBtn.disabled = true;
      connectBtn.textContent = "CONNECTING...";
      setStatus("Checking Kasware Wallet...");

      const address = await getKaswareAddress();

      setStatus("Wallet connected. Please sign the verification message...");
      connectBtn.textContent = "SIGN MESSAGE";

      const nonceData = await postJson(`${KASCAP_AUTH_API}/api/auth/nonce`, {
        address,
        chapter: selectedChapter,
        lang: selectedLang,
      });

      const signature = await signKaswareMessage(nonceData.message);

      setStatus("Verifying signature and KASHIN holdings...");
      connectBtn.textContent = "VERIFYING...";

      const verifyData = await postJson(`${KASCAP_AUTH_API}/api/auth/verify`, {
        address,
        chapter: selectedChapter,
        lang: selectedLang,
        nonce: nonceData.nonce,
        message: nonceData.message,
        signature,
      });

      if (!verifyData.granted) {
        throw new Error(verifyData.message || "Access denied. KASHIN holder verification failed.");
      }

      sessionStorage.setItem("kascapChapter2Token", verifyData.token);
      sessionStorage.setItem("kascapChapter2Lang", selectedLang);

      setStatus("Access granted. Opening Chapter 2...", "success");
      connectBtn.textContent = "ACCESS GRANTED";

      setTimeout(() => {
        window.location.href = `./viewer.html?chapter=${selectedChapter}&lang=${selectedLang}&protected=1&token=${encodeURIComponent(verifyData.token)}`;
      }, 600);
    } catch (error) {
      connectBtn.disabled = false;
      connectBtn.textContent = "CONNECT WALLET";
      setStatus(error.message || "Failed to connect wallet.", "error");
    }
  });
});
