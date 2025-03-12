// src/prefabs/WindowCover.js
class WindowCover extends WindowPrefab {
    constructor(scene, x, y) {
        super(scene, x, y, 'windowCover', 0);
        this.setScale(2.5);
        
        // Create two blocks at the left and right edges.
        const blockWidth = 10;
        const blockHeight = this.displayHeight;
        const halfWidth = this.displayWidth / 2;
        
        // Create left block at the left edge of the window
        this.leftBlock = scene.add.rectangle(x - halfWidth, y, blockWidth, blockHeight, 0xff0000, 0.5);
        scene.physics.add.existing(this.leftBlock, true);
        
        // Create right block at the right edge of the window
        this.rightBlock = scene.add.rectangle(x + halfWidth, y, blockWidth, blockHeight, 0xff0000, 0.5);
        scene.physics.add.existing(this.rightBlock, true);
    }
}
