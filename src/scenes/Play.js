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
        // Felix hitbox
        this.felix.body.setSize(32, 45);
        this.felix.body.setOffset((this.felix.width - 30) / 2, (this.felix.height - 30) / 2);

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
            fix: 'SPACE',
            menu: 'B'
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

        // Game state flags
        this.gameOver = false;
        this.win = false;

        // Brick collider
        this.physics.add.overlap(this.felix, this.bricks, this.hitByBrick, null, this);

        // Score and Timer
        this.score = 0;
        this.timeRemaining = 60;
        this.scoreText = this.add.text(10, 10, "Score: 0", { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' });
        this.timerText = this.add.text(this.game.config.width - 10, 10, "Time: 60", { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' }).setOrigin(1, 0);
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    spawnBrick() {
        // Spawn 1-3 bricks at random x positions at the top
        let formationChance = Phaser.Math.Between(1, 100);
        if (formationChance <= 30) {
            let count = Phaser.Math.Between(2, 3);
            let x = Phaser.Math.Between(32, this.game.config.width - 32);
            for (let i = 0; i < count; i++) {
                let brick = this.physics.add.sprite(x, -32 - i * 70, 'brick');
                brick.setVelocityY(Phaser.Math.Between(400, 600));
                brick.body.allowGravity = false;
                this.bricks.add(brick);
            }
        } else {
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
    }

    updateTimer() {
        if (this.gameOver || this.win) return;
        this.timeRemaining--;
        this.timerText.setText("Time: " + this.timeRemaining);
        if (this.timeRemaining <= 0) {
            this.gameOver = true;
            this.physics.pause();
            this.felix.setTint(0xff0000);
            this.add.text(
                this.game.config.width / 2,
                this.game.config.height / 2,
                "Time Up!\nPress SPACE to Replay\nPress B for Menu",
                { fontFamily: 'Arial', fontSize: '48px', color: '#ff0000', align: 'center' }
            ).setOrigin(0.5);
        }
    }

    hitByBrick(felix, brick) {
        if (!this.gameOver && !this.win) {
            this.sound.play('explosion', { volume: 0.25 });
            this.gameOver = true;
            brick.destroy();
            this.physics.pause();
            this.felix.setTint(0xff0000);
            this.add.text(
                this.game.config.width / 2,
                this.game.config.height / 2,
                "Game Over\nPress SPACE to Replay\nPress B for Menu",
                { fontFamily: 'Arial', fontSize: '48px', color: '#ff0000', align: 'center' }
            ).setOrigin(0.5);
        }
    }

    update() {
        // If game over or win, press SPACE to restart or B for menu
        if (this.gameOver || this.win) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
                this.sound.play('buttonClick', { volume: 0.25 });
                this.scene.restart();
            }
            if (Phaser.Input.Keyboard.JustDown(this.keys.menu)) {
                this.sound.play('buttonClick', { volume: 0.25 });
                this.scene.start("menuScene");
            }
            return;
        }

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
                    this.sound.play('buttonClick', { volume: 0.25 });
                    this.score += 100; // add score when fixed
                    this.scoreText.setText("Score: " + this.score);
                }
            });
        }

        // Remove bricks off screen
        this.bricks.children.each(function(brick) {
            if (brick.y > this.game.config.height + brick.height) {
                brick.destroy();
            }
        }, this);

        // Win condition
        if (!this.gameOver && !this.win && this.windows.every(win => win.fixed)) {
            this.win = true;
            this.physics.pause();
            let bonus = this.timeRemaining * 100;
            this.score += bonus;
            this.scoreText.setText("Score: " + this.score);
            this.add.text(
                this.game.config.width / 2,
                this.game.config.height / 2,
                "You Win!\nBonus: " + bonus + "\nFinal Score: " + this.score + "\nPress SPACE to Replay\nPress B for Menu",
                { fontFamily: 'Arial', fontSize: '48px', color: '#00ff00', align: 'center' }
            ).setOrigin(0.5);
        }
    }
}
