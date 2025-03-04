// src/scenes/Menu.js
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // Load assets
        this.load.image('building', './assets/building.png')
        this.load.image('titlescreen', './assets/titlescreen.png')
        this.load.image('brick', './assets/brick.png')
        //this.load.audio('bgm', './assets/bgm.mp3')
        this.load.spritesheet('felix', './assets/felix.png', {
            frameWidth: 64,
            frameHeight: 64,
        })
        this.load.spritesheet('window', './assets/window.png', {
            frameWidth: 64,
            frameHeight: 64,
        })
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
