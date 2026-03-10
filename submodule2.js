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
    },
    section3Active: false, // Flag for Section 3
    dragErrors: 0 // Track errors in Section 3 activity
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
    document.getElementById('nextBtn').onclick = nextStep;
    // Notes initialization and DOM click handlers have been moved globally to shared.js
    // so they can persist dynamically on index.html and submodule1.html without duplicate code.
}


function nextStep() {
    if (appState.currentStep < 7) {
        appState.currentStep++;

        // Trigger Pre-briefing Notes unlock at Step 3 (Learner Activity phase)
        if (appState.currentStep === 3) {
            localStorage.setItem('module3_note_sec2_step3', 'true');

            let notesData = localStorage.getItem('module3_notesUnlocked');
            let unlocked = notesData ? JSON.parse(notesData) : [];
            if (!unlocked.includes('blue')) {
                unlocked.push('blue');
                localStorage.setItem('module3_notesUnlocked', JSON.stringify(unlocked));
            }

            if (typeof syncNotesState === 'function') syncNotesState();
            if (typeof triggerNotesUpdateAnimation === 'function') triggerNotesUpdateAnimation('note-sec2-step3');
        }

        // Trigger AI Evaluation Note unlock cross-over at Step 4
        if (appState.currentStep === 4) {
            localStorage.setItem('module3_note_ai_sec2', 'true');
            if (typeof syncNotesState === 'function') syncNotesState();
            if (typeof triggerNotesUpdateAnimation === 'function') triggerNotesUpdateAnimation('note-ai-sec2');
        }

        // Unlock Module 3 on Hub when finishing Submodule 2 (End of Section 3, Step 7)
        if (appState.currentStep === 7) {
            let curr = parseInt(localStorage.getItem('module3_unlockLevel') || '1');
            if (curr < 3) localStorage.setItem('module3_unlockLevel', '3');
        }

        // When crossing into Section 3 (Step 4)
        if (appState.currentStep >= 4) {
            appState.section3Active = true;
        }

        renderStep();
    }
}

function renderStep() {
    const main = document.getElementById('mainContent');
    const indicator = document.getElementById('stepIndicator');
    const dots = indicator.querySelectorAll('.step-dot');
    const headerTitle = document.getElementById('sectionTitle');

    if (appState.section3Active && headerTitle) {
        headerTitle.innerText = "Section 3: Pre-Briefing with the Patient";
    }

    // Update dots (0-3 for sec2, 4-7 for sec3)
    let relativeStep = appState.currentStep;
    if (appState.currentStep >= 4) {
        relativeStep = appState.currentStep - 4;
    }

    dots.forEach((dot, idx) => {
        dot.className = 'step-dot';
        if (idx === relativeStep) dot.classList.add('active');
        if (idx < relativeStep) dot.classList.add('completed');
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
        case 4:
            renderSection3Start(main);
            break;
        case 5:
            renderSection3PoorVideo(main);
            break;
        case 6:
            renderSection3DragActivity(main);
            const patNotes = document.getElementById('sec3PatientNotes');
            if (patNotes) {
                // Permanently memorize this section is unlocked globally
                localStorage.setItem('module3_patient_notes_unlocked', 'true');

                patNotes.style.display = 'block';
                setTimeout(() => {
                    patNotes.style.opacity = '1';

                    // Recalculate height for textareas previously crushed by display: none
                    const textareas = patNotes.querySelectorAll('.inline-user-note');
                    textareas.forEach(t => {
                        if (t.value) {
                            t.style.height = 'auto';
                            t.style.height = (t.scrollHeight) + 'px';
                        }
                    });

                    // Crucial: Re-bind localStorage events to the freshly revealed textareas
                    if (typeof setupInlineNotes === 'function') {
                        setupInlineNotes();
                    }
                }, 50);
            }
            // Automatically open Notes Panel to draw attention
            if (typeof syncNotesState === 'function') syncNotesState();
            if (typeof triggerNotesUpdateAnimation === 'function') triggerNotesUpdateAnimation('sec3PatientNotes');
            break;
        case 7:
            renderSection3Results(main);
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

                        <h4 style="margin-bottom: 1rem; font-size: 1.15rem; border-bottom: 2px solid #dbeafe; padding-bottom: 0.6rem;">Pre-briefing with interpreters</h4>
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
        <div id="step4" style="position:relative; width:100%; height:100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 15vh;">
            
            <!-- Top Interpreter Bird (Matching the reference screenshot) -->
            <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 15; width: calc(100vw - 320px); display: flex; justify-content: center; pointer-events: none;">
                <img src="./assets/interpreter_down.png" alt="Interpreter Bird Looking Down" style="width: auto; max-width: 100%; height: 25vh; object-fit: contain; filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));">
            </div>

            <div style="position:relative; z-index:10; background: rgba(255,255,255,0.95); padding: 3rem 4rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid rgba(255,255,255,0.8); width: 650px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); margin-top: -2vh;">
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
    if (points === 5) {
        return {
            title: "Pre-Briefing Owl",
            icon: '<img src="./assets/2. Pre-Briefing Owl.png" style="width:260px; height:260px; object-fit:contain;">',
            feedback: "Excellent work explicitly covering all critical pre-brief elements! Your thorough preparation will prevent confusion and ensure a seamless encounter."
        };
    }

    // First figure out what to suggest doing better based on missed points
    let suggestion = "Next time, try to remember to address all 5 key elements of the pre-briefing.";
    if (!e.goal) suggestion = "Next time, make sure to explicitly state the goal of the interaction.";
    else if (!e.jargon) suggestion = "Next time, remember to flag any expected medical jargon to clarify the translation.";
    else if (!e.risk) suggestion = "Next time, try to identify patient risks like mental state or health literacy.";
    else if (!e.culture) suggestion = "Next time, don't forget to invite the interpreter's cultural insights.";
    else if (!e.turntaking) suggestion = "Next time, remember to establish clear turn-taking rules upfront.";

    if (e.turntaking) {
        return {
            title: "Turn-Taking Tern",
            icon: '<img src="./assets/3. Turn-Taking Tern.png" style="width:260px; height:260px; object-fit:contain;">',
            feedback: "You maintained clean, intentional pacing which reduces overload during interpreted speech. " + suggestion
        };
    }

    if (e.jargon) {
        return {
            title: "Plain-Language Chickadee",
            icon: '<img src="./assets/4. Plain-Language Chickadee.png" style="width:260px; height:260px; object-fit:contain;">',
            feedback: "You did a great job identifying complex medical language to improve patient comprehension. " + suggestion
        };
    }

    if (e.goal || e.risk || e.culture) {
        return {
            title: "Teach-Back Swan",
            icon: '<img src="./assets/5. Teach-Back Swan.png" style="width:260px; height:260px; object-fit:contain;">',
            feedback: "Your intentional confirmation habits strengthen the overall safety and retention of the encounter. " + suggestion
        };
    }

    // Default (0 points or none of the specific ones above matched)
    return {
        title: "Swift Triage Sparrow",
        icon: '<img src="./assets/1. Swift Triage Sparrow.png" style="width:260px; height:260px; object-fit:contain;">',
        feedback: "You connected quickly and efficiently to start the interaction. For a more comprehensive pre-brief, try covering goals, jargon, risks, culture, and turn-taking rules."
    };
}

function renderResults(container) {
    const badge = getBadgeDetails(appState.points, appState.evaluation);
    const feedbackEl = document.getElementById('notesFeedback');
    if (feedbackEl) {
        feedbackEl.innerText = `"${badge.feedback}"`;
    }

    // Highlight the AI suggestion when unlocking
    if (typeof syncNotesState === 'function') syncNotesState();
    if (typeof triggerNotesUpdateAnimation === 'function') triggerNotesUpdateAnimation('note-ai-sec2');

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
    nextBtn.innerHTML = 'Continue to Section 3 →';
    nextBtn.onclick = () => {
        appState.currentStep = 4;
        appState.section3Active = true;
        init(); // re-init event listeners, renderStep
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

function renderSection3Start(container) {
    container.innerHTML = `
        <div class="subtitle">Step 1: Content Delivery (15 sec)</div>
        <div class="glass-card" style="text-align: center; padding: 1rem;">
            <video src="./assets/video 3.mp4" controls autoplay style="width: 100%; max-width: 800px; border-radius: var(--radius-lg); box-shadow: 0 10px 30px rgba(0,0,0,0.15); background: black;"></video>
            <p style="color: var(--text-muted); margin-top: 1rem; text-align: left;">Observe how effectively the RN pre-briefs the patient on what to expect during the interpreted encounter.</p>
        </div>
    `;

    document.getElementById('nextBtn').onclick = nextStep;
    document.getElementById('nextBtn').innerHTML = 'Continue <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
}

function renderSection3PoorVideo(container) {
    container.innerHTML = `
        <div class="subtitle">Step 2: Analysis (1 min)</div>
        <div class="glass-card" style="text-align: center; padding: 1rem;">
            <h3 style="color: var(--danger); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                Poor Pre-briefing Example
            </h3>
            <video src="./assets/video 4.mp4" controls autoplay style="width: 100%; max-width: 800px; border-radius: var(--radius-lg); box-shadow: 0 10px 30px rgba(0,0,0,0.15); background: black;"></video>
            <p style="color: var(--text-muted); margin-top: 1rem; text-align: left;">Notice the confusion and lack of structure when the patient isn't properly prepared for the interpreter's role. Contrast this with the good example from the previous step.</p>
        </div>
    `;

    document.getElementById('nextBtn').onclick = nextStep;
    document.getElementById('nextBtn').innerHTML = 'Continue <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
}

function renderSection3DragActivity(container) {
    container.innerHTML = `
        <div class="subtitle">Step 3: Learner Activity</div>
        <div style="position: relative; margin-top: 5rem;">
            <!-- Patient image overlapping the top edge -->
            <img src="./assets/patient_down.png" alt="Patient character" style="position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 300px; z-index: 10; pointer-events: none;">
            
            <div class="glass-card" style="padding: 3.5rem 3rem 2.5rem 3rem; position: relative; z-index: 5;">
                <h3 style="color: var(--text-main); margin-bottom: 0.5rem; text-align: center; font-size: 1.6rem;">Drag-and-drop Challenge</h3>
            <p style="text-align: center; color: var(--text-muted); margin-bottom: 2.5rem; font-size: 1.1rem;">
                Place each statement into the correct category: <strong>Good Opening</strong> or <strong>Incorrect Opening</strong>.
            </p>

            <!-- Items to drag -->
            <div id="dragItems" style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-bottom: 3rem; min-height: 80px;">
                <div class="draggable-item" draggable="true" data-type="good" id="item1">"Hello, this is your interpreter Ana."</div>
                <div class="draggable-item" draggable="true" data-type="bad" id="item2">"Tell her we need vitals."</div>
                <div class="draggable-item" draggable="true" data-type="good" id="item3">"Do you hear clearly?"</div>
                <div class="draggable-item" draggable="true" data-type="bad" id="item4">"Interpreter, ask her about pain."</div>
            </div>
            
            <!-- Drop zones -->
            <div style="display: flex; gap: 2rem; justify-content: center;">
                <div class="drop-zone" id="goodDropZone" data-accept="good" style="flex: 1; border: 2px dashed var(--success); border-radius: 8px; padding: 1.5rem; min-height: 200px; background: rgba(101, 163, 13, 0.05); display: flex; flex-direction: column; align-items: center;">
                    <h4 style="color: var(--success); text-align: center; margin-bottom: 1rem; width: 100%; border-bottom: 1px solid rgba(101, 163, 13, 0.2); padding-bottom: 0.5rem;">Good Opening</h4>
                    <div class="drop-content" style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem; min-height: 100px;"></div>
                </div>
                <div class="drop-zone" id="badDropZone" data-accept="bad" style="flex: 1; border: 2px dashed var(--danger); border-radius: 8px; padding: 1.5rem; min-height: 200px; background: rgba(239, 68, 68, 0.05); display: flex; flex-direction: column; align-items: center;">
                    <h4 style="color: var(--danger); text-align: center; margin-bottom: 1rem; width: 100%; border-bottom: 1px solid rgba(239, 68, 68, 0.2); padding-bottom: 0.5rem;">Incorrect Opening</h4>
                    <div class="drop-content" style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem; min-height: 100px;"></div>
                </div>
            </div>

            <div id="dragFeedback" style="text-align: center; margin-top: 2rem; min-height: 24px; font-weight: bold; position: relative; z-index: 20;"></div>
            </div>
            
            <!-- Nurse image overlapping the bottom edge -->
            <img src="./assets/nurse_back.png" alt="Nurse character" style="position: absolute; bottom: -180px; left: 50%; transform: translateX(-50%); width: 450px; z-index: 10; pointer-events: none;">
        </div>
    `;

    // -----------------------------------------
    // Set up Drag and Drop Logistics
    // -----------------------------------------
    const draggables = container.querySelectorAll('.draggable-item');
    const dropZones = container.querySelectorAll('.drop-zone');
    const dragFeedback = container.querySelector('#dragFeedback');
    let draggedItem = null;
    let placedCount = 0;
    const totalItems = draggables.length;

    draggables.forEach(item => {
        item.addEventListener('dragstart', function (e) {
            draggedItem = this;
            setTimeout(() => this.classList.add('dragging'), 0);
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', function () {
            draggedItem = null;
            this.classList.remove('dragging');
            dropZones.forEach(z => z.classList.remove('drag-over'));
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function (e) {
            e.preventDefault(); // Necessary to allow dropping
            this.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
            return false;
        });

        zone.addEventListener('dragenter', function (e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', function () {
            this.classList.remove('drag-over');
        });

        zone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            if (draggedItem) {
                const requiredType = this.getAttribute('data-accept');
                const itemType = draggedItem.getAttribute('data-type');

                if (requiredType === itemType) {
                    // Success dropping
                    this.querySelector('.drop-content').appendChild(draggedItem);
                    draggedItem.setAttribute('draggable', 'false'); // Lock it in
                    draggedItem.style.cursor = 'default';
                    placedCount++;

                    dragFeedback.style.color = 'var(--success)';
                    dragFeedback.innerText = "Correct match!";

                    if (placedCount === totalItems) {
                        dragFeedback.innerHTML = "<span style='font-size: 1.2rem;'>🎉 Excellent work! All statements categorized correctly.</span>";
                        document.getElementById('nextBtn').style.display = 'inline-flex';
                    } else {
                        setTimeout(() => { if (dragFeedback.innerText === "Correct match!") dragFeedback.innerText = ""; }, 1500);
                    }
                } else {
                    // Failed dropping
                    appState.dragErrors++;
                    dragFeedback.style.color = 'var(--danger)';
                    dragFeedback.innerText = "Oops! Try thinking about third-person language and clarity.";

                    // Shake animation for error
                    draggedItem.style.transform = 'translateX(10px)';
                    setTimeout(() => draggedItem.style.transform = 'translateX(-10px)', 100);
                    setTimeout(() => draggedItem.style.transform = 'translateX(10px)', 200);
                    setTimeout(() => draggedItem.style.transform = 'translateX(0)', 300);

                    setTimeout(() => { if (dragFeedback.innerText.includes("Oops")) dragFeedback.innerText = ""; }, 2500);
                }
            }
        });
    });

    // Make the next button hidden until they finish the activity
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'none';
    nextBtn.onclick = () => {
        nextBtn.style.display = 'inline-flex'; // reset for next steps
        nextStep();
    };
    nextBtn.innerHTML = 'Continue to Evaluation <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
}

// We map renderSection3NotesUpdate as an automatic side-effect to simply revealing the Patient notes 
// without needing a dedicated step for them, as they happen "between" poor video and this activity.
// Actually, earlier we made step 6 renderSection3NotesUpdate. Let's redirect notes revealing safely.

function renderSection3Results(container) {
    let title = "";
    let icon = "";
    let feedbackIntro = "";
    let suggestion = "";
    let scoreText = "";
    const errors = appState.dragErrors;

    if (errors === 0) {
        title = "Pre-Briefing Owl";
        icon = '<img src="./assets/2. Pre-Briefing Owl.png" style="width:260px; height:260px; object-fit:contain;">';
        feedbackIntro = "Flawless categorization! You correctly identified all the proper ways to address the patient during pre-briefing.";
        suggestion = "Your understanding of third-person language and setting ground rules is excellent. You are fully prepared to run a high-quality interpreted encounter.";
        scoreText = '<span style="color: var(--success)">Perfect (0 Errors)</span>';
    } else if (errors <= 2) {
        title = "Turn-Taking Tern";
        icon = '<img src="./assets/3. Turn-Taking Tern.png" style="width:260px; height:260px; object-fit:contain;">';
        feedbackIntro = "Good effort, but you had a few missteps when matching the correct opening statements.";
        suggestion = "Pay closer attention to speaking directly to the patient rather than giving commands to the interpreter. Review the pre-briefing notes to solidify this habit.";
        scoreText = `<span style="color: var(--warning)">${errors} Errors</span>`;
    } else {
        title = "Swift Triage Sparrow";
        icon = '<img src="./assets/1. Swift Triage Sparrow.png" style="width:260px; height:260px; object-fit:contain;">';
        feedbackIntro = "You completed the activity, but frequent errors show a need to review the basics.";
        suggestion = "Remember to always speak directly to the patient in the first person. Take some time to review the interpretation method and turn-taking rules in your notes.";
        scoreText = `<span style="color: var(--danger)">${errors} Errors</span>`;
    }

    // Unlocking the Suggestion globally in the Notes Panel
    localStorage.setItem('module3_sec3_suggestion_unlocked', 'true');
    localStorage.setItem('module3_sec3_suggestion', suggestion);
    // Synchronize to reveal suggestion and trigger target glow
    if (typeof syncNotesState === 'function') syncNotesState();
    if (typeof triggerNotesUpdateAnimation === 'function') triggerNotesUpdateAnimation('sec3PatientNotesSuggestion');

    container.innerHTML = `
        <div class="subtitle">Step 4: AI Evaluation</div>
        
        <div class="badge-container">
            <div class="badge-icon">${icon}</div>
            <div class="badge-title">${title}</div>
            <div class="feedback-text">${feedbackIntro} <br><br> ${suggestion}</div>
        </div>

        <div class="glass-card">
            <h3 style="text-align: center;">Activity Performance: ${scoreText}</h3>
        </div>
        
        <div style="text-align: center; margin-top: 3rem;">
            <p style="color: var(--success); font-weight: bold; margin-bottom: 1rem;">Module 3 Completed!</p>
            <button class="btn" onclick="window.location.href='index.html'" style="background: var(--success);">
                Return to Hub
            </button>
        </div>
    `;
}

init();
