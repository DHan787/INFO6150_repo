/*
 * @Author: Jiang Han
 * @Date: 2025-03-14 17:13:30
 * @Description: 
 */
// document.addEventListener("DOMContentLoaded", function () {
//     const exchangeRates = {
//         "USD": { "USD": 1, "EUR": 0.91, "CNY": 7.1 },
//         "EUR": { "USD": 1.1, "EUR": 1, "CNY": 7.8 },
//         "CNY": { "USD": 0.14, "EUR": 0.13, "CNY": 1 }
//     };

//     function updateAmount2() {
//         const currency1 = document.getElementById("currencyCode1").value;
//         const currency2 = document.getElementById("currencyCode2").value;
//         const amount1 = parseFloat(document.getElementById("amount1").value) || 0;

//         const rate = exchangeRates[currency1][currency2];
//         document.getElementById("amount2").value = (amount1 * rate).toFixed(2);
//     }

//     document.getElementById("amount1").addEventListener("input", updateAmount2);
//     document.getElementById("currencyCode1").addEventListener("change", updateAmount2);
//     document.getElementById("currencyCode2").addEventListener("change", updateAmount2);
// });

document.addEventListener("DOMContentLoaded", function () {

    async function fetchCurrencyCodes() {
        const url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json";
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching currency codes:", error);
            return {};
        }
    }

    async function populateCurrencyCodes() {
        const currencySets = await fetchCurrencyCodes();
        const select1 = document.getElementById("currencyCode1");
        const select2 = document.getElementById("currencyCode2");

        const sortedCurrencies = Object.entries(currencySets)
            .map(([code, name]) => ({ code: code.toUpperCase(), name }))
            .sort((a, b) => a.code.localeCompare(b.code));


        sortedCurrencies.forEach(({ code, name }) => {
            const option1 = document.createElement("option");
            option1.value = code;
            option1.textContent = `${code.toUpperCase()} - ${name}`;
            select1.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = code;
            option2.textContent = `${code.toUpperCase()} - ${name}`;
            select2.appendChild(option2);
        }
        );
    }

    async function fetchExchangeRate(fromCurrency, toCurrency) {
        console.log("fetchExchangeRate", fromCurrency, toCurrency);
        const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
        } catch (error) {
            console.error("Error fetching exchange rate:", error);
            return 1;
        }

    }

    async function updateAmount2() {
        const fromCurrency = document.getElementById("currencyCode1").value;
        const toCurrency = document.getElementById("currencyCode2").value;
        const amount1 = parseFloat(document.getElementById("amount1").value) || 0;
        // debugger;

        if (fromCurrency === toCurrency) {
            document.getElementById("amount2").value = amount1.toFixed(2);
            return;
        }

        const rate = await fetchExchangeRate(fromCurrency, toCurrency);
        document.getElementById("amount2").value = (amount1 * rate).toFixed(2);
    }

    //swap
    document.getElementById("swapButton").addEventListener("click", function () {
        const select1 = document.getElementById("currencyCode1");
        const select2 = document.getElementById("currencyCode2");
        const temp = select1.value;
        select1.value = select2.value;
        select2.value = temp;
        updateAmount2();
    });

    document.getElementById("amount1").addEventListener("input", updateAmount2);
    document.getElementById("currencyCode1").addEventListener("change", updateAmount2);
    document.getElementById("currencyCode2").addEventListener("change", updateAmount2);

    updateAmount2();
    populateCurrencyCodes();

});
