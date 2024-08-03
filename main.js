const select = (item) => document.querySelector(item);

const AMOUNT_INPUT = select("#amount");
const TERM_INPUT = select("#term");
const RATE_INPUT = select("#rate");
const TYPE_INPUTS = document.querySelectorAll(
  'input[type="radio"][name="type"]'
);
const CLEAR_ALL = select(".clearAll");
const ARTICLE_EMPTY_RESULTS = select(".articleEmptyResults");
const ARTICLE_RESULTS = select(".articleResults");
const FORM_BTN = select(".formBtn");
const MONTHLY_REPAYMENTS = select(".articleResults-monthlyRepayments--value");
const TOTAL_REPAYMENT = select(".articleResults-totalRepay--value");

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

  let typeValue = "";

  TYPE_INPUTS.forEach((input) => {
    if (input.checked) {
      typeValue = input.value;
    }
  });

  const errorRequiredText = "This field is required";

  let hasError = false;
  if (isNaN(amountValue) || amountValue <= 0) {
    select(".form-input-wrapper--amount").classList.add("errorRequired");
    select(".amountErrorText").textContent = errorRequiredText;
    hasError = true;
  } else {
    select(".form-input-wrapper--amount").classList.remove("errorRequired");
    select(".amountErrorText").textContent = "";
  }

  if (isNaN(termValue) || termValue <= 0) {
    select(".form-input-wrapper--term").classList.add("errorRequired");
    select(".termErrorText").textContent = errorRequiredText;
    hasError = true;
  } else {
    select(".form-input-wrapper--term").classList.remove("errorRequired");
    select(".termErrorText").textContent = "";
  }

  // Rate can be 0 
  if (isNaN(rateValue) || rateValue < 0) {
    select(".form-input-wrapper--rate").classList.add("errorRequired");
    select(".rateErrorText").textContent = errorRequiredText;
    hasError = true;
  } else {
    select(".form-input-wrapper--rate").classList.remove("errorRequired");
    select(".rateErrorText").textContent = "";
  }

  if (typeValue === "") {
    select(".typeErrorText").textContent = errorRequiredText;
    hasError = true;
  } else {
    select(".typeErrorText").textContent = "";
  }

  if (hasError) {
    ARTICLE_RESULTS.classList.add("hidden");
    ARTICLE_EMPTY_RESULTS.classList.remove("hidden");
    return;
  }

  const monthlyRate = rateValue / 12 / 100;
  const numberOfPayments = termValue * 12;

  let monthlyRepayment, overTermRepayment, overTermInterest;

  if (monthlyRate > 0) {
    monthlyRepayment =
      (amountValue * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    overTermRepayment = monthlyRepayment * numberOfPayments;
    overTermInterest = overTermRepayment - amountValue;
  } else {
    monthlyRepayment = amountValue / numberOfPayments;
    overTermRepayment = amountValue;
    overTermInterest = 0;
  }

  const monthlyInterest = amountValue * monthlyRate;

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
};

FORM_BTN.addEventListener("click", calculateValues);
