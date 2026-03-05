class Calculator {
    constructor(displayElement, historyElement) {
        this.display = displayElement;
        this.historyElement = historyElement;
        this.currentExpression = "";
        this.history = JSON.parse(localStorage.getItem("calcHistory")) || [];
        this.init();
    }

    init() {
        this.renderButtons();
        this.loadHistory();
        document.getElementById("clearHistory")
            .addEventListener("click", () => this.clearHistory());
        document.addEventListener("keydown", (e) => this.handleKeyboard(e));
    }

    renderButtons() {
        const buttonsContainer = document.getElementById("buttons");
        const buttons = [
            "C", "⌫", "%", "/",
            "7", "8", "9", "*",
            "4", "5", "6", "-",
            "1", "2", "3", "+",
            "0", ".", "="
        ];

        buttons.forEach(btn => {
            const button = document.createElement("button");
            button.textContent = btn;

            if (["/", "*", "-", "+", "%"].includes(btn))
                button.classList.add("operator");
            if (btn === "=")
                button.classList.add("equal");
            if (btn === "C")
                button.classList.add("clear");

            button.addEventListener("click", () => this.handleInput(btn));
            buttonsContainer.appendChild(button);
        });
    }

    handleInput(value) {
        if (value === "C") {
            this.currentExpression = "";
        } else if (value === "⌫") {
            this.currentExpression = this.currentExpression.slice(0, -1);
        } else if (value === "=") {
            this.calculate();
            return;
        } else {
            this.currentExpression += value;
        }
        this.updateDisplay();
    }

    calculate() {
        try {
            const result = Function('"use strict";return (' + this.currentExpression + ')')();
            this.addToHistory(`${this.currentExpression} = ${result}`);
            this.currentExpression = result.toString();
        } catch {
            this.currentExpression = "Error";
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.value = this.currentExpression;
    }

    addToHistory(entry) {
        this.history.unshift(entry);
        localStorage.setItem("calcHistory", JSON.stringify(this.history));
        this.loadHistory();
    }

    loadHistory() {
        this.historyElement.innerHTML = "";
        this.history.forEach(item => {
            const div = document.createElement("div");
            div.textContent = item;
            this.historyElement.appendChild(div);
        });
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem("calcHistory");
        this.loadHistory();
    }

    handleKeyboard(e) {
        if (!isNaN(e.key) || "+-*/.%".includes(e.key)) {
            this.currentExpression += e.key;
        }
        if (e.key === "Enter") this.calculate();
        if (e.key === "Backspace")
            this.currentExpression = this.currentExpression.slice(0, -1);
        this.updateDisplay();
    }
}

new Calculator(
    document.getElementById("display"),
    document.getElementById("history")
);