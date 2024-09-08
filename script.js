const roullete = document.querySelector(".roullete");
const trigger = document.querySelector(".trigger");
const balanceDisplay = document.getElementById("balance");
const resultDisplay = document.getElementById("result");
const totalGainLossDisplay = document.getElementById("totalGainLoss");
const betAmountInput = document.getElementById("betAmount");

let balance = 1000; // Saldo inicial
let currentRotation = 0; // Ângulo de rotação atual
let totalGainLoss = 0; // Ganho/Perda Acumulado

trigger.addEventListener("click", onClickTrigger);

function onClickTrigger(e) {
  const betAmount = parseInt(betAmountInput.value);
  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Por favor, insira um valor válido para a aposta.");
    return;
  }

  if (betAmount > balance) {
    alert("Saldo insuficiente para essa aposta.");
    return;
  }

  const newRotation = Math.floor(Math.random() * 3600) + 1440; // Gira entre 4 e 10 voltas
  currentRotation += newRotation; // Atualiza a rotação atual acumulando com a nova

  roullete.style.transition = "transform 4s ease-in-out";
  roullete.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    roullete.style.transition = "none"; // Remove a transição para manter a rotação atual
    const normalizedRotation = currentRotation % 360; // Normaliza a rotação entre 0 e 360 graus
    roullete.style.transform = `rotate(${normalizedRotation}deg)`;

    // Simulação de resultado da roleta
    const resultMultiplier = getResult(normalizedRotation);

    // Atualização do saldo e resultado
    const gainOrLoss = (betAmount * resultMultiplier) - betAmount; // (Aposta * Multiplicador) - Aposta
    balance += gainOrLoss;
    totalGainLoss += gainOrLoss; // Atualiza o ganho/perda acumulado

    balanceDisplay.textContent = balance;
    resultDisplay.textContent = gainOrLoss > 0 ? `+${gainOrLoss}` : gainOrLoss;
    totalGainLossDisplay.textContent =
      totalGainLoss > 0 ? `+${totalGainLoss}` : totalGainLoss;
  }, 4000); // Tempo da animação

  function getResult(rotation) {
    // Cada fatia tem 22.5 graus
    const sectionAngle = 22.5;
    const sectionIndex = Math.floor(rotation / sectionAngle);

    // Verifica a cor da fatia baseada no índice da seção
    if (sectionIndex === 0) {
      // Verde (14x)
      return 14;
    } else if (sectionIndex % 2 === 0) {
      // Preto (2x)
      return 2;
    } else {
      // Vermelho (4x)
      return 4;
    }
  }
}
