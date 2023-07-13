import Keys from '../const/Keys'
import { Scene } from 'phaser'
import { Tile } from './tiles/Tile'
import StateMachine from '../utility/StateMachine'
import { GridResolveResult } from './GridResolveResult'
import { CONST } from '../const/Const'
import AnimationFactory from './AnimationFactory'
import Tween = Phaser.Tweens.Tween

class GridManager
{
    public readonly stateMachine: StateMachine<GridState> = new StateMachine<GridState>(GridState.INITIALIZING)
    public readonly animationFactory: AnimationFactory

    public readonly gridWidth: number
    public readonly gridHeight: number
    private readonly possibleItemTypes: Keys.Sprite[]

    private scene: Scene

    private grid: (Tile | null)[][]

    private firstSelectedTile: Tile | null
    private secondSelectedTile: Tile | null

    private resolveResult: GridResolveResult
    private canMove = false

    constructor(
        scene: Scene,
        gridWidth: number,
        gridHeight: number,
        possibleFoodTypes: Keys.Sprite[],
    ) {
        this.scene = scene
        this.gridWidth = gridWidth
        this.gridHeight = gridHeight
        this.possibleItemTypes = possibleFoodTypes

        this.animationFactory = new AnimationFactory(this.scene, this)

        this.scene.input.on(Phaser.Input.Events.GAMEOBJECT_DOWN, this.moveTile, this)

        this.stateMachine.configure(GridState.SWAPPING).onEntry(() => this.swapTile())
        this.stateMachine.configure(GridState.CALCULATING).onEntry(() => this.updateResolveResult())
        this.stateMachine.configure(GridState.CLEARING).onEntry(() => this.removeGroups())
        this.stateMachine.configure(GridState.DROPPING).onEntry(() => this.drop())

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

        this.fillGrid()
    }

    private fillGrid(): void {
        const timeline = this.scene.add.timeline({})
        for (let row = 0; row < this.gridHeight; row++)
        {
            for (let col = 0; col < this.gridWidth; col++)
            {
                if (this.grid[row][col] === null)
                    timeline.add({
                        at: 0,
                        run: () => this.addRandomItem(col, row),
                    })
            }
        }

        timeline.add({
            at: 1000,
            run: () => this.stateMachine.changeState(GridState.CALCULATING),
        })

        timeline.play()
    }

    private addRandomItem(xIndex: number, yIndex: number): Tween {
        const randomIndex = Math.floor(Math.random() * this.possibleItemTypes.length)
        const randomItemType = this.possibleItemTypes[randomIndex]

        this.grid[yIndex][xIndex] = new Tile(this.scene, xIndex, yIndex, randomItemType)

        return this.animationFactory.animateTileDropping(this.grid[yIndex][xIndex] as Tile)
    }

    private moveTile(pointer: any, gameobject: any, event: any): void {
        this.stateMachine.changeState(GridState.MOVING)

        if (this.canMove)
        {
            if (!this.firstSelectedTile)
            {
                this.firstSelectedTile = gameobject
            }
            else
            {
                this.secondSelectedTile = gameobject as Tile

                const dx = Math.abs(this.firstSelectedTile.xIndex - this.secondSelectedTile.xIndex)
                const dy = Math.abs(this.firstSelectedTile.yIndex - this.secondSelectedTile.yIndex)

                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1))
                {
                    this.canMove = false
                    this.stateMachine.changeState(GridState.SWAPPING)
                }
            }
        }
    }

    private swapTile(): void {
        const aTile = this.firstSelectedTile as Tile
        const bTile = this.secondSelectedTile as Tile

        this.firstSelectedTile = bTile
        this.secondSelectedTile = aTile

        this.stateMachine.changeState(GridState.CALCULATING)
    }

    private drop(): void {
        for (let col = 0; col < this.gridWidth; col++)
        {
            let emptySpaces = 0

            for (let row = this.gridHeight - 1; row >= 0; row--)
            {
                const tile = this.grid[row][col]

                if (tile === null)
                {
                    emptySpaces++
                }
                else if (emptySpaces > 0)
                {
                    const newRow = row + emptySpaces
                    tile.yIndex = newRow
                    tile.y = newRow * CONST.TILE_HEIGHT

                    this.grid[newRow][col] = tile
                    this.grid[row][col] = null
                }
            }
        }

        this.fillGrid()
    }

    private updateResolveResult(): void {
        this.resolveResult = new GridResolveResult(this.grid as Tile[][])

        console.log(this.resolveResult.totalMatches)

        if (this.resolveResult.totalMatches > 0)
            this.stateMachine.changeState(GridState.CLEARING)
        else
            this.stateMachine.changeState(GridState.IDLE)
    }

    private removeGroups(): void {
        for (const match of this.resolveResult.matchesOfThree)
        {
            for (const tile of match.content)
            {
                const { xIndex, yIndex } = tile
                this.grid[yIndex][xIndex] = null
                tile.destroy()
            }
        }

        for (const match of this.resolveResult.matchesOfFour)
        {
            for (const tile of match.content)
            {
                const { xIndex, yIndex } = tile
                this.grid[yIndex][xIndex] = null
                tile.destroy()
            }
        }

        for (const match of this.resolveResult.matchesOfFiveAngled)
        {
            for (const tile of match.content)
            {
                const { xIndex, yIndex } = tile
                this.grid[yIndex][xIndex] = null
                tile.destroy()
            }
        }

        for (const match of this.resolveResult.matchesOfFiveStraight)
        {
            for (const tile of match.content)
            {
                const { xIndex, yIndex } = tile
                this.grid[yIndex][xIndex] = null
                tile.destroy()
            }
        }

        this.stateMachine.changeState(GridState.DROPPING)
    }

}

enum GridState
{
    INITIALIZING = 'INITIALIZING',
    IDLE = 'IDLE',
    MOVING = 'MOVING',
    SWAPPING = 'SWAPPING',
    CALCULATING = 'CALCULATING',
    CLEARING = 'CLEARING',
    DROPPING = 'DROPPING',
}

export default GridManager
