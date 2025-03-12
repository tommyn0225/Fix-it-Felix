// src/prefabs/Window.js
class WindowPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'window', frame = 0) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.setScale(1.5);

        // The window needs to be fixed twice
        this.fixCount = 0;
        this.fixed = false;
    }
    
    fix() {
        if (this.fixed) return;
        this.fixCount++;
        if (this.fixCount >= 2) {
            this.fixed = true;
            this.setFrame(2);
        } else {
            this.setFrame(1);
        }
    }
}
