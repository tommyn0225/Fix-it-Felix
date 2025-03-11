// src/prefabs/Felix.js
class Felix extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'felix');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.5);
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        
        this.body.setSize(32, 64);
        this.body.setOffset((this.width - 32) / 2, (this.height - 64) / 2);
    }
}
