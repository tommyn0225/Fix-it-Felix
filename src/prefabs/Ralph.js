// src/prefabs/Ralph.js
class Ralph extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ralph');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Prevent Ralph from falling
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        
        this.setScale(3);
        
        if (!scene.anims.get('ralph_idle')) {
            scene.anims.create({
                key: 'ralph_idle',
                frames: scene.anims.generateFrameNumbers('ralph', { start: 0, end: 1 }),
                frameRate: 5,
                repeat: -1
            });
        }
        this.play('ralph_idle');
    }
}
