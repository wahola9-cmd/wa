import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
const IS_TABLET = window.matchMedia('(max-width: 1024px)').matches;

/* Boards horizontales 16:9 */
const BOARD_ASPECT = '16 / 9';

/* localStorage seguro */
const safeStorage = {
    get(k, fallback) { try { return localStorage.getItem(k) || fallback; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignorar */ } }
};

/* =========================================================
   HABILIDADES
   ========================================================= */
const SKILLS = {
    creatividad: [
        { title: 'DIRECCIÓN DE ARTE', desc: 'Visión coherente entre concepto, tono y ejecución visual.', level: 88 },
        { title: 'CONCEPTUALIZACIÓN CREATIVA', desc: 'Ideas basadas en insights que resuelven problemas reales.', level: 90 },
        { title: 'DESARROLLO DE CAMPAÑAS', desc: 'Campañas integradas, desde la estrategia hasta la ejecución.', level: 85 },
        { title: 'BRANDING E IDENTIDAD VISUAL', desc: 'Posicionamiento e identidad que conectan con las audiencias.', level: 87 },
        { title: 'STORYTELLING VISUAL', desc: 'Insights convertidos en narrativas que humanizan marcas.', level: 85 },
        { title: 'PRESENTACIÓN VISUAL DE CAMPAÑAS', desc: 'Boards, decks y defensas que venden la idea.', level: 90 },
        { title: 'PENSAMIENTO ESTRATÉGICO', desc: 'Decisiones creativas alineadas a objetivos de marca.', level: 82 }
    ],
    fotografia: [
        { title: 'FOTOGRAFÍA DE PRODUCTO', desc: 'Captura y edición para campañas y redes.', level: 82 },
        { title: 'DIRECCIÓN DE ARTE', desc: 'Estética, paleta y referencias visuales de cada producción.', level: 87 },
        { title: 'PRODUCCIÓN AUDIOVISUAL', desc: 'Coordinación de rodajes y piezas para video.', level: 80 },
        { title: 'EDICIÓN DE VIDEO', desc: 'Montaje y postproducción en Premiere Pro y CapCut.', level: 82 },
        { title: 'RETOQUE', desc: 'Edición profesional en Photoshop y Lightroom.', level: 85 }
    ],
    diseno: [
        { title: 'ADOBE ILLUSTRATOR', desc: 'Vectores, logotipos e ilustración.', level: 88 },
        { title: 'ADOBE PHOTOSHOP', desc: 'Composición, retoque y arte final.', level: 90 },
        { title: 'ADOBE PREMIERE PRO', desc: 'Edición y postproducción de video.', level: 82 },
        { title: 'CANVA', desc: 'Piezas rápidas y contenido para redes.', level: 85 },
        { title: 'CAPCUT', desc: 'Edición ágil de video para social media.', level: 88 },
        { title: 'GOOGLE WORKSPACE', desc: 'Colaboración y documentos en la nube.', level: 90 },
        { title: 'MICROSOFT OFFICE', desc: 'Word, Excel y PowerPoint.', level: 85 }
    ],
    analitica: [
        { title: 'INVESTIGACIÓN DE MERCADO', desc: 'Insights y benchmarking competitivo.', level: 82 },
        { title: 'TRABAJO COLABORATIVO', desc: 'Duplas creativas y equipos de agencia.', level: 92 },
        { title: 'ATENCIÓN AL DETALLE', desc: 'Revisión fina de cada pieza antes de salir.', level: 90 },
        { title: 'APLICACIÓN DE FEEDBACK', desc: 'Incorporar críticas para mejorar estrategia y ejecución.', level: 88 }
    ],
    ia: [
        { title: 'INGENIERÍA DE PROMPTS', desc: 'Prompts para generación visual y copy.', level: 88 },
        { title: 'MIDJOURNEY', desc: 'Imágenes conceptuales generadas con IA.', level: 85 },
        { title: 'CHATGPT / CLAUDE', desc: 'Lluvia de ideas, apoyo creativo y copywriting.', level: 90 },
        { title: 'IA PARA VIDEO', desc: 'Runway, Pika y edición asistida por IA.', level: 75 },
        { title: 'AUTOMATIZACIONES', desc: 'Flujos con Zapier y Make.', level: 70 }
    ]
};

/* =========================================================
   PROYECTOS
   ========================================================= */
const PROJECTS = [
    {
        type: 'single',
        title: 'A TU REVÉS',
        code: 'TRK-001 / APAP 2026',
        category: 'Campaña social · Batimix',
        desc: 'Propuesta de campaña para Batimix dentro del marco APAP 2026. El reto era conectar con una audiencia joven desde un tema sensible, con un tono cercano y honesto.',
        tag: 'CAMPAÑA APAP',
        tags: ['Batimix', 'Campaña', 'APAP 2026'],
        accent: '#b026ff',
        logo: 'https://res.cloudinary.com/mtjqlf2y/image/upload/w_600,q_auto,f_auto/v1791545574/2.png',
        image: null,
        award: 'SHORTLIST · JÓVENES TALENTOS APAP',
        awardType: 'pink',
        pieces: [
            { label: 'BOARD DE IDEA', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1792041410/Board_APAP.png', embed: null, format: 'post', aspect: BOARD_ASPECT },
            { label: 'VIDEOCASE', image: null, embed: 'https://player.vimeo.com/video/1236020803', format: 'video', aspect: '16/9' }
        ]
    },
    {
        type: 'single',
        title: 'DISNEY',
        code: 'TRK-002 / CLIO ENTERTAINMENT 2026',
        category: 'Participación · Disney',
        desc: 'Participación en Clio Entertainment 2026 con StorIA Waves, una propuesta para Disney que convierte sus historias más icónicas en experiencias de radio inmersivas para comunidades rurales sin acceso a pantallas. Cuentos adaptados con IA y narrados en idiomas locales.',
        tag: 'OJO IBEROAMÉRICA',
        tags: ['Disney', 'StorIA Waves', '2026'],
        accent: '#3b82f6',
        logo: 'https://res.cloudinary.com/mtjqlf2y/image/upload/w_600,q_auto,f_auto/v1792017735/Gemini_Generated_Image_oop5o9oop5o9oop5.jpg',
        image: null,
        award: 'SHORTLIST · CLIO ENTERTAINMENT',
        awardType: 'pink',

        pieces: [
            { label: 'BOARD DE IDEA', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1792017410/StorIA_Waves_board.png', embed: null, format: 'post', aspect: BOARD_ASPECT },
            { label: 'VIDEOCASE', image: null, embed: 'https://player.vimeo.com/video/1236012512', format: 'video', aspect: '16/9' }
        ]
    },
    {
        type: 'single',
        title: 'PURRP HERTS',
        code: 'TRK-003 / YOUNG ONES 2026',
        category: 'Idea creativa · Whiskas',
        desc: 'Desarrollo de la idea creativa y ejecución visual de las piezas para el brief de Whiskas en Young Ones 2026.',
        tag: 'YOUNG ONES',
        tags: ['Whiskas', 'Young Ones', 'Board'],
        accent: '#e91e63',
        logo: 'https://res.cloudinary.com/mtjqlf2y/image/upload/w_600,q_auto,f_auto/v1791545574/4.png',
        image: null,
        award: 'SHORTLIST · ESTUDIANTES',
        awardType: 'pink',
        pieces: [
            { label: 'BOARD DE IDEA', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1792017421/DUO_VPN.png', embed: null, format: 'post', aspect: BOARD_ASPECT },
            { label: 'VIDEOCASE', image: null, embed: 'https://player.vimeo.com/video/1236022699', format: 'video', aspect: '16/9' }
        ]
    },
    {
        type: 'folder',
        title: 'LIKEAGENCIA',
        code: 'TRK-004 / TRAINEE 2026',
        category: 'Agencia · 2026',
        desc: 'Mi paso como trainee por LikeAgencia. Aquí están las tres cuentas que manejé y una selección de piezas de social media por cada una, presentadas dentro de un mockup de Instagram para que se vean tal como salieron al aire.',
        tag: 'DISEÑO SOCIAL MEDIA',
        tags: ['Agencia', 'Social Media', '2026'],
        accent: '#b026ff',
        logo: 'https://res.cloudinary.com/mtjqlf2y/image/upload/w_600,q_auto,f_auto/v1791545572/1.png',
        award: null,
        accounts: [
            {
                name: 'CUENTA 01 · IMAGEM FILMS PERÚ',
                subtitle: 'Productora audiovisual',
                pieces: [
                    { label: 'PIEZA 01', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791542686/WhatsApp_Image_2026-10-09_at_12.00.13_AM_1.jpg', format: 'post', account: 'imagemfilmsperu', likes: '1,204', caption: 'Detrás de cámaras, siempre. 🎬', comments: 'Ver los 42 comentarios', time: 'HACE 2 HORAS' },
                    { label: 'PIEZA 02', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791542686/WhatsApp_Image_2026-10-09_at_12.00.12_AM_1.jpg', format: 'post', account: 'imagemfilmsperu', likes: '876', caption: 'Nueva producción en camino. 🎥', comments: 'Ver los 18 comentarios', time: 'HACE 5 HORAS' },
                    { label: 'PIEZA 03', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791542685/WhatsApp_Image_2026-10-09_at_12.00.12_AM_2.jpg', format: 'post', account: 'imagemfilmsperu', likes: '2,341', caption: 'El equipo lo dio todo. 🔥', comments: 'Ver los 87 comentarios', time: 'HACE 1 DÍA' }
                ]
            },
            {
                name: 'CUENTA 02 · DIVERTICENTER',
                subtitle: 'Centro de entretenimiento',
                pieces: [
                    { label: 'STORIE 01', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791543292/WhatsApp_Image_2026-10-09_at_12.00.12_AM_4.jpg', format: 'story', account: 'diverticenter', time: '2h' },
                    { label: 'POST 01 · A LOS 80s', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791543009/Un_viaje_en_el_tiempo_nos_llev%C3%B3_a_los_80s.Si_hubieras_estado_aqu%C3%AD_qu%C3%A9_juego_probar%C3%ADas_sin_falta.jpg', format: 'post', account: 'diverticenter', likes: '3,412', caption: 'Un viaje en el tiempo nos llevó a los 80s. Si hubieras estado aquí, ¿qué juego probarías sin falta?', comments: 'Ver los 156 comentarios', time: 'HACE 1 DÍA' },
                    { label: 'STORIE 02', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791543294/WhatsApp_Image_2026-10-09_at_12.18.53_AM.jpg', format: 'story', account: 'diverticenter', time: '3h' }
                ]
            },
            {
                name: 'CUENTA 03 · ENGLISH CONNECTIONS',
                subtitle: 'Academia de idiomas',
                pieces: [
                    { label: 'STORIE 01', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791543336/WhatsApp_Image_2026-10-09_at_12.18.53_AM_2.jpg', format: 'story', account: 'englishconnections', time: '4h' },
                    { label: 'STORIE 02', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791543339/WhatsApp_Image_2026-10-09_at_12.18.53_AM_1.jpg', format: 'story', account: 'englishconnections', time: '5h' },
                    { label: 'POST 01 · IDIOMA', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791543336/Un_idioma._Infinitas_posibilidades._Viajar.Estudiar.Trabajar.Conocer_nuevas_culturas.Aprender.jpg', format: 'post', account: 'englishconnections', likes: '1,876', caption: 'Un idioma. Infinitas posibilidades. Viajar. Estudiar. Trabajar. Conocer nuevas culturas. Aprender.', comments: 'Ver los 64 comentarios', time: 'HACE 2 DÍAS' }
                ]
            }
        ]
    },
    {
        type: 'single',
        title: 'PROACTIVIDADES',
        code: 'TRK-005 / ARCHIVO BONUS',
        category: 'Proactividades',
        desc: 'Desarrollo de proactividades junto a duplas, con participación en el proceso creativo y foco en la bajada visual de las ideas.',
        tag: 'PROACTIVIDADES',
        tags: ['Prints', 'Proactividades', '2026'],
        accent: '#3b82f6',
        logo: 'https://res.cloudinary.com/mtjqlf2y/image/upload/w_600,q_auto,f_auto/v1792017735/Gemini_Generated_Image_oop5o9oop5o9oop5.jpg',
        image: null,
        award: null,
        pieces : [
            {
                name: 'PROACTIVIDAD 01 · #HazTuChequeoDeMama',
                subtitle: 'Prints inspirados en las chuspas monedero y la costumbre de guardar el dinero en el pecho.',
                pieces: [ 
                    { label: 'MOTIVO 01', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1792653713/PRINTS_PROACTIVIDADES_1__page-0001.jpg', embed: null, format: 'post', aspect: BOARD_ASPECT },
                    { label: 'MOTIVO 02', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1792653717/PRINTS_PROACTIVIDADES_1__page-0002.jpg', embed: null, format: 'post', aspect: BOARD_ASPECT },
                    { label: 'MOTIVO 03', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1792653714/PRINTS_PROACTIVIDADES_1__page-0003.jpg', embed: null, format: 'post', aspect: BOARD_ASPECT }
]
        }
    ]
},          
{           
        type: 'folder',
        title: 'ILUSTRACIONES',
        code: 'TRK-006 / ARCHIVO PERSONAL',
        category: 'Proyecto personal · 2022 — hoy',
        desc: 'Mi archivo personal de ilustración. Aquí guardo piezas sueltas, experimentos, bocetos y esas ideas que se me ocurren a las 2 a. m. y que igual termino subiendo.',
        tag: 'PROYECTO PERSONAL',
        tags: ['Ilustración', 'Archivo', 'Personal'],
        accent: '#d946ef',
        logo: 'https://res.cloudinary.com/mtjqlf2y/image/upload/w_600,q_auto,f_auto/v1791537559/oriana-ilustracion.png',
        award: null,
        items: [
            { label: 'ILUSTRACIÓN 01', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791546664/WhatsApp_Image_2026-10-09_at_6.45.53_AM.jpg' },
            { label: 'ILUSTRACIÓN 02', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791546664/WhatsApp_Image_2026-10-09_at_6.45.53_AM_1.jpg' },
            { label: 'ILUSTRACIÓN 03', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791546664/She_s_so_talented_and_beautiful_7u7_lunamartinezoficial_lunamartinez_makeupartist_youtub.jpg' },
            { label: 'ILUSTRACIÓN 04', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791546664/WhatsApp_Image_2026-10-09_at_6.45.53_AM_2.jpg' },
            { label: 'ILUSTRACIÓN 05', image: 'https://res.cloudinary.com/mtjqlf2y/image/upload/v1791546665/not_me_being_very_late_coming_back_after_a_year_and_pretending_I_never_left_hi_there_-3Origin.jpg' }
        ]
    }
];

/* =========================================================
   TYPEWRITER
   ========================================================= */
const TYPEWRITER_PHRASES = [
    'Diseñadora publicitaria',
    'Estudiante de Diseño Publicitario',
    'Futura directora de arte',
    'Ilustradora'
];

function setupTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    let phraseIndex = 0, charIndex = 0, deleting = false;
    function tick() {
        const current = TYPEWRITER_PHRASES[phraseIndex];
        if (!deleting) {
            charIndex++;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) { deleting = true; setTimeout(tick, 1800); return; }
            setTimeout(tick, 55 + Math.random() * 45);
        } else {
            charIndex--;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES.length; setTimeout(tick, 350); return; }
            setTimeout(tick, 32);
        }
    }
    setTimeout(tick, 700);
}

/* =========================================================
   HABILIDADES
   ========================================================= */
function renderSkills(category) {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const items = SKILLS[category] || [];
    items.forEach((s, i) => {
        const card = document.createElement('div');
        card.className = 'track-card reveal';
        card.style.transitionDelay = (i * 0.05) + 's';
        const barsCount = 20;
        const barsOn = Math.round((s.level / 100) * barsCount);
        let barsHTML = '';
        for (let b = 0; b < barsCount; b++) {
            const h = 30 + Math.random() * 70;
            barsHTML += `<span style="height: ${h}%;" class="${b < barsOn ? 'on' : ''}"></span>`;
        }
        card.innerHTML = `
            <p class="track-num">PISTA-${String(i + 1).padStart(2, '0')}</p>
            <h4 class="track-title">${s.title}</h4>
            <p class="track-desc">${s.desc}</p>
            <div class="track-bars">${barsHTML}</div>
        `;
        grid.appendChild(card);
    });
    requestAnimationFrame(() => {
        grid.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    });
}

function setupSkillsTabs() {
    const tabs = document.querySelectorAll('#skillsTabs .track-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('tab-active'));
            tab.classList.add('tab-active');
            renderSkills(tab.dataset.tab);
        });
    });
    renderSkills('creatividad');
}

/* =========================================================
   PROYECTOS
   ========================================================= */
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    PROJECTS.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'album-card reveal';
        card.style.transitionDelay = (i * 0.08) + 's';

        let coverHTML = '';
        if (p.logo) {
            coverHTML = `
                <div class="logo-cover">
                    <img class="brand-logo" src="${p.logo}" alt="${p.title}" loading="lazy">
                </div>
            `;
        } else if (p.image) {
            coverHTML = `<img src="${p.image}" alt="${p.title}">`;
        } else {
            coverHTML = `
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index: 2;">
                    <span class="display" style="font-size: 6rem; color: ${p.accent}; opacity: 0.5; letter-spacing: -0.05em;">${String(i + 1).padStart(2, '0')}</span>
                </div>
            `;
        }

        const tagHTML = p.tag ? `<span class="folder-tag">${p.tag}</span>` : '';

        let awardHTML = '';
        if (p.award) {
            awardHTML = `
                <div class="award-ribbon">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2l2.9 6.9 7.1.6-5.4 4.8 1.6 7L12 17.8 5.8 21.3l1.6-7L2 9.5l7.1-.6L12 2z"/>
                    </svg>
                    <span>${p.award}</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="album-cover">
                ${coverHTML}
                ${tagHTML}
                ${awardHTML}
                <svg class="album-cat" width="36" height="40" viewBox="0 0 40 44" fill="none">
                    <path d="M10 12 L7 4 L15 9 Z" fill="currentColor"/>
                    <path d="M30 12 L33 4 L25 9 Z" fill="currentColor"/>
                    <ellipse cx="20" cy="22" rx="13" ry="11" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    <circle cx="15" cy="21" r="1.5" fill="currentColor"/>
                    <circle cx="25" cy="21" r="1.5" fill="currentColor"/>
                    <path d="M18 26 L20 28 L22 26" stroke="currentColor" stroke-width="1.2" fill="none"/>
                </svg>
            </div>
            <div class="album-meta">
                <p class="album-code">${p.code}</p>
                <h4 class="album-title">${p.title}</h4>
                <p class="album-cat-name">${p.category}</p>
            </div>
        `;
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ver proyecto ${p.title}`);
        card.addEventListener('click', () => openProjectModal(p));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProjectModal(p); }
        });
        grid.appendChild(card);
    });
    requestAnimationFrame(() => {
        grid.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    });
}

/* =========================================================
   MOCKUPS IG
   ========================================================= */
function createIGPost(piece) {
    const wrapper = document.createElement('div');
    wrapper.className = 'mockup';
    const inner = document.createElement('div');
    inner.className = 'mockup-inner';
    const screen = document.createElement('div');
    screen.className = 'mockup-screen';
    const post = document.createElement('div');
    post.className = 'ig-post';

    const userInitial = (piece.account || 'ig').charAt(0).toUpperCase();
    const username = piece.account || 'instagram';

    const imgHTML = piece.image
        ? `<img src="${piece.image}" alt="${piece.label}" loading="lazy">`
        : `<div class="ig-empty"><span class="ig-empty-icon">✦</span><span class="ig-empty-label">${piece.label}</span></div>`;

    post.innerHTML = `
        <div class="ig-header">
            <div class="ig-avatar"><div class="ig-avatar-inner">${userInitial}</div></div>
            <div class="ig-user">
                <span class="ig-username">${username}</span>
                <svg class="ig-verified" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 2.4L18 4l.6 3.6L22 9l-1.4 3.4L22 15l-3.4 1.4L18 20l-3.6-.6L12 22l-2.4-2.4L6 20l-.6-3.6L2 15l1.4-3.4L2 9l3.4-1.4L6 4l3.6.4zM10.8 15.2l5.4-5.4-1.4-1.4-4 4-2-2-1.4 1.4z"/></svg>
            </div>
            <span class="ig-dots">⋯</span>
        </div>
        <div class="ig-image">${imgHTML}</div>
        <div class="ig-actions">
            <div class="ig-actions-left">
                <svg class="ig-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <svg class="ig-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <svg class="ig-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <svg class="ig-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="ig-meta">
            <div class="ig-likes">${piece.likes || '0'} Me gusta</div>
            <div class="ig-caption"><strong>${username}</strong> ${piece.caption || ''}</div>
            <div class="ig-comments">${piece.comments || ''}</div>
            <div class="ig-time">${piece.time || ''}</div>
        </div>
    `;

    screen.appendChild(post);
    inner.appendChild(screen);
    wrapper.appendChild(inner);

    if (piece.image) {
        wrapper.addEventListener('click', () => openLightbox(piece.image, piece.label));
    }
    return wrapper;
}

function createIGStory(piece) {
    const wrapper = document.createElement('div');
    wrapper.className = 'mockup';
    const inner = document.createElement('div');
    inner.className = 'mockup-inner';
    const screen = document.createElement('div');
    screen.className = 'mockup-screen';
    const story = document.createElement('div');
    story.className = 'ig-story';

    const userInitial = (piece.account || 'ig').charAt(0).toUpperCase();
    const username = piece.account || 'instagram';

    const bgHTML = piece.image
        ? `<img class="ig-story-bg" src="${piece.image}" alt="${piece.label}" loading="lazy">`
        : `<div class="ig-story-bg-empty"><span class="ig-empty-icon">✦</span><span class="ig-empty-label">${piece.label}</span></div>`;

    story.innerHTML = `
        ${bgHTML}
        <div class="ig-story-progress"><div class="ig-story-progress-fill"></div></div>
        <div class="ig-story-header">
            <div class="ig-story-avatar"><div class="ig-story-avatar-inner">${userInitial}</div></div>
            <span class="ig-story-username">${username}</span>
            <span class="ig-story-time">· ${piece.time || '2h'}</span>
            <span class="ig-story-close">✕</span>
        </div>
        <div class="ig-story-footer">
            <div class="ig-story-input">Enviar mensaje…</div>
            <div class="ig-story-icons">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
        </div>
    `;

    screen.appendChild(story);
    inner.appendChild(screen);
    wrapper.appendChild(inner);

    if (piece.image) {
        wrapper.addEventListener('click', () => openLightbox(piece.image, piece.label));
    }
    return wrapper;
}

function createMockup(piece, positionClass) {
    const wrapper = piece.format === 'story'
        ? createIGStory(piece)
        : createIGPost(piece);
    wrapper.classList.add(positionClass);
    return wrapper;
}

function createAccountBlock(account, accIndex) {
    const block = document.createElement('div');
    block.className = 'account-block';
    const title = document.createElement('div');
    title.className = 'account-title';
    title.innerHTML = `
        <span class="account-num">${String(accIndex + 1).padStart(2, '0')}</span>
        <span class="account-name">${account.name}</span>
        ${account.subtitle ? `<span class="account-sub">· ${account.subtitle}</span>` : ''}
    `;
    block.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'mockup-grid';
    const positions = ['mockup-left', 'mockup-center', 'mockup-right'];
    account.pieces.forEach((piece, idx) => {
        const mockup = createMockup(piece, positions[idx] || '');
        grid.appendChild(mockup);
    });
    block.appendChild(grid);
    return block;
}

/* =========================================================
   MODAL
   ========================================================= */
function openProjectModal(project) {
    const modal = document.getElementById('projectModal');
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalCategory').textContent = project.code;
    document.getElementById('modalDesc').textContent = project.desc;

    const extra = document.getElementById('modalExtra');
    extra.innerHTML = '';

    if (project.type === 'folder' && Array.isArray(project.accounts)) {
        project.accounts.forEach((account, accIndex) => {
            extra.appendChild(createAccountBlock(account, accIndex));
        });
    }

    if (project.type === 'folder' && Array.isArray(project.items)) {
        const grid = document.createElement('div');
        grid.className = 'subproject-grid';
        project.items.forEach(item => {
            const sub = document.createElement('div');
            sub.className = 'subproject';
            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.label;
                img.loading = 'lazy';
                const lbl = document.createElement('span');
                lbl.className = 'subproject-label';
                lbl.textContent = item.label;
                sub.append(img, lbl);
                sub.addEventListener('click', () => openLightbox(item.image, item.label));
            } else {
                sub.innerHTML = `<span class="subproject-empty-icon">✦</span><span class="subproject-label">${item.label}</span>`;
            }
            grid.appendChild(sub);
        });
        extra.appendChild(grid);
    }

    if (project.type === 'single' && Array.isArray(project.pieces)) {
        const wrap = document.createElement('div');
        wrap.className = 'single-pieces';

        if (project.award) {
            const badge = document.createElement('div');
            badge.className = 'modal-award';
            badge.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.9 6.9 7.1.6-5.4 4.8 1.6 7L12 17.8 5.8 21.3l1.6-7L2 9.5l7.1-.6L12 2z"/>
                </svg>
                <span>${project.award}</span>
            `;
            wrap.appendChild(badge);
        }

        project.pieces.forEach(piece => {
            const block = document.createElement('div');
            block.className = 'single-piece-block';

            const label = document.createElement('p');
            label.className = 'single-piece-label mono';
            label.textContent = piece.label;
            block.appendChild(label);

            const frame = document.createElement('div');
            frame.className = 'single-piece-frame';
            frame.style.aspectRatio = piece.aspect || BOARD_ASPECT;
            if (piece.format === 'post') frame.classList.add('is-board');

            if (piece.embed) {
                const iframe = document.createElement('iframe');
                iframe.src = piece.embed;
                iframe.allow = 'autoplay; fullscreen; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.loading = 'lazy';
                frame.appendChild(iframe);
            } else if (piece.image) {
                const img = document.createElement('img');
                img.src = piece.image;
                img.alt = piece.label;
                img.loading = 'lazy';
                frame.appendChild(img);
                frame.addEventListener('click', () => openLightbox(piece.image, piece.label));
            } else {
                const empty = document.createElement('div');
                empty.className = 'single-piece-empty';
                empty.innerHTML = `
                    <span class="single-piece-empty-icon">✦</span>
                    <span class="single-piece-empty-label mono">${piece.label} · PRÓXIMAMENTE</span>
                `;
                frame.appendChild(empty);
            }

            block.appendChild(frame);
            wrap.appendChild(block);
        });

        extra.appendChild(wrap);
    }

    const tagsWrap = document.getElementById('modalTags');
    tagsWrap.innerHTML = '';
    project.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'mono text-[10px] uppercase';
        span.style.color = 'var(--violet-neon)';
        span.style.border = '1px solid rgba(176,38,255,0.35)';
        span.style.padding = '0.35rem 0.7rem';
        span.style.letterSpacing = '0.1em';
        span.style.marginTop = '0.75rem';
        span.style.display = 'inline-block';
        span.textContent = t;
        tagsWrap.appendChild(span);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
        if (!modal.classList.contains('open')) document.getElementById('modalExtra').innerHTML = '';
    }, 350);
}

function setupModal() {
    const modal = document.getElementById('projectModal');
    document.getElementById('modalClose').addEventListener('click', closeProjectModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeProjectModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const lb = document.getElementById('lightbox');
        if (lb && lb.classList.contains('open')) return;
        closeProjectModal();
    });
}

/* =========================================================
   LIGHTBOX
   ========================================================= */
function openLightbox(src, alt) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxImg').alt = alt || '';
    document.getElementById('lightboxCaption').textContent = alt || '';
    lb.classList.add('open');
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }
function setupLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

/* =========================================================
   MENÚ MÓVIL
   ========================================================= */
function setupMobileMenu() {
    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => menu.classList.add('open'));
    document.getElementById('mobileMenuClose').addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') menu.classList.remove('open'); });
}

/* =========================================================
   REPRODUCTOR MÓVIL
   ========================================================= */
function setupMobilePlayer() {
    document.querySelectorAll('.player-btn[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.goto);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* =========================================================
   MENSAJE AL CERRAR LA PESTAÑA
   ========================================================= */
function setupExitToast() {
    const toast = document.getElementById('exitToast');
    const closeBtn = document.getElementById('exitToastClose');
    if (!toast) return;

    let shown = false;

    function showToast() {
        if (shown) return;
        shown = true;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            shown = false;
        }, 8000);
    }

    document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget && e.clientY <= 0) {
            showToast();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            showToast();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            shown = false;
        });
    }

    window.addEventListener('beforeunload', () => {
        showToast();
    });
}

/* =========================================================
   GATO INTERACTIVO
   ========================================================= */
const MEOW_WORDS = ['¡Miau!', 'Meow', 'Mrrrp', '¡Miau!', 'Nya~', 'Purrr', 'Miau 🖤'];
const HEART_EMOJIS = ['🖤', '💜', '💖', '✦', '🐾', '🖤', '💜'];

function setupCatEgg() {
    const cat = document.getElementById('catMascot');
    const egg = document.getElementById('catEgg');
    if (!cat || !egg) return;

    let clicks = 0, timer = null;
    let longPressTimer = null;

    function spawnHeart(x, y) {
        const heart = document.createElement('span');
        heart.className = 'cat-heart';
        heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
        heart.style.left = (x + (Math.random() * 40 - 20)) + 'px';
        heart.style.top = (y + (Math.random() * 20 - 10)) + 'px';
        heart.style.fontSize = (1.2 + Math.random() * 0.8) + 'rem';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1400);
    }

    function spawnMeow(x, y) {
        const bubble = document.createElement('div');
        bubble.className = 'cat-meow';
        bubble.textContent = MEOW_WORDS[Math.floor(Math.random() * MEOW_WORDS.length)];
        bubble.style.left = (x + 60) + 'px';
        bubble.style.top = (y - 30) + 'px';
        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1600);
    }

    function petTheCat(e) {
        const rect = cat.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        cat.classList.remove('petted');
        void cat.offsetWidth;
        cat.classList.add('petted');
        setTimeout(() => cat.classList.remove('petted'), 700);

        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            setTimeout(() => spawnHeart(x, y), i * 90);
        }
        if (Math.random() > 0.4) spawnMeow(x, y);

        clicks++;
        clearTimeout(timer);
        timer = setTimeout(() => { clicks = 0; }, 1500);
        if (clicks >= 5) {
            egg.classList.add('show');
            setTimeout(() => egg.classList.remove('show'), 3000);
            clicks = 0;
        }
    }

    cat.addEventListener('click', petTheCat);

    cat.addEventListener('touchstart', (e) => {
        longPressTimer = setTimeout(() => {
            const rect = cat.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            for (let i = 0; i < 6; i++) {
                setTimeout(() => spawnHeart(x, y), i * 70);
            }
            spawnMeow(x, y);
            if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
        }, 500);
    }, { passive: true });
    cat.addEventListener('touchend', () => clearTimeout(longPressTimer));
    cat.addEventListener('touchmove', () => clearTimeout(longPressTimer));
}

/* =========================================================
   IDIOMA
   ========================================================= */
const I18N = {
    es: {
        'nav.home': 'Inicio', 'nav.about': 'Sobre mí', 'nav.skills': 'Habilidades',
        'nav.projects': 'Proyectos', 'nav.experience': 'Experiencia', 'nav.contact': 'Contacto',
        'hero.tagline': 'Una creativa que convierte ideas en identidades, imágenes y campañas que no pasan desapercibidas.',
        'hero.cta1': 'PARA VER MI CHAMBA SIN TANTO FLORO',
        'hero.cta2': 'Conoce a la creativa'
    },
    en: {
        'nav.home': 'Home', 'nav.about': 'About', 'nav.skills': 'Skills',
        'nav.projects': 'Projects', 'nav.experience': 'Experience', 'nav.contact': 'Contact',
        'hero.tagline': 'A creative who turns ideas into identities, images and campaigns that don\'t go unnoticed.',
        'hero.cta1': 'SHOW ME THE WORK, NO FRILLS',
        'hero.cta2': 'Meet the creative'
    }
};

function setupLangToggle() {
    const buttons = document.querySelectorAll('.lang-btn');
    if (!buttons.length) return;
    let lang = safeStorage.get('lang', 'es');
    applyLang(lang);
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            lang = btn.dataset.lang;
            safeStorage.set('lang', lang);
            applyLang(lang);
        });
    });
    function applyLang(l) {
        buttons.forEach(b => b.classList.toggle('active', b.dataset.lang === l));
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (I18N[l] && I18N[l][key]) el.textContent = I18N[l][key];
        });
    }
}

/* =========================================================
   UI GENERAL
   ========================================================= */
function setupUI() {
    const progress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
        if (progress) progress.style.width = scrolled + '%';
    }, { passive: true });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => observerNav.observe(s));

    const revealEls = document.querySelectorAll('.reveal');
    const observerReveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observerReveal.observe(el));

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot && ring) {
        let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
        window.addEventListener('mousemove', (e) => {
            dotX = e.clientX; dotY = e.clientY;
            dot.style.left = dotX + 'px'; dot.style.top = dotY + 'px';
        });
        (function animateCursor() {
            ringX += (dotX - ringX) * 0.18;
            ringY += (dotY - ringY) * 0.18;
            ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
            requestAnimationFrame(animateCursor);
        })();
        const HOVER_SEL = 'a, button, .editorial-card, .album-card, .track-card, .profile-swap, .subproject, .mockup, .cat-mascot, .single-piece-frame';
        document.addEventListener('mouseover', (e) => {
            ring.classList.toggle('hover', !!(e.target.closest && e.target.closest(HOVER_SEL)));
        });
    }

    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) backBtn.classList.add('show');
            else backBtn.classList.remove('show');
        }, { passive: true });
        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

/* =========================================================
   FONDO 3D
   ========================================================= */
let scene, camera, renderer, composer, afterimagePass;
let particleMesh, gridPlaneMesh, ringMesh1, ringMesh2, backgroundStars;
const mouse = new THREE.Vector2(0, 0);
const targetRotation = new THREE.Vector2(0, 0);
const currentRotation = new THREE.Vector2(0, 0);
let mouseSpeed = 0;
let lastMousePosition = new THREE.Vector2(0, 0);
const clock = new THREE.Clock();
let cameraDistance = IS_MOBILE ? 14 : 7;
let scrollY = 0;

const particleVertexShader = `
    attribute float size; attribute float randomVal; attribute float phase;
    varying vec3 vPosition; varying float vIntensity; varying float vRandom; varying float vPhase;
    uniform float time; uniform vec2 mouse; uniform float mouseInfluence;
    void main() {
        vRandom = randomVal; vPhase = phase; vec3 pos = position;
        float angle1 = time * 0.12 + randomVal * 3.14; float angle2 = time * 0.08 - randomVal * 2.0;
        mat2 rotationMatrix1 = mat2(cos(angle1), -sin(angle1), sin(angle1), cos(angle1));
        mat2 rotationMatrix2 = mat2(cos(angle2), -sin(angle2), sin(angle2), cos(angle2));
        pos.xz = rotationMatrix1 * pos.xz; pos.xy = rotationMatrix2 * pos.xy;
        float wave1 = sin(pos.x * 1.8 + time * 0.9 + phase) * cos(pos.y * 1.6 + time * 0.7 + phase) * sin(pos.z * 1.7 + time * 0.8 + phase) * 0.4;
        float wave2 = sin(pos.x * 3.2 - time * 1.2) * cos(pos.y * 3.0 - time * 1.0) * sin(pos.z * 3.1 - time * 1.1) * 0.2;
        float wave3 = sin(length(pos) * 2.5 - time * 1.5 + phase * 2.0) * 0.15;
        float wave4 = cos(pos.x * 4.0 + time * 0.8 + randomVal * 5.0) * sin(pos.z * 3.5 - time * 0.9) * 0.1;
        vec3 mouseProjectedPos = vec3(mouse.x * 5.0, mouse.y * 5.0, 0.0);
        float dist = length(pos - mouseProjectedPos);
        float ripple = sin(dist * 3.5 - time * 6.5) * 1.0; ripple *= smoothstep(4.5, 0.2, dist); ripple += cos(dist * 2.2 - time * 4.0) * 0.4 * smoothstep(3.0, 0.5, dist);
        vec3 pullDir = normalize(mouseProjectedPos - pos + 0.0001); float pullStrengthBase = smoothstep(4.0, 0.0, dist) * 0.8;
        float oscillation = sin(time * 2.0 + dist * 2.0) * 0.5 + 0.5; float pullStrength = mix(pullStrengthBase * 0.6, -pullStrengthBase * 1.0, smoothstep(0.3, 1.0, oscillation));
        float breathe = sin(time * 0.5 + randomVal * 6.28) * 0.08 + 1.0; pos *= breathe;
        pos += normal * (wave1 + wave2 + wave3 + wave4) * 0.2; pos += normal * ripple * 0.8; pos += pullDir * pullStrength;
        vPosition = pos;
        float waveIntensity = abs(wave1) * 1.5 + abs(wave2) * 1.0 + abs(wave3) * 2.0 + abs(wave4) * 1.8; float rippleIntensity = abs(ripple) * 1.2; float distanceIntensity = (1.0 - smoothstep(0.0, 4.0, length(position))) * 0.6;
        vIntensity = clamp(waveIntensity + rippleIntensity + distanceIntensity, 0.0, 1.0);
        vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0); gl_Position = projectionMatrix * modelViewPosition;
        float sizeFactor = (180.0 / -modelViewPosition.z); gl_PointSize = size * sizeFactor * (0.3 + vIntensity * 0.7); gl_PointSize += 2.0 + mouseInfluence * 3.5; gl_PointSize *= (0.7 + randomVal * 0.6); gl_PointSize *= (1.0 + sin(time * 1.5 + phase * 6.28) * 0.2); gl_PointSize = max(0.5, gl_PointSize);
    }
`;

const particleFragmentShader = `
    varying vec3 vPosition; varying float vIntensity; varying float vRandom; varying float vPhase; uniform float time; uniform vec2 mouse;
    vec3 colorDeepPurple = vec3(0.10, 0.02, 0.22);
    vec3 colorViolet     = vec3(0.45, 0.18, 0.90);
    vec3 colorFuchsia    = vec3(0.85, 0.25, 0.85);
    vec3 colorMagenta    = vec3(1.00, 0.35, 0.75);
    vec3 colorSoftCyan   = vec3(0.35, 0.85, 1.00);
    vec3 colorWhite      = vec3(1.0, 1.0, 1.0);
    void main() {
        vec2 center = gl_PointCoord - vec2(0.5); float dist = length(center); if (dist > 0.5) discard;
        float circleSoftness = smoothstep(0.5, 0.2, dist);
        float timeFactor = sin(time * 0.4 + vPhase * 6.28) * 0.5 + 0.5;
        float timeFactor2 = cos(time * 0.3 - vRandom * 3.14) * 0.5 + 0.5;
        vec3 layer1 = mix(colorDeepPurple, colorViolet, vIntensity * 1.3);
        vec3 layer2 = mix(colorViolet, colorFuchsia, timeFactor);
        vec3 layer3 = mix(colorMagenta, colorSoftCyan, timeFactor2 * 0.5);
        vec3 baseColor = mix(layer1, layer2, smoothstep(0.2, 0.6, vIntensity));
        baseColor = mix(baseColor, layer3, smoothstep(0.5, 0.9, vIntensity) * 0.55);
        vec3 mouseProjectedPos = vec3(mouse.x * 5.0, mouse.y * 5.0, 0.0);
        float distToMouse = length(vPosition - mouseProjectedPos);
        float proximityInfluence = smoothstep(4.0, 0.5, distToMouse);
        float highlightFactor = smoothstep(0.5, 1.0, vIntensity * (1.0 + proximityInfluence * 0.1));
        vec3 highlightColor = mix(baseColor, colorWhite, highlightFactor * 0.75);
        float glow = pow(vIntensity * (0.3 + proximityInfluence * 0.1), 2.5);
        vec3 glowColor = mix(colorFuchsia, colorMagenta, sin(time * 0.5 + vPhase) * 0.5 + 0.5);
        vec3 finalColor = highlightColor + glowColor * glow * 0.22;
        float core = smoothstep(0.5, 0.1, dist) * (0.4 + vIntensity * 0.4);
        finalColor += colorWhite * core * 0.12;
        float distToCenter = length(vPosition); float alpha = smoothstep(3.5, 1.0, distToCenter);
        alpha *= circleSoftness;
        alpha *= smoothstep(0.02, 0.4, vIntensity + proximityInfluence * 0.2) * 0.9 + 0.1;
        if (alpha < 0.01) discard; gl_FragColor = vec4(finalColor, alpha);
    }
`;

const gridPlaneVertexShader = `varying vec2 vUv; varying vec3 vPosition; void main() { vUv = uv; vPosition = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const gridPlaneFragmentShader = `
    varying vec2 vUv; varying vec3 vPosition; uniform float time; uniform vec2 mouse; uniform float mouseInfluence; uniform vec2 resolution;
    const float gridDensity = 50.0; const float lineThickness = 0.008; const float waveSpeed = 8.0; const float waveFrequency = 25.0; const float highlightRadius = 0.2;
    vec3 backgroundColor = vec3(0.02, 0.0, 0.05); vec3 baseLineColor = vec3(0.22, 0.08, 0.45); vec3 highlightLineColor = vec3(0.95, 0.75, 1.0);
    vec3 waveColor = vec3(0.70, 0.35, 1.0); vec3 waveHighlightColor = vec3(1.0, 0.35, 0.85);
    vec3 energyColor = vec3(0.75, 0.45, 1.0); vec3 accentColor = vec3(0.30, 0.85, 1.0);
    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
    float noise(vec2 st) { vec2 i = floor(st); vec2 f = fract(st); float a = random(i); float b = random(i + vec2(1.0, 0.0)); float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0)); vec2 u = f * f * (3.0 - 2.0 * f); return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y; }
    float drawGrid(vec2 uv, float density, float thickness) { vec2 gridUv = uv * density; vec2 gridDeriv = fwidth(gridUv) * 0.5; vec2 gridLines = abs(fract(gridUv) - 0.5); vec2 gridLineAA = smoothstep(gridDeriv, gridDeriv * 2.0, gridLines); return 1.0 - min(gridLineAA.x, gridLineAA.y); }
    void main() {
        vec2 uv = vUv; float elapsedTime = time; vec2 mouseUv = mouse * 0.5 + 0.5; float screenAspect = resolution.x / resolution.y;
        vec2 aspectCorrectedUv = vec2(uv.x * screenAspect, uv.y);
        vec2 aspectCorrectedMouseUv = vec2(mouseUv.x * screenAspect, mouseUv.y);
        float distToMouse = length(aspectCorrectedUv - aspectCorrectedMouseUv);
        float intensity = smoothstep(highlightRadius * 1.5, 0.0, distToMouse); intensity = pow(intensity, 1.5) * mouseInfluence;
        float wave1 = sin(distToMouse * waveFrequency - elapsedTime * waveSpeed) * 0.5 + 0.5; wave1 = pow(wave1, 2.0) * smoothstep(highlightRadius * 3.0, 0.0, distToMouse);
        float wave2 = cos(distToMouse * waveFrequency * 1.5 - elapsedTime * waveSpeed * 0.7 + 1.0) * 0.5 + 0.5; wave2 = pow(wave2, 3.0) * smoothstep(highlightRadius * 2.5, 0.0, distToMouse);
        float combinedWave = (wave1 + wave2 * 0.6) * mouseInfluence * 1.2;
        vec2 dirToMouse = normalize(uv - mouseUv + 0.0001); float distortionStrength = 0.08;
        vec2 distortedUv = uv + dirToMouse * intensity * distortionStrength;
        float flowNoise = noise(uv * 5.0 + elapsedTime * 0.2);
        distortedUv += vec2(sin(elapsedTime * 0.4 + flowNoise * 2.0), cos(elapsedTime * 0.35 + flowNoise * 1.5)) * 0.015;
        float gridValue = drawGrid(distortedUv, gridDensity, lineThickness);
        float visibilityNoise1 = noise(uv * 2.5 + elapsedTime * 0.15);
        float visibilityNoise2 = noise(uv * 5.0 - elapsedTime * 0.1);
        float visibilityMask = smoothstep(0.15, 0.4, visibilityNoise1) * smoothstep(0.25, 0.55, visibilityNoise2);
        visibilityMask = max(0.2, visibilityMask);
        float energyFlow1 = sin(uv.x * 30.0 - elapsedTime * 12.0 + noise(uv * 3.0) * 10.0) * 0.5 + 0.5;
        float energyFlow2 = cos(uv.y * 35.0 + elapsedTime * 10.0 + noise(uv * 2.5) * 8.0) * 0.5 + 0.5;
        float energyValue = pow(energyFlow1 * energyFlow2, 3.5); energyValue = smoothstep(0.05, 0.6, energyValue);
        float accentPulse = sin(elapsedTime * 2.0 + uv.x * 20.0) * sin(elapsedTime * 1.5 + uv.y * 15.0); accentPulse = smoothstep(0.7, 0.9, accentPulse) * 0.5;
        vec3 baseColor = baseLineColor;
        vec3 energyPulseColor = mix(baseColor, energyColor * 1.5, energyValue);
        energyPulseColor = mix(energyPulseColor, accentColor, accentPulse);
        vec3 interactionHighlight = mix(energyPulseColor, highlightLineColor, pow(intensity, 0.4));
        vec3 waveMixColor = mix(waveColor * 1.4, waveHighlightColor * 1.6, pow(wave1, 3.0));
        waveMixColor = mix(waveMixColor, accentColor * 1.3, wave2 * 0.5);
        vec3 interactionColor = mix(interactionHighlight, waveMixColor, combinedWave * 0.8);
        vec3 finalLineColor = mix(energyPulseColor, interactionColor, smoothstep(0.01, 0.4, intensity + combinedWave * 0.6));
        float bgGlow = smoothstep(highlightRadius * 4.0, 0.0, distToMouse) * mouseInfluence * 0.2;
        vec3 bgGlowColor = mix(waveColor, waveHighlightColor, wave1);
        float bgNoise = noise(uv * 12.0 + elapsedTime * 0.1) * 0.04;
        vec3 gridCombined = finalLineColor * gridValue * visibilityMask;
        vec3 finalColor = backgroundColor + gridCombined + bgGlowColor * bgGlow + bgNoise * baseLineColor;
        finalColor = max(finalColor, baseLineColor * gridValue * 0.08 * visibilityMask);
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

const ringVertexShader = `varying vec2 vUv; varying float vDistance; void main() { vUv = uv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); vDistance = -mvPosition.z; gl_Position = projectionMatrix * mvPosition; }`;

const ringFragmentShader = `
    varying vec2 vUv; varying float vDistance; uniform float time; uniform vec3 color; uniform float mouseInfluence;
    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
    void main() {
        float angle = vUv.x * 6.28318;
        float pulse = sin(angle * 8.0 - time * 3.0) * 0.5 + 0.5;
        float trail = sin(angle * 4.0 + time * 2.0) * 0.5 + 0.5;
        float flicker = random(vec2(angle * 10.0, time * 5.0)) * 0.5 + 0.5;
        float intensity = pulse * 0.6 + trail * 0.4;
        intensity *= flicker * (1.0 + mouseInfluence * 0.5);
        float alpha = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
        alpha *= intensity * 0.7;
        alpha *= smoothstep(45.0, 15.0, vDistance);
        vec3 finalColor = color * (0.8 + pulse * 0.5 + sin(time * 0.8) * 0.2);
        gl_FragColor = vec4(finalColor, alpha);
    }
`;

const ChromaticAberrationShader = {
    uniforms: { tDiffuse: { value: null }, amount: { value: 0.003 }, angle: { value: 0.0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
        uniform sampler2D tDiffuse; uniform float amount; uniform float angle; varying vec2 vUv;
        void main() {
            vec2 center = vec2(0.5, 0.5); vec2 dir = vUv - center; float dist = length(dir);
            vec2 offset = normalize(dir) * amount * dist;
            vec2 offsetAngle = vec2(cos(angle), sin(angle)) * amount * 0.5;
            float r = texture2D(tDiffuse, vUv + offset + offsetAngle).r;
            float g = texture2D(tDiffuse, vUv).g;
            float b = texture2D(tDiffuse, vUv - offset - offsetAngle).b;
            gl_FragColor = vec4(r, g, b, 1.0);
        }
    `
};

const backgroundStarVertexShader = `
    attribute float size; attribute float randomVal; varying float vOpacity; uniform float time; uniform vec2 mouse;
    void main() {
        vec3 pos = position;
        pos.x += sin(time * 0.05 + randomVal * 10.0) * 0.5;
        pos.y += cos(time * 0.07 + randomVal * 8.0) * 0.4;
        pos.z += sin(time * 0.03 + randomVal * 12.0) * 0.3;
        vec3 mouseProjectedPos = vec3(mouse.x * 10.0, mouse.y * 10.0, 0.0);
        float distToMouse = length(pos - mouseProjectedPos);
        float mouseRepel = smoothstep(30.0, 5.0, distToMouse);
        pos += normalize(pos - mouseProjectedPos + 0.0001) * mouseRepel * 0.5 * sin(time * 2.0);
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = size * (300.0 / -mvPosition.z);
        vOpacity = (1.0 - smoothstep(50.0, 2.0, length(position))) * (0.5 + randomVal * 0.5);
        vOpacity *= (sin(time * 1.5 + randomVal * 15.0) * 0.2 + 0.8);
    }
`;

const backgroundStarFragmentShader = `
    varying float vOpacity; uniform float time;
    void main() {
        vec2 coords = gl_PointCoord - vec2(0.5);
        float dist = length(coords);
        float alpha = smoothstep(0.5, 0.1, dist);
        vec3 color = vec3(0.75, 0.55, 1.0) * (0.8 + sin(time * 0.3) * 0.2);
        gl_FragColor = vec4(color, alpha * vOpacity);
    }
`;

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050005, 0.05);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 150);
    camera.position.z = cameraDistance;

    renderer = new THREE.WebGLRenderer({ antialias: !IS_MOBILE, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050005, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, IS_MOBILE ? 1.2 : 2));

    const container = document.getElementById('canvas-container');
    if (container) container.appendChild(renderer.domElement);

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    afterimagePass = new AfterimagePass();
    afterimagePass.uniforms['damp'].value = IS_MOBILE ? 0.45 : 0.82;
    composer.addPass(afterimagePass);
    const bloomStrength = IS_MOBILE ? 0.015 : (IS_TABLET ? 0.06 : 0.12);
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), bloomStrength, 0.25, 1.0));
    composer.addPass(new ShaderPass(ChromaticAberrationShader));
    composer.addPass(new OutputPass());

    const geometry = new THREE.IcosahedronGeometry(2.5, IS_MOBILE ? 4 : 8);
    const numParticles = geometry.attributes.position.count;
    const sizes = new Float32Array(numParticles);
    const randomVals = new Float32Array(numParticles);
    const phases = new Float32Array(numParticles);
    for (let i = 0; i < numParticles; i++) {
        sizes[i] = Math.random() * 0.7 + 0.3;
        randomVals[i] = Math.random();
        phases[i] = Math.random();
    }
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('randomVal', new THREE.BufferAttribute(randomVals, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    particleMesh = new THREE.Points(geometry, new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, mouse: { value: new THREE.Vector2(0, 0) }, mouseInfluence: { value: 0.0 } },
        vertexShader: particleVertexShader, fragmentShader: particleFragmentShader,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true
    }));
    if (IS_MOBILE) particleMesh.scale.setScalar(0.6);
    scene.add(particleMesh);

    let aspect = window.innerWidth / window.innerHeight;
    if (window.innerHeight === 0) aspect = 1;
    const vFov = camera.fov * Math.PI / 180;
    const planeHeightAtDistance = 2 * Math.tan(vFov / 2) * 35;
    const planeWidthAtDistance = planeHeightAtDistance * aspect;

    const gridPlaneGeometry = new THREE.PlaneGeometry(Math.max(1, planeWidthAtDistance * 1.5), Math.max(1, planeHeightAtDistance * 1.5), 1, 1);
    gridPlaneMesh = new THREE.Mesh(gridPlaneGeometry, new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, mouse: { value: new THREE.Vector2(0, 0) }, mouseInfluence: { value: 0.0 }, resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } },
        vertexShader: gridPlaneVertexShader, fragmentShader: gridPlaneFragmentShader,
        transparent: false, depthTest: true, side: THREE.DoubleSide
    }));
    gridPlaneMesh.position.z = -35;
    scene.add(gridPlaneMesh);

    const ringGeometry1 = new THREE.TorusGeometry(4, 0.015, 8, IS_MOBILE ? 40 : 100);
    ringMesh1 = new THREE.Mesh(ringGeometry1, new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, color: { value: new THREE.Color(0.69, 0.15, 1.0) }, mouseInfluence: { value: 0.0 } },
        vertexShader: ringVertexShader, fragmentShader: ringFragmentShader,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    }));
    ringMesh1.rotation.x = Math.PI / 2.5;
    if (IS_MOBILE) ringMesh1.scale.setScalar(0.65);
    scene.add(ringMesh1);

    const ringGeometry2 = new THREE.TorusGeometry(5, 0.012, 8, IS_MOBILE ? 40 : 100);
    ringMesh2 = new THREE.Mesh(ringGeometry2, new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, color: { value: new THREE.Color(0.95, 0.35, 0.85) }, mouseInfluence: { value: 0.0 } },
        vertexShader: ringVertexShader, fragmentShader: ringFragmentShader,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    }));
    ringMesh2.rotation.x = -Math.PI / 3;
    ringMesh2.rotation.z = Math.PI / 6;
    if (IS_MOBILE) ringMesh2.scale.setScalar(0.65);
    scene.add(ringMesh2);

    const starGeometry = new THREE.BufferGeometry();
    const numStars = IS_MOBILE ? 1500 : 15000;
    const starPositions = new Float32Array(numStars * 3);
    const starSizes = new Float32Array(numStars);
    const starRandomVals = new Float32Array(numStars);
    for (let i = 0; i < numStars; i++) {
        starPositions[i * 3] = (Math.random() * 200 - 100);
        starPositions[i * 3 + 1] = (Math.random() * 200 - 100);
        starPositions[i * 3 + 2] = (Math.random() * 200 - 100);
        starSizes[i] = Math.random() * 0.8 + 0.2;
        starRandomVals[i] = Math.random();
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('randomVal', new THREE.BufferAttribute(starRandomVals, 1));
    backgroundStars = new THREE.Points(starGeometry, new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, mouse: { value: new THREE.Vector2(0, 0) } },
        vertexShader: backgroundStarVertexShader, fragmentShader: backgroundStarFragmentShader,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    scene.add(backgroundStars);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
}

function onWindowResize() {
    const width = window.innerWidth, height = window.innerHeight;
    let aspect = width / height; if (height === 0) aspect = 1;
    camera.aspect = aspect; camera.updateProjectionMatrix();
    renderer.setSize(width, height); composer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, IS_MOBILE ? 1.2 : 2));
    if (gridPlaneMesh) {
        gridPlaneMesh.material.uniforms.resolution.value.set(width, height);
        const vFov = camera.fov * Math.PI / 180;
        const ph = 2 * Math.tan(vFov / 2) * 35;
        const pw = ph * aspect;
        gridPlaneMesh.geometry.dispose();
        gridPlaneMesh.geometry = new THREE.PlaneGeometry(Math.max(1, pw * 1.5), Math.max(1, ph * 1.5), 1, 1);
    }
}

function handlePointerMove(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    const dx = mouse.x - lastMousePosition.x, dy = mouse.y - lastMousePosition.y;
    mouseSpeed = THREE.MathUtils.lerp(mouseSpeed, Math.sqrt(dx * dx + dy * dy) * 10, 0.15);
    lastMousePosition.copy(mouse);
    targetRotation.y = mouse.x * 0.3;
    targetRotation.x = mouse.y * 0.3;
}
function onMouseMove(event) { handlePointerMove(event.clientX, event.clientY); }
function onTouchStart(event) {
    if (event.touches.length === 1) {
        lastMousePosition.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        lastMousePosition.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        mouseSpeed = 0;
        handlePointerMove(event.touches[0].clientX, event.touches[0].clientY);
    }
}
function onTouchMove(event) { if (event.touches.length === 1) handlePointerMove(event.touches[0].clientX, event.touches[0].clientY); }
function onWheel(event) {
    cameraDistance += event.deltaY * 0.005;
    cameraDistance = THREE.MathUtils.clamp(cameraDistance, IS_MOBILE ? 11 : 4, IS_MOBILE ? 18 : 12);
}

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    const elapsedTime = clock.elapsedTime;
    const particleMaterial = particleMesh.material;
    particleMaterial.uniforms.time.value = elapsedTime;
    particleMaterial.uniforms.mouse.value.copy(mouse);
    let influence = particleMaterial.uniforms.mouseInfluence.value;
    influence += mouseSpeed * 2.5;
    influence = THREE.MathUtils.lerp(influence, 0, deltaTime * 2.0);
    const currentInfluence = Math.min(influence, IS_MOBILE ? 0.7 : 1.8);
    particleMaterial.uniforms.mouseInfluence.value = currentInfluence;

    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.04;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.04;
    particleMesh.rotation.x = currentRotation.x;
    particleMesh.rotation.y = currentRotation.y;
    particleMesh.position.y = Math.sin(elapsedTime * 0.3) * 0.15 + Math.cos(elapsedTime * 0.2) * 0.08 + scrollY * 0.0008;
    particleMesh.position.x = Math.sin(elapsedTime * 0.2) * 0.1;

    const gridMaterial = gridPlaneMesh.material;
    gridMaterial.uniforms.time.value = elapsedTime;
    gridMaterial.uniforms.mouse.value.copy(mouse);
    gridMaterial.uniforms.mouseInfluence.value = currentInfluence;

    ringMesh1.rotation.y = elapsedTime * 0.2;
    ringMesh1.rotation.z = Math.sin(elapsedTime * 0.3) * 0.2;
    ringMesh1.material.uniforms.time.value = elapsedTime;
    ringMesh1.material.uniforms.mouseInfluence.value = currentInfluence;

    ringMesh2.rotation.y = -elapsedTime * 0.15;
    ringMesh2.rotation.x = -Math.PI / 3 + Math.cos(elapsedTime * 0.25) * 0.15;
    ringMesh2.material.uniforms.time.value = elapsedTime;
    ringMesh2.material.uniforms.mouseInfluence.value = currentInfluence;

    backgroundStars.material.uniforms.time.value = elapsedTime;
    backgroundStars.material.uniforms.mouse.value.copy(mouse);
    camera.position.z += (cameraDistance - camera.position.z) * 0.05;

    const aberrationPass = composer.passes.find(pass => pass.uniforms && pass.uniforms.angle);
    if (aberrationPass) {
        aberrationPass.uniforms.angle.value = elapsedTime * 0.1;
        aberrationPass.uniforms.amount.value = (IS_MOBILE ? 0.0005 : 0.002) + currentInfluence * 0.0015;
    }
    mouseSpeed = THREE.MathUtils.lerp(mouseSpeed, 0, deltaTime * 5.0);
    composer.render();
}

/* =========================================================
   ARRANQUE
   ========================================================= */
setupUI();
setupMobileMenu();
setupMobilePlayer();
setupExitToast();
setupCatEgg();
setupTypewriter();
setupSkillsTabs();
renderProjects();
setupModal();
setupLightbox();
setupLangToggle();
init();
animate();
