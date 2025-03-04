// src/main.js
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

const game = new Phaser.Game(config);
