"use strict";

/* =========================
   KCA HOLDER VERIFY
========================= */

const VERIFY_ENDPOINT = "https://kascap-auth.mr0834gogo.workers.dev/verify-kca";
const HOLDER_PAGE = "holder.html";

const connectBtn = document.getElementById("connectBtn");
const statusText = document.getElementById("statusText");

function setStatus(message, type = "") {
  statusText.textContent = message;
  statusText.className = `status-text ${type}`;
}

async function getKaswareAddress() {
  if (!window.kasware) {
    throw new Error("KasWare Wallet was not found. Please install KasWare Wallet and try again.");
  }

  const accounts = await window.kasware.requestAccounts();

  if (!accounts || !accounts.length) {
    throw new Error("No wallet address was returned.");
  }

  return accounts[0];
}

async function verifyKcaHolder(address) {
  const response = await fetch(VERIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      address: address
    })
  });

  if (!response.ok) {
    throw new Error("Verification failed. Please try again later.");
  }

  const data = await response.json();

  return Boolean(data && data.ok === true && data.hasKca === true);
}

async function handleConnect() {
  try {
    connectBtn.disabled = true;
    setStatus("Connecting wallet...", "loading");

    const address = await getKaswareAddress();

    setStatus("Wallet connected. Checking KCA holdings...", "loading");

    const isHolder = await verifyKcaHolder(address);

    if (!isHolder) {
      setStatus("Access denied. This wallet does not hold KCA.", "error");
      connectBtn.disabled = false;
      return;
    }

    setStatus("Access granted. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = HOLDER_PAGE;
    }, 700);

  } catch (error) {
    console.error(error);
    setStatus(error.message || "Something went wrong.", "error");
    connectBtn.disabled = false;
  }
}

connectBtn.addEventListener("click", handleConnect);