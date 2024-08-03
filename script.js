const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
let output = "";

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const btnValue = e.target.getAttribute("data-value");
    calculate(btnValue);
  });
});

document.addEventListener("keydown", (e) => {
  const keyValue = e.key;
  if (keyValue === "Enter") {
    e.preventDefault();
    calculate("=");
  } else if (keyValue === "Backspace") {
    e.preventDefault();
    calculate("DEL");
  } else if (keyValue === "Escape") {
    e.preventDefault();
    calculate("AC");
  } else if (specialChars.includes(keyValue) || !isNaN(keyValue)) {
    e.preventDefault();
    calculate(keyValue);
  }
});

const specialChars = ["%", "*", "/", "-", "+", "=", "(", ")","."];

const calculate = (btnValue) => {
  display.focus();
  if (btnValue === "=") {
    try {
      if (output.includes("/0")) {
        output = "Error";
      } else {
        // Remove any trailing operators before evaluation 
        if (/[+\-*/]$/.test(output)) {
          output = output.slice(0, -1);
        }

        let result;
        if (output.includes('%')) {
          result = handlePercentage(output);
        }else if (output.includes('*')) {
          // Handle multiplication like our usual calculator do
          result = handleMultiplication(output);
        } else {
          // Evaluate the expression for other operations
          result = eval(output.replace("%", "/100"));
        }

        // Format the result for display
        output = formatResult(result);
      }
    } catch (error) {
      output = "Error";
    }
  } else if (btnValue === "AC") {
    output = "";
  } else if (btnValue === "DEL") {
    output = output.toString().slice(0, -1);
  } else if (btnValue === "(") {
    output += "(";
  } else if (btnValue === ")") {
    output += ")";
  }else if (btnValue === ".") {
    output += ".";
  }else if (btnValue === "%") {
    output += "%";
  }else {
    if (output === "" && specialChars.includes(btnValue)) return;
    if (output.includes("=")) {
      output = "";
    }
    output += btnValue;
  }
  display.value = output;
};

// Prevent user from entering invalid characters
document.addEventListener("keypress", (e) => {
  const keyValue = e.key;
  if (!specialChars.includes(keyValue) && isNaN(keyValue)) {
    e.preventDefault();
  }
});

const handlePercentage = (expression) => {
  const [num1, num2] = expression.split('*').map(part => parseFloat(part.trim()));
  const percentage = num2 / 100;
  const result = num1 * percentage;
  return result;
};

const handleMultiplication = (expression) => {
  const [num1, num2] = expression.split('*').map(part => parseFloat(part.trim()));

  // Count decimal places
  const precision1 = (num1.toString().split('.')[1] || '').length;
  const precision2 = (num2.toString().split('.')[1] || '').length;
  const totalDecimals = precision1 + precision2;

  // Multiply the numbers and adjust for decimal precision
  let result = (num1 * num2);

  // Round to avoid floating point precision issues
  result = Math.round(result * Math.pow(10, totalDecimals)) / Math.pow(10, totalDecimals);

  return result;
};

const formatResult = (result) => {
  return result.toString();
};