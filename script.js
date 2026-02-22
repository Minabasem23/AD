let balance = 0;
document.getElementById('balance').textContent = balance.toFixed(6);
const rewardPerAd = 0.000170;
const minWithdraw = 0.1;

document.getElementById('watch-btn').addEventListener('click', () => {
    // كل إعلان يزيد الرصيد
    balance += rewardPerAd;
    document.getElementById('balance').textContent = balance.toFixed(6);
});

document.getElementById('withdraw-btn').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const wallet = document.getElementById('wallet-address').value;
    if (!wallet || amount < minWithdraw || amount > balance) {
        alert("Invalid input or insufficient balance!");
        return;
    }

    // طلب للسيرفر (Hugging Face)
    const response = await fetch("https://huggingface.co/spaces/Minabasem23/Ad/api/withdraw", {
        method:"POST",
        headers: { "Content-Type":"application/json", "Authorization":"Bearer YOUR_SECRET_KEY" },
        body: JSON.stringify({ amount, walletAddress: wallet })
    });
    const data = await response.json();

    balance -= amount;
    document.getElementById('balance').textContent = balance.toFixed(6);
    document.getElementById('withdrawed-amount').textContent = amount;
    document.getElementById('withdraw-code').textContent = data.code;
    document.getElementById('withdraw-balance').textContent = data.remaining;
    document.getElementById('withdraw-result').classList.remove('hidden');
});