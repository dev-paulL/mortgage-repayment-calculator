const AMOUNT_INPUT = document.querySelector("#amount");
const TERM_INPUT = document.querySelector("#term");
const RATE_INPUT = document.querySelector("#rate");
const TYPE_INPUTS = document.querySelectorAll(
  'input[type="radio"][name="type"]'
);
const CLEAR_ALL = document.querySelector(".clearAll");
const ARTICLE_EMPTY_RESULTS = document.querySelector(".articleEmptyResults");
const ARTICLE_RESULTS = document.querySelector(".articleResults");
const FORM_BTN = document.querySelector(".formBtn");
const MONTHLY_REPAYMENTS = document.querySelector(
  ".articleResults-monthlyRepayments--value"
);
const TOTAL_REPAYMENT = document.querySelector(
  ".articleResults-totalRepay--value"
);

CLEAR_ALL.addEventListener("click", () => {
  document
    .querySelectorAll("input")
    .forEach((i) => (i.type === "radio" ? (i.checked = false) : (i.value = 0)));
});

/* Loan Payment = Amount x (Interest Rate/12) */

/* P = A x I

For example, if your interest rate is 6 percent, you would divide 0.06 by 12 to get a monthly rate of 0.005. 
You would then multiply this number by the amount of your loan to calculate your loan payment. 
If your loan amount is $100,000, you would multiply $100,000 by 0.005 for a monthly payment of $500. */

/* 
For a fixed-rate loan, the formula for the monthly repayment is:

𝑀
=
𝑃
⋅
𝑟
1
−
(
1
+
𝑟
)
−
𝑛
M= 
1−(1+r) 
−n
 
P⋅r
​
 

Where:

𝑀
M is the monthly repayment.
𝑃
P is the loan principal (amountValue).
𝑟
r is the monthly interest rate.
𝑛
n is the total number of payments. */
const calculateValues = () => {
  const amountValue = parseFloat(AMOUNT_INPUT.value);
  const termValue = parseFloat(TERM_INPUT.value);
  const rateValue = parseFloat(RATE_INPUT.value);
  let typeValue;

  TYPE_INPUTS.forEach((input) => {
    if (input.checked) {
      typeValue = input.value;
    }
  });

  if (amountValue > 0 && termValue > 0 && rateValue && typeValue != "") {
    // Check comment above for formulas
    const monthlyRate = rateValue / 12 / 100;
    const numberOfPayments = termValue * 12;

    const repaymentFactor = monthlyRate
      ? 1 - Math.pow(1 + monthlyRate, -numberOfPayments)
      : 1;
    const monthlyRepayment = (amountValue * monthlyRate) / repaymentFactor;
    const monthlyInterest = amountValue * monthlyRate;

    const overTermRepayment = monthlyRepayment * numberOfPayments;
    const overTermInterest = overTermRepayment - amountValue;

    ARTICLE_RESULTS.classList.remove("hidden");
    MONTHLY_REPAYMENTS.textContent =
      typeValue === "repayment"
        ? "£" + monthlyRepayment.toFixed(2)
        : typeValue === "interestOnly"
        ? "£" + monthlyInterest.toFixed(2)
        : "";
    TOTAL_REPAYMENT.textContent =
      typeValue === "repayment"
        ? "£" + overTermRepayment.toFixed(2)
        : typeValue === "interestOnly"
        ? "£" + overTermInterest.toFixed(2)
        : "";

    ARTICLE_EMPTY_RESULTS.classList.add("hidden");
  } else {
    alert("Please Fill the form");
  }
};

FORM_BTN.addEventListener("click", calculateValues);
