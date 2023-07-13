import Tween = Phaser.Tweens.Tween
import { Scene } from 'phaser'
import { Tile } from './tiles/Tile'
import GridManager from './GridManager'

class AnimationFactory
{
    public static readonly TILE_DROPPING_TIME = 700
    public static readonly TILE_SWAPPING_TIME = 400

    private scene: Scene
    private gridManager: GridManager

    constructor(scene: Scene, gridManager: GridManager) {
        this.scene = scene
        this.gridManager = gridManager
    }

    public animateTileDropping(tile: Tile, fromY: number, toY: number, onComplete: (() => void) | null = null): void {
        tile.y = fromY

        const duration = AnimationFactory.TILE_DROPPING_TIME
        let prevTime = 0
        let prevY = 0
        let velocity = 0
        
        this.scene.tweens.add({
            targets: tile,
            y: toY,
            duration: duration,
            ease: Phaser.Math.Easing.Bounce.Out,
            onUpdate: () => {
                const currentTime = this.scene.time.now

                if (prevTime !== 0)
                {
                    const deltaTime = currentTime - prevTime
                    const deltaY = tile.y - prevY
                    velocity = deltaY / deltaTime
                }

                prevTime = currentTime
                prevY = tile.y

                tile.scaleX = 1 - velocity * 0.12
                tile.scaleY = 1 + velocity * 0.12
            },
            onComplete: () => {
                if (onComplete) onComplete()
            },
        })
    }


    public animateTileSwapping(aTile: Tile, bTile: Tile, onComplete: (() => void) | null = null): void {
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
    }

}

export default AnimationFactory