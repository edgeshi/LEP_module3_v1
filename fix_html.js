const fs = require('fs');

const files = [
    'index.html',
    'submodule1.html',
    'submodule2.html',
    'submodule3.html',
    'submodule4.html'
];

const injectContent = `
                    <div id="note-sec1-step1" style="display: none; margin-bottom: 1.5rem; opacity: 0; transition: opacity 0.5s ease-in;">
                        <h4 style="color: #1e3a8a; margin-bottom: 1rem; font-size: 1.15rem; border-bottom: 2px solid #dbeafe; padding-bottom: 0.6rem;">
                            Planning a Session
                        </h4>
                        <div class="hover-note-line" style="margin-bottom: 0.2rem;">
                            <p style="color: #1e3a8a; font-size: 1rem; line-height: 1.5; font-weight: 500; margin: 0;">
                                A successful planning of an interpreted session should cover:
                            </p>
                            <button class="add-note-btn" title="Add note">+</button>
                            <textarea class="inline-user-note hidden" id="userNotePlan-1" placeholder="Add personal note..."></textarea>
                        </div>

                        <ul style="margin-top: 0.5rem; padding-left: 1.4rem; font-size: 0.95rem; line-height: 1.6; font-weight: 500; color: #1e3a8a;">
                            <li class="hover-note-line" style="margin-bottom: 0.4rem;">
                                <span><strong>Session Context:</strong> Reason for the visit and medical history.</span>
                                <button class="add-note-btn" title="Add note">+</button>
                                <textarea class="inline-user-note hidden" id="userNotePlan-2" placeholder="Add personal note..."></textarea>
                            </li>
                            <li class="hover-note-line" style="margin-bottom: 0.4rem;">
                                <span><strong>Logistics:</strong> Modality (in-person, video, phone) and room setup.</span>
                                <button class="add-note-btn" title="Add note">+</button>
                                <textarea class="inline-user-note hidden" id="userNotePlan-3" placeholder="Add personal note..."></textarea>
                            </li>
                            <li class="hover-note-line" style="margin-bottom: 0.4rem;">
                                <span><strong>Roles & Expectations:</strong> Clarifying how the encounter will be patterned.</span>
                                <button class="add-note-btn" title="Add note">+</button>
                                <textarea class="inline-user-note hidden" id="userNotePlan-4" placeholder="Add personal note..."></textarea>
                            </li>
                        </ul>
                    </div>

                    <div id="note-sec2-step3" style="display: none; opacity: 0; transition: opacity 0.5s ease-in;">
`;

for (let file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // 1. In submodule files 1-4, the "Pre-briefing</h4>" got accidentally deleted and left the <h4> unclosed.
    // The broken code looks like:
    // <h4 style="... border-bottom: 2px solid #dbeafe; padding-bottom: 0.6rem;">
    //     <div class="hover-note-line" ...>
    if (content.includes('border-bottom: 2px solid #dbeafe; padding-bottom: 0.6rem;">\n                        <div class="hover-note-line" style="margin-bottom: 0.2rem;">')) {
        content = content.replace(
            'border-bottom: 2px solid #dbeafe; padding-bottom: 0.6rem;">\n                        <div class="hover-note-line" style="margin-bottom: 0.2rem;">',
            'border-bottom: 2px solid #dbeafe; padding-bottom: 0.6rem;">\n                            Pre-briefing</h4>\n                        <div class="hover-note-line" style="margin-bottom: 0.2rem;">'
        );
    }

    // 2. Now wrap the Pre-briefing section in its own div #note-sec2-step3
    // We want to insert the Planning a Session div #note-sec1-step1 right before Pre-briefing
    // AND wrap the existing Pre-briefing under #note-sec2-step3 so it can be unlocked dynamically.

    // Let's find the start of Pre-briefing:
    const preBriefStart = `                    <h4\n                        style="color: #1e3a8a; margin-bottom: 1rem; font-size: 1.15rem; border-bottom: 2px solid #dbeafe; padding-bottom: 0.6rem;">\n                        Pre-briefing</h4>`;
    const preBriefStart2 = `                    <h4\n                            style="color: #1e3a8a; margin-bottom: 1rem; font-size: 1.15rem; border-bottom: 2px solid #dbeafe; padding-bottom: 0.6rem;">\n                            Pre-briefing</h4>`;

    // We also need to close the note-sec2-step3 div just before the AI feedback or sec3PatientNotes.
    // Looking at the code:
    // </ul>
    // <div style="margin-top: 1.5rem; background: #eff6ff; ... AI Personalized Feedback ...
    const preBriefEndFinder = `                    </ul>\n\n                    <div\n                        style="margin-top: 1.5rem; background: #eff6ff;`;
    const preBriefEndFinder2 = `                    </ul>\n\n                        <div\n                            style="margin-top: 1.5rem; background: #eff6ff;`;
    const preBriefEndFinder3 = `                    </ul>\n\n                    <div id="sec3PatientNotes"`;

    let modified = content;

    // Inject the opening wrapper and new chunk
    if (modified.includes(preBriefStart)) {
        modified = modified.replace(preBriefStart, injectContent + preBriefStart);
    } else if (modified.includes(preBriefStart2)) {
        modified = modified.replace(preBriefStart2, injectContent + preBriefStart2);
    }

    // Inject the closing wrapper
    if (modified.includes(preBriefEndFinder)) {
        modified = modified.replace(preBriefEndFinder, `                    </div>\n\n` + preBriefEndFinder);
    } else if (modified.includes(preBriefEndFinder2)) {
        modified = modified.replace(preBriefEndFinder2, `                        </div>\n\n` + preBriefEndFinder2);
    } else if (modified.includes(preBriefEndFinder3)) {
        modified = modified.replace(preBriefEndFinder3, `                    </div>\n\n` + preBriefEndFinder3);
    }

    fs.writeFileSync(file, modified);
    console.log('Processed', file);
}
