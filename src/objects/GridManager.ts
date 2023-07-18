import Keys from '../const/Keys'
import { Scene } from 'phaser'
import { Tile } from './tiles/Tile'
import StateMachine from '../utility/StateMachine'
import { GridResolveResult } from './GridResolveResult'
import { CONST } from '../const/Const'
import AnimationFactory from './AnimationFactory'
import Utility from '../utility/Utility'
import NormalTile from './tiles/NormalTile'
import ExplosionTile from './tiles/ExplosionTile'
import ClearTile from './tiles/ClearTile'
import { GameScene } from '../scenes/game-scene'
import FollowTarget from './FollowTarget'
import TimerEvent = Phaser.Time.TimerEvent

class GridManager
{
    public readonly stateMachine: StateMachine<GridState> = new StateMachine<GridState>(GridState.INITIALIZING)
    public readonly animationFactory: AnimationFactory

    public readonly gridWidth: number
    public readonly gridHeight: number
    private readonly possibleItemTypes: Keys.Sprite[]

    private scene: Scene

    public grid: (Tile | null)[][]

    public firstSelectedTile: Tile | null
    public secondSelectedTile: Tile | null

    private resolveResult: GridResolveResult
    private canMove = false

    private matchesClearedThisMove: number

    private wakeUpTimer: TimerEvent

    public gameScene: GameScene

    public awaitingShuffle = false

    private followTargets: FollowTarget[] = []

    constructor(
        scene: GameScene,
        gridWidth: number,
        gridHeight: number,
        possibleFoodTypes: Keys.Sprite[],
    ) {
        this.gameScene = scene
        this.gridWidth = gridWidth
        this.gridHeight = gridHeight
        this.possibleItemTypes = possibleFoodTypes

        this.animationFactory = new AnimationFactory(scene, this)

        this.gameScene.input.on(Phaser.Input.Events.GAMEOBJECT_DOWN, this.moveTile, this)

        this.stateMachine.configure(GridState.IDLE).onEntry(() => {
            this.resetWakeTimer()
            this.gameScene.scoreManager.resetMultiplier()
            this.deselectTiles()
        })
        this.stateMachine.configure(GridState.SWAPPING).onEntry(() => {
            this.swapTile()
            this.stopWakeTimer()
        })
        this.stateMachine.configure(GridState.CALCULATE).onEntry(() => {
            this.updateResolveResult()
        })
        this.stateMachine.configure(GridState.CLEARING).onEntry(() => {
            this.stopWakeTimer()
            this.clearGroups()
        })
        this.stateMachine.configure(GridState.DROPPING).onEntry(() => {
            this.dropAndFill()
        })
        this.stateMachine.configure(GridState.SHUFFLING).onEntry(() => {
            this.awaitingShuffle = false
            this.shuffle()
        })

        this.resetWakeTimer()
        this.initGrid()
    }

    private initGrid(): void {
        this.grid = []

        for (let row = 0; row < this.gridHeight; row++)
        {
            const newRow: (Tile | null)[] = []
            for (let col = 0; col < this.gridWidth; col++)
            {
                newRow.push(null)
                this.followTargets.push(new FollowTarget(this.gameScene))
            }
            this.grid.push(newRow)
        }

        this.stateMachine.changeState(GridState.DROPPING)
    }

    update(): void {
        console.log('====================')
        console.log(this.firstSelectedTile)
        console.log(this.secondSelectedTile)
    }

    private addRandomItem(xIndex: number, yIndex: number): void {
        const randomIndex = Math.floor(Math.random() * this.possibleItemTypes.length)
        const randomItemType = this.possibleItemTypes[randomIndex]

        const newTile = new NormalTile(this.gameScene, this, xIndex, yIndex, randomItemType)
        this.grid[yIndex][xIndex] = newTile

        this.animationFactory.animateTileDropping(this.grid[yIndex][xIndex] as Tile, newTile.y - this.gridHeight * CONST.TILE_HEIGHT, newTile.y)
    }

    private moveTile(pointer: any, gameobject: Tile, event: any): void {
        if (this.stateMachine.currentState === GridState.IDLE)
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
                    this.deselectTiles()
                }
            }

            this.wakeUpTimer.reset({})
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
            this.animationFactory.animateTileSwapping(aTile, bTile, true)
        }
        else
        {
            this.animationFactory.animateTileSwapping(aTile, bTile, false, () => {
                this.stateMachine.changeState(GridState.CALCULATE)
            })
        }
    }

    private deselectTiles(): void {
        this.firstSelectedTile?.stopAllAnimation()
        this.secondSelectedTile?.stopAllAnimation()
        
        this.firstSelectedTile = null
        this.secondSelectedTile = null
    }

    private updateResolveResult(): void {
        this.resolveResult = new GridResolveResult(this.grid as Tile[][])

        this.matchesClearedThisMove += this.resolveResult.totalMatches

        if (this.resolveResult.totalMatches > 0 || this.firstSelectedTile?.tileType === Keys.Sprite.STAR || this.secondSelectedTile?.tileType === Keys.Sprite.STAR)
        {
            this.stateMachine.changeState(GridState.CLEARING)
        }
        else
        {
            if (this.matchesClearedThisMove === 0) this.swapTile(true)
            if (this.awaitingShuffle) this.stateMachine.changeState(GridState.SHUFFLING)
            else this.stateMachine.changeState(GridState.IDLE)
        }
    }

    private async clearGroups(): Promise<void> {
        if (this.firstSelectedTile?.tileType === Keys.Sprite.STAR)
        {
            await this.firstSelectedTile.resolve()
        }
        if (this.secondSelectedTile?.tileType === Keys.Sprite.STAR)
        {
            await this.secondSelectedTile.resolve()
        }

        for (const match of this.resolveResult.matchesOfFiveStraight)
        {
            for (const tile of match.content)
            {
                await tile.resolve()
            }

            const chosenTile = match.content[2]
            this.gameScene.cameras.main.pan(chosenTile.x, chosenTile.y, 500, Phaser.Math.Easing.Cubic.Out)
            this.gameScene.cameras.main.rotateTo(Math.random() * 0.05, true, 500, Phaser.Math.Easing.Cubic.Out)
            this.gameScene.cameras.main.zoomTo(1.5, 500, Phaser.Math.Easing.Cubic.Out)
            await new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    const clearTile = new ClearTile(this.gameScene, this, chosenTile.xIndex, chosenTile.yIndex)
                    this.grid[chosenTile.yIndex][chosenTile.xIndex] = clearTile
                    setTimeout(() => {
                        this.gameScene.cameras.main.pan(CONST.TILE_WIDTH * 3.5, CONST.TILE_HEIGHT * 4, 500, Phaser.Math.Easing.Cubic.Out)
                        this.gameScene.cameras.main.rotateTo(0, true, 500, Phaser.Math.Easing.Cubic.Out)
                        this.gameScene.cameras.main.zoomTo(1, 500, Phaser.Math.Easing.Cubic.Out)
                        setTimeout(() => {
                            resolve()
                        }, 500)
                    }, 500)
                }, 500)
            })
        }

        for (const match of this.resolveResult.matchesOfFiveAngled)
        {
            for (const tile of match.content)
            {
                await tile.resolve()
            }
        }

        for (const match of this.resolveResult.matchesOfFour)
        {
            for (const tile of match.content)
            {
                await tile.resolve()
            }

            const chosenTile = Utility.getRandomElement(match.content)
            const explosionTile = new ExplosionTile(this.gameScene, this, chosenTile.xIndex, chosenTile.yIndex, chosenTile.tileType)
            this.grid[chosenTile.yIndex][chosenTile.xIndex] = explosionTile
        }

        for (const match of this.resolveResult.matchesOfThree)
        {
            for (const tile of match.content)
            {
                await tile.resolve()
            }
        }

        this.deselectTiles()
        this.stateMachine.changeState(GridState.DROPPING)
    }

    private dropAndFill(): void {
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
                if (this.grid[row][col] === null)
                {
                    this.addRandomItem(col, row)
                }
            }
        }

        this.gameScene.time.delayedCall(AnimationFactory.TILE_DROPPING_TIME, () => {
            this.stateMachine.changeState(GridState.CALCULATE)
        })
    }

    private resetWakeTimer(): void {
        this.wakeUpTimer?.destroy()
        this.wakeUpTimer = this.gameScene.time.addEvent({
            delay: 3000,
            callback: () => {
                const match = this.findPotentialMatch()
                if (match === null) return
                this.grid[match.yIndex][match.xIndex]?.playHintAnimation(match.xOffset, match.yOffset)
                this.resetWakeTimer()
            },
        })
    }

    private stopWakeTimer(): void {
        this.wakeUpTimer?.destroy()
    }

    public findPotentialMatch(): { xIndex: number, yIndex: number, xOffset: number, yOffset: number } | null {
        for (let row = 0; row < this.gridHeight; row++)
        {
            for (let col = 0; col < this.gridWidth; col++)
            {
                const currentTile = this.grid[row][col] as Tile

                if (this.getTileTypeByOffset(currentTile, -1, -1) === currentTile.tileType)
                {
                    if (
                        this.getTileTypeByOffset(currentTile, -2, -1) === currentTile.tileType ||
                        this.getTileTypeByOffset(currentTile, 1, -1) === currentTile.tileType
                    )
                    {
                        console.log(1)
                        return { xIndex: col, yIndex: row, xOffset: 0, yOffset: -1 }
                    }
                    if (
                        this.getTileTypeByOffset(currentTile, -1, -2) === currentTile.tileType ||
                        this.getTileTypeByOffset(currentTile, -1, 1) === currentTile.tileType
                    )
                    {
                        console.log(2)
                        return { xIndex: col, yIndex: row, xOffset: -1, yOffset: 0 }
                    }
                }

                if (this.getTileTypeByOffset(currentTile, 1, -1) === currentTile.tileType)
                {
                    if (
                        this.getTileTypeByOffset(currentTile, 2, -1) === currentTile.tileType ||
                        this.getTileTypeByOffset(currentTile, -1, -1) === currentTile.tileType
                    )
                    {
                        console.log(3)
                        return { xIndex: col, yIndex: row, xOffset: 0, yOffset: -1 }
                    }
                    if (
                        this.getTileTypeByOffset(currentTile, 1, -2) === currentTile.tileType ||
                        this.getTileTypeByOffset(currentTile, 1, 1) === currentTile.tileType
                    )
                    {
                        console.log(4)
                        return { xIndex: col, yIndex: row, xOffset: 1, yOffset: 0 }
                    }
                }

                if (this.getTileTypeByOffset(currentTile, 1, 1) === currentTile.tileType)
                {
                    if (
                        this.getTileTypeByOffset(currentTile, 2, 1) === currentTile.tileType ||
                        this.getTileTypeByOffset(currentTile, -1, 1) === currentTile.tileType
                    )
                    {
                        console.log(5)
                        return { xIndex: col, yIndex: row, xOffset: 0, yOffset: 1 }
                    }
                    if (
                        this.getTileTypeByOffset(currentTile, 1, 2) === currentTile.tileType ||
                        this.getTileTypeByOffset(currentTile, 1, -1) === currentTile.tileType
                    )
                    {
                        console.log(6)
                        return { xIndex: col, yIndex: row, xOffset: 1, yOffset: 0 }
                    }
                }

                if (this.getTileTypeByOffset(currentTile, -1, 1) === currentTile.tileType)
                {
                    if (
                        this.getTileTypeByOffset(currentTile, -2, 1) === currentTile.tileType ||
                        this.getTileTypeByOffset(currentTile, 1, 1) === currentTile.tileType
                    )
                    {
                        console.log(7)
                        return { xIndex: col, yIndex: row, xOffset: 0, yOffset: 1 }
                    }
                    if (
                        this.getTileTypeByOffset(currentTile, -1, 2) === currentTile.tileType ||
                        this.getTileTypeByOffset(currentTile, -1, -1) === currentTile.tileType
                    )
                    {
                        console.log(8)
                        return { xIndex: col, yIndex: row, xOffset: -1, yOffset: 0 }
                    }
                }

                if (this.getTileTypeByOffset(currentTile, 0, -2) === currentTile.tileType)
                {
                    if (this.getTileTypeByOffset(currentTile, 0, -3) === currentTile.tileType)
                    {
                        console.log(9)
                        return { xIndex: col, yIndex: row, xOffset: 0, yOffset: -1 }
                    }
                }

                if (this.getTileTypeByOffset(currentTile, 0, 2) === currentTile.tileType)
                {
                    if (this.getTileTypeByOffset(currentTile, 0, 3) === currentTile.tileType)
                    {
                        console.log(10)
                        return { xIndex: col, yIndex: row, xOffset: 0, yOffset: 1 }
                    }
                }

                if (this.getTileTypeByOffset(currentTile, -2, 0) === currentTile.tileType)
                {
                    if (this.getTileTypeByOffset(currentTile, -3, 0) === currentTile.tileType)
                    {
                        console.log(11)
                        return { xIndex: col, yIndex: row, xOffset: -1, yOffset: 0 }
                    }
                }

                if (this.getTileTypeByOffset(currentTile, 2, 0) === currentTile.tileType)
                {
                    if (this.getTileTypeByOffset(currentTile, 3, 0) === currentTile.tileType)
                    {
                        console.log(12)
                        return { xIndex: col, yIndex: row, xOffset: 1, yOffset: 0 }
                    }
                }
            }
        }

        return null
    }

    public getTileByOffset(tile: Tile, xOffset: number, yOffset: number): Tile | null {
        const newX = tile.xIndex + xOffset
        const newY = tile.yIndex + yOffset

        if (newY < 0 || newY >= this.gridHeight || newX < 0 || newX >= this.gridWidth)
        {
            return null
        }

        return (this.grid[newY][newX] as Tile)
    }

    private getTileTypeByOffset(tile: Tile, xOffset: number, yOffset: number): string | null {
        const newX = tile.xIndex + xOffset
        const newY = tile.yIndex + yOffset

        if (newY < 0 || newY >= this.gridHeight || newX < 0 || newX >= this.gridWidth)
        {
            return null
        }

        return (this.grid[newY][newX] as Tile).tileType
    }

    private shuffle(): void {
        let allTiles: Tile[] = []

        for (let row = 0; row < this.gridHeight; row++)
        {
            for (let col = 0; col < this.gridWidth; col++)
            {
                const tile = this.grid[row][col] as Tile
                allTiles.push(tile)
                tile.assignFollowTarget(this.followTargets[row * 8 + col])
            }
        }

        this.followTargets = Utility.shuffleArray(this.followTargets)
        allTiles = Utility.shuffleArray(allTiles)

        const circle = new Phaser.Geom.Circle(CONST.TILE_HEIGHT * 3.5, CONST.TILE_HEIGHT * 3.5, 200)
        Phaser.Actions.PlaceOnCircle(this.followTargets, circle)

        this.gameScene.tweens.add({
            targets: circle,
            radius: 228,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1000,
            yoyo: true,
            repeat: 1,
            onUpdate: (tween) => {
                Phaser.Actions.RotateAroundDistance(this.followTargets, {
                    x: CONST.TILE_HEIGHT * 3.5,
                    y: CONST.TILE_HEIGHT * 3.5,
                }, 0.02, circle.radius)
                allTiles.forEach(tile => tile.moveToTarget(tween.progress))
            },
            onComplete: () => {
                for (let row = 0; row < this.gridHeight; row++)
                {
                    for (let col = 0; col < this.gridWidth; col++)
                    {
                        this.grid[row][col] = allTiles[row * this.gridHeight + col]
                        allTiles[row * this.gridHeight + col].reassignIndex(col, row);
                        ((this.grid[row][col] as Tile).followTarget as FollowTarget).x = col * CONST.TILE_WIDTH;
                        ((this.grid[row][col] as Tile).followTarget as FollowTarget).y = row * CONST.TILE_HEIGHT
                    }
                }

                this.gameScene.tweens.addCounter({
                    from: 0,
                    to: 1,
                    duration: 1000,
                    ease: Phaser.Math.Easing.Sine.InOut,
                    onUpdate: (tween) => {
                        allTiles.forEach(tile => tile.moveToTarget(tween.getValue()))
                    },
                    onComplete: () => {
                        allTiles.forEach(tile => tile.removeFollowTarget())
                        this.stateMachine.changeState(GridState.CALCULATE)
                    },
                })
            },
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
    SHUFFLING = 'SHUFFLING',
}

export default GridManager
