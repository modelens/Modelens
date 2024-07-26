document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const logoutLink = document.getElementById('logout');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');

    if (token) {
        logoutLink.style.display = 'block';
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
    } else {
        logoutLink.style.display = 'none';
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
    }

    logoutLink.addEventListener('click', async function (e) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                alert('Logging You Out!!');
                window.location.href = 'index.html';
            } else {
                console.error('Logout failed');
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during logout.');
        }
    });
});
document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    const loginTimestamp = localStorage.getItem('loginTimestamp');

    if (token && loginTimestamp) {
        const currentTime = Date.now();
        const loginTime = parseInt(loginTimestamp, 10);

        // Show alert if logged in recently (e.g., within the last 10 minutes)
        if (currentTime - loginTime < 10 * 60 * 1000) { // 10 minutes
            const response = await fetch(API_URL + '/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.user && data.user.username) {
                    const username = data.user.username;
                    alert(`Welcome back, ${username}!`);
                } else {
                    console.error('User data not found in API response');
                }
            } else {
                console.error('Error fetching user data');
            }

            // Clear the login timestamp after showing the alert
            localStorage.removeItem('loginTimestamp');
        }
    }
});