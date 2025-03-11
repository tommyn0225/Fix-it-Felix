// src/scenes/Play.js
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // Grid configuration
        this.gridCols = 5;
        this.gridRows = 4;
        this.cellWidth = this.game.config.width / this.gridCols; 
        this.cellHeight = this.game.config.height / this.gridRows;

        // Define margins to shift the grid (these remain unchanged)
        this.horizontalMargin = 80;
        this.verticalMargin = 200;
        this.bottomMargin = 100;
        this.cellWidth = (this.game.config.width - 2 * this.horizontalMargin) / this.gridCols; 
        this.cellHeight = (this.game.config.height - this.verticalMargin - this.bottomMargin) / this.gridRows;

        // Background
        this.add.image(320, 410, 'building')
            .setOrigin(0.5)
            .setDisplaySize(640, 820);

        // Create grid of windows
        this.windows = [];
        for (let row = 0; row < this.gridRows; row++) {
            for (let col = 0; col < this.gridCols; col++) {
                let centerX = this.horizontalMargin + (col + 0.5) * this.cellWidth;
                let centerY = this.verticalMargin + (row + 0.5) * this.cellHeight;
                let winSprite = new WindowPrefab(this, centerX, centerY);
                winSprite.row = row;
                winSprite.col = col;
                this.windows.push(winSprite);
            }
        }

        // Set up player
        this.playerGridPos = { row: this.gridRows - 1, col: 0 };
        let startX = this.horizontalMargin + (this.playerGridPos.col + 0.5) * this.cellWidth;
        let startY = this.verticalMargin + (this.playerGridPos.row + 0.5) * this.cellHeight;
        this.felix = new Felix(this, startX, startY);

        // Controls
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            fix: 'SPACE',
            menu: 'B'
        });

        // Score and Timer
        this.score = 0;
        this.timeRemaining = 60;
        this.scoreText = this.add.text(10, 10, "Score: 0", { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' });
        this.timerText = this.add.text(630, 10, "Time: 60", { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' })
            .setOrigin(1, 0);
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Brick obstacles
        this.bricks = this.physics.add.group();
        this.brickTimer = this.time.addEvent({
            delay: Phaser.Math.Between(500, 1500),
            callback: () => {
                if (!this.gameOver && !this.win) {
                    this.spawnBrick();
                    this.brickTimer.delay = Phaser.Math.Between(500, 1500);
                }
            },
            callbackScope: this,
            loop: true
        });

        // If brick hits Felix then game over
        this.physics.add.overlap(this.felix, this.bricks, this.hitByBrick, null, this);

        this.gameOver = false;
        this.win = false;

        this.fixOnCooldown = false;
        this.moveOnCooldown = false;

        this.lives = 3;
        this.livesIcons = [];
        for (let i = 0; i < this.lives; i++) {
            let icon = this.add.image(60 + (i * 40), 60, 'lives').setScale(0.5);
            this.livesIcons.push(icon);
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
            this.add.text(320, 410, "Time Up!\nPress SPACE to Replay\nPress B for Menu", 
                { fontFamily: 'Arial', fontSize: '48px', color: '#ff0000', align: 'center' }
            ).setOrigin(0.5);
        }
    }

    spawnBrick() {
        // Choose a random column
        let col = Phaser.Math.Between(0, this.gridCols - 1);
        let x = this.horizontalMargin + (col + 0.5) * this.cellWidth;
        let y = -20;
        let brick = new BrickPrefab(this, x, y);
        this.bricks.add(brick);
    }

    // Remove 1 life if hit, if no lives left: game over
    hitByBrick(player, brick) {
        if (!this.gameOver && !this.win) {
            this.lives--;
            this.livesIcons[this.lives].destroy();
            brick.destroy();
            // If no lives remain, trigger game over
            if (this.lives <= 0) {
                this.gameOver = true;
                this.physics.pause();
                this.felix.setTint(0xff0000);
                this.add.text(320, 410, "Game Over\nPress SPACE to Replay\nPress B for Menu",
                    { fontFamily: 'Arial', fontSize: '48px', color: '#ff0000', align: 'center' }
                ).setOrigin(0.5);
            }
        }
    }

    update() {
        // If game over or win, allow replay/menu input
        if (this.gameOver || this.win) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
                this.scene.restart();
            }
            if (Phaser.Input.Keyboard.JustDown(this.keys.menu)) {
                this.scene.start("menuScene");
            }
            return;
        }

        // Update grid coordinates when a directional key is pressed
        if (!this.moveOnCooldown) {
            let moved = false;
            if (Phaser.Input.Keyboard.JustDown(this.keys.left) && this.playerGridPos.col > 0) {
                this.playerGridPos.col--;
                moved = true;
            } else if (Phaser.Input.Keyboard.JustDown(this.keys.right) && this.playerGridPos.col < this.gridCols - 1) {
                this.playerGridPos.col++;
                moved = true;
            } else if (Phaser.Input.Keyboard.JustDown(this.keys.up) && this.playerGridPos.row > 0) {
                this.playerGridPos.row--;
                moved = true;
            } else if (Phaser.Input.Keyboard.JustDown(this.keys.down) && this.playerGridPos.row < this.gridRows - 1) {
                this.playerGridPos.row++;
                moved = true;
            }
            if (moved) {
                this.moveOnCooldown = true;
                let newX = this.horizontalMargin + (this.playerGridPos.col + 0.5) * this.cellWidth;
                let newY = this.verticalMargin + (this.playerGridPos.row + 0.5) * this.cellHeight;
                this.tweens.add({
                    targets: this.felix,
                    x: newX,
                    y: newY,
                    duration: 400,
                    ease: 'Power2',
                    onComplete: () => {
                        this.moveOnCooldown = false;
                    }
                });
            }
        }

        // Fix window
        if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
            if (!this.fixOnCooldown) {
                let currentWindow = this.windows.find(win => win.row === this.playerGridPos.row && win.col === this.playerGridPos.col);
                if (currentWindow && !currentWindow.fixed) {
                    currentWindow.fix();
                    this.sound.play('hammer', { volume: 0.25 });
                    this.score += 100;
                    this.scoreText.setText("Score: " + this.score);
                }
                this.fixOnCooldown = true;
                this.time.addEvent({
                    delay: 200,
                    callback: function() {
                        this.fixOnCooldown = false;
                    },
                    callbackScope: this
                });
            }
        }

        // Delete bricks that fall off screen
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
            this.add.text(320, 410, "You Win!\nBonus: " + bonus + "\nFinal Score: " + this.score +
                "\nPress SPACE to Replay\nPress B for Menu",
                { fontFamily: 'Arial', fontSize: '48px', color: '#00ff00', align: 'center' }
            ).setOrigin(0.5);
        }
    }
}
