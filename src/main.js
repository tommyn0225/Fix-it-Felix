// src/main.js
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 820,
    scene: [Menu, PlayBase, Play1, Play2, Play3],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    }
};

let game = new Phaser.Game(config);

