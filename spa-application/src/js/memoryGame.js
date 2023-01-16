/**
 * Memory Game
 */

import * as Window from './window.js'

const desktop = document.getElementById('desktop') // TODO: Remove me
const prefix = '../img/memory_game'

// TODO: Need to be contained inside the window because of potential multiple
// windows
let flipped = 0
let tries = 0
let matches = 0

/**
 * Memory game
 */
export function startMemoryGame () {
  const memoryGameHTML = getMemoryGameHTML()
  Window.createNewWindow(memoryGameHTML)

  const memoryCards = document.getElementsByClassName('card')
  for (let i = 0; i < memoryCards.length; i++) {
    const card = memoryCards[i]
    card.addEventListener('click', flipCard)
  }
  const gameWindow = document.getElementById('focus')
  gameWindow.classList.add('memory-game-window')
}

/**
 * Shuffle cards in a randomized manner.
 * Copies the passed parameter array and shuffles the contents
 * to a new array which is later returned
 *
 * @param {Array} cards is the array of card images
 * @returns {Array} of the shuffled cards
 */
function shuffleCards (cards) {
  const cardsCopy = [...cards]
  const cardsLength = cards.length
  const shuffled = []

  // Divide cardsCopy.length / 2 because each card is shown twice
  for (let i = 0; i < cardsLength; i++) {
    const r = Math.floor((Math.random() * cardsCopy.length) / 2)
    shuffled.push(cardsCopy[r])
    cardsCopy.splice(r, 1)
  }
  return shuffled
}

/**
 * HTML code to start a new game of Memory.
 * Creates memory cards and shuffles them randomly.
 *
 * @returns {Array} of newly shuffled cards ready to be rendered
 */
export function getMemoryGameHTML () {
  const imgs = []
  const downfacedCard = `${prefix}/0.png`

  for (let i = 1; i < 9; i++) {
    for (let k = 0; k < 2; k++) {
      imgs.push(`${prefix}/${i}.png`)
    }
  }
  const shuffledImgs = shuffleCards(imgs)
  const shuffledCards = []
  // Slice distances because of the grid formation
  const sliceDistances = [
    [0, 4],
    [4, 8],
    [8, 12],
    [12, 16]
  ]

  for (let k = 0; k < sliceDistances.length; k++) {
    const slice = sliceDistances[k]
    const start = slice[0]
    const end = slice[1]
    const imgs = shuffledImgs.slice(start, end)

    const cards = `
      ${imgs.map(img => ` 
      <div class="card">
        <img class="card-back" src="${img}">
        <img class="card-front" src="${prefix}/0.png">
      </div>
    `).join('')}
    `
    shuffledCards.push(cards)
  }
  const newWindow = `
    <div id="memory-game">
      <div id="stats">
        <div id="tries">Tries: 0</div>
        <div id="matches">Matches: 0</div>
      </div>
      ${shuffledCards.map(c => `
        ${c}`).join('')}
    </div>
  `
  return newWindow
}

/**
 * Flip a card.
 * Adds new classes to the classlists of the HTML elements
 * to make the CSS render the elements differently.
 *
 * @param {Event} event is the clicked event
 */
export function flipCard (event) {
  const userTries = document.getElementById('tries')
  const e = event || window.event
  flipped++
  tries++
  sessionStorage.setItem('flipped', flipped)
  sessionStorage.setItem('tries', tries)
  userTries.innerHTML = `Tries: ${tries}`
  console.log(`flipped: ${flipped}
  tries: ${tries}`)
  const card = event.currentTarget
  const back = card.children[0]
  const front = card.children[1]

  if (flipped <= 2) {
    card.classList.add('flipped')
    // .lastElementChild.classList.add('flipped')
    back.classList.add('flipped')
    front.classList.add('flipped')
  }
  // After two memory cards have been flipped over
  if (flipped === 2) {
    let flippedCards = document.querySelectorAll('.flipped')
    const flippedCardsArray = Array.prototype.slice.call(flippedCards)
    flippedCards = flippedCardsArray.filter(card => card.className === 'card flipped')
    const firstCard = flippedCards[0]
    const secondCard = flippedCards[1]
    // If memory cards are a match
    if (firstCard.outerHTML === secondCard.outerHTML) {
      const userMatches = document.getElementById('matches')
      matches++
      userMatches.innerHTML = `Matches: ${matches}`
      sessionStorage.setItem('matches', matches)
      firstCard.classList.add('match')
      secondCard.classList.add('match')
      // Remove because of transition issues with CSS
      firstCard.lastElementChild.remove()
      secondCard.lastElementChild.remove()
    }
    // Flip cards back after a delay
    setTimeout(() => {
      // Only flip if no match is found
      if (firstCard.className !== 'card flipped match') {
        firstCard.classList.remove('flipped')
        secondCard.classList.remove('flipped')
      }
    }, 1000)
    flipped = 0
  }
}
