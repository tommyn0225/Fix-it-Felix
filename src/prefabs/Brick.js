// src/prefabs/Brick.js
class BrickPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'brick');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set the initial downward velocity and acceleration
        this.setVelocityY(Phaser.Math.Between(150, 250));
        this.body.setAccelerationY(500);
        this.body.setAllowGravity(false);
    }
}
