// Make available globally
window.renderResources = function () {
    return `
        <!-- Custom Header for Resources -->
        <div style="margin-bottom: var(--spacing-lg);">
            <div class="card card-glass" style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-glare)); border:none;">
                <span style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; opacity:0.8;">Daily Tip</span>
                <h2 style="font-size:20px; font-weight:700; margin-top:4px; margin-bottom:8px; line-height:1.2;">Cooling Techniques</h2>
                <p style="font-size:14px; opacity:0.9; margin-bottom:16px;">5 practical ways to manage sudden hot flashes using breathwork.</p>
                <button style="background:rgba(255,255,255,0.2); border:none; color:white; padding:8px 16px; border-radius:var(--radius-full); font-size:12px; font-weight:600; backdrop-filter:blur(4px);">Read Now</button>
            </div>
        </div>

        <!-- Filter Chips -->
        <div class="tag-group" style="flex-wrap:nowrap; overflow-x:auto; padding-bottom:8px; margin-bottom:16px; -webkit-overflow-scrolling:touch;">
            <div class="tag-chip selected" style="white-space:nowrap;">All</div>
            <div class="tag-chip" style="white-space:nowrap;">Sleep</div>
            <div class="tag-chip" style="white-space:nowrap;">Nutrition</div>
            <div class="tag-chip" style="white-space:nowrap;">Mental Health</div>
            <div class="tag-chip" style="white-space:nowrap;">HRT</div>
        </div>

        <!-- Article List -->
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div class="card card-glass" style="padding:16px; display:flex; gap:16px; align-items:center;">
                <div style="width:60px; height:60px; background:rgba(255,255,255,0.1); border-radius:12px;"></div>
                <div style="flex:1;">
                    <h3 style="font-size:16px; font-weight:600; margin-bottom:4px;">Understanding HRT</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:12px; color:var(--color-text-muted);">Hormone Therapy Guide</span>
                        <span style="font-size:10px; padding:2px 8px; background:rgba(255,255,255,0.1); border-radius:var(--radius-full);">5 min</span>
                    </div>
                </div>
            </div>

            <div class="card card-glass" style="padding:16px; display:flex; gap:16px; align-items:center;">
                <div style="width:60px; height:60px; background:rgba(255,255,255,0.1); border-radius:12px;"></div>
                <div style="flex:1;">
                    <h3 style="font-size:16px; font-weight:600; margin-bottom:4px;">Night Sweats 101</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:12px; color:var(--color-text-muted);">Sleep Better</span>
                        <span style="font-size:10px; padding:2px 8px; background:rgba(255,255,255,0.1); border-radius:var(--radius-full);">3 min</span>
                    </div>
                </div>
            </div>

            <div class="card card-glass" style="padding:16px; display:flex; gap:16px; align-items:center;">
                <div style="width:60px; height:60px; background:rgba(255,255,255,0.1); border-radius:12px;"></div>
                <div style="flex:1;">
                    <h3 style="font-size:16px; font-weight:600; margin-bottom:4px;">Cooling Foods</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:12px; color:var(--color-text-muted);">Nutrition</span>
                        <span style="font-size:10px; padding:2px 8px; background:rgba(255,255,255,0.1); border-radius:var(--radius-full);">7 min</span>
                    </div>
                </div>
            </div>
            
             <div class="card card-glass" style="padding:16px; display:flex; gap:16px; align-items:center;">
                <div style="width:60px; height:60px; background:rgba(255,255,255,0.1); border-radius:12px;"></div>
                <div style="flex:1;">
                    <h3 style="font-size:16px; font-weight:600; margin-bottom:4px;">Mental Clarity</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:12px; color:var(--color-text-muted);">Brain Fog</span>
                        <span style="font-size:10px; padding:2px 8px; background:rgba(255,255,255,0.1); border-radius:var(--radius-full);">4 min</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}
