document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        // Get input values
        const name = form.querySelector('input[name="Name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const message = form.querySelector('textarea[name="message"]').value;

        // Display the message on the screen
        const output = document.getElementById('output1');
        output.textContent = `Name: ${name}, Email: ${email}, Message: ${message}`;

        // Clear form inputs
        form.reset();
    });
});
