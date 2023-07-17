import TweenChain = Phaser.Tweens.TweenChain
import Tween = Phaser.Tweens.Tween
import { CONST } from '../../const/Const'
import AnimationFactory from '../AnimationFactory'
import GridManager from '../GridManager'
import { GameScene } from '../../scenes/game-scene'

export abstract class Tile extends Phaser.GameObjects.Container
{
    public xIndex: number
    public yIndex: number
    public tileType: string
    public isInMatch = false
    protected selectedAnimation: Tween | TweenChain
    protected wakeAnimation: Tween | TweenChain
    protected hintAnimation: Tween | TweenChain
    protected moveAnimation: Tween | TweenChain
    protected gridManager: GridManager

    protected tileImage: Phaser.GameObjects.Image

    protected gameScene: GameScene

    constructor(scene: GameScene, gridManager: GridManager, xIndex: number, yIndex: number, spriteKey: string) {
        super(scene, 0, 0)
        this.gameScene = scene
        this.scene.add.existing(this)
        this.gridManager = gridManager

        this.setSize(CONST.TILE_WIDTH, CONST.TILE_HEIGHT)
        this.setInteractive()

        this.xIndex = xIndex
        this.yIndex = yIndex

        this.x = xIndex * CONST.TILE_WIDTH
        this.y = yIndex * CONST.TILE_HEIGHT

        this.tileType = spriteKey

        this.tileImage = this.scene.add.image(0, 0, this.tileType)
        this.tileImage.setOrigin(0.5)
        this.add(this.tileImage)

        this.setScale(0)

        this.scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 500,
            ease: Phaser.Math.Easing.Elastic.Out,
        })
    }

    public canMatchWith(other: Tile): boolean {
        if (this.isInMatch || other.isInMatch) return false
        return this.tileType === other.tileType
    }

    public async resolve(): Promise<void> {
        this.stopAllAnimation()

        this.gridManager.grid[this.yIndex][this.xIndex] = null
        this.gameScene.scoreManager.addScore(25)
        
        this.scene.tweens.add({
            targets: this,
            scale: 0,
            duration: 500,
            ease: Phaser.Math.Easing.Cubic.Out,
        })

        this.scene.tweens.add({
            targets: this.tileImage,
            scale: 0,
            duration: 500,
            ease: Phaser.Math.Easing.Cubic.Out,
            onComplete: () => this.tileImage.destroy(),
        })
    }

    public playSelectedAnimation(): void {
        this.stopAllAnimation()
        this.selectedAnimation = this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    scale: AnimationFactory.TILE_SELECTING_SQUASHING_CONSTANT,
                    duration: 50,
                    ease: Phaser.Math.Easing.Circular.Out,
                },
                {
                    scale: 1,
                    duration: 50,
                    ease: Phaser.Math.Easing.Circular.Out,
                },
                {
                    angle: 10,
                    duration: 250,
                    ease: Phaser.Math.Easing.Circular.InOut,
                },
                {
                    angle: -10,
                    duration: 500,
                    ease: Phaser.Math.Easing.Circular.InOut,
                    repeat: -1,
                    yoyo: true,
                },
            ],
        })
    }

    public stopSelectedAnimation(): void {
        this.selectedAnimation?.stop()
        this.selectedAnimation = this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    scale: AnimationFactory.TILE_SELECTING_SQUASHING_CONSTANT,
                    duration: 50,
                    ease: Phaser.Math.Easing.Circular.Out,
                },
                {
                    scale: 1,
                    duration: 50,
                    ease: Phaser.Math.Easing.Circular.Out,
                },
                {
                    angle: 0,
                    duration: 500,
                    ease: Phaser.Math.Easing.Circular.InOut,
                },
            ],
        })
    }

    public playWakeAnimation(): void {
        this.stopAllAnimation()
        this.wakeAnimation = this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    scaleX: 1.2,
                    scaleY: 0.8,
                    duration: 400,
                    ease: Phaser.Math.Easing.Circular.Out,
                },
                {
                    scaleX: 0.8,
                    scaleY: 1.2,
                    duration: 400,
                    ease: Phaser.Math.Easing.Circular.Out,
                },
                {
                    scaleX: 1,
                    scaleY: 1,
                    duration: 400,
                    ease: Phaser.Math.Easing.Circular.Out,
                },
            ],
        })
    }

    public stopWakeAnimation(): void {
        this.wakeAnimation?.stop()
        this.wakeAnimation = this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            duration: 400,
            ease: Phaser.Math.Easing.Circular.Out,
        })
    }

    public playHintAnimation(xOffset: number, yOffset: number): void {
        this.stopAllAnimation()

        if (xOffset !== 0)
        {
            this.tileImage.setOrigin(xOffset > 0 ? 1 : 0, 0.5)
            this.tileImage.x += this.tileImage.originX === 0 ? -this.tileImage.width / 2 : this.tileImage.width / 2
        }
        else
        {
            this.tileImage.setOrigin(0.5, yOffset > 0 ? 1 : 0)
            this.tileImage.y += this.tileImage.originY === 0 ? -this.tileImage.height / 2 : this.tileImage.height / 2
        }

        this.hintAnimation = this.scene.tweens.chain({
            targets: this.tileImage,
            tweens: [
                {
                    scaleX: xOffset !== 0 ? AnimationFactory.TILE_HINT_SQUASHING_SCALE_TARGET : AnimationFactory.TILE_HINT_STRETCHING_SCALE_TARGET,
                    scaleY: yOffset !== 0 ? AnimationFactory.TILE_HINT_SQUASHING_SCALE_TARGET : AnimationFactory.TILE_HINT_STRETCHING_SCALE_TARGET,
                    duration: AnimationFactory.TILE_HINT_TIME / 4,
                    ease: Phaser.Math.Easing.Quintic.Out,
                },
                {
                    scaleX: 1,
                    scaleY: 1,
                    duration: AnimationFactory.TILE_HINT_TIME / 4,
                    ease: Phaser.Math.Easing.Quintic.Out,
                },
                {
                    scaleX: xOffset !== 0 ? AnimationFactory.TILE_HINT_SQUASHING_SCALE_TARGET : AnimationFactory.TILE_HINT_STRETCHING_SCALE_TARGET,
                    scaleY: yOffset !== 0 ? AnimationFactory.TILE_HINT_SQUASHING_SCALE_TARGET : AnimationFactory.TILE_HINT_STRETCHING_SCALE_TARGET,
                    duration: AnimationFactory.TILE_HINT_TIME / 4,
                    ease: Phaser.Math.Easing.Quintic.Out,
                },
                {
                    scaleX: 1,
                    scaleY: 1,
                    duration: AnimationFactory.TILE_HINT_TIME / 4,
                    ease: Phaser.Math.Easing.Quintic.Out,
                },
            ],
            onComplete: () => {
                if (xOffset !== 0)
                {
                    this.tileImage.x += this.tileImage.originX === 0 ? this.tileImage.width / 2 : -this.tileImage.width / 2
                }
                else
                {
                    this.tileImage.y += this.tileImage.originY === 0 ? this.tileImage.height / 2 : -this.tileImage.height / 2
                }
                this.tileImage.setOrigin(0.5)
            },
        })
    }

    public playMoveAnimation(x: number, y: number): void {
        this.stopAllAnimation()
        this.moveAnimation = this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: AnimationFactory.TILE_COMBINING_TIME,
            ease: Phaser.Math.Easing.Sine.InOut,
        })
    }

    public stopAllAnimation(): void {
        this.selectedAnimation?.stop()
        this.wakeAnimation?.stop()
        this.hintAnimation?.stop()
        this.moveAnimation?.stop()
    }

    destroy(fromScene?: boolean) {
        super.destroy(fromScene)
        this.tileImage.destroy()
    }
}
