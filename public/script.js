// ============================================
// SIDEBAR (MOBILE)
// ============================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.querySelector('.hamburger');
    const isOpen = sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
    if (hamburger) hamburger.setAttribute('aria-expanded', isOpen);
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSidebar();
        closeModal();
    }
});

// ============================================
// НАВИГАЦИЯ
// ============================================

const titles = {
    dashboard: 'Главная',
    content: 'Контент',
    monetization: 'Монетизация',
    audience: 'Аудитория',
    // comms: 'Коммуникации',  ← УДАЛЕНО
    analytics: 'Аналитика',
    finance: 'Финансы и выплаты',
    settings: 'Настройки',
    help: 'Справка и обучение'
};

function goto(page) {
    closeSidebar();
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById('page-' + page);
    if (targetPage) targetPage.classList.add('active');
    document.querySelectorAll('#nav .nav-item').forEach(n => {
        const isActive = n.dataset.page === page;
        n.classList.toggle('active', isActive);
        if (isActive) {
            n.setAttribute('aria-current', 'page');
        } else {
            n.removeAttribute('aria-current');
        }
    });
    document.getElementById('pageTitle').textContent = titles[page] || page;
    window.scrollTo(0, 0);
    
    if (page === 'content') {
        loadContentTable();
    }
}

document.querySelectorAll('#nav .nav-item').forEach(n => n.addEventListener('click', () => goto(n.dataset.page)));

// ============================================
// ВКЛАДКИ
// ============================================

function bindTabs(id, cb) {
    const tabs = document.querySelectorAll('#' + id + ' .tab, #' + id + ' .chart-tab');
    tabs.forEach(t => {
        t.addEventListener('click', () => {
            tabs.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            if (cb) cb(t.textContent);
        });
        t.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                t.click();
            }
        });
    });
}

const contentTypeMap = {
    'Все': 'all',
    'Статьи': 'article',
    'Видео': 'video',
    'Аудио': 'audio',
    'Галерея': 'gallery'
};

bindTabs('contentTabs', function(text) {
    currentTypeFilter = contentTypeMap[text.trim()] || 'all';
    loadContentTable();
});
bindTabs('chartTabs', renderBars);


// ============================================
// ФИЛЬТРЫ
// ============================================

let currentFilter = 'all';
let currentTypeFilter = 'all';

function bindChips(selector, cb) {
    document.querySelectorAll(selector).forEach(c => {
        c.addEventListener('click', function() { cb.call(this); });
        c.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ============================================
// ОБРАБОТЧИКИ ФИЛЬТРОВ СТАТУСОВ
// ============================================

bindChips('#page-content .toolbar .chip', function() {
    const siblings = this.parentElement.querySelectorAll('.chip');
    siblings.forEach(s => s.classList.remove('active'));
    this.classList.add('active');
    
    const statusMap = {
        'Все типы': 'all',
        'Опубликован': 'published',
        'Черновик': 'draft',
        'Запланирован': 'scheduled'
    };
    
    currentFilter = statusMap[this.textContent.trim()] || 'all';
    loadContentTable();
});

// ============================================
// ФИЛЬТРЫ АУДИТОРИИ
// ============================================

let currentAudienceFilter = 'all';

bindChips('#page-audience .toolbar .chip', function() {
    const siblings = this.parentElement.querySelectorAll('.chip');
    siblings.forEach(s => s.classList.remove('active'));
    this.classList.add('active');
    
    const filterMap = {
        'Все': 'all',
        'Базовый': 'base',
        'Премиум': 'prem',
        'VIP': 'vip',
        'Спящие': 'dormant'
    };
    
    currentAudienceFilter = filterMap[this.textContent.trim()] || 'all';
    renderAudience();
});

// ============================================
// ОБРАБОТЧИКИ ФИЛЬТРОВ ТИПОВ
// ============================================

// ============================================
// ГРАФИКИ
// ============================================

function renderBars() {
    const el = document.getElementById('bars');
    if (!el) return;
    let data = [];
    for (let i = 1; i <= 30; i++) {
        data.push(800 + Math.round(Math.random() * 2400));
    }
    const max = Math.max(...data);
    el.innerHTML = data.map((v, i) =>
        `<div class="bar" style="height:${(v/max*100)}%"><div class="bar-tip">${v.toLocaleString('ru')} ₽ · день ${i+1}</div></div>`
    ).join('');
}

renderBars();

(function() {
    const el = document.getElementById('forecastBars');
    if (!el) return;
    const real = [45, 49, 52, 56, 61, 67];
    const opt = [48, 55, 62, 70, 79, 90];
    const pes = [44, 46, 48, 50, 53, 56];
    const max = 90;
    el.innerHTML = opt.map((o, i) =>
        `<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;height:100%">
                <div class="bar" style="height:${o/max*100}%;background:var(--green)"></div>
                <div class="bar" style="height:${real[i]/max*100}%;background:var(--orange)"></div>
                <div class="bar" style="height:${pes[i]/max*100}%;background:var(--muted)"></div></div>`
    ).join('');
})();

// ============================================
// ТОП КОНТЕНТ
// ============================================

const topData = [
    { t: 'Секретный гайд по Figma 2026', type: 'article', m: '2 990 ₽' },
    { t: 'Урок по анимации интерфейсов', type: 'video', m: '1 499 ₽' },
    // { t: 'Подкаст: будущее дизайна', type: 'podcast', m: '1 240 ₽' },  ← УДАЛЕНО
    { t: 'Коллекция UI-китов', type: 'gallery', m: '980 ₽' },
    { t: 'Разбор кейса для подписчиков', type: 'audio', m: '640 ₽' }
];

const icons = {
    article: 'fa-file-lines',
    video: 'fa-play',
    audio: 'fa-headphones',
    gallery: 'fa-images'
    // podcast: 'fa-microphone'  ← УДАЛЕНО
    // collection: 'fa-folder'  ← УДАЛЕНО
};

const typeLabels = {
    article: 'Статья',
    video: 'Видео',
    audio: 'Аудио',
    gallery: 'Галерея',
    podcast: 'Подкаст',
    collection: 'Коллекция'
};

function renderTopContent() {
    const el = document.getElementById('topContent');
    if (!el) return;
    el.innerHTML = topData.map((d, i) =>
        `<div class="list-row">
            <div class="rank">${i+1}</div>
            <div class="ctype ${d.type}"><i class="fa-solid ${icons[d.type]}"></i></div>
            <div><div class="row-title">${d.t}</div><div class="row-meta">${typeLabels[d.type] || d.type}</div></div>
            <span class="row-money">${d.m}</span>
            <button class="btn btn-ghost btn-sm" onclick="goto('content')">Перейти</button>
        </div>`
    ).join('');
}
renderTopContent();

// ============================================
// КОНТЕНТ ТАБЛИЦА
// ============================================

async function loadContentTable() {
    try {
        let url = '/api/content?';
        const params = [];
        
        if (currentFilter !== 'all') {
            params.push(`status=${currentFilter}`);
        }
        if (currentTypeFilter !== 'all') {
            params.push(`type=${currentTypeFilter}`);
        }
        
        url += params.join('&');
        
        const response = await fetch(url);
        const result = await response.json();
        const tbody = document.getElementById('contentRows');
        if (!tbody) return;
        
        if (result.success && result.data && result.data.length > 0) {
            const statusLabels = { 'draft': 'Черновик', 'published': 'Опубликован', 'scheduled': 'Запланирован' };
            const statusClasses = { 'draft': 'draft', 'published': 'pub', 'scheduled': 'sched' };
            
            tbody.innerHTML = result.data.map(c => {
                const contentId = c._id || c.id;
                const safeTitle = c.title.replace(/'/g, "\\'");
                const hasVideo = c.videoFile && c.videoFile.filename;
                const hasImages = c.images && c.images.length > 0;
                
                let typeIcon = '';
                if (c.type === 'gallery' || hasImages) {
                    typeIcon = '🖼️';
                } else if (hasVideo) {
                    typeIcon = '🎬';
                }
                
                return `
                <tr>
                    <td><b>${c.title}</b> ${typeIcon ? `<span class="tag pub" style="font-size:10px;padding:1px 6px;">${typeIcon}</span>` : ''}</td>
                    <td><span class="ctype ${c.type}" style="width:28px;height:28px;font-size:12px;display:inline-grid"><i class="fa-solid ${icons[c.type] || 'fa-file'}"></i></span></td>
                    <td>${c.views || 0}</td>
                    <td>${c.reactions || 0}</td>
                    <td><b>${c.access === 'free' ? 'Бесплатно' : c.access === 'paid' ? (c.price || 0) + ' ₽' : 'По подписке'}</b></td>
                    <td><span class="tag ${statusClasses[c.status] || 'draft'}">${statusLabels[c.status] || c.status}</span></td>
                    <td>
                        <button class="icon-btn" style="width:30px;height:30px" 
                            onclick="event.stopPropagation();openContentMenu('${contentId}', '${safeTitle}')">
                            <i class="fa-solid fa-ellipsis"></i>
                        </button>
                    </td>
                </tr>
            `}).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:30px;">Нет материалов с таким статусом</td></tr>`;
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки таблицы:', error);
        const tbody = document.getElementById('contentRows');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--red);padding:30px;">❌ Ошибка загрузки данных. Проверьте сервер.</td></tr>`;
        }
    }
}

// ============================================
// СТАТИСТИКА КОНТЕНТА
// ============================================

function contentStats(title) {
    openModal(`Статистика: ${title}`, `
        <div class="grid-4" style="grid-template-columns:repeat(2,1fr)">
            <div class="card metric"><span class="lbl">Просмотры</span><div class="val">342</div></div>
            <div class="card metric"><span class="lbl">Лайки</span><div class="val">28</div></div>
            <div class="card metric"><span class="lbl">Доход</span><div class="val" style="color:var(--green)">299 ₽</div></div>
            <div class="card metric"><span class="lbl">Конверсия</span><div class="val">6.1%</div></div>
        </div>
        <div style="margin-top:18px"><b class="small">Прогресс просмотра у подписчиков</b><div class="progress mt"><div style="width:64%"></div></div><div class="small muted mt">64% досматривают до конца</div></div>
    `,
    '<button class="btn btn-ghost" onclick="closeModal()">Закрыть</button>');
}

// ============================================
// МЕНЮ ДЕЙСТВИЙ
// ============================================

function openContentMenu(contentId, contentTitle) {
    openModal('Действия с материалом', `
        <div style="display:flex;flex-direction:column;gap:8px;">
            <button class="btn btn-outline" style="width:100%;justify-content:center;" onclick="viewContent('${contentId}')">
                <i class="fa-solid fa-eye"></i> Просмотреть
            </button>
            <button class="btn btn-outline" style="width:100%;justify-content:center;" onclick="editContent('${contentId}')">
                <i class="fa-solid fa-pen"></i> Редактировать
            </button>
            <button class="btn btn-outline" style="width:100%;justify-content:center;" onclick="duplicateContent('${contentId}')">
                <i class="fa-solid fa-copy"></i> Дублировать
            </button>
            <button class="btn btn-outline" style="width:100%;justify-content:center;color:var(--red);border-color:var(--red);" onclick="deleteContent('${contentId}', '${contentTitle.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-trash"></i> Удалить
            </button>
        </div>
    `,
    `<button class="btn btn-ghost" onclick="closeModal()">Закрыть</button>`);
}

// ============================================
// ДЕЙСТВИЯ С КОНТЕНТОМ
// ============================================

async function viewContent(id) {
    closeModal();
    
    try {
        const response = await fetch('/api/content/' + id);
        const result = await response.json();
        
        if (!result.success || !result.data) {
            toast('❌ Материал не найден');
            return;
        }
        
        const content = result.data;
        
        let videoHtml = '';
        if (content.videoFile && content.videoFile.path) {
            videoHtml = `
                <div style="margin:16px 0;border-radius:12px;overflow:hidden;background:#000;">
                    <video controls style="width:100%;max-height:500px;display:block;">
                        <source src="${content.videoFile.path}" type="${content.videoFile.mimetype || 'video/mp4'}">
                        Ваш браузер не поддерживает видео
                    </video>
                </div>
                <div class="small muted">Файл: ${content.videoFile.originalName} (${(content.videoFile.size / 1024 / 1024).toFixed(2)} MB)</div>
            `;
        } else if (content.videoUrl) {
            const embedUrl = getVideoEmbedUrl(content.videoUrl);
            videoHtml = `
                <div style="margin:16px 0;border-radius:12px;overflow:hidden;background:#000;position:relative;padding-bottom:56.25%;height:0;">
                    <iframe src="${embedUrl}" 
                        style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
                        allowfullscreen>
                    </iframe>
                </div>
            `;
        }
        
        let coverHtml = '';
        if (content.coverImage) {
            coverHtml = `
                <div style="margin:12px 0;border-radius:12px;overflow:hidden;border:1px solid var(--line);">
                    <img src="${content.coverImage}" alt="Обложка" style="width:100%;max-height:300px;object-fit:cover;">
                </div>
            `;
        }
        
        let imagesHtml = '';
        if (content.images && content.images.length > 0) {
            imagesHtml = `
                <div style="margin:16px 0;">
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;">
                        ${content.images.map(img => `
                            <div style="border-radius:8px;overflow:hidden;aspect-ratio:1/1;border:1px solid var(--line);">
                                <img src="${img.path}" alt="${img.originalName}" style="width:100%;height:100%;object-fit:cover;cursor:pointer;" onclick="window.open('${img.path}','_blank')">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        openModal(`📖 ${content.title}`, `
            <div style="margin-bottom:16px;">
                <div class="small muted">${content.type} · ${content.access === 'free' ? 'Бесплатно' : content.access === 'paid' ? content.price + ' ₽' : 'По подписке'}</div>
                <div style="margin:8px 0;color:var(--muted);">${content.description || 'Нет описания'}</div>
                ${content.tags && content.tags.length > 0 ? `<div class="small" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">${content.tags.map(t => `<span class="chip" style="font-size:11px;padding:2px 10px;">${t}</span>`).join('')}</div>` : ''}
            </div>
            ${coverHtml}
            ${videoHtml}
            ${imagesHtml}
            <div style="display:flex;gap:16px;margin-top:12px;padding-top:12px;border-top:1px solid var(--line);">
                <div class="small muted"><i class="fa-regular fa-eye"></i> ${content.views || 0} просмотров</div>
                <div class="small muted"><i class="fa-regular fa-heart"></i> ${content.reactions || 0} реакций</div>
                <div class="small muted"><i class="fa-regular fa-ruble-sign"></i> ${content.revenue || 0} ₽ дохода</div>
            </div>
        `,
        `<button class="btn btn-ghost" onclick="closeModal()">Закрыть</button>
         <button class="btn btn-primary" onclick="closeModal();editContent('${id}')"><i class="fa-solid fa-pen"></i> Редактировать</button>`);
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        toast('❌ Ошибка загрузки материала');
    }
}

function getVideoEmbedUrl(url) {
    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('/')[0];
        return `https://player.vimeo.com/video/${videoId}`;
    }
    if (url.includes('rutube.ru/video/')) {
        const videoId = url.split('rutube.ru/video/')[1]?.split('/')[0];
        return `https://rutube.ru/embed/${videoId}`;
    }
    return url;
}

function editContent(id) {
    closeModal();
    toast('✏️ Открыт редактор материала #' + id);
    openCreateForm('Редактирование');
}

function duplicateContent(id) {
    closeModal();
    toast('📋 Материал #' + id + ' дублирован');
}

async function deleteContent(id, title) {
    if (!confirm(`Вы уверены, что хотите удалить материал "${title}"?`)) {
        return;
    }
    
    closeModal();
    
    try {
        const response = await fetch('/api/content/' + id, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            toast(`✅ Материал "${title}" удалён`);
            await loadContentTable();
        } else {
            toast('❌ Ошибка: ' + (result.message || 'Не удалось удалить'));
        }
    } catch (error) {
        console.error('❌ Ошибка удаления:', error);
        toast('❌ Ошибка подключения к серверу');
    }
}

// ============================================
// УРОВНИ ПОДПИСКИ
// ============================================

const tiers = [
    { n: 'Базовый', c: '199 ₽', y: '1 990 ₽', s: 34, r: '6 766 ₽', cl: 'base' },
    { n: 'Премиум', c: '499 ₽', y: '4 990 ₽', s: 28, r: '13 972 ₽', cl: 'prem' },
    { n: 'VIP', c: '1 499 ₽', y: '14 990 ₽', s: 5, r: '7 495 ₽', cl: 'vip' }
];

function renderTiers() {
    const el = document.getElementById('tierRows');
    if (!el) return;
    el.innerHTML = tiers.map(t =>
        `<tr>
            <td><span class="pill ${t.cl}">${t.n}</span></td>
            <td><b>${t.c}</b></td><td>${t.y}</td><td>${t.s}</td>
            <td class="row-money">${t.r}</td>
            <td><button class="btn btn-ghost btn-sm" onclick="openTier('${t.n}')"><i class="fa-solid fa-pen"></i> Изменить</button></td>
        </tr>`
    ).join('');
}
renderTiers();

// ============================================
// АУДИТОРИЯ
// ============================================

const colors = ['#FF6B1A', '#9333EA', '#0284C7', '#16A34A', '#DC2626', '#EA580C'];
const aud = [
    { n: 'Алексей Морозов', lvl: 'prem', ll: 'Премиум', d: '4 мес', p: '1 996 ₽', a: 'сегодня', risk: 12 },
    { n: 'Мария Волкова', lvl: 'vip', ll: 'VIP', d: '8 мес', p: '11 992 ₽', a: 'вчера', risk: 8 },
    { n: 'Дмитрий Лебедев', lvl: 'base', ll: 'Базовый', d: '2 мес', p: '398 ₽', a: '32 дня назад', risk: 78 },
    { n: 'Ольга Соколова', lvl: 'prem', ll: 'Премиум', d: '6 мес', p: '2 994 ₽', a: '3 дня назад', risk: 34 },
    { n: 'Игорь Новиков', lvl: 'base', ll: 'Базовый', d: '1 мес', p: '199 ₽', a: '45 дней назад', risk: 85 },
    { n: 'Елена Кузнецова', lvl: 'prem', ll: 'Премиум', d: '3 мес', p: '1 497 ₽', a: 'сегодня', risk: 15 }
];

function renderAudience() {
    const el = document.getElementById('audienceRows');
    if (!el) return;
    
    let filtered = aud;
    if (currentAudienceFilter === 'dormant') {
        filtered = aud.filter(u => u.risk > 60);
    } else if (currentAudienceFilter !== 'all') {
        filtered = aud.filter(u => u.lvl === currentAudienceFilter);
    }
    
    el.innerHTML = filtered.map((u, i) => {
        const rc = u.risk > 60 ? 'var(--red)' : u.risk > 30 ? 'var(--orange)' : 'var(--green)';
        return `<tr onclick="audCard('${u.n}','${u.ll}','${u.p}')">
            <td style="display:flex;gap:10px;align-items:center"><div class="mini-avatar" style="background:${colors[i%6]}">${u.n.split(' ').map(x=>x[0]).join('')}</div><div><b style="font-size:13px">${u.n}</b></div></td>
            <td><span class="pill ${u.lvl}">${u.ll}</span></td>
            <td>${u.d}</td><td><b>${u.p}</b></td>
            <td class="small muted">${u.a}</td>
            <td><span class="risk-bar"><span class="risk-fill" style="width:${u.risk}%;background:${rc}"></span></span><b style="color:${rc};font-size:12px">${u.risk}%</b></td>
            <!-- КНОПКА УДАЛЕНА -->
        </tr>`;
    }).join('');
}
renderAudience();

function audCard(n, lvl, p) {
    openModal('Карточка подписчика', `
        <div style="display:flex;gap:14px;align-items:center;margin-bottom:18px"><div class="avatar" style="width:54px;height:54px;font-size:18px">${n.split(' ').map(x=>x[0]).join('')}</div><div><b style="font-size:17px">${n}</b><div class="small muted">${lvl} · заплатил ${p}</div></div></div>
        <b class="small">История активности</b>
        <div class="list-row"><i class="fa-solid fa-eye" style="color:var(--orange)"></i><span class="small">Прочитал «10 принципов UI»</span><span class="small muted" style="margin-left:auto">2 дня назад</span></div>
        <div class="list-row"><i class="fa-solid fa-heart" style="color:var(--orange)"></i><span class="small">Лайкнул подкаст #11</span><span class="small muted" style="margin-left:auto">5 дней назад</span></div>
        <div class="list-row"><i class="fa-solid fa-comment" style="color:var(--orange)"></i><span class="small">Оставил комментарий</span><span class="small muted" style="margin-left:auto">1 неделю назад</span></div>
    `,
    '<button class="btn btn-outline" onclick="toast(\'Подписчику присвоен бейдж\')">Наградить бейджем</button><button class="btn btn-primary" onclick="closeModal();toast(\'Открыт чат с подписчиком\')">Написать</button>');
}

// ============================================
// ЧАТЫ И КОММЕНТАРИИ
// ============================================




// ============================================
// МОДАЛЬНЫЕ ОКНА
// ============================================

function openModal(title, body, foot) {
    const modalBox = document.getElementById('modalBox');
    if (!modalBox) return;
    modalBox.innerHTML = `
        <div class="modal-head"><h3>${title}</h3><button class="close-x" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>
        <div class="modal-body">${body}</div>
        <div class="modal-foot">${foot || ''}</div>`;
    document.getElementById('modalBg').classList.add('show');
}

function closeModal() {
    document.getElementById('modalBg').classList.remove('show');
}

document.getElementById('modalBg').addEventListener('click', e => {
    if (e.target.id === 'modalBg') closeModal();
});

// ============================================
// РАБОТА С ВИДЕО
// ============================================

let selectedVideoFile = null;

function handleVideoDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('videoDropZone');
    if (dropZone) dropZone.style.borderColor = 'var(--line)';
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        handleVideoFile(files[0]);
    }
}

function handleVideoSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        handleVideoFile(files[0]);
    }
}

function handleVideoFile(file) {
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
        toast('❌ Пожалуйста, выберите видеофайл (MP4, MOV, AVI, WEBM)');
        return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
        toast('❌ Файл слишком большой. Максимум 100 MB');
        return;
    }
    
    selectedVideoFile = file;
    
    const fileInfo = document.getElementById('videoFileInfo');
    const fileName = document.getElementById('videoFileName');
    const fileSize = document.getElementById('videoFileSize');
    
    if (fileInfo && fileName && fileSize) {
        fileInfo.style.display = 'block';
        fileName.textContent = file.name;
        fileSize.textContent = ` (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    }
    
    toast(`✅ Выбран видеофайл: ${file.name}`);
}

function clearVideoFile() {
    selectedVideoFile = null;
    const fileInfo = document.getElementById('videoFileInfo');
    const fileInput = document.getElementById('videoFileInput');
    if (fileInfo) fileInfo.style.display = 'none';
    if (fileInput) fileInput.value = '';
    toast('🗑️ Видеофайл удалён');
}

// ============================================
// РАБОТА С ИЗОБРАЖЕНИЯМИ
// ============================================

let selectedImages = [];
let selectedCover = null;

function handleImageDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('imageDropZone');
    if (dropZone) dropZone.style.borderColor = 'var(--line)';
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        handleImageFiles(files);
    }
}

function handleImageSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        handleImageFiles(files);
    }
}

function handleImageFiles(files) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;
    
    for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
            toast(`❌ ${file.name} - неподдерживаемый формат`);
            continue;
        }
        if (file.size > maxSize) {
            toast(`❌ ${file.name} - слишком большой (>10 MB)`);
            continue;
        }
        if (selectedImages.length >= 10) {
            toast('❌ Максимум 10 изображений');
            break;
        }
        
        selectedImages.push(file);
        displayImagePreview(file);
    }
    
    const input = document.getElementById('imageFileInput');
    if (input) input.value = '';
}

function displayImagePreview(file) {
    const container = document.getElementById('imageFileInfo');
    if (!container) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const div = document.createElement('div');
        div.style.cssText = 'position:relative;width:80px;height:80px;border-radius:8px;overflow:hidden;border:1px solid var(--line);';
        div.innerHTML = `
            <img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">
            <button onclick="removeImage('${file.name}')" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border:none;border-radius:50%;background:rgba(0,0,0,0.6);color:white;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        container.appendChild(div);
        container.style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

function removeImage(filename) {
    selectedImages = selectedImages.filter(f => f.name !== filename);
    const container = document.getElementById('imageFileInfo');
    if (container) {
        const items = container.querySelectorAll('div');
        items.forEach(item => {
            if (item.querySelector(`button[onclick*="${filename}"]`)) {
                item.remove();
            }
        });
        if (container.children.length === 0) {
            container.style.display = 'none';
        }
    }
    toast(`🗑️ ${filename} удалён`);
}

function clearImages() {
    selectedImages = [];
    const container = document.getElementById('imageFileInfo');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }
    toast('🗑️ Все изображения удалены');
}

// ============================================
// РАБОТА С ОБЛОЖКОЙ
// ============================================

function handleCoverDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('coverDropZone');
    if (dropZone) dropZone.style.borderColor = 'var(--line)';
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        handleCoverFile(files[0]);
    }
}

function handleCoverSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        handleCoverFile(files[0]);
    }
}

function handleCoverFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        toast('❌ Неподдерживаемый формат для обложки');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        toast('❌ Файл обложки слишком большой (>10 MB)');
        return;
    }
    
    selectedCover = file;
    
    const fileInfo = document.getElementById('coverFileInfo');
    const fileName = document.getElementById('coverFileName');
    const fileSize = document.getElementById('coverFileSize');
    
    if (fileInfo && fileName && fileSize) {
        fileInfo.style.display = 'block';
        fileName.textContent = file.name;
        fileSize.textContent = ` (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    }
    
    toast(`✅ Обложка выбрана: ${file.name}`);
}

function clearCoverFile() {
    selectedCover = null;
    const fileInfo = document.getElementById('coverFileInfo');
    const fileInput = document.getElementById('coverFileInput');
    if (fileInfo) fileInfo.style.display = 'none';
    if (fileInput) fileInput.value = '';
    toast('🗑️ Обложка удалена');
}

// ============================================
// КАСТОМНЫЕ ПИКЕРЫ ДАТЫ/ВРЕМЕНИ
// ============================================

function padZero(n) { return String(n).padStart(2, '0'); }

function renderDatePicker(prefix, defaultDate) {
    const d = defaultDate || new Date();
    return `
    <div class="date-picker" id="${prefix}Picker">
        <div class="date-inputs">
            <input class="date-seg" id="${prefix}DD" type="text" maxlength="2" placeholder="ДД" value="${padZero(d.getDate())}" inputmode="numeric" data-next="${prefix}MM">
            <span class="date-sep">.</span>
            <input class="date-seg" id="${prefix}MM" type="text" maxlength="2" placeholder="ММ" value="${padZero(d.getMonth() + 1)}" inputmode="numeric" data-next="${prefix}YYYY">
            <span class="date-sep">.</span>
            <input class="date-seg date-seg-year" id="${prefix}YYYY" type="text" maxlength="4" placeholder="ГГГГ" value="${d.getFullYear()}" inputmode="numeric">
        </div>
    </div>`;
}

function renderDateTimePicker(defaultDate) {
    const d = defaultDate || new Date();

    return `
    <div class="date-picker" id="schedulePicker">
        <label class="field-label">Дата</label>
        <div class="date-inputs">
            <input class="date-seg" id="scheduleDD" type="text" maxlength="2" placeholder="ДД" value="${padZero(d.getDate())}" inputmode="numeric" data-next="scheduleMM">
            <span class="date-sep">.</span>
            <input class="date-seg" id="scheduleMM" type="text" maxlength="2" placeholder="ММ" value="${padZero(d.getMonth() + 1)}" inputmode="numeric" data-next="scheduleYYYY">
            <span class="date-sep">.</span>
            <input class="date-seg date-seg-year" id="scheduleYYYY" type="text" maxlength="4" placeholder="ГГГГ" value="${d.getFullYear()}" inputmode="numeric">
        </div>
        <label class="field-label" style="margin-top:14px">Время</label>
        <div class="time-inputs">
            <input class="time-seg" id="scheduleHH" type="text" maxlength="2" placeholder="ЧЧ" value="${padZero(d.getHours())}" inputmode="numeric" data-next="scheduleMi">
            <span class="date-sep">:</span>
            <input class="time-seg" id="scheduleMi" type="text" maxlength="2" placeholder="ММ" value="${padZero(Math.floor(d.getMinutes() / 15) * 15)}" inputmode="numeric">
        </div>
    </div>`;
}

function getDateTimePickerValue(prefix) {
    const dd = document.getElementById(prefix + 'DD')?.value?.trim();
    const mm = document.getElementById(prefix + 'MM')?.value?.trim();
    const yyyy = document.getElementById(prefix + 'YYYY')?.value?.trim();

    let hh = '10', mi = '00';
    const hhEl = document.getElementById(prefix + 'HH');
    const miEl = document.getElementById(prefix + 'Mi');
    if (hhEl) hh = hhEl.value.trim() || '10';
    if (miEl) mi = miEl.value.trim() || '00';

    if (!dd || !mm || !yyyy) return null;
    if (dd.length < 2 || mm.length < 2 || yyyy.length < 4) return null;

    const d = parseInt(dd), m = parseInt(mm), y = parseInt(yyyy);
    const h = parseInt(hh), n = parseInt(mi);
    if (isNaN(d) || isNaN(m) || isNaN(y) || isNaN(h) || isNaN(n)) return null;
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 2024) return null;
    if (h < 0 || h > 23 || n < 0 || n > 59) return null;

    const dt = new Date(y, m - 1, d, h, n);
    if (dt.getDate() !== d || dt.getMonth() !== m - 1) return null;

    return dt.toISOString();
}

document.addEventListener('click', function(e) {
    const chip = e.target.closest('.time-chip');
    if (chip) {
        const container = chip.closest('.time-chips');
        container.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    }
});

document.addEventListener('input', function(e) {
    if (e.target.classList.contains('date-seg') || e.target.classList.contains('time-seg')) {
        const seg = e.target;
        const val = seg.value.replace(/\D/g, '');
        seg.value = val;
        const maxLen = parseInt(seg.getAttribute('maxlength'));
        if (val.length >= maxLen && seg.dataset.next) {
            const next = document.getElementById(seg.dataset.next);
            if (next) next.focus();
        }
    }
});

document.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('date-seg') || e.target.classList.contains('time-seg')) {
        if (e.key === 'Backspace' && e.target.value === '' && e.target.dataset.prev) {
            const prev = document.getElementById(e.target.dataset.prev);
            if (prev) { prev.focus(); prev.select(); }
        }
        if (e.key === '.' || e.key === '-' || e.key === ':') {
            e.preventDefault();
            if (e.target.dataset.next) {
                const next = document.getElementById(e.target.dataset.next);
                if (next) next.focus();
            }
        }
    }
});

document.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('date-seg')) {
        if (e.key === 'Backspace' && e.target.value === '' && e.target.dataset.prev) {
            const prev = document.getElementById(e.target.dataset.prev);
            if (prev) { prev.focus(); prev.select(); }
        }
        if (e.key === '.' || e.key === '-') {
            e.preventDefault();
            if (e.target.dataset.next) {
                const next = document.getElementById(e.target.dataset.next);
                if (next) next.focus();
            }
        }
    }
});

// ============================================
// СОЗДАНИЕ КОНТЕНТА
// ============================================

function openCreateType() {
    const types = [
        ['Статья', 'fa-file-lines'],
        ['Видео', 'fa-play'],
        ['Аудио', 'fa-headphones'],
        ['Галерея', 'fa-images'],
        // ['Подкаст', 'fa-microphone']  ← УДАЛЕНО
        // ['Коллекция', 'fa-folder']  ← УДАЛЕНО
    ];
    openModal('Что создаём?', `<div class="grid-4" style="grid-template-columns:repeat(3,1fr);gap:12px">
        ${types.map(t => `<button class="quick-btn" onclick="openCreateForm('${t[0]}')">
            <i class="fa-solid ${t[1]}"></i><span>${t[0]}</span>
        </button>`).join('')}
    </div>`);
}

function openCreateForm(type) {
    const isVideo = type === 'Видео';
    
    const videoUploadField = isVideo ? `
        <div class="field">
            <label>Загрузить видео файл</label>
            <div style="border:2px dashed var(--line);border-radius:12px;padding:20px;text-align:center;cursor:pointer;" 
                 id="videoDropZone"
                 ondrop="handleVideoDrop(event)" 
                 ondragover="event.preventDefault();this.style.borderColor='var(--orange)';"
                 ondragleave="this.style.borderColor='var(--line)';">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size:32px;color:var(--muted);"></i>
                <p class="muted small" style="margin-top:8px;">Перетащите видео сюда или нажмите для выбора</p>
                <input type="file" id="videoFileInput" accept="video/*" style="display:none;" onchange="handleVideoSelect(event)">
                <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('videoFileInput').click()" style="margin-top:8px;">
                    <i class="fa-solid fa-folder-open"></i> Выбрать файл
                </button>
            </div>
            <div id="videoFileInfo" style="display:none;margin-top:8px;padding:12px;background:var(--bg);border-radius:8px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <i class="fa-solid fa-video" style="color:var(--orange);font-size:20px;"></i>
                    <div style="flex:1;">
                        <span id="videoFileName" style="font-weight:600;"></span>
                        <span class="small muted" id="videoFileSize"></span>
                    </div>
                    <button type="button" class="icon-btn" onclick="clearVideoFile()" style="width:30px;height:30px;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <div class="small muted" style="margin-top:4px;">Поддерживаются: MP4, MOV, AVI, WEBM. Максимум 100 MB</div>
        </div>
    ` : '';

    const imageUploadField = !isVideo ? `
        <div class="field">
            <label>Загрузить изображения</label>
            <div style="border:2px dashed var(--line);border-radius:12px;padding:20px;text-align:center;cursor:pointer;" 
                 id="imageDropZone"
                 ondrop="handleImageDrop(event)" 
                 ondragover="event.preventDefault();this.style.borderColor='var(--orange)';"
                 ondragleave="this.style.borderColor='var(--line)';">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size:32px;color:var(--muted);"></i>
                <p class="muted small" style="margin-top:8px;">Перетащите изображения сюда или нажмите для выбора</p>
                <input type="file" id="imageFileInput" accept="image/*" multiple style="display:none;" onchange="handleImageSelect(event)">
                <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('imageFileInput').click()" style="margin-top:8px;">
                    <i class="fa-solid fa-folder-open"></i> Выбрать изображения
                </button>
            </div>
            <div id="imageFileInfo" style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px;"></div>
            <div class="small muted" style="margin-top:4px;">Поддерживаются: JPG, PNG, GIF, WEBP. Максимум 10 MB на файл. Можно выбрать до 10 изображений</div>
        </div>
    ` : '';

    const coverField = `
        <div class="field">
            <label>Обложка (главное изображение)</label>
            <div style="border:2px dashed var(--line);border-radius:12px;padding:20px;text-align:center;cursor:pointer;" 
                 id="coverDropZone"
                 ondrop="handleCoverDrop(event)" 
                 ondragover="event.preventDefault();this.style.borderColor='var(--orange)';"
                 ondragleave="this.style.borderColor='var(--line)';">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size:32px;color:var(--muted);"></i>
                <p class="muted small" style="margin-top:8px;">Перетащите изображение обложки или нажмите для выбора</p>
                <input type="file" id="coverFileInput" accept="image/*" style="display:none;" onchange="handleCoverSelect(event)">
                <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('coverFileInput').click()" style="margin-top:8px;">
                    <i class="fa-solid fa-folder-open"></i> Выбрать обложку
                </button>
            </div>
            <div id="coverFileInfo" style="display:none;margin-top:8px;padding:12px;background:var(--bg);border-radius:8px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <i class="fa-solid fa-image" style="color:var(--orange);font-size:20px;"></i>
                    <div style="flex:1;">
                        <span id="coverFileName" style="font-weight:600;"></span>
                        <span class="small muted" id="coverFileSize"></span>
                    </div>
                    <button type="button" class="icon-btn" onclick="clearCoverFile()" style="width:30px;height:30px;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <div class="small muted" style="margin-top:4px;">Рекомендуемый размер: 1200x630px. Максимум 10 MB</div>
        </div>
    `;

    openModal('Создать: ' + type, `
        <form id="createContentForm" onsubmit="return false;">
            <div class="field">
                <label>Заголовок <span style="color:var(--red)">*</span></label>
                <div class="ai-input">
                    <input id="contentTitle" placeholder="Введите заголовок..." required>
                    <button type="button" class="ai-btn" onclick="toast('AI предложил 5 вариантов заголовка')">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </button>
                </div>
            </div>
            <div class="field">
                <label>Краткое описание <span class="muted small">(до 500 символов)</span></label>
                <textarea id="contentDescription" rows="2" placeholder="Опишите материал..."></textarea>
            </div>
            ${videoUploadField}
            ${imageUploadField}
            ${coverField}
            <div class="field">
                <label>Теги</label>
                <input id="contentTags" placeholder="дизайн, figma, ui">
            </div>
            <div class="field">
                <label>Цена (если платный)</label>
                <input id="contentPrice" type="number" placeholder="0" value="0">
            </div>
            <div class="field">
                <label>Доступ</label>
                <div class="radio-group" role="radiogroup">
                    <div class="radio-opt sel" tabindex="0" role="radio" aria-checked="true" data-value="free">
                        <i class="fa-solid fa-globe"></i>
                        <div><b>Бесплатно</b><p>Для всех</p></div>
                    </div>
                    <div class="radio-opt" tabindex="0" role="radio" aria-checked="false" data-value="subscription">
                        <i class="fa-solid fa-crown"></i>
                        <div><b>По подписке</b><p>Для подписчиков</p></div>
                    </div>
                    <div class="radio-opt" tabindex="0" role="radio" aria-checked="false" data-value="paid">
                        <i class="fa-solid fa-ruble-sign"></i>
                        <div><b>Разовая покупка</b><p>Указать цену</p></div>
                    </div>
                </div>
            </div>
        </form>
    `,
    `<button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
     <button class="btn btn-outline" onclick="saveContent('draft')"><i class="fa-solid fa-pen"></i> Черновик</button>
     <button class="btn btn-outline" onclick="openSchedulePicker()"><i class="fa-solid fa-calendar"></i> Запланировать</button>
     <button class="btn btn-primary" onclick="saveContent('published')"><i class="fa-solid fa-paper-plane"></i> Опубликовать</button>`
    );
}

function selRadio(el) {
    const parent = el.parentElement;
    if (parent) {
        parent.querySelectorAll('.radio-opt').forEach(o => {
            o.classList.remove('sel');
            o.setAttribute('aria-checked', 'false');
        });
    }
    el.classList.add('sel');
    el.setAttribute('aria-checked', 'true');
}

document.addEventListener('click', function(e) {
    const radio = e.target.closest('.radio-opt');
    if (radio) selRadio(radio);
});

document.addEventListener('keydown', function(e) {
    const radio = e.target.closest('.radio-opt');
    if (radio && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        selRadio(radio);
    }
});

// ============================================
// СОХРАНЕНИЕ КОНТЕНТА
// ============================================

let pendingScheduledDate = null;
let snapshotForm = null;

function snapshotContentForm() {
    const selectedRadio = document.querySelector('.radio-opt.sel');
    return {
        title: document.getElementById('contentTitle')?.value?.trim() || '',
        description: document.getElementById('contentDescription')?.value?.trim() || '',
        tags: document.getElementById('contentTags')?.value?.trim() || '',
        price: parseInt(document.getElementById('contentPrice')?.value) || 0,
        access: selectedRadio ? selectedRadio.dataset.value : 'free',
        type: document.querySelector('.modal-head h3')?.textContent?.replace('Создать: ', '') || ''
    };
}

function openSchedulePicker() {
    const form = snapshotContentForm();
    if (!form.title) {
        toast('❌ Сначала введите заголовок!');
        return;
    }

    snapshotForm = form;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    openModal('Запланировать публикацию', `
        <p class="small muted" style="margin-bottom:16px">Выберите дату и время публикации</p>
        ${renderDateTimePicker(tomorrow)}
    `,
    `<button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
     <button class="btn btn-primary" onclick="confirmSchedule()"><i class="fa-solid fa-calendar-check"></i> Запланировать</button>`);
}

function confirmSchedule() {
    const val = getDateTimePickerValue('schedule');
    if (!val) {
        toast('❌ Заполните дату и время!');
        return;
    }
    if (new Date(val) <= new Date()) {
        toast('❌ Дата должна быть в будущем!');
        return;
    }
    pendingScheduledDate = val;
    closeModal();
    saveContent('scheduled');
}

async function saveContent(status) {
    try {
        const data = snapshotForm || {};
        snapshotForm = null;

        const title = data.title || document.getElementById('contentTitle')?.value?.trim() || '';
        const description = data.description || document.getElementById('contentDescription')?.value?.trim() || '';
        const tags = data.tags || document.getElementById('contentTags')?.value?.trim() || '';
        const price = data.price || parseInt(document.getElementById('contentPrice')?.value) || 0;
        const access = data.access || (() => {
            const r = document.querySelector('.radio-opt.sel');
            return r ? r.dataset.value : 'free';
        })();
        const scheduledFor = status === 'scheduled' ? pendingScheduledDate : null;
        
        if (!title) {
            toast('❌ Введите заголовок!');
            return;
        }
        
        if (description && description.length > 500) {
            toast('❌ Описание не должно превышать 500 символов! (' + description.length + '/500)');
            return;
        }

        if (access === 'paid' && price <= 0) {
            toast('❌ Укажите цену для платного контента!');
            return;
        }

        if (status === 'scheduled' && !scheduledFor) {
            toast('❌ Укажите дату публикации!');
            return;
        }

        if (scheduledFor && new Date(scheduledFor) <= new Date()) {
            toast('❌ Дата публикации должна быть в будущем!');
            return;
        }
        
        const typeMap = {
            'Статья': 'article',
            'Видео': 'video',
            'Аудио': 'audio',
            'Галерея': 'gallery',
            'Подкаст': 'podcast',
            'Коллекция': 'collection'
        };
        const contentType = typeMap[data.type] || 'article';
        
        let videoData = null;
        let imagesData = [];
        let coverData = null;
        
        // Загрузка видео
        if (contentType === 'video' && selectedVideoFile) {
            const formData = new FormData();
            formData.append('video', selectedVideoFile);
            
            toast('⏳ Загрузка видео...');
            
            const uploadResponse = await fetch('/api/upload/video', {
                method: 'POST',
                body: formData
            });
            
            const uploadResult = await uploadResponse.json();
            
            if (!uploadResult.success) {
                toast('❌ Ошибка загрузки видео: ' + (uploadResult.message || 'Неизвестная ошибка'));
                return;
            }
            
            videoData = uploadResult.data;
            toast('✅ Видео загружено!');
        } else if (contentType === 'video' && !selectedVideoFile) {
            toast('⚠️ Для видео контента нужно загрузить видеофайл!');
            return;
        }
        
        // Загрузка изображений
        if (contentType !== 'video' && selectedImages.length > 0) {
            const formData = new FormData();
            selectedImages.forEach(file => {
                formData.append('images', file);
            });
            
            toast(`⏳ Загрузка ${selectedImages.length} изображений...`);
            
            const uploadResponse = await fetch('/api/upload/images', {
                method: 'POST',
                body: formData
            });
            
            const uploadResult = await uploadResponse.json();
            
            if (!uploadResult.success) {
                toast('❌ Ошибка загрузки изображений: ' + (uploadResult.message || 'Неизвестная ошибка'));
                return;
            }
            
            imagesData = uploadResult.data;
            toast(`✅ ${imagesData.length} изображений загружено!`);
        }
        
        // Загрузка обложки
        if (selectedCover) {
            const formData = new FormData();
            formData.append('images', selectedCover);
            
            toast('⏳ Загрузка обложки...');
            
            const uploadResponse = await fetch('/api/upload/images', {
                method: 'POST',
                body: formData
            });
            
            const uploadResult = await uploadResponse.json();
            
            if (uploadResult.success && uploadResult.data.length > 0) {
                coverData = uploadResult.data[0];
                toast('✅ Обложка загружена!');
            }
        }
        
        const contentData = {
            title,
            type: contentType,
            description: description || '',
            tags: tags || '',
            access,
            price: access === 'paid' ? price : 0,
            status: status || 'draft',
            scheduledFor: scheduledFor || null,
            videoUrl: videoData ? videoData.url : null,
            videoFile: videoData ? {
                filename: videoData.filename,
                originalName: videoData.originalName,
                path: videoData.url,
                size: videoData.size,
                mimetype: videoData.mimetype
            } : null,
            images: imagesData.map(img => ({
                filename: img.filename,
                originalName: img.originalName,
                path: img.url,
                size: img.size,
                mimetype: img.mimetype
            })),
            coverImage: coverData ? coverData.url : null
        };
        
        console.log('📤 Отправка данных:', contentData);
        
        const response = await fetch('/api/content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contentData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            const statusMessages = {
                'draft': 'сохранён как черновик 💾',
                'scheduled': 'запланирован 📅',
                'published': 'опубликован 🎉'
            };
            toast(`✅ Материал "${title}" ${statusMessages[status] || 'сохранён'}`);
            closeModal();
            
            // Очищаем выбранные файлы
            selectedVideoFile = null;
            selectedImages = [];
            selectedCover = null;
            pendingScheduledDate = null;
            
            await loadContentTable();
            renderTopContent();
        } else {
            toast('❌ Ошибка: ' + (result.message || 'Не удалось сохранить'));
        }
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
        toast('❌ Ошибка подключения к серверу. Проверьте, запущен ли он (npm run dev)');
    }
}

// ============================================
// МОДАЛКИ
// ============================================

function openTier(name) {
    openModal(name ? 'Редактировать уровень' : 'Новый уровень подписки', `
        <div class="field"><label>Название <span style="color:var(--red)">*</span></label><input id="tierName" value="${name || ''}" placeholder="Например, Премиум"></div>
        <div class="cols-2">
            <div class="field"><label>Цена / месяц (₽) <span style="color:var(--red)">*</span></label><input id="tierPriceMonth" type="number" value="${name ? '499' : ''}" min="0"></div>
            <div class="field"><label>Цена / год (₽)</label><input id="tierPriceYear" type="number" placeholder="0" min="0"></div>
        </div>
        <div class="field"><label>Описание</label><textarea id="tierDescription" rows="2" placeholder="Доступ к закрытым гайдам, чату и подкастам"></textarea></div>
        <div class="field"><label>Преимущества (через запятую)</label><input id="tierBenefits" placeholder="Видео-уроки, закрытый чат"></div>
    `,
    `<button class="btn btn-ghost" onclick="closeModal()">Отмена</button><button class="btn btn-primary" onclick="saveTier()">Сохранить</button>`);
}

function saveTier() {
    const name = document.getElementById('tierName')?.value?.trim();
    const priceMonth = parseInt(document.getElementById('tierPriceMonth')?.value);

    if (!name) {
        toast('❌ Введите название уровня!');
        return;
    }
    if (!priceMonth || priceMonth < 0) {
        toast('❌ Укажите корректную цену за месяц!');
        return;
    }

    closeModal();
    toast('✅ Уровень подписки «' + name + '» сохранён');
}

function openPromo() {
    openModal('Создать промокод', `
        <div class="cols-2">
            <div class="field"><label>Код <span style="color:var(--red)">*</span></label><input id="promoCode" placeholder="SUMMER30"></div>
            <div class="field"><label>Тип скидки</label><select id="promoType"><option value="percentage">Процент (%)</option><option value="fixed">Фиксированная (₽)</option></select></div>
        </div>
        <div class="cols-2">
            <div class="field"><label>Размер скидки <span style="color:var(--red)">*</span></label><input id="promoValue" type="number" placeholder="30" min="1"></div>
            <div class="field"><label>Лимит использований</label><input id="promoLimit" type="number" placeholder="100" min="1" value="100"></div>
        </div>
        <div class="field"><label>Срок действия до <span style="color:var(--red)">*</span></label>${renderDatePicker('promo')}</div>
    `,
    `<button class="btn btn-ghost" onclick="closeModal()">Отмена</button><button class="btn btn-primary" onclick="savePromo()">Создать</button>`);
}

function savePromo() {
    const code = document.getElementById('promoCode')?.value?.trim();
    const value = parseInt(document.getElementById('promoValue')?.value);
    const date = getDateTimePickerValue('promo');

    if (!code) {
        toast('❌ Введите код промокода!');
        return;
    }
    if (!value || value <= 0) {
        toast('❌ Укажите размер скидки!');
        return;
    }
    if (!date) {
        toast('❌ Укажите срок действия!');
        return;
    }
    if (new Date(date) <= new Date()) {
        toast('❌ Срок действия должен быть в будущем!');
        return;
    }

    closeModal();
    toast('✅ Промокод ' + code.toUpperCase() + ' создан');
}

function openWithdraw() {
    openModal('Вывод средств', `
        <div class="card" style="background:var(--orange-soft);border:none;margin-bottom:16px"><div class="small muted">Доступно к выводу</div><div class="balance-big" style="color:var(--orange-dark)">42 891 ₽</div></div>
        <div class="field"><label>Сумма (мин. 500 ₽) <span style="color:var(--red)">*</span></label><input id="withdrawAmount" type="number" value="42891" min="500"></div>
        <div class="field"><label>Способ вывода</label><select id="withdrawMethod"><option>Карта •••• 4821</option><option>Банковский счёт</option></select></div>
        <div class="list-row"><span class="small">Автовывод при достижении 1 000 ₽ каждый день</span><div class="switch" tabindex="0" role="switch" aria-checked="false" style="margin-left:auto" onclick="toggleSwitch(this);toast('Мгновенные мини-выплаты настроены')"></div></div>
    `,
    `<button class="btn btn-ghost" onclick="closeModal()">Отмена</button><button class="btn btn-primary" onclick="saveWithdraw()">Вывести деньги</button>`);
}

function saveWithdraw() {
    const amount = parseInt(document.getElementById('withdrawAmount')?.value);
    const available = 42891;

    if (!amount || amount < 500) {
        toast('❌ Минимальная сумма вывода — 500 ₽');
        return;
    }
    if (amount > available) {
        toast('❌ Недостаточно средств. Доступно: ' + available + ' ₽');
        return;
    }

    closeModal();
    toast('✅ Заявка на вывод ' + amount.toLocaleString('ru') + ' ₽ принята · статус: обработка');
}

// ============================================
// НАСТРОЙки
// ============================================

function saveSettings() {
    const nameInput = document.querySelector('#page-settings input[value="Иван Соколов"]');
    if (nameInput && !nameInput.value.trim()) {
        toast('❌ Имя не может быть пустым!');
        return;
    }
    toast('✅ Профиль сохранён');
}

function sendFeedback() {
    const textarea = document.querySelector('#page-help textarea');
    if (textarea && !textarea.value.trim()) {
        toast('❌ Введите сообщение!');
        return;
    }
    toast('✅ Спасибо! Сообщение отправлено в поддержку');
    textarea.value = '';
}

function toggleSwitch(el) {
    el.classList.toggle('on');
    el.setAttribute('aria-checked', el.classList.contains('on'));
}

document.addEventListener('keydown', function(e) {
    const sw = e.target.closest('.switch');
    if (sw && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        sw.click();
    }
});

// ============================================
// TOAST
// ============================================

function toast(msg) {
    const w = document.getElementById('toastWrap');
    if (!w) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    w.appendChild(t);
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateY(10px)';
        setTimeout(() => t.remove(), 300);
    }, 2600);
}

// ============================================
// ТЁМНАЯ ТЕМА
// ============================================

let dark = false;

function toggleTheme() {
    dark = !dark;
    const root = document.documentElement;
    const body = document.body;
    
    if (dark) {
        // Тёмная тема
        root.style.setProperty('--bg', '#16161A');
        root.style.setProperty('--card', '#1F1F24');
        root.style.setProperty('--ink', '#F4F4F5');
        root.style.setProperty('--muted', '#A1A1AA');
        root.style.setProperty('--line', '#2D2D33');
        root.style.setProperty('--orange-soft', '#3A2615');
        
        // Pill
        root.style.setProperty('--pill-base-bg', '#2D2D33');
        root.style.setProperty('--pill-base-text', '#F4F4F5');
        root.style.setProperty('--pill-prem-bg', '#4A2A1A');
        root.style.setProperty('--pill-prem-text', '#FF8A4A');
        root.style.setProperty('--pill-vip-bg', '#2A1A4A');
        root.style.setProperty('--pill-vip-text', '#B47AFF');
        
        // Chip (новые переменные)
        root.style.setProperty('--chip-bg', '#2D2D33');
        root.style.setProperty('--chip-text', '#F4F4F5');
        root.style.setProperty('--chip-border', '#3D3D44');
        root.style.setProperty('--chip-active-bg', '#F4F4F5');
        root.style.setProperty('--chip-active-text', '#1A1A1F');
        
        document.getElementById('themeIcon').className = 'fa-solid fa-sun';
        document.getElementById('themeText').textContent = 'Светлая тема';
        
        body.classList.add('dark-theme');
    } else {
        // Светлая тема
        root.style.setProperty('--bg', '#F7F7F8');
        root.style.setProperty('--card', '#FFFFFF');
        root.style.setProperty('--ink', '#1A1A1F');
        root.style.setProperty('--muted', '#71717A');
        root.style.setProperty('--line', '#ECECEF');
        root.style.setProperty('--orange-soft', '#FFF1E8');
        
        // Pill
        root.style.setProperty('--pill-base-bg', '#F4F4F5');
        root.style.setProperty('--pill-base-text', '#1A1A1F');
        root.style.setProperty('--pill-prem-bg', '#FFF1E8');
        root.style.setProperty('--pill-prem-text', '#E85A0C');
        root.style.setProperty('--pill-vip-bg', '#FAF5FF');
        root.style.setProperty('--pill-vip-text', '#9333EA');
        
        // Chip
        root.style.setProperty('--chip-bg', '#FFFFFF');
        root.style.setProperty('--chip-text', '#71717A');
        root.style.setProperty('--chip-border', '#ECECEF');
        root.style.setProperty('--chip-active-bg', '#1A1A1F');
        root.style.setProperty('--chip-active-text', '#FFFFFF');
        
        document.getElementById('themeIcon').className = 'fa-solid fa-moon';
        document.getElementById('themeText').textContent = 'Тёмная тема';
        
        body.classList.remove('dark-theme');
    }
}

// ============================================
// AI АССИСТЕНТ
// ============================================



// ============================================
// ЗАГРУЗКА ПРИ СТАРТЕ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('page-content')) {
        loadContentTable();
    }
    
    renderTopContent();
    
    console.log('✅ Creator Dashboard готов к работе!');
});