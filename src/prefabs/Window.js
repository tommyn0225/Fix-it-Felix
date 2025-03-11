// src/prefabs/Window.js
class WindowPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Start with broken frame
        super(scene, x, y, 'window', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.setScale(1.5);

        // Need to fix twice
        this.fixCount = 0;
        this.fixed = false;
    }
    
    fix() {
        if (this.fixed) return;
        this.fixCount++;
        if (this.fixCount >= 2) {
            this.fixed = true;
            // Set to fully fixed frame
            this.setFrame(2);
        } else {
            // Set to partially fixed frame
            this.setFrame(1);
        }
    }
}
