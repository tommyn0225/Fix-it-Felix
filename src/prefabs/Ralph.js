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
        
        // Create the "intro" animation: frames 3–4
        if (!scene.anims.get('ralph_intro')) {
            scene.anims.create({
                key: 'ralph_intro',
                frames: scene.anims.generateFrameNumbers('ralph', { start: 2, end: 3 }),
                frameRate: 5,
                repeat: -1
            });
        }
        
        // Create the idle animation: frames 0–1
        if (!scene.anims.get('ralph_idle')) {
            scene.anims.create({
                key: 'ralph_idle',
                frames: scene.anims.generateFrameNumbers('ralph', { start: 0, end: 1 }),
                frameRate: 5,
                repeat: -1
            });
        }
        
        // 1) Play the "intro" animation immediately.
        this.play('ralph_intro');
        
        // 2) After 2 seconds, switch to idle and start the side-to-side tween.
        scene.time.delayedCall(2000, () => {
            this.play('ralph_idle');
            this.startTween();
        });
    }
    
    startTween() {
        // Start side-to-side tween.
        this.tween = this.scene.tweens.add({
            targets: this,
            x: 400,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });
    }
    
    // Call this method when the game is won.
    winAnimation() {
        // Stop any current tween and animation.
        if(this.tween) {
            this.tween.stop();
        }
        this.anims.stop();
        // Set Ralph to frame 5.
        this.setFrame(5);
        // Flip Ralph upside down.
        this.setFlipY(true);
        // Tween to make Ralph fall off the bottom of the screen.
        this.scene.tweens.add({
            targets: this,
            y: this.scene.game.config.height + this.height,
            ease: 'Linear',
            duration: 2000
        });
    }
    
    // If you need a lose animation (looping idle), you could simply call:
    loseAnimation() {
        this.play('ralph_idle');
    }
}
