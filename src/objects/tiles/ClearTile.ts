import { Tile } from './Tile'
import { Scene } from 'phaser'
import GridManager from '../GridManager'
import Keys from '../../const/Keys'

class ClearTile extends Tile
{
    constructor(scene: Scene, gridManager: GridManager, xIndex: number, yIndex: number) {
        super(scene, gridManager, xIndex, yIndex, Keys.Sprite.STAR)
    }

    public override async resolve(): Promise<void> {
        super.resolve()

        let tileTile = this.gridManager.firstSelectedTile?.tileType
        if (tileTile === Keys.Sprite.STAR)
        {
            if (this.gridManager.secondSelectedTile?.tileType === Keys.Sprite.STAR)
            {
                for (let row = 0; row < this.gridManager.gridHeight; row++)
                {
                    for (let col = 0; col < this.gridManager.gridWidth; col++)
                    {
                        this.gridManager.grid[row][col]?.resolve()
                    }
                }
            }
            else
            {
                tileTile = this.gridManager.secondSelectedTile?.tileType
            }
        }

        for (let row = 0; row < this.gridManager.gridHeight; row++)
        {
            for (let col = 0; col < this.gridManager.gridWidth; col++)
            {
                if (this.gridManager.grid[row][col]?.tileType === tileTile)
                    this.gridManager.grid[row][col]?.resolve()
            }
        }
    }
}

export default ClearTile