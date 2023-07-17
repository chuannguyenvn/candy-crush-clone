import { CONST } from '../const/Const'
import GridManager from '../objects/GridManager'
import ScoreManager from '../objects/ScoreManager'

export class GameScene extends Phaser.Scene
{
    public gridManager: GridManager
    public scoreManager: ScoreManager

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    create(): void {
        this.cameras.main.setBackgroundColor(0xeeeeee)
        this.cameras.main.centerOn(CONST.TILE_WIDTH * 3.5, CONST.TILE_HEIGHT * 4)

        this.gridManager = new GridManager(this, 8, 8, CONST.CANDY_TYPES)
        this.scoreManager = new ScoreManager(this)
    }
}
