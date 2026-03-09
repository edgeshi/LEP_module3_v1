const appState = {
    currentStep: 0,
    section1Active: false,
    q1Correct: null,
    q2Correct: null
};

function init() {
    renderStep();
    document.getElementById('nextBtn').onclick = nextStep;
}

function nextStep() {
    // 5 steps total: 4 for section 0 (Step 0, 1, 2, 3), 2 for section 1 (Step 4, 5)
    // 0: Section 0 Page 1 (Video)
    // 1: Section 0 Page 2 (Triangle)
    // 2: Section 0 Page 3 (Learner Activity)
    // 3: Section 0 Page 4 (Evaluation)
    // 4: Section 1 Page 1 (Planning Overview)
    // 5: Section 1 Page 2 (Conclusion)
    if (appState.currentStep < 5) {
        appState.currentStep++;

        if (appState.currentStep >= 4) {
            appState.section1Active = true;
        }

        renderStep();
    }
}

function renderStep() {
    const main = document.getElementById('mainContent');
    const indicator = document.getElementById('stepIndicator');
    const headerTitle = document.getElementById('sectionTitle');

    // Section 0 has 4 steps, Section 1 has 2 steps
    const numDots = appState.section1Active ? 2 : 4;
    indicator.innerHTML = '';
    for (let i = 0; i < numDots; i++) {
        let dot = document.createElement('div');
        dot.className = 'step-dot';
        indicator.appendChild(dot);
    }
    const dots = indicator.querySelectorAll('.step-dot');

    if (appState.section1Active && headerTitle) {
        headerTitle.innerText = "Section 1: Planning the Session";
        document.title = "Section 1: Planning the Session | Module 3";
    }

    let relativeStep = appState.section1Active ? appState.currentStep - 4 : appState.currentStep;

    dots.forEach((dot, idx) => {
        dot.className = 'step-dot';
        if (idx === relativeStep) dot.classList.add('active');
        if (idx < relativeStep) dot.classList.add('completed');
    });

    main.innerHTML = '';

    switch (appState.currentStep) {
        case 0:
            renderSection0Page1(main);
            break;
        case 1:
            renderSection0Page2(main);
            break;
        case 2:
            renderSection0Page3(main);
            break;
        case 3:
            renderSection0Page4(main);
            break;
        case 4:
            renderSection1Page1(main);
            break;
        case 5:
            renderSection1Page2(main);
            break;
    }
}

function renderSection0Page1(container) {
    container.innerHTML = `
        <div class="subtitle">Step 1: Content Delivery (15 sec)</div>
        <div class="glass-card" style="text-align: center; padding: 1rem;">
            <!-- Note: the prompt asks for video1.mp4 -->
            <video src="./assets/video 1.mp4" controls autoplay style="width: 100%; max-width: 800px; border-radius: var(--radius-lg); box-shadow: 0 10px 30px rgba(0,0,0,0.15); background: black;"></video>
            <p style="color: var(--text-muted); margin-top: 1rem; text-align: left;">Watch the video to observe turn-taking speech directly talking to the patient with the interpreter.</p>
        </div>
    `;

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'inline-flex';
    nextBtn.onclick = nextStep;
    nextBtn.innerHTML = 'Continue <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
}

function renderSection0Page2(container) {
    container.innerHTML = `
        <div class="subtitle">Step 2: Analysis</div>
        <div class="glass-card" style="text-align: center; padding: 3rem;">
            <h3 style="color: var(--primary-color); margin-top: 0; margin-bottom: 1.5rem;">The Communication Triangle</h3>
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem;">Click on each role to explore its purpose in a clinical interaction.</p>
            
            <div class="graphic-container"
                style="position: relative; width: 300px; height: 260px; min-height: 260px; padding: 20px 0; margin-top: 10px; display: block; overflow: visible; margin: 0 auto;">
                <svg class="triangle-svg" viewBox="0 0 300 260"
                    style="position: absolute; top: 0; left: 0; transform: none; width: 100%; height: 100%; z-index: 1;">
                    <path d="M150 20 L255 230 L45 230 Z" fill="none" stroke="#16a34a" stroke-width="3"
                        stroke-dasharray="6,4" />
                </svg>

                <div class="node-container rn-node"
                    style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); z-index: 2; text-align: center;">
                    <div class="node"
                        style="width: 50px; height: 50px; background: white; border-radius: 50%; border: 2px solid #16a34a; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; margin: 0 auto;">
                        <img src="./assets/nurse.png" style="width: 100%; height: 100%; object-fit: cover;"
                            alt="RN">
                    </div>
                    <div class="node-text"
                        style="font-size: 0.85rem; margin-top: 6px; font-weight: 700; color: #16a34a;">RN</div>
                </div>

                <div class="node-container int-node"
                    style="position: absolute; bottom: 0; right: 8px; z-index: 2; text-align: center;">
                    <div class="node"
                        style="width: 50px; height: 50px; background: white; border-radius: 50%; border: 2px solid #16a34a; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; margin: 0 auto;">
                        <img src="./assets/interpreter.png"
                            style="width: 100%; height: 100%; object-fit: cover;" alt="Interpreter">
                    </div>
                    <div class="node-text"
                        style="font-size: 0.85rem; margin-top: 6px; font-weight: 700; color: #16a34a;">
                        Interpreter</div>
                </div>

                <div class="node-container pat-node"
                    style="position: absolute; bottom: 0; left: 8px; z-index: 2; text-align: center;">
                    <div class="node"
                        style="width: 50px; height: 50px; background: white; border-radius: 50%; border: 2px solid #16a34a; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; margin: 0 auto;">
                        <img src="./assets/patient.png" style="width: 100%; height: 100%; object-fit: cover;"
                            alt="Patient">
                    </div>
                    <div class="node-text"
                        style="font-size: 0.85rem; margin-top: 6px; font-weight: 700; color: #16a34a;">Patient
                    </div>
                </div>
            </div>
        </div>
    `;

    if (typeof setupNodeTooltips === 'function') {
        setupNodeTooltips();
    }

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'inline-flex';
    nextBtn.innerHTML = 'Continue to Learner Activity &rarr;';
    nextBtn.onclick = () => {
        nextStep();
        const nextBtnUpdated = document.getElementById('nextBtn');
        nextBtnUpdated.innerHTML = 'Continue to Section 1 &rarr;';
        nextBtnUpdated.style.display = 'none'; // hide until they finish the activity
        nextBtnUpdated.onclick = nextStep;
    };
}

function renderSection0Page3(container) {
    container.innerHTML = `
        <div class="subtitle">Step 3: Learner Activity</div>
        <div class="glass-card" style="padding: 3rem;">
            <h3 style="color: var(--primary-color); margin-top: 0; margin-bottom: 2rem; text-align: center;">Knowledge Check</h3>
            
            <div style="margin-bottom: 3rem;">
                <p style="font-size: 1.1rem; color: #1e293b; font-weight: 600; margin-bottom: 1rem;">1. During an interpreted encounter, who should you face when speaking?</p>
                
                <div class="mcq-options" id="q1-options" style="display: flex; flex-direction: column; gap: 0.8rem;">
                    <label class="mcq-option" style="padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; display: flex; align-items: flex-start; gap: 1rem; transition: background 0.2s;">
                        <input type="radio" name="q1" value="A" style="margin-top: 5px;">
                        <span><strong>A. Interpreter</strong></span>
                    </label>
                    <label class="mcq-option" style="padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; display: flex; align-items: flex-start; gap: 1rem; transition: background 0.2s;">
                        <input type="radio" name="q1" value="B" style="margin-top: 5px;">
                        <span><strong>B. Patient</strong></span>
                    </label>
                    <label class="mcq-option" style="padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; display: flex; align-items: flex-start; gap: 1rem; transition: background 0.2s;">
                        <input type="radio" name="q1" value="C" style="margin-top: 5px;">
                        <span><strong>C. Both equally</strong></span>
                    </label>
                </div>
                
                <div id="q1-feedback" style="margin-top: 1rem; padding: 1rem; border-radius: 8px; display: none; font-size: 0.95rem; line-height: 1.5;"></div>
            </div>

            <div style="margin-bottom: 2rem;">
                <p style="font-size: 1.1rem; color: #1e293b; font-weight: 600; margin-bottom: 1rem;">2. During an interpreted encounter, how should you collaborate with the interpreter?</p>
                
                <div class="mcq-options" id="q2-options" style="display: flex; flex-direction: column; gap: 0.8rem;">
                    <label class="mcq-option" style="padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; display: flex; align-items: flex-start; gap: 1rem; transition: background 0.2s;">
                        <input type="radio" name="q2" value="A" style="margin-top: 5px;">
                        <span><strong>A. Talking in turn</strong></span>
                    </label>
                    <label class="mcq-option" style="padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; display: flex; align-items: flex-start; gap: 1rem; transition: background 0.2s;">
                        <input type="radio" name="q2" value="B" style="margin-top: 5px;">
                        <span><strong>B. Talking word-by-word</strong></span>
                    </label>
                    <label class="mcq-option" style="padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; display: flex; align-items: flex-start; gap: 1rem; transition: background 0.2s;">
                        <input type="radio" name="q2" value="C" style="margin-top: 5px;">
                        <span><strong>C. Asking for interpretation when you feel necessary</strong></span>
                    </label>
                </div>
                
                <div id="q2-feedback" style="margin-top: 1rem; padding: 1rem; border-radius: 8px; display: none; font-size: 0.95rem; line-height: 1.5;"></div>
            </div>
        </div>
    `;

    let q1Answered = false;
    let q2Answered = false;

    const checkCompletion = () => {
        if (q1Answered && q2Answered) {
            const nextBtn = document.getElementById('nextBtn');
            nextBtn.style.display = 'inline-flex';
        }
    };

    // Q1 Logic
    const q1Options = container.querySelectorAll('input[name="q1"]');
    const q1Feedback = container.querySelector('#q1-feedback');
    q1Options.forEach(radio => {
        radio.addEventListener('change', (e) => {
            q1Answered = true;
            // Disable all inputs
            q1Options.forEach(r => r.disabled = true);

            // Highlight answers visually safely
            const val = e.target.value;
            let explanation = '';

            if (val === 'B') {
                appState.q1Correct = true;
                q1Feedback.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                q1Feedback.style.border = '1px solid var(--success)';
                explanation = '<strong style="color: var(--success); font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Correct!</strong>';
            } else {
                appState.q1Correct = false;
                q1Feedback.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                q1Feedback.style.border = '1px solid var(--danger)';
                explanation = '<strong style="color: var(--danger); font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Incorrect.</strong>';
            }

            explanation += `
                <div style="margin-bottom: 0.8rem;">
                    <strong>A. Interpreter:</strong> Facing the interpreter breaks the triadic model and makes the patient feel excluded or "talked about." (Sharko et al., 2022)
                </div>
                <div style="margin-bottom: 0.8rem;">
                    <strong>B. Patient <span style="color: var(--success)">(Correct)</span>:</strong> Direct address improves comprehension, especially during safety-critical tasks (Taira et al., 2021)
                </div>
                <div>
                    <strong>C. Both equally:</strong> Looking back and forth disrupts the natural flow and increases cognitive load for the patient, especially LEP older adults (Hsueh et al., 2018)
                </div>
            `;

            q1Feedback.innerHTML = explanation;
            q1Feedback.style.display = 'block';
            checkCompletion();
        });
    });

    // Q2 Logic
    const q2Options = container.querySelectorAll('input[name="q2"]');
    const q2Feedback = container.querySelector('#q2-feedback');
    q2Options.forEach(radio => {
        radio.addEventListener('change', (e) => {
            q2Answered = true;
            // Disable all inputs
            q2Options.forEach(r => r.disabled = true);

            const val = e.target.value;
            let explanation = '';

            if (val === 'A') {
                appState.q2Correct = true;
                q2Feedback.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                q2Feedback.style.border = '1px solid var(--success)';
                explanation = '<strong style="color: var(--success); font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Correct!</strong>';
            } else {
                appState.q2Correct = false;
                q2Feedback.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                q2Feedback.style.border = '1px solid var(--danger)';
                explanation = '<strong style="color: var(--danger); font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Incorrect.</strong>';
            }

            explanation += `
                <div style="margin-bottom: 0.8rem;">
                    <strong>A. Talking in turn <span style="color: var(--success)">(Correct)</span>:</strong> Turn-taking prevents overlapping speech, reduces interpreter errors, and supports accurate relay of complex information. (Origlia Ikhilor et al., 2019)
                </div>
                <div style="margin-bottom: 0.8rem;">
                    <strong>B. Talking word-by-word:</strong> Interpreters interpret meaning, not individual words. (Sharko et al., 2022)
                </div>
                <div>
                    <strong>C. Asking for interpretation when you feel necessary:</strong> Selective or inconsistent use of the interpreter leads to missing critical details. (Interview: ED RN #1, 2024-10-18)
                </div>
            `;

            q2Feedback.innerHTML = explanation;
            q2Feedback.style.display = 'block';
            checkCompletion();
        });
    });
}

function getBadgeDetailsSec0() {
    // 2 questions total
    let score = 0;
    if (appState.q1Correct === true) score++;
    if (appState.q2Correct === true) score++;

    if (score === 2) {
        return {
            title: "Pre-Briefing Owl",
            icon: '<img src="./assets/2. Pre-Briefing Owl.png" style="width:260px; height:260px; object-fit:contain;">',
            feedback: "Flawless knowledge check! You successfully identified correct communication patterns with the patient and interpreter.",
            scoreText: '<span style="color: var(--success)">Perfect (2/2)</span>',
            suggestion: "Keep remembering to directly address the patient and utilize proper turn-taking to prevent overlapping speech."
        };
    } else if (score === 1) {
        return {
            title: "Turn-Taking Tern",
            icon: '<img src="./assets/3. Turn-Taking Tern.png" style="width:260px; height:260px; object-fit:contain;">',
            feedback: "Good effort, but you missed a concept in the knowledge check.",
            scoreText: '<span style="color: var(--warning)">Passing (1/2)</span>',
            suggestion: "Make sure you understand the nuances of the triadic model. Review the explanations regarding direct address and turn-taking."
        };
    } else {
        return {
            title: "Swift Triage Sparrow",
            icon: '<img src="./assets/1. Swift Triage Sparrow.png" style="width:260px; height:260px; object-fit:contain;">',
            feedback: "You completed the activity, but missed the core concepts regarding the triadic model.",
            scoreText: '<span style="color: var(--danger)">Needs Review (0/2)</span>',
            suggestion: "Remember to always speak directly to the patient and take clear, distinct turns to allow the interpreter to process meaning accurately."
        };
    }
}

function renderSection0Page4(container) {
    const badge = getBadgeDetailsSec0();

    // We can populate Notes panel if needed, but for now just show evaluation
    container.innerHTML = `
        <div class="subtitle">Step 4: AI Evaluation</div>
        
        <div class="test-results slide-up" style="margin-top: 2rem;">
            <h2 style="color: #1e3a8a; text-align: center; margin-bottom: 2rem;">Section 0 Complete</h2>
            
            <div class="badge-container" style="display: flex; flex-direction: column; align-items: center; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 2px solid #e2e8f0; margin-bottom: 2rem;">
                <div class="badge-icon" style="margin-bottom: 1rem;">
                    ${badge.icon}
                </div>
                <div class="badge-title" style="font-size: 1.5rem; font-weight: bold; color: #1e3a8a; margin-bottom: 1rem; text-align: center;">
                    ${badge.title}
                </div>
                <div class="score-display" style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">
                    Score: ${badge.scoreText}
                </div>
                <div class="feedback-text" style="color: #475569; text-align: center; max-width: 600px; line-height: 1.6;">
                    ${badge.feedback}
                </div>
            </div>

            <div class="ai-suggestion" style="background: linear-gradient(to right, rgba(30, 58, 138, 0.05), rgba(30, 58, 138, 0.1)); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #1e3a8a; margin-bottom: 2rem;">
                <h4 style="color: #1e3a8a; margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    AI Suggestion
                </h4>
                <p style="color: #334155; margin: 0; line-height: 1.5;">${badge.suggestion}</p>
            </div>
        </div>
    `;

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'inline-flex';
    nextBtn.innerHTML = 'Continue to Section 1 Planning &rarr;';
    nextBtn.onclick = () => {
        nextStep();
        const nextBtnUpdated = document.getElementById('nextBtn');
        nextBtnUpdated.innerHTML = 'Continue <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
        nextBtnUpdated.onclick = nextStep;
    };
}

function renderSection1Page1(container) {
    container.innerHTML = `
        <div class="subtitle">Step 1: Content Delivery</div>
        <div class="glass-card" style="padding: 3rem;">
            <p style="font-size: 1.15rem; color: #1e3a8a; font-weight: 500; margin-bottom: 1rem; border-left: 4px solid var(--primary-color); padding-left: 1rem; background: rgba(30, 58, 138, 0.05); padding-top: 0.5rem; padding-bottom: 0.5rem; border-radius: 4px;">
                Feeling overwhelmed? No worries, you don't have to remember these all the time, just add them to the Notes and follow them at certain actions!
            </p>
            
            <div style="text-align: left; margin-bottom: 2.5rem;">
                <button id="addToNotesBtn" style="background: var(--primary-color); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; border: none; font-size: 1rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    Add to Notes
                </button>
            </div>
            
            <h3 style="color: var(--primary-color); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.4rem;">Downloadable checklist</h3>

            <div class="accordion" style="display: flex; flex-direction: column; gap: 1rem;">
                
                <!-- Item 1 -->
                <div class="accordion-item" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <button class="accordion-header" style="width: 100%; text-align: left; padding: 1.2rem; background: #f8fafc; border: none; font-size: 1.1rem; font-weight: 600; color: #0f172a; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;">
                        <span>1. Get consent and collect information from the patient to use an interpreter</span>
                        <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: white;">
                        <div style="padding: 1.2rem; border-top: 1px solid #e2e8f0;">
                            <ul style="margin: 0; padding-left: 1.5rem; color: #475569; line-height: 1.6;">
                                <li style="margin-bottom: 0.8rem;">
                                    <strong>Confirm language & dialect</strong>
                                    <ul style="margin-top: 0.4rem; padding-left: 1.5rem;">
                                        <li>Use <span style="border-bottom: 2px solid #fca5a5; padding-bottom: 1px;">verified</span> language assessment or patient self-identification.
                                            <ul style="margin-top: 0.2rem; padding-left: 1.5rem; color: #64748b;">
                                                <li>e.g. nurses often misidentify Mandarin vs. Cantonese (interview transcript).</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Confirm interpreter modality</strong> (please refer to Module 2 for choosing the appropriate modality)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Item 2 -->
                <div class="accordion-item" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <button class="accordion-header" style="width: 100%; text-align: left; padding: 1.2rem; background: #f8fafc; border: none; font-size: 1.1rem; font-weight: 600; color: #0f172a; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;">
                        <span>2. Book an appointment with interpreters (please refer to specific guidelines at your institution)</span>
                        <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: white;">
                        <div style="padding: 1.2rem; border-top: 1px solid #e2e8f0; color: #475569; line-height: 1.6;">
                            Follow your hospital's specific protocols for scheduling either an in-person, telephonic, or video remote interpreter depending on the modality selected in Step 1.
                        </div>
                    </div>
                </div>

                <!-- Item 3 -->
                <div class="accordion-item" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <button class="accordion-header" style="width: 100%; text-align: left; padding: 1.2rem; background: #f8fafc; border: none; font-size: 1.1rem; font-weight: 600; color: #0f172a; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;">
                        <span>3. Prepare visuals/materials (please refer to Module 5 for specific content)</span>
                        <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: white;">
                        <div style="padding: 1.2rem; border-top: 1px solid #e2e8f0;">
                            <ul style="margin: 0; padding-left: 1.5rem; color: #475569; line-height: 1.6;">
                                <li style="margin-bottom: 0.4rem;">Translated discharge sheets</li>
                                <li style="margin-bottom: 0.4rem;">Diagrams, picture cards</li>
                                <li>Pain scale</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Item 4 -->
                <div class="accordion-item" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <button class="accordion-header" style="width: 100%; text-align: left; padding: 1.2rem; background: #f8fafc; border: none; font-size: 1.1rem; font-weight: 600; color: #0f172a; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;">
                        <span>4. Set up interpreter modality (please refer to Module 4 for technical problems)</span>
                        <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: white;">
                        <div style="padding: 1.2rem; border-top: 1px solid #e2e8f0; color: #475569; line-height: 1.6;">
                            Ensure all equipment (phones, tablets, or video carts) is fully charged, connected to the network, and positioned correctly before bringing the patient into the room.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    // Add to Notes Button Logic
    const addToNotesBtn = container.querySelector('#addToNotesBtn');
    if (addToNotesBtn) {
        // Check initial state
        let notesData = localStorage.getItem('module3_notesUnlocked');
        let unlocked = notesData ? JSON.parse(notesData) : [];
        if (unlocked.includes('green')) {
            addToNotesBtn.innerHTML = '✓ Added to Notes';
            addToNotesBtn.style.background = 'var(--success)';
            addToNotesBtn.disabled = true;
            addToNotesBtn.style.cursor = 'default';
        }

        addToNotesBtn.addEventListener('click', () => {
            let currentData = localStorage.getItem('module3_notesUnlocked');
            let currentUnlocked = currentData ? JSON.parse(currentData) : [];
            if (!currentUnlocked.includes('green')) {
                currentUnlocked.push('green');
                localStorage.setItem('module3_notesUnlocked', JSON.stringify(currentUnlocked));
            }

            addToNotesBtn.innerHTML = '✓ Added to Notes';
            addToNotesBtn.style.background = 'var(--success)';
            addToNotesBtn.disabled = true;
            addToNotesBtn.style.cursor = 'default';

            if (typeof syncNotesState === 'function') syncNotesState();
            if (typeof triggerNotesUpdateAnimation === 'function') triggerNotesUpdateAnimation();
        });
    }

    // Accordion Logic
    const headers = container.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const chevron = header.querySelector('.chevron');

            // Close all others
            container.querySelectorAll('.accordion-content').forEach(c => {
                if (c !== content) {
                    c.style.maxHeight = null;
                    c.previousElementSibling.querySelector('.chevron').style.transform = 'rotate(0deg)';
                    c.previousElementSibling.style.background = '#f8fafc';
                }
            });

            // Toggle current
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                chevron.style.transform = 'rotate(0deg)';
                header.style.background = '#f8fafc';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                chevron.style.transform = 'rotate(180deg)';
                header.style.background = '#e2e8f0';
            }
        });
    });

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'inline-flex';
    nextBtn.innerHTML = 'Continue <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
    nextBtn.onclick = nextStep;
}

function renderSection1Page2(container) {
    container.innerHTML = `
        <div class="subtitle">Step 2: Conclusion</div>
        <div class="glass-card" style="text-align: center; padding: 3rem;">
            <h3 style="color: var(--success); margin-top: 0;">🎉 Section 1 Completed!</h3>
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem;">
                You have finished Section 1. To move to new learning elements properly, the Green Content will be added to your Notes Panel globally.
            </p>
            <button id="completeBtn" class="btn" style="background: var(--success); color: white; padding: 1rem 2rem; font-size: 1.1rem;">
                Complete & Unlock Progress
            </button>
            <div id="completionBanner" style="display: none; margin-top: 2rem;">
                <p style="color: var(--success); font-weight: bold; margin-bottom: 1rem;">Progress Unlocked!</p>
                <button class="btn" onclick="window.location.href='index.html'" style="background: var(--primary-color);">
                    Return to Hub
                </button>
            </div>
        </div>
    `;

    document.getElementById('nextBtn').style.display = 'none';

    document.getElementById('completeBtn').addEventListener('click', function () {
        // Unlock Hub Progress Level 2 (Submodule 2 unlocked)
        let curr = parseInt(localStorage.getItem('module3_unlockLevel') || '1');
        if (curr < 2) localStorage.setItem('module3_unlockLevel', '2');

        // Unlock Green Content globally in the Notes Hub array
        let notesData = localStorage.getItem('module3_notesUnlocked');
        let unlocked = notesData ? JSON.parse(notesData) : [];
        if (!unlocked.includes('green')) {
            unlocked.push('green');
            localStorage.setItem('module3_notesUnlocked', JSON.stringify(unlocked));
        }

        // Visually fire the green sidebar instantly, show completion
        if (typeof syncNotesState === 'function') syncNotesState();
        if (typeof triggerNotesUpdateAnimation === 'function') triggerNotesUpdateAnimation();

        this.style.display = 'none';
        document.getElementById('completionBanner').style.display = 'block';
    });
}

// Start app
init();
