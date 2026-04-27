

// Step 1: Figure out how far a card should slide
// This depends on the card's position relative to the active card
function calculateCardSlideDistance(cardIndex, activeCardIndex) {
    // How many positions away is this card from the active card?
    let distanceFromActive = cardIndex - activeCardIndex;
    
    // If this is the active card, it doesn't slide
    if (distanceFromActive === 0) {
        return 0;
    }
    
    // If the card is to the left of the active card, slide it left
    // Cards show their right column (60px) when on the left
    if (distanceFromActive < 0) {
        return distanceFromActive * 0.5;
    }
    
    // If the card is to the right of the active card, slide it right
    // Cards show their left column (40px) when on the right
    return distanceFromActive * 1;
}

// Step 2: Move a card to a new horizontal position
function slideCard(card, slideDistance) {
    // Use CSS transform to smoothly slide the card
    card.style.transform = `translateX(${slideDistance}px)`;
}

// Step 3: Make a card active and update all other cards' positions
function makeCardActive(clickedCard, allCards) {
    // Get the index of the clicked card from its data attribute
    let clickedCardIndex = parseInt(clickedCard.dataset.cardIndex, 10);
    
    // Remove the active class from the previously active card (if any)
    let previousActiveCard = document.querySelector('.card.active');
    if (previousActiveCard) {
        previousActiveCard.classList.remove('active');
    }
    
    // Add the active class to the clicked card
    clickedCard.classList.add('active');
    
    // Update the position of every card relative to the newly active card
    allCards.forEach(function(card) {
        let cardIndex = parseInt(card.dataset.cardIndex, 10);
        let slideDistance = calculateCardSlideDistance(cardIndex, clickedCardIndex);
        slideCard(card, slideDistance);
    });
}

// Step 4: Attach click listeners to all cards
export function setupCardClickHandlers(allCards) {
    allCards.forEach(function(card) {
        card.addEventListener('click', function() {
            // If this card is not already active, make it active
            if (!this.classList.contains('active')) {
                makeCardActive(this, allCards);
            }
        });
    });
}


