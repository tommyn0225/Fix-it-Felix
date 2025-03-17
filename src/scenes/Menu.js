// src/scenes/Menu.js
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    // 1) Define speed constants
    init() {
        this.SPEED = 300;
        this.SPEEDMIN = 50;
        this.SPEEDMAX = 800;
    }

    preload() {
        // Existing loads
        this.load.image('building', './assets/building.png');
        this.load.image('titlescreen', './assets/titlescreen.png');
        this.load.image('brick', './assets/brick.png');
        this.load.image('lives', './assets/lives.png');
        this.load.image('smoke', './assets/5x5_white.png');
        this.load.image('titlebg', './assets/titlebg.png');

        this.load.audio('bgm', './assets/Powerup!.mp3');
        this.load.audio('bonk', './assets/bonk.mp3');
        this.load.audio('quack', './assets/quack.mp3');
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
        // Titlescreen background
        this.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'titlescreen'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.game.config.width, this.game.config.height);
        
        // Background music
        if (!this.sound.get('bgm')) {
            this.bgm = this.sound.add('bgm', { loop: true, volume: 0.10 });
            this.bgm.play();
        }

        // Define center values
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;

        this.add.image(centerX, centerY + 150, 'titlebg').setOrigin(0.5);

        // UI Text
        this.add.text(
            centerX,
            this.game.config.height - 100,
            "Assets and code by Tommy Nguyen\nSFX: mixkit\nBGM: Powerup! Jeremy Blake\n\nPress [H] for Help\nPress [SPACE] to start game",
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);

        // Start the Play scene when SPACE is pressed
        this.input.keyboard.on('keydown-SPACE', () => {
            this.sound.play('buttonClick', { volume: 0.25 });
            // Reset lives and score before starting the game
            this.registry.set('globalScore', 0);
            this.registry.set('globalLives', 3);
            this.scene.start("play1Scene");
        });
        
        
        // Open Help screen when [H] is pressed
        this.input.keyboard.on('keydown-H', () => {
            this.sound.play('buttonClick', { volume: 0.25 });
            this.scene.start("helpScene");
        });

        // Tree cut particles
        this.add.particles(centerX, centerY + 175, 'smoke', {
            lifespan: 800,
            quantity: 15,
            frequency: 250,
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            rotate: { min: 0, max: 360 }
        });
    }
}
