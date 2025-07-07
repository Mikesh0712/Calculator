let history = [];
let mode = "DEG";
let lastAnswer = "";

function insert(value) {
  const input = document.getElementById("expression");
  const cursorPos = input.selectionStart;
  const before = input.value.slice(0, cursorPos);
  const after = input.value.slice(cursorPos);
  input.value = before + value + after;
  input.focus();
  input.setSelectionRange(cursorPos + value.length, cursorPos + value.length);
}

function insertAns() {
  insert(lastAnswer);
}

function clearDisplay() {
  const input = document.getElementById("expression");
  input.value = "";
  updateDisplay("0");
}

function updateDisplay(result = "") {
  document.getElementById("result").innerText = result !== "" ? "= " + result : "=";
}

function factorial(n) {
  if (n < 0) return NaN;
  let f = 1;
  for (let i = 1; i <= n; i++) f *= i;
  return f;
}

function toggleMode() {
  mode = mode === "DEG" ? "RAD" : "DEG";
  document.getElementById("toggleMode").innerText = mode;
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  document.getElementById("themeToggle").innerText = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function calculate() {
  const input = document.getElementById("expression");
  let expr = input.value;

  try {
    const original = expr;
    expr = expr
      .replace(/pi/g, Math.PI)
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/(\\d+)!/g, (_, n) => factorial(parseInt(n)))
      .replace(/\^/g, "**");

    if (mode === "DEG") {
      expr = expr
        .replace(/Math\.sin\(([^)]+)\)/g, (_, a) => `Math.sin((${a}) * Math.PI / 180)`)
        .replace(/Math\.cos\(([^)]+)\)/g, (_, a) => `Math.cos((${a}) * Math.PI / 180)`)
        .replace(/Math\.tan\(([^)]+)\)/g, (_, a) => `Math.tan((${a}) * Math.PI / 180)`);
    }

    const result = eval(expr);
    lastAnswer = result;
    updateDisplay(result);
    addToHistory(original + " = " + result);
    input.value = result.toString();
  } catch (err) {
    updateDisplay("Error");
  }
}

function addToHistory(entry) {
  history.unshift(entry);
  if (history.length > 10) history.pop();
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.onclick = () => {
      document.getElementById("expression").value = item.split(" = ")[0];
    };
    list.appendChild(li);
  });
}

function toggleHistory() {
  const panel = document.getElementById("historyPanel");
  panel.style.display = panel.style.display === "none" ? "flex" : "none";
}

function clearHistory() {
  history = [];
  renderHistory();
}

window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeToggle").innerText = "☀️";
  }
  updateDisplay("0");
};
