import Keys from '../const/Keys'
import { Scene } from 'phaser'
import { Tile } from './tiles/Tile'
import StateMachine from '../utility/StateMachine'
import { GridResolveResult } from './GridResolveResult'

class GridManager
{
    public readonly stateMachine: StateMachine<GridState> = new StateMachine<GridState>(GridState.INITIALIZING)

    public readonly gridWidth: number
    public readonly gridHeight: number
    private readonly possibleFoodTypes: Keys.Sprite[]

    private scene: Scene

    private grid: (Tile | null)[][]

    private firstSelectedTile: Tile | null
    private secondSelectedTile: Tile | null

    constructor(
        scene: Scene,
        gridWidth: number,
        gridHeight: number,
        possibleFoodTypes: Keys.Sprite[],
    ) {
        this.scene = scene
        this.gridWidth = gridWidth
        this.gridHeight = gridHeight
        this.possibleFoodTypes = possibleFoodTypes

        // this.scene.input.on(Phaser.Input.Events.GAMEOBJECT_DOWN, this.tileDown, this)

        this.initGrid()
    }

    private initGrid(): void {
        this.grid = []

        for (let row = 0; row < this.gridHeight; row++)
        {
            const newRow: (Tile | null)[] = []
            for (let col = 0; col < this.gridWidth; col++) newRow.push(null)
            this.grid.push(newRow)
        }

        for (let row = 0; row < this.gridHeight; row++)
        {
            for (let col = 0; col < this.gridWidth; col++) this.addRandomFood(row, col)
        }

        const result = new GridResolveResult(this.grid as Tile[][])

        for (let i = 0; i < result.matchesOfThree.length; i++)
        {
            result.matchesOfThree[i].content.forEach(tile => tile.setTintFill(0xff0000))
        }

        for (let i = 0; i < result.matchesOfFour.length; i++)
        {
            result.matchesOfFour[i].content.forEach(tile => tile.setTintFill(0x0000ff))
        }

        for (let i = 0; i < result.matchesOfFiveAngled.length; i++)
        {
            result.matchesOfFiveAngled[i].content.forEach(tile => tile.setTintFill(0x00ffff))
        }
        
        for (let i = 0; i < result.matchesOfFiveStraight.length; i++)
        {
            result.matchesOfFiveStraight[i].content.forEach(tile => tile.setTintFill(0x00ff00))
        }
    }

    private addRandomFood(x: number, y: number): void {
        const randomIndex = Math.floor(Math.random() * this.possibleFoodTypes.length)
        const randomFoodType = this.possibleFoodTypes[randomIndex]

        this.grid[y][x] = new Tile(this.scene, x, y, randomFoodType)
    }
}

enum GridState
{
    INITIALIZING,
    IDLE,
    CLEARING,
    DROPPING,
}

export default GridManager
