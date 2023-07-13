import Tween = Phaser.Tweens.Tween
import { Scene } from 'phaser'
import { Tile } from './tiles/Tile'
import { CONST } from '../const/Const'
import GridManager from './GridManager'
import Vector2 = Phaser.Math.Vector2

class AnimationFactory
{
    public static readonly TILE_DROPPING_TIME = 700
    
    private scene: Scene
    private gridManager: GridManager

    constructor(scene: Scene, gridManager: GridManager) {
        this.scene = scene
        this.gridManager = gridManager
    }

    public animateTileDropping(tile: Tile, fromY: number, toY: number): Tween {
        tile.y = fromY

        return this.scene.tweens.add({
            targets: tile,
            y: toY,
            duration: AnimationFactory.TILE_DROPPING_TIME,
            ease: Phaser.Math.Easing.Bounce.Out,
        })
    }
}

export default AnimationFactory