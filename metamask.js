// PTN MetaMask USDC (Base) — simple client-only checkout
(() => {
  const RECIPIENT = "0x8b82E60e4353E0f65EC0aD27C852B0c252962b59";
  const USDC = "0x833589fCD6EDB6E08f4c7C32D4f71b54bdA02913";        // USDC contract on Base
  const CHAIN_HEX = "0x2105";   // 0x2105 = 8453 (Base)
  const CHAIN_ID = 8453;

  function getAmountUSD() {
    const qp = new URLSearchParams(location.search);
    const raw = (qp.get("price") || "59").replace(/[^0-9.]/g, "");
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 59;
  }

  function setLabels(amt) {
    const p = document.getElementById("price");   if (p) p.textContent = amt;
    const m = document.getElementById("mm-amt");  if (m) m.textContent = amt;
  }

  async function ensureBaseNetwork(provider) {
    try {
      const net = await provider.getNetwork();
      if (net.chainId !== CHAIN_ID) {
        await provider.send("wallet_switchEthereumChain", [{ chainId: CHAIN_HEX }]);
      }
    } catch (e) {
      // If chain not added
      if (e && (e.code === 4902 || String(e.message||"").includes("Unrecognized chain ID"))) {
        await provider.send("wallet_addEthereumChain", [{
          chainId: CHAIN_HEX,
          chainName: "Base",
          rpcUrls: ["https://mainnet.base.org"],
          nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
          blockExplorerUrls: ["https://basescan.org"]
        }]);
      } else {
        throw e;
      }
    }
  }

  async function init() {
    const btn = document.getElementById("pay-crypto");
    if (!btn) return; // button not on page
    const amountUsd = getAmountUSD();
    setLabels(amountUsd);

    // Mobile deep link fallback (opens MetaMask app)
    const units = (Math.round(amountUsd * 1e6)).toString(); // USDC has 6 decimals
    const deepLink = `https://metamask.app.link/send/${USDC}@8453/transfer?address=${RECIPIENT}&uint256=${units}`;

    if (!window.ethereum) {
      btn.onclick = () => window.open(deepLink, "_blank");
      return;
    }

    btn.onclick = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        await ensureBaseNetwork(provider);

        const signer = provider.getSigner();
        const abi = ["function transfer(address to,uint256 amount) returns (bool)"];
        const erc20 = new ethers.Contract(USDC, abi, signer);
        const amount = BigInt(Math.round(amountUsd * 1e6)); // 6 decimals

        const old = btn.textContent;
        btn.textContent = "Waiting for confirmation...";
        btn.style.opacity = "0.8";
        btn.style.pointerEvents = "none";

        const tx = await erc20.transfer(RECIPIENT, amount);
        await tx.wait();

        btn.textContent = "Paid via MetaMask ✔";
        btn.style.background = "#16c47f";
      } catch (e) {
        alert((e && e.message) || String(e));
      } finally {
        setLabels(getAmountUSD());
        btn.style.opacity = "";
        btn.style.pointerEvents = "";
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
