class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {

        if(!config) throw new Error('NO CONFIG ACCEPTED!');

        this._config = config;
        this._currState = config.initial;
        this._possStates = config.states;
        this._history = [];
        this._removedStates = [];

        this.addToHistory(this._currState);

    }
        
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {

        return this._currState;

    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        
        if(this.getStatesArr().includes(state)) {

            this._currState = state;
            this.addToHistory(state);

        } else {

            throw new Error('STATE DOESNT EXIST!');

        }

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {

        const testDestination = this._possStates[this._currState].transitions[event];

        if(testDestination) {

            this._currState = testDestination;

            this.addToHistory(this._currState);

        } else {

            throw new Error('WRONG ROUTE!');

        }

    }

    /**
     * Resets FSM state to initial.
     */
    reset() {

        this._currState = this._config.initial;

        this.addToHistory(this._currState);

    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {

        if(!event) {

            return this.getStatesArr();

        } else {

            const states = this.getStatesArr();            
            const resArr = [];
            
            for(let i = 0; i < states.length; i++) {

                let currState = states[i];

                if(this._possStates[currState].transitions[event]) {

                    resArr.push(currState);

                }
            }

            return resArr;

        }

    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {

        const prevState = this._history[this._history.length - 2];
        const lastState = this._history[this._history.length - 1];

        if(prevState && lastState) {

            this._currState = prevState;

            if(lastState !== this._removedStates[this._removedStates.length - 1]) {

                this._removedStates.push(lastState);

                this._history.pop();

            }

            return true;

        } else {

            return false;

        }

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        
        if(this._removedStates.length) {

            const lastRemoved = this._removedStates[this._removedStates.length - 1];

            this._history.push(lastRemoved);
            this._currState = lastRemoved;
            
            this._removedStates.pop();

            return true;

        } else {

            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._history.length = 0;
    }

    // Support functions

    /**
     * Adds state to history if this is a first state in history
     * or it's different from last state in history
     * @param state 
     */
    addToHistory(state) {

        const lastState = this._history[this._history.length - 1];

        if(!lastState || state !== lastState) {

            this._history.push(state);

        }

    }

    /**
     * Get all possible states as array that contains every state
     * as string
     */
    getStatesArr() {

        const allParts = Object.entries(this._possStates);
        const statesArr = [];

        for(let part of allParts) {

            statesArr.push(part[0]);

        }

        return statesArr;

    }
    
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
