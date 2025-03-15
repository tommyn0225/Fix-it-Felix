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
        this.load.image('lives', '/assets/lives.png');

        this.load.audio('bgm', './assets/bgm.mp3');
        this.load.audio('explosion', './assets/explosion.wav');
        this.load.audio('buttonClick', './assets/buttonclick.wav');
        this.load.audio('hammer', './assets/hammer.wav');

        this.load.spritesheet('felix', './assets/felix.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet('window', './assets/window.png', {
            frameWidth: 32,
            frameHeight: 64,
        });
        this.load.spritesheet('windowCover', './assets/windowsCover.png', {
            frameWidth: 32,
            frameHeight: 64,
        });
        this.load.spritesheet('windowPlanter', './assets/windowPlanter.png', {
            frameWidth: 32,
            frameHeight: 64,
        });
        this.load.spritesheet('duck', './assets/duck.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('ralph', './assets/ralph.png', {
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
        
        // Background music
        if(!this.sound.get('bgm')) {
            this.bgm = this.sound.add('bgm', { loop: true, volume: 0.10 });
            this.bgm.play();
        }

        // Credits text
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 300,
            "Created by Tommy Nguyen\nSounds from mixkit\nMusic from Gravity Sound",
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);

        // Instructions text
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 150,
            "Move with [W][A][S][D]\nFix windows with [SPACE]\nPress [H] for Help",
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);

        // Press Start text
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 50,
            "Press [SPACE] to start game",
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);

        // Start the Play scene when SPACE is pressed
        this.input.keyboard.on('keydown-SPACE', () => {
            this.sound.play('buttonClick', { volume: 0.25 });
            this.scene.start("play1Scene");
        });
        
        // Open Help screen when [H] is pressed
        this.input.keyboard.on('keydown-H', () => {
            this.sound.play('buttonClick', { volume: 0.25 });
            this.scene.start("helpScene");
        });
    }
}
