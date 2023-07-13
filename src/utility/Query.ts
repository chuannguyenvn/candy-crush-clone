class Query<T>
{
    public array: T[]

    constructor(array: T[]) {
        this.array = array
    }

    public toArray(): T[] {
        return this.array
    }

    public all(predicate: (arg: T) => boolean): boolean {
        for (let i = 0; i < this.array.length; i++)
        {
            if (!predicate(this.array[i])) return false
        }

        return true
    }

    public any(predicate: (arg: T) => boolean): boolean {
        return this.array.some((value, _1, _2) => predicate(value))
    }

    public concat(other: Query<T>): Query<T> {
        return new Query<T>(this.array.concat(other.array))
    }

    public first(predicate: (arg: T) => boolean): T | undefined {
        return this.array.find((value, _1, _2) => predicate(value))
    }

    public orderByAscending(predicate: (arg: T) => any): Query<T> {
        return new Query<T>(this.array.sort((a, b) => predicate(a) > predicate(b) ? 1 : -1))
    }

    public orderByDescending(predicate: (arg: T) => any): Query<T> {
        return new Query<T>(this.array.sort((a, b) => predicate(a) > predicate(b) ? -1 : 1))
    }

    public select<E>(predicate: (arg: T) => E): Query<E> {
        const newArray = []
        for (let i = 0; i < this.array.length; i++)
        {
            newArray.push(predicate(this.array[i]))
        }

        return new Query<E>(newArray)
    }

    public where(predicate: (arg: T) => boolean): Query<T> {
        return new Query<T>(this.array.filter((value, _1, _2) => predicate(value)))
    }
}

function query<T>(array: T[]): Query<T> {
    return new Query<T>(JSON.parse(JSON.stringify(array)) as T[])
}

export default query