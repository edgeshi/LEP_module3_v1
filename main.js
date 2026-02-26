const appState = {
    currentStep: 0,
    recording: false,
    startTime: null,
    points: 0,
    evaluation: {
        goal: false,
        jargon: false,
        risk: false,
        culture: false,
        turntaking: false
    }
};

const CHAR_ICONS = {
    RN: '<img src="./assets/nurse.png" class="char-img" alt="RN">',
    Interpreter: '<img src="./assets/interpreter.png" class="char-img" alt="Interpreter">',
    Patient: '<img src="./assets/patient.png" class="char-img" alt="Patient">'
};

const dialogue = [
    { role: 'RN', text: 'Hello Luna, can you hear me clearly?', icon: CHAR_ICONS.RN },
    { role: 'Interpreter', text: 'Yes! How about you?', icon: CHAR_ICONS.Interpreter },
    { role: 'RN', text: 'Yes! Before we begin, I\'d like to do a quick pre-brief. This is a post-op wound care teaching session for Ms. Chen.', icon: CHAR_ICONS.RN },
    { role: 'RN', text: 'I may use terms like drain output or incision site. If anything seems unclear, let me know.', icon: CHAR_ICONS.RN },
    { role: 'RN', text: 'She\'s anxious today and has low literacy. Please let me know if you sense misunderstanding or if cultural context might help.', icon: CHAR_ICONS.RN },
    { role: 'Interpreter', text: 'Understood.', icon: CHAR_ICONS.Interpreter },
    { role: 'RN', text: 'Great! Let\'s follow short, one-sentence turn-taking. Do you have any questions or suggestions for me from the cultural side?', icon: CHAR_ICONS.RN },
    { role: 'Interpreter', text: 'None for now. Ready when you are.', icon: CHAR_ICONS.Interpreter }
];

const scriptHotspots = [
    {
        text: 'post-op wound care teaching session',
        reveal: '<strong>Goal clarity reduces turn-taking errors.</strong> (Omoruyi et al.)'
    },
    {
        text: 'drain output or incision site',
        reveal: '<strong>Naming jargon helps interpreter</strong> decide how literally or conceptually to translate. (Latimer et al.)'
    },
    {
        text: 'anxious today and has low literacy',
        reveal: '<strong>Identifying patient literacy cues and mental state improves pacing.</strong> Flows faster when interpreter knows if patient panics.'
    }
];

function init() {
    renderStep();
    document.getElementById('nextBtn').addEventListener('click', nextStep);
}

function nextStep() {
    if (appState.currentStep < 4) {
        appState.currentStep++;
        renderStep();
    }
}

function renderStep() {
    const main = document.getElementById('mainContent');
    const indicator = document.getElementById('stepIndicator');
    const dots = indicator.querySelectorAll('.step-dot');

    // Update dots
    dots.forEach((dot, idx) => {
        dot.className = 'step-dot';
        if (idx === appState.currentStep) dot.classList.add('active');
        if (idx < appState.currentStep) dot.classList.add('completed');
    });

    main.innerHTML = '';

    switch (appState.currentStep) {
        case 0:
            renderDialogue(main);
            break;
        case 1:
            renderHotspots(main);
            break;
        case 2:
            renderTriangle(main);
            break;
        case 3:
            renderActivity(main);
            break;
        case 4:
            renderResults(main);
            break;
    }
}

function renderDialogue(container) {
    container.innerHTML = `
        <div class="subtitle">Step 1: Content Delivery (15 sec)</div>
        <div class="glass-card" style="text-align: center; padding: 1rem;">
            <video src="./assets/content_delivery.mp4" controls autoplay style="width: 100%; max-width: 800px; border-radius: var(--radius-lg); box-shadow: 0 10px 30px rgba(0,0,0,0.15); background: black;"></video>
            <p style="color: var(--text-muted); margin-top: 1rem; text-align: left;">Watch the online collaboration simulation video.</p>
        </div>
    `;
}

function renderHotspots(container) {
    container.innerHTML = `
        <div id="step2" style="position:relative; width:100%; height:100%;">
            <div class="vn-character-bg left"><img src="./assets/nurse_lg.png?v=3" alt="Nurse"></div>
            
            <div style="position:relative; z-index:10; text-align:center;">
                <div class="subtitle">Step 2: Analysis (1 min)</div>
                <h3>Why it matters</h3>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Click the highlighted regions in the transcript to reveal clinical insights right beside them.</p>
            </div>
            
            <div id="hotspotTranscript"></div>
            
            <div class="vn-character-bg right"><img src="./assets/interpreter_lg.png?v=3" alt="Interpreter"></div>
        </div>
    `;

    const transcriptDiv = document.getElementById('hotspotTranscript');

    // Build transcript with chat bubble layout
    let contentHtml = '<div class="chat-container">';

    dialogue.forEach(d => {
        let textLine = d.text;
        scriptHotspots.forEach((hot, index) => {
            textLine = textLine.replace(hot.text,
                `<span class="hotspot" data-index="${index}">${hot.text}</span>`);
        });

        const alignment = d.role === 'RN' ? 'left' : 'right';
        const avatarSrc = d.role === 'RN' ? './assets/nurse.png' : './assets/interpreter.png';

        contentHtml += `
            <div class="chat-message ${alignment}">
                <div class="chat-bubble">
                    ${textLine}
                </div>
            </div>
        `;
    });

    contentHtml += '</div>';

    transcriptDiv.innerHTML = contentHtml;

    // Add popup containers dynamically
    transcriptDiv.querySelectorAll('.hotspot').forEach(el => {
        const index = el.dataset.index;
        const revealContent = scriptHotspots[index].reveal;

        const popup = document.createElement('div');
        popup.className = 'popup-tooltip';
        popup.innerHTML = revealContent;
        el.appendChild(popup);

        el.addEventListener('click', (e) => {
            // Close all others
            document.querySelectorAll('.popup-tooltip').forEach(p => p.classList.remove('active'));
            // Toggle current
            popup.classList.add('active');

            // Adjust position
            popup.style.top = '100%';
            popup.style.left = '50%';
            popup.style.transform = 'translateX(-50%) translateY(10px)';

            e.stopPropagation();
        });
    });

    // Close popups when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.popup-tooltip').forEach(p => p.classList.remove('active'));
    });
}

function renderTriangle(container) {
    container.innerHTML = `
        <div class="subtitle">Step 3: Strategic Overview</div>
        <div class="glass-card">
            <h3>Communication Triangle</h3>
            <p style="color: var(--text-muted);">Hover over each role below to see critical information shared.</p>
            
            <div class="graphic-container">
                <svg class="triangle-svg" viewBox="0 0 300 260">
                    <path d="M150 20 L280 230 L20 230 Z" fill="none" stroke="var(--border-color)" stroke-width="2" />
                </svg>
                
                <div class="node-container rn-node" data-info="<strong>Nurse:</strong> goals, procedure, jargon">
                    <div class="node"><img src="./assets/nurse.png" class="char-img" alt="RN"></div>
                    <div class="node-text">RN</div>
                    <div class="popup-tooltip" style="top:50%; left:120%; transform:translateY(-50%);"></div>
                </div>
                
                <div class="node-container int-node" data-info="<strong>Interpreter:</strong> language, culture">
                    <div class="node"><img src="./assets/interpreter.png" class="char-img" alt="Interpreter"></div>
                    <div class="node-text">Interpreter</div>
                    <div class="popup-tooltip" style="bottom:120%; left:50%; transform:translateX(-50%);"></div>
                </div>
                
                <div class="node-container pat-node" data-info="<strong>Patient:</strong> literacy, mental state, health history">
                    <div class="node"><img src="./assets/patient.png" class="char-img" alt="Patient"></div>
                    <div class="node-text">Patient</div>
                    <div class="popup-tooltip" style="bottom:120%; left:50%; transform:translateX(-50%);"></div>
                </div>
            </div>

            <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <p><strong>Communication Protocol:</strong></p>
                <ul style="padding-left: 1.5rem; margin-top:0.5rem; color: var(--text-muted);">
                    <li>Short, one-sentence turn-taking</li>
                    <li>Always look at the patient <span style="display:inline-block; width:45px; height:45px; vertical-align:middle;"><img src="./assets/patient.png" class="char-img"></span></li>
                </ul>
            </div>
        </div>
    `;

    container.querySelectorAll('.node-container').forEach(nodeWrap => {
        const popup = nodeWrap.querySelector('.popup-tooltip');
        popup.innerHTML = nodeWrap.dataset.info;

        nodeWrap.addEventListener('mouseenter', () => popup.classList.add('active'));
        nodeWrap.addEventListener('mouseleave', () => popup.classList.remove('active'));
    });
}

function renderActivity(container) {
    container.innerHTML = `
        <div id="step4" style="position:relative; width:100%; height:100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 5vh;">
            <div style="position:relative; z-index:10; background: rgba(255,255,255,0.95); padding: 3rem 4rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid rgba(255,255,255,0.8); width: 650px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                <div style="color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 0.5px; margin-bottom: 1rem;">Step 4: Learner Activity (1 min)</div>
                <h3 style="font-size: 1.5rem; color: #1e293b; margin-bottom: 2rem;">Your 30-second Pre-Brief Challenge</h3>
                <p style="color: #475569; font-size: 1.1rem; margin-bottom: 0.5rem;">Record an audio message covering:</p>
                <p style="color: #6366f1; font-weight: 700; font-size: 1.1rem; margin-bottom: 2.5rem; line-height: 1.5;">goal, jargon to expect, patient risk, culture question, and turn-taking rule.</p>
                
                <div id="recordingStatus" style="margin-bottom: 1.5rem; color: #94a3b8; font-weight: 500;">Press record when ready</div>
                
                <textarea id="manualTranscript" style="display:none; width:100%; height:80px; margin-bottom: 1rem; border-radius: var(--radius-md); padding: 0.5rem; border: 1px solid var(--border-color); font-family: inherit;" placeholder="Your transcribed speech will appear here..."></textarea>
                
                <button class="btn" id="recordBtn" style="background:var(--danger); color:white; border:none; padding:1rem 2rem; display:inline-flex; align-items:center; gap:0.6rem; font-weight:bold; border-radius: 8px; font-size: 1.05rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"/></svg>
                    Record Audio
                </button>
                <button class="btn btn-primary" id="analyzeBtn" style="display:none; margin-left: 10px;">
                    Analyze Speech →
                </button>
            </div>
            
            <div class="winged-owl-bg" id="recordAvatar">
                <img src="./assets/nurse_winged_lg.png?v=3" alt="Giant Winged Nurse Owl">
            </div>
        </div>
    `;

    const recordBtn = document.getElementById('recordBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');

    recordBtn.addEventListener('click', () => {
        if (!appState.recording) {
            startRecording(recordBtn);
        } else {
            stopRecording(recordBtn, analyzeBtn);
        }
    });

    analyzeBtn.addEventListener('click', () => {
        analyzeBtn.innerHTML = 'Analyzing...';
        analyzeBtn.disabled = true;

        const manualText = document.getElementById('manualTranscript').value;
        const finalAudioText = manualText.trim() === '' ?
            "I didn't hear anything, please try again." :
            manualText;

        console.log("MANUAL SUBMIT TEXT:", finalAudioText);
        evaluateTranscription(finalAudioText);
        nextStep();
    });
}

let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let finalTranscriptChunk = '';
        let interimTranscriptChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscriptChunk += event.results[i][0].transcript;
            } else {
                interimTranscriptChunk += event.results[i][0].transcript;
            }
        }

        appState.transcript += finalTranscriptChunk;
        appState.interim = interimTranscriptChunk; // Store interim separately to not duplicate

        document.getElementById('recordingStatus').innerHTML =
            `🎙️ <span style="color: var(--text-color);">\${appState.transcript} <i style="color:var(--text-muted)">\${appState.interim}</i></span>`;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
            document.getElementById('recordingStatus').innerHTML = '<span style="color: var(--danger);">Microphone access denied. Please allow microphone access.</span>';
            stopRecording(document.getElementById('recordBtn'));
        }
    };
}

function startRecording(btn) {
    if (!recognition) {
        alert("Your browser does not support Speech Recognition. Please use Chrome.");
        return;
    }

    appState.recording = true;
    appState.transcript = '';
    appState.startTime = Date.now();

    appState.interim = '';

    btn.classList.add('recording');
    btn.innerHTML = 'Stop Recording';
    document.getElementById('recordingStatus').innerHTML = '<span style="color: var(--danger); font-weight:bold;">● Recording... Speak clearly.</span>';

    document.getElementById('recordAvatar').classList.add('recording-active');
    document.getElementById('manualTranscript').style.display = 'none';
    document.getElementById('analyzeBtn').style.display = 'none';

    try {
        recognition.start();
    } catch (e) {
        console.error(e);
    }
}

function stopRecording(btn, analyzeBtn) {
    appState.recording = false;
    btn.classList.remove('recording');
    btn.innerHTML = 'Re-Record Audio';
    btn.disabled = false;

    document.getElementById('recordAvatar').classList.remove('recording-active');

    if (recognition) {
        try {
            recognition.stop();
        } catch (e) { console.error(e); }
    }

    document.getElementById('recordingStatus').innerHTML = 'Please review your transcript below before analyzing. You can edit it if the AI misheard you!';

    // Append any lingering interim results to the final transcript
    if (appState.interim) {
        appState.transcript += ' ' + appState.interim;
    }

    const transcriptBox = document.getElementById('manualTranscript');
    transcriptBox.style.display = 'block';
    transcriptBox.value = appState.transcript;

    analyzeBtn.style.display = 'inline-block';
}

function evaluateTranscription(text) {
    const t = text.toLowerCase();
    appState.evaluation.goal = t.includes('goal') || t.includes('wound care') || t.includes('teach') || t.includes('purpose') || t.includes('plan') || t.includes('discuss');
    appState.evaluation.jargon = t.includes('jargon') || t.includes('incision') || t.includes('drain') || t.includes('term') || t.includes('word') || t.includes('medical');
    appState.evaluation.risk = t.includes('anxious') || t.includes('literacy') || t.includes('risk') || t.includes('nervous') || t.includes('scared') || t.includes('understand') || t.includes('read');
    appState.evaluation.culture = t.includes('culture') || t.includes('cultural') || t.includes('background') || t.includes('belief') || t.includes('custom') || t.includes('tradition');
    appState.evaluation.turntaking = t.includes('sentence') || t.includes('turn-taking') || t.includes('turn taking') || t.includes('one at a time') || t.includes('pause') || t.includes('short') || t.includes('pace') || t.includes('taking turns') || t.includes('take turns');

    appState.points = Object.values(appState.evaluation).filter(v => v).length;
}

function getBadgeDetails(points, e) {
    if (points === 5) return { title: "Pre-Briefing Owl", icon: "🦉🌟", feedback: "You clearly stated goals, risks, jargon, and expectations before starting. Your structure prevents confusion later in the encounter." };
    if (points === 0) return { title: "Swift Triage Sparrow", icon: "🐣", feedback: "You prepared efficiently before connecting to the interpreter. Your workflow awareness reduces delays without sacrificing safety." };

    if (e.culture && e.risk && e.jargon) return { title: "Insightful Heron", icon: "🦩🧠", feedback: "Your responses showed strong clinical reasoning and contextual awareness. You integrated literacy, risk, and patient condition thoughtfully." };
    if (e.turntaking && e.goal && e.risk) return { title: "Precision Falcon", icon: "🦅🎯", feedback: "You delivered concise, well-structured explanations with minimal overload. Your logical flow increased efficiency and safety." };
    if (e.goal && e.culture) return { title: "Continuity Crane", icon: "🦢🔁", feedback: "You connected opening, teaching, and closing with intention. Your communication fosters sustained trust beyond a single encounter." };
    if (e.jargon && e.goal) return { title: "Teach-Back Swan", icon: "🦢🔄", feedback: "You verified understanding instead of assuming it. Your confirmation habits strengthened safety and retention." };
    if (e.risk && e.goal) return { title: "Consent Dove", icon: "�️⚖️", feedback: "You demonstrated strong awareness in high-risk or legally sensitive conversations. Your structure supports ethical and compliant practice." };
    if (e.turntaking && e.jargon) return { title: "Documentation Duck", icon: "🦆📝", feedback: "You accurately distinguished between debrief and charting requirements. Your documentation protects both patient safety and legal integrity." };

    if (e.culture) return { title: "Cultural Canary", icon: "🐤🌍", feedback: "You actively invited cultural insight and showed openness to mediation. Your communication reflected respect beyond literal translation." };
    if (e.risk) return { title: "Listening Lark", icon: "🐦👂", feedback: "You noticed emotional cues or confusion signals and responded appropriately. Your attentiveness prevented silent misunderstandings." };
    if (e.jargon) return { title: "Plain-Language Chickadee", icon: "��️", feedback: "You transformed complex medical language into understandable terms. Your clarity directly improved patient comprehension." };
    if (e.turntaking) return { title: "Turn-Taking Tern", icon: "🕊️⏱️", feedback: "You maintained clean, intentional pacing during interpreted speech. Your rhythm reduced overload for both interpreter and patient." };
    if (e.goal) return { title: "Warm-Start Flamingo", icon: "🦩🤝", feedback: "You built trust from the first interaction moment. Your introduction reduced anxiety and increased patient engagement." };

    if (points >= 3) return { title: "Accuracy Albatross", icon: "🐦📊", feedback: "You demonstrated high scoring consistency across activities. Your performance reflects reliable knowledge integration." };
    return { title: "Steady Penguin", icon: "🐧🧊", feedback: "You maintained calm and clarity under pressure. Your composed presence stabilized complex interactions." };
}

function renderResults(container) {
    const badge = getBadgeDetails(appState.points, appState.evaluation);

    container.innerHTML = `
        <div class="subtitle">Step 5: AI Evaluation</div>
        
        <div class="badge-container">
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-title">${badge.title}</div>
            <div class="feedback-text">${badge.feedback}</div>
        </div>

        <div class="glass-card">
            <h3 style="text-align: center;">Scoring Breakdown: <span style="color: var(--success)">${appState.points}/5</span></h3>
            
            <ul class="criterion-list" style="margin-top: 1.5rem;">
                ${renderCriterion('Goal Stated (Purpose of interaction)', appState.evaluation.goal)}
                ${renderCriterion('Jargon Flagged (Specific medical terms expected)', appState.evaluation.jargon)}
                ${renderCriterion('Risk Identified (Mental state, health literacy)', appState.evaluation.risk)}
                ${renderCriterion('Culture Question (Inviting interpreter insights)', appState.evaluation.culture)}
                ${renderCriterion('Turn-taking Established (Setting pace rules)', appState.evaluation.turntaking)}
            </ul>
        </div>
    `;

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.innerHTML = 'Restart Module ↻';
    nextBtn.onclick = () => {
        appState.currentStep = 0;
        appState.points = 0;
        for (let key in appState.evaluation) appState.evaluation[key] = false;
        init();
        document.getElementById('nextBtn').innerHTML = 'Continue →';
        document.getElementById('nextBtn').onclick = nextStep;
    };
}

function renderCriterion(label, met) {
    return `
        <li class="criterion-item">
            <div class="status-icon ${met ? 'met' : 'unmet'}"></div>
            <div style="flex: 1; font-weight: 500;">${label}</div>
            <div style="color: ${met ? 'var(--success)' : 'var(--danger)'}; font-weight:bold;">
                ${met ? 'Met' : 'Missed'}
            </div>
        </li>
    `;
}

init();
