// src/scenes/Menu.js
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
    }

    create() {
        this.add.text(
            game.config.width / 2,
            game.config.height / 2 - 50,
            "Fix it Felix Menu",
            { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' }
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            game.config.height - 50,
            "Press SPACE to start game",
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }
        ).setOrigin(0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start("playScene");
        });
    }
}
