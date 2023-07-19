import { Tile } from './Tile'
import TileParticle from '../TileParticle'
import Vector2 = Phaser.Math.Vector2
import Color = Phaser.Display.Color

class NormalTile extends Tile
{
    public override async resolve(): Promise<void> {
        super.resolve()

        this.gameScene.time.delayedCall(200, () => this.scene.add.particles(this.x, this.y, this.tileType, {
            lifespan: 700,
            rotate: { start: 0, min: 0, max: 360 },
            emitting: false,
            particleClass: TileParticle,
        }).explode(Phaser.Math.Between(2, 3)))
        
        this.setDepth(10)

        this.scene.cameras.main.shake(50, new Vector2(0.003, 0.003))

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, 50)
        })
    }
}


export default NormalTile