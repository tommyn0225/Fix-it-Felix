// src/scenes/PlayBase.js
class PlayBase extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    create() {
        // Grid configuration
        this.gridCols = 5;
        this.gridRows = 4;
        this.horizontalMargin = 80;
        this.verticalMargin = 200;
        this.bottomMargin = 100;
        this.cellWidth = (this.game.config.width - 2 * this.horizontalMargin) / this.gridCols;
        this.cellHeight = (this.game.config.height - this.verticalMargin - this.bottomMargin) / this.gridRows;
        
        // Background image
        this.add.image(320, 410, 'building')
            .setOrigin(0.5)
            .setDisplaySize(640, 820);

        // Ralph animation loop and tween
        this.ralph = new Ralph(this, 320, 110);
        this.tweens.add({
            targets: this.ralph,
            x: 400,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });
        
        // Create grid of windows (updated scale for regular windows)
        this.createGrid();

        // Set up player
        this.playerGridPos = { row: this.gridRows - 1, col: 0 };
        let startX = this.horizontalMargin + (this.playerGridPos.col + 0.5) * this.cellWidth;
        let startY = this.verticalMargin + (this.playerGridPos.row + 0.5) * this.cellHeight;
        this.felix = new Felix(this, startX, startY);
        
        // Set up controls
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            fix: 'SPACE',
            menu: 'B'
        });
        
        // Global score and lives
        if (this.registry.has('globalScore')) {
            this.score = this.registry.get('globalScore');
        } else {
            this.score = 0;
            this.registry.set('globalScore', 0);
        }
        // Lives persist if the level was completed. Retries reset lives to 3
        if (this.registry.has('globalLives')) {
            this.lives = this.registry.get('globalLives');
        } else {
            this.lives = 3;
            this.registry.set('globalLives', 3);
        }
        
        // Set up HUD: score, timer, lives, and high score
        this.timeRemaining = 60;
        this.scoreText = this.add.text(10, 10, "Score: " + this.score, { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' });
        this.timerText = this.add.text(630, 10, "Time: 60", { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' })
            .setOrigin(1, 0);
            
        // Lives icons
        this.livesIcons = [];
        for (let i = 0; i < this.lives; i++) {
            let icon = this.add.image(40 + (i * 40), 110, 'lives').setScale(0.75);
            this.livesIcons.push(icon);
        }
        
        // High Score from local storage (or 0 if not set)
        let storedHighScore = localStorage.getItem("highScore") || 0;
        this.highScoreText = this.add.text(10, 50, "High Score: " + storedHighScore, { fontFamily: 'Arial', fontSize: '32px', color: '#ffff00' });
        
        // Set up brick obstacles
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
        
        // Collision detection for bricks hitting the player
        this.physics.add.overlap(this.felix, this.bricks, this.hitByBrick, null, this);
        
        // Set up duck for level 3
        if (this.scene.key === "play3Scene") {
            this.ducks = this.physics.add.group();
            this.duckTimer = this.time.addEvent({
                delay: Phaser.Math.Between(500, 1500),
                callback: () => {
                    if (!this.gameOver && !this.win) {
                        this.spawnDuck();
                        this.duckTimer.delay = Phaser.Math.Between(500, 1500);
                    }
                },
                callbackScope: this,
                loop: true
            });
            this.physics.add.overlap(this.felix, this.ducks, this.hitByDuck, null, this);
        }
        
        this.gameOver = false;
        this.win = false;
        this.fixOnCooldown = false;
        this.moveOnCooldown = false;
        
        this.lastMoveDirection = null;
        
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }
    
    // Create a grid of normal windows
    createGrid() {
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
    }
    
    spawnBrick() {
        // Spawn brick in random column
        let col = Phaser.Math.Between(0, this.gridCols - 1);
        let x = this.horizontalMargin + (col + 0.5) * this.cellWidth;
        let y = -20;
        let brick = new BrickPrefab(this, x, y);
        this.bricks.add(brick);
    }
    
    hitByBrick(player, brick) {
        if (!this.gameOver && !this.win) {
            this.lives--;
            this.livesIcons[this.lives].destroy();
            brick.destroy();
            // Felix animation
            this.felix.setHit();
            if (this.lives <= 0) {
                // On death, play die animation
                this.felix.setDie();
                this.gameOver = true;
                this.physics.pause();
                this.add.text(320, 410, "Game Over\nPress SPACE to Replay\nPress B for Menu",
                    { fontFamily: 'Arial', fontSize: '48px', color: '#ff0000', align: 'center' }
                ).setOrigin(0.5);
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
            this.felix.setDie();
            this.add.text(320, 410, "Time Up!\nPress SPACE to Replay\nPress B for Menu", 
                { fontFamily: 'Arial', fontSize: '48px', color: '#ff0000', align: 'center' }
            ).setOrigin(0.5);
        }
    }
    
    spawnDuck() {
        // Spawn a duck in a random row
        let row = Phaser.Math.Between(0, this.gridRows - 1);
        let y = this.verticalMargin + (row + 0.5) * this.cellHeight;
        let startX = -50;
        let duck = new DuckPrefab(this, startX, y);
        this.ducks.add(duck);
        // Tween duck from left to right
        this.tweens.add({
            targets: duck,
            x: this.game.config.width + 50,
            duration: 3000,
            ease: 'Linear',
            onComplete: () => {
                duck.destroy();
            }
        });
    }
    
    hitByDuck(player, duck) {
        if (!this.gameOver && !this.win) {
            this.lives--;
            this.livesIcons[this.lives].destroy();
            duck.destroy();
            this.felix.setHit();
            
            if (this.lives <= 0) {
                this.gameOver = true;
                this.physics.pause();
                this.felix.setDie();
                this.add.text(320, 410, "Game Over\nPress SPACE to Replay\nPress B for Menu",
                    { fontFamily: 'Arial', fontSize: '48px', color: '#ff0000', align: 'center' }
                ).setOrigin(0.5);
            }
        }
    }
    
    update(time, delta) {
        // Handle win and game over conditions
        if (this.gameOver || this.win) {
            if (this.win) {
                if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
                    // Save score and lives
                    this.registry.set('globalScore', this.score);
                    this.registry.set('globalLives', this.lives);
                    // Update high score in local storage if needed
                    let storedHighScore = localStorage.getItem("highScore") || 0;
                    if (this.score > storedHighScore) {
                        localStorage.setItem("highScore", this.score);
                    }
                    if (this.scene.key === "play1Scene") {
                        this.scene.start("play2Scene");
                    } else if (this.scene.key === "play2Scene") {
                        this.scene.start("play3Scene");
                    } else {
                        this.scene.start("menuScene");
                    }
                } else if (Phaser.Input.Keyboard.JustDown(this.keys.menu)) {
                    this.scene.start("menuScene");
                }
            } else {
                if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
                    // On game over retry, reset lives to 3 but keep score
                    this.registry.set('globalLives', 3);
                    this.scene.restart();
                }
                if (Phaser.Input.Keyboard.JustDown(this.keys.menu)) {
                    this.scene.start("menuScene");
                }
            }
            return;
        }
        
        // Handle grid movement with barrier restrictions
        if (!this.moveOnCooldown) {
            let moved = false;
            let targetRow = this.playerGridPos.row;
            let targetCol = this.playerGridPos.col;
            
            // Get the current window from the grid
            let currentWindow = this.windows.find(win => win.row === this.playerGridPos.row && win.col === this.playerGridPos.col);
            
            // Up movement: block if the target window is a WindowPlanter
            if (Phaser.Input.Keyboard.JustDown(this.keys.up) && this.playerGridPos.row > 0) {
                targetRow = this.playerGridPos.row - 1;
                let targetWindow = this.windows.find(win => win.row === targetRow && win.col === this.playerGridPos.col);
                if (targetWindow instanceof WindowPlanter) {
                    // Block upward movement due to planter barrier
                } else {
                    this.lastMoveDirection = 'up';
                    moved = true;
                }
            }
            // Down movement: block if the current window is a WindowPlanter
            else if (Phaser.Input.Keyboard.JustDown(this.keys.down) && this.playerGridPos.row < this.gridRows - 1) {
                if (currentWindow instanceof WindowPlanter) {
                    // Block downward movement due to planter barrier
                } else {
                    targetRow = this.playerGridPos.row + 1;
                    this.lastMoveDirection = 'down';
                    moved = true;
                }
            }
            // Left movement: block if current OR target window is a WindowCover
            else if (Phaser.Input.Keyboard.JustDown(this.keys.left) && this.playerGridPos.col > 0) {
                targetCol = this.playerGridPos.col - 1;
                let targetWindow = this.windows.find(win => win.row === this.playerGridPos.row && win.col === targetCol);
                if (currentWindow instanceof WindowCover || targetWindow instanceof WindowCover) {
                    // Block leftward movement due to cover barrier
                } else {
                    this.lastMoveDirection = 'left';
                    moved = true;
                }
            }
            // Right movement: block if current OR target window is a WindowCover
            else if (Phaser.Input.Keyboard.JustDown(this.keys.right) && this.playerGridPos.col < this.gridCols - 1) {
                targetCol = this.playerGridPos.col + 1;
                let targetWindow = this.windows.find(win => win.row === this.playerGridPos.row && win.col === targetCol);
                if (currentWindow instanceof WindowCover || targetWindow instanceof WindowCover) {
                    // Block rightward movement due to cover barrier
                } else {
                    this.lastMoveDirection = 'right';
                    moved = true;
                }
            }
            
            if (moved) {
                // Update grid position∂
                this.playerGridPos.row = targetRow;
                this.playerGridPos.col = targetCol;
                // Call Felix's move animation based on lastMoveDirection
                this.felix.setMove(this.lastMoveDirection);
                this.moveOnCooldown = true;
                let newX = this.horizontalMargin + (this.playerGridPos.col + 0.5) * this.cellWidth;
                let newY = this.verticalMargin + (this.playerGridPos.row + 0.5) * this.cellHeight;
                this.tweens.add({
                    targets: this.felix,
                    x: newX,
                    y: newY,
                    duration: 200, // move speed
                    ease: 'Power2',
                    onComplete: () => {
                        this.moveOnCooldown = false;
                    }
                });
            }
        }
        
        // Handle fixing windows
        if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
            if (!this.fixOnCooldown) {
                let currentWindow = this.windows.find(win => win.row === this.playerGridPos.row && win.col === this.playerGridPos.col);
                if (currentWindow && !currentWindow.fixed) {
                    currentWindow.fix();
                    this.sound.play('hammer', { volume: 0.25 });
                    this.score += 100;
                    this.scoreText.setText("Score: " + this.score);
                    // Update high score if needed
                    let storedHighScore = localStorage.getItem("highScore") || 0;
                    if (this.score > storedHighScore) {
                        localStorage.setItem("highScore", this.score);
                        this.highScoreText.setText("High Score: " + this.score);
                    }
                    // Call Felix's fix animation
                    this.felix.setFix();
                }
                this.fixOnCooldown = true;
                this.time.addEvent({
                    delay: 100, // fix cooldown
                    callback: () => { this.fixOnCooldown = false; },
                    callbackScope: this
                });
            }
        }
        
        // Remove bricks that fall off the screen
        this.bricks.children.each(function(brick) {
            if (brick.y > this.game.config.height + brick.height) {
                brick.destroy();
            }
        }, this);
        
        // Remove ducks that move offscreen
        if (this.scene.key === "play3Scene") {
            this.ducks.children.each(function(duck) {
                if (duck.x > this.game.config.width + 100) {
                    duck.destroy();
                }
            }, this);
        }
        
        // Check win condition: all windows fixed
        if (!this.gameOver && !this.win && this.windows.every(win => win.fixed)) {
            this.win = true;
            this.physics.pause();
            let bonus = this.timeRemaining * 100;
            this.score += bonus;
            this.scoreText.setText("Score: " + this.score);
            // Save persistent score and lives before moving to the next level
            this.registry.set('globalScore', this.score);
            this.registry.set('globalLives', this.lives);
            // Update high score in local storage if needed
            let storedHighScore = localStorage.getItem("highScore") || 0;
            if (this.score > storedHighScore) {
                localStorage.setItem("highScore", this.score);
            }
            // Display win text with options
            this.add.text(320, 410,
                "You Win!\nBonus: " + bonus + "\nFinal Score: " + this.score +
                "\nPress SPACE for Next Level\nPress B for Menu",
                { fontFamily: 'Arial', fontSize: '48px', color: '#00ff00', align: 'center' }
            ).setOrigin(0.5);
        }
    }
}
