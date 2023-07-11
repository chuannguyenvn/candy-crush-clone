import { CONST } from '../const/const'
import { Tile } from '../objects/Tile'
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


        new GridManager(this, 8, 8, CONST.CANDY_TYPES)
    }
}
