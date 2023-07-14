import TweenChain = Phaser.Tweens.TweenChain
import Tween = Phaser.Tweens.Tween
import { Scene } from 'phaser'
import Keys from '../../const/Keys'
import { CONST } from '../../const/Const'
import AnimationFactory from '../AnimationFactory'

export class Tile extends Phaser.GameObjects.Image
{
    public xIndex: number
    public yIndex: number
    public tileType: string
    public isInMatch = false
    private selectedAnimation: Tween | TweenChain
    private wakeAnimation: Tween | TweenChain
    private hintAnimation: Tween | TweenChain

    constructor(scene: Scene, xIndex: number, yIndex: number, spriteKey: Keys.Sprite) {
        super(scene, xIndex, yIndex, spriteKey)
        this.scene.add.existing(this)

        this.setOrigin(0.5)
        this.setDisplaySize(CONST.TILE_WIDTH, CONST.TILE_HEIGHT)
        this.setInteractive()

        this.xIndex = xIndex
        this.yIndex = yIndex

        this.x = xIndex * CONST.TILE_WIDTH
        this.y = yIndex * CONST.TILE_HEIGHT

        this.tileType = spriteKey
    }

    public canMatchWith(other: Tile): boolean {
        if (this.isInMatch || other.isInMatch) return false
        return this.tileType === other.tileType
    }

    public async resolve(): Promise<void> {
        const emmiter = this.scene.add.particles(this.x, this.y, this.tileType, {
            lifespan: 500,
            speed: { min: 100, max: 200 },
            scale: { start: 1, end: 0, ease: Phaser.Math.Easing.Cubic.Out },
            rotate: { start: 0, min: 0, max: 360 },
            gravityY: 200,
            emitting: false,
        }).explode(5)

        this.scene.tweens.add({
            targets: this,
            scale: 0,
            duration: 500,
            ease: Phaser.Math.Easing.Cubic.Out,
            onComplete: () => this.destroy(),
        })

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, 50)
        })
    }

    public playSelectedAnimation(): void {
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
        this.wakeAnimation?.stop()
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
        this.hintAnimation?.stop()

        if (xOffset !== 0)
        {
            this.setOrigin(xOffset > 0 ? 1 : 0, 0.5)
            this.x += this.originX === 0 ? -this.width / 2 : this.width / 2
        }
        else
        {
            this.setOrigin(0.5, yOffset > 0 ? 1 : 0)
            this.y += this.originY === 0 ? -this.height / 2 : this.height / 2
        }

        this.hintAnimation = this.scene.tweens.chain({
            targets: this,
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
                    this.x += this.originX === 0 ? this.width / 2 : -this.width / 2
                }
                else
                {
                    this.y += this.originY === 0 ? this.height / 2 : -this.height / 2
                }
                this.setOrigin(0.5)
            },
        })
    }
}
