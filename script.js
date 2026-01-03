const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsCQ4L-_WOH12HAByjTZJDVAkTFN__T5H-WX9pMGb8R0DDrpWQJ52DYZx642C4ejp-U3HEX-lE2mMo/pubhtml?gid=0&single=true'; // Place your published CSV link here
let masterData = [];

document.addEventListener('DOMContentLoaded', () => {
    setSaturdayDate();
    loadResults();
    document.getElementById('mainSearch').addEventListener('keyup', filterResults);
});

function setSaturdayDate() {
    const now = new Date();
    const diff = (now.getDay() === 6) ? 0 : -(now.getDay() + 1);
    const lastSat = new Date(now.setDate(now.getDate() + diff));
    document.getElementById('sat-date').innerText = `SATURDAY | ${lastSat.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

function triggerGift(el, type) {
    el.classList.add('shake-it');
    const colors = type === 'gold' ? ['#fbbf24', '#ffffff'] : ['#cbd5e1', '#ffffff'];
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.7 }, colors: colors });
    setTimeout(() => el.classList.remove('shake-it'), 400);
}

function loadResults() {
    Papa.parse(csvUrl, {
        download: true, header: true,
        complete: (results) => {
            masterData = results.data.filter(r => r.Name).map(s => ({
                name: s.Name, score: parseFloat(s.Score) || 0
            })).sort((a, b) => b.score - a.score);
            document.getElementById('active-count').innerText = masterData.length;
            renderRows(masterData);
        }
    });
}

function renderRows(data) {
    const container = document.getElementById('leaderboard-body');
    container.innerHTML = data.map(s => {
        const rank = masterData.findIndex(x => x.name === s.name) + 1;
        let award = s.score >= 180 ? {class:'gold-border', text:'Golden Champion', color:'text-yellow-500', gift:'gold'} : 
                    s.score >= 160 ? {class:'silver-border', text:'Silver List', color:'text-slate-300', gift:'silver'} : null;
        
        return `
            <div class="premium-card ${award?award.class:''} p-5 rounded-3xl flex justify-between items-center">
                <div class="flex items-center gap-5">
                    <div class="rank-circle text-slate-400">#${rank}</div>
                    <div><h3 class="text-xl font-bold">${s.name}</h3><p class="text-[10px] uppercase font-black ${award?award.color:'text-slate-500'}">${award?award.text:'Participant'}</p></div>
                </div>
                <div class="flex items-center gap-6">
                    <div class="text-right"><div class="text-2xl font-black">${s.score}</div><div class="text-[10px] text-blue-500 uppercase">Points</div></div>
                    ${award ? `<div class="gift-box" onclick="triggerGift(this, '${award.gift}')">🎁</div>` : ''}
                </div>
            </div>`;
    }).join('');
}

function filterResults() {
    const query = this.value.toLowerCase();
    renderRows(masterData.filter(s => s.name.toLowerCase().includes(query)));
}
