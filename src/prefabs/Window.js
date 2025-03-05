// src/prefabs/Window.js
class WindowPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Start broken
        super(scene, x, y, 'window', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.fixed = false;
        this.body.setImmovable(true);
    }
    
    // Fix
    fix() {
        if (!this.fixed) {
            this.fixed = true;
            this.setFrame(1);
        }
    }
}
