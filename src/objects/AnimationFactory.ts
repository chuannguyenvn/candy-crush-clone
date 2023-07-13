import Tween = Phaser.Tweens.Tween
import { Scene } from 'phaser'
import { Tile } from './tiles/Tile'
import GridManager from './GridManager'

class AnimationFactory
{
    public static readonly TILE_DROPPING_TIME = 700
    public static readonly TILE_SWAPPING_TIME = 500

    private scene: Scene
    private gridManager: GridManager

    constructor(scene: Scene, gridManager: GridManager) {
        this.scene = scene
        this.gridManager = gridManager
    }

    public animateTileDropping(tile: Tile, fromY: number, toY: number, onComplete: (() => void) | null = null): Tween {
        tile.y = fromY

        return this.scene.tweens.add({
            targets: tile,
            y: toY,
            duration: AnimationFactory.TILE_DROPPING_TIME,
            ease: Phaser.Math.Easing.Bounce.Out,
            onComplete: () => {
                if (onComplete) onComplete()
            },
        })
    }

    public animateTileSwapping(aTile: Tile, bTile: Tile, onComplete: (() => void) | null = null): Tween[] {
        const tweens: Tween[] = []
        const ease = Phaser.Math.Easing.Cubic.Out

        tweens.push(
            this.scene.tweens.add({
                targets: aTile,
                x: bTile.x,
                y: bTile.y,
                ease: ease,
                duration: AnimationFactory.TILE_SWAPPING_TIME,
            }),
        )

        tweens.push(
            this.scene.tweens.add({
                targets: bTile,
                x: aTile.x,
                y: aTile.y,
                ease: ease,
                duration: AnimationFactory.TILE_SWAPPING_TIME,
            }),
        )

        if (onComplete) this.scene.time.delayedCall(AnimationFactory.TILE_SWAPPING_TIME, onComplete)

        return tweens
    }

}

export default AnimationFactory