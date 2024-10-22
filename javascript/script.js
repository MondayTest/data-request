const mobileBreakpoint = 670;

function setDeviceClass(isMobile) {
    if (isMobile) {
        document.body.classList.add('unsupported-device');
    } else {
        document.body.classList.remove('unsupported-device');
    }
}

function checkDevice() {
    const isMobile = window.innerWidth < mobileBreakpoint;
    setDeviceClass(isMobile);
}

window.addEventListener('load', checkDevice);
window.addEventListener('resize', checkDevice);

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = event.target[0].value;
    const password = event.target[1].value;

    // Decrypt the Base64 encoded credentials
    const decodedUsername = atob(credentials.username);
    const decodedPassword = atob(credentials.password);

    if (username === decodedUsername && password === decodedPassword) {
        // Show WhatsApp options
        document.getElementById('whatsapp-options').classList.remove('hidden');
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('error-message').classList.add('hidden'); // Hide error message
    } else {
        // Show error message
        document.getElementById('error-message').classList.remove('hidden');
    }
});

const credentials = {
    username: 'dGF4ZXJyYWN0IGdsb2Jl',
    password: 'YWRtaW4='
};

// Handle WhatsApp button clicks
document.getElementById('whatsapp-web').addEventListener('click', function() {
    window.location.href = 'html/whatsapp web.html'; // Redirect to WhatsApp Web page
});

document.getElementById('whatsapp-desktop').addEventListener('click', function() {
    window.location.href = 'html/whatsapp desk.html'; // Redirect to WhatsApp Desktop page
});
