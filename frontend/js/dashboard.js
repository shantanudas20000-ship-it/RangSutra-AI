document.addEventListener("DOMContentLoaded", () => {

    if (window.lucide) {
        lucide.createIcons();
    }

    let projects = JSON.parse(
        localStorage.getItem("rangsutra_projects") || "[]"
    );

    const totalProjects = document.getElementById("totalProjects");
    const totalDirections = document.getElementById("totalDirections");
    const totalActivity = document.getElementById("totalActivity");
    const grid = document.getElementById("projectsGrid");

    // Update dashboard statistics
    function updateStats() {

        totalProjects.textContent = projects.length;

        totalDirections.textContent = projects.reduce(
            (sum, p) => sum + (p.directions?.length || 0),
            0
        );

        totalActivity.textContent = projects.reduce(
            (sum, p) => sum + (p.ledger?.length || 0),
            0
        );
    }


    // Save projects to LocalStorage
    function saveProjects() {

        localStorage.setItem(
            "rangsutra_projects",
            JSON.stringify(projects)
        );

        updateStats();
    }


    // Export project as TXT
    function exportProject(project) {

        const content = `
RANGSUTRA AI
Creative Project
==============================

Title: ${project.title || "Untitled Project"}

Category: ${project.category || "Not specified"}

Language: ${project.language || "Not specified"}

Original Idea:
${project.idea || "No original idea available."}

Final Content:
${project.content || project.selectedDirection?.concept || "No content available."}

Creator Credit Ledger:
${(project.ledger || []).map(entry =>
    `${entry.type} - ${entry.by}`
).join("\n") || "No activity recorded."}

==============================
Created with RangSutra AI
Human imagination, amplified.
`;

        const blob = new Blob(
            [content],
            { type: "text/plain;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download =
            (project.title || "RangSutra-Project")
            .replace(/[^a-z0-9]/gi, "_") + ".txt";

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);
    }


    // Render project history
    function renderProjects() {

        grid.innerHTML = "";

        if (projects.length === 0) {

            const empty = document.createElement("div");

            empty.className = "empty-project";

            empty.innerHTML = `
                <div>✦</div>
                <h3>Your creative journey begins here</h3>
                <p>Create your first project in Idea Studio.</p>
                <a href="studio.html" class="primary-btn">
                    Create Project
                </a>
            `;

            grid.appendChild(empty);

            return;
        }


        projects.slice(-6).reverse().forEach(project => {

            const card = document.createElement("div");

            card.className = "project-card";


            const title = document.createElement("h3");

            title.textContent =
                project.title || "Untitled Project";


            const description = document.createElement("p");

            description.textContent =
                project.idea || "No description available.";


            // Continue Editing
            const continueBtn = document.createElement("button");

            continueBtn.textContent = "Continue Editing";

            continueBtn.addEventListener("click", () => {

                localStorage.setItem(
                    "rangsutra_current_project",
                    project.id
                );

                window.location.href = "editor.html";

            });


            // Export TXT
            const exportBtn = document.createElement("button");

            exportBtn.textContent = "Export TXT";

            exportBtn.addEventListener("click", () => {

                exportProject(project);

            });


            // Delete Project
            const deleteBtn = document.createElement("button");

            deleteBtn.textContent = "Delete";

            deleteBtn.addEventListener("click", () => {

                const confirmDelete = confirm(
                    `Are you sure you want to delete "${project.title}"?`
                );

                if (!confirmDelete) return;

                projects = projects.filter(
                    item => item.id !== project.id
                );

                saveProjects();

                if (
                    localStorage.getItem("rangsutra_current_project")
                    === project.id
                ) {
                    localStorage.removeItem(
                        "rangsutra_current_project"
                    );
                }

                renderProjects();

            });


            card.append(
                title,
                description,
                continueBtn,
                exportBtn,
                deleteBtn
            );

            grid.appendChild(card);

        });

    }


    updateStats();

    renderProjects();

});