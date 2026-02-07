// Make available globally
window.renderSettings = function () {
    // Logic for Actions
    window.exportData = function () {
        const logs = localStorage.getItem('hotflash_logs') || '[]';
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(logs);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "hotflash_logs.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    window.clearData = function () {
        if (confirm("Are you sure you want to delete all logs? This cannot be undone.")) {
            localStorage.removeItem('hotflash_logs');
            alert("All data has been cleared.");
            window.app.navigate('dashboard');
        }
    };

    return `
        <!-- Header -->
        <h2 style="font-size:24px; font-weight:800; margin-bottom:24px; letter-spacing:-0.02em;">Settings</h2>

        <!-- Profile Section -->
        <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:32px;">
            <div style="width:80px; height:80px; border-radius:50%; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); display:flex; align-items:center; justify-content:center; margin-bottom:12px; font-size:32px; font-weight:700;">JD</div>
            <h3 style="font-size:18px; font-weight:600;">Jane Doe</h3>
            <span style="font-size:14px; color:var(--color-text-muted);">jane.doe@icloud.com</span>
        </div>

        <!-- Data Management -->
        <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--color-text-muted); margin-bottom:12px; font-weight:600;">Data Management</h4>
        <div class="card card-glass" style="padding:0; overflow:hidden; margin-bottom:24px;">
            
            <!-- Export Row -->
            <div onclick="window.exportData()" style="padding:16px; display:flex; align-items:center; border-bottom:1px solid var(--color-surface-glass-border); cursor:pointer;">
                <div style="width:32px; height:32px; background:rgba(255,255,255,0.1); border-radius:8px; display:flex; align-items:center; justify-content:center; margin-right:16px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </div>
                <div style="flex:1; font-weight:500;">Export Data (JSON)</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>

            <!-- Clear Row -->
            <div onclick="window.clearData()" style="padding:16px; display:flex; align-items:center; cursor:pointer;">
                <div style="width:32px; height:32px; background:rgba(255, 64, 129, 0.15); border-radius:8px; display:flex; align-items:center; justify-content:center; margin-right:16px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
                <div style="flex:1; font-weight:500; color:var(--color-accent);">Clear History</div>
            </div>
        </div>

        <!-- App Info -->
        <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--color-text-muted); margin-bottom:12px; font-weight:600;">About</h4>
        <div class="card card-glass" style="padding:0; overflow:hidden;">
            <div style="padding:16px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-surface-glass-border);">
                <span style="font-weight:500;">Version</span>
                <span style="color:var(--color-text-muted);">1.0.0 (Beta)</span>
            </div>
            <div style="padding:16px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:500;">Privacy Policy</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2"><polyline points="18 13 23 6 8 21 5 19 23 6"></polyline></svg>
            </div>
        </div>
        
        <div style="text-align:center; margin-top:32px; opacity:0.5; font-size:12px;">
            Hot Flash App © 2026
        </div>
    `;
}
