import { CONST } from '../const/Const'
import { Tile } from '../objects/tiles/Tile'
import GridManager from '../objects/GridManager'

export class GameScene extends Phaser.Scene
{
    // Variables
    private canMove: boolean

    // Grid with tiles
    private tileGrid: (Tile | undefined)[][]

    // Selected Tiles
    private firstSelectedTile: Tile | undefined
    private secondSelectedTile: Tile | undefined

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    create(): void {
        this.cameras.main.setBackgroundColor(0xeeeeee)
        this.cameras.main.centerOn(CONST.TILE_WIDTH * 3.5, CONST.TILE_HEIGHT * 3.5)

        new GridManager(this, 8, 8, CONST.CANDY_TYPES)
    }
}
