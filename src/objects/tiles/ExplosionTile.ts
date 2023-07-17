import { Tile } from './Tile'
import { Scene } from 'phaser'
import GridManager from '../GridManager'
import Keys from '../../const/Keys'
import { GameScene } from '../../scenes/game-scene'

class ExplosionTile extends Tile
{
    private fireImage: Phaser.GameObjects.Image

    constructor(scene: GameScene, gridManager: GridManager, xIndex: number, yIndex: number, spriteKey: string) {
        super(scene, gridManager, xIndex, yIndex, spriteKey)

        this.fireImage = this.scene.add.image(0, 0, Keys.Sprite.FIRE)
        this.add(this.fireImage)
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