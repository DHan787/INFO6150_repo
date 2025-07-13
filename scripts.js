/*
 * @Author: Jiang Han
 * @Date: 2025-02-14 18:59:37
 * @Description:
 */
function init() {
  var my_list = document.getElementById("my_list");

  const todos = [
    "Buy milk",
    "Clean the house",
    "Do homework",
    "Walk the dog",
    "Go to the gym",
  ];
  for (let i = 0; i < todos.length; i++) {
    var li = document.createElement("li");
    li.textContent = todos[i];
    my_list.appendChild(li);
  }

  var my_pages = document.getElementById("my_pages");

  const pages = [
    { name: "Home", url: "home.html" },
    { name: "About", url: "about.html" },
    { name: "Contact", url: "contact.html" },
  ];
  for (let i = 0; i < pages.length; i++) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.textContent = pages[i].name;
    a.href = pages[i].url;
    li.appendChild(a);
    my_pages.appendChild(li);
  }
}

function generateRandomNumber() {
  var random_number = Math.floor(Math.random() * 100) + 1;
  var output = document.getElementById("random_number_display_value");
  output.textContent = random_number;
  output.classList.remove("heavy-effect");
  void output.offsetWidth;
  output.classList.add("heavy-effect");
}

// document.addEventListener("keydown", function (event) {
//   const key = event.key;
//   console.log("Key pressed:", key);
//   if (/^[a-zA-Z0-9]$/.test(key)) {
//     console.log("You pressed:", key);
//   } else {
//     generateRandomNumber();
//   }
// });

// function calculate() {
//   var expression = document.getElementById("expression").value;
//   // find  all numbers
//   var num = /\d+/.exec(expression);
//   console.log("Num:", num);
//   var operator = /(\+|-|\*|\/)/.exec(expression)[0];
//   var result = 0;
//   switch (operator) {
//     case "+":
//       result = parseInt(num1) + parseInt(num2);
//       break;
//     case "-":
//       result = parseInt(num1) - parseInt(num2);
//       break;
//     case "*":
//       result = parseInt(num1) * parseInt(num2);
//       break;
//     case "/":
//       result = parseInt(num1) / parseInt(num2);
//       break;
//   }
//   document.getElementById("result").textContent = result;
//   console.log("Num1:", num1);
//   console.log("Num2:", num2);
//   console.log("Operator:", operator);
// }

function calculate() {
  var expression = document.getElementById("expression").value
  expression = expression.replace(/\s+/g, '');

  // 定义运算符优先级
  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  };

  // 操作数栈（存储数字）
  let numbers = [];
  // 运算符栈
  let operators = [];

  let i = 0;
  while (i < expression.length) {
    let c = expression[i];
    if (c === '(') {
      operators.push(c);
      i++;
    } else if (c === ')') {
      while (operators[operators.length - 1] !== '(') {
        performCalculate(numbers, operators);
      }
      operators.pop();
      i++;
    } else if (c in precedence) {
      while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[c]) {
        performCalculate(numbers, operators);
      }
      operators.push(c);
      i++;
    } else {
      let j = i;
      while (j < expression.length && !isNaN(expression[j])) {
        j++;
      }
      numbers.push(parseInt(expression.substring(i, j)));
      i = j;
    }
  }
}

function performCalculate(numbers, operators) {
  if (numbers.length < 2) throw new Error("syntax error");
  if (operators.length < 1) throw new Error("syntax error");

  let b = numbers.pop();
  let a = numbers.pop();
  let op = operators.pop();

  switch (op) {
    case '+':
      numbers.push(a + b);
      break;
    case '-':
      numbers.push(a - b);
      break;
    case '*':
      numbers.push(a * b);
      break;
    case '/':
      if (b === 0) throw new Error("dominator can't be 0");
      numbers.push(a / b);
      break;
    default:
      throw new Error("unknown operator：" + op);
  }
}


