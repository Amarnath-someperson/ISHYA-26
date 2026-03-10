// gsheet linked to this page
const SHEET_ID = '1A6V5ZtKOUVZ0ThIsCC4AmL_ECP-Hvo3dpCckvThT40g';
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSn_em0uPT3-FdSZg-3aeobZFB_5fG7So6YfTVDGS3O9gAXVYs3FiJIMkc5DDcLfwq-5IcrMAa529Qx/pub?output=csv`;

async function fetchResults() {
    try {
        console.log("Attempting to fetch data from Google...");
        const response = await fetch(GVIZ_URL);
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.text();
        
        // This will print the raw data to your browser console so we can prove it works
        console.log("RAW DATA RECEIVED:", data); 
        
        const rows = data.split('\n');
        const container = document.getElementById('results-container');
        container.innerHTML = ''; 

        // Skip the header row (i=1)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row) continue;

            // The gviz API wraps text in quotes, so we strip them out
            const cols = row.split(',').map(col => col.replace(/"/g, '').trim());
            
            const eventName = cols[0];
            const winner = cols[1] || 'TBA';
            const second = cols[2] || 'TBA';
            const third = cols[3] || 'TBA';


            if (eventName) {
                container.innerHTML += `
                    <div class="card-container">
                        <div class="card-content">
                            <div class="card-title">${eventName}</div>
                            <p class="card-winner"><strong>First Place:</strong> ${winner}</p>
                            <p class="card-winner"><strong>Second Place:</strong> ${second}</p>
                            <p class="card-winner"><strong>Third Place:</strong> ${third}</p>
                        </div>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error("CRITICAL FETCH ERROR:", error);
        document.getElementById('results-container').innerHTML = 
            "Data fetch failed. Contact website team asap.";
    }
}

function initParticles() {
        const canvas = document.getElementById('ashCanvas');
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];
        
        const particleCount = isMobile ? 15 : 50; 

        function resize() { 
            width = canvas.width = window.innerWidth; 
            height = canvas.height = window.innerHeight; 
        }
        window.addEventListener('resize', resize); 
        resize();

        class P {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * width; 
                this.y = height + Math.random() * 100; 
                this.size = Math.random() * (isMobile ? 3 : 5) + 2;
                this.speed = Math.random() * 1 + 0.5;
                this.color = Math.random() > 0.5 ? '#4D8F48' : '#D6C26A';
                this.rot = Math.random() * 360;
            }
            update() { 
                this.y -= this.speed; 
                this.rot += 1; 
                if(this.y < -50) this.reset(); 
            }
            draw() {
                ctx.save(); 
                ctx.translate(this.x, this.y); 
                ctx.rotate(this.rot * Math.PI/180);
                ctx.fillStyle = this.color; 
                ctx.globalAlpha = 0.6;
                ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                ctx.restore();
            }
        }

        for(let i=0; i<particleCount; i++) particles.push(new P());

        function anim() { 
            ctx.clearRect(0,0,width,height); 
            for(let i=0; i<particles.length; i++) {
                particles[i].update(); 
                particles[i].draw();
            }
            requestAnimationFrame(anim); 
        }
        anim();
    }

const isMobile = window.innerWidth < 768;

document.addEventListener("DOMContentLoaded", () => {
    initParticles();
});

fetchResults();