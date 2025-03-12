// src/prefabs/WindowPlanter.js
class WindowPlanter extends WindowPrefab {
    constructor(scene, x, y) {
        super(scene, x, y, 'windowPlanter', 0);
        
        // Create a block along the bottom edge of the window.
        const blockHeight = 10;
        const blockWidth = this.displayWidth;
        const halfHeight = this.displayHeight / 2;
        
        // Create bottom block positioned at the lower edge of the window
        this.bottomBlock = scene.add.rectangle(x, y + halfHeight, blockWidth, blockHeight, 0xff0000, 0.5);
        scene.physics.add.existing(this.bottomBlock, true);
    }
}
