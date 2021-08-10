let cells = [], states = [],initialStates = [],finalStates = [],transitions = [],type = '',errorCount = 0;

/**
 * Compiles the current automaton.
 * this function is called everytime a change is
 * made in the drawing
 */
function compileAutomaton() {

    cells = editor.graph.getModel().cells;
    states = [];
    initialStates = [];
    finalState = [];
    transitions = [];
    type = ''
    errorCount = 0;


    removePreviousErrors();
    
    for (const [key, cell] of Object.entries(cells)) {
        if(cell.style !== undefined)
            if(cell.style.includes('State'))
                compileState(cell);
            else if(cell.style.includes('Transition'))
                compileTransition(cell);
            else
            continue;
        else
            continue;
    }
    console.log(cells);
    updateCurrentAutomatonInfo()
}

/**
 * Removes the previous messages
 */
function removePreviousErrors() {
    document.getElementById('messages').textContent = '';
}

/**
 * Compiles the current cell in the iteration
 * @param {mxCell} cell 
 */
function compileState(cell) {
    createErrorMessage('teste', cell.value);
}

/**
 * Compiles the current transition in the iteration
 * @param {mxCell} cell 
 */
 function compileTransition(cell) {
    
}

/**
 * Creates a error message to be show at the console
 * @param {string} text 
 */
function createErrorMessage(text, name) {

    message = document.createElement('div');
    message.innerHTML = '<a href="#" class="list-group-item list-group-item-action py-3 lh-tight error-message">'+ 
    '<div class="d-flex w-100 align-items-center justify-content-between">'+
        '<strong class="mb-1"> State/Transition: ' + name + '</strong>'+
        '<i style="color: #dc3545; font-size: larger;" class="bi bi-exclamation-triangle"></i>'+
    '</div>'+
    '<div class="col-10 mb-1 small">'+ text +'</div>'+
'</a>';
    document.getElementById('messages').appendChild(message.firstChild);
}

/**
 * Update the following information in front end:
 * Type, States, final states, initial states, transitions, errorCount
 */
function updateCurrentAutomatonInfo() {
    document.getElementById('type').textContent = type;
    document.getElementById('states').textContent = states;
    document.getElementById('transitions').textContent = transitions;
    document.getElementById('initial-states').textContent = initialStates;
    document.getElementById('final-states').textContent = finalStates;
}