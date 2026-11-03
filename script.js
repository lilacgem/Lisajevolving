const Engine = {
    init: function() {
        console.log("%c [LISAJEVOLVING ROOT] ORB MATRIX ENGAGED ", "color: #00f2ff; font-weight: bold; background: #2e0a5e; padding: 4px;");
    },
    updatePulse: async function() {
        try {
            const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            const data = await res.json();
            document.getElementById('pulse').innerText = `BTC: $${data.bitcoin.usd} | FREQUENCY: 369Hz ACTIVE`;
        } catch (e) {
            document.getElementById('pulse').innerText = "PULSE: 369Hz | LOCAL SOVEREIGN MODE ACTIVE";
        }
    }
};

Engine.init();
Engine.updatePulse();
setInterval(Engine.updatePulse, 9000);