// This specific gviz URL bypasses Google's strict CORS blocking
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
            const runnerUp = cols[2] || 'TBA';

            if (eventName) {
                // Stripped down HTML just to prove the data injects properly
                container.innerHTML += `
                    <div class="card" style="background:white; padding:20px; margin:10px; border:1px solid black;">
                        <h2>${eventName}</h2>
                        <p><strong>Winner:</strong> ${winner}</p>
                        <p><strong>Runner Up:</strong> ${runnerUp}</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error("CRITICAL FETCH ERROR:", error);
        document.getElementById('results-container').innerHTML = 
            "Data fetch failed. Open Developer Tools (F12) and check the Console tab for the exact error.";
    }
}

fetchResults();