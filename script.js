// ===== Telegram check =====
if (!window.Telegram || !Telegram.WebApp) {
  alert("❌ افتح الصفحة من داخل Telegram فقط");
  throw new Error("Not in Telegram");
}

Telegram.WebApp.ready();

// ===== User ID =====
const userId = Telegram.WebApp.initDataUnsafe?.user?.id || "guest";
document.getElementById("uid").textContent = userId;

// ===== Wallet data =====
const REWARD = 0.0170;
const MIN_WITHDRAW = 0.1;
const WAIT_TIME = 15; // seconds

let data = JSON.parse(localStorage.getItem("wallet_" + userId)) || {
  balance: 0,
  ads: 0
};

function save() {
  localStorage.setItem("wallet_" + userId, JSON.stringify(data));
  document.getElementById("balance").textContent = data.balance.toFixed(6);
  document.getElementById("ads").textContent = data.ads;
}
save();

// ===== Watch Ad =====
let adStart = 0;

document.getElementById("watchBtn").onclick = async () => {
  if (typeof show_10638478 !== "function") {
    alert("SDK not loaded");
    return;
  }

  adStart = Date.now();
  document.getElementById("status").textContent = "⏳ Watching ad...";
  document.getElementById("status").classList.remove("hidden");

  try {
    await show_10638478({ ymid: userId });
  } catch {
    document.getElementById("status").textContent = "❌ No ad available";
    return;
  }

  const watched = (Date.now() - adStart) / 1000;

  if (watched < WAIT_TIME) {
    document.getElementById("status").textContent =
      "❌ You must wait 15 seconds";
    return;
  }

  data.balance += REWARD;
  data.ads += 1;
  save();

  document.getElementById("status").textContent =
    `✅ +${REWARD} USDT added`;
};

// ===== Withdraw =====
document.getElementById("withdrawBtn").onclick = () => {
  const amount = parseFloat(
    document.getElementById("withdrawAmount").value
  );

  if (!amount || amount < MIN_WITHDRAW) {
    alert("❌ Minimum withdraw is 0.1 USDT");
    return;
  }

  if (amount > data.balance) {
    alert("❌ Insufficient balance");
    return;
  }

  data.balance -= amount;
  save();

  const code = btoa(
    userId + "|" + amount + "|" + Date.now()
  );

  document.getElementById("withdrawCode").textContent =
    "Withdraw Code:\n" + code;
};

// ===== Preload =====
show_10638478({ type: "preload", ymid: userId }).catch(() => {});