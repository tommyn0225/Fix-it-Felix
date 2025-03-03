// src/scenes/Play.js
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // Display play scene text to confirm it's active
        this.add.text(
            game.config.width / 2,
            game.config.height / 2,
            "Play Screen",
            { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' }
        ).setOrigin(0.5);
    }
}
