async function checkLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('⚠️ You must be logged in to book!! 🔒');
        window.location.href = 'login.html';
    } else {
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                var modal = document.getElementById("bookingModal");
                var btn = document.getElementById("bookNowBtn");
                var span = document.getElementsByClassName("close")[0];
                var cancelBtn = document.getElementById("cancelBtn");
                var confirmBtn = document.getElementById("confirmBtn");
                const modelName = document.querySelector('.details-section h2').textContent;
                const modalTitle = modal.querySelector("h2");
                const userName = data.user.firstname; 
                const userEmail = data.user.email; 
                const userPhone = data.user.number;
                modalTitle.textContent = `Booking Confirmation for ${modelName}`;

                btn.onclick = function () {
                    modal.style.display = "block";
                }

                span.onclick = function () {
                    modal.style.display = "none";
                }

                cancelBtn.onclick = function () {
                    modal.style.display = "none";
                }

                confirmBtn.onclick = function () {
                    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=modelensofficial@gmail.com&su=Booking%20Inquiry&body=I%20would%20like%20to%20book%20${encodeURIComponent(modelName)}.%0A%0AUser%20Details:%0AName:%20${encodeURIComponent(userName)}%0AEmail:%20${encodeURIComponent(userEmail)}%0APhone:%20${encodeURIComponent(userPhone)}`;
                    const gmailWindow = window.open(gmailLink, '_blank');
                    const checkWindowClosed = setInterval(() => {
                        if (gmailWindow.closed) {
                            clearInterval(checkWindowClosed);
                            alert('Your booking is completed.\n We will contact you');
                            window.location.href = 'index.html';
                        }
                    }, 1000);
                }

                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            } else {
                console.error('Error fetching user data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}