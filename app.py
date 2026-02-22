from flask import Flask, render_template_string, jsonify, request
import json, os

app = Flask(__name__)

# Wallet
WALLET_FILE = "wallet.json"
if not os.path.exists(WALLET_FILE):
    with open(WALLET_FILE, "w") as f:
        json.dump({"balance": 0}, f)

def load_wallet():
    with open(WALLET_FILE, "r") as f:
        return json.load(f)

def save_wallet(wallet):
    with open(WALLET_FILE, "w") as f:
        json.dump(wallet, f)

# HTML content
with open("index.html", "r") as f:
    HTML_CONTENT = f.read()

@app.route("/")
def index():
    wallet = load_wallet()
    return render_template_string(HTML_CONTENT.replace("{{ balance }}", str(wallet["balance"])))

@app.route("/withdraw", methods=["POST"])
def withdraw():
    data = request.json
    amount = float(data.get("amount", 0))
    wallet = load_wallet()

    if amount < 0.1 or amount > wallet["balance"]:
        return jsonify({"error": "Invalid amount"}), 400

    wallet["balance"] -= amount
    save_wallet(wallet)

    import random
    code = f"{random.randint(10000,99999)}.{random.randint(10,99)}.{random.randint(10,99)}"
    return jsonify({
        "amount": amount,
        "code": code,
        "balance": wallet["balance"]
    })

if __name__ == "__main__":
    app.run(debug=True)