/*
 * @Author: Jiang Han
 * @Date: 2025-03-12 16:39:48
 * @Description: 
 */
// The page contains a form with the following fields and requirements:

// Name: a string of at least three characters, required.
// "Required" means: there must be a value in this field for the form to be submitted.
// Year of birth: an integer number greater than 1900 and smaller than the current year, required.
// A checkbox: "Do you live in the United States?"
// Zipcode: A 5 - digit number.
// If the previous checkbox is not checked, the zipcode field does not appear.
// If the previous checkbox is checked, the zipcode field appears and is required.
//     Password: a string with at least 8 characters.Its contents must be masked using the correct input type.
//         Preferred type of pizza: one of three choices, either "With pineapple", "Without pineapple", or "I do not like pizza".Only one choice can be selected, and a selection is required. 
// When the "submit" button for the form is clicked, the page must run a script to validate all of the above.

// Error messages should show up on the page for each validation error.
// The page should show an "Accepted" message if the form is submitted without validation errors.
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const usResident = document.getElementById('usResident');
    const zipcodeField = document.getElementById('zipcodeField');

    // show/hide zipcode field based on US resident checkbox
    usResident.addEventListener('change', function () {
        if (this.checked) {
            zipcodeField.classList.remove('hidden');
        } else {
            zipcodeField.classList.add('hidden');
            document.getElementById('zipcode').value = '';
            document.getElementById('zipcodeError').textContent = '';
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous error messages
        document.getElementById('nameError').textContent = '';
        document.getElementById('yearError').textContent = '';
        document.getElementById('zipcodeError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        document.getElementById('pizzaError').textContent = '';
        document.getElementById('acceptedMessage').classList.add('hidden');

        let isValid = true;
        const currentYear = new Date().getFullYear();

        // Validate Name (at least 3 characters)
        const nameValue = document.getElementById('name').value.trim();
        if (nameValue.length < 3) {
            document.getElementById('nameError').textContent = 'Name must be at least 3 characters.';
            isValid = false;
        }

        // Validate Year of Birth (required, number, >1900 and <= current year)
        const yearValue = document.getElementById('yearOfBirth').value.trim();
        if (!yearValue) {
            document.getElementById('yearError').textContent = 'Year of Birth is required.';
            isValid = false;
        } else {
            const yearNum = parseInt(yearValue, 10);
            if (isNaN(yearNum)) {
                document.getElementById('yearError').textContent = 'Year of Birth must be a valid number.';
                isValid = false;
            } else if (yearNum <= 1900 || yearNum > currentYear) {
                document.getElementById('yearError').textContent =
                    'Year of Birth must be greater than 1900 and less than ' + currentYear + '.';
                isValid = false;
            } else if (yearNum.toString() !== yearValue) {
                document.getElementById('yearError').textContent = 'Your Year of Birth must be an integer.';
                isValid = false;
                debugger;
            }
        }

        // Validate Zipcode (if US resident, required and must be a 5-digit number)
        if (usResident.checked) {
            const zipcodeValue = document.getElementById('zipcode').value.trim();
            if (!zipcodeValue) {
                document.getElementById('zipcodeError').textContent = 'Zipcode is required.';
                isValid = false;
            } else if (!/^\d{5}$/.test(zipcodeValue)) {
                document.getElementById('zipcodeError').textContent = 'Zipcode must be a 5-digit number.';
                isValid = false;
            }
        }

        // Validate Password (at least 8 characters)
        const passwordValue = document.getElementById('password').value;
        if (passwordValue.length < 8) {
            document.getElementById('passwordError').textContent = 'Password must be at least 8 characters.';
            isValid = false;
        }

        // Validate Pizza Preference (at least one must be selected)
        const pizzaOptions = document.getElementsByName('pizza');
        let pizzaSelected = false;
        for (let i = 0; i < pizzaOptions.length; i++) {
            if (pizzaOptions[i].checked) {
                pizzaSelected = true;
                break;
            }
        }
        if (!pizzaSelected) {
            document.getElementById('pizzaError').textContent = 'Please select your preferred type of pizza.';
            isValid = false;
        }

        // If all validations pass, show the accepted message
        if (isValid) {
            document.getElementById('acceptedMessage').classList.remove('hidden');
            // Optionally clear the form or process the data further.
        }
    });
});