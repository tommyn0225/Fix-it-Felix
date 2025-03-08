// src/scenes/Play.js
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // Grid configuration
        this.gridCols = 5;
        this.gridRows = 4;
        this.cellWidth = this.game.config.width / this.gridCols;   // e.g., 640/5 = 128
        this.cellHeight = this.game.config.height / this.gridRows;    // e.g., 820/4 = 205

        // Background fills the screen
        this.add.image(320, 410, 'building')
            .setOrigin(0.5)
            .setDisplaySize(640, 820);

        // Create grid of windows.
        // Each cell gets a window at its center.
        this.windows = [];
        for (let row = 0; row < this.gridRows; row++) {
            for (let col = 0; col < this.gridCols; col++) {
                let centerX = (col + 0.5) * this.cellWidth;
                let centerY = (row + 0.5) * this.cellHeight;
                let winSprite = new WindowPrefab(this, centerX, centerY);
                // Save grid coordinates on the window for later reference.
                winSprite.row = row;
                winSprite.col = col;
                this.windows.push(winSprite);
            }
        }

        // Set up player starting grid position: bottom-left cell (row 3, col 0)
        this.playerGridPos = { row: this.gridRows - 1, col: 0 };
        let startX = (this.playerGridPos.col + 0.5) * this.cellWidth;
        let startY = (this.playerGridPos.row + 0.5) * this.cellHeight;
        this.felix = this.physics.add.sprite(startX, startY, 'felix');
        this.felix.setScale(1.5);
        this.felix.setCollideWorldBounds(true);
        // Disable gravity on Felix so he behaves like a chess piece.
        this.felix.body.setAllowGravity(false);
        // Adjust Felix's hitbox to be 32x64 (centered).
        this.felix.body.setSize(32, 64);
        this.felix.body.setOffset((this.felix.width - 32) / 2, (this.felix.height - 64) / 2);

        // Set up keyboard controls for movement and fixing.
        // Movement: W, A, S, D; Fix window: SPACE; Return to menu: B.
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

        // Brick obstacles: bricks fall from above in one of the 5 columns.
        this.bricks = this.physics.add.group();
        // Start the brick spawning sequence.
        this.spawnBrick();

        // Overlap: if a brick overlaps Felix, trigger game over.
        this.physics.add.overlap(this.felix, this.bricks, this.hitByBrick, null, this);

        // Game state flags.
        this.gameOver = false;
        this.win = false;
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
        // Choose a random column (0 to gridCols - 1)
        let col = Phaser.Math.Between(0, this.gridCols - 1);
        let x = (col + 0.5) * this.cellWidth;
        let y = -20; // spawn just above the screen
        let brick = new BrickPrefab(this, x, y);
        this.bricks.add(brick);
    
        // Schedule the next brick spawn with a random delay
        this.time.addEvent({
            delay: Phaser.Math.Between(500, 1500),
            callback: this.spawnBrick,
            callbackScope: this,
            loop: false
        });
    }
    

    hitByBrick(player, brick) {
        if (!this.gameOver && !this.win) {
            this.gameOver = true;
            brick.destroy();
            this.physics.pause();
            this.felix.setTint(0xff0000);
            this.add.text(320, 410, "Game Over\nPress SPACE to Replay\nPress B for Menu",
                { fontFamily: 'Arial', fontSize: '48px', color: '#ff0000', align: 'center' }
            ).setOrigin(0.5);
        }
    }

    update() {
        // If game over or win, allow replay/menu input.
        if (this.gameOver || this.win) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) { // SPACE to restart
                this.scene.restart();
            }
            if (Phaser.Input.Keyboard.JustDown(this.keys.menu)) { // B to go to menu
                this.scene.start("menuScene");
            }
            return;
        }

        // Update grid coordinates when a directional key is pressed
        let moved = false;
        if (Phaser.Input.Keyboard.JustDown(this.keys.left)) {
            if (this.playerGridPos.col > 0) { this.playerGridPos.col--; moved = true; }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.right)) {
            if (this.playerGridPos.col < this.gridCols - 1) { this.playerGridPos.col++; moved = true; }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
            if (this.playerGridPos.row > 0) { this.playerGridPos.row--; moved = true; }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.down)) {
            if (this.playerGridPos.row < this.gridRows - 1) { this.playerGridPos.row++; moved = true; }
        }
        if (moved) {
            let newX = (this.playerGridPos.col + 0.5) * this.cellWidth;
            let newY = (this.playerGridPos.row + 0.5) * this.cellHeight;
            this.tweens.add({
                targets: this.felix,
                x: newX,
                y: newY,
                duration: 150,
                ease: 'Power2'
            });
        }

        // Fix window
        if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
            let currentWindow = this.windows.find(win => win.row === this.playerGridPos.row && win.col === this.playerGridPos.col);
            if (currentWindow && !currentWindow.fixed) {
                currentWindow.fix();
                this.sound.play('hammer', { volume: 0.25 });
                this.score += 100;
                this.scoreText.setText("Score: " + this.score);
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
