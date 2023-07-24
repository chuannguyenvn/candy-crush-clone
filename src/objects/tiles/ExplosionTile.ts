import { Tile } from './Tile'
import GridManager from '../GridManager'
import Keys from '../../const/Keys'
import { GameScene } from '../../scenes/game-scene'
import { CONST } from '../../const/Const'

class ExplosionTile extends Tile
{
    private fireImage: Phaser.GameObjects.Image

    constructor(scene: GameScene, gridManager: GridManager, xIndex: number, yIndex: number, spriteKey: string) {
        super(scene, gridManager, xIndex, yIndex, spriteKey)

        this.fireImage = this.scene.add.image(0, CONST.TILE_HEIGHT / 2, Keys.Sprite.FIRE)
        this.add(this.fireImage)
        this.fireImage.setOrigin(0.5, 1)

        scene.tweens.chain({
            targets: this.fireImage,
            repeat: -1,
            tweens: [
                {
                    scaleY: 0.8,
                    duration: 500,
                    ease: Phaser.Math.Easing.Sine.Out,
                },
                {
                    scaleY: 0.6,
                    duration: 500,
                    ease: Phaser.Math.Easing.Sine.Out,
                },
            ],
        })
        scene.tweens.chain({
            targets: this.fireImage,
            repeat: -1,
            delay:100,
            tweens: [
                {
                    scaleX: 0.6,
                    duration: 500,
                    ease: Phaser.Math.Easing.Sine.Out,
                },
                {
                    scaleX: 0.8,
                    duration: 500,
                    ease: Phaser.Math.Easing.Sine.Out,
                },
              
            ],
        })
    }

    public override async resolve(): Promise<void> {
        super.resolve()

        await this.gridManager.getTileByOffset(this, -1, -1)?.resolve()
        await this.gridManager.getTileByOffset(this, -1, 0)?.resolve()
        await this.gridManager.getTileByOffset(this, -1, 1)?.resolve()
        await this.gridManager.getTileByOffset(this, 0, -1)?.resolve()
        await this.gridManager.getTileByOffset(this, 0, 1)?.resolve()
        await this.gridManager.getTileByOffset(this, 1, -1)?.resolve()
        await this.gridManager.getTileByOffset(this, 1, 0)?.resolve()
        await this.gridManager.getTileByOffset(this, 1, 1)?.resolve()

        this.scene.tweens.add({
            targets: this.fireImage,
            scale: 0,
            duration: 500,
            ease: Phaser.Math.Easing.Cubic.Out,
            onComplete: () => this.fireImage.destroy(),
        })
    }
}

export default ExplosionTile