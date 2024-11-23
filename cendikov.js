document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const flipsCounter = document.getElementById('flips');
    const statusText = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const helpButton = document.getElementById('help');
    
    let flips = 0;
    let firstCard = null;
    let secondCard = null;
    let canFlip = true;

    const statusMessages = [
        { maxFlips: 5, message: "Čenďourova mamina" },
        { maxFlips: 10, message: "Čenda enthusiast" },
        { maxFlips: 15, message: "Čenda enjoyer" },
        { maxFlips: 20, message: "Cat food lover" },
        { maxFlips: 30, message: "Smelly feet licker" },
        { maxFlips: 40, message: "Čendík je král" },
        { maxFlips: 50, message: "Nechceš aby ti v tom Čenda trochu pomohl???" },
        { maxFlips: Infinity, message: "KDE SOU ALIMENTY NA KRŮTU???" }
    ];

    helpButton.addEventListener('click', () => {
        alert("Nevzdávej se \n" +
              "Ale pokud je to na tebe moc Čendíků a ztrácíš se a už tě nebaví klikat...\n" +
              "Nezapomeň, že jsi teď developerka a můžeš si kód ohýbat tak, aby ti pomáhal.\n" +
              "\n" +
              "Můžeš zkusit třeba najít CSS třídu \".card-front\"\n" +
              "A vypnout u ní pravidlo \"backface-visibility\"\n"+
			  "Nebo vymyslet jiný způsob, jak se dostat k odpovědi xP");
    });

    const createCardPairs = () => {
        const cards = Array.from({ length: 16 }, (_, i) => ({
            id: i + 1,
            image: `img/cenda${i + 1}.jpg`
        }));
        return [...cards, ...cards];
    };

    const shuffleCards = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const updateStatus = () => {
        const status = statusMessages.find(s => flips <= s.maxFlips);
        statusText.textContent = status.message;
    };

    const createCard = (cardData) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = cardData.id;

        card.innerHTML = `
            <div class="card-front"></div>
            <div class="card-back">
                <img src="${cardData.image}" alt="Cenda ${cardData.id}">
            </div>
        `;

        card.addEventListener('click', () => flipCard(card));
        return card;
    };

    const flipCard = (card) => {
        if (!canFlip || card.classList.contains('flipped') || card === firstCard) return;

        card.classList.add('flipped');

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        canFlip = false;
        flips++;
        flipsCounter.textContent = flips;
        updateStatus();
        checkMatch();
    };

    const checkMatch = () => {
        const match = firstCard.dataset.id === secondCard.dataset.id;

        match ? disableCards() : unflipCards();
    };

    const disableCards = () => {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
        
        const allCards = document.querySelectorAll('.card');
        const allFlipped = Array.from(allCards).every(card => card.classList.contains('flipped'));
        if (allFlipped) {
            setTimeout(() => {
                alert('SUPER! Pomohla jsi Čendíkovi najít všechny jeho vzpomínky na blbnutí.');
                alert('A na všech je strašně strašně stinky!');
                alert('Proto schoval svoji tajnou zbraň někde v botníku.');
                alert('STINKY FEET!');
            }, 500);
        }
    };

    const unflipCards = () => {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    };

    const resetBoard = () => {
        [firstCard, secondCard] = [null, null];
        canFlip = true;
    };

    const initGame = () => {
        gameBoard.innerHTML = '';
        flips = 0;
        flipsCounter.textContent = flips;
        updateStatus();
        
        const cardPairs = createCardPairs();
        const shuffledCards = shuffleCards(cardPairs);
        shuffledCards.forEach(cardData => {
            const card = createCard(cardData);
            gameBoard.appendChild(card);
        });
    };

    restartButton.addEventListener('click', initGame);

    initGame();
});