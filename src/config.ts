import { BootScene } from './scenes/boot-scene'
import { GameScene } from './scenes/game-scene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Candy crush',
    url: 'https://github.com/digitsensitive/phaser3-typescript',
    version: '2.0',
    width: 700,
    height: 700,
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    parent: 'game',
    scene: [BootScene, GameScene],
    backgroundColor: '#eeeeee',
    render: { pixelArt: false, antialias: true },
}
