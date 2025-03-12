// src/prefabs/DuckPrefab.js
class DuckPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'duck', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2);

        this.body.setAllowGravity(false);
        this.body.gravity.y = 0;
        this.body.setVelocity(0, 0);
        this.body.moves = false;

        // Create duck animation
        if (!scene.anims.get('duck_anim')) {
            scene.anims.create({
                key: 'duck_anim',
                frames: scene.anims.generateFrameNumbers('duck', { start: 0, end: 2 }),
                frameRate: 8,
                repeat: -1
            });
        }
        this.play('duck_anim');
    }
}
