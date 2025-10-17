(() => {
  const recipient = "0x8b82E60e4353E0f65EC0aD27C852B0c252962b59";
  const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const qp = new URLSearchParams(location.search);
  const amountUsd = Number((qp.get('price') || '59').replace(/[^0-9.]/g,'')) || 59;

  const priceEl = document.getElementById('price'); if (priceEl) priceEl.textContent = amountUsd;
  const mmAmt   = document.getElementById('mm-amt'); if (mmAmt)   mmAmt.textContent   = amountUsd;
  const btn = document.getElementById('pay-crypto'); if (!btn) return;

  const label = n => `Pay with MetaMask (USDC $${n})`;
  btn.textContent = label(amountUsd);

  // Deep link fallback (mobile MetaMask)
  const units = (Math.round(amountUsd * 1e6)).toString(); // 6 decimals for USDC
  const deepLink = `https://metamask.app.link/send/${usdc}@1/transfer?address=${recipient}&uint256=${units}`;

  if (!window.ethereum) { btn.onclick = () => window.open(deepLink,'_blank'); return; }

  btn.onclick = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const net = await provider.getNetwork();
      if (net.chainId !== 1) {
        await provider.send('wallet_switchEthereumChain', [{ chainId: '0x1' }]);
      }
      const signer = provider.getSigner();
      const erc20 = new ethers.Contract(usdc, ["function transfer(address to,uint256 amount) returns (bool)"], signer);
      const amount = BigInt(Math.round(amountUsd * 1e6)); // 6 decimals
      const tx = await erc20.transfer(recipient, amount);
      const old = btn.textContent; btn.textContent = 'Waiting for confirmation...';
      await tx.wait(); btn.textContent = 'Paid via MetaMask ✔';
    } catch (e) { alert((e && e.message) || String(e)); }
  };
})();
