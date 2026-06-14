"use strict";

const KCA_CONTENT_ENDPOINT = "https://kascap-auth.mr0834gogo.workers.dev/kca-content";
const token = sessionStorage.getItem("kcaAccessToken");

const kcaContent = document.getElementById("kcaContent");

function redirectToAuth() {
  sessionStorage.removeItem("kcaAccessToken");
  window.location.replace("index.html");
}

async function loadKcaContent() {
  if (!token) {
    redirectToAuth();
    return;
  }

  try {
    const response = await fetch(KCA_CONTENT_ENDPOINT, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      redirectToAuth();
      return;
    }

    const data = await response.json();

    if (!data || data.ok !== true || !data.html) {
      redirectToAuth();
      return;
    }

    kcaContent.innerHTML = data.html;

  } catch (error) {
    console.error(error);
    redirectToAuth();
  }
}

loadKcaContent();