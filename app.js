 // ======================================================

 // CIBERGUARD - JAVASCRIPT PRINCIPAL CORREGIDO

 // ======================================================

 

 

// ======================================================

// 1. CONFIGURACIÓN DE FIREBASE

// ======================================================

 

const firebaseConfig = {

    apiKey: "AIzaSyB83tWmynLzWvSJC1L2L91rPI331-8fIcA",

    authDomain: "ciberguard.firebaseapp.com",

    projectId: "ciberguard",

    storageBucket: "ciberguard.firebasestorage.app",

    messagingSenderId: "496255899437",

    appId: "1:496255899437:web:bcee892c6b7a01cf2825a4",

    measurementId: "G-ZYB1FXVLYM"

};

 

let firebaseReady = false;

let auth = null;

let db = null;

let currentUser = null;

let currentUserData = null;

 

let currentProgress = {

    xp: 0,

    completed: 0

};

 

try {

    if (typeof firebase !== "undefined") {

        if (!firebase.apps.length) {

            firebase.initializeApp(firebaseConfig);

        }

 

        auth = firebase.auth();

        db = firebase.firestore();

        firebaseReady = true;

 

        console.log("CIBERGUARD: Firebase conectado");

    }

} catch (error) {

    console.error("Error al iniciar Firebase:", error);

}

 

 

// ======================================================

// 2. ELEMENTOS GENERALES

// ======================================================

 

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");

const themeToggle = document.getElementById("themeToggle");

const accountStatus = document.getElementById("accountStatus");

 

const loginButton = document.getElementById("loginButton");

const logoutButton = document.getElementById("logoutButton");

 

 

// ======================================================

// 3. FUNCIONES DE MODALES

// ======================================================

 

function openModal(modal) {

    if (!modal) return;

 

    modal.hidden = false;

    modal.setAttribute("aria-hidden", "false");

    modal.classList.add("active");

}

 

function closeModal(modal) {

    if (!modal) return;

 

    modal.classList.remove("active");

    modal.setAttribute("aria-hidden", "true");

    modal.hidden = true;

}

 

 

// ======================================================

// 4. MENSAJES

// ======================================================

 

function showMessage(element, message, color = "") {

    if (!element) return;

 

    element.textContent = message;

    element.style.color = color || "";

}

 

 

// ======================================================

// 5. MENÚ PARA CELULARES

// ======================================================

 

const sidebarBackdrop = document.getElementById("sidebarBackdrop");

 

function closeMobileSidebar() {

    navLinks?.classList.remove("active");

    sidebarBackdrop?.classList.remove("active");

    menuToggle?.setAttribute("aria-expanded", "false");

 

    const icon = menuToggle?.querySelector("i");

    if (icon) icon.className = "fa-solid fa-bars";

}

 

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const willOpen = !navLinks.classList.contains("active");

 

        navLinks.classList.toggle("active", willOpen);

        sidebarBackdrop?.classList.toggle("active", willOpen);

        menuToggle.setAttribute("aria-expanded", String(willOpen));

 

        const icon = menuToggle.querySelector("i");

        if (icon) icon.className = willOpen

            ? "fa-solid fa-xmark"

            : "fa-solid fa-bars";

    });

 

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            if (link.getAttribute("href")?.startsWith("#")) {

                closeMobileSidebar();

            }

        });

    });

 

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") closeMobileSidebar();

    });

}

 

 

// ======================================================

// 6. MODO OSCURO Y CLARO

// ======================================================

 

const savedTheme = localStorage.getItem("cg_theme");

 

if (savedTheme === "light") {

    document.body.classList.add("light-mode");

}

 

function updateThemeIcon() {

    if (!themeToggle) return;

 

    const icon = themeToggle.querySelector("i");

    if (!icon) return;

 

    icon.className = document.body.classList.contains("light-mode")

        ? "fa-solid fa-moon"

        : "fa-solid fa-sun";

}

 

updateThemeIcon();

 

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

 

        const isLight =

            document.body.classList.contains("light-mode");

 

        localStorage.setItem(

            "cg_theme",

            isLight ? "light" : "dark"

        );

 

        updateThemeIcon();

    });

}

 

 

// ======================================================

// 7. SISTEMA DE PERFILES

// ======================================================

 

const profileModal = document.getElementById("profileModal");

const openProfile = document.getElementById("openProfile");

const closeProfile = document.getElementById("closeProfile");

 

const profileResult = document.getElementById("profileResult");

const profileViewStatus = document.getElementById("profileViewStatus");

 

let selectedView =

    localStorage.getItem("cg_selected_view") || "Público general";

 

const profileExperiences = {

    "Estudiante": {

        description: "Explora los temas, participa en desafíos y fortalece tus conocimientos sobre ciberseguridad.",

        status: "Experiencia de estudiante activada"

    },

 

    "Docente": {

        description: "Consulta los contenidos educativos, recursos audiovisuales y actividades para promover la seguridad digital.",

        status: "Experiencia de docente activada"

    },

 

    "Público general": {

        description: "Aprende a proteger tu información personal y utiliza Internet de manera segura y responsable.",

        status: "Experiencia de público general activada"

    }

};

 

function renderProfile(profile) {

    if (!profileExperiences[profile]) {

        profile = "Público general";

    }

 

    selectedView = profile;

 

    localStorage.setItem("cg_selected_view", profile);

    document.body.dataset.currentProfile = profile;

 

    const experience = profileExperiences[profile];

 

    const heroDescription =

        document.querySelector(".hero-text > p");

 

    if (heroDescription) {

        heroDescription.textContent = experience.description;

    }

 

    if (profileResult) {

        profileResult.textContent = experience.status;

    }

 

    if (profileViewStatus) {

        profileViewStatus.textContent = "Vista actual: " + profile;

    }

 

    document.querySelectorAll("[data-profile]").forEach(element => {

        const isSelected = element.dataset.profile === profile;

 

        element.classList.toggle("selected", isSelected);

 

        const card = element.closest(".profile-card");

 

        if (card) {

            card.classList.toggle("is-selected", isSelected);

        }

 

        if (element.classList.contains("profile-option")) {

            element.setAttribute("aria-pressed", String(isSelected));

        }

    });

 

    closeModal(profileModal);

}

 

if (openProfile) {

    openProfile.addEventListener("click", () => {

        openModal(profileModal);

    });

}

 

if (closeProfile) {

    closeProfile.addEventListener("click", () => {

        closeModal(profileModal);

    });

}

 

document.querySelectorAll("[data-profile]").forEach(element => {

    element.addEventListener("click", () => {

        renderProfile(element.dataset.profile);

    });

});

 

if (profileModal) {

    profileModal.addEventListener("click", event => {

        if (event.target === profileModal) {

            closeModal(profileModal);

        }

    });

}

 

renderProfile(selectedView);

 

 

// ======================================================

// 8. BUSCADOR DE CONTENIDOS

// ======================================================

 

const contentSearch = document.getElementById("contentSearch");

const learningCards = document.querySelectorAll(".learning-card");

const searchEmpty = document.getElementById("searchEmpty");

 

if (contentSearch) {

    contentSearch.addEventListener("input", () => {

        const search = contentSearch.value.toLowerCase().trim();

 

        let visibleCards = 0;

 

        learningCards.forEach(card => {

            const matches =

                card.textContent.toLowerCase().includes(search);

 

            card.hidden = !matches;

 

            if (matches) visibleCards++;

        });

 

        if (searchEmpty) {

            searchEmpty.hidden = visibleCards !== 0;

        }

    });

}

 

 

// ======================================================

// 9. INFORMACIÓN DE LOS SEIS TEMAS

// ======================================================

 

const topicModal = document.getElementById("topic-modal");

const topicClose = document.getElementById("topic-close");

const topicContent = document.getElementById("topic-content");

 

const topics = [

    {

        title: "¿Qué es la ciberseguridad?",

        label: "FUNDAMENTOS",

        description: "La ciberseguridad es el conjunto de prácticas, tecnologías y procesos destinados a proteger dispositivos, redes, sistemas y datos frente a accesos no autorizados, ataques y daños digitales.",

        importance: "Permite proteger la información personal, mantener la privacidad y reducir los riesgos al utilizar Internet.",

        tips: [

            "Utiliza contraseñas seguras",

            "Mantén tus dispositivos actualizados",

            "Evita descargar archivos sospechosos",

            "Aprende a reconocer amenazas digitales"

        ],

        example: "Una persona que protege su computadora con actualizaciones, contraseñas seguras y un sistema de protección está aplicando medidas de ciberseguridad."

    },

    {

        title: "Protección de datos",

        label: "PRIVACIDAD",

        description: "La protección de datos consiste en cuidar la información personal que compartimos o almacenamos en plataformas digitales, como nombres, direcciones, fotografías, números telefónicos y documentos.",

        importance: "Evita que otras personas utilicen nuestra información sin autorización, reduciendo riesgos como el robo de identidad y el fraude.",

        tips: [

            "No publiques datos personales innecesarios",

            "Utiliza contraseñas diferentes para tus cuentas",

            "Revisa los permisos de las aplicaciones",

            "No compartas códigos de verificación"

        ],

        example: "Si una aplicación solicita acceso a tus contactos, ubicación y fotografías, revisa si realmente necesita esos permisos."

    },

    {

        title: "Uso responsable de redes",

        label: "REDES SOCIALES",

        description: "El uso responsable de redes sociales implica comunicarse con respeto, proteger la privacidad y analizar la información antes de compartirla.",

        importance: "Ayuda a prevenir el ciberacoso, la difusión de información falsa y la exposición innecesaria de datos personales.",

        tips: [

            "Piensa antes de publicar",

            "No compartas información privada de otras personas",

            "Bloquea y denuncia cuentas sospechosas",

            "Verifica las noticias antes de difundirlas"

        ],

        example: "Antes de compartir una noticia alarmante, comprueba si procede de una fuente confiable y si tiene respaldo."

    },

    {

        title: "Amenazas digitales",

        label: "PREVENCIÓN",

        description: "Las amenazas digitales son acciones o programas que buscan robar información, engañar a los usuarios, dañar dispositivos o acceder sin autorización a sistemas informáticos.",

        importance: "Reconocerlas permite actuar a tiempo y evitar pérdidas de información, dinero o privacidad.",

        tips: [

            "Desconfía de enlaces desconocidos",

            "No abras archivos inesperados",

            "Verifica quién envía los mensajes",

            "No entregues contraseñas por correo o mensajes"

        ],

        example: "Un mensaje falso que dice que tu cuenta será bloqueada y te pide ingresar tu contraseña mediante un enlace puede ser un intento de phishing."

    },

    {

        title: "Seguridad de dispositivos",

        label: "DISPOSITIVOS",

        description: "La seguridad de dispositivos reúne medidas para proteger computadoras, celulares y otros equipos frente a programas maliciosos, robos y accesos no autorizados.",

        importance: "Permite mantener los equipos funcionando correctamente y proteger los archivos que contienen.",

        tips: [

            "Instala actualizaciones oficiales",

            "Utiliza bloqueo de pantalla",

            "Descarga aplicaciones de fuentes confiables",

            "Realiza copias de seguridad"

        ],

        example: "Mantener actualizado el sistema operativo de un celular ayuda a corregir vulnerabilidades de seguridad."

    },

    {

        title: "Ciudadanía digital",

        label: "RESPONSABILIDAD",

        description: "La ciudadanía digital consiste en participar en los espacios digitales de manera ética, segura, crítica y responsable.",

        importance: "Promueve una convivencia respetuosa y contribuye a construir espacios digitales más seguros para todos.",

        tips: [

            "Respeta las opiniones de otras personas",

            "No participes en el ciberacoso",

            "Respeta los derechos de autor",

            "Comprueba la información que compartes"

        ],

        example: "Cuando una persona utiliza Internet para aprender, dialogar respetuosamente y compartir información verificada, ejerce una ciudadanía digital responsable."

    }

];

 

function openTopic(index) {

    const topic = topics[index];

 

    if (!topic || !topicContent || !topicModal) return;

 

    topicContent.innerHTML = `

        <span class="topic-label">${topic.label}</span>

        <h2>${topic.title}</h2>

 

        <h3>¿En qué consiste?</h3>

        <p>${topic.description}</p>

 

        <h3>¿Por qué es importante?</h3>

        <p>${topic.importance}</p>

 

        <h3>Recomendaciones</h3>

        <ul>

            ${topic.tips.map(tip => `<li>${tip}</li>`).join("")}

        </ul>

 

        <div class="topic-example">

            <h3>Ejemplo práctico</h3>

            <p>${topic.example}</p>

        </div>

    `;

 

    openModal(topicModal);

}

 

learningCards.forEach((card, index) => {

    card.addEventListener("click", event => {

        event.preventDefault();

        openTopic(index);

    });

});

 

if (topicClose) {

    topicClose.addEventListener("click", () => {

        closeModal(topicModal);

    });

}

 

if (topicModal) {

    topicModal.addEventListener("click", event => {

        if (event.target === topicModal) {

            closeModal(topicModal);

        }

    });

}

 

 

// ======================================================

// 10. SISTEMA DE JUEGOS - NUEVE DESAFÍOS

// ======================================================

 

const gameArea = document.getElementById("gameArea");

const gameTitle = document.getElementById("gameTitle");

const gameContent = document.getElementById("gameContent");

const closeGame = document.getElementById("closeGame");

 

let currentGame = null;

let currentQuestion = 0;

let currentScore = 0;

let gameFinished = false;

let answerLocked = false;

 

let gameTimerInterval = null;

let gameTimeLeft = 30;

 

 

// BANCO DE PREGUNTAS

 

const games = {

 

    quiz: {

        title: "Quiz de ciberseguridad",

        questions: [

            {

                question: "¿Qué es la ciberseguridad?",

                options: [

                    "Proteger sistemas y datos digitales",

                    "Crear redes sociales",

                    "Aumentar la velocidad de Internet"

                ],

                answer: 0,

                explanation: "La ciberseguridad protege dispositivos, sistemas y datos frente a amenazas digitales."

            },

            {

                question: "¿Qué debes hacer si recibes un enlace sospechoso?",

                options: [

                    "Abrirlo inmediatamente",

                    "Verificarlo antes de acceder",

                    "Compartirlo con tus contactos"

                ],

                answer: 1,

                explanation: "Es importante comprobar los enlaces antes de abrirlos."

            },

            {

                question: "¿Qué es el phishing?",

                options: [

                    "Una actualización del sistema",

                    "Un tipo de almacenamiento",

                    "Un engaño para robar información"

                ],

                answer: 2,

                explanation: "El phishing utiliza mensajes o páginas falsas para obtener datos personales."

            }

        ]

    },

 

    password: {

        title: "Contraseña segura",

        questions: [

            {

                question: "¿Cuál de estas contraseñas es más segura?",

                options: [

                    "12345678",

                    "angello123",

                    "R7!mQ9#vLp2@"

                ],

                answer: 2,

                explanation: "Una contraseña larga, única y difícil de adivinar ofrece mayor protección."

            },

            {

                question: "¿Es recomendable utilizar la misma contraseña en todas tus cuentas?",

                options: [

                    "Sí, para recordarla fácilmente",

                    "No, utiliza contraseñas diferentes",

                    "Solo en redes sociales"

                ],

                answer: 1,

                explanation: "Si una cuenta resulta comprometida, las demás no deberían quedar expuestas."

            },

            {

                question: "¿Qué medida añade otra capa de seguridad?",

                options: [

                    "Autenticación en dos pasos",

                    "Compartir la contraseña",

                    "Desactivar las actualizaciones"

                ],

                answer: 0,

                explanation: "La autenticación en dos pasos añade una verificación adicional."

            }

        ]

    },

 

    danger: {

        title: "Detecta el peligro",

        questions: [

            {

                question: "Recibes un mensaje que promete un premio y solicita tus datos bancarios, ¿qué haces?",

                options: [

                    "Entrego mis datos",

                    "Lo comparto",

                    "No proporciono información y verifico el mensaje"

                ],

                answer: 2,

                explanation: "Los premios inesperados que solicitan datos financieros pueden ser una estafa."

            },

            {

                question: "Una persona desconocida te pide una fotografía privada, ¿qué haces?",

                options: [

                    "La envío",

                    "No la comparto y bloqueo si es necesario",

                    "Le envío también mi dirección"

                ],

                answer: 1,

                explanation: "No compartas contenido privado con desconocidos."

            },

            {

                question: "Tu computadora muestra una alerta sospechosa que te exige descargar un archivo, ¿qué haces?",

                options: [

                    "Descargo el archivo",

                    "Ignoro la seguridad",

                    "Cierro la página y verifico la alerta con una fuente confiable"

                ],

                answer: 2,

                explanation: "Algunas alertas falsas intentan engañarte para instalar programas maliciosos."

            }

        ]

    },

 

    phishing: {

        title: "Cazador de phishing",

        questions: [

            {

                question: "Recibes un correo que dice que tu cuenta será eliminada en 10 minutos si no ingresas tu contraseña, ¿qué debes hacer?",

                options: [

                    "Abrir el enlace inmediatamente",

                    "Verificar el mensaje desde la página oficial",

                    "Responder enviando tu contraseña"

                ],

                answer: 1,

                explanation: "La urgencia y la solicitud de credenciales son señales frecuentes de phishing."

            },

            {

                question: "¿Qué detalle puede revelar que un correo es falso?",

                options: [

                    "El remitente utiliza un dominio extraño",

                    "El mensaje tiene una fecha",

                    "El correo incluye tu nombre"

                ],

                answer: 0,

                explanation: "Los dominios que imitan a empresas reales pueden utilizarse para engañar."

            },

            {

                question: "Una página copia el diseño de tu banco y solicita tus datos, ¿qué haces?",

                options: [

                    "Ingreso todos mis datos",

                    "Guardo la página",

                    "Cierro la página y entro desde la aplicación oficial"

                ],

                answer: 2,

                explanation: "Accede a tus servicios financieros mediante sus canales oficiales."

            }

        ]

    },

 

    intruder: {

        title: "Detecta al intruso",

        questions: [

            {

                question: "Tu cuenta muestra un inicio de sesión desde un país donde nunca has estado, ¿qué haces?",

                options: [

                    "Ignoro la notificación",

                    "Reviso la actividad y aseguro mi cuenta",

                    "Comparto el aviso con desconocidos"

                ],

                answer: 1,

                explanation: "Un acceso desconocido puede indicar que alguien obtuvo tus credenciales."

            },

            {

                question: "¿Qué debes hacer si sospechas que alguien conoce tu contraseña?",

                options: [

                    "Cambiarla por una contraseña única",

                    "Mantenerla sin cambios",

                    "Publicarla para advertir a otros"

                ],

                answer: 0,

                explanation: "Cambia la contraseña y activa la autenticación en dos pasos."

            },

            {

                question: "¿Qué medida ayuda a expulsar a una persona que accedió a tu cuenta?",

                options: [

                    "Cambiar tu foto de perfil",

                    "Desactivar las notificaciones",

                    "Cerrar las sesiones desconocidas"

                ],

                answer: 2,

                explanation: "Revisa los dispositivos conectados y cierra las sesiones que no reconozcas."

            }

        ]

    },

 

    decisions: {

        title: "Decisiones digitales",

        questions: [

            {

                question: "Estás conectado a una red Wi-Fi pública y necesitas ingresar a tu banco, ¿qué es lo más seguro?",

                options: [

                    "Utilizar cualquier red disponible",

                    "Esperar y usar una conexión confiable",

                    "Compartir tus datos con el administrador"

                ],

                answer: 1,

                explanation: "Evita operaciones sensibles en redes públicas que no sean confiables."

            },

            {

                question: "Un compañero está siendo víctima de ciberacoso, ¿qué deberías hacer?",

                options: [

                    "Compartir las burlas",

                    "Ignorar siempre la situación",

                    "Apoyarlo y reportar el contenido"

                ],

                answer: 2,

                explanation: "Apoyar a la víctima y reportar el acoso ayuda a detenerlo."

            },

            {

                question: "Encuentras una noticia alarmante en redes sociales, ¿qué haces antes de compartirla?",

                options: [

                    "Verifico su fuente y su información",

                    "La comparto inmediatamente",

                    "Cambio el titular"

                ],

                answer: 0,

                explanation: "Verificar la información ayuda a evitar la difusión de noticias falsas."

            }

        ]

    },

 

    memory: {

        title: "Memoria cibernética",

        questions: [

            {

                question: "¿Qué característica debe tener una contraseña segura?",

                options: [

                    "Ser igual al nombre del usuario",

                    "Ser larga y difícil de adivinar",

                    "Contener solamente números consecutivos"

                ],

                answer: 1,

                explanation: "Las contraseñas largas y únicas ofrecen una mejor protección."

            },

            {

                question: "¿Qué herramienta permite guardar contraseñas de forma segura?",

                options: [

                    "Una publicación en redes sociales",

                    "Un documento público",

                    "Un administrador de contraseñas confiable"

                ],

                answer: 2,

                explanation: "Un administrador de contraseñas permite almacenar claves de forma protegida."

            },

            {

                question: "¿Qué debes recordar sobre los códigos de verificación?",

                options: [

                    "No debes compartirlos con otras personas",

                    "Debes publicarlos en Internet",

                    "Debes enviarlos a cualquier persona que los solicite"

                ],

                answer: 0,

                explanation: "Los códigos de verificación son privados y pueden permitir el acceso a tus cuentas."

            }

        ]

    },

 

    mission: {

        title: "Misión: cuenta segura",

        questions: [

            {

                question: "Primera misión: ¿qué debes hacer para proteger una cuenta nueva?",

                options: [

                    "Usar una contraseña sencilla",

                    "Utilizar una contraseña única y robusta",

                    "Compartir la contraseña"

                ],

                answer: 1,

                explanation: "Una contraseña única reduce el riesgo de que otras cuentas queden comprometidas."

            },

            {

                question: "Segunda misión: ¿qué debes activar para reforzar el acceso?",

                options: [

                    "La autenticación en dos pasos",

                    "El acceso público",

                    "La opción de recordar la contraseña en cualquier equipo"

                ],

                answer: 0,

                explanation: "La autenticación en dos pasos agrega una segunda comprobación."

            },

            {

                question: "Última misión: ¿qué debes mantener actualizado?",

                options: [

                    "Solamente tu foto",

                    "Tus publicaciones",

                    "Tus métodos de recuperación y datos de seguridad"

                ],

                answer: 2,

                explanation: "Mantener actualizados los métodos de recuperación facilita proteger y recuperar tu cuenta."

            }

        ]

    },

 

    speed: {

        title: "Desafío contrarreloj",

        timeLimit: 30,

        questions: [

            {

                question: "¿Qué debes hacer con un archivo adjunto inesperado?",

                options: [

                    "Abrirlo inmediatamente",

                    "Verificar su origen antes de abrirlo",

                    "Reenviarlo a todos"

                ],

                answer: 1,

                explanation: "Los archivos inesperados pueden contener programas maliciosos."

            },

            {

                question: "¿Cuál es una señal de una contraseña débil?",

                options: [

                    "Es larga y única",

                    "Utiliza una combinación compleja",

                    "Contiene datos personales fáciles de adivinar"

                ],

                answer: 2,

                explanation: "Los datos personales pueden ser conocidos o descubiertos por otras personas."

            },

            {

                question: "¿Qué debes hacer si recibes un código de acceso que no solicitaste?",

                options: [

                    "No compartirlo y revisar la seguridad de tu cuenta",

                    "Enviarlo a quien te lo pida",

                    "Publicarlo"

                ],

                answer: 0,

                explanation: "Podría significar que alguien está intentando ingresar a tu cuenta."

            },

            {

                question: "¿Qué ayuda a proteger tu celular?",

                options: [

                    "Instalar aplicaciones desconocidas",

                    "Mantenerlo actualizado y utilizar bloqueo de pantalla",

                    "Desactivar todas las medidas de seguridad"

                ],

                answer: 1,

                explanation: "Las actualizaciones y el bloqueo de pantalla reducen riesgos."

            },

            {

                question: "¿Qué haces ante una solicitud sospechosa de información personal?",

                options: [

                    "Entrego mis datos",

                    "Respondo con mis contraseñas",

                    "Verifico la identidad del solicitante"

                ],

                answer: 2,

                explanation: "Comprueba quién solicita la información y si realmente la necesita."

            }

        ]

    }

};

 

 

// DETENER TEMPORIZADOR

 

function stopGameTimer() {

    if (gameTimerInterval !== null) {

        clearInterval(gameTimerInterval);

        gameTimerInterval = null;

    }

}

 

 

// ACTUALIZAR TEMPORIZADOR

 

function updateGameTimerDisplay() {

    const timer = document.getElementById("gameTimer");

 

    if (timer) {

        timer.textContent = "Tiempo restante: " + gameTimeLeft + " s";

    }

}

 

 

// INICIAR TEMPORIZADOR

 

function startGameTimer() {

    stopGameTimer();

 

    gameTimeLeft = games[currentGame].timeLimit || 30;

    updateGameTimerDisplay();

 

    gameTimerInterval = setInterval(() => {

        if (gameFinished || currentGame !== "speed") {

            stopGameTimer();

            return;

        }

 

        gameTimeLeft--;

        updateGameTimerDisplay();

 

        if (gameTimeLeft <= 0) {

            stopGameTimer();

            finishGame(true);

        }

    }, 1000);

}

 

 

// INICIAR JUEGO

 

function startGame(gameName) {

    const game = games[gameName];

 

    if (!game || !gameArea || !gameContent) return;

 

    stopGameTimer();

 

    currentGame = gameName;

    currentQuestion = 0;

    currentScore = 0;

    gameFinished = false;

    answerLocked = false;

 

    if (gameTitle) {

        gameTitle.textContent = game.title;

    }

 

    gameArea.hidden = false;

 

    renderQuestion();

 

    if (gameName === "speed") {

        startGameTimer();

    }

 

    gameArea.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}

 

 

// MOSTRAR PREGUNTA

 

function renderQuestion() {

    if (!currentGame || gameFinished) return;

 

    const game = games[currentGame];

    const question = game.questions[currentQuestion];

 

    if (!question) return;

 

    answerLocked = false;

 

    gameContent.innerHTML = `

        <p class="game-progress">

            Pregunta ${currentQuestion + 1} de ${game.questions.length}

        </p>

 

        ${currentGame === "speed" ? `

            <p class="game-progress" id="gameTimer">

                Tiempo restante: ${gameTimeLeft} s

            </p>

        ` : ""}

 

        <p class="question-text">

            ${question.question}

        </p>

 

        <div class="game-options">

            ${question.options.map((option, index) => `

                <button

                    class="game-option"

                    data-answer="${index}"

                    type="button"

                >

                    ${option}

                </button>

            `).join("")}

        </div>

 

        <p class="game-feedback" id="gameFeedback" aria-live="polite"></p>

    `;

 

    if (currentGame === "speed") {

        updateGameTimerDisplay();

    }

 

    gameContent.querySelectorAll("[data-answer]").forEach(button => {

        button.addEventListener("click", () => {

            checkAnswer(Number(button.dataset.answer));

        });

    });

}

 

 

// COMPROBAR RESPUESTA

 

function checkAnswer(selectedAnswer) {

    if (!currentGame || gameFinished || answerLocked) return;

 

    const game = games[currentGame];

    const question = game.questions[currentQuestion];

 

    if (!question) return;

 

    answerLocked = true;

 

    const buttons = gameContent.querySelectorAll("[data-answer]");

    const feedback = document.getElementById("gameFeedback");

 

    buttons.forEach(button => {

        button.disabled = true;

    });

 

    if (selectedAnswer === question.answer) {

        currentScore++;

 

        playCorrectSound();

 

        showMessage(

            feedback,

            "¡Correcto! " + question.explanation,

            "#20c997"

        );

    } else {

        playIncorrectSound();

 

        showMessage(

            feedback,

            "Respuesta incorrecta. " + question.explanation,

            "#ff8a8a"

        );

    }

 

    const nextButton = document.createElement("button");

 

    nextButton.className = "btn btn-primary";

    nextButton.type = "button";

 

    nextButton.textContent =

        currentQuestion === game.questions.length - 1

            ? "Ver resultado"

            : "Siguiente pregunta";

 

    nextButton.addEventListener("click", () => {

        if (gameFinished) return;

 

        currentQuestion++;

 

        if (currentQuestion < game.questions.length) {

            renderQuestion();

        } else {

            finishGame();

        }

    });

 

    gameContent.appendChild(nextButton);

}

 

 

// FINALIZAR JUEGO

 

async function finishGame(timeExpired = false) {

    if (gameFinished || !currentGame) return;

 

    gameFinished = true;

    stopGameTimer();

 

    const finishedGame = currentGame;

    const total = games[finishedGame].questions.length;

    const points = currentScore * 10;

 

    gameContent.innerHTML = `

        <div class="game-result">

            <i class="fa-solid fa-trophy"

               style="font-size:42px;color:#00C2A8"></i>

 

            <h3>${timeExpired ? "¡Tiempo terminado!" : "¡Desafío completado!"}</h3>

 

            <p>

                Respuestas correctas: ${currentScore} de ${total}

            </p>

 

            <p>

                Puntuación obtenida: ${points} XP

            </p>

 

            ${timeExpired ? `

                <p>El tiempo se terminó, puedes volver a intentarlo para mejorar tu puntuación.</p>

            ` : ""}

 

            <button class="btn btn-primary" id="playAgain" type="button">

                Volver a jugar

            </button>

        </div>

    `;

 

    await saveGameProgress(points);

 

    playCompletionSound();

 

    const playAgain = document.getElementById("playAgain");

 

    if (playAgain) {

        playAgain.addEventListener("click", () => {

            startGame(finishedGame);

        });

    }

}

 

 

// CONECTAR BOTONES DE LOS JUEGOS

 

document.querySelectorAll(".game-start").forEach(button => {

    button.addEventListener("click", () => {

        startGame(button.dataset.game);

    });

});

 

 

// CERRAR JUEGO

 

if (closeGame) {

    closeGame.addEventListener("click", () => {

        stopGameTimer();

 

        if (gameArea) {

            gameArea.hidden = true;

        }

 

        currentGame = null;

        gameFinished = false;

        answerLocked = false;

    });

}

 

 

// ======================================================

// 11. CONEXIÓN CON FIRESTORE

// ======================================================

 

async function saveGameProgress(points) {

    if (!currentUser || !db) {

        showMessage(

            accountStatus,

            "Inicia sesión para guardar tu progreso.",

            "#ffb4a8"

        );

 

        return;

    }

 

    try {

        const progressRef = db

            .collection("progress")

            .doc(currentUser.uid);

 

        const newXP = currentProgress.xp + points;

        const newCompleted = currentProgress.completed + 1;

 

        await progressRef.set({

            xp: newXP,

            completed: newCompleted,

            updatedAt:

                firebase.firestore.FieldValue.serverTimestamp()

        }, {

            merge: true

        });

 

        currentProgress.xp = newXP;

        currentProgress.completed = newCompleted;

 

        updateDashboard();

 

        showMessage(

            accountStatus,

            "¡Tu progreso se guardó correctamente!",

            "#20c997"

        );

    } catch (error) {

        console.error("Error guardando progreso:", error);

 

        showMessage(

            accountStatus,

            "No se pudo guardar el progreso. Revisa tu conexión.",

            "#ff8a8a"

        );

    }

}

 

 

// ======================================================

// 12. PANEL DE USUARIO

// ======================================================

 

const userDashboard = document.getElementById("userDashboard");

const accountEmail = document.getElementById("accountEmail");

 

const dashboardName = document.getElementById("dashboardName");

const dashboardRole = document.getElementById("dashboardRole");

 

const dashboardXp = document.getElementById("dashboardXp");

const dashboardCompleted = document.getElementById("dashboardCompleted");

 

function updateDashboard() {

    if (!currentUser || !currentUserData) return;

 

    if (userDashboard) {

        userDashboard.hidden = false;

    }

 

    if (accountEmail) {

        accountEmail.textContent = currentUser.email || "";

    }

 

    if (dashboardName) {

        dashboardName.textContent =

            currentUserData.name || "Usuario";

    }

 

    if (dashboardRole) {

        const roleNames = {

            estudiante: "Estudiante",

            publico: "Público general",

            docente: "Docente"

        };

 

        dashboardRole.textContent =

            roleNames[currentUserData.role] || "Usuario";

    }

 

    if (dashboardXp) {

        dashboardXp.textContent = currentProgress.xp;

    }

 

    if (dashboardCompleted) {

        dashboardCompleted.textContent = currentProgress.completed;

    }

}

 

 

// ======================================================

// 13. MODAL DE AUTENTICACIÓN

// ======================================================

 

const authModal = document.getElementById("authModal");

const authForm = document.getElementById("authForm");

const authModeSwitch = document.getElementById("authModeSwitch");

 

const authEmail = document.getElementById("authEmail");

const authPassword = document.getElementById("authPassword");

 

const authName = document.getElementById("authName");

const authRole = document.getElementById("authRole");

 

const authMessage = document.getElementById("authMessage");

 

let authMode = "login";

 

function setAuthMode(mode) {

    authMode = mode;

 

    const title = document.getElementById("authHeading");

    const submit = document.getElementById("authSubmit");

 

    const nameLabel = document.getElementById("authNameLabel");

    const roleLabel = document.getElementById("authRoleLabel");

 

    const modeText = document.getElementById("authModeText");

 

    if (mode === "register") {

        if (title) title.textContent = "Crear cuenta";

        if (submit) submit.textContent = "Registrarme";

 

        if (authName) authName.hidden = false;

        if (nameLabel) nameLabel.hidden = false;

 

        if (authRole) authRole.hidden = false;

        if (roleLabel) roleLabel.hidden = false;

 

        if (modeText) {

            modeText.textContent = "¿Ya tienes una cuenta?";

        }

 

        if (authPassword) {

            authPassword.autocomplete = "new-password";

        }

    } else {

        if (title) title.textContent = "Iniciar sesión";

        if (submit) submit.textContent = "Ingresar";

 

        if (authName) authName.hidden = true;

        if (nameLabel) nameLabel.hidden = true;

 

        if (authRole) authRole.hidden = true;

        if (roleLabel) roleLabel.hidden = true;

 

        if (modeText) {

            modeText.textContent = "¿Aún no tienes una cuenta?";

        }

 

        if (authPassword) {

            authPassword.autocomplete = "current-password";

        }

    }

 

    if (authMessage) {

        authMessage.textContent = "";

    }

}

 

if (loginButton && authModal) {

    loginButton.addEventListener("click", () => {

        setAuthMode("login");

        openModal(authModal);

    });

}

 

const closeAuth = document.getElementById("closeAuth");

 

if (closeAuth) {

    closeAuth.addEventListener("click", () => {

        closeModal(authModal);

    });

}

 

if (authModeSwitch) {

    authModeSwitch.addEventListener("click", () => {

        setAuthMode(

            authMode === "login" ? "register" : "login"

        );

    });

}

 

if (authModal) {

    authModal.addEventListener("click", event => {

        if (event.target === authModal) {

            closeModal(authModal);

        }

    });

}

 

 

// ======================================================

// 14. REGISTRO E INICIO DE SESIÓN

// ======================================================

 

if (authForm) {

    authForm.addEventListener("submit", async event => {

        event.preventDefault();

 

        if (!firebaseReady || !auth || !db) {

            showMessage(

                authMessage,

                "Firebase no está conectado.",

                "#ff8a8a"

            );

            return;

        }

 

        const email = authEmail.value.trim();

        const password = authPassword.value;

 

        const submitButton =

            document.getElementById("authSubmit");

 

        try {

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent = "Procesando...";

            }

 

            if (authMode === "register") {

                const name = authName.value.trim();

                const role = authRole.value;

 

                if (!name) {

                    throw new Error("Escribe tu nombre completo.");

                }

 

                if (!["estudiante", "publico"].includes(role)) {

                    throw new Error("Selecciona un perfil válido.");

                }

 

                const result =

                    await auth.createUserWithEmailAndPassword(

                        email,

                        password

                    );

 

                await db.collection("users")

                    .doc(result.user.uid)

                    .set({

                        name: name,

                        email: email,

                        role: role,

                        createdAt:

                            firebase.firestore.FieldValue.serverTimestamp()

                    });

 

                await db.collection("progress")

                    .doc(result.user.uid)

                    .set({

                        xp: 0,

                        completed: 0,

                        updatedAt:

                            firebase.firestore.FieldValue.serverTimestamp()

                    });

 

                currentUser = result.user;

 

                currentUserData = {

                    name: name,

                    email: email,

                    role: role

                };

 

                currentProgress = {

                    xp: 0,

                    completed: 0

                };

 

                updateDashboard();

            } else {

                await auth.signInWithEmailAndPassword(

                    email,

                    password

                );

            }

 

            closeModal(authModal);

 

            showMessage(

                accountStatus,

                "Sesión iniciada correctamente.",

                "#20c997"

            );

        } catch (error) {

            console.error("Error de autenticación:", error);

 

            const messages = {

                "auth/email-already-in-use":

                    "Este correo ya tiene una cuenta.",

 

                "auth/invalid-email":

                    "El correo no tiene un formato válido.",

 

                "auth/weak-password":

                    "La contraseña debe tener al menos 6 caracteres.",

 

                "auth/user-not-found":

                    "No existe una cuenta con ese correo.",

 

                "auth/wrong-password":

                    "La contraseña es incorrecta.",

 

                "auth/invalid-credential":

                    "Correo o contraseña incorrectos.",

 

                "auth/too-many-requests":

                    "Demasiados intentos. Inténtalo más tarde.",

 

                "permission-denied":

                    "Firebase no permite esta operación. Revisa las reglas de Firestore."

            };

 

            showMessage(

                authMessage,

                messages[error.code] || error.message,

                "#ff8a8a"

            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

 

                submitButton.textContent =

                    authMode === "register"

                        ? "Registrarme"

                        : "Ingresar";

            }

        }

    });

}

 

 

// ======================================================

// 15. CARGAR INFORMACIÓN DEL USUARIO

// ======================================================

 

async function loadUserData(user) {

    if (!user || !db) return;

 

    try {

        const userRef = db.collection("users").doc(user.uid);

        const progressRef = db.collection("progress").doc(user.uid);

 

        const userDocument = await userRef.get();

 

        if (!userDocument.exists) {

            currentUser = user;

            currentUserData = null;

 

            if (userDashboard) {

                userDashboard.hidden = true;

            }

 

            updateAccountMenu();

 

            showMessage(

                accountStatus,

                "No se encontró el perfil de esta cuenta.",

                "#ffb4a8"

            );

 

            return;

        }

 

        const progressDocument = await progressRef.get();

 

        currentUser = user;

        currentUserData = userDocument.data();

 

        currentProgress = progressDocument.exists

            ? {

                xp: Number(progressDocument.data().xp) || 0,

                completed: Number(progressDocument.data().completed) || 0

            }

            : {

                xp: 0,

                completed: 0

            };

 

        updateDashboard();

 

        showMessage(

            accountStatus,

            "Cuenta conectada correctamente.",

            "#20c997"

        );

    } catch (error) {

        console.error("Error cargando usuario:", error);

 

        showMessage(

            accountStatus,

            "No se pudo cargar tu perfil. Revisa Firestore.",

            "#ff8a8a"

        );

    }

}

 

 

// ======================================================

// 16. DETECTAR SESIÓN ACTIVA

// ======================================================

 

if (firebaseReady && auth) {

    auth.onAuthStateChanged(async user => {

        if (user) {

            await loadUserData(user);

        } else {

            currentUser = null;

            currentUserData = null;

 

            currentProgress = {

                xp: 0,

                completed: 0

            };

 

            if (userDashboard) {

                userDashboard.hidden = true;

            }

 

            if (accountEmail) {

                accountEmail.textContent = "No has iniciado sesión";

            }

 

            if (accountStatus) {

                showMessage(

                    accountStatus,

                    "Inicia sesión para guardar tu progreso."

                );

            }

 

            updateAccountMenu();

        }

    });

} else {

    showMessage(

        accountStatus,

        "No se pudo conectar con Firebase. Revisa la configuración.",

        "#ff8a8a"

    );

}

 

 

// ======================================================

// 17. CERRAR SESIÓN

// ======================================================

 

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        if (!auth) return;

 

        try {

            await auth.signOut();

 

            showMessage(

                accountStatus,

                "Sesión cerrada correctamente."

            );

        } catch (error) {

            console.error("Error cerrando sesión:", error);

 

            showMessage(

                accountStatus,

                "No se pudo cerrar la sesión.",

                "#ff8a8a"

            );

        }

    });

}

 

 

// ======================================================

// 18. CERRAR MODALES CON ESCAPE

// ======================================================

 

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") return;

 

    closeModal(authModal);

    closeModal(profileModal);

    closeModal(topicModal);

 

    stopGameTimer();

 

    if (gameArea) {

        gameArea.hidden = true;

    }

 

    currentGame = null;

    gameFinished = false;

    answerLocked = false;

});

 

 

// ======================================================

// 19. INICIALIZACIÓN

// ======================================================

 

setAuthMode("login");

 

console.log("CIBERGUARD: Sistema principal iniciado");

 

 

// ======================================================

// 20. ELEMENTOS DEL MENÚ DE CUENTA

// ======================================================

 

const accountMenuButton =

    document.getElementById("accountMenuButton");

 

const accountDropdown =

    document.getElementById("accountDropdown");

 

const headerAvatarImage =

    document.getElementById("headerAvatarImage");

 

const headerAvatarFallback =

    document.getElementById("headerAvatarFallback");

 

const menuAccountName =

    document.getElementById("menuAccountName");

 

const menuAccountEmail =

    document.getElementById("menuAccountEmail");

 

const openAvatarSettings =

    document.getElementById("openAvatarSettings");

 

const menuThemeButton =

    document.getElementById("menuThemeButton");

 

const openAccountDetails =

    document.getElementById("openAccountDetails");

 

const openExperienceSettings =

    document.getElementById("openExperienceSettings");

 

const logoutMenuButton =

    document.getElementById("logoutMenuButton");

 

const avatarModal =

    document.getElementById("avatarModal");

 

const accountDetailsModal =

    document.getElementById("accountDetailsModal");

 

const experienceModal =

    document.getElementById("experienceModal");

 

const avatarPreviewImage =

    document.getElementById("avatarPreviewImage");

 

const avatarPreviewFallback =

    document.getElementById("avatarPreviewFallback");

 

const avatarGallery =

    document.getElementById("avatarGallery");

 

const avatarUpload =

    document.getElementById("avatarUpload");

 

const saveAvatarButton =

    document.getElementById("saveAvatarButton");

 

const avatarMessage =

    document.getElementById("avatarMessage");

 

const detailsName =

    document.getElementById("detailsName");

 

const detailsEmail =

    document.getElementById("detailsEmail");

 

const detailsRole =

    document.getElementById("detailsRole");

 

const experienceAnimations =

    document.getElementById("experienceAnimations");

 

const experienceSounds =

    document.getElementById("experienceSounds");

 

const saveExperienceButton =

    document.getElementById("saveExperienceButton");

 

const experienceMessage =

    document.getElementById("experienceMessage");

 

 

// ======================================================

// 21. PERSONALIZACIÓN

// ======================================================

 

const defaultAvatar = "user";

 

const avatarIcons = {

    user: "fa-solid fa-user",

    "user-astronaut": "fa-solid fa-user-astronaut",

    "user-ninja": "fa-solid fa-user-ninja",

    robot: "fa-solid fa-robot",

    cat: "fa-solid fa-cat",

    gamepad: "fa-solid fa-gamepad",

    ghost: "fa-solid fa-ghost",

    dragon: "fa-solid fa-dragon",

    shield: "fa-solid fa-shield-halved",

    "user-secret": "fa-solid fa-user-secret",

    bolt: "fa-solid fa-bolt",

    star: "fa-solid fa-star"

};

 

let selectedAvatar = defaultAvatar;

let selectedPhoto = null;

 

let userSettings = {

    theme: "dark",

    animations: true,

    sounds: false

};

 

 

// ======================================================

// 22. MENÚ DESPLEGABLE

// ======================================================

 

function toggleAccountMenu(forceClose = false) {

    if (!accountDropdown || !accountMenuButton) return;

 

    const shouldOpen =

        !forceClose && accountDropdown.hidden;

 

    accountDropdown.hidden = !shouldOpen;

 

    accountMenuButton.setAttribute(

        "aria-expanded",

        String(shouldOpen)

    );

}

 

if (accountMenuButton) {

    accountMenuButton.addEventListener("click", event => {

        event.stopPropagation();

        toggleAccountMenu();

    });

}

 

document.addEventListener("click", event => {

    if (

        accountDropdown &&

        accountMenuButton &&

        !accountDropdown.contains(event.target) &&

        !accountMenuButton.contains(event.target)

    ) {

        toggleAccountMenu(true);

    }

});

 

 

// ======================================================

// 23. AVATAR DEL USUARIO

// ======================================================

 

function getPhotoStorageKey() {

    if (!currentUser) return null;

 

    return "cg_photo_" + currentUser.uid;

}

 

function renderAvatar() {

    const photoKey = getPhotoStorageKey();

 

    const savedPhoto = photoKey

        ? localStorage.getItem(photoKey)

        : null;

 

    if (savedPhoto) {

        if (headerAvatarImage) {

            headerAvatarImage.src = savedPhoto;

            headerAvatarImage.hidden = false;

        }

 

        if (headerAvatarFallback) {

            headerAvatarFallback.hidden = true;

        }

 

        if (avatarPreviewImage) {

            avatarPreviewImage.src = savedPhoto;

            avatarPreviewImage.hidden = false;

        }

 

        if (avatarPreviewFallback) {

            avatarPreviewFallback.hidden = true;

        }

 

        return;

    }

 

    const iconClass =

        avatarIcons[selectedAvatar] ||

        avatarIcons[defaultAvatar];

 

    if (headerAvatarImage) {

        headerAvatarImage.hidden = true;

        headerAvatarImage.removeAttribute("src");

    }

 

    if (headerAvatarFallback) {

        headerAvatarFallback.hidden = false;

        headerAvatarFallback.innerHTML =

            `<i class="${iconClass}"></i>`;

    }

 

    if (avatarPreviewImage) {

        avatarPreviewImage.hidden = true;

        avatarPreviewImage.removeAttribute("src");

    }

 

    if (avatarPreviewFallback) {

        avatarPreviewFallback.hidden = false;

        avatarPreviewFallback.innerHTML =

            `<i class="${iconClass}"></i>`;

    }

}

 

function updateAccountMenu() {

    const isLoggedIn =

        Boolean(currentUser && currentUserData);

 

    if (loginButton) {

        loginButton.hidden = isLoggedIn;

    }

 

    if (accountMenuButton) {

        accountMenuButton.hidden = !isLoggedIn;

    }

 

    if (!isLoggedIn) {

        toggleAccountMenu(true);

        return;

    }

 

    if (menuAccountName) {

        menuAccountName.textContent =

            currentUserData.name || "Usuario";

    }

 

    if (menuAccountEmail) {

        menuAccountEmail.textContent =

            currentUser.email || "";

    }

 

    selectedAvatar =

        currentUserData.avatar || defaultAvatar;

 

    renderAvatar();

}

 

 

// ======================================================

// 24. VENTANAS DE PERSONALIZACIÓN

// ======================================================

 

function closeAccountModals() {

    closeModal(avatarModal);

    closeModal(accountDetailsModal);

    closeModal(experienceModal);

}

 

function connectAccountModal(modal) {

    if (!modal) return;

 

    const closeButton =

        modal.querySelector(".close-button");

 

    if (closeButton) {

        closeButton.addEventListener("click", () => {

            closeModal(modal);

        });

    }

 

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            closeModal(modal);

        }

    });

}

 

connectAccountModal(avatarModal);

connectAccountModal(accountDetailsModal);

connectAccountModal(experienceModal);

 

 

// ======================================================

// 25. CAMBIAR AVATAR

// ======================================================

 

if (openAvatarSettings) {

    openAvatarSettings.addEventListener("click", () => {

        toggleAccountMenu(true);

 

        selectedAvatar =

            currentUserData?.avatar || defaultAvatar;

 

        selectedPhoto = null;

 

        if (avatarUpload) {

            avatarUpload.value = "";

        }

 

        renderAvatar();

 

        if (avatarGallery) {

            avatarGallery.querySelectorAll(".avatar-option")

                .forEach(option => {

                    option.classList.toggle(

                        "selected",

                        option.dataset.avatar === selectedAvatar

                    );

                });

        }

 

        showMessage(avatarMessage, "");

        openModal(avatarModal);

    });

}

 

if (avatarGallery) {

    avatarGallery.addEventListener("click", event => {

        const option = event.target.closest(".avatar-option");

 

        if (!option) return;

 

        const avatar = option.dataset.avatar;

 

        if (!avatarIcons[avatar]) return;

 

        selectedAvatar = avatar;

        selectedPhoto = null;

 

        avatarGallery.querySelectorAll(".avatar-option")

            .forEach(item => {

                item.classList.toggle("selected", item === option);

            });

 

        renderAvatar();

 

        showMessage(

            avatarMessage,

            "Avatar seleccionado, guarda los cambios.",

            "#20c997"

        );

    });

}

 

 

// ======================================================

// 26. FOTOGRAFÍA DE PERFIL LOCAL

// ======================================================

 

if (avatarUpload) {

    avatarUpload.addEventListener("change", event => {

        const file = event.target.files[0];

 

        if (!file) return;

 

        if (!file.type.startsWith("image/")) {

            showMessage(

                avatarMessage,

                "Selecciona un archivo de imagen válido.",

                "#ff8a8a"

            );

 

            return;

        }

 

        if (file.size > 5 * 1024 * 1024) {

            showMessage(

                avatarMessage,

                "La imagen no debe superar los 5 MB.",

                "#ff8a8a"

            );

 

            avatarUpload.value = "";

            return;

        }

 

        const reader = new FileReader();

 

        reader.onload = () => {

            const image = new Image();

 

            image.onload = () => {

                const canvas = document.createElement("canvas");

 

                const maximumSize = 300;

 

                let width = image.width;

                let height = image.height;

 

                if (width > height && width > maximumSize) {

                    height = Math.round(

                        height * maximumSize / width

                    );

 

                    width = maximumSize;

                } else if (height > maximumSize) {

                    width = Math.round(

                        width * maximumSize / height

                    );

 

                    height = maximumSize;

                }

 

                canvas.width = width;

                canvas.height = height;

 

                const context = canvas.getContext("2d");

 

                if (!context) {

                    showMessage(

                        avatarMessage,

                        "No se pudo procesar esta imagen.",

                        "#ff8a8a"

                    );

                    return;

                }

 

                context.drawImage(

                    image,

                    0,

                    0,

                    width,

                    height

                );

 

                selectedPhoto = canvas.toDataURL(

                    "image/jpeg",

                    0.75

                );

 

                if (avatarPreviewImage) {

                    avatarPreviewImage.src = selectedPhoto;

                    avatarPreviewImage.hidden = false;

                }

 

                if (avatarPreviewFallback) {

                    avatarPreviewFallback.hidden = true;

                }

 

                showMessage(

                    avatarMessage,

                    "Fotografía cargada, guarda los cambios.",

                    "#20c997"

                );

            };

 

            image.onerror = () => {

                showMessage(

                    avatarMessage,

                    "No se pudo procesar esta imagen.",

                    "#ff8a8a"

                );

            };

 

            image.src = reader.result;

        };

 

        reader.readAsDataURL(file);

    });

}

 

 

// GUARDAR AVATAR

 

if (saveAvatarButton) {

    saveAvatarButton.addEventListener("click", async () => {

        if (!currentUser || !db) {

            showMessage(

                avatarMessage,

                "Inicia sesión para guardar tu avatar.",

                "#ff8a8a"

            );

 

            return;

        }

 

        try {

            saveAvatarButton.disabled = true;

            saveAvatarButton.textContent = "Guardando...";

 

            const photoKey = getPhotoStorageKey();

 

            if (selectedPhoto) {

                try {

                    localStorage.setItem(

                        photoKey,

                        selectedPhoto

                    );

                } catch (storageError) {

                    throw new Error(

                        "No hay espacio suficiente para guardar la fotografía en este navegador."

                    );

                }

 

                selectedAvatar = "photo";

            } else {

                if (photoKey) {

                    localStorage.removeItem(photoKey);

                }

 

                if (!avatarIcons[selectedAvatar]) {

                    selectedAvatar = defaultAvatar;

                }

            }

 

            await db.collection("users")

                .doc(currentUser.uid)

                .set({

                    avatar: selectedAvatar,

                    updatedAt:

                        firebase.firestore.FieldValue.serverTimestamp()

                }, {

                    merge: true

                });

 

            currentUserData.avatar = selectedAvatar;

 

            renderAvatar();

            closeModal(avatarModal);

 

            showMessage(

                accountStatus,

                "Tu perfil se actualizó correctamente.",

                "#20c997"

            );

        } catch (error) {

            console.error("Error guardando avatar:", error);

 

            showMessage(

                avatarMessage,

                error.message || "No se pudo guardar el avatar.",

                "#ff8a8a"

            );

        } finally {

            saveAvatarButton.disabled = false;

            saveAvatarButton.textContent = "Guardar cambios";

        }

    });

}

 

 

// ======================================================

// 27. CAMBIAR TEMA DESDE EL MENÚ

// ======================================================

 

if (menuThemeButton) {

    menuThemeButton.addEventListener("click", () => {

        toggleAccountMenu(true);

 

        if (themeToggle) {

            themeToggle.click();

        }

    });

}

 

async function saveThemePreference() {

    if (!currentUser || !db) return;

 

    const theme =

        document.body.classList.contains("light-mode")

            ? "light"

            : "dark";

 

    userSettings.theme = theme;

 

    try {

        await db.collection("users")

            .doc(currentUser.uid)

            .set({

                settings: userSettings,

                updatedAt:

                    firebase.firestore.FieldValue.serverTimestamp()

            }, {

                merge: true

            });

 

        if (currentUserData) {

            currentUserData.settings = { ...userSettings };

        }

    } catch (error) {

        console.error("No se pudo guardar el tema:", error);

    }

}

 

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        saveThemePreference();

    });

}

 

 

// ======================================================

// 28. DATOS DE LA CUENTA

// ======================================================

 

if (openAccountDetails) {

    openAccountDetails.addEventListener("click", () => {

        toggleAccountMenu(true);

 

        if (!currentUser || !currentUserData) return;

 

        const roleNames = {

            estudiante: "Estudiante",

            publico: "Público general",

            docente: "Docente"

        };

 

        if (detailsName) {

            detailsName.textContent =

                currentUserData.name || "No disponible";

        }

 

        if (detailsEmail) {

            detailsEmail.textContent =

                currentUser.email || "No disponible";

        }

 

        if (detailsRole) {

            detailsRole.textContent =

                roleNames[currentUserData.role] || "Usuario";

        }

 

        openModal(accountDetailsModal);

    });

}

 

 

// ======================================================

// 29. PERSONALIZAR EXPERIENCIA

// ======================================================

 

function applyExperienceSettings() {

    const animationsDisabled =

        userSettings.animations === false;

 

    document.documentElement.classList.toggle(

        "animations-disabled",

        animationsDisabled

    );

 

    document.body.classList.toggle(

        "animations-disabled",

        animationsDisabled

    );

 

    document.body.dataset.sounds =

        userSettings.sounds ? "enabled" : "disabled";

}

 

function loadAccountPreferences() {

    const settings = currentUserData?.settings || {};

 

    userSettings = {

        theme: settings.theme || "dark",

        animations: settings.animations !== false,

        sounds: settings.sounds === true

    };

 

    document.body.classList.toggle(

        "light-mode",

        userSettings.theme === "light"

    );

 

    localStorage.setItem("cg_theme", userSettings.theme);

 

    updateThemeIcon();

 

    if (experienceAnimations) {

        experienceAnimations.checked = userSettings.animations;

    }

 

    if (experienceSounds) {

        experienceSounds.checked = userSettings.sounds;

    }

 

    applyExperienceSettings();

}

 

if (openExperienceSettings) {

    openExperienceSettings.addEventListener("click", () => {

        toggleAccountMenu(true);

 

        loadAccountPreferences();

 

        showMessage(experienceMessage, "");

        openModal(experienceModal);

    });

}

 

if (saveExperienceButton) {

    saveExperienceButton.addEventListener("click", async () => {

        if (!currentUser || !db) {

            showMessage(

                experienceMessage,

                "Inicia sesión para guardar tus preferencias.",

                "#ff8a8a"

            );

 

            return;

        }

 

        const previousSettings = { ...userSettings };

 

        userSettings.animations =

            experienceAnimations

                ? experienceAnimations.checked

                : true;

 

        userSettings.sounds =

            experienceSounds

                ? experienceSounds.checked

                : false;

 

        try {

            saveExperienceButton.disabled = true;

            saveExperienceButton.textContent = "Guardando...";

 

            await db.collection("users")

                .doc(currentUser.uid)

                .set({

                    settings: userSettings,

                    updatedAt:

                        firebase.firestore.FieldValue.serverTimestamp()

                }, {

                    merge: true

                });

 

            currentUserData = {

                ...currentUserData,

                settings: { ...userSettings }

            };

 

            applyExperienceSettings();

            closeModal(experienceModal);

 

            showMessage(

                accountStatus,

                "Preferencias guardadas correctamente.",

                "#20c997"

            );

        } catch (error) {

            console.error(

                "Error guardando preferencias:",

                error

            );

 

            userSettings = previousSettings;

            applyExperienceSettings();

 

            showMessage(

                experienceMessage,

                "No se pudieron guardar las preferencias.",

                "#ff8a8a"

            );

        } finally {

            saveExperienceButton.disabled = false;

            saveExperienceButton.textContent = "Guardar cambios";

        }

    });

}

 

 

// ======================================================

// 30. CERRAR SESIÓN DESDE EL MENÚ

// ======================================================

 

if (logoutMenuButton) {

    logoutMenuButton.addEventListener("click", async () => {

        if (!auth) return;

 

        try {

            logoutMenuButton.disabled = true;

 

            await auth.signOut();

 

            toggleAccountMenu(true);

 

            showMessage(

                accountStatus,

                "Sesión cerrada correctamente."

            );

        } catch (error) {

            console.error("Error cerrando sesión:", error);

 

            showMessage(

                accountStatus,

                "No se pudo cerrar la sesión.",

                "#ff8a8a"

            );

        } finally {

            logoutMenuButton.disabled = false;

        }

    });

}

 

 

// ======================================================

// 31. ACTUALIZAR MENÚ Y DASHBOARD

// ======================================================

 

const originalUpdateDashboard = updateDashboard;

 

updateDashboard = function () {

    originalUpdateDashboard();

 

    updateAccountMenu();

    loadAccountPreferences();

};

 

 

// ======================================================

// 32. INICIALIZAR SISTEMA DE CUENTA

// ======================================================

 

updateAccountMenu();

applyExperienceSettings();

 

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        toggleAccountMenu(true);

        closeAccountModals();

    }

});

 

console.log("CIBERGUARD: Sistema de cuenta preparado");

 

 

// ======================================================

// 33. SISTEMA DE EFECTOS DE SONIDO

// ======================================================

 

let audioContext = null;

 

function getAudioContext() {

    if (!userSettings.sounds) return null;

 

    const AudioContextClass =

        window.AudioContext || window.webkitAudioContext;

 

    if (!AudioContextClass) return null;

 

    if (!audioContext) {

        audioContext = new AudioContextClass();

    }

 

    if (audioContext.state === "suspended") {

        audioContext.resume();

    }

 

    return audioContext;

}

 

function playTone(

    frequency,

    duration,

    volume = 0.08,

    type = "sine",

    delay = 0

) {

    const context = getAudioContext();

 

    if (!context) return;

 

    const oscillator = context.createOscillator();

    const gain = context.createGain();

 

    const startTime = context.currentTime + delay;

 

    oscillator.type = type;

 

    oscillator.frequency.setValueAtTime(

        frequency,

        startTime

    );

 

    gain.gain.setValueAtTime(0.001, startTime);

 

    gain.gain.exponentialRampToValueAtTime(

        volume,

        startTime + 0.02

    );

 

    gain.gain.exponentialRampToValueAtTime(

        0.001,

        startTime + duration

    );

 

    oscillator.connect(gain);

    gain.connect(context.destination);

 

    oscillator.start(startTime);

    oscillator.stop(startTime + duration + 0.02);

}

 

function playClickSound() {

    playTone(650, 0.07, 0.035);

}

 

function playNavigationSound() {

    playTone(520, 0.09, 0.035);

    playTone(760, 0.12, 0.025, "sine", 0.07);

}

 

function playCorrectSound() {

    playTone(520, 0.12, 0.07);

    playTone(680, 0.14, 0.07, "sine", 0.12);

    playTone(850, 0.18, 0.06, "sine", 0.25);

}

 

function playIncorrectSound() {

    playTone(280, 0.16, 0.06, "triangle");

    playTone(190, 0.22, 0.055, "triangle", 0.15);

}

 

function playCompletionSound() {

    playTone(520, 0.15, 0.06);

    playTone(660, 0.15, 0.06, "sine", 0.13);

    playTone(780, 0.15, 0.06, "sine", 0.26);

    playTone(1040, 0.30, 0.07, "sine", 0.39);

}

 

 

// DETECTAR CLICS

 

document.addEventListener("click", event => {

    const target = event.target;

 

    if (!(target instanceof Element)) return;

 

    const element = target.closest(

        "button, a, [role='button']"

    );

 

    if (!element || element.disabled) return;

 

    if (element.matches(".game-option")) return;

 

    if (element.closest("#navLinks")) {

        playNavigationSound();

    } else {

        playClickSound();

    }

});

 

 

// ======================================================

// FIN DEL JAVASCRIPT PRINCIPAL

// ======================================================

 

console.log("CIBERGUARD: Todos los módulos fueron cargados");

// ======================================================

// CIBERGUARD - REGISTRO DE SERVICE WORKER

// ======================================================

 

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker

            .register("./sw.js")

            .then(registration => {

                console.log(

                    "CIBERGUARD: Service Worker registrado correctamente",

                    registration.scope

                );

            })

            .catch(error => {

                console.error(

                    "CIBERGUARD: Error al registrar Service Worker:",

                    error

                );

            });

    });

}