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
        
        this.dead = false; // flag to track if Felix is dead
        this.setIdle(); // Start with idle frame (frame 0)
    }

    setIdle() {
        // Only reset to idle if not dead
        if (!this.dead) {
            this.setFrame(0);
        }
    }

    setMove(direction) {
        // Only perform move if not dead
        if (this.dead) return;
        // Moving (index 1) for 0.75 seconds
        this.setFrame(1);
        if (direction === 'left') {
            this.setFlipX(true);
        } else if (direction === 'right') {
            this.setFlipX(false);
        }
        this.scene.time.delayedCall(150, () => {
            this.setIdle();
        });
    }

    setFix() {
        // Only fix if not dead
        if (this.dead) return;
        // Fixing a window (index 2) for 0.65 second
        this.setFrame(2);
        this.scene.time.delayedCall(125, () => {
            this.setIdle();
        });
    }

    setHit() {
        // Only process hit if not dead.
        if (this.dead) return;
        // Getting hit by a brick (index 3) then back to idle
        this.setFrame(3);
        this.scene.time.delayedCall(200, () => {
            this.setIdle();
        });
    }

    setDie() {
        this.dead = true;
        // Dying (index 4) and remain on that frame
        this.setFrame(4);
    }

    revive() {
        this.dead = false;
        this.setIdle();
    }
}
