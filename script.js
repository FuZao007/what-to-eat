// Supabase Configuration
const SUPABASE_URL = 'https://oiqflziovfxuesgcecww.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcWZsemlvdmZ4dWVzZ2NlY3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTA4NDUsImV4cCI6MjA4OTc4Njg0NX0.yucCvRC6Twip0a1eLfVKdv6TC7UFKQNs1tDdLxS4PMQ';

// Initialize Supabase client
let dbClient;
try {
    // Note: 'supabase' is the global object provided by the CDN script in index.html
    dbClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error('Supabase SDK not loaded yet or config error:', e);
}

// Constants for LocalStorage keys (keeping for school preference and restrictions)
const STORAGE_KEY_RESTRICTIONS = 'whatToEat_restrictions';
const STORAGE_KEY_SCHOOL = 'whatToEat_selected_school';

// BUPT Shahe Campus Data
const BUPT_SHAHE_DISHES = [
    { name: "烤盘饭 (自选称重)", location: "沙河 A 楼风味餐厅三层", price: "9.9 元/两" },
    { name: "海南鸡饭", location: "沙河 A 楼风味餐厅三层", price: "暂未知" },
    { name: "自选餐 (称重)", location: "沙河 A 楼风味餐厅三层", price: "1.98 元/两" },
    { name: "招牌卤肉饭", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "肘子", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "椒麻鸡", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "椒麻鸭", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "滑香鸡", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "卤汁鸡腿", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "卤汁鸭腿", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "孜然鸡丁", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "香炒肉", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "鸡排", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "鱼排", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "火腿鱼豆腐", location: "沙河 D 楼教工餐厅四层", price: "暂未知" },
    { name: "招牌烧鸭饭", location: "沙河 D 楼教工餐厅二层", price: "18 元" },
    { name: "蜜汁叉烧饭", location: "沙河 D 楼教工餐厅二层", price: "18 元" },
    { name: "广式烧腊饭", location: "沙河 D 楼教工餐厅二层", price: "16 元" },
    { name: "椒麻手撕鸡饭", location: "沙河 D 楼教工餐厅二层", price: "16 元" },
    { name: "风味白切鸡饭", location: "沙河 D 楼教工餐厅二层", price: "16 元" },
    { name: "特色辣子鸡饭", location: "沙河 D 楼教工餐厅二层", price: "17 元" },
    { name: "香辣口水鸡饭", location: "沙河 D 楼教工餐厅二层", price: "16 元" },
    { name: "照烧鸡腿饭", location: "沙河 D 楼教工餐厅二层", price: "16 元" },
    { name: "老乡炒鸡", location: "沙河 D 楼教工餐厅二层", price: "17 元" },
    { name: "素小面", location: "沙河 D 楼教工餐厅二层", price: "9 元" },
    { name: "西红柿、剁椒鸡蛋小面", location: "沙河 D 楼教工餐厅二层", price: "12 元" },
    { name: "香菇鸡块小面", location: "沙河 D 楼教工餐厅二层", price: "15 元" },
    { name: "香鲜鸡腿刀削面", location: "沙河 D 楼教工餐厅二层", price: "15 元" },
    { name: "香辣鸡珍刀削面", location: "沙河 D 楼教工餐厅二层", price: "15 元" },
    { name: "牛肉刀削面", location: "沙河 D 楼教工餐厅二层", price: "17 元" }
];

const DEFAULT_DISHES = [
    { name: "麻辣烫", location: "学校周边", price: "约 20 元" },
    { name: "牛肉面", location: "校内食堂", price: "15 元" },
    { name: "黄焖鸡米饭", location: "校内食堂", price: "18 元" }
];

// App State
let dishes = [];
let restrictions = [];
let selectedSchool = '';
let currentDish = null;
let userRating = 0;

// DOM Elements
const schoolModal = document.getElementById('school-modal');
const schoolNameDisplay = document.getElementById('school-name-display');
const currentSchoolTag = document.getElementById('current-school-tag');

const resultText = document.getElementById('result-text');
const resultDetail = document.getElementById('result-detail');
const resultLocation = document.getElementById('result-location').querySelector('span');
const resultPrice = document.getElementById('result-price').querySelector('span');
const rollBtn = document.getElementById('roll-btn');

const feedbackSection = document.getElementById('feedback-section');
const commentList = document.getElementById('comment-list');
const avgRatingSpan = document.getElementById('avg-rating').querySelector('span');
const ratingStars = document.querySelectorAll('.star-btn');
const commentInput = document.getElementById('comment-input');
const submitFeedbackBtn = document.getElementById('submit-feedback-btn');
const aiSummaryBtn = document.getElementById('ai-summary-btn');
const aiSummaryBox = document.getElementById('ai-summary-box');
const aiSummaryText = document.getElementById('ai-summary-text');

const restrictionInput = document.getElementById('restriction-input');
const addRestrictionBtn = document.getElementById('add-restriction-btn');
const restrictionTags = document.getElementById('restriction-tags');
const dishInput = document.getElementById('dish-input');
const addDishBtn = document.getElementById('add-dish-btn');
const dishList = document.getElementById('dish-list');
const dishCount = document.getElementById('dish-count');
const resetBtn = document.getElementById('reset-btn');

// --- Core Functions ---

function init() {
    selectedSchool = localStorage.getItem(STORAGE_KEY_SCHOOL);
    if (!selectedSchool) {
        schoolModal.classList.remove('hidden');
    } else {
        applySchool(selectedSchool);
    }

    const savedRestrictions = localStorage.getItem(STORAGE_KEY_RESTRICTIONS);
    restrictions = savedRestrictions ? JSON.parse(savedRestrictions) : [];
    renderRestrictions();
}

window.selectSchool = function(school) {
    selectedSchool = school;
    localStorage.setItem(STORAGE_KEY_SCHOOL, school);
    schoolModal.classList.add('hidden');
    applySchool(school);
};

function applySchool(school) {
    schoolNameDisplay.innerText = school;
    dishes = school === '北京邮电大学沙河校区' ? [...BUPT_SHAHE_DISHES] : [...DEFAULT_DISHES];
    renderDishes();
}

function getFilteredDishes() {
    if (restrictions.length === 0) return dishes;
    return dishes.filter(dish => !restrictions.some(r => dish.name.includes(r)));
}

let isRolling = false;
function rollDish() {
    if (isRolling) return;
    
    const availableDishes = getFilteredDishes();
    if (availableDishes.length === 0) {
        resultText.innerText = "没有符合条件的菜品";
        resultText.classList.add('text-red-500');
        resultDetail.classList.add('hidden');
        feedbackSection.classList.add('hidden');
        return;
    }
    
    resultText.classList.remove('text-red-500');
    resultDetail.classList.add('hidden');
    feedbackSection.classList.add('hidden');
    isRolling = true;
    rollBtn.disabled = true;
    rollBtn.classList.add('opacity-50');
    
    let counter = 0;
    const maxRolls = 15;
    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * availableDishes.length);
        resultText.innerText = availableDishes[randomIndex].name;
        resultText.classList.add('rolling');
        counter++;
        if (counter >= maxRolls) {
            clearInterval(interval);
            finishRoll(availableDishes);
        }
    }, 80);
}

async function finishRoll(availableDishes) {
    const finalDish = availableDishes[Math.floor(Math.random() * availableDishes.length)];
    currentDish = finalDish;
    
    resultText.innerText = finalDish.name;
    resultLocation.innerText = finalDish.location || '未知位置';
    resultPrice.innerText = finalDish.price || '价格不详';
    
    resultText.classList.remove('rolling');
    resultDetail.classList.remove('hidden');
    feedbackSection.classList.remove('hidden');
    
    isRolling = false;
    rollBtn.disabled = false;
    rollBtn.classList.remove('opacity-50');
    
    await loadFeedbackFromSupabase(finalDish.name);
    resetRating();
}

// --- Supabase Feedback Functions ---

async function loadFeedbackFromSupabase(dishName) {
    if (!dbClient) return;
    try {
        const { data, error } = await dbClient
            .from('feedback')
            .select('*')
            .eq('dish_name', dishName)
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderFeedback(data);
    } catch (err) {
        console.error('Error loading feedback:', err);
        commentList.innerHTML = '<p class="text-red-400 text-center py-2 text-xs">加载评价失败，请检查数据库设置</p>';
    }
}

function renderFeedback(feedbacks) {
    // Average Rating
    const ratings = feedbacks.filter(f => f.rating).map(f => f.rating);
    const avg = ratings.length > 0 
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : "0.0";
    avgRatingSpan.innerText = avg;
    
    // Comments
    commentList.innerHTML = '';
    const comments = feedbacks.filter(f => f.comment);
    if (comments.length === 0) {
        commentList.innerHTML = '<p class="text-gray-400 italic text-center py-2">暂无点评，快来抢沙发~</p>';
    } else {
        comments.forEach(f => {
            const div = document.createElement('div');
            div.className = 'comment-item bg-gray-50 p-2 rounded-lg border border-gray-100 mb-2';
            div.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <div class="flex gap-0.5 text-orange-400">${'★'.repeat(f.rating)}${'☆'.repeat(5-f.rating)}</div>
                    <span class="text-[10px] text-gray-400">${new Date(f.created_at).toLocaleDateString()}</span>
                </div>
                <p class="text-gray-700">${f.comment}</p>
            `;
            commentList.appendChild(div);
        });
    }
}

async function submitFeedbackToSupabase() {
    const comment = commentInput.value.trim();
    
    // Validation: Must have either a rating or a comment
    if (userRating === 0 && !comment) {
        alert('请先进行评分或输入点评内容哦~');
        return;
    }
    
    if (!currentDish) return;
    
    submitFeedbackBtn.disabled = true;
    submitFeedbackBtn.innerText = '发布中...';

    // Prepare data - if no rating, use null or a valid default if allowed
    // But based on your DB constraint (1-5), we should ensure a valid rating if sent
    const feedbackData = { 
        dish_name: currentDish.name, 
        comment: comment,
        school: selectedSchool
    };
    
    // Only include rating if it's greater than 0 to avoid constraint violation
    if (userRating > 0) {
        feedbackData.rating = userRating;
    }

    try {
        const { error } = await dbClient
            .from('feedback')
            .insert([feedbackData]);

        if (error) throw error;

        await loadFeedbackFromSupabase(currentDish.name);
        resetRating();
    } catch (err) {
        console.error('Error submitting feedback:', err);
        alert('发布失败：' + (err.message || '请确保 Supabase 表已正确创建'));
    } finally {
        submitFeedbackBtn.disabled = false;
        submitFeedbackBtn.innerText = '发布';
    }
}

function resetRating() {
    userRating = 0;
    document.querySelectorAll('.star-btn').forEach(star => {
        star.classList.remove('star-active', 'text-orange-400');
        star.classList.add('text-gray-300');
    });
    commentInput.value = '';
}

// Global function to handle star clicks
window.handleStarClick = function(rating) {
    userRating = rating;
    document.querySelectorAll('.star-btn').forEach((star, i) => {
        if (i < rating) {
            star.classList.add('star-active', 'text-orange-400');
            star.classList.remove('text-gray-300');
        } else {
            star.classList.remove('star-active', 'text-orange-400');
            star.classList.add('text-gray-300');
        }
    });
};

submitFeedbackBtn.addEventListener('click', submitFeedbackToSupabase);

async function handleAiSummary() {
    if (!currentDish) return;

    aiSummaryBtn.disabled = true;
    aiSummaryBtn.innerHTML = '<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> AI 正在思考...';
    lucide.createIcons();

    try {
        const { data, error } = await dbClient
            .from('feedback')
            .select('comment')
            .eq('dish_name', currentDish.name)
            .not('comment', 'is', null);

        if (error) throw error;

        const comments = data.map(item => item.comment).filter(c => c && c.trim().length > 0);

        // Simulate "Thinking" time for better "AI" feel
        aiSummaryBox.classList.remove('hidden');
        aiSummaryText.innerText = "正在分析海量用户点评...";
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (comments.length === 0) {
            aiSummaryText.innerText = "🔍 哎呀，大家还没对这道菜发表过看法，AI 也无从下手呢~";
        } else {
            // Randomly pick one comment and wrap it in AI-like tone
            const randomComment = comments[Math.floor(Math.random() * comments.length)];
            const aiTones = [
                `经过深度分析，课代表总结道：${randomComment}`,
                `AI 发现有一位同学说得很中肯：${randomComment}`,
                `根据全网大数据分析，这道菜的核心评价是：${randomComment}`,
                `💡 AI 点评：${randomComment}`,
                `大家普遍认为：${randomComment}`
            ];
            const finalResult = aiTones[Math.floor(Math.random() * aiTones.length)];
            aiSummaryText.innerText = finalResult;
        }

        aiSummaryBox.classList.add('fade-in');

    } catch (err) {
        console.error('Error during AI simulation:', err);
        aiSummaryText.innerText = "AI 脑回路突然短路了，请稍后再试。";
        aiSummaryBox.classList.remove('hidden');
    } finally {
        aiSummaryBtn.disabled = false;
        aiSummaryBtn.innerHTML = '<i data-lucide="brain-circuit" class="w-3 h-3"></i> AI 总结';
        lucide.createIcons();
    }
}

// --- Local Render & Interaction ---

function renderRestrictions() {
    restrictionTags.innerHTML = '';
    restrictions.forEach((res, index) => {
        const tag = document.createElement('span');
        tag.className = 'bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-red-100';
        tag.innerHTML = `${res} <i data-lucide="x" class="w-3 h-3 cursor-pointer hover:text-red-800" onclick="removeRestriction(${index})"></i>`;
        restrictionTags.appendChild(tag);
    });
    lucide.createIcons();
}

function renderDishes() {
    dishList.innerHTML = '';
    dishCount.innerText = `${dishes.length} 道菜`;
    dishes.forEach((dish, index) => {
        const item = document.createElement('div');
        item.className = 'dish-item flex items-center justify-between bg-gray-50 px-4 py-2 rounded-xl group hover:bg-orange-50 transition text-sm';
        item.innerHTML = `
            <div class="flex flex-col">
                <span class="text-gray-800 font-medium">${dish.name}</span>
                <span class="text-[10px] text-gray-400">${dish.location} | ${dish.price}</span>
            </div>
            <button onclick="removeDish(${index})" class="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        `;
        dishList.appendChild(item);
    });
    lucide.createIcons();
}

function addRestriction() {
    const value = restrictionInput.value.trim();
    if (value && !restrictions.includes(value)) {
        restrictions.push(value);
        restrictionInput.value = '';
        localStorage.setItem(STORAGE_KEY_RESTRICTIONS, JSON.stringify(restrictions));
        renderRestrictions();
    }
}

window.removeRestriction = function(index) {
    restrictions.splice(index, 1);
    localStorage.setItem(STORAGE_KEY_RESTRICTIONS, JSON.stringify(restrictions));
    renderRestrictions();
};

function addDish() {
    const value = dishInput.value.trim();
    if (value) {
        dishes.unshift({ name: value, location: '自定义添加', price: '未知' });
        renderDishes();
    }
}

window.removeDish = function(index) {
    dishes.splice(index, 1);
    renderDishes();
};

function resetDishes() {
    if (confirm("确定要重置菜单吗？")) {
        dishes = selectedSchool === '北京邮电大学沙河校区' ? [...BUPT_SHAHE_DISHES] : [...DEFAULT_DISHES];
        renderDishes();
    }
}

// --- Event Listeners ---
rollBtn.addEventListener('click', rollDish);
addRestrictionBtn.addEventListener('click', addRestriction);
restrictionInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addRestriction(); });
addDishBtn.addEventListener('click', addDish);
dishInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addDish(); });
resetBtn.addEventListener('click', resetDishes);
currentSchoolTag.addEventListener('click', () => schoolModal.classList.remove('hidden'));
aiSummaryBtn.addEventListener('click', handleAiSummary);

init();
lucide.createIcons();
