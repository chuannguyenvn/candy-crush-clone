class StateMachine<E>
{
    private configuringState: E
    private onEntryCallbacks: StateMachineCallbackUnit<E>[] = []
    private onExitCallbacks: StateMachineCallbackUnit<E>[] = []
    private sameStateInvoke: boolean

    constructor(initState: E, sameStateInvoke = false) {
        this._currentState = initState
        this.sameStateInvoke = sameStateInvoke
    }

    private _currentState: E

    public get currentState(): E {
        return this._currentState
    }

    public changeState(state: E): void {
        if (!this.sameStateInvoke && this._currentState === state) return

        for (let i = 0; i < this.onExitCallbacks.length; i++)
        {
            if (this.onExitCallbacks[i].state !== this._currentState) continue
            this.onExitCallbacks[i].callback()
        }

        for (let i = 0; i < this.onEntryCallbacks.length; i++)
        {
            if (this.onEntryCallbacks[i].state !== state) continue
            this.onEntryCallbacks[i].callback()
        }

        this._currentState = state
    }

    public configure(state: E): StateMachine<E> {
        this.configuringState = state
        return this
    }

    public onEntry(callback: () => void): StateMachine<E> {
        this.onEntryCallbacks.push(
            new StateMachineCallbackUnit<E>(this.configuringState, callback),
        )
        return this
    }

    public onExit(callback: () => void): StateMachine<E> {
        this.onExitCallbacks.push(
            new StateMachineCallbackUnit<E>(this.configuringState, callback),
        )
        return this
    }
}

class StateMachineCallbackUnit<E>
{
    public state: E
    public callback: () => void

    constructor(state: E, callback: () => void) {
        this.state = state
        this.callback = callback
    }
}

export default StateMachine
