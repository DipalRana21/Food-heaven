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
         

            orderSummary.classList.remove('hidden');
            orderDetails.innerHTML = data.orders.map(order =>
                order.items.map(item => `<p>${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>`).join('')
            ).join('<br/>');
            totalBillElement.textContent = data.orders.reduce((acc, order) => acc + order.totalAmount, 0).toFixed(2);
           
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
// const advanceOrderCheckbox = document.getElementById('advanceOrderCheckbox');
// const qrCodeContainer = document.getElementById('qr-code-container');
// const totalBillElement = document.getElementById('total-bill');
// const placeOrderBtn = document.getElementById('place-order');
// const qrCodeImage = document.getElementById('qr-code-img'); // Assuming this is your QR code image
// let isAdvanceOrder = false;

// // Generate QR Code URL with advanceOrder=true
// const menuURL = "https://dipalrana21.github.io/Food-heaven/#menu?advanceOrder=true";

// // QR Code setup for Advance Order
// advanceOrderCheckbox.addEventListener('change', function () {
//     if (advanceOrderCheckbox.checked) {
//         // Show QR code
//         qrCodeContainer.classList.remove('hidden');
//         sessionStorage.setItem('isAdvanceOrder', true);
//         isAdvanceOrder = true;

//         // Update QR code image src (make sure this QR code directs to menuURL)
//         qrCodeImage.src = "img/qr-code-menu.png"; // Replace with your actual QR code image source
//     } else {
//         // Hide QR code
//         qrCodeContainer.classList.add('hidden');
//         sessionStorage.setItem('isAdvanceOrder', false);
//         isAdvanceOrder = false;
//     }
// });



// // Function to calculate total bill with 10% charge if advance order is selected
// function calculateTotalBill(baseAmount) {
//     let finalAmount = baseAmount;

//     if (sessionStorage.getItem('isAdvanceOrder') === 'true') {
//         const extraCharge = 0.1 * baseAmount;
//         finalAmount += extraCharge;
//         alert("A 10% extra charge has been applied for using the advance order feature.");
//     }

//     // Update total bill
//     totalBillElement.textContent = finalAmount.toFixed(2);
// }

// // Place Order button logic
// placeOrderBtn.addEventListener('click', function () {
//     const baseAmount = parseFloat(totalBillElement.textContent) || 0;
//     calculateTotalBill(baseAmount);

//     alert("Thank you for placing your order! Your total bill is ₹" + totalBillElement.textContent);

//     // Reset advance order state
//     sessionStorage.setItem('isAdvanceOrder', false);
//     advanceOrderCheckbox.checked = false;
//     qrCodeContainer.classList.add('hidden');
// });


// Get necessary DOM elements
const advanceOrderCheckbox = document.getElementById('advanceOrderCheckbox');
const qrCodeContainer = document.getElementById('qr-code-container');
const totalBillElement = document.getElementById('total-bill');
const placeOrderBtn = document.getElementById('place-order');

// Initialize variables
let baseBillAmount = parseFloat(totalBillElement.textContent) || 0;
let extraCharge = 50; // Fixed ₹50 extra charge
let isAdvanceOrder = false; // Track the state of advance order

// Function to update total bill on the screen
function updateTotalBill() {
    let currentBill = baseBillAmount;
    if (isAdvanceOrder) {
        currentBill += extraCharge;
    }
    totalBillElement.textContent = currentBill.toFixed(2);
}

// Load state from session on page load
window.addEventListener('DOMContentLoaded', () => {
    // Check if advance order was previously selected
    isAdvanceOrder = sessionStorage.getItem('isAdvanceOrder') === 'true';

    // Set checkbox state based on stored value
    advanceOrderCheckbox.checked = isAdvanceOrder;
    qrCodeContainer.classList.toggle('hidden', !isAdvanceOrder);

    // Update the total bill based on the stored state
    updateTotalBill();
});

// Event listener for advance order checkbox
advanceOrderCheckbox.addEventListener('change', () => {
    isAdvanceOrder = advanceOrderCheckbox.checked;
    sessionStorage.setItem('isAdvanceOrder', isAdvanceOrder);

    // Show/hide QR code container
    if (isAdvanceOrder) {
        qrCodeContainer.classList.remove('hidden');
    } else {
        qrCodeContainer.classList.add('hidden');
    }

    // Update total bill
    updateTotalBill();
});

// Place Order button logic
placeOrderBtn.addEventListener('click', () => {
    const finalBillAmount = parseFloat(totalBillElement.textContent);

    // Alert with the total bill amount
    alert(Thank you for placing your order! Your total bill is ₹${finalBillAmount.toFixed(2)});

    // Reset UI and state after placing the order
    advanceOrderCheckbox.checked = false;
    qrCodeContainer.classList.add('hidden');
    sessionStorage.setItem('isAdvanceOrder', 'false');
    isAdvanceOrder = false;

    // Update total bill back to base
    updateTotalBill();
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

            Show or hide "Mark as Delivered" button based on order status
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
