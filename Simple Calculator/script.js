// Calculator variables
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Update the display with proper formatting
function updateDisplay(value) {
    let displayValue = value.toString();
    
    // Check if the number is too long for the display
    if (displayValue.length > 12) {
        let num = parseFloat(displayValue);
        
        // Convert to scientific notation if the number is valid
        if (!isNaN(num) && isFinite(num)) {
            if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
                displayValue = num.toExponential(6);
            } else {
                // For very long decimal numbers, round them
                displayValue = num.toPrecision(10);
            }
        }
    }
    
    display.textContent = displayValue;
}

// Handle number input
function inputNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    
    updateDisplay(currentInput);
}

// Handle operator input
function inputOperator(op) {
    if (currentInput === '') return;
    
    if (previousInput !== '' && operator !== '' && !shouldResetDisplay) {
        calculate();
    }
    
    operator = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
}

// Handle decimal point input
function inputDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
        updateDisplay(currentInput);
    }
}

// Perform calculation
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                updateDisplay('Error');
                resetCalculator();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Handle very large or very small results
    if (!isFinite(result)) {
        updateDisplay('Error');
        resetCalculator();
        return;
    }
    
    // Round to avoid floating point precision issues
    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
    
    updateDisplay(result);
    currentInput = result.toString();
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
}

// Clear the display and reset calculator
function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay('0');
}

// Delete the last entered character
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
    } else {
        currentInput = '';
        updateDisplay('0');
    }
}

// Reset calculator after error
function resetCalculator() {
    setTimeout(() => {
        clearDisplay();
    }, 1500);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        inputOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});