import Tween = Phaser.Tweens.Tween
import { Scene } from 'phaser'
import { Tile } from './tiles/Tile'
import { CONST } from '../const/Const'
import GridManager from './GridManager'

class AnimationFactory
{
    private scene: Scene
    private gridManager: GridManager

    constructor(scene: Scene, gridManager: GridManager) {
        this.scene = scene
        this.gridManager = gridManager
    }

    public animateTileDropping(tile: Tile): Tween {
        const finalYPos = tile.y
        tile.y -= this.gridManager.gridHeight * CONST.TILE_HEIGHT

        return this.scene.tweens.add({
            targets: tile,
            y: finalYPos,
            duration: 1000,
        })
    }
}

export default AnimationFactory