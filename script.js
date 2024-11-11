const backendUrl = 'https://backend-repo-0k18.onrender.com';

document.addEventListener('DOMContentLoaded', function() {
    const loginSection = document.getElementById('login');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const switchToSignupButton = document.getElementById('switch-to-signup');
    const switchToLoginButton = document.getElementById('switch-to-login');
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const footer = document.querySelector('footer');

    const placeOrderButton = document.getElementById('place-order');
    const orderSummary = document.getElementById('order-summary');
    const orderDetails = document.getElementById('order-details');
    const totalBillElement = document.getElementById('total-bill');
    const advanceOrderCheckbox = document.getElementById('advanceOrderCheckbox');
    const qrCodeContainer = document.getElementById('qr-code-container');

    let extraCharge = 50; // Fixed ₹50 extra charge for advance order
    let baseBillAmount = 0; // Initialize base bill amount

    // Show the login section initially
    loginSection.style.display = 'block';

    // Switch between login and signup forms
    switchToSignupButton.addEventListener('click', function() {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        switchToSignupButton.classList.add('hidden');
        switchToLoginButton.classList.remove('hidden');
    });

    switchToLoginButton.addEventListener('click', function() {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        switchToSignupButton.classList.remove('hidden');
        switchToLoginButton.classList.add('hidden');
    });

    // Load and display saved orders on page load
    function loadPastOrders() {
        const pastOrders = JSON.parse(localStorage.getItem('pastOrders')) || [];
        if (pastOrders.length > 0) {
            const lastOrder = pastOrders[pastOrders.length - 1]; // Display latest order
            orderSummary.classList.remove('hidden');
            orderDetails.innerHTML = lastOrder.items.map(item => `
                <p>${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>
            `).join('');

            // Display total bill with any extra charge included
            let finalAmount = lastOrder.total;
            if (lastOrder.isAdvanceOrder) {
                finalAmount += extraCharge;
            }
            totalBillElement.textContent = ₹${finalAmount.toFixed(2)};
        } else {
            orderSummary.classList.add('hidden');
        }
    }

    // Event listener for advance order checkbox
    advanceOrderCheckbox.addEventListener('change', () => {
        const isAdvanceOrder = advanceOrderCheckbox.checked;
        localStorage.setItem('isAdvanceOrder', isAdvanceOrder);

        // Update QR code visibility
        if (isAdvanceOrder) {
            qrCodeContainer.classList.remove('hidden');
        } else {
            qrCodeContainer.classList.add('hidden');
        }
    });

    // Update and save order details in localStorage
    async function saveOrder(items, total, isAdvanceOrder) {
        const pastOrders = JSON.parse(localStorage.getItem('pastOrders')) || [];
        const newOrder = { items, total, isAdvanceOrder };
        pastOrders.push(newOrder);
        localStorage.setItem('pastOrders', JSON.stringify(pastOrders));
    }

    // Place Order button click event
    placeOrderButton.addEventListener('click', async function() {
        const items = [];
        let totalBill = 0;

        // Gather selected items and calculate the base total
        document.querySelectorAll('input[name="items"]:checked').forEach(itemCheckbox => {
            const itemName = itemCheckbox.value;
            const itemPrice = parseFloat(itemCheckbox.getAttribute('data-price'));
            const itemQuantity = parseInt(document.querySelector(input[name="${itemName.replace(' ', '_')}_quantity"]).value);
            items.push({ name: itemName, price: itemPrice, quantity: itemQuantity });
            totalBill += itemPrice * itemQuantity;
        });

        // Check if advance order is selected and add extra charge if so
        const isAdvanceOrder = advanceOrderCheckbox.checked;
        if (isAdvanceOrder) {
            totalBill += extraCharge;
            alert("A ₹50 extra charge has been applied for using the advance order feature.");
        }

        // Display the order summary
        orderSummary.classList.remove('hidden');
        orderDetails.innerHTML = items.map(item => 
            <p>${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>
        ).join('');
        totalBillElement.textContent = ₹${totalBill.toFixed(2)};

        // Save the order in local storage
        await saveOrder(items, totalBill, isAdvanceOrder);

        // Reset advance order checkbox and UI elements after placing the order
        advanceOrderCheckbox.checked = false;
        qrCodeContainer.classList.add('hidden');
    });

    // Load saved advance order status and past orders on page load
    if (localStorage.getItem('isAdvanceOrder') === 'true') {
        advanceOrderCheckbox.checked = true;
        qrCodeContainer.classList.remove('hidden');
    }

    loadPastOrders(); // Initialize past orders display
});
