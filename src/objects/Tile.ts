import TweenChain = Phaser.Tweens.TweenChain
import Tween = Phaser.Tweens.Tween
import { Scene } from 'phaser'
import Keys from '../const/Keys'

export class Tile extends Phaser.GameObjects.Image
{
    private selectedAnimation: Tween | TweenChain

    constructor(scene: Scene, xIndex: number, yIndex: number, spriteKey: Keys.Sprite) {
        super(scene, xIndex, yIndex, spriteKey)

        // set image settings
        this.setOrigin(0.5)
        this.setInteractive()

        this.scene.add.existing(this)
    }

    public playSelectedAnimation(): void {
        this.selectedAnimation?.stop()
        this.selectedAnimation = this.scene.tweens.chain({
            targets: this,
            tweens: [
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
        this.selectedAnimation = this.scene.tweens.add({
            targets: this,
            angle: 0,
            duration: 500,
            ease: Phaser.Math.Easing.Circular.InOut,
        })
    }
}
