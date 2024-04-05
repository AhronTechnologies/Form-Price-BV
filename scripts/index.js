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
  [1000]: { fee: 150, interest: 350 },
  [1500]: { fee: 225, interest: 525 },
  [2000]: { fee: 300, interest: 700 },
  [2500]: { fee: 375, interest: 875 },
  [3000]: { fee: 450, interest: 1050 },
  [3500]: { fee: 525, interest: 1225 },
  [4000]: { fee: 600, interest: 1400 },
  [4500]: { fee: 675, interest: 1575 },
  [5000]: { fee: 750, interest: 1750 },
  [6000]: { fee: 900, interest: 2100 },
  [7000]: { fee: 1050, interest: 2450 },
  [8000]: { fee: 1200, interest: 2800 },
  [9000]: { fee: 1350, interest: 3150 },
  [10000]: { fee: 1500, interest: 3500 },
  [11000]: { fee: 1650, interest: 3850 },
  [12000]: { fee: 1800, interest: 4200 },
  [13000]: { fee: 1950, interest: 4550 },
  [14000]: { fee: 2100, interest: 4900 },
  [15000]: { fee: 2250, interest: 5250 },
  [16000]: { fee: 1600, interest: 3840 },
  [18000]: { fee: 1800, interest: 4320 },
  [19000]: { fee: 1900, interest: 4560 },
  [20000]: { fee: 2000, interest: 4800 },
  [21000]: { fee: 2100, interest: 5040 },
  [22000]: { fee: 2200, interest: 5280 },
  [23000]: { fee: 2300, interest: 5520 },
  [24000]: { fee: 2400, interest: 5760 },
  [25000]: { fee: 2500, interest: 6000 },
  [26000]: { fee: 2600, interest: 6240 },
  [27000]: { fee: 2700, interest: 6480 },
  [28000]: { fee: 2800, interest: 6720 },
  [29000]: { fee: 2900, interest: 6960 },
  [30000]: { fee: 3000, interest: 7200 },
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

function recalculate() {
  const displayElems = getCalcDisplayElems();
  const FormInputs = getFormInputs();

  const amount = parseFloat(FormInputs.amount.value);

  const fees = FEES[amount];

  if (fees) {
    displayElems.amount.innerText = `${amount} Kč`;
    displayElems.interest.innerText = `${fees.interest} Kč`;
    displayElems.fee.innerText = `${fees.fee} Kč`;
    displayElems.discount.innerText = `0 Kč`;
    displayElems.total.innerText = `${amount + fees.interest + fees.fee} Kč`;
    displayElems.dueDate.innerText = new Date().toLocaleDateString();
  }
}
