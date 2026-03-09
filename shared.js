// Shared Script for Module 3 Web App

// Central configuration or utility functions can go here
console.log('Shared logic loaded for Module 3');

// For example, a shared function to navigate back to the main hub
function goBackToHub() {
    window.location.href = 'index.html';
}

// Automatically add a back button to submodules if an element with id="navLeft" exists
document.addEventListener('DOMContentLoaded', () => {
    const navLeft = document.getElementById('navLeft');
    // Only add if we aren't already on the hub (index.html), and the container exists
    if (navLeft && !window.location.pathname.endsWith('index.html')) {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-outline';
        backBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Hub`;

        backBtn.addEventListener('click', goBackToHub);
        navLeft.appendChild(backBtn);
    }

    // Call global initializers
    initializeNotesToggle();
    setupNodeTooltips();
    syncNotesState();
    setupInlineNotes();
});

function initializeNotesToggle() {
    const notesPanel = document.getElementById('globalNotes');
    const notesHeader = document.getElementById('notesHeader');
    const toggleIcon = document.getElementById('notesToggleIcon');
    const blueContent = notesPanel?.querySelector('.blue-content');

    if (notesPanel && notesHeader) {
        notesHeader.addEventListener('click', () => {
            const isCollapsed = notesPanel.classList.contains('collapsed');
            if (isCollapsed) {
                notesPanel.classList.remove('collapsed');
                notesPanel.style.width = '680px';
                if (toggleIcon) toggleIcon.innerText = '▶ Click to Collapse';

                showNotesToast();

                if (blueContent) {
                    setTimeout(() => {
                        blueContent.style.opacity = '1';
                        blueContent.style.pointerEvents = 'auto';
                    }, 200);
                }
            } else {
                notesPanel.classList.add('collapsed');
                notesPanel.style.width = '280px';
                if (toggleIcon) toggleIcon.innerText = '◀ Click to Expand';
                if (blueContent) {
                    blueContent.style.opacity = '0';
                    blueContent.style.pointerEvents = 'none';
                }
            }
        });
    }
}

function setupNodeTooltips() {
    const nodeData = {
        'rn-node': '<b>Nurse (RN):</b> Guides the session while clarifying goals, procedures, jargons.',
        'int-node': '<b>Interpreter:</b> Translates the session with knowledge in languages and cultures.',
        'pat-node': '<b>Patient:</b> Follows the session while providing information in literacy level, visual and hearing conditions, mental state, health history, family, other personal conditions.'
    };

    Object.keys(nodeData).forEach(cls => {
        // Can be multiple nodes if both Hub and Submodule render triangles
        const nodeContainers = document.querySelectorAll('.' + cls);

        nodeContainers.forEach(nodeContainer => {
            const node = nodeContainer.querySelector('.node');
            if (node && !node.dataset.tooltipInitialized) {
                node.dataset.tooltipInitialized = 'true';
                node.style.cursor = 'pointer';

                const graphicContainer = nodeContainer.closest('.graphic-container');

                // Create tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'popup-tooltip';
                tooltip.innerHTML = nodeData[cls];
                // Style adjustment for triangle nodes to fit longer text AND center it
                tooltip.style.width = '260px';
                tooltip.style.whiteSpace = 'normal';
                tooltip.style.zIndex = '99999';
                tooltip.style.lineHeight = '1.5';
                tooltip.style.textAlign = 'center';

                // We append to the graphic-container instead of the node so we can center it in the triangle
                if (graphicContainer) {
                    graphicContainer.appendChild(tooltip);
                } else {
                    nodeContainer.appendChild(tooltip); // fallback
                }

                node.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Close others
                    document.querySelectorAll('.popup-tooltip').forEach(p => {
                        if (p !== tooltip) p.classList.remove('active');
                    });

                    // Toggle current
                    if (tooltip.classList.contains('active')) {
                        tooltip.classList.remove('active');
                    } else {
                        tooltip.classList.add('active');
                        // Position in the exact vertical and horizontal center of the triangle
                        tooltip.style.top = '45%';
                        tooltip.style.left = '50%';
                        tooltip.style.transform = 'translate(-50%, -50%)';
                    }
                });
            }
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.node') && !e.target.closest('.popup-tooltip')) {
            document.querySelectorAll('.popup-tooltip').forEach(p => p.classList.remove('active'));
        }
    });
}

function syncNotesState() {
    const notesPanel = document.getElementById('globalNotes');
    if (!notesPanel) return;

    // Read the unlocked features array from localStorage
    const unlockedJson = localStorage.getItem('module3_notesUnlocked');
    let unlocked = [];
    if (unlockedJson) {
        try { unlocked = JSON.parse(unlockedJson); } catch (e) { }
    }

    // Always keep the panel visible
    notesPanel.style.display = 'flex';

    // Manage an empty state placeholder
    const emptyMessage = notesPanel.querySelector('#emptyNotesMessage');
    if (emptyMessage) {
        emptyMessage.style.display = unlocked.length === 0 ? 'block' : 'none';
    }

    // Toggle specific color columns
    const greenContent = notesPanel.querySelector('.green-content');
    if (greenContent) {
        greenContent.style.display = unlocked.includes('green') ? 'flex' : 'none';
    }

    const blueContent = notesPanel.querySelector('.blue-content');
    if (blueContent) {
        blueContent.style.display = unlocked.includes('blue') ? 'flex' : 'none';
    }

    // Check for Step 3 Patient Notes specific unlock
    const patNotes = document.getElementById('sec3PatientNotes');
    if (patNotes && localStorage.getItem('module3_patient_notes_unlocked') === 'true') {
        patNotes.style.display = 'block';
        patNotes.style.opacity = '1';
    }

    // Add Download Button if all 4 submodules are complete (unlockLevel >= 5)
    let unlockLevel = parseInt(localStorage.getItem('module3_unlockLevel') || '1');
    if (unlockLevel >= 5) {

        // Eager-load html2pdf so it's ready instantly when clicked
        if (typeof html2pdf === 'undefined' && !document.getElementById('html2pdf_script')) {
            const script = document.createElement('script');
            script.id = 'html2pdf_script';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            document.head.appendChild(script);
        }

        let downloadBtn = document.getElementById('downloadNotesBtn');
        if (!downloadBtn) {
            downloadBtn = document.createElement('button');
            downloadBtn.id = 'downloadNotesBtn';
            downloadBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg> Download Notes`;
            downloadBtn.style.cssText = 'position: absolute; bottom: 20px; right: 20px; background: #1e3a8a; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 1000; transition: background 0.2s;';
            downloadBtn.onmouseover = () => downloadBtn.style.background = '#1e40af';
            downloadBtn.onmouseout = () => downloadBtn.style.background = '#1e3a8a';
            downloadBtn.onclick = (e) => { e.stopPropagation(); downloadNotes(); };
            notesPanel.appendChild(downloadBtn);
        }
    }
}

function triggerNotesUpdateAnimation() {
    const notesPanel = document.getElementById('globalNotes');
    const toggleIcon = document.getElementById('notesToggleIcon');
    const blueContent = notesPanel?.querySelector('.blue-content');

    if (notesPanel) {
        // Force the panel open
        if (notesPanel.classList.contains('collapsed')) {
            notesPanel.classList.remove('collapsed');
            notesPanel.style.width = '680px';
            if (toggleIcon) toggleIcon.innerText = '▶ Click to Collapse';

            showNotesToast();

            if (blueContent) {
                setTimeout(() => {
                    blueContent.style.opacity = '1';
                    blueContent.style.pointerEvents = 'auto';
                }, 200);
            }
        }

        // Add the glow class, then remove it after the 2s animation completes
        notesPanel.classList.remove('notes-update-glow'); // reset if already playing
        // Small delay to trigger reflow so the animation restarts
        setTimeout(() => {
            notesPanel.classList.add('notes-update-glow');
        }, 10);

        setTimeout(() => {
            if (notesPanel) notesPanel.classList.remove('notes-update-glow');
        }, 2200); // slightly longer than the 2s css animation
    }
}

function setupInlineNotes() {
    const textareas = document.querySelectorAll('.inline-user-note');

    // Load existing notes from localStorage
    textareas.forEach(textarea => {
        if (textarea.dataset.initialized) return; // Prevent duplicate listeners
        textarea.dataset.initialized = 'true';

        const noteId = textarea.id; // e.g. 'userNote-1'
        if (!noteId) return;

        const savedText = localStorage.getItem(`module3_${noteId}`);
        if (savedText) {
            textarea.value = savedText;
            textarea.classList.remove('hidden');
        }

        // Auto-save on every keystroke
        textarea.addEventListener('input', (e) => {
            localStorage.setItem(`module3_${noteId}`, e.target.value);

            // Auto resize height based on content
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });

        // Hide if empty when losing focus
        textarea.addEventListener('blur', (e) => {
            if (e.target.value.trim() === '') {
                textarea.classList.add('hidden');
                localStorage.removeItem(`module3_${noteId}`);
            }
        });

        // Initial resize for loaded content
        if (textarea.value) {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        }

        // Hook up the + button
        const parent = textarea.closest('.hover-note-line');
        if (parent) {
            const btn = parent.querySelector('.add-note-btn');
            if (btn) {
                // Remove old listeners by cloning
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                newBtn.addEventListener('click', () => {
                    textarea.classList.remove('hidden');
                    textarea.focus();
                });
            }
        }
    });
}

// Global Toast Popup logic
function showNotesToast() {
    let toast = document.getElementById('notesToast');
    const notesPanel = document.getElementById('globalNotes');

    if (!notesPanel) return;

    // Create it once if it doesn't exist
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'notesToast';
        toast.className = 'notes-toast';
        toast.innerHTML = 'Add your thoughts by "+"<br><br>Download at the end of Module 3.';
        notesPanel.appendChild(toast);
    }

    // Show and auto-hide
    toast.classList.add('show');

    // Clear any existing timeout to reset the timer if spammed
    if (toast.hideTimeout) {
        clearTimeout(toast.hideTimeout);
    }

    toast.hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4500); // Display for 4.5 seconds
}

// Compiles and downloads all visible notes into a visually perfect .doc file
function downloadNotes() {
    const btn = document.getElementById('downloadNotesBtn');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) btn.innerText = 'Generating Document...';

    // Small timeout to allow UI update before heavy cloning
    setTimeout(() => {
        executeDocumentDownload(btn, originalText);
    }, 50);
}

function executeDocumentDownload(btn, originalText) {
    const notesPanel = document.getElementById('globalNotes');
    if (!notesPanel) return;

    // We need to specifically grab the inner content columns since .notes-content doesn't exist uniformly
    const greenColumn = notesPanel.querySelector('.green-content');
    const blueColumn = notesPanel.querySelector('.blue-content');

    if (!greenColumn && !blueColumn) {
        if (btn) btn.innerHTML = originalText;
        return;
    }

    // Create an unconstrained printable wrapper behind the viewport
    const printWrapper = document.createElement('div');
    printWrapper.style.cssText = 'position: absolute; left: 0; top: 0; z-index: -9999; width: 800px; background: white; padding: 40px; font-family: "Inter", sans-serif; visibility: visible;';

    const header = document.createElement('h1');
    header.innerText = 'Module 3: Interpreted Encounter Notes';
    header.style.cssText = 'color: #1e3a8a; font-family: "Inter", sans-serif; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px;';
    printWrapper.appendChild(header);

    const cloneWrapper = document.createElement('div');
    cloneWrapper.style.display = 'block'; // Avoid flex gap issues

    function bakeStyles(original, clone) {
        if (original.nodeType !== Node.ELEMENT_NODE) return;
        const comp = window.getComputedStyle(original);

        // Bake critical visual styles to bypass CSS variable failures
        clone.style.color = comp.color;
        clone.style.backgroundColor = comp.backgroundColor;
        clone.style.fontSize = comp.fontSize;
        clone.style.fontWeight = comp.fontWeight;
        clone.style.fontFamily = comp.fontFamily;
        clone.style.padding = comp.padding;
        clone.style.margin = comp.margin;
        clone.style.border = comp.border;
        clone.style.borderRadius = comp.borderRadius;

        // Blockify flex layout slightly to prevent gap collapse
        if (comp.display === 'flex') {
            clone.style.display = 'block';
            clone.style.marginBottom = '15px';
        }

        // Apply strict print layout constraints to prevent invisible clipping
        clone.style.opacity = '1';
        clone.style.transform = 'none';

        if (comp.overflow === 'auto' || comp.overflow === 'hidden' || comp.overflowY === 'auto') {
            clone.style.overflow = 'visible';
            clone.style.overflowY = 'visible';
            clone.style.overflowX = 'visible';
        }
        if (clone.style.maxHeight) {
            clone.style.maxHeight = 'none';
        }
        if (clone.style.height && clone.style.height.includes('px')) {
            clone.style.height = 'auto';
        }

        const origChildren = Array.from(original.children);
        const cloneChildren = Array.from(clone.children);
        for (let i = 0; i < origChildren.length; i++) {
            if (cloneChildren[i]) bakeStyles(origChildren[i], cloneChildren[i]);
        }
    }

    if (greenColumn && window.getComputedStyle(greenColumn).display !== 'none') {
        let gcClone = greenColumn.cloneNode(true);
        bakeStyles(greenColumn, gcClone);
        gcClone.style.marginBottom = '30px';
        cloneWrapper.appendChild(gcClone);
    }

    if (blueColumn && window.getComputedStyle(blueColumn).display !== 'none') {
        let bcClone = blueColumn.cloneNode(true);
        bakeStyles(blueColumn, bcClone);
        cloneWrapper.appendChild(bcClone);
    }

    // Strip UI-only interactive buttons, messages, and complex unrenderable SVGs
    cloneWrapper.querySelectorAll('.add-note-btn').forEach(b => b.remove());
    cloneWrapper.querySelectorAll('svg').forEach(b => b.remove());
    cloneWrapper.querySelectorAll('.node-container').forEach(b => b.remove());
    cloneWrapper.querySelectorAll('span[style*="position: absolute"]').forEach(b => b.remove());

    const emptyMsg = cloneWrapper.querySelector('#emptyNotesMessage');
    if (emptyMsg) emptyMsg.remove();

    // Mutate <textarea> nodes into physical text blocks so html2pdf can snapshot their contents
    const clonedTextareas = cloneWrapper.querySelectorAll('textarea');
    let originalIdx = 0;

    // We match textareas sequentially manually since we only baked visible columns
    const greenTextareas = greenColumn ? Array.from(greenColumn.querySelectorAll('textarea')) : [];
    const blueTextareas = blueColumn ? Array.from(blueColumn.querySelectorAll('textarea')) : [];
    const allOriginalTextareas = [...greenTextareas, ...blueTextareas];

    for (let i = 0; i < allOriginalTextareas.length; i++) {
        let val = allOriginalTextareas[i].value.trim();
        if (val && clonedTextareas[i]) {
            let p = document.createElement('div');
            p.innerText = val;
            p.style.cssText = 'background: #f8fafc; border-left: 3px solid #3b82f6; padding: 12px; margin-top: 6px; font-size: 0.95rem; color: #0f172a; white-space: pre-wrap; font-family: "Inter", sans-serif; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border-radius: 0 4px 4px 0; display: block;';
            clonedTextareas[i].parentNode.replaceChild(p, clonedTextareas[i]);
        } else if (clonedTextareas[i]) {
            clonedTextareas[i].remove();
        }
    }

    printWrapper.appendChild(cloneWrapper);
    document.body.appendChild(printWrapper);

    // Build a fully qualified HTML document structure around the clone
    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Module 3: Interpreted Encounter Notes</title>
            <style>
                body { font-family: 'Inter', Arial, sans-serif; background: white; }
                /* Ensure links stay their computed color if forced */
                a { color: inherit; text-decoration: none; }
            </style>
        </head>
        <body>
            ${printWrapper.outerHTML}
        </body>
        </html>
    `;

    // Trigger the file download natively as a disguised Word Document
    const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Module3_Notes.doc';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(printWrapper);
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (btn) btn.innerHTML = originalText;
    }, 100);
}
