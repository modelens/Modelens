async function checkLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('⚠️ You must be logged in to book!! 🔒');
        window.location.href = 'login.html';
    } else {
        try {
            const modal = document.getElementById("bookingModal");
            const modelName = document.querySelector('.details-section h2').textContent;
            const modalContent = modal.querySelector(".modal-content");
            const modalTitle = modalContent.querySelector("h2");

            // Show loader or placeholder content
            modalTitle.textContent = `Booking Confirmation for "${modelName}"`;
            const loadingParagraph = modalContent.querySelector("p");
            if (loadingParagraph) {
                loadingParagraph.textContent = 'Loading your details...';
            } else {
                modalContent.insertAdjacentHTML('beforeend', '<p>Loading your details...</p>');
            }
            modalContent.querySelector(".modal-buttons").style.display = "none"; // Hide buttons initially

            // Show modal immediately
            modal.style.display = "block";

            const response = await fetch(`${API_URL}/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const userName = `${data.user.firstname} ${data.user.lastname}`;
                const userEmail = data.user.email;
                const userPhone = data.user.number;

                // Replace loader with actual content
                modalContent.innerHTML = `
                    <span class="close">&times;</span>
                    <h2>Booking Confirmation for "${modelName}"</h2>
                    <p>Name: ${userName}<br>
                    Email: ${userEmail}<br>
                    Phone: ${userPhone}</p>
                    <div class="modal-buttons">
                        <button class="cancel-btn" id="cancelBtn">Cancel</button>
                        <button class="confirm-btn" id="confirmBtn">Confirm</button>
                    </div>
                `;

                // Add event listeners to the modal buttons after setting the content
                document.getElementById("cancelBtn").onclick = function () {
                    modal.style.display = "none";
                };
                document.getElementById("confirmBtn").onclick = function () {
                    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=modelensofficial@gmail.com&su=Booking%20Inquiry&body=I%20would%20like%20to%20book%20${encodeURIComponent(modelName)}.%0A%0AUser%20Details:%0AName:%20${encodeURIComponent(userName)}%0AEmail:%20${encodeURIComponent(userEmail)}%0APhone:%20${encodeURIComponent(userPhone)}`;
                    const gmailWindow = window.open(gmailLink, '_blank');
                    const checkWindowClosed = setInterval(() => {
                        if (gmailWindow.closed) {
                            clearInterval(checkWindowClosed);
                            alert('Your booking is completed.\n We will contact you');
                            window.location.href = 'index.html';
                        }
                    }, 1000);
                };
            } else {
                console.error('Error fetching user data');
                modalContent.innerHTML = `
                    <span class="close">&times;</span>
                    <h2>Booking Confirmation for "${modelName}"</h2>
                    <p>There was an error fetching your details. Please try again later.</p>
                    <div class="modal-buttons">
                        <button class="cancel-btn" id="cancelBtn">Close</button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h2>Booking Confirmation for "${modelName}"</h2>
                <p>There was an error fetching your details. Please try again later.</p>
                <div class="modal-buttons">
                    <button class="cancel-btn" id="cancelBtn">Close</button>
                </div>
            `;
        }
    }
}

// Open modal immediately on button click
document.getElementById("bookNowBtn").onclick = function () {
    checkLoggedIn();
};

// Close modal when clicking on <span> (x)
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('close')) {
        document.getElementById("bookingModal").style.display = "none";
    }
});

// Close modal when clicking anywhere outside of the modal
window.addEventListener('click', function (event) {
    const modal = document.getElementById("bookingModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
