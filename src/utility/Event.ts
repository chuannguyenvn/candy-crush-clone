class GameEvent
{
    private _eventCallbacks: (() => void)[] = []

    public subscribe(callback: () => void): void {
        this._eventCallbacks.push(callback)
    }

    public unsubscribe(callback: () => void): void {
        this._eventCallbacks = this._eventCallbacks.filter((c) => c !== callback)
    }

    public invoke(): void {
        for (const callback of this._eventCallbacks)
        {
            callback()
        }
    }
}

class ParamGameEvent<T>
{
    private _eventCallbacks: ((arg: T) => void)[] = []

    public subscribe(callback: (arg: T) => void): void {
        this._eventCallbacks.push(callback)
    }

    public unsubscribe(callback: (arg: T) => void): void {
        this._eventCallbacks = this._eventCallbacks.filter((c) => c !== callback)
    }

    public invoke(arg: T): void {
        for (const callback of this._eventCallbacks)
        {
            callback(arg)
        }
    }
}

export {GameEvent, ParamGameEvent}