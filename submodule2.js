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
    // Notes initialization and DOM click handlers have been moved globally to shared.js
    // so they can persist dynamically on index.html and submodule1.html without duplicate code.
}


function nextStep() {
    if (appState.currentStep < 3) {
        appState.currentStep++;

        // Trigger generic Blue Notes unlock at Step 2 (Analysis phase)
        if (appState.currentStep === 2) {
            let notesData = localStorage.getItem('module3_notesUnlocked');
            let unlocked = notesData ? JSON.parse(notesData) : [];
            if (!unlocked.includes('blue')) {
                unlocked.push('blue');
                localStorage.setItem('module3_notesUnlocked', JSON.stringify(unlocked));

                // Immediately show the new Blue widget in the sidebar and animate it open
                if (typeof syncNotesState === 'function') syncNotesState();
                if (typeof triggerNotesUpdateAnimation === 'function') triggerNotesUpdateAnimation();
            }
        }

        // Unlock Module 3 on Hub when finishing Submodule 2
        if (appState.currentStep === 3) {
            let curr = parseInt(localStorage.getItem('module3_unlockLevel') || '1');
            if (curr < 3) localStorage.setItem('module3_unlockLevel', '3');
        }

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
            renderActivity(main);
            break;
        case 3:
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
        <div id="step2" style="position:relative; width:100%; min-height: 65vh; padding-bottom: 2rem;">
            
            <div style="position:relative; z-index:10; text-align:center;">
                <div class="subtitle">Step 2: Analysis (1 min)</div>
                <h3>Why it matters</h3>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Click the highlighted regions in the transcript to reveal clinical insights right beside them.</p>
            </div>
            
            <div class="step2-flex">
                <!-- Left Sticky Character -->
                <div class="vn-character-bg left"><img src="./assets/nurse_lg.png?v=3" alt="Nurse"></div>
                
                <!-- Center Scrolling Transcript -->
                <div id="hotspotTranscript"></div>
                
                <!-- Right Sticky Character -->
                <div class="vn-character-bg right"><img src="./assets/interpreter_lg.png?v=3" alt="Interpreter"></div>
            </div>
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
        
        <div class="notes-feature-container" style="position: relative; width: 100%; height: 65vh; background: #f8fafc; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-color); display: flex; align-items: stretch;">
            
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; text-align: center;">
                <div style="max-width: 500px;">
                    <h3 style="color: #334155; margin-bottom: 1rem; font-size: 1.8rem;">Strategic Overview</h3>
                    <p style="color: #64748b; font-size: 1.1rem; line-height: 1.6;">
                        This module uses a persistent <strong>Notes</strong> feature taped to the right side of your screen. 
                        As you encounter new knowledge, we add it to your notes.
                    </p>
                    <div style="margin-top: 2rem; padding: 1.5rem; background: #fff; border-radius: 8px; border: 2px dashed #cbd5e1; color: #94a3b8;">
                        Main content learning area... <br><br>
                        <em style="color: var(--accent-color);">💡 Try clicking the Notes section on the right to see your strategic overview!</em>
                    </div>
                </div>
            </div>

            <!-- Notes Panel -->
            <div id="notesPanel" class="notes-panel collapsed" style="position: relative; width: 280px; background: white; border-left: 2px dashed #cbd5e1; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; cursor: pointer; box-shadow: -4px 0 15px rgba(0,0,0,0.05);">
                
                <!-- Fake details like it's taped (optional but fun vibe factor) -->
                <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-2deg); width: 80px; height: 30px; background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 1px 3px rgba(0,0,0,0.1); z-index: 10; font-size: 0; pointer-events: none;">tape</div>

                <div style="padding: 1.2rem; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-weight: bold; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; cursor: pointer;">
                    <span style="font-family: inherit; font-size: 1.1rem; color: #0f172a; white-space: nowrap;">📝 Module 3 Notes</span>
                    <span id="notesToggleIcon" style="font-size: 0.8em; color: #64748b; font-weight: 600; white-space: nowrap;">◀ Click to Expand</span>
                </div>

                <div style="display: flex; flex: 1; overflow: hidden; padding: 1.5rem; gap: 1.5rem; overflow-x: visible;">
                    
                    <!-- Green Content (Always Visible) -->
                    <div class="green-content" style="flex: 0 0 240px; display: flex; flex-direction: column; align-items: center; overflow-y: auto; overflow-x: visible; padding-right: 10px;">
                        <div style="background: rgba(34, 197, 94, 0.1); color: #15803d; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1.5rem; border: 1px solid rgba(34, 197, 94, 0.3);">
                            Always Bear in Mind
                        </div>
                        <h4 style="color: #16a34a; margin-bottom: 2rem; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #16a34a; padding-bottom: 0.2rem;">Communication Triangle</h4>
                        
                        <div class="graphic-container" style="position: relative; width: 100%; height: 260px; min-height: 260px; padding: 20px 0; margin-top: 10px; display: block; overflow: visible;">
                            <svg class="triangle-svg" viewBox="0 0 300 260" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
                                <path d="M150 20 L255 230 L45 230 Z" fill="none" stroke="#16a34a" stroke-width="3" stroke-dasharray="6,4" />
                            </svg>
                            
                            <div class="node-container rn-node" style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); z-index: 2; text-align: center;">
                                <div class="node" style="width: 50px; height: 50px; background: white; border-radius: 50%; border: 2px solid #16a34a; display: flex; align-items: center; justify-content: center; overflow: hidden;"><img src="./assets/nurse.png" style="width: 100%; height: 100%; object-fit: cover;" alt="RN"></div>
                                <div class="node-text" style="font-size: 0.85rem; margin-top: 6px; font-weight: 700; color: #16a34a;">RN</div>
                            </div>
                            
                            <div class="node-container int-node" style="position: absolute; bottom: 0; right: 8px; z-index: 2; text-align: center;">
                                <div class="node" style="width: 50px; height: 50px; background: white; border-radius: 50%; border: 2px solid #16a34a; display: flex; align-items: center; justify-content: center; overflow: hidden;"><img src="./assets/interpreter.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Interpreter"></div>
                                <div class="node-text" style="font-size: 0.85rem; margin-top: 6px; font-weight: 700; color: #16a34a;">Interpreter</div>
                            </div>
                            
                            <div class="node-container pat-node" style="position: absolute; bottom: 0; left: 8px; z-index: 2; text-align: center;">
                                <div class="node" style="width: 50px; height: 50px; background: white; border-radius: 50%; border: 2px solid #16a34a; display: flex; align-items: center; justify-content: center; overflow: hidden;"><img src="./assets/patient.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Patient"></div>
                                <div class="node-text" style="font-size: 0.85rem; margin-top: 6px; font-weight: 700; color: #16a34a;">Patient</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 1.5rem; width: 100%; text-align: left;">
                        <h5 style="color: #16a34a; margin-bottom: 0.5rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px dotted #16a34a; padding-bottom: 0.2rem;">Interpreting Methods</h5>
                        <ul style="padding-left: 1.2rem; font-size: 0.85rem; line-height: 1.4; color: #166534; margin-top: 0.5rem;">
                            <li style="margin-bottom: 0.3rem;">Turn-taking with the interpreter</li>
                            <li>Looking at the patient</li>
                        </ul>
                    </div>
                    
                    <!-- Blue Content (Hidden when collapsed) -->
                    <div class="blue-content" style="flex: 1; opacity: 0; transition: opacity 0.3s; color: #1e3a8a; display: flex; flex-direction: column; justify-content: flex-start; border-left: 1px solid #dbeafe; padding-left: 1.5rem; min-width: 320px; overflow-y: auto; padding-right: 10px;">
                        
                        <div style="align-self: flex-start; background: rgba(30, 58, 138, 0.1); color: #1e40af; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1.5rem; border: 1px solid rgba(30, 58, 138, 0.3);">
                            Only Follow at Actions
                        </div>

                        <h4 style="margin-bottom: 1rem; font-size: 1.15rem; border-bottom: 2px solid #dbeafe; padding-bottom: 0.6rem;">Pre-briefing</h4>
                        <p style="font-size: 1rem; line-height: 1.5; font-weight: 500; margin-bottom: 1rem; color: #1e3a8a;">
                            A successful pre-briefing with interpreters should cover:
                        </p>
                        <ul style="margin-top: 0; padding-left: 1.4rem; font-size: 0.95rem; line-height: 1.6; font-weight: 500; color: #1e3a8a;">
                            <li style="margin-bottom: 0.5rem;"><strong>Goal:</strong> The primary purpose of the interaction.</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Jargon info:</strong> Expected medical terms to clarify.</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Patient risk:</strong> Mental state and health literacy.</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Culture question:</strong> Inviting interpreter insights on culture.</li>
                            <li><strong>Turn-taking rule:</strong> Short, one-sentence pacing.</li>
                        </ul>

                        <div style="margin-top: 1.5rem; background: #eff6ff; padding: 1.2rem; border-radius: 8px; border: 1px solid #bfdbfe; position: relative;">
                            <span style="position: absolute; top: -10px; left: 15px; background: #eff6ff; padding: 0 8px; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #1e3a8a; border: 1px solid #bfdbfe; border-radius: 10px;">AI Personalized Feedback</span>
                            <p style="font-size: 0.95rem; color: #172554; margin: 0; font-style: italic;">
                                "Excellent identification of key terms! Keep in mind to also establish explicit turn-taking rules upfront to ensure a smooth flow."
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    const notesPanel = container.querySelector('#notesPanel');
    const toggleIcon = container.querySelector('#notesToggleIcon');
    const orangeContent = container.querySelector('.orange-content');

    notesPanel.addEventListener('click', () => {
        const isCollapsed = notesPanel.classList.contains('collapsed');
        if (isCollapsed) {
            notesPanel.classList.remove('collapsed');
            notesPanel.style.width = '680px';
            toggleIcon.innerText = '▶ Click to Collapse';
            setTimeout(() => {
                orangeContent.style.opacity = '1';
                orangeContent.style.pointerEvents = 'auto';
            }, 200); // Wait for the transition
        } else {
            notesPanel.classList.add('collapsed');
            notesPanel.style.width = '280px';
            toggleIcon.innerText = '◀ Click to Expand';
            orangeContent.style.opacity = '0';
            orangeContent.style.pointerEvents = 'none';
        }
    });
}

function renderActivity(container) {
    container.innerHTML = `
        <div id="step4" style="position:relative; width:100%; height:100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 5vh;">
            <div style="position:relative; z-index:10; background: rgba(255,255,255,0.95); padding: 3rem 4rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid rgba(255,255,255,0.8); width: 650px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                <div style="color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 0.5px; margin-bottom: 1rem;">Step 3: Learner Activity (1 min)</div>
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
    const feedbackEl = document.getElementById('notesFeedback');
    if (feedbackEl) {
        feedbackEl.innerText = `"${badge.feedback}"`;
    }

    container.innerHTML = `
        <div class="subtitle">Step 4: AI Evaluation</div>
        
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
