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
    
    private matchesClearedThisMove: number

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
        this.stateMachine.configure(GridState.CALCULATE).onEntry(() => this.updateResolveResult())
        this.stateMachine.configure(GridState.CLEARING).onEntry(() => this.clearGroups())
        this.stateMachine.configure(GridState.DROPPING).onEntry(() => this.fillAndDrop())

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

        this.stateMachine.changeState(GridState.DROPPING)
    }

    private addRandomItem(xIndex: number, yIndex: number): void {
        const randomIndex = Math.floor(Math.random() * this.possibleItemTypes.length)
        const randomItemType = this.possibleItemTypes[randomIndex]

        const newTile = new Tile(this.scene, xIndex, yIndex, randomItemType)
        this.grid[yIndex][xIndex] = newTile

        this.animationFactory.animateTileDropping(this.grid[yIndex][xIndex] as Tile, newTile.y - this.gridHeight * CONST.TILE_HEIGHT, newTile.y)
    }

    private moveTile(pointer: any, gameobject: Tile, event: any): void {
        if (this.stateMachine.currentState == GridState.IDLE)
        {
            if (!this.firstSelectedTile)
            {
                this.firstSelectedTile = gameobject
                this.firstSelectedTile.playSelectedAnimation()
            }
            else
            {
                this.secondSelectedTile = gameobject as Tile

                if (this.firstSelectedTile === this.secondSelectedTile)
                {
                    this.deselectTiles()
                    return
                }
                
                const dx = Math.abs(this.firstSelectedTile.xIndex - this.secondSelectedTile.xIndex)
                const dy = Math.abs(this.firstSelectedTile.yIndex - this.secondSelectedTile.yIndex)

                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1))
                {
                    this.canMove = false
                    this.stateMachine.changeState(GridState.SWAPPING)
                }
                else
                {
                    this.firstSelectedTile = null
                    this.secondSelectedTile = null
                }
            }
        }
    }

    private swapTile(swapBack = false): void {
        this.matchesClearedThisMove = 0
        
        const aTile = this.firstSelectedTile as Tile
        const bTile = this.secondSelectedTile as Tile

        this.grid[aTile.yIndex][aTile.xIndex] = bTile
        this.grid[bTile.yIndex][bTile.xIndex] = aTile
        
        const bXIndex = bTile.xIndex
        const bYIndex = bTile.yIndex
        bTile.xIndex = aTile.xIndex
        bTile.yIndex = aTile.yIndex
        aTile.xIndex = bXIndex
        aTile.yIndex = bYIndex
        
        if (swapBack)
        {
            this.deselectTiles()
            this.animationFactory.animateTileSwapping(aTile, bTile)
        }
        else
        {
            this.animationFactory.animateTileSwapping(aTile, bTile, () => {
                this.stateMachine.changeState(GridState.CALCULATE)
            })
        }
    }

    private deselectTiles() : void{
        this.firstSelectedTile?.stopSelectedAnimation()
        this.secondSelectedTile?.stopSelectedAnimation()
        
        this.firstSelectedTile = null
        this.secondSelectedTile = null
    }
    
    private updateResolveResult(): void {
        this.resolveResult = new GridResolveResult(this.grid as Tile[][])

        this.matchesClearedThisMove += this.resolveResult.totalMatches
        
        if (this.resolveResult.totalMatches > 0)
        {
            this.deselectTiles()
            this.stateMachine.changeState(GridState.CLEARING)
        }
        else
        {
            if (this.matchesClearedThisMove === 0) this.swapTile(true)
            this.stateMachine.changeState(GridState.IDLE)
        }
    }

    private clearGroups(): void {
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

    private fillAndDrop(): void {
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
                    this.animationFactory.animateTileDropping(tile, tile.y, newRow * CONST.TILE_HEIGHT)

                    this.grid[newRow][col] = tile
                    this.grid[row][col] = null
                }
            }
        }

        for (let row = 0; row < this.gridHeight; row++)
        {
            for (let col = 0; col < this.gridWidth; col++)
            {
                {
                    if (this.grid[row][col] === null)
                    {
                        this.addRandomItem(col, row)
                    }
                }
            }
        }

        this.scene.time.delayedCall(AnimationFactory.TILE_DROPPING_TIME, () => {
            this.stateMachine.changeState(GridState.CALCULATE)
        })
    }
}

enum GridState
{
    INITIALIZING = 'INITIALIZING',
    IDLE = 'IDLE',
    MOVING = 'MOVING',
    SWAPPING = 'SWAPPING',
    CALCULATE = 'CALCULATE',
    MERGING = 'MERGING',
    CLEARING = 'CLEARING',
    DROPPING = 'DROPPING',
}

export default GridManager
