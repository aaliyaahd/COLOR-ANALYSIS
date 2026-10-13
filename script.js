let currentPhase = 1;
let currentQuestion = 1;

// Menyimpan bobot keyakinan atau Certainty Factor (CF) untuk setiap Season
let seasonScores = {
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0
};

// Fungsi navigasi Phase 1 (Natural Signals)
function autoNext(radioElement) {
    const currentBlock = radioElement.closest('.q-block');
    const nextBlock = currentBlock.nextElementSibling;

    if (nextBlock && nextBlock.classList.contains('q-block')) {
        currentBlock.classList.add('hidden');
        nextBlock.classList.remove('hidden');
    } else {
        // Jika habis, lanjut ke Phase 2 (Palette Direction)
        document.getElementById('section-color-phase1').classList.add('hidden');
        document.getElementById('section-color-phase2').classList.remove('hidden');
    }
}

// Fungsi navigasi Phase 2 (Palette Direction)
function autoNextP2(radioElement) {
    const currentBlock = radioElement.closest('.q-block-p2');
    const nextBlock = currentBlock.nextElementSibling;

    if (nextBlock && nextBlock.classList.contains('q-block-p2')) {
        currentBlock.classList.add('hidden');
        nextBlock.classList.remove('hidden');
    } else {
        // Jika habis, lanjut ke Phase 3 (Color Habits)
        document.getElementById('section-color-phase2').classList.add('hidden');
        document.getElementById('section-color-phase3').classList.remove('hidden');
    }
}

// Fungsi navigasi Phase 3 (Color Habits) & Proses Hasil Akhir
function autoNextP3(radioElement) {
    const currentBlock = radioElement.closest('.q-block-p3');
    const nextBlock = currentBlock.nextElementSibling;

    if (nextBlock && nextBlock.classList.contains('q-block-p3')) {
        currentBlock.classList.add('hidden');
        nextBlock.classList.remove('hidden');
    } else {
        // Pertanyaan terakhir dijawab -> Hitung Forward Chaining & CF lalu tampilkan hasil
        calculateColorAnalysis();
    }
}

function nextColorStep() {
    // Sembunyikan intro
    document.getElementById('section-color-intro').classList.add('hidden');
    
    // Tampilkan progress bar dan fase 1 kuis
    document.getElementById('route-progress-bar').classList.remove('hidden');
    document.getElementById('section-color-phase1').classList.remove('hidden');
}

// ==========================================
// INFERENCE ENGINE: FORWARD CHAINING & CERTAINTY FACTOR
// ==========================================
function calculateColorAnalysis() {
    // Reset skor
    seasonScores = { spring: 0, summer: 0, autumn: 0, winter: 0 };

    // Ambil semua nilai dari input radio yang dipilih pengguna
    const allInputs = document.querySelectorAll('input[type="radio"]:checked');

    allInputs.forEach(input => {
        const value = input.value; // contoh: 'warm', 'cool', 'bright', 'soft', 'deep', 'light'
        
        // Aturan Forward Chaining & Pemberian Bobot Certainty Factor (CF)
        // Pakar menetapkan seberapa besar keyakinan (CF) suatu pilihan terhadap karakteristik season
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
        } else if (value === 'light' || value === 'fresh') {
            seasonScores.spring += 0.8;
            seasonScores.summer += 0.7;
        }
    });

    // Cari season dengan skor tertinggi (Forward Chaining Conclusion)
    let bestSeason = 'spring';
    let maxScore = -1;

    for (let season in seasonScores) {
        if (seasonScores[season] > maxScore) {
            maxScore = seasonScores[season];
            bestSeason = season;
        }
    }

    // Tampilkan hasil ke halaman web
    displayResult(bestSeason);
}

// ==========================================
// RENDER HASIL ANALISIS KE UI
// ==========================================
function displayResult(season) {
    // Sembunyikan semua fase kuis
    document.getElementById('section-color-phase3').classList.add('hidden');
    
    // Tampilkan section hasil
    const resultSection = document.getElementById('section-color-result');
    resultSection.classList.remove('hidden');

    // Data Deskripsi & Rekomendasi Palet untuk Masing-masing Season
    const seasonData = {
        spring: {
            title: "🌸 True / Warm Spring",
            desc: "Karakteristikmu didominasi oleh undertone yang hangat (warm) dengan tingkat kecerahan yang segar dan cerah (light/bright). Warna-warna bernuansa ceria dan hangat sangat memancarkan aura glowing-mu!",
            palette: ["#FF7F50", "#FFD700", "#98FB98", "#40E0D0", "#FF6B6B"]
        },
        summer: {
            title: "🌿 Light / Cool Summer",
            desc: "Karakteristikmu memiliki undertone dingin (cool) dengan karakteristik warna yang lembut, tenang, dan tidak terlalu kontras (soft/muted). Warna-warna pastel lembut membuat wajahmu tampak sangat elegan.",
            palette: ["#B0E0E6", "#D8BFD8", "#FFB6C1", "#778899", "#E0EEEE"]
        },
        autumn: {
            title: "🍂 Warm / Deep Autumn",
            desc: "Karakteristikmu memancarkan kehangatan yang kaya (warm & rich). Warna-warna bumi yang dalam dan hangat (earthy tones) akan membuat penampilanmu terlihat sangat matang, elegan, dan berkelas.",
            palette: ["#8B4513", "#CD853F", "#556B2F", "#800000", "#D2B48C"]
        },
        winter: {
            title: "❄️ True / Deep Winter",
            desc: "Karakteristikmu memiliki undertone dingin dengan kontras tinggi (cool & high contrast). Warna-warna tegas, tajam, dan pekat sangat kontras dan cocok dengan pesonamu yang dramatis.",
            palette: ["#000080", "#800080", "#DC143C", "#2F4F4F", "#000000"]
        }
    };

    const currentResult = seasonData[season];

    // Suntikkan data ke dalam elemen hasil di HTML (Pastikan elemen target ada di index.html)
    let resultContainer = document.getElementById('result-content');
    if (!resultContainer) {
        // Jika container khusus belum ada, buat secara dinamis di dalam section result
        resultContainer = document.createElement('div');
        resultContainer.id = 'result-content';
        resultSection.prepend(resultContainer);
    }

    let colorBoxesHTML = currentResult.palette.map(color => 
        `<div style="width: 40px; height: 40px; background-color: ${color}; border-radius: 50%; display: inline-block; margin: 0 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);"></div>`
    ).join('');

    resultContainer.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h2 style="color: var(--primary-color); font-size: 26px; margin-bottom: 10px;">${currentResult.title}</h2>
            <p style="color: var(--text-color); font-size: 15px; line-height: 1.6; margin-bottom: 20px;">${currentResult.desc}</p>
            <h4 style="margin-bottom: 12px; font-size: 16px;">Rekomendasi Palet Warnamu:</h4>
            <div style="margin-bottom: 25px;">${colorBoxesHTML}</div>
        </div>
    `;
}