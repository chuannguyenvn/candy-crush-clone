class Utility
{
    public static shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array] // Create a new array to avoid modifying the original array

        for (let i = newArray.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1)) // Generate a random index within the remaining portion of the array

            // Swap elements at indices i and j
            const temp = newArray[i]
            newArray[i] = newArray[j]
            newArray[j] = temp
        }

        return newArray
    }

    public static getRandomElement<T>(array: T[]): T {
        const randomIndex = Math.floor(Math.random() * array.length)
        return array[randomIndex]
    }
}

export default Utility