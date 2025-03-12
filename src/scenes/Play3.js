// src/scenes/Play3.js
class Play3 extends PlayBase {
    constructor() {
        super("play3Scene");
    }

    create() {
        this.gridPattern = [
            ['normal', 'cover',   'normal',  'planter', 'normal'],
            ['cover', 'normal',  'planter',   'normal',  'cover'],
            ['planter','planter',  'normal',  'cover',   'normal'],
            ['normal', 'normal', 'normal',  'normal',  'normal']
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
