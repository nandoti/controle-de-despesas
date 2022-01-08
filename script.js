const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const removeTransaction = (ID) => {
  transactions = transactions.filter(
    (transaction) => transaction.id !== ID
  );
  updateLocalStorage();
  init();
};

const addTransactionIntoDOM = (transaction) => {
  const operator = transaction.amount < 0 ? "-" : "+";
  const CSSClass = transaction.amount < 0 ? "minus" : "plus";
  const amountWithouOperator = Math.abs(transaction.amount);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `
    ${transaction.name} 
    <span>${operator} R$ ${amountWithouOperator}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
    x
    </button>
    `;

  transactionsUl.append(li);
};

// Transações

const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(
    (transaction) => transaction.amount
  );
  const total = transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);
  const income = transactionAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);
  const expense = Math.abs(
    transactionAmounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

const init = () => {
  transactionsUl.innerHTML = "";
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

init();

const updateLocalStorage =() => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

//Função para ID aleatórios

const generateID = () => Math.round(Math.random() * 1000)

//Adicionar transação

form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();

  if (transactionName === "" || transactionAmount === "") {
    alert("Por favor, preencha todos os campos");
    return;
  }
  const transaction = {
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  };

  transactions.push(transaction)
  init()
  updateLocalStorage()

  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
});
