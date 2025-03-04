// src/scenes/Menu.js
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // Load assets
        this.load.image('building', './assets/building.png');
        this.load.image('titlescreen', './assets/titlescreen.png');
        this.load.image('brick', './assets/brick.png');
        // this.load.audio('bgm', './assets/bgm.mp3');
        this.load.spritesheet('felix', './assets/felix.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet('window', './assets/window.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    create() {
        // Titlescreen background (fills the screen)
        this.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'titlescreen'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.game.config.width, this.game.config.height);

        // Credits text
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 300,
            "Created by Tommy Nguyen\nMusic by ____",
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);

        // Instructions text
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 150,
            "Move with [W][A][S][D]\nfix windows with [SPACE]",
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);

        // Press Start
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 50,
            "Press [SPACE] to start game",
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);

        // Start the Play scene when SPACE is pressed
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start("playScene");
        });
    }
}
