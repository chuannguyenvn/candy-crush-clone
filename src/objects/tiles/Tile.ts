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

    constructor(scene: Scene, xIndex: number, yIndex: number, spriteKey: Keys.Sprite) {
        super(scene, xIndex, yIndex, spriteKey)
        this.scene.add.existing(this)

        this.setOrigin(0.5)
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

    public resolve(): void {

    }

    public playSelectedAnimation(): void {
        this.selectedAnimation?.stop()
        this.selectedAnimation = this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    scale: AnimationFactory.TILE_SELECTING_SQUASHING_CONSTANT,
                    duration: 50,
                    easel: Phaser.Math.Easing.Circular.Out,
                },
                {
                    scale: 1,
                    duration: 50,
                    easel: Phaser.Math.Easing.Circular.Out,
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
                    easel: Phaser.Math.Easing.Circular.Out,
                },
                {
                    scale: 1,
                    duration: 50,
                    easel: Phaser.Math.Easing.Circular.Out,
                },
                {
                    angle: 0,
                    duration: 500,
                    ease: Phaser.Math.Easing.Circular.InOut,
                },
            ],
        })
    }
}
