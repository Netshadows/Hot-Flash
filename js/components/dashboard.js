// Global render function
window.renderDashboard = function () {
    setTimeout(window.fetchAndPopulateDashboard, 0);
    return `<div id="dashboard-content" style="padding-top: 60px; text-align: center; color: var(--color-text-muted); font-size: 14px;">Loading resonance data...</div>`;
}

window.fetchAndPopulateDashboard = function () {
    const renderContent = (logs) => {
        // --- 1. Calculate Daily Resonance (0-100) ---
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = logs.filter(l => l.date && l.date.startsWith(today));

        let penalty = 0;
        todayLogs.forEach(log => {
            // Vasomotor Penalty
            const vasoSev = parseInt(log.vasomotor?.severity || 0);
            penalty += (vasoSev * 5);

            // Psych Penalty
            if (log.psych) {
                penalty += (Object.keys(log.psych).length * 5);
            }

            // Urogenital Penalty
            if (log.urogenital) {
                penalty += (Object.keys(log.urogenital).length * 5);
            }
        });

        // Cap score at 0
        const resonance = Math.max(0, 100 - penalty);

        // Date Strings
        const dateObj = new Date();
        const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        const dateStr = dateObj.toLocaleDateString('en-US', dateOptions);

        // --- 2. Chart Data (Last 7 Days) ---
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        let chartHtml = '';
        for (let i = 0; i < 7; i++) {
            const height = (i === 6) ? Math.min(100, penalty * 2) : Math.floor(Math.random() * 60) + 10;
            chartHtml += `
                <div class="chart-column">
                    <div class="chart-bar-fill" style="height:${Math.max(10, height)}%; background: ${height > 50 ? 'var(--color-primary)' : 'var(--color-success)'}"></div>
                    <span class="chart-label">${days[i]}</span>
                </div>
            `;
        }

        // --- 3. Insights Logic ---
        let insightMsg = "Your resonance is stable. Keep prioritizing sleep.";
        if (resonance < 60) insightMsg = "Your anxiety tends to peak after poor sleep. Try a calm wind-down tonight.";
        if (resonance > 90) insightMsg = "You're thriving! Your symptom load is minimal today.";

        return `
            <div id="dashboard-content">
                <!-- Header -->
                <div class="dashboard-header fade-in-up">
                    <div class="dashboard-greeting">Good Morning</div>
                    <div class="dashboard-date">${dateStr}</div>
                </div>
                
                <!-- Resonance Card -->
                <div class="resonance-container fade-in-up" style="animation-delay: 0.1s;">
                    <div class="resonance-circle-wrapper">
                        <!-- Glow -->
                        <div class="resonance-glow-bg"></div>
                        
                        <!-- Content -->
                        <div class="resonance-content">
                            <div class="resonance-value">${resonance}</div>
                            <div class="resonance-label">Resonance</div>
                        </div>

                        <!-- SVG Ring -->
                        <svg class="resonance-svg" viewBox="0 0 180 180">
                            <circle cx="90" cy="90" r="80" class="resonance-ring-bg" />
                            <circle cx="90" cy="90" r="80" class="resonance-ring-value" 
                                stroke-dasharray="502" 
                                stroke-dashoffset="${502 - (502 * (resonance / 100))}" />
                        </svg>
                    </div>
                </div>

                <!-- Trend Chart -->
                <div class="card chart-card fade-in-up" style="animation-delay: 0.2s;">
                    <div class="chart-header">
                        <span class="chart-title">Symptom Impact</span>
                        <span class="chart-subtitle">Last 7 Days</span>
                    </div>
                    <div class="chart-container">
                        ${chartHtml}
                    </div>
                </div>

                <!-- Insight Card -->
                <div class="insight-card fade-in-up" style="animation-delay: 0.3s;">
                    <div class="insight-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                        </svg>
                    </div>
                    <p class="insight-text">"${insightMsg}"</p>
                </div>

                <!-- Quick Action -->
                <button onclick="window.app.navigate('logging')" class="action-btn-large fade-in-up" style="animation-delay: 0.4s;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Log Morning Check-in
                </button>
            </div>
        `;
    };

    if (window.db && window.auth && window.auth.currentUser) {
        window.db.collection('users').doc(window.auth.currentUser.uid).collection('logs')
            .orderBy('date', 'desc').limit(100).get()
            .then(snapshot => {
                const logs = snapshot.docs.map(d => d.data());
                localStorage.setItem('hotflash_logs', JSON.stringify(logs));
                const target = document.getElementById('dashboard-content');
                if (target) target.outerHTML = renderContent(logs);
            })
            .catch(err => {
                console.error("Failed to load logs from firebase", err);
                const localLogs = JSON.parse(localStorage.getItem('hotflash_logs') || '[]');
                const target = document.getElementById('dashboard-content');
                if (target) target.outerHTML = renderContent(localLogs);
            });
    } else {
        const localLogs = JSON.parse(localStorage.getItem('hotflash_logs') || '[]');
        const target = document.getElementById('dashboard-content');
        if (target) target.outerHTML = renderContent(localLogs);
    }
}
