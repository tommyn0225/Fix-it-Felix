// src/main.js

// Game configuration with viewport size 640 x 820 and using the Menu and Play scenes
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 820,
    scene: [Menu, Play],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

// Create the Phaser game instance
const game = new Phaser.Game(config);
