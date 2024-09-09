const roullete = document.querySelector(".roullete");
const trigger = document.querySelector(".trigger");
const balanceDisplay = document.getElementById("balance");
const resultDisplay = document.querySelector(".result-display span");
const totalGainLossDisplay = document.querySelector(
  ".total-gain-loss-display span"
);
const betAmountInput = document.getElementById("betAmount");
const colorChoice = document.getElementById("colorChoice");
const roundCounterDisplay = document.getElementById("roundCounter");
const colorToggleButton = document.getElementById("colorToggleButton");

let balance = 1000; // Saldo inicial
let currentRotation = 0; // Ângulo de rotação atual
let totalGainLoss = 0; // Ganho/Perda Acumulado
let roundCounter = 0; // Contador de rodadas
let isColorModeEnabled = false; // Estado para saber se o modo de cores (verde/vermelho) foi ativado

// Inicializa o texto do botão como "Colorido"
colorToggleButton.textContent = "Colorido";

// Função para alternar entre branco estático e verde/vermelho conforme o resultado
colorToggleButton.addEventListener("click", () => {
  isColorModeEnabled = !isColorModeEnabled; // Alterna o estado
  if (!isColorModeEnabled) {
    // Se desativar, volta os textos para branco
    resultDisplay.style.color = "white";
    totalGainLossDisplay.style.color = "white";
    colorToggleButton.textContent = "Colorido"; // Atualiza o texto do botão
  } else {
    updateTextColor(parseInt(resultDisplay.textContent)); // Usa o valor real do resultado atual
    colorToggleButton.textContent = "Branco"; // Atualiza o texto do botão
  }
});

trigger.addEventListener("click", onClickTrigger);

function onClickTrigger(e) {
  const betAmount = parseInt(betAmountInput.value);
  const chosenColor = colorChoice.value;

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

    // Atualiza o saldo
    balanceDisplay.textContent = balance;

    // Formatação correta do sinal
    resultDisplay.textContent =
      gainOrLoss >= 0 ? `+${gainOrLoss}` : `${gainOrLoss}`;
    totalGainLossDisplay.textContent =
      totalGainLoss >= 0 ? `+${totalGainLoss}` : `${totalGainLoss}`;

    // Atualiza a cor dos textos (apenas se o modo de cor estiver ativado)
    if (isColorModeEnabled) {
      updateTextColor(gainOrLoss);
    }

    // Incrementar e atualizar o contador de rodadas
    roundCounter++;
    roundCounterDisplay.textContent = roundCounter;
  }, 4000); // Tempo da animação
}

// Função para atualizar a cor conforme o resultado da aposta (verde/vermelho)
function updateTextColor(gainOrLoss) {
  // A cor deve ser verde se for positivo e vermelho se for negativo
  resultDisplay.style.color = gainOrLoss >= 0 ? "green" : "red";
  totalGainLossDisplay.style.color = totalGainLoss >= 0 ? "green" : "red";
}

function getResult(rotation, chosenColor) {
  // Cada fatia tem 22.5 graus
  const sectionAngle = 22.5;

  // Normalizando a rotação para garantir que esteja entre 0 e 360 graus
  const normalizedRotation = rotation % 360;

  // Calcula o índice da fatia correspondente, usando Math.round para melhorar a precisão
  const sectionIndex = Math.floor(normalizedRotation / sectionAngle);

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

