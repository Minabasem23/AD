// ===== Telegram check =====
if (!window.Telegram || !Telegram.WebApp) {
  alert("❌ افتح الصفحة من داخل Telegram فقط");
  throw new Error("Not in Telegram");
}
Telegram.WebApp.ready();

// ===== Variables =====
const userId = Telegram.WebApp.initDataUnsafe?.user?.id || "guest";
document.getElementById("uid").textContent = userId;

const REWARD = 0.00017;
const MIN_WITHDRAW = 0.1;
const WAIT_TIME = 15; // seconds

let balance = 0;
let adsWatched = 0;

// ===== Helper functions =====
async function apiCall(endpoint, method="GET", body=null){
  const options = { method };
  if(body) {
    options.headers = {"Content-Type":"application/json"};
    options.body = JSON.stringify(body);
  }
  const res = await fetch(endpoint, options);
  return res.json();
}

async function updateWallet() {
  const data = await apiCall(`/get_wallet/${userId}`);
  balance = data.balance;
  adsWatched = data.ads;
  document.getElementById("balance").textContent = balance.toFixed(6);
  document.getElementById("ads").textContent = adsWatched;
}

// ===== Initialize user =====
(async ()=>{
  await apiCall("/init_user", "POST", {uid: userId});
  await updateWallet();
})();

// ===== Watch Ad =====
let adStart = 0;
document.getElementById("watchBtn").onclick = async () => {
  if (typeof show_10638478 !== "function") {
    alert("SDK not loaded");
    return;
  }

  adStart = Date.now();
  const status = document.getElementById("status");
  status.textContent = "⏳ Watching ad...";
  status.classList.remove("hidden");

  try {
    await show_10638478({ ymid: userId });
  } catch {
    status.textContent = "❌ No ad available";
    return;
  }

  const watched = (Date.now() - adStart)/1000;
  if(watched < WAIT_TIME){
    status.textContent = "❌ You must wait 15 seconds";
    return;
  }

  // Add reward to server
  await apiCall("/add_ad_reward", "POST", {uid: userId});
  await updateWallet();

  status.textContent = `✅ +${REWARD} USDT added`;
  setTimeout(()=> status.classList.add("hidden"), 3000);
};

// ===== Withdraw =====
document.getElementById("withdrawBtn").onclick = async () => {
  const amount = parseFloat(document.getElementById("withdrawAmount").value);
  if(!amount || amount < MIN_WITHDRAW){
    alert("❌ Minimum withdraw is 0.1 USDT");
    return;
  }
  if(amount > balance){
    alert("❌ Insufficient balance");
    return;
  }

  const res = await apiCall("/withdraw", "POST", {uid: userId, amount});
  if(res.error){
    alert("❌ " + res.error);
    return;
  }

  document.getElementById("withdrawCode").textContent =
    "Withdraw Code:\n" + res.withdraw_code;

  await updateWallet();
  document.getElementById("withdrawAmount").value = "";
};

// ===== Preload =====
show_10638478({type:"preload", ymid:userId}).catch(()=>{});