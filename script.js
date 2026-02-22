// ---------------------------
// إعدادات أساسية
// ---------------------------
const rewardPerAd = 0.00017;
const maxAds = 250;
const adsBeforePause = 10;
const pauseTime = 15000; // 15 ثانية
const SECRET_KEY = "voycyofyiitssitgiihh8h8ir6678922@-!?='$#3-?37>>\\;§§^©{]";

let adsWatched = 0;
let wallet = JSON.parse(localStorage.getItem('wallet')) || { balance: 1.0 };
let balance = wallet.balance;

// ---------------------------
// تحديث العرض
// ---------------------------
function updateDisplay() {
  document.getElementById('balance').textContent = balance.toFixed(6);
  document.getElementById('ads-watched').textContent = adsWatched;
}
updateDisplay();

// ---------------------------
// مشاهدة الإعلان
// ---------------------------
document.getElementById('watch-btn').addEventListener('click', async () => {
  if (adsWatched >= maxAds) {
    alert("لقد وصلت الحد الأقصى اليومي للإعلانات!");
    return;
  }

  if (typeof show_10638478 === "function") {
    try {
      await show_10638478({ ymid: "user123" });
    } catch (e) {
      alert("فشل عرض الإعلان أو تم تخطيه!");
      return;
    }
  }

  adsWatched++;
  if (adsWatched % adsBeforePause === 0) {
    document.getElementById('watch-btn').disabled = true;
    setTimeout(() => {
      document.getElementById('watch-btn').disabled = false;
      alert("يمكنك متابعة مشاهدة الإعلانات الآن!");
    }, pauseTime);
  }

  balance += rewardPerAd;
  wallet.balance = balance;
  localStorage.setItem('wallet', JSON.stringify(wallet));
  updateDisplay();

  const rewardDiv = document.getElementById('reward');
  rewardDiv.textContent = `+${rewardPerAd.toFixed(6)} USDT`;
  rewardDiv.classList.remove('hidden');
  setTimeout(() => rewardDiv.classList.add('hidden'), 3000);
});

// ---------------------------
// السحب
// ---------------------------
document.getElementById('withdraw-btn').addEventListener('click', async () => {
  const input = document.getElementById('withdraw-amount');
  const walletAddress = document.getElementById('wallet-address').value;
  const amount = parseFloat(input.value);

  if (!amount || amount < 0.1 || amount > balance) {
    alert("الرجاء إدخال مبلغ صالح (≥0.1 USDT) وأقل من رصيدك.");
    return;
  }
  if (!walletAddress) {
    alert("الرجاء إدخال عنوان المحفظة.");
    return;
  }

  try {
    const res = await fetch("https://huggingface.co/spaces/Minabasem23/Ad/api/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SECRET_KEY}`
      },
      body: JSON.stringify({ amount, walletAddress })
    });
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    balance -= amount;
    wallet.balance = balance;
    localStorage.setItem('wallet', JSON.stringify(wallet));
    updateDisplay();

    document.getElementById('withdrawed-amount').textContent = data.withdrawed_amount.toFixed(6);
    document.getElementById('withdraw-code').textContent = data.withdraw_code;
    document.getElementById('withdraw-balance').textContent = data.remaining_balance.toFixed(6);
    document.getElementById('withdraw-result').classList.remove('hidden');
    document.getElementById('copy-status').classList.add('hidden');
    input.value = "";
  } catch (err) {
    alert("حدث خطأ أثناء السحب!");
    console.error(err);
  }
});

// ---------------------------
// نسخ كود السحب
// ---------------------------
document.getElementById('copy-btn').addEventListener('click', () => {
  const code = document.getElementById('withdraw-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    document.getElementById('copy-status').classList.remove('hidden');
    setTimeout(() => document.getElementById('copy-status').classList.add('hidden'), 2000);
  });
});

// ---------------------------
// تحميل الإعلان مسبقًا (اختياري)
// ---------------------------
if (typeof show_10638478 === "function") {
  show_10638478({ type: "preload", ymid: "user123" }).catch(() => {});
}