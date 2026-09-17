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

const SHUFFLE_DURATION = 850;
const REVEAL_DELAY = 170;

const drawButton = document.querySelector("#drawButton");
const buttonText = document.querySelector("#buttonText");
const statusText = document.querySelector("#statusText");
const deck = document.querySelector("#deck");
const resultCard = document.querySelector("#resultCard");
const cardImage = document.querySelector("#cardImage");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function randomCard() {
  const index = Math.floor(Math.random() * cards.length);
  return cards[index];
}

async function drawCard() {
  drawButton.disabled = true;
  resultCard.hidden = true;
  resultCard.classList.remove("is-visible", "is-revealed");
  deck.hidden = false;
  deck.classList.remove("is-leaving");
  deck.classList.add("is-shuffling");

  statusText.textContent = "Embaralhando…";
  buttonText.textContent = "Sorteando…";

  await wait(SHUFFLE_DURATION);

  const selected = randomCard();
  cardImage.src = selected.file;
  cardImage.alt = `Carta ${selected.name}`;
  resultCard.setAttribute("aria-label", `Carta sorteada: ${selected.name}`);

  deck.classList.remove("is-shuffling");
  deck.classList.add("is-leaving");
  await wait(REVEAL_DELAY);

  deck.hidden = true;
  resultCard.hidden = false;

  requestAnimationFrame(() => {
    resultCard.classList.add("is-visible");
    requestAnimationFrame(() => resultCard.classList.add("is-revealed"));
  });

  await wait(620);

  statusText.textContent = `Carta sorteada: ${selected.name}`;
  buttonText.textContent = "Sortear novamente";
  drawButton.disabled = false;
}

drawButton.addEventListener("click", drawCard);

// Pré-carrega todas as imagens para uma revelação sem atraso.
cards.forEach(({ file }) => {
  const image = new Image();
  image.src = file;
});
