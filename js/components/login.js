window.renderLogin = function () {
    return `
        <div style="padding: 24px; text-align: center; margin-top: 40px;">
            <div style="width: 80px; height: 80px; border-radius: 40px; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-glare)); margin: 0 auto 24px;"></div>
            <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 8px; color: var(--color-text-main);">Hot Flash</h2>
            <p style="color: var(--color-text-muted); margin-bottom: 32px;">Your clinical symptom tracker</p>
            
            <input type="email" id="auth-email" placeholder="Email" 
                style="width:100%; padding:16px; margin-bottom:16px; border-radius:16px; border:1px solid var(--color-surface-glass-border); background: var(--color-surface); color: var(--color-text-main); font-size: 16px;">
            
            <input type="password" id="auth-pass" placeholder="Password" 
                style="width:100%; padding:16px; margin-bottom:32px; border-radius:16px; border:1px solid var(--color-surface-glass-border); background: var(--color-surface); color: var(--color-text-main); font-size: 16px;">
            
            <button onclick="window.handleAuth('login')" class="btn btn-primary" style="margin-bottom:16px; border-radius:16px;">Log In</button>
            <button onclick="window.handleAuth('register')" class="btn" style="width:100%; padding:16px; background:transparent; color:var(--color-primary); border:2px solid var(--color-primary); border-radius:16px; font-weight:600; font-size: 16px; cursor: pointer;">Register</button>
        </div>
    `;
};

window.handleAuth = function (action) {
    if (!window.auth) return alert("Firebase not initialized");
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;

    if (!email || !pass) return alert("Please enter both email and password.");

    if (action === 'register') {
        window.auth.createUserWithEmailAndPassword(email, pass)
            .then(userCredential => window.app.navigate('dashboard'))
            .catch(error => alert("Registration Failed: " + error.message));
    } else {
        window.auth.signInWithEmailAndPassword(email, pass)
            .then(userCredential => window.app.navigate('dashboard'))
            .catch(error => alert("Login Failed: " + error.message));
    }
};

window.logout = function () {
    if (window.auth) {
        window.auth.signOut().then(() => window.app.navigate('login'));
    }
};
