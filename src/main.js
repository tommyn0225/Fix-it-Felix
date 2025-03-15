// src/main.js
/*
Tommy Nguyen
Fix it Felix! clone based off Fix it Felix Jr. from Disney's Wreck it Ralph (2012)

FIVE PHASER MAJOR COMPONENTS
    1. physics (bricks falling)
    2. text objects (instructions)
    3. animation manager (duck animations)
    4. tween (ralph tween)
    5. particles 

POLISH, CREATIVITY, TECHNICAL PROWESS (Reasons I think I deserve the points)
    - Polish: Professor Nathan complimented the snappy controls of my game :3
    - Creativity: All assets were made in house
    - Technical: I added a number of new obstacles that were not present in the game shown in the movie.
    I added a high score that is stored in your local memory.

CREDITS
fully created by Tommy Nguyen BESIDES:
music: https://youtu.be/l7SwiFWOQqM?si=EC3FM59QqzNJErTS
sfx: https://mixkit.co/


*/
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 820,
    scene: [Menu, Help, PlayBase, Play1, Play2, Play3],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    }
};

let game = new Phaser.Game(config);

