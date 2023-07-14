﻿import { Tile } from './Tile'
import Vector2 = Phaser.Math.Vector2

class NormalTile extends Tile
{
    public override async resolve(): Promise<void> {
        super.resolve()

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
        })

        this.scene.cameras.main.shake(50, new Vector2(0.003, 0.003))

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, 50)
        })
    }
}

export default NormalTile