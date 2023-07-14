import { Tile } from './tiles/Tile'
import Utility from '../utility/Utility'

export class GridResolveResult
{
    public matchesOfThree: MatchOfThree[] = []
    public matchesOfFour: MatchOfFour[] = []
    public matchesOfFiveStraight: MatchOfFiveStraight[] = []
    public matchesOfFiveAngled: MatchOfFiveAngled[] = []
    public totalMatches: number = 0

    constructor(grid: Tile[][]) {
        this.matchesOfFiveAngled = Utility.shuffleArray(this.findMatchesOfFiveAngled(grid))
        this.matchesOfFiveStraight = Utility.shuffleArray(this.findMatchesOfFiveStraight(grid))
        this.matchesOfFour = Utility.shuffleArray(this.findMatchesOfFour(grid))
        this.matchesOfThree = Utility.shuffleArray(this.findMatchesOfThree(grid))

        this.totalMatches =
            this.matchesOfThree.length +
            this.matchesOfFour.length +
            this.matchesOfFiveStraight.length +
            this.matchesOfFiveAngled.length
    }

    private findMatchesOfThree(grid: Tile[][]): MatchOfThree[] {
        const matches: MatchOfThree[] = []

        // Iterate over each column
        for (let col = 0; col < grid[0].length; col++)
        {
            // Iterate over each row in the column
            for (let row = 0; row < grid.length - 2; row++)
            {
                const tileA = grid[row][col]
                const tileB = grid[row + 1][col]
                const tileC = grid[row + 2][col]

                // Check if the tiles can match and have the same type
                if (
                    tileA.canMatchWith(tileB) &&
                    tileB.canMatchWith(tileC)
                )
                {
                    const matchTiles = [tileA, tileB, tileC]
                    matches.push(new MatchOfThree(matchTiles))
                }
            }
        }

        // Iterate over each row
        for (let row = 0; row < grid.length; row++)
        {
            const currentRow = grid[row]

            // Iterate over each column in the row
            for (let col = 0; col < currentRow.length - 2; col++)
            {
                const tileA = currentRow[col]
                const tileB = currentRow[col + 1]
                const tileC = currentRow[col + 2]

                // Check if the tiles can match and have the same type
                if (
                    tileA.canMatchWith(tileB) &&
                    tileB.canMatchWith(tileC)
                )
                {
                    const matchTiles = [tileA, tileB, tileC]
                    matches.push(new MatchOfThree(matchTiles))
                }
            }
        }

        return matches
    }

    private findMatchesOfFour(grid: Tile[][]): MatchOfFour[] {
        const matches: MatchOfFour[] = []

        // Iterate over each column
        for (let col = 0; col < grid[0].length; col++)
        {
            // Iterate over each row in the column
            for (let row = 0; row < grid.length - 3; row++)
            {
                const tileA = grid[row][col]
                const tileB = grid[row + 1][col]
                const tileC = grid[row + 2][col]
                const tileD = grid[row + 3][col]

                // Check if the tiles can match and have the same type
                if (
                    tileA.canMatchWith(tileB) &&
                    tileB.canMatchWith(tileC) &&
                    tileC.canMatchWith(tileD)
                )
                {
                    const matchTiles = [tileA, tileB, tileC, tileD]
                    matches.push(new MatchOfFour(matchTiles))
                }
            }
        }

        // Iterate over each row
        for (let row = 0; row < grid.length; row++)
        {
            const currentRow = grid[row]

            // Iterate over each column in the row
            for (let col = 0; col < currentRow.length - 3; col++)
            {
                const tileA = currentRow[col]
                const tileB = currentRow[col + 1]
                const tileC = currentRow[col + 2]
                const tileD = currentRow[col + 3]

                // Check if the tiles can match and have the same type
                if (
                    tileA.canMatchWith(tileB) &&
                    tileB.canMatchWith(tileC) &&
                    tileC.canMatchWith(tileD)
                )
                {
                    const matchTiles = [tileA, tileB, tileC, tileD]
                    matches.push(new MatchOfFour(matchTiles))
                }
            }
        }

        return matches
    }

    private findMatchesOfFiveStraight(grid: Tile[][]): MatchOfFiveStraight[] {
        const matches: MatchOfFiveStraight[] = []

        // Iterate over each column
        for (let col = 0; col < grid[0].length; col++)
        {
            // Iterate over each row in the column
            for (let row = 0; row < grid.length - 4; row++)
            {
                const tileA = grid[row][col]
                const tileB = grid[row + 1][col]
                const tileC = grid[row + 2][col]
                const tileD = grid[row + 3][col]
                const tileE = grid[row + 4][col]

                // Check if the tiles can match and have the same type
                if (
                    tileA.canMatchWith(tileB) &&
                    tileB.canMatchWith(tileC) &&
                    tileC.canMatchWith(tileD) &&
                    tileD.canMatchWith(tileE)
                )
                {
                    const matchTiles = [tileA, tileB, tileC, tileD, tileE]
                    matches.push(new MatchOfFiveStraight(matchTiles))
                }
            }
        }

        // Iterate over each row
        for (let row = 0; row < grid.length; row++)
        {
            const currentRow = grid[row]

            // Iterate over each column in the row
            for (let col = 0; col < currentRow.length - 4; col++)
            {
                const tileA = currentRow[col]
                const tileB = currentRow[col + 1]
                const tileC = currentRow[col + 2]
                const tileD = currentRow[col + 3]
                const tileE = currentRow[col + 4]

                // Check if the tiles can match and have the same type
                if (
                    tileA.canMatchWith(tileB) &&
                    tileB.canMatchWith(tileC) &&
                    tileC.canMatchWith(tileD) &&
                    tileD.canMatchWith(tileE)
                )
                {
                    const matchTiles = [tileA, tileB, tileC, tileD, tileE]
                    matches.push(new MatchOfFiveStraight(matchTiles))
                }
            }
        }

        return matches
    }

    private findMatchesOfFiveAngled(grid: Tile[][]): MatchOfFiveAngled[] {
        const matches: MatchOfFiveAngled[] = []
        const matchPatterns: string[][] = [
            // Define your match patterns here
            ['0', '1', '0', '1', '1', '1', '0', '1', '0'], // +
            ['1', '1', '1', '0', '1', '0', '0', '1', '0'], // T
            ['0', '1', '0', '0', '1', '0', '1', '1', '1'], // T
            ['1', '0', '0', '1', '1', '1', '1', '0', '0'], // T
            ['0', '0', '1', '1', '1', '1', '0', '0', '1'], // T
            ['1', '0', '0', '1', '0', '0', '1', '1', '1'], // L
            ['0', '0', '1', '0', '0', '1', '1', '1', '1'], // L
            ['1', '1', '1', '1', '0', '0', '1', '0', '0'], // L
            ['1', '1', '1', '0', '0', '1', '0', '0', '1'], // L
        ]

        // Iterate over each row
        for (let row = 0; row < grid.length - 2; row++)
        {
            const currentRow = grid[row]

            // Iterate over each column in the row
            for (let col = 0; col < currentRow.length - 2; col++)
            {
                // Extract the 3x3 grid section
                const gridSection: string[] = []
                for (let i = 0; i < 3; i++)
                {
                    for (let j = 0; j < 3; j++)
                    {
                        const tile = grid[row + i][col + j]
                        gridSection.push(tile ? tile.tileType : '')
                    }
                }

                // Compare the grid section with each match pattern
                for (const matchPattern of matchPatterns)
                {
                    const firstTileType = matchPattern.find((type) => type !== '0')
                    if (!firstTileType) continue

                    let isMatch = true
                    for (let i = 0; i < matchPattern.length; i++)
                    {
                        if (matchPattern[i] === '1' && gridSection[i] !== firstTileType)
                        {
                            isMatch = false
                            break
                        }
                    }

                    // If the grid section matches the pattern, add it to the matches
                    if (isMatch)
                    {
                        const matchTiles: Tile[] = []
                        for (let i = 0; i < 9; i++)
                        {
                            const tile = grid[row + Math.floor(i / 3)][col + (i % 3)]
                            matchTiles.push(tile)
                        }
                        matches.push(new MatchOfFiveAngled(matchTiles))
                        break // Break the loop if a match is found
                    }
                }
            }
        }

        return matches
    }

    // ...
}

export class MatchOfThree
{
    public content: Tile[]

    constructor(content: Tile[]) {
        this.content = content
        this.content.forEach((tile) => (tile.isInMatch = true))
    }
}

export class MatchOfFour
{
    public content: Tile[]

    constructor(content: Tile[]) {
        this.content = content
        this.content.forEach((tile) => (tile.isInMatch = true))
    }
}

export class MatchOfFiveAngled
{
    public content: Tile[]

    constructor(content: Tile[]) {
        this.content = content
        this.content.forEach((tile) => (tile.isInMatch = true))
    }
}

export class MatchOfFiveStraight
{
    public content: Tile[]

    constructor(content: Tile[]) {
        this.content = content
        this.content.forEach((tile) => (tile.isInMatch = true))
    }
}
