// 5,000 Dynamic Infinite Question Generator & Archetype Evaluator Engine

// Stat traits tracking
let stats = {
    analytical: 0,
    creative: 0,
    brave: 0,
    empathetic: 0,
    philosophical: 0
};

let questionCounter = 0;
let userScore = 0;
let historyLog = [];

// Base Templates to generate infinite combinations dynamically
const subjects = ["في موقف غامض", "عندما تواجه تحدياً غير متوقع", "في مدينة مستقبلية", "أثناء اتخاذ قرار مصيري", "عند التخطيط لمعركة أو مغامرة"];
const scenarios = [
    "تكتشف ثغرة تمكنك من تغيير قواعد اللعبة، ماذا تفعل؟",
    "تجد صندوقاً مجهولاً يطلب منك الخيار الصعب، كيف تتصرف؟",
    "يطلب منك الفريق قيادتهم في ظروف غامضة، ما خطتك؟",
    "تعثر على خريطة لطريق مجهول لم يسلكه أحد، ما هي خطوتك التالية؟",
    "تستمع لحديث سرّي قد يغير كل شيء، كيف تتجاوب؟"
];

const optionSets = [
    [
        { text: "أقوم بتحليل المعطيات بدقة وعمل جدول حسابات للنتائج.", trait: "analytical", points: 15 },
        { text: "أبتكر خياراً جديداً خارج الصندوق يذهل الجميع.", trait: "creative", points: 20 },
        { text: "أندفع فوراً للمخاطرة وأخوض التجربة بنفسي.", trait: "brave", points: 25 },
        { text: "أستشير أصدقائي وأراعي مشاعر جميع الأطراف.", trait: "empathetic", points: 10 }
    ],
    [
        { text: "أبحث عن السبب العلمي والمنطقي وراء الموقف.", trait: "analytical", points: 15 },
        { text: "أصنع فكرة فنية أو تصميماً مستقلاً كحل بديل.", trait: "creative", points: 20 },
        { text: "أتحدى العواقب وأتحمل مسؤولية المواجهة كلياً.", trait: "brave", points: 25 },
        { text: "أتساءل عن المعنى العميق وراء هذا الحدث والدرس منه.", trait: "philosophical", points: 15 }
    ]
];

// Archetypes Map
const archetypes = {
    analytical: { name: "العقل المدبر 🧠", desc: "تعتمد على المنطق والتحليل العميق قبل اتخاذ أي خطوة." },
    creative: { name: "المبدع الثوري 🎨", desc: "تفكر خارج الصندوق وتجد حلولاً مبتكرة دائماً." },
    brave: { name: "المغامر الشجاع ⚔️", desc: "لا تخشى المخاطر ومستعد دائماً للمواجهة المباشرة." },
    empathetic: { name: "القائد المتعاطف 🤝", desc: "تهتم بروح الفريق وتضع العلاقات والمشاعر أولاً." },
    philosophical: { name: "الفيلسوف المفكر 📜", desc: "تبحث عن الحقيقة والمعنى العميق خلف التفاصيل." },
    balanced: { name: "المتوازن الشامل ⚖️", desc: "تتمتع بتوازن متناسق بين جميع المهارات والأنماط." }
};

// DOM Elements
const openSidebarBtn = document.getElementById('open-sidebar-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCounterEl = document.getElementById('question-counter');
const userScoreEl = document.getElementById('user-score');
const archetypeTitle = document.getElementById('archetype-title');
const archetypeDesc = document.getElementById('archetype-desc');
const currentArchetypeTag = document.getElementById('current-archetype-tag');
const playerNameInput = document.getElementById('player-name-input');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupSidebarEvents();
    loadNextQuestion();
    loadLeaderboard();
});

// Sidebar Controls
function setupSidebarEvents() {
    openSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('translate-x-full');
        sidebarOverlay.classList.remove('hidden');
    });

    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
}

function closeSidebar() {
    sidebar.classList.add('translate-x-full');
    sidebarOverlay.classList.add('hidden');
}

// Navigation Tabs
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    closeSidebar();
}

// Dynamic Question Generation
function generateRandomQuestion() {
    const sub = subjects[Math.floor(Math.random() * subjects.length)];
    const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
    const options = optionSets[Math.floor(Math.random() * optionSets.length)];
    
    return {
        title: `${sub}.. ${sc}`,
        category: "نمط سلوكي",
        options: [...options].sort(() => Math.random() - 0.5) // Shuffle options
    };
}

function loadNextQuestion() {
    questionCounter++;
    questionCounterEl.textContent = questionCounter;

    const q = generateRandomQuestion();
    questionText.textContent = q.title;
    optionsContainer.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "option-btn w-full text-right bg-slate-700/60 hover:bg-indigo-600/30 border border-slate-600 hover:border-indigo-500 rounded-xl p-4 transition duration-200 text-slate-200 hover:text-white flex items-center justify-between group";
        btn.innerHTML = `
            <span>${opt.text}</span>
            <i class="fa-solid fa-chevron-left text-slate-500 group-hover:text-indigo-400 transition"></i>
        `;
        btn.onclick = () => selectOption(opt, q.title);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(option, questionTitle) {
    // Update Stat & Score
    stats[option.trait] = (stats[option.trait] || 0) + 1;
    userScore += option.points;
    userScoreEl.textContent = userScore;

    // Save to history
    historyLog.unshift({ question: questionTitle, answer: option.text });
    updateHistoryUI();

    // Recalculate Archetype
    updateArchetype();

    // Sync score with Supabase periodically or on update
    syncDataToSupabase();

    // Next Question Animation
    const card = document.getElementById('question-card');
    card.classList.add('opacity-50');
    setTimeout(() => {
        loadNextQuestion();
        card.classList.remove('opacity-50');
    }, 200);
}

// Determine Current Archetype
function updateArchetype() {
    let highestTrait = 'balanced';
    let maxVal = 0;

    for (const [trait, count] of Object.entries(stats)) {
        if (count > maxVal) {
            maxVal = count;
            highestTrait = trait;
        }
    }

    const arch = archetypes[highestTrait] || archetypes.balanced;
    archetypeTitle.textContent = arch.name;
    archetypeDesc.textContent = arch.desc;
    currentArchetypeTag.textContent = arch.name;
}

// Update History View
function updateHistoryUI() {
    const list = document.getElementById('history-list');
    list.innerHTML = historyLog.map(item => `
        <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-700 text-xs">
            <p class="text-slate-400 font-semibold mb-1">${item.question}</p>
            <p class="text-indigo-300">إجابتك: ${item.answer}</p>
        </div>
    `).join('');
}

// Supabase Integration
async function syncDataToSupabase() {
    if (!supabase) return; // Returns silently if Supabase is not configured yet

    const playerName = playerNameInput.value || "لاعب مجهول";
    const currentArch = archetypeTitle.textContent;

    try {
        await supabase
            .from('players_leaderboard')
            .upsert([{ player_name: playerName, score: userScore, archetype: currentArch }], { onConflict: 'player_name' });
    } catch (err) {
        console.error("Supabase sync error:", err);
    }
}

async function loadLeaderboard() {
    const tbody = document.getElementById('leaderboard-table-body');
    
    // Mock local leaderboard if Supabase is not connected
    if (!supabase) {
        const mockData = [
            { player_name: playerNameInput.value || "أنت", archetype: archetypeTitle.textContent, score: userScore },
            { player_name: "أحمد علي", archetype: "المبدع الثوري 🎨", score: 320 },
            { player_name: "سارة محمد", archetype: "العقل المدبر 🧠", score: 280 },
            { player_name: "محمود حسن", archetype: "المغامر الشجاع ⚔️", score: 210 }
        ].sort((a, b) => b.score - a.score);

        renderLeaderboard(mockData);
        return;
    }

    try {
        const { data, error } = await supabase
            .from('players_leaderboard')
            .select('*')
            .order('score', { ascending: false })
            .limit(10);

        if (error) throw error;
        renderLeaderboard(data);
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
    }
}

function renderLeaderboard(data) {
    const tbody = document.getElementById('leaderboard-table-body');
    tbody.innerHTML = data.map((player, index) => `
        <tr class="border-b border-slate-800 hover:bg-slate-700/30">
            <td class="p-3 font-bold text-slate-400">${index + 1}</td>
            <td class="p-3 font-semibold text-slate-200">${player.player_name}</td>
            <td class="p-3 text-xs text-indigo-300">${player.archetype}</td>
            <td class="p-3 text-center font-bold text-amber-400">${player.score}</td>
        </tr>
    `).join('');
}

document.getElementById('sync-supabase-btn').addEventListener('click', loadLeaderboard);
