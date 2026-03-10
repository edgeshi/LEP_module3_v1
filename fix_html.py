import os
import re

files = [
    'index.html',
    'submodule1.html',
    'submodule2.html',
    'submodule3.html',
    'submodule4.html'
]

inject_content = """                    <div id="note-sec1-step1" style="display: none; margin-bottom: 1.5rem; opacity: 0; transition: opacity 0.5s ease-in;">
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
"""

for f in files:
    if not os.path.exists(f):
        continue
    with open(f, 'r') as file:
        content = file.read()
    
    broken_pattern = r'(<h4[^>]*border-bottom:\s*2px\s*solid\s*#dbeafe;\s*padding-bottom:\s*0\.6rem;">\s*)(<div\s+class="hover-note-line")'
    if re.search(broken_pattern, content):
        content = re.sub(broken_pattern, r'\g<1>Pre-briefing</h4>\n                        \g<2>', content)

    pre_brief_h4_pattern = r'(\s*<h4[^>]*>\s*Pre-briefing</h4>)'
    if re.search(pre_brief_h4_pattern, content):
         content = re.sub(pre_brief_h4_pattern, '\n' + inject_content + r'\g<1>', content, count=1)
    
    ul_end_pattern = r'(</ul>\s*)(<div[^>]*id="sec3PatientNotes"|<div[^>]*style="margin-top:\s*1\.5rem;\s*background:\s*#eff6ff;)'
    if re.search(ul_end_pattern, content):
        content = re.sub(ul_end_pattern, r'\g<1>                        </div>\n\n                        \g<2>', content, count=1)

    with open(f, 'w') as file:
        file.write(content)
    print(f"Processed {f}")
