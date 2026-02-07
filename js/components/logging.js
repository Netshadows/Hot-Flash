// Make available globally
window.renderLogging = function () {
    // Logic Helpers
    window.toggleSeverityControl = function (id) {
        const control = document.getElementById(id);
        if (control.style.display === 'none') {
            control.style.display = 'block';
        } else {
            control.style.display = 'none';
        }
    }

    window.updateValue = function (id, val) {
        document.getElementById(id).innerText = val;
    }

    window.saveLogEntry = function () {
        // Collect data from the new granular inputs
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            vasomotor: {
                severity: document.getElementById('vaso-severity').value, // 0-4 FDA
                duration: document.getElementById('vaso-duration').innerText,
                note: document.getElementById('vaso-note').value
            },
            psych: {},
            urogenital: {},
            somatic: {}
        };

        // Helper to grab sections
        const grabSeverity = (prefix, list) => {
            const data = {};
            list.forEach(item => {
                const isChecked = document.getElementById(`${prefix}-${item}-check`).checked;
                if (isChecked) {
                    data[item] = document.getElementById(`${prefix}-${item}-val`).innerText;
                }
            });
            data.note = document.getElementById(`${prefix}-note`).value;
            return data;
        }

        entry.psych = grabSeverity('psych', ['Anxiety', 'BrainFog', 'Irritable', 'LowMood']);
        entry.urogenital = grabSeverity('uro', ['Dryness', 'Pain', 'Libido']);
        entry.somatic = grabSeverity('som', ['JointPain', 'Headache', 'Fatigue']);

        const logs = JSON.parse(localStorage.getItem('hotflash_logs') || '[]');
        logs.unshift(entry);
        localStorage.setItem('hotflash_logs', JSON.stringify(logs));

        window.app.navigate('dashboard');
    };

    // --- HTML Generators ---

    // Vasomotor (Always Visible)
    const renderVasomotor = () => `
        <div class="card card-glass" style="margin-bottom:24px; padding:24px;">
            <label style="font-size:13px; color:var(--color-text-muted); font-weight:700; display:block; margin-bottom:12px;">VASOMOTOR (FDA Scale)</label>
            <input type="range" id="vaso-severity" min="0" max="4" value="0" step="1" style="width:100%; height:6px; margin-bottom:12px;"
                 oninput="const l=['None','Mild','Moderate (Activity OK)','Severe (Must Stop)', 'Extreme']; document.getElementById('vaso-label').innerText = l[this.value]">
            <div id="vaso-label" style="color:var(--color-primary); font-weight:600; text-align:center; margin-bottom:16px;">None</div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-surface-glass-border); paddingTop:12px;">
                <span style="font-size:13px; color:var(--color-text-muted);">Duration (min)</span>
                <div style="display:flex; gap:12px; align-items:center;">
                    <button onclick="window.updateValue('vaso-duration', Math.max(0, parseInt(document.getElementById('vaso-duration').innerText)-1))" style="padding:4px 12px; background:var(--color-surface); border:1px solid var(--color-surface-glass-border); border-radius:8px;">-</button>
                    <span id="vaso-duration" style="font-weight:600; width:20px; text-align:center;">5</span>
                    <button onclick="window.updateValue('vaso-duration', parseInt(document.getElementById('vaso-duration').innerText)+1)" style="padding:4px 12px; background:var(--color-surface); border:1px solid var(--color-surface-glass-border); border-radius:8px;">+</button>
                </div>
            </div>
            <textarea id="vaso-note" placeholder="Notes (e.g. triggers)" style="width:100%; margin-top:12px; border:none; background:rgba(0,0,0,0.05); padding:8px; border-radius:8px; resize:none;"></textarea>
        </div>
    `;

    // Expandable Severity Row (Checkbox -> Reveals Slider)
    const renderRow = (prefix, key, label, maxScale, scaleLabel) => `
        <div style="background:var(--color-surface); border-radius:16px; padding:16px; margin-bottom:8px; border:1px solid var(--color-surface-glass-border);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <label style="display:flex; align-items:center; gap:12px; font-weight:500; color:var(--color-text-main);">
                    <input type="checkbox" id="${prefix}-${key}-check" style="width:20px; height:20px;" 
                        onchange="window.toggleSeverityControl('${prefix}-${key}-control')">
                    ${label}
                </label>
            </div>
            <div id="${prefix}-${key}-control" style="display:none; margin-top:16px; padding-top:16px; border-top:1px solid var(--color-surface-glass-border);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px; color:var(--color-text-muted);">
                    <span>Severity (${maxScale > 3 ? 'VAS 1-10' : 'Likert 0-3'})</span>
                    <span id="${prefix}-${key}-val" style="color:var(--color-primary); font-weight:700;">1</span>
                </div>
                <input type="range" min="1" max="${maxScale}" value="1" step="1" style="width:100%;" 
                    oninput="document.getElementById('${prefix}-${key}-val').innerText = this.value">
                <div style="font-size:11px; color:var(--color-text-muted); margin-top:4px;">${scaleLabel}</div>
            </div>
        </div>
    `;

    return `
        <!-- Header -->
        <h2 style="font-size:24px; font-weight:700; margin-bottom:24px; color:var(--color-text-main);">Log Symptom</h2>
        
        ${renderVasomotor()}

        <h4 style="font-size:12px; color:var(--color-text-muted); font-weight:700; text-transform:uppercase; margin:24px 0 12px 0;">Psychological (Greene Scale)</h4>
        ${renderRow('psych', 'Anxiety', 'Anxiety', 3, '1=A little, 2=Quite a bit, 3=Extremely')}
        ${renderRow('psych', 'BrainFog', 'Brain Fog', 3, '1=A little, 2=Quite a bit, 3=Extremely')}
        ${renderRow('psych', 'Irritable', 'Irritability', 3, '1=A little, 2=Quite a bit, 3=Extremely')}
        ${renderRow('psych', 'LowMood', 'Depressed Mood', 3, '1=A little, 2=Quite a bit, 3=Extremely')}
        <textarea id="psych-note" placeholder="Psych Context..." style="width:100%; background:var(--color-surface); border:1px solid var(--color-surface-glass-border); padding:12px; border-radius:12px; resize:none; margin-bottom:24px;"></textarea>

        <h4 style="font-size:12px; color:var(--color-text-muted); font-weight:700; text-transform:uppercase; margin:24px 0 12px 0;">Urogenital (GSM)</h4>
        ${renderRow('uro', 'Dryness', 'Vaginal Dryness', 3, '1=Mild, 2=Moderate, 3=Severe')}
        ${renderRow('uro', 'Pain', 'Pain (Dyspareunia)', 10, 'VAS 1-10 (10=Worst Imaginable)')}
        ${renderRow('uro', 'Libido', 'Low Libido', 3, '1=Mild, 2=Mod, 3=Sev')}
        <textarea id="uro-note" placeholder="GSM Context..." style="width:100%; background:var(--color-surface); border:1px solid var(--color-surface-glass-border); padding:12px; border-radius:12px; resize:none; margin-bottom:24px;"></textarea>

        <h4 style="font-size:12px; color:var(--color-text-muted); font-weight:700; text-transform:uppercase; margin:24px 0 12px 0;">Somatic (Pain VAS)</h4>
        ${renderRow('som', 'JointPain', 'Joint Pain', 10, '1-3 Mild, 4-6 Mod, 7-10 Severe')}
        ${renderRow('som', 'Headache', 'Headache', 10, '1-3 Mild, 4-6 Mod, 7-10 Severe')}
        ${renderRow('som', 'Fatigue', 'Fatigue', 10, '1-3 Mild, 4-6 Mod, 7-10 Severe')}
        <textarea id="som-note" placeholder="Somatic Context..." style="width:100%; background:var(--color-surface); border:1px solid var(--color-surface-glass-border); padding:12px; border-radius:12px; resize:none; margin-bottom:32px;"></textarea>

        <button onclick="window.saveLogEntry()" class="btn btn-primary" style="height:64px; font-size:18px; font-weight:600; margin-bottom:80px; border-radius:24px;">Save Detailed Log</button>
    `;
}
