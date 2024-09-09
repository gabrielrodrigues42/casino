const roullete = document.querySelector(".roullete");
const trigger = document.querySelector(".trigger");
const balanceDisplay = document.getElementById("balance");
const resultDisplay = document.getElementById("result");
const totalGainLossDisplay = document.getElementById("totalGainLoss");
const betAmountInput = document.getElementById("betAmount");
const colorChoice = document.getElementById("colorChoice"); // Novo: Seleção da cor

let balance = 1000; // Saldo inicial
let currentRotation = 0; // Ângulo de rotação atual
let totalGainLoss = 0; // Ganho/Perda Acumulado
let roundCounter = 0; // Contador de rodadas (para a lógica futura)

trigger.addEventListener("click", onClickTrigger);

function onClickTrigger(e) {
  const betAmount = parseInt(betAmountInput.value);
  const chosenColor = colorChoice.value; // Obtém a cor selecionada

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
    const resultMultiplier = getResult(normalizedRotation, chosenColor);

    // Atualização do saldo e resultado
    const gainOrLoss =
      resultMultiplier >= 0
        ? betAmount * resultMultiplier - betAmount
        : -betAmount;
    balance += gainOrLoss;
    totalGainLoss += gainOrLoss; // Atualiza o ganho/perda acumulado

    balanceDisplay.textContent = balance;
    resultDisplay.textContent = gainOrLoss > 0 ? `+${gainOrLoss}` : gainOrLoss;
    totalGainLossDisplay.textContent =
      totalGainLoss > 0 ? `+${totalGainLoss}` : totalGainLoss;

    roundCounter++; // Atualiza o contador de rodadas
  }, 4000); // Tempo da animação
}

function getResult(rotation, chosenColor) {
  // Cada fatia tem 22.5 graus
  const sectionAngle = 22.5;
  const sectionIndex = Math.floor(rotation / sectionAngle);

  let actualColor;
  let multiplier;

  // Definindo a cor real da seção com base no índice
  if (sectionIndex === 0) {
    actualColor = "green"; // Verde
    multiplier = 14;
  } else if (sectionIndex % 2 === 0) {
    actualColor = "black"; // Preto
    multiplier = 2;
  } else {
    actualColor = "red"; // Vermelho
    multiplier = 4;
  }

  console.log(`Cor sorteada: ${actualColor}, Cor escolhida: ${chosenColor}`);

  // Se a cor sorteada for a cor escolhida, ganha o multiplicador
  if (actualColor === chosenColor) {
    return multiplier; // Ganha de acordo com o multiplicador da fatia
  }

  // Caso contrário, perde (retorna -1 para indicar a perda)
  return -1;
}
