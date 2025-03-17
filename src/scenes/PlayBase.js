// src/scenes/PlayBase.js

// Configuration constants for grid layout and cooldown durations.
const GRID_CONFIG = {
    cols: 5,
    rows: 4,
    horizontalMargin: 80,
    verticalMargin: 200,
    bottomMargin: 100
  };
  
  const COOLDOWN = {
    move: 200,
    fix: 100,
    bounce: 200
  };
  
  class PlayBase extends Phaser.Scene {
    constructor(key) {
      super(key);
    }
  
    create() {
      this.initGridConfig();
      this.setupBackground();
      this.setupRalph();
      this.createGrid();
      this.setupPlayer();
      this.setupControls();
      this.setupHUD();
      this.setupTimers();
      this.setupObstacles();
      this.setupDuckSpawning();
      
      this.gameOver = false;
      this.win = false;
      this.fixOnCooldown = false;
      this.moveOnCooldown = false;
      this.lastMoveDirection = null;
    }
  
    // Initializes grid dimensions and margins.
    initGridConfig() {
      this.gridCols = GRID_CONFIG.cols;
      this.gridRows = GRID_CONFIG.rows;
      this.horizontalMargin = GRID_CONFIG.horizontalMargin;
      this.verticalMargin = GRID_CONFIG.verticalMargin;
      this.bottomMargin = GRID_CONFIG.bottomMargin;
      this.cellWidth = (this.game.config.width - 2 * this.horizontalMargin) / this.gridCols;
      this.cellHeight = (this.game.config.height - this.verticalMargin - this.bottomMargin) / this.gridRows;
    }
  
    // Sets up the background image.
    setupBackground() {
      this.add.image(320, 410, 'building')
        .setOrigin(0.5)
        .setDisplaySize(640, 820);
    }
  
    // Initializes Ralph and starts his tween.
    setupRalph() {
      this.ralph = new Ralph(this, 320, 110);
      this.tweens.add({
        targets: this.ralph,
        x: 400,
        duration: 2000,
        ease: 'Linear',
        yoyo: true,
        repeat: -1
      });
    }
  
    // Places Felix at the starting grid position.
    setupPlayer() {
      this.playerGridPos = { row: this.gridRows - 1, col: 0 };
      const startX = this.horizontalMargin + (this.playerGridPos.col + 0.5) * this.cellWidth;
      const startY = this.verticalMargin + (this.playerGridPos.row + 0.5) * this.cellHeight;
      this.felix = new Felix(this, startX, startY);
    }
  
    // Sets up keyboard controls.
    setupControls() {
      this.keys = this.input.keyboard.addKeys({
        up: 'W',
        down: 'S',
        left: 'A',
        right: 'D',
        fix: 'SPACE',
        menu: 'B'
      });
    }
  
    // Creates the HUD with score, timer, high score, and lives.
    setupHUD() {
      this.score = this.registry.has('globalScore') ? this.registry.get('globalScore') : 0;
      this.registry.set('globalScore', this.score);
      
      this.lives = this.registry.has('globalLives') ? this.registry.get('globalLives') : 3;
      this.registry.set('globalLives', this.lives);
      
      this.timeRemaining = 60;
      this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' });
      this.timerText = this.add.text(630, 10, `Time: ${this.timeRemaining}`, { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' })
        .setOrigin(1, 0);
        
      const storedHighScore = localStorage.getItem("highScore") || 0;
      this.highScoreText = this.add.text(10, 50, `High Score: ${storedHighScore}`, { fontFamily: 'Arial', fontSize: '32px', color: '#ffff00' });
      this.livesText = this.add.text(10, 90, `Lives: ${"♥".repeat(this.lives)}`, { fontFamily: 'Arial', fontSize: '32px', color: '#ff0000' });
    }
  
    // Updates the score display and high score if needed.
    updateScore() {
      this.scoreText.setText(`Score: ${this.score}`);
      const storedHighScore = localStorage.getItem("highScore") || 0;
      if (this.score > storedHighScore) {
        localStorage.setItem("highScore", this.score);
        this.highScoreText.setText(`High Score: ${this.score}`);
      }
    }
  
    // Updates the lives display.
    updateLives() {
      this.livesText.setText(`Lives: ${"♥".repeat(this.lives)}`);
    }
  
    // Updates the timer display.
    updateTimerDisplay() {
      this.timerText.setText(`Time: ${this.timeRemaining}`);
    }
  
    // Sets up the game timer.
    setupTimers() {
      this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
      });
    }
  
    // Sets up obstacles: bricks (and ducks if in Play3).
    setupObstacles() {
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
      
      // Collision handling for bricks.
      this.physics.add.overlap(this.felix, this.bricks, this.handleObstacleHit, null, this);
    }
  
    // Sets up duck spawning if in level 3.
    setupDuckSpawning() {
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
        this.physics.add.overlap(this.felix, this.ducks, this.handleObstacleHit, null, this);
      }
    }
  
    // Creates a grid of normal windows; subclasses can override this.
    createGrid() {
      this.windows = [];
      for (let row = 0; row < this.gridRows; row++) {
        for (let col = 0; col < this.gridCols; col++) {
          const centerX = this.horizontalMargin + (col + 0.5) * this.cellWidth;
          const centerY = this.verticalMargin + (row + 0.5) * this.cellHeight;
          const winSprite = new WindowPrefab(this, centerX, centerY);
          winSprite.row = row;
          winSprite.col = col;
          this.windows.push(winSprite);
        }
      }
    }
  
    // Spawns a brick obstacle.
    spawnBrick() {
      const col = Phaser.Math.Between(0, this.gridCols - 1);
      const x = this.horizontalMargin + (col + 0.5) * this.cellWidth;
      const y = -20;
      const brick = new BrickPrefab(this, x, y);
      this.bricks.add(brick);
    }
  
    // Spawns a duck obstacle.
    spawnDuck() {
      const row = Phaser.Math.Between(0, this.gridRows - 1);
      const y = this.verticalMargin + (row + 0.5) * this.cellHeight;
      const startX = -50;
      const duck = new DuckPrefab(this, startX, y);
      this.ducks.add(duck);
      this.sound.play('quack', { volume: 0.40 });
      this.tweens.add({
        targets: duck,
        x: this.game.config.width + 50,
        duration: 3000,
        ease: 'Linear',
        onComplete: () => duck.destroy()
      });
    }
  
    // Unified collision handler for obstacles (brick or duck).
    handleObstacleHit(player, obstacle) {
      if (this.gameOver || this.win) return;
      this.sound.play('bonk', { volume: 0.40 });
      // Subtract 200 from score on damage.
      this.score = Math.max(0, this.score - 200);
      this.updateScore();
      
      this.lives--;
      this.updateLives();
      obstacle.destroy();
      this.felix.setHit();
      if (this.lives <= 0) {
        this.endGame("Game Over\nPress SPACE to Replay\nPress B for Menu");
      }
    }
  
    // Updates the timer display every second.
    updateTimer() {
      if (this.gameOver || this.win) return;
      this.timeRemaining--;
      this.updateTimerDisplay();
      if (this.timeRemaining <= 0) {
        this.endGame("Time Up!\nPress SPACE to Replay\nPress B for Menu", true);
      }
    }
  
    // Ends the game, pauses physics, and shows an end-game message.
    endGame(message, isTimeUp = false) {
      this.gameOver = true;
      this.physics.pause();
      this.felix.setDie();
      this.add.text(320, 410, message, {
        fontFamily: 'Arial',
        fontSize: '48px',
        color: '#ff0000',
        align: 'center'
      }).setOrigin(0.5);
    }
  
    // Generic helper for setting cooldown flags.
    setCooldown(flagName, duration) {
      this[flagName] = true;
      this.time.addEvent({
        delay: duration,
        callback: () => this[flagName] = false,
        callbackScope: this
      });
    }
  
    // Main update loop handling movement, fixing, obstacle cleanup, and win condition.
    update(time, delta) {
      if (this.gameOver || this.win) {
        this.handleSceneTransition();
        return;
      }
  
      if (!this.moveOnCooldown) {
        this.handleMovement();
      }
      
      if (Phaser.Input.Keyboard.JustDown(this.keys.fix) && !this.fixOnCooldown) {
        this.handleFix();
        this.setCooldown('fixOnCooldown', COOLDOWN.fix);
      }
      
      this.cleanupObstacles(this.bricks);
      if (this.scene.key === "play3Scene") {
        this.cleanupObstacles(this.ducks);
      }
      
      if (!this.gameOver && !this.win && this.windows.every(win => win.fixed)) {
        this.handleWin();
      }
    }
  
    // Handles grid-based movement with boundary checks and bounces.
    handleMovement() {
      let moved = false;
      let targetRow = this.playerGridPos.row;
      let targetCol = this.playerGridPos.col;
      const currentWindow = this.getWindowAt(this.playerGridPos.row, this.playerGridPos.col);
  
      // Helper function for trying a move in a given direction.
      const tryMove = (direction, condition, updateTarget) => {
        if (Phaser.Input.Keyboard.JustDown(this.keys[direction])) {
          if (condition()) {
            this.felix.bounce(direction);
            this.setCooldown('moveOnCooldown', COOLDOWN.bounce);
          } else {
            this.lastMoveDirection = direction;
            ({ row: targetRow, col: targetCol } = updateTarget());
            moved = true;
          }
        }
      };
  
      tryMove('up', 
        () => this.playerGridPos.row === 0 || this.getWindowAt(this.playerGridPos.row - 1, this.playerGridPos.col) instanceof WindowPlanter,
        () => ({ row: this.playerGridPos.row - 1, col: this.playerGridPos.col })
      );
  
      tryMove('down', 
        () => this.playerGridPos.row === this.gridRows - 1 || currentWindow instanceof WindowPlanter,
        () => ({ row: this.playerGridPos.row + 1, col: this.playerGridPos.col })
      );
  
      tryMove('left', 
        () => this.playerGridPos.col === 0 || currentWindow instanceof WindowCover || this.getWindowAt(this.playerGridPos.row, this.playerGridPos.col - 1) instanceof WindowCover,
        () => ({ row: this.playerGridPos.row, col: this.playerGridPos.col - 1 })
      );
  
      tryMove('right', 
        () => this.playerGridPos.col === this.gridCols - 1 || currentWindow instanceof WindowCover || this.getWindowAt(this.playerGridPos.row, this.playerGridPos.col + 1) instanceof WindowCover,
        () => ({ row: this.playerGridPos.row, col: this.playerGridPos.col + 1 })
      );
  
      if (moved) {
        this.playerGridPos = { row: targetRow, col: targetCol };
        this.felix.setMove(this.lastMoveDirection);
        this.setCooldown('moveOnCooldown', COOLDOWN.move);
        const newX = this.horizontalMargin + (this.playerGridPos.col + 0.5) * this.cellWidth;
        const newY = this.verticalMargin + (this.playerGridPos.row + 0.5) * this.cellHeight;
        this.tweens.add({
          targets: this.felix,
          x: newX,
          y: newY,
          duration: COOLDOWN.move,
          ease: 'Power2'
        });
      }
    }
  
    // Returns the window at the specified grid position.
    getWindowAt(row, col) {
      return this.windows.find(win => win.row === row && win.col === col);
    }
  
    // Handles fixing the current window.
    handleFix() {
      const currentWindow = this.getWindowAt(this.playerGridPos.row, this.playerGridPos.col);
      if (currentWindow && !currentWindow.fixed) {
        currentWindow.fix();
        this.sound.play('hammer', { volume: 0.25 });
        this.score += 100;
        this.updateScore();
        this.felix.setFix();
      }
    }
  
    // Cleans up obstacles that have moved offscreen.
    cleanupObstacles(group) {
      group.children.each(function(obstacle) {
        if (obstacle.y > this.game.config.height + obstacle.height || obstacle.x > this.game.config.width + 100) {
          obstacle.destroy();
        }
      }, this);
    }
  
    // Handles win condition and displays win text.
    handleWin() {
      this.win = true;
      this.physics.pause();
      const bonus = this.timeRemaining * 100;
      this.score += bonus;
      this.updateScore();
      this.registry.set('globalScore', this.score);
      this.registry.set('globalLives', this.lives);
      const storedHighScore = localStorage.getItem("highScore") || 0;
      if (this.score > storedHighScore) {
        localStorage.setItem("highScore", this.score);
      }
      this.add.text(320, 410,
        `You Win!\nBonus: ${bonus}\nFinal Score: ${this.score}\nPress SPACE for Next Level\nPress B for Menu`,
        { fontFamily: 'Arial', fontSize: '48px', color: '#00ff00', align: 'center' }
      ).setOrigin(0.5);
    }
  
    // Handles scene transitions when the game is won or over.
    handleSceneTransition() {
      if (this.win) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
          this.registry.set('globalScore', this.score);
          this.registry.set('globalLives', this.lives);
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
      } else if (this.gameOver) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.fix)) {
          this.registry.set('globalLives', 3);
          this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.menu)) {
          this.scene.start("menuScene");
        }
      }
    }
  }
  