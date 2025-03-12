// src/scenes/Play2.js
class Play2 extends PlayBase {
    constructor() {
        super("play2Scene");
    }

    create() {
        // Define a preset grid pattern for level 2:
        // Each cell is designated as "normal", "cover", or "planter"
        this.gridPattern = [
            ['normal', 'cover',   'normal',  'planter', 'normal'],
            ['normal', 'normal',  'cover',   'normal',  'planter'],
            ['planter','normal',  'normal',  'cover',   'normal'],
            ['normal', 'planter', 'normal',  'normal',  'cover']
        ];
        super.create();

        // Add colliders for the physical obstacles in the new window types.
        this.windows.forEach(win => {
            if (win instanceof WindowCover) {
                this.physics.add.collider(this.felix, win.leftBlock);
                this.physics.add.collider(this.felix, win.rightBlock);
            } else if (win instanceof WindowPlanter) {
                this.physics.add.collider(this.felix, win.bottomBlock);
            }
        });
    }

    // Override createGrid to use new pattern
    createGrid() {
        this.windows = [];
        for (let row = 0; row < this.gridRows; row++) {
            for (let col = 0; col < this.gridCols; col++) {
                let centerX = this.horizontalMargin + (col + 0.5) * this.cellWidth;
                let centerY = this.verticalMargin + (row + 0.5) * this.cellHeight;
                let type = this.gridPattern[row][col];
                let winSprite;
                if (type === 'normal') {
                    winSprite = new WindowPrefab(this, centerX, centerY);
                } else if (type === 'cover') {
                    winSprite = new WindowCover(this, centerX, centerY);
                } else if (type === 'planter') {
                    winSprite = new WindowPlanter(this, centerX, centerY);
                }
                winSprite.row = row;
                winSprite.col = col;
                this.windows.push(winSprite);
            }
        }
    }
}
