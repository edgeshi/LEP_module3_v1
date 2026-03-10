const appState = {
    currentStep: 0,
    section5Active: false,
    quizSelection: {
        dp1: null,
        dp2: null
    }
};

function init() {
    renderStep();
    document.getElementById('nextBtn').onclick = nextStep;
}

function nextStep() {
    // 0-3 for Sec 4, 4-7 for Sec 5
    if (appState.currentStep < 7) {
        appState.currentStep++;

        // At step 4, transition to section 5
        if (appState.currentStep >= 4) {
            appState.section5Active = true;
        }

        // When finishing Submodule 3 (End of Section 5, Step 7)
        if (appState.currentStep === 7) {
            let curr = parseInt(localStorage.getItem('module3_unlockLevel') || '1');
            if (curr < 4) localStorage.setItem('module3_unlockLevel', '4');
        }

        renderStep();
    }
}

function renderStep() {
    const main = document.getElementById('mainContent');
    const indicator = document.getElementById('stepIndicator');
    const dots = indicator.querySelectorAll('.step-dot');
    const headerTitle = document.getElementById('sectionTitle');

    if (appState.section5Active && headerTitle) {
        headerTitle.innerText = "Section 5: Talking While Responding to the Interpreters and Patients";
    } else if (headerTitle) {
        headerTitle.innerText = "Section 4: Talking about the Specific Content";
    }

    // Update dots (0-3 for sec4, 4-7 for sec5)
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

    // Smooth scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (appState.currentStep) {
        case 0:
            renderSection4ContentDelivery(main);
            break;
        case 1:
            renderPlaceholder(main, "Step 2: Analysis", "Analyze the components of the interaction.", "1 min");
            break;
        case 2:
            renderPlaceholder(main, "Step 3: Learner Activity", "Practice identifying and using plain language.", "2 min");
            break;
        case 3:
            renderSection4End(main);
            break;
        case 4:
            renderPlaceholder(main, "Step 1: Content Delivery", "Observation of complex triadic interactions.", "1 min");
            break;
        case 5:
            renderPlaceholder(main, "Step 2: Analysis", "Identify how to manage interpreter/patient dynamics.", "2 min");
            break;
        case 6:
            renderPlaceholder(main, "Step 3: Learner Activity", "Interactive scenario management challenge.", "3 min");
            break;
        case 7:
            renderSection5End(main);
            break;
    }
}

function renderSection4ContentDelivery(container) {
    container.innerHTML = `
        <div class="subtitle">Step 1: Content Delivery</div>
        
        <div class="glass-card" style="padding: 2.5rem; border-radius: var(--radius-lg); margin-top: 1.5rem; position: relative;">
            
            <!-- Characters -->
            <img src="./assets/patient.png" alt="Patient" style="position: absolute; top: -112px; left: 100px; width: 225px; z-index: 10;">
            <img src="./assets/interpreter.png" alt="Interpreter" style="position: absolute; top: -165px; right: 120px; width: 210px; z-index: 10;">
            <img src="./assets/nurse_back.png" alt="Nurse Back" style="position: absolute; top: 0px; left: -130px; width: 330px; z-index: 10;">
            
            <p style="font-size: 1.15rem; color: #475569; margin-bottom: 2rem; font-weight: 500; padding-top: 2rem;">
                You are caring for Mr. Huang after IV antibiotic teaching. The interpreter is connected via video.
            </p>
            <h3 style="color: #1e3a8a; margin-bottom: 2rem; border-bottom: 2px solid #dbeafe; padding-bottom: 0.8rem;">
                <span style="color: var(--danger); margin-right: 0.5rem;">&#x25CF;</span> "To communicate effectively: "
            </h3>
            
            <!-- Decision Point 1 -->
            <div style="margin-bottom: 3rem;">
                <h4 style="font-size: 1.15rem; color: #334155; margin-bottom: 1.2rem;">
                    Decision Point 1 (<span style="color: var(--danger);">Short vs. Long Sentences</span>)
                </h4>
                
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-left: 1.5rem;">
                    <div class="quiz-option" id="dp1-optA" style="padding: 1rem 1.5rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: white;">
                        <span style="font-weight: 600; margin-right: 0.5rem;">A.</span> "So because you have a resistant infection we need to administer this medication very slowly over the next hour because if we push it too fast you might feel faint or dizziness or chills and..."
                    </div>
                    
                    <div id="dp1-feedbackA" style="display: none; padding: 1rem 1.5rem; background: #fef2f2; border-left: 4px solid var(--danger); color: #991b1b; margin-left: 2rem; border-radius: 4px; font-weight: 500;">
                        Long sentences overload both interpreter and patient (Origlia Ikhilor).
                    </div>

                    <div class="quiz-option" id="dp1-optB" style="padding: 1rem 1.5rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: white;">
                        <span style="font-weight: 600; margin-right: 0.5rem;">B.</span> "This medicine must go in slowly. It will take one hour."
                    </div>
                    
                    <div id="dp1-feedbackB" style="display: none; padding: 1rem 1.5rem; background: #f0fdf4; border-left: 4px solid var(--success); color: #166534; margin-left: 2rem; border-radius: 4px; font-weight: 600;">
                        Correct! Short statements give the interpreter bite-sized pieces to translate accurately.
                    </div>
                </div>
            </div>

            <!-- Decision Point 2 -->
            <div>
                <h4 style="font-size: 1.15rem; color: #334155; margin-bottom: 1.2rem;">
                    Decision Point 2 (<span style="color: var(--danger);">Plain Language vs. Jargon</span>)
                </h4>
                
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-left: 1.5rem;">
                    <div class="quiz-option" id="dp2-optA" style="padding: 1rem 1.5rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: white;">
                        <span style="font-weight: 600; margin-right: 0.5rem;">A.</span> "Your nephrotoxicity risk is elevated."
                    </div>
                    
                    <div id="dp2-feedbackA" style="display: none; padding: 1rem 1.5rem; background: #fef2f2; border-left: 4px solid var(--danger); color: #991b1b; margin-left: 2rem; border-radius: 4px; font-weight: 500;">
                        Avoiding unnecessary jargon will make the patient better understand what they should do. (Lee et al.; Hsueh et al.)
                    </div>

                    <div class="quiz-option" id="dp2-optB" style="padding: 1rem 1.5rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: white;">
                        <span style="font-weight: 600; margin-right: 0.5rem;">B.</span> "This medicine can affect your kidneys. We will check your blood."
                    </div>
                    
                    <div id="dp2-feedbackB" style="display: none; padding: 1rem 1.5rem; background: #f0fdf4; border-left: 4px solid var(--success); color: #166534; margin-left: 2rem; border-radius: 4px; font-weight: 600;">
                        Correct! Plain language empowers the patient and ensures the translation stays culturally and contextually accurate.
                    </div>
                </div>
            </div>
            
        </div>
    `;

    // Add interactivity logic for DP1
    const dp1A = container.querySelector('#dp1-optA');
    const dp1B = container.querySelector('#dp1-optB');
    const fb1A = container.querySelector('#dp1-feedbackA');
    const fb1B = container.querySelector('#dp1-feedbackB');

    dp1A.addEventListener('click', () => {
        dp1A.style.borderColor = 'var(--danger)';
        dp1A.style.backgroundColor = '#fef2f2';
        dp1B.style.borderColor = '#e2e8f0';
        dp1B.style.backgroundColor = 'white';
        fb1A.style.display = 'block';
        fb1B.style.display = 'none';
        appState.quizSelection.dp1 = 'A';
    });

    dp1B.addEventListener('click', () => {
        dp1B.style.borderColor = 'var(--success)';
        dp1B.style.backgroundColor = '#f0fdf4';
        dp1A.style.borderColor = '#e2e8f0';
        dp1A.style.backgroundColor = 'white';
        fb1B.style.display = 'block';
        fb1A.style.display = 'none';
        appState.quizSelection.dp1 = 'B';
    });

    // Add interactivity logic for DP2
    const dp2A = container.querySelector('#dp2-optA');
    const dp2B = container.querySelector('#dp2-optB');
    const fb2A = container.querySelector('#dp2-feedbackA');
    const fb2B = container.querySelector('#dp2-feedbackB');

    dp2A.addEventListener('click', () => {
        dp2A.style.borderColor = 'var(--danger)';
        dp2A.style.backgroundColor = '#fef2f2';
        dp2B.style.borderColor = '#e2e8f0';
        dp2B.style.backgroundColor = 'white';
        fb2A.style.display = 'block';
        fb2B.style.display = 'none';
        appState.quizSelection.dp2 = 'A';
    });

    dp2B.addEventListener('click', () => {
        dp2B.style.borderColor = 'var(--success)';
        dp2B.style.backgroundColor = '#f0fdf4';
        dp2A.style.borderColor = '#e2e8f0';
        dp2A.style.backgroundColor = 'white';
        fb2B.style.display = 'block';
        fb2A.style.display = 'none';
        appState.quizSelection.dp2 = 'B';
    });

    // Setup hover effects
    [dp1A, dp1B, dp2A, dp2B].forEach(el => {
        el.addEventListener('mouseenter', function () {
            if (this.style.backgroundColor === '' || this.style.backgroundColor === 'white') {
                this.style.borderColor = 'var(--primary-color)';
                this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }
        });
        el.addEventListener('mouseleave', function () {
            if (this.style.backgroundColor === '' || this.style.backgroundColor === 'white') {
                this.style.borderColor = '#e2e8f0';
                this.style.boxShadow = 'none';
            }
        });
    });
}

function renderPlaceholder(container, stepTitle, placeholderText, time) {
    container.innerHTML = `
        <div class="subtitle">${stepTitle} ${time ? '(' + time + ')' : ''}</div>
        <div class="glass-card" style="text-align: center; padding: 4rem 2rem; margin-top: 2rem;">
            <div style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;">&#9874;</div>
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Under Construction</h3>
            <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 500px; margin: 0 auto;">
                ${placeholderText}<br><br>
                <em>This placeholder establishes the flow structure. Real content will be injected here in later milestones.</em>
            </p>
        </div>
    `;
}

function renderSection4End(container) {
    container.innerHTML = `
        <div class="subtitle">Step 4: AI Evaluation</div>
        <div class="glass-card" style="padding: 3rem; text-align: center; margin-top: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">&#127942;</div>
            <h2 style="color: var(--success); margin-bottom: 1rem;">Section 4 Complete!</h2>
            <p style="font-size: 1.1rem; color: #475569; max-width: 600px; margin: 0 auto;">
                You've successfully analyzed the core principles of content delivery, specifically regarding plain language and sentence structure length.
            </p>
        </div>
    `;

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.innerHTML = 'Continue to Section 5 &rarr;';
    nextBtn.onclick = () => {
        appState.currentStep = 4;
        appState.section5Active = true;
        init();
        document.getElementById('nextBtn').innerHTML = 'Continue &rarr;';
        document.getElementById('nextBtn').onclick = nextStep;
    };
}

function renderSection5End(container) {
    container.innerHTML = `
        <div class="subtitle">Step 4: Submodule 3 Complete</div>
        <div class="completion-banner" style="display: block;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">&#11088;</div>
            <h2 style="color: var(--success); margin-bottom: 1rem;">Submodule 3 Unlocked</h2>
            <p style="font-size: 1.1rem; color: #166534; font-weight: 500; margin-bottom: 2rem;">
                You've completed Section 4 & 5. You can now access Submodule 4 from the main hub.
            </p>
            <a href="index.html" class="btn btn-primary" style="text-decoration: none; display: inline-block;">Return to Hub</a>
        </div>
    `;

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'none';
}

// Ensure the page initializes when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
