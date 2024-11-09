
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
    const tokenNumberElement = document.getElementById('token-number');

    // Show the login section initially
    loginSection.style.display = 'block';

    // Switch to Sign Up Form
    switchToSignupButton.addEventListener('click', function() {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        switchToSignupButton.classList.add('hidden');
        switchToLoginButton.classList.remove('hidden');
    });

    // Switch to Login Form
    switchToLoginButton.addEventListener('click', function() {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        switchToSignupButton.classList.remove('hidden');
        switchToLoginButton.classList.add('hidden');
    });

    // Function to show all sections
    function showSections() {
        header.classList.remove('hidden');
        sections.forEach(section => section.classList.remove('hidden'));
        footer.classList.remove('hidden');
    }

// Place Order Button Click Event
    placeOrderButton.addEventListener('click', async function() {
        const items = [];
        let totalBill = 0;
    
        document.querySelectorAll('input[name="items"]:checked').forEach(itemCheckbox => {
            const itemName = itemCheckbox.value;
            const itemPrice = parseFloat(itemCheckbox.getAttribute('data-price'));
            const itemQuantity = parseInt(document.querySelector(`input[name="${itemName.replace(' ', '_')}_quantity"]`).value);
            items.push({ name: itemName, price: itemPrice, quantity: itemQuantity });
            totalBill += itemPrice * itemQuantity;
        });
    
        const response = await fetch(`${backendUrl}/place-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ items, totalAmount: totalBill }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            orderSummary.classList.remove('hidden');
            document.getElementById('menu').classList.add('hidden');
    
            orderDetails.innerHTML = items.map(item => `<p>${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>`).join('');

            totalBillElement.textContent = totalBill.toFixed(2);
            // tokenNumberElement.textContent = data.tokenNumber;
        } else {
            alert('Error placing order: ' + data.message);
        }
    });
});





document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password: password }),
    });

    const data = await response.json();

    if (response.ok) {
        alert(data.message);  // Show the message from backend (either with saved orders or no orders)
        localStorage.setItem('token', data.token);
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('login').classList.add('hidden');

        // If user has orders, show them
        if (data.orders.length > 0) {
            const orderSummary = document.getElementById('order-summary');
            const orderDetails = document.getElementById('order-details');
            const totalBillElement = document.getElementById('total-bill');
            const tokenNumberElement = document.getElementById('token-number');

            orderSummary.classList.remove('hidden');
            orderDetails.innerHTML = data.orders.map(order =>
                order.items.map(item => `<p>${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>`).join('')
            ).join('<br/>');
            totalBillElement.textContent = data.orders.reduce((acc, order) => acc + order.totalAmount, 0).toFixed(2);
            // tokenNumberElement.textContent = data.orders.map(order => order.tokenNumber).join(', ');
        }
    } else {
        alert(data.message);
    }
});



document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;

    const response = await fetch(`${backendUrl}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        alert('Signup successful!');
        // Store the token and redirect to the main content
        localStorage.setItem('token', data.token);
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('login').classList.add('hidden');
    } else {
        alert(data.message);
    }
});

// Elements
const advanceOrderCheckbox = document.getElementById('advanceOrderCheckbox');
const qrCodeContainer = document.getElementById('qr-code-container');
const totalBillElement = document.getElementById('total-bill');
const placeOrderBtn = document.getElementById('place-order');
let isAdvanceOrder = false;

// Check if user selects advance order feature
advanceOrderCheckbox.addEventListener('change', function () {
    if (advanceOrderCheckbox.checked) {
        qrCodeContainer.classList.remove('hidden'); // Show QR code
        sessionStorage.setItem('isAdvanceOrder', true); // Mark as advance order
        isAdvanceOrder = true;
    } else {
        qrCodeContainer.classList.add('hidden'); // Hide QR code
        sessionStorage.setItem('isAdvanceOrder', false); // Reset advance order
        isAdvanceOrder = false;
    }
});

// Function to Calculate Total Bill
function calculateTotalBill(baseAmount) {
    let finalAmount = baseAmount;

    // Apply 10% extra charge if advance order is used
    if (sessionStorage.getItem('isAdvanceOrder') === 'true') {
        const extraCharge = 0.1 * baseAmount; // 10% extra charge
        finalAmount += extraCharge;

        alert("A 10% extra charge has been applied for using the advance order feature.");
    }

    // Update total bill on the screen
    totalBillElement.textContent = finalAmount.toFixed(2);
}

// Place Order button logic
placeOrderBtn.addEventListener('click', function () {
    const baseAmount = parseFloat(totalBillElement.textContent) || 0; // Use current total bill as base amount
    calculateTotalBill(baseAmount);

    // Thank you message after placing order
    alert("Thank you for placing your order! Your total bill is ₹" + totalBillElement.textContent);

    // Reset advance order state after placing the order
    sessionStorage.setItem('isAdvanceOrder', false);
    advanceOrderCheckbox.checked = false;
    qrCodeContainer.classList.add('hidden'); // Hide QR code after order is placed
});





















// main
document.addEventListener('DOMContentLoaded', () => {
    const orderDetails = document.getElementById("order-details");
    const totalBill = document.getElementById("total-bill");
    const orderStatus = document.getElementById("order-status");
    const orderSummarySection = document.getElementById("order-summary");
    const updateStatusButton = document.getElementById("markDelivered");
    const placeOrderButton = document.getElementById("place-order");

    // Verify elements exist before proceeding
    if (!orderDetails || !totalBill || !orderStatus || !orderSummarySection || !updateStatusButton || !placeOrderButton) {
        console.error("One or more required elements are missing in the HTML.");
        return;
    }

    // Load and display past orders
    function loadPastOrders() {
        const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];

        if (pastOrders.length > 0) {
            const lastOrder = pastOrders[pastOrders.length - 1]; // Show the latest order
            orderSummarySection.classList.remove("hidden");

            // Display order details with ₹ sign
            orderDetails.innerHTML = lastOrder.items.map(item => `
                <p>${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>
            `).join('');

            // Update total bill and order status
            totalBill.textContent = `₹${lastOrder.total}`;
            orderStatus.textContent = lastOrder.status || "Pending";

            // Show or hide "Mark as Delivered" button based on order status
            if (lastOrder.status === "Pending") {
                updateStatusButton.classList.remove("hidden");
            } else {
                updateStatusButton.classList.add("hidden");
            }
        } else {
            orderSummarySection.classList.add("hidden");
        }
    }

  

//   Event listener for "Mark as Delivered" button
updateStatusButton?.addEventListener("click", () => {
    const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];
    if (pastOrders.length > 0) {
        const lastOrder = pastOrders[pastOrders.length - 1];
        
        // Only update if the status is currently 'Pending'
        if (lastOrder.status === "Pending") {
            lastOrder.status = "Delivered";
            localStorage.setItem("pastOrders", JSON.stringify(pastOrders));

            // Reload orders to reflect the new status
            loadPastOrders();
            alert("Order status updated to Delivered!");
        } else {
            alert("Order is already marked as Delivered!");
        }
    }
});
  // Load past orders on page load
  document.addEventListener("DOMContentLoaded", loadPastOrders);

    // Initialize past orders display on page load
    loadPastOrders();
});



