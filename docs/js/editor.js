const titleInput = document.getElementById("projectTitle");
const editorContent = document.getElementById("editorContent");
const saveBtn = document.getElementById("saveBtn");
const rewriteBtn = document.getElementById("rewriteBtn");
const improveBtn = document.getElementById("improveBtn");
const creditLedger = document.getElementById("creditLedger");

let projects = JSON.parse(
    localStorage.getItem("rangsutra_projects") || "[]"
);

let currentId = localStorage.getItem("rangsutra_current_project");

let project = projects.find(item => item.id === currentId);

if (!project) {
    titleInput.value = "New Creative Project";
    editorContent.value = "";
    creditLedger.textContent =
        "No project selected. Your contributions will appear here.";
} else {
    project.ledger = project.ledger || [];

    titleInput.value = project.title || "Untitled Project";

    editorContent.value =
        project.content ||
        project.selectedDirection?.concept ||
        "";

    renderLedger();
}

// Save data to LocalStorage
function persistProject() {
    if (!project) return;

    localStorage.setItem(
        "rangsutra_projects",
        JSON.stringify(projects)
    );
}

// Display Creator Credit Ledger
function renderLedger() {
    creditLedger.innerHTML = "";

    if (!project || !project.ledger.length) {
        creditLedger.textContent =
            "No contributions recorded yet.";
        return;
    }

    project.ledger.forEach(entry => {
        const item = document.createElement("p");

        item.textContent =
            `${entry.type} — ${entry.by}`;

        creditLedger.appendChild(item);
    });
}

// Add contribution record
function addLedgerEntry(type, by) {
    if (!project) return;

    project.ledger = project.ledger || [];

    project.ledger.push({
        type,
        by,
        date: new Date().toISOString()
    });

    renderLedger();
}

// Save project
function saveProject(showMessage = true) {
    if (!project) {
        alert("Please select a project from Idea Studio first.");
        return;
    }

    const newContent = editorContent.value;

    if (newContent !== (project.content || "")) {
        addLedgerEntry("Creative content edited", "Human");
    }

    project.title =
        titleInput.value.trim() || "Untitled Project";

    project.content = newContent;
    project.updatedAt = new Date().toISOString();

    persistProject();

    if (showMessage) {
        alert("Project saved successfully!");
    }
}

saveBtn.addEventListener("click", () => {
    saveProject();
});

// AI request
async function requestAI(endpoint, instruction) {
    if (!project) {
        alert("Please select a project first.");
        return;
    }

    const text = editorContent.value.trim();

    if (!text) {
        alert("Please write something in the editor first.");
        return;
    }

    rewriteBtn.disabled = true;
    improveBtn.disabled = true;

    try {
        const result = await apiRequest(endpoint, {
            text,
            instruction,
            language: project.language || "English"
        });

        if (result.mode === "demo") {
            alert(
                "Demo mode: This is a sample suggestion, not a real AI transformation."
            );
        }

        const suggestion = result.suggestion;

        if (!suggestion || typeof suggestion !== "string") {
            throw new Error("No valid suggestion received.");
        }

        // Record AI contribution
        addLedgerEntry(
            endpoint === "rewrite"
                ? "AI rewrite suggestion generated"
                : "AI grammar suggestion generated",
            "AI"
        );

        persistProject();

        const accepted = confirm(
            "AI Suggestion:\n\n" +
            suggestion +
            "\n\nDo you want to accept this suggestion?"
        );

        if (accepted) {
            editorContent.value = suggestion;

            addLedgerEntry(
                "AI suggestion accepted and selected",
                "Human"
            );

            saveProject(false);

            alert("Suggestion accepted and project saved!");
        } else {
            // Rejected suggestion does not change editor content
            addLedgerEntry(
                "AI suggestion rejected",
                "Human"
            );

            persistProject();

            alert("Suggestion rejected. Your original content is safe.");
        }

    } catch (error) {
        console.error("AI Error:", error);

        alert(
            error.message ||
            "Unable to connect to AI service."
        );

    } finally {
        rewriteBtn.disabled = false;
        improveBtn.disabled = false;
    }
}

// Rewrite button
rewriteBtn.addEventListener("click", () => {
    requestAI(
        "rewrite",
        "Make the writing more engaging while preserving the original meaning."
    );
});

// Improve grammar button
improveBtn.addEventListener("click", () => {
    requestAI("improve");
});