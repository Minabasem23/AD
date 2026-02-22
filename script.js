/* ===============================
   CONFIG
================================ */
const API_URL = "https://minabasem23-ad.hf.space"; // غيّرها
const REWARD_PER_AD = 0.000170;
const MIN_WATCH_TIME = 15; // ثانية

/* ===============================
   USER ID
================================ */
const params = new URLSearchParams(window.location.search);
const USER_ID = params.get("uid");

if (!USER_ID) {
  alert("User ID missing");
  throw new Error("No UID");
}

/* ===============================
   STATE
================================ */
let adStartTime = 0;
let isWatching = false;

/* ===============================
   WATCH AD
================================ */
async function watchAd() {
  if (isWatching) return;
  isWatching = true;

  if (typeof show_10638478 !== "function") {
    alert("Ad SDK not loaded");
    isWatching = false;
    return;
  }

  adStartTime = Date.now();

  try {
    await show_10638478({
      ymid: USER_ID
    });
  } catch (e) {
    alert("No ad available");
    isWatching = false;
    return;
  }

  const watchedSeconds = (Date.now() - adStartTime) / 1000;

  if (watchedSeconds < MIN_WATCH_TIME) {
    alert("❌ يجب مشاهدة الإعلان 15 ثانية كاملة");
    isWatching = false;
    return;
  }

  sendReward();
}

/* ===============================
   SEND REWARD
================================ */
async function sendReward() {
  try {
    const res = await fetch(API_URL + "/reward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: USER_ID
      })
    });

    const data = await res.json();

    if (data.error) {
      alert("❌ " + data.error);
    } else {
      alert("✅ +0.000170 USDT\nرصيدك: " + data.balance.toFixed(6));
    }

  } catch (err) {
    alert("Server error");
  }

  isWatching = false;
}

/* ===============================
   PRELOAD AD
================================ */
if (typeof show_10638478 === "function") {
  show_10638478({
    type: "preload",
    ymid: USER_ID
  }).catch(() => {});
}

/* ===============================
   BUTTON
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("watch-btn");
  if (btn) btn.onclick = watchAd;
});