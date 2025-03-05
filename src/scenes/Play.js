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

        // Floor (solid, always colliding)
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

        this.platforms = [];

        // Platform 1
        const platform1Y = 645;
        let platform1 = this.add.rectangle(
            this.game.config.width / 2,
            platform1Y,
            610,
            30,
            0x8B4513
        ).setOrigin(0.5);
        this.physics.add.existing(platform1, true);
        this.platforms.push(platform1);

        // Platform 2
        const platform2Y = 500;
        let platform2 = this.add.rectangle(
            this.game.config.width / 2,
            platform2Y,
            610,
            30,
            0x8B4513
        ).setOrigin(0.5);
        this.physics.add.existing(platform2, true);
        this.platforms.push(platform2);

        // Platform 3
        const platform3Y = 360;
        let platform3 = this.add.rectangle(
            this.game.config.width / 2,
            platform3Y,
            610,
            30,
            0x8B4513
        ).setOrigin(0.5);
        this.physics.add.existing(platform3, true);
        this.platforms.push(platform3);

        // Platform 4
        const platform4Y = 200;
        let platform4 = this.add.rectangle(
            this.game.config.width / 2,
            platform4Y,
            610,
            30,
            0x8B4513
        ).setOrigin(0.5);
        this.physics.add.existing(platform4, true);
        this.platforms.push(platform4);

        this.windows = [];
        this.platforms.forEach(plat => {
            let win = new WindowPrefab(this, plat.x, plat.y - 47);
            this.windows.push(win);
        });

        // Felix sprite
        this.felix = this.physics.add.sprite(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'felix'
        );
        this.felix.setScale(1.5);
        this.felix.setCollideWorldBounds(true);

        // Colliders
        // Floor collider (always active)
        this.floorCollider = this.physics.add.collider(this.felix, this.floor);

        // Create colliders for each platform using a process callback for one way behavior
        this.dropping = false;
        this.platformColliders = [];
        this.platforms.forEach(plat => {
            let collider = this.physics.add.collider(
                this.felix,
                plat,
                null,
                (player, platform) => {
                    if (this.dropping) return false;
                    return player.body.velocity.y >= 0;
                },
                this
            );
            this.platformColliders.push(collider);
        });

        // Controls
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            left: 'A',
            right: 'D',
            down: 'S',
            fix: 'SPACE'
        });

        // Drop through
        this.input.keyboard.on('keydown-S', () => {
            if (!this.dropping && this.felix.body.touching.down && this.felix.y < 700) {
                this.dropping = true;
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

        // Jump with W and if on ground
        if (this.keys.up.isDown && this.felix.body.touching.down) {
            this.felix.setVelocityY(-500);
        }

        // When SPACE is pressed and if near window
        if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
            const fixThreshold = 50;
            this.windows.forEach(win => {
                let distance = Phaser.Math.Distance.Between(
                    this.felix.x, this.felix.y,
                    win.x, win.y
                );
                if (distance < fixThreshold && !win.fixed) {
                    win.fix();
                }
            });
        }
    }
}
