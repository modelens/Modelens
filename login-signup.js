document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const logoutLink = document.getElementById('logout');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const dropdownLoginLink = document.getElementById('dropdown-login-link');
    const dropdownSignupLink = document.getElementById('dropdown-signup-link');
    const dropdownLogoutLink = document.getElementById('dropdown-logout');

    if (token) {
        if (logoutLink) logoutLink.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';
        if (signupLink) signupLink.style.display = 'none';
        if (dropdownLoginLink) dropdownLoginLink.style.display = 'none';
        if (dropdownSignupLink) dropdownSignupLink.style.display = 'none';
        if (dropdownLogoutLink) dropdownLogoutLink.style.display = 'block';
    } else {
        if (logoutLink) logoutLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
        if (signupLink) signupLink.style.display = 'block';
        if (dropdownLoginLink) dropdownLoginLink.style.display = 'block';
        if (dropdownSignupLink) dropdownSignupLink.style.display = 'block';
        if (dropdownLogoutLink) dropdownLogoutLink.style.display = 'none';
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', async function (e) {
            e.preventDefault();
            await handleLogout(token);
        });
    }

    if (dropdownLogoutLink) {
        dropdownLogoutLink.addEventListener('click', async function (e) {
            e.preventDefault();
            await handleLogout(token);
        });
    }

    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (token && loginTimestamp) {
        showWelcomeAlert(token, loginTimestamp);
    }
});

async function handleLogout(token) {
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
}

async function showWelcomeAlert(token, loginTimestamp) {
    const currentTime = Date.now();
    const loginTime = parseInt(loginTimestamp, 10);

    if (currentTime - loginTime < 10 * 60 * 1000) { // 10 minutes
        try {
            const response = await fetch(`${API_URL}/user`, {
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

            localStorage.removeItem('loginTimestamp');
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
