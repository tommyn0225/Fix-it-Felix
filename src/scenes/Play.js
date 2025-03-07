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

        // Ground floor windows
        this.windows = [];
        let groundSpacing = this.game.config.width / 5;
        for (let i = 0; i < 4; i++) {
            let windowX = (i + 1) * groundSpacing;
            let windowY = floorY - 75;
            let win = new WindowPrefab(this, windowX, windowY);
            this.windows.push(win);
        }
        // Platform windows
        for (let j = 0; j < 3; j++) {
            let plat = this.platforms[j];
            let platLeftEdge = plat.x - (610 / 2);
            let platSpacing = 610 / 5;
            for (let i = 0; i < 4; i++) {
                let windowX = platLeftEdge + (i + 1) * platSpacing;
                let windowY = plat.y - 75;
                let win = new WindowPrefab(this, windowX, windowY);
                this.windows.push(win);
            }
        }

        // Felix sprite
        this.felix = this.physics.add.sprite(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'felix'
        );
        this.felix.setScale(1.5);
        this.felix.setCollideWorldBounds(true);

        // Colliders
        this.floorCollider = this.physics.add.collider(this.felix, this.floor);

        // One-way platform colliders with drop-through behavior
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

        // Bricks
        this.bricks = this.physics.add.group();
        this.time.addEvent({
            delay: Phaser.Math.Between(500, 2000),
            callback: this.spawnBrick,
            callbackScope: this,
            loop: true
        });
    }

    spawnBrick() {
        // Spawn 1-3 bricks at random x positions at the top
        let count = Phaser.Math.Between(1, 3);
        for (let i = 0; i < count; i++) {
            let x = Phaser.Math.Between(32, this.game.config.width - 32);
            let brick = this.physics.add.sprite(x, -32, 'brick');
            brick.setVelocityY(Phaser.Math.Between(400, 600));
            brick.body.allowGravity = false;
            this.bricks.add(brick);
        }
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

        // Fix window with SPACE and nearby window
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

        // Remove bricks off screen
        this.bricks.children.each(function(brick) {
            if (brick.y > this.game.config.height + brick.height) {
                brick.destroy();
            }
        }, this);
    }
}
