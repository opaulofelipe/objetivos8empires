const cards = [
  { name: "Livre Comércio", file: "assets/cards/livre-comercio.jpeg" },
  { name: "Prosperidade", file: "assets/cards/prosperidade.jpeg" },
  { name: "Militarismo", file: "assets/cards/militarismo.jpeg" },
  { name: "Talassocracia", file: "assets/cards/talassocracia.jpeg" },
  { name: "Diplomacia", file: "assets/cards/diplomacia.jpeg" },
  { name: "Imperialismo", file: "assets/cards/imperialismo.jpeg" },
  { name: "Engenharia", file: "assets/cards/engenharia.jpeg" },
  { name: "Expansionismo", file: "assets/cards/expansionismo.jpeg" },
  { name: "Ciência", file: "assets/cards/ciencia.jpeg" },
  { name: "Urbanização", file: "assets/cards/urbanizacao.jpeg" },
];

const DRAW_COUNT = Math.min(10, cards.length);
const SHUFFLE_DURATION = 700;
const REVEAL_GAP = 130;

const drawButton = document.querySelector("#drawButton");
const resetButton = document.querySelector("#resetButton");
const cardsGrid = document.querySelector("#cardsGrid");
const deckStage = document.querySelector("#deckStage");
const template = document.querySelector("#cardTemplate");
const statusText = document.querySelector("#statusText");
const counterText = document.querySelector("#counterText");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function shuffle(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function createCard(card) {
  const node = template.content.firstElementChild.cloneNode(true);
  const image = node.querySelector("img");

  image.src = card.file;
  image.alt = `Carta ${card.name}`;
  node.setAttribute("aria-label", card.name);

  return node;
}

async function drawCards() {
  drawButton.disabled = true;
  resetButton.hidden = true;
  cardsGrid.replaceChildren();
  deckStage.classList.remove("is-hidden");
  deckStage.classList.add("is-shuffling");

  statusText.textContent = "Embaralhando…";
  counterText.textContent = `0 / ${DRAW_COUNT} reveladas`;

  await wait(SHUFFLE_DURATION);

  const selected = shuffle(cards).slice(0, DRAW_COUNT);
  deckStage.classList.remove("is-shuffling");

  selected.forEach((card) => {
    cardsGrid.appendChild(createCard(card));
  });

  const resultCards = [...cardsGrid.querySelectorAll(".result-card")];
  deckStage.classList.add("is-hidden");
  statusText.textContent = "Revelando cartas…";

  for (let index = 0; index < resultCards.length; index += 1) {
    const resultCard = resultCards[index];

    requestAnimationFrame(() => resultCard.classList.add("is-inserted"));
    await wait(80);
    resultCard.classList.add("is-revealed");

    counterText.textContent = `${index + 1} / ${DRAW_COUNT} reveladas`;
    await wait(REVEAL_GAP);
  }

  statusText.textContent = "Sorteio concluído";
  drawButton.disabled = false;
  drawButton.querySelector("span:last-child").textContent = "Sortear novamente";
  resetButton.hidden = false;
}

function resetDraw() {
  cardsGrid.replaceChildren();
  deckStage.classList.remove("is-hidden", "is-shuffling");
  drawButton.disabled = false;
  drawButton.querySelector("span:last-child").textContent = "Sortear 10 cartas";
  resetButton.hidden = true;
  statusText.textContent = `${cards.length} cartas disponíveis`;
  counterText.textContent = `0 / ${DRAW_COUNT} reveladas`;
}

drawButton.addEventListener("click", drawCards);
resetButton.addEventListener("click", resetDraw);

// Pré-carrega as imagens para que a animação de revelação seja imediata.
cards.forEach(({ file }) => {
  const image = new Image();
  image.src = file;
});
