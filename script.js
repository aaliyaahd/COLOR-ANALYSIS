function startQuiz() {
    document.getElementById('screen-intro').classList.add('hidden');
    document.getElementById('screen-q1').classList.remove('hidden');
    document.getElementById('header-phase-title').innerText = "Natural Signals";
    document.getElementById('top-progress').style.width = "30%";
}

function nextScreen(currentId, nextId, progressWidth) {
    // Pilih radio button di dalam card yang diklik
    const activeCard = event.currentTarget;
    const radio = activeCard.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    setTimeout(() => {
        document.getElementById(currentId).classList.add('hidden');
        document.getElementById(nextId).classList.remove('hidden');
        document.getElementById('top-progress').style.width = progressWidth;
    }, 200);
}

function prevStep() {
    window.location.reload();
}

// ==========================================
// INFERENCE ENGINE: FORWARD CHAINING & CF
// ==========================================
function calculateColorAnalysis() {
    let seasonScores = { spring: 0, summer: 0, autumn: 0, winter: 0 };

    const allInputs = document.querySelectorAll('input[type="radio"]:checked');

    allInputs.forEach(input => {
        const value = input.value; 
        if (value === 'warm') {
            seasonScores.spring += 0.6;
            seasonScores.autumn += 0.8;
        } else if (value === 'cool') {
            seasonScores.summer += 0.8;
            seasonScores.winter += 0.6;
        } else if (value === 'bright' || value === 'high-contrast') {
            seasonScores.spring += 0.7;
            seasonScores.winter += 0.9;
        } else if (value === 'soft' || value === 'muted') {
            seasonScores.summer += 0.8;
            seasonScores.autumn += 0.7;
        } else if (value === 'deep' || value === 'rich') {
            seasonScores.autumn += 0.9;
            seasonScores.winter += 0.7;
        } else if (value === 'light' || value === 'fresh' || value === 'fair') {
            seasonScores.spring += 0.8;
            seasonScores.summer += 0.7;
        }
    });

    let bestSeason = 'spring';
    let maxScore = -1;

    for (let season in seasonScores) {
        if (seasonScores[season] > maxScore) {
            maxScore = seasonScores[season];
            bestSeason = season;
        }
    }

    displayResult(bestSeason);
}

// ==========================================
// RENDER HASIL KE UI MINIMALIS
// ==========================================
function displayResult(season) {
    document.getElementById('screen-complete').classList.add('hidden');
    document.getElementById('header-phase-title').innerText = "Your Color Result";
    document.getElementById('top-progress').style.width = "100%";
    
    const resultSection = document.getElementById('section-color-result');
    resultSection.classList.remove('hidden');

    const seasonData = {
        spring: {
            title: "🌸 True / Warm Spring",
            desc: "Karakteristikmu didominasi oleh undertone hangat dengan tingkat kecerahan yang segar. Warna-warna ceria sangat memancarkan aura glowing-mu!",
            palette: ["#FF7F50", "#FFD700", "#98FB98", "#40E0D0", "#FF6B6B"]
        },
        summer: {
            title: "🌿 Light / Cool Summer",
            desc: "Karakteristikmu memiliki undertone dingin dengan nuansa warna yang lembut dan tenang. Warna pastel lembut membuat wajahmu tampak sangat elegan.",
            palette: ["#B0E0E6", "#D8BFD8", "#FFB6C1", "#778899", "#E0EEEE"]
        },
        autumn: {
            title: "🍂 Warm / Deep Autumn",
            desc: "Karakteristikmu memancarkan kehangatan yang kaya. Warna-warna bumi yang dalam dan hangat (earthy tones) membuat penampilanmu terlihat berkelas.",
            palette: ["#8B4513", "#CD853F", "#556B2F", "#800000", "#D2B48C"]
        },
        winter: {
            title: "❄️ True / Deep Winter",
            desc: "Karakteristikmu memiliki undertone dingin dengan kontras tinggi. Warna-warna tegas dan pekat sangat cocok dengan pesonamu yang dramatis.",
            palette: ["#000080", "#800080", "#DC143C", "#2F4F4F", "#000000"]
        }
    };

    const currentResult = seasonData[season];
    let resultContainer = document.getElementById('result-content');

    let colorBoxesHTML = currentResult.palette.map(color => 
        `<div style="width: 45px; height: 45px; background-color: ${color}; border-radius: 50%; display: inline-block; margin: 0 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"></div>`
    ).join('');

    resultContainer.innerHTML = `
        <div style="text-align: center; padding: 10px 0;">
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #1c1917;">${currentResult.title}</h2>
            <p style="font-size: 14px; color: #78716c; line-height: 1.6; margin-bottom: 24px;">${currentResult.desc}</p>
            <h4 style="margin-bottom: 16px; font-size: 15px; font-weight: 700;">Rekomendasi Palet Warnamu:</h4>
            <div style="margin-bottom: 30px;">${colorBoxesHTML}</div>
        </div>
    `;
}