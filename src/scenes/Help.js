// src/scenes/Help.js
class Help extends Phaser.Scene {
    constructor() {
        super("helpScene");
    }

    create() {
        // Set a background color (or you could add a background image)
        this.cameras.main.setBackgroundColor('#000000');

        // Title text
        this.add.text(this.game.config.width / 2, 50, "Help & Instructions", 
            { fontFamily: 'Arial', fontSize: '48px', color: '#ffffff' }
        ).setOrigin(0.5);

        // Controls instructions
        this.add.text(20, 100, "Controls:", 
            { fontFamily: 'Arial', fontSize: '32px', color: '#ffff00' }
        );
        this.add.text(20, 140, "Move: [W] [A] [S] [D]\nFix windows: [SPACE]", 
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }
        );

        // Starting Y for obstacle list
        let startY = 250;
        let gapY = 100;

        // Brick obstacle info
        let brickImage = this.add.image(80, startY, 'brick').setScale(1);
        this.add.text(150, startY - 20, "Brick: Falls from above. Hitting you costs a life", 
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }
        );

        // Duck obstacle info
        let duckImage = this.add.image(80, startY + gapY, 'duck').setScale(2);
        this.add.text(150, startY + gapY - 20, "Duck: Moves across the screen\nColliding with it loses a life", 
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }
        );

        // Window Cover obstacle info
        let windowCoverImage = this.add.image(80, startY + gapY * 2, 'windowCover').setScale(2);
        this.add.text(150, startY + gapY * 2 - 20, "Window Covers: Blocks left/right movement", 
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }
        );

        // Window Planter obstacle info
        let windowPlanterImage = this.add.image(80, startY + gapY * 3, 'windowPlanter').setScale(2);
        this.add.text(150, startY + gapY * 3 - 20, "Planter Windows: Blocks vertical movement", 
            { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }
        );

        // How to play
        this.add.text(this.game.config.width / 2, this.game.config.height - 120, 
            "How to play:\nLook out for Ralph's attacks\nand fix those windows!\nPress [B] to return to the Main Menu", 
            { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);

        // Listener for [B] key to return to the Menu scene
        this.input.keyboard.on('keydown-B', () => {
            this.sound.play('buttonClick', { volume: 0.25 });
            this.scene.start("menuScene");
        });
    }
}
