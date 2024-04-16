document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loan-amount-input")
    .addEventListener("input", recalculate);

  const allowedValues = [];
  for (const [key, _] of Object.entries(FEES)) {
    allowedValues.push(key);
  }
  allowedValues.sort((a, b) => a - b);

  const slider = new Slider(
    document.getElementById("loan-amount-slider"),
    document.getElementById("loan-amount-input"),
    (value) => value + " Kč",
    (value) => {
      if (value > 15000) {
        return `${value} Kč od 2. půjčky`;
      } else {
        return undefined;
      }
    },
    allowedValues,
  );
  slider.init();

  recalculate();
});

/**
 * @typedef Fees
 * @type {object}
 * @property {number} fee
 * @property {number} interest
 * */

/**
 * @type {Fees[]}
 * */
const FEES = {
  [1000]: { fee: 288.7 , interest: 95.2 },
  [1500]: { fee: 433.05 , interest: 142.8 },
  [2000]: { fee: 577.4 , interest: 190.4 },
  [2500]: { fee: 721.75 , interest: 238 },
  [3000]: { fee: 866.1 , interest: 285.6 },
  [3500]: { fee: 1010.45 , interest: 333.2 },
  [4000]: { fee: 1154.8 , interest: 380.8 },
  [4500]: { fee: 1299.15 , interest: 428.4 },
  [5000]: { fee: 1443.5 , interest: 476 },
  [6000]: { fee: 1732.2 , interest: 571.2 },
  [7000]: { fee: 2020.9, interest: 666.4 },
  [8000]: { fee: 2309.6, interest: 761.6 },
  [9000]: { fee: 2598.3, interest: 856.8 },
  [10000]: { fee: 2887, interest: 952 },
  [11000]: { fee: 3175.7, interest: 1047.2 },
  [12000]: { fee: 3464.4, interest: 1142.4 },
  [13000]: { fee: 3753.1, interest: 1237.6 },
  [14000]: { fee: 4041.8, interest: 1332.8 },
  [15000]: { fee: 4330.5, interest: 1428 },
  [16000]: { fee: 4619.2, interest: 1523.2 },
  [18000]: { fee: 5196.6, interest: 1713.6 },
  [19000]: { fee: 5485.3, interest: 1808.8 },
  [20000]: { fee: 5774, interest: 1904 },
  [21000]: { fee: 6062.7, interest: 1999.2 },
  [22000]: { fee: 6351.4, interest: 2094.4 },
  [23000]: { fee: 6640.1, interest: 2189.6 },
  [24000]: { fee: 6928.8, interest: 2284.8 },
  [25000]: { fee: 7217.5, interest: 2380 },
  [26000]: { fee: 7506.2, interest: 2475.2 },
  [27000]: { fee: 7794.9, interest: 2570.4 },
  [28000]: { fee: 8083.6, interest: 2665.6 },
  [29000]: { fee: 8372.3, interest: 2760.8 },
  [30000]: { fee: 8661, interest: 2856 },
};

/**
 * @typedef CalcDisplayElems
 * @type {object}
 * @property {HTMLElement} amount
 * @property {HTMLElement} dueDate
 * @property {HTMLElement} interest
 * @property {HTMLElement} fee
 * @property {HTMLElement} discount
 * @property {HTMLElement} total
 * */

/**
 * @returns {CalcDisplayElems}
 * */
function getCalcDisplayElems() {
  return {
    amount: document.getElementById("calc-amount"),
    dueDate: document.getElementById("calc-due-date"),
    interest: document.getElementById("calc-interest"),
    fee: document.getElementById("calc-fee"),
    discount: document.getElementById("calc-discount"),
    total: document.getElementById("calc-total"),
  };
}

/**
 * @typedef FormInputs
 * @type {object}
 * @property {HTMLInputElement} amount
 * */

/**
 * @returns {FormInputs}
 * */
function getFormInputs() {
  return {
    amount: document.getElementById("loan-amount-input"),
  };
}

function formatNumberWithSpaces(number) {
  
  let numberString = number.toString();
  
  
  let parts = numberString.split(".");
  let integerPart = parts[0];
  let decimalPart = parts[2] || "";
  
  
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  
  let formattedNumber = integerPart;
  if (decimalPart !== "") {
      formattedNumber += "." + decimalPart;
  }
  
  return formattedNumber;
}



const number = 1244;
const formattedNumber = formatNumberWithSpaces(number);
console.log(formattedNumber); 

function recalculate() {
  const displayElems = getCalcDisplayElems();
  const FormInputs = getFormInputs();

  const amount = parseFloat(FormInputs.amount.value);

  const fees = FEES[amount];

  if (fees) {
    displayElems.amount.innerText = `${formatNumberWithSpaces(amount)} Kč`;
displayElems.interest.innerText = `${formatNumberWithSpaces(fees.interest)} Kč`;
displayElems.fee.innerText = `${formatNumberWithSpaces(fees.fee)} Kč`;
const total = amount + fees.interest + fees.fee;
displayElems.total.innerText = `${formatNumberWithSpaces(total)} Kč`;



    displayElems.discount.innerText = `0 Kč`;

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);
    displayElems.dueDate.innerText = dueDate.toLocaleDateString();
  }
}
