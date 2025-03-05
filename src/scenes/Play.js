
// src/scenes/Play.js
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // Building background
        this.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'building'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.game.config.width, this.game.config.height);

        // Floor
        const floorHeight = 40;
        const floorY = 800;
        this.floor = this.add.rectangle(
            this.game.config.width / 2,
            floorY,
            this.game.config.width,
            floorHeight,
            0x654321
        ).setOrigin(0.5);
        this.physics.add.existing(this.floor, true);

        // Platform 1
        const platformY = 645;
        this.platform = this.add.rectangle(
            this.game.config.width / 2,
            platformY,
            600,
            30,
            0x8B4513
        ).setOrigin(0.5);
        this.physics.add.existing(this.platform, true);

        // Felix sprite
        this.felix = this.physics.add.sprite(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'felix'
        );
        this.felix.setScale(1.5);
        this.felix.setCollideWorldBounds(true);

        // Set up colliders
        this.floorCollider = this.physics.add.collider(this.felix, this.floor);

        // If dropping is active, disable collision
        // Otherwise only collide if Felixs vertical velocity is >= 0 (falling or standing)
        this.dropping = false;
        this.platformCollider = this.physics.add.collider(
            this.felix,
            this.platform,
            null,
            (player, plat) => {
                if (this.dropping) return false;
                return player.body.velocity.y >= 0;
            },
            this
        );

        // Controls 
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            left: 'A',
            right: 'D',
            down: 'S'
        });

        // When S is pressed, if Felix is on the platform, enable drop through
        this.input.keyboard.on('keydown-S', () => {
            // Check that Felix is on the platform (touching down) and above it
            if (!this.dropping && this.felix.body.touching.down && this.felix.y < this.platform.y) {
                this.dropping = true;
                // Re-enable collisions after 200 ms
                this.time.delayedCall(200, () => {
                    this.dropping = false;
                });
            }
        });
    }

    update() {
        // Horizontal movement
        if (this.keys.left.isDown) {
            this.felix.setVelocityX(-200);
        } else if (this.keys.right.isDown) {
            this.felix.setVelocityX(200);
        } else {
            this.felix.setVelocityX(0);
        }

        // Jump with W (only if Felix is on something solid)
        if (this.keys.up.isDown && this.felix.body.touching.down) {
            this.felix.setVelocityY(-500);
        }
    }
}