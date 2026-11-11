const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", generateDirections);

async function generateDirections() {
    const title = document.getElementById("ideaTitle").value.trim();
    const idea = document.getElementById("ideaInput").value.trim();
    const category = document.getElementById("category").value;
    const language = document.getElementById("language").value;
    const instructions = document.getElementById("instructions").value.trim();

    const status = document.getElementById("statusMessage");

    if (!idea) {
        status.textContent = "Please enter your original idea first.";
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";
    status.textContent = "Exploring creative possibilities...";

    try {
        const result = await apiRequest("generate-directions", {
            title,
            idea,
            category,
            language,
            instructions
        });

        if (!Array.isArray(result.directions) ||
            result.directions.length !== 3) {
            throw new Error("AI did not return exactly three directions.");
        }

        const project = {
            id: crypto.randomUUID(),
            title: title || "Untitled Project",
            idea,
            category,
            language,
            instructions,
            directions: result.directions,
            ledger: [{
                type: "Human",
                action: "Original idea submitted",
                timestamp: new Date().toISOString()
            }],
            content: "",
            createdAt: new Date().toISOString()
        };

        const projects = JSON.parse(
            localStorage.getItem("rangsutra_projects") || "[]"
        );

        projects.push(project);

        localStorage.setItem("rangsutra_projects", JSON.stringify(projects));
        localStorage.setItem("rangsutra_current_project", project.id);

        showDirections(result.directions);

        status.textContent = "Three creative directions generated successfully!";

    } catch (error) {
        status.textContent = error.message;
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate Directions ↗";
    }
}

function showDirections(directions) {
    const section = document.getElementById("directionsSection");
    const grid = document.getElementById("directionsGrid");

    grid.innerHTML = "";

    directions.forEach(direction => {
        const card = document.createElement("div");
        card.className = "direction-card";

        const heading = document.createElement("h3");
        heading.textContent = direction.title;

        const description = document.createElement("p");
        description.textContent = direction.description;

        const conceptLabel = document.createElement("strong");
        conceptLabel.textContent = "Creative Concept";

        const concept = document.createElement("p");
        concept.textContent = direction.concept;

        const suggestionLabel = document.createElement("strong");
        suggestionLabel.textContent = "Suggestions";

        const list = document.createElement("ul");

        (direction.suggestions || []).forEach(suggestion => {
            const item = document.createElement("li");
            item.textContent = suggestion;
            list.appendChild(item);
        });

        const button = document.createElement("button");
        button.textContent = "Select Direction";

        button.addEventListener("click", () => {
            const id = localStorage.getItem("rangsutra_current_project");
            const projects = JSON.parse(
                localStorage.getItem("rangsutra_projects") || "[]"
            );

            const project = projects.find(p => p.id === id);

            if (!project) return;

            project.selectedDirection = direction;

            project.ledger.push({
                type: "Human",
                action: "Creative direction selected",
                timestamp: new Date().toISOString()
            });

            localStorage.setItem("rangsutra_projects", JSON.stringify(projects));

            window.location.href = "editor.html";
        });

        card.append(
            heading,
            description,
            conceptLabel,
            concept,
            suggestionLabel,
            list,
            button
        );

        grid.appendChild(card);
    });

    section.hidden = false;
    section.scrollIntoView({ behavior: "smooth" });
}