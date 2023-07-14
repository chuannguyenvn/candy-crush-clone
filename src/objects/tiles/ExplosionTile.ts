import { Tile } from './Tile'
import { Scene } from 'phaser'
import GridManager from '../GridManager'
import Keys from '../../const/Keys'

class ExplosionTile extends Tile
{
    private fireImage: Phaser.GameObjects.Image

    constructor(scene: Scene, gridManager: GridManager, xIndex: number, yIndex: number, spriteKey: string) {
        super(scene, gridManager, xIndex, yIndex, spriteKey)

        this.fireImage = this.scene.add.image(this.x, this.y, Keys.Sprite.FIRE)
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
    }
}

export default ExplosionTile