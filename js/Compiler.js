let cells = [],
	states = [],
	initialStates = [],
	finalStates = [],
	transitions = [],
	type = "",
	errorCount = 0,
	initialNodes = [];

/**
 * Compiles the current automaton.
 * this function is called everytime a change is
 * made in the drawing
 */
function compileAutomaton() {

	cells = editor.graph.getModel().cells;
	states = [];
	initialStates = [];
	finalStates = [];
	transitions = [];
	type = "Deterministic finite automaton";
	errorCount = 0;
	initialNodes = [];

	removePreviousMessages();

	for (const [key, cell] of Object.entries(cells)) {
		if (cell.style !== undefined)
			if (cell.style.includes("State"))
				compileState(cell);
			else if (cell.style.includes("Transition"))
				compileTransition(cell);
			else
				continue;
		else
			continue;
	}
	console.log(cells);

	if(finalStates.length == 0) {
		createErrorMessage('', 'Automaton has no final state!');
		errorCount++;
	}

	if(initialStates.length == 0) {
		createErrorMessage('', 'Automaton has no initial state!');
		errorCount++;
	}

	updateCurrentAutomatonInfo();
}

/**
 * Removes the previous messages
 */
function removePreviousMessages() {
	document.getElementById("messages").textContent = "";
}

/**
 * Compiles the current cell in the iteration
 * @param {mxCell} cell
 */
function compileState(cell) {

    if (cell.style.includes('FinalState'))
		finalStates.push(cell.value);
	if (cell.style.includes('InitialState')) {
		initialNodes.push(cell);
		initialStates.push(cell.value);
	} 
   
    states.push(cell.value);

    if(cell.edges != null)
      for (let i = 0; i < cell.edges.length; i++) 
        for (let j = 0; j < cell.edges.length; j++)
            if(cell.edges[i].id != cell.edges[j].id && 
              cell.edges[i].value == cell.edges[j].value && 
              cell.edges[i].source == cell.id && 
              cell.edges[j].source == cell.id) 
              type = 'Nondeterministic finite automaton';
      
    if(cell.edges == null || !cell.edges.some(e => e.style.includes('Transition'))) {
      createErrorMessage('Unreachable state', cell.value);
      errorCount++;
    }

}

/**
 * Compiles the current transition in the iteration
 * @param {mxCell} cell
 */
function compileTransition(cell) {
	transitions.push(cell.value);

	if (cell.target == null || cell.source == null) {
		createErrorMessage('Transition not connected to two states', cell.value);
		errorCount++;
	}
}

/**
 * Creates a error message to be show at the console
 * @param {string} text
 */
function createErrorMessage(text, name) {
	message = document.createElement("div");
	message.innerHTML =
		'<a href="#" class="list-group-item list-group-item-action py-3 lh-tight error-message">' +
		'<div class="d-flex w-100 align-items-center justify-content-between">' +
		'<strong class="mb-1"> ' +
		name +
		"</strong>" +
		'<i style="color: #dc3545; font-size: larger;" class="bi bi-exclamation-triangle"></i>' +
		"</div>" +
		'<div class="col-10 mb-1 small">' +
		text +
		"</div>" +
		"</a>";
	document.getElementById("messages").appendChild(message.firstChild);
}


/**
 * Update the following information in front end:
 * Type, States, final states, initial states, transitions, errorCount
 */
function updateCurrentAutomatonInfo() {
	document.getElementById("type").textContent = type;
	document.getElementById("states").textContent = states;
	document.getElementById("transitions").textContent = transitions;
	document.getElementById("initial-states").textContent = initialStates;
	document.getElementById("final-states").textContent = finalStates;
	document.getElementById("errors-count").textContent = errorCount;
	if (errorCount == 0) {
		message = document.createElement("div");
		message.innerHTML = '<a href="#" class="list-group-item list-group-item-action py-3 lh-tight error-message" style="border-color: #198754;"><div style="text-align: center;" class="w-100 align-items-center justify-content-between"><strong class="mb-1">None <i style="color: #198754; font-size: larger;" class="bi bi-check"></i></strong></div></a>';
		document.getElementById("messages").appendChild(message);
		document.getElementById('errors').style.color = '#198754';
	}
	else
		document.getElementById('errors').style.color = '#dc3545';
}


// Check if the string is accepted by the current automata
const stringInput = document.getElementById('string-validation');

stringInput.addEventListener('change', (event) => {
	// transform string into caracters array
	symbols = stringInput.value.split('');
	index = 0;
	console.log(symbols);
	if(symbols.length == 0 )
		return stringIsEmpty();
	else if(initialStates.length > 0)
		for (let i = 0; i < initialNodes.length; i++) 
			if(nextState(initialNodes[i], index))
				return stringIsValid();

	return stringIsInvalid();
});

/**
 * Gets the next state in the automata given a symbol
 * @param {mxCell} state 
 * @param {int} index 
 */
function nextState(state, index) {
	if(state.style.includes('FinalState'))
		return true;
	else if(state.edges != null){
			return nextState(state.edges[0], index++) ;	
	}
	else
		return false;
					
}


function stringIsValid() {
	stringInput.classList.add('is-valid');
	stringInput.setAttribute('style', 'border-color: rgb(25, 135, 84) !important');
	stringInput.classList.remove('is-invalid');
}

function stringIsInvalid() {
	stringInput.classList.add('is-invalid');
	stringInput.setAttribute('style', 'border-color: #dc3545 !important');
	stringInput.classList.remove('is-valid');
}

function stringIsEmpty() {
	stringInput.classList.remove('is-invalid');
	stringInput.classList.remove('is-valid');
	stringInput.setAttribute('style', 'border-color: #505759  !important');
}