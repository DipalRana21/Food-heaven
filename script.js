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
    
        const response = await fetch('http://localhost:5000/place-order', {
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



// document.getElementById('login-form').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: username, password: password }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//         alert('Login successful!');
//         // Store the token and redirect to the main content
//         localStorage.setItem('token', data.token);
//         document.getElementById('main-content').classList.remove('hidden');
//         document.getElementById('login').classList.add('hidden');
//     } else {
//         alert(data.message);
//     }
    
// });

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/login', {
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

    const response = await fetch('http://localhost:5000/signup', {
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


document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById("advance-modal");
    const openModalBtn = document.getElementById("advance-order-btn");
    const closeModalBtn = document.querySelector(".close-btn");
    const confirmOrderBtn = document.getElementById("confirm-advance-order-btn");
    const qrSection = document.getElementById("qr-section");

    // Open the modal when "Order in Advance" button is clicked
    openModalBtn.addEventListener("click", function() {
        modal.classList.add("active"); // Show the modal
    });

    // Close the modal when the "x" button is clicked
    closeModalBtn.addEventListener("click", function() {
        modal.classList.remove("active"); // Hide the modal
    });

    // Close the modal if clicked outside the modal content
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.classList.remove("active"); // Hide the modal
        }
    });

    // Confirm order and show QR code
    confirmOrderBtn.addEventListener("click", function() {
        alert("Your order has been confirmed with an extra 10% charge!");
        modal.classList.remove("active");
        qrSection.classList.remove("hidden"); // Show the QR section
    });
});

// document.addEventListener('DOMContentLoaded', () => {
//     const orderDetails = document.getElementById("order-details");
//     const totalBill = document.getElementById("total-bill");
//     const orderStatus = document.getElementById("order-status");
//     const orderSummarySection = document.getElementById("order-summary");

//     // Load and display past orders
//     function loadPastOrders() {
//         const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];

//         if (pastOrders.length > 0) {
//             const lastOrder = pastOrders[pastOrders.length - 1]; // Show the latest order
//             orderSummarySection.classList.remove("hidden");

//             // Display order details in `order-details`
//             orderDetails.innerHTML = lastOrder.items.map(item => `
//                 <p>${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>
//             `).join('');

//             // Update total and status
//             totalBill.textContent = lastOrder.total;
//             orderStatus.textContent = lastOrder.status;
//         } else {
//             orderSummarySection.classList.add("hidden");
//         }
//     }

//     // Function to place a new order
//     function placeOrder(items, token) {
//         const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//         const order = {
//             items: items,
//             total: totalAmount.toFixed(2),
//             status: "Pending"
//         };

//         // Save the order in localStorage
//         const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];
//         pastOrders.push(order);
//         localStorage.setItem("pastOrders", JSON.stringify(pastOrders));

//         // Update UI
//         loadPastOrders();
//         alert("Order placed successfully!");
//     }

   

// });



// document.addEventListener('DOMContentLoaded', () => {
//     const orderDetails = document.getElementById("order-details");
//     const totalBill = document.getElementById("total-bill");
//     const orderStatus = document.getElementById("order-status");
//     const orderSummarySection = document.getElementById("order-summary");
//     const updateStatusButton = document.getElementById("updateStatusButton");

//     // Verify elements exist before proceeding
//     if (!orderDetails || !totalBill || !orderStatus || !orderSummarySection || !updateStatusButton) {
//         console.error("One or more required elements are missing in the HTML.");
//         return;
//     }

//     // Load and display past orders
//     function loadPastOrders() {
//         const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];

//         if (pastOrders.length > 0) {
//             const lastOrder = pastOrders[pastOrders.length - 1]; // Show the latest order
//             orderSummarySection.classList.remove("hidden");

//             // Display order details in `order-details` with ₹ sign for each item
//             orderDetails.innerHTML = lastOrder.items.map(item => `
//                 <p>${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>
//             `).join('');

//             // Update total bill and order status with ₹ sign
//             totalBill.textContent = `Total Bill: ₹${lastOrder.total}`;
//             orderStatus.textContent = `Order Status: ${lastOrder.status}`;
//         } else {
//             orderSummarySection.classList.add("hidden");
//         }
//     }


 
//     // Function to place a new order
//     function placeOrder(items) {
//         const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//         const order = {
//             items: items,
//             total: totalAmount.toFixed(2),
//             status: "Pending"
//         };

//         // Save the order in localStorage with the latest format
//         const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];
//         pastOrders.push(order);
//         localStorage.setItem("pastOrders", JSON.stringify(pastOrders));

//         // Reload orders to reflect the new data immediately
//         loadPastOrders();
//         alert("Order placed successfully!");
//     }

//     // Initialize past orders display on page load
//     loadPastOrders();

   
  
//     document.getElementById("placeOrderButton")?.addEventListener("click", () => placeOrder(sampleOrderItems));
// });


// // Function to update order status
// function updateOrderStatus() {
//     const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];
//     if (pastOrders.length > 0) {
//         // Update the last order status to 'Delivered'
//         pastOrders[pastOrders.length - 1].status = "Delivered";
//         localStorage.setItem("pastOrders", JSON.stringify(pastOrders));
//         alert("Order status updated to Delivered!");

//         // Reload orders to reflect the new status
//         loadPastOrders();
//     }
// }

//imp
// document.addEventListener('DOMContentLoaded', () => {
//     const orderDetails = document.getElementById("order-details");
//     const totalBill = document.getElementById("total-bill");
//     const orderStatus = document.getElementById("order-status");
//     const orderSummarySection = document.getElementById("order-summary");
//     const updateStatusButton = document.getElementById("updateStatusButton");
//     const placeOrderButton = document.getElementById("place-order");

//     // Verify elements exist before proceeding
//     if (!orderDetails || !totalBill || !orderStatus || !orderSummarySection || !updateStatusButton || !placeOrderButton) {
//         console.error("One or more required elements are missing in the HTML.");
//         return;
//     }

//     // Load and display past orders
//     function loadPastOrders() {
//         const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];

//         if (pastOrders.length > 0) {
//             const lastOrder = pastOrders[pastOrders.length - 1]; // Show the latest order
//             orderSummarySection.classList.remove("hidden");

//             // Display order details with ₹ sign
//             orderDetails.innerHTML = lastOrder.items.map(item => `
//                 <p>${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>
//             `).join('');

//             // Update total bill and order status
//             totalBill.textContent = lastOrder.total;
//             orderStatus.textContent = lastOrder.status || "Pending";

//             // Show or hide "Mark as Delivered" button based on order status
//             if (lastOrder.status === "Pending") {
//                 updateStatusButton.classList.remove("hidden");
//             } else {
//                 updateStatusButton.classList.add("hidden");
//             }
//         } else {
//             orderSummarySection.classList.add("hidden");
//         }
//     }

//     // Function to place a new order
//     function placeOrder(items) {

//         const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//         const order = {
//             items: items,
//             total: totalAmount.toFixed(2),
//             status: "Pending"
//         };

//         // Save the order in localStorage
//         const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];
//         pastOrders.push(order);
//         localStorage.setItem("pastOrders", JSON.stringify(pastOrders));

//         // Reload orders to reflect the new data
//         loadPastOrders();
//         alert("Order placed successfully!");
//     }

//     // Function to update the status of the last order to "Delivered"
//     updateStatusButton?.addEventListener("click", () => {
//         const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];
//         if (pastOrders.length > 0) {
//             // Update the last order status to 'Delivered'
//             pastOrders[pastOrders.length - 1].status = "Delivered";
//             localStorage.setItem("pastOrders", JSON.stringify(pastOrders));

//             // Reload orders to reflect the new status
//             loadPastOrders();
//             alert("Order status updated to Delivered!");
//         }
//     });

//     // Event listener for the place order button
//     placeOrderButton?.addEventListener("click", placeOrder);

//     // Initialize past orders display on page load
//     loadPastOrders();
// });



// // Initialize past orders display on page load
// document.addEventListener('DOMContentLoaded', () => {
//     loadPastOrders();
// });
















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



