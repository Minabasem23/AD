const rewardPerAd = 0.00017;
const maxAds = 250;
const pauseAfterAds = 10;      // كل 10 إعلانات يتوقف مؤقتًا
const pauseTime = 15 * 1000;   // 15 ثانية انتظار داخل الإعلان
let adsWatched = 0;

// قراءة الرصيد الحالي من HTML
let balance = parseFloat(document.getElementById("balance").textContent);

// العناصر
const watchBtn = document.getElementById("watch-btn");
const rewardDiv = document.getElementById("reward");
const withdrawBtn = document.getElementById("withdraw-btn");
const copyBtn = document.getElementById("copy-btn");

// ---------------- Watch Ad ----------------
watchBtn.addEventListener("click", async () => {
    if (adsWatched >= maxAds) {
        alert("لقد وصلت الحد اليومي للإعلانات!");
        return;
    }

    if (typeof show_10638478 === "function") {
        try {
            await show_10638478({ ymid: "user123" }); // عرض الإعلان
            await new Promise(r => setTimeout(r, pauseTime)); // انتظار 15 ثانية
        } catch (e) {
            alert("الإعلان فشل أو تم تخطيه");
            return;
        }
    }

    adsWatched++;
    document.getElementById("ads-watched").textContent = adsWatched;
    balance += rewardPerAd;
    document.getElementById("balance").textContent = balance.toFixed(6);

    rewardDiv.classList.remove("hidden");
    setTimeout(() => rewardDiv.classList.add("hidden"), 3000);

    // التوقف بعد كل 10 إعلانات
    if (adsWatched % pauseAfterAds === 0) {
        watchBtn.disabled = true;
        setTimeout(() => {
            watchBtn.disabled = false;
            alert("يمكنك متابعة مشاهدة الإعلانات!");
        }, pauseTime);
    }
});

// ---------------- Withdraw ----------------
withdrawBtn.addEventListener("click", async () => {
    const amountInput = document.getElementById("withdraw-amount");
    const amount = parseFloat(amountInput.value);

    if (!amount || amount < 0.1 || amount > balance) {
        alert("المبلغ غير صالح للسحب");
        return;
    }

    const response = await fetch("/withdraw", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ amount })
    });

    const data = await response.json();
    if (data.error) { alert(data.error); return; }

    balance = data.balance;
    document.getElementById("balance").textContent = balance.toFixed(6);
    document.getElementById("withdrawed-amount").textContent = data.amount.toFixed(6);
    document.getElementById("withdraw-code").textContent = data.code;
    document.getElementById("withdraw-balance").textContent = balance.toFixed(6);
    document.getElementById("withdraw-result").classList.remove("hidden");
    document.getElementById("copy-status").classList.add("hidden");
    amountInput.value = "";
});

// ---------------- Copy Withdraw Code ----------------
copyBtn.addEventListener("click", () => {
    const code = document.getElementById("withdraw-code").textContent;
    navigator.clipboard.writeText(code).then(() => {
        document.getElementById("copy-status").classList.remove("hidden");
        setTimeout(() => document.getElementById("copy-status").classList.add("hidden"), 2000);
    });
});

// ---------------- Preload Ad ----------------
if (typeof show_10638478 === "function") {
    show_10638478({ type: "preload", ymid: "user123" }).catch(() => {});
}