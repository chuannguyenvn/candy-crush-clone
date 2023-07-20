import Tween = Phaser.Tweens.Tween
import { Scene } from 'phaser'
import { Tile } from './tiles/Tile'
import GridManager from './GridManager'
import { GameScene } from '../scenes/game-scene'

class AnimationFactory
{
    public static readonly TILE_DROPPING_STRETCHING_CONSTANT = 0.12
    public static readonly TILE_DROPPING_SQUASHING_CONSTANT = 0.17
    public static readonly TILE_DROPPING_TIME = 700
    public static readonly TILE_SWAPPING_TIME = 250
    public static readonly TILE_SWAPPING_STRETCHING_SCALE_TARGET = 1.5
    public static readonly TILE_SWAPPING_SQUASHING_SCALE_TARGET = 0.5
    public static readonly TILE_HINT_STRETCHING_SCALE_TARGET = 1.3
    public static readonly TILE_HINT_SQUASHING_SCALE_TARGET = 0.7
    public static readonly TILE_HINT_TIME = 600
    public static readonly TILE_SELECTING_SQUASHING_CONSTANT = 1.2
    public static readonly TILE_COMBINING_TIME = 800

    private scene: Scene
    private gridManager: GridManager

    constructor(scene: GameScene, gridManager: GridManager) {
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

                tile.scaleX = 1 - velocity * AnimationFactory.TILE_DROPPING_SQUASHING_CONSTANT
                tile.scaleY = 1 + velocity * AnimationFactory.TILE_DROPPING_STRETCHING_CONSTANT
            },
            onComplete: () => {
                if (onComplete) onComplete()
            },
        })
    }


    public animateTileSwapping(aTile: Tile, bTile: Tile, swapBack: boolean, onComplete: (() => void) | null = null): void {
        const tweens: Tween[] = []
        const ease = Phaser.Math.Easing.Circular.Out

        let xAxisCoefficient = AnimationFactory.TILE_SWAPPING_STRETCHING_SCALE_TARGET
        let yAxisCoefficient = AnimationFactory.TILE_SWAPPING_SQUASHING_SCALE_TARGET
        if (aTile.xIndex === bTile.xIndex)
        {
            xAxisCoefficient = AnimationFactory.TILE_SWAPPING_SQUASHING_SCALE_TARGET
            yAxisCoefficient = AnimationFactory.TILE_SWAPPING_STRETCHING_SCALE_TARGET
        }

        const swapBackDelay = swapBack ? 100 : 0

        tweens.push(
            this.scene.tweens.add({
                targets: aTile,
                x: bTile.x,
                y: bTile.y,
                ease: ease,
                duration: AnimationFactory.TILE_SWAPPING_TIME,
                delay: swapBackDelay,
            }),
        )

        tweens.push(
            this.scene.tweens.add({
                targets: aTile,
                scaleX: xAxisCoefficient,
                scaleY: yAxisCoefficient,
                ease: Phaser.Math.Easing.Sine.InOut,
                duration: AnimationFactory.TILE_SWAPPING_TIME / 2,
                delay: swapBackDelay,
            }),
        )

        tweens.push(
            this.scene.tweens.add({
                targets: aTile,
                scaleX: 1,
                scaleY: 1,
                ease: Phaser.Math.Easing.Sine.InOut,
                duration: AnimationFactory.TILE_SWAPPING_TIME / 2,
                delay: AnimationFactory.TILE_SWAPPING_TIME / 2 + swapBackDelay,
            }),
        )

        tweens.push(
            this.scene.tweens.add({
                targets: bTile,
                x: aTile.x,
                y: aTile.y,
                ease: ease,
                duration: AnimationFactory.TILE_SWAPPING_TIME,
                delay: swapBackDelay,
            }),
        )

        tweens.push(
            this.scene.tweens.add({
                targets: bTile,
                scaleX: xAxisCoefficient,
                scaleY: yAxisCoefficient,
                ease: Phaser.Math.Easing.Sine.InOut,
                duration: AnimationFactory.TILE_SWAPPING_TIME / 2,
                delay: swapBackDelay,
            }),
        )

        tweens.push(
            this.scene.tweens.add({
                targets: bTile,
                scaleX: 1,
                scaleY: 1,
                ease: Phaser.Math.Easing.Sine.InOut,
                duration: AnimationFactory.TILE_SWAPPING_TIME / 2,
                delay: AnimationFactory.TILE_SWAPPING_TIME / 2 + swapBackDelay,
            }),
        )

        tweens.push(
            this.scene.tweens.add({
                targets: this,
                duration: AnimationFactory.TILE_SWAPPING_TIME / 2,
                delay: swapBackDelay,
            }),
        )

        if (onComplete) this.scene.time.delayedCall(AnimationFactory.TILE_SWAPPING_TIME, onComplete)
    }
}

export default AnimationFactory