import Phaser from 'phaser';

class GamblingSolitaire extends Phaser.Scene {
    constructor() {
        super({ key: 'GamblingSolitaire' });
        this.cards = [];
        this.playerChips = 100;
        this.betAmount = 10;
    }

    preload() {
        this.load.image('cardBack', 'assets/card-back.png');
        this.load.image('chip', 'assets/chip.png');
    }

    create() {
        this.add.text(20, 20, 'Gambling Solitaire', { fontSize: '24px', fill: '#fff' });
        this.chipsText = this.add.text(20, 50, `Chips: ${this.playerChips}`, { fontSize: '18px', fill: '#fff' });
        
        this.dealCards();
        
        this.rerollButton = this.add.text(20, 300, 'Reroll (10 chips)', { fontSize: '18px', fill: '#ff0' })
            .setInteractive()
            .on('pointerdown', () => this.rerollCards());

        this.stayButton = this.add.text(20, 350, 'Stay & Score', { fontSize: '18px', fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.calculateScore());
    }

    dealCards() {
        this.cards.forEach(card => card.destroy());
        this.cards = [];
        
        for (let i = 0; i < 5; i++) {
            let card = this.add.sprite(100 + i * 120, 200, 'cardBack').setInteractive();
            card.cardValue = Phaser.Math.Between(1, 13);  // Simulated card value
            card.selected = false;
            
            card.on('pointerdown', () => {
                card.selected = !card.selected;
                card.setTint(card.selected ? 0xff0000 : 0xffffff);
            });
            
            this.cards.push(card);
        }
    }

    rerollCards() {
        if (this.playerChips < 10) return;
        this.playerChips -= 10;
        this.chipsText.setText(`Chips: ${this.playerChips}`);

        this.cards.forEach(card => {
            if (card.selected) {
                card.cardValue = Phaser.Math.Between(1, 13); // Replace card
                card.clearTint();
                card.selected = false;
            }
        });
    }

    calculateScore() {
        let score = 0;
        let cardValues = this.cards.map(card => card.cardValue);
        
        // Example special rule: Bonus if all sixes
        if (cardValues.every(v => v === 6)) {
            score = 50;
        } else {
            score = cardValues.reduce((acc, val) => acc + val, 0);
        }
        
        this.playerChips += score;
        this.chipsText.setText(`Chips: ${this.playerChips}`);
        this.dealCards();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222',
    scene: GamblingSolitaire
};

const game = new Phaser.Game(config);
