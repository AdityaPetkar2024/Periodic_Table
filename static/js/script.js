let allElements = []; // Stores all fetched elements
const table = document.getElementById("table");
const info = document.getElementById("info");
const searchInput = document.getElementById("search");

// Function to render the periodic table
function renderTable(elementsToRender) {
    table.innerHTML = ""; // Clear existing elements

    // Create empty cells for the gaps in the periodic table
    // Period 2, Group 3-12 (10 columns)
    const empty2_3_12 = document.createElement("div");
    empty2_3_12.className = "empty-cell group-period-2-3";
    table.appendChild(empty2_3_12);

    // Period 3, Group 3-12 (10 columns)
    const empty3_3_12 = document.createElement("div");
    empty3_3_12.className = "empty-cell group-period-3-3";
    table.appendChild(empty3_3_12);

    elementsToRender.forEach(el => {
        const div = document.createElement("div");

        // Construct class name: "element" and category-specific class
        // Replace spaces in category with escaped spaces for CSS
        const categoryClass = (el.Category || "").toLowerCase().replace(/ /g, '\\ ');
        div.className = `element ${categoryClass}`;

        // Add Atomic Number inside the element box
        const atomicNumberSpan = document.createElement("span");
        atomicNumberSpan.className = "atomic-number";
        atomicNumberSpan.textContent = el.AtomicNumber;
        div.appendChild(atomicNumberSpan);

        // Add Symbol
        const symbolSpan = document.createElement("span");
        symbolSpan.className = "symbol";
        symbolSpan.textContent = el.Symbol;
        div.appendChild(symbolSpan);

        div.title = el.Element; // Tooltip on hover
        div.setAttribute('data-atomic-number', el.AtomicNumber); // Custom attribute for potential future use

        // --- Grid Positioning Logic ---
        if (el.Period && el.Group) {
            let row = el.Period;
            let col = el.Group;

            // Handle elements with known positions outside normal group/period for visual layout
            if (el.AtomicNumber >= 57 && el.AtomicNumber <= 71) { // Lanthanides
                row = 8; // Place them in the 8th grid row
                col = (el.AtomicNumber - 57) + 3; // Shift to start from column 3 (like La's position)
            } else if (el.AtomicNumber >= 89 && el.AtomicNumber <= 103) { // Actinides
                row = 9; // Place them in the 9th grid row
                col = (el.AtomicNumber - 89) + 3; // Shift to start from column 3 (like Ac's position)
            }

            div.style.gridColumnStart = col;
            div.style.gridRowStart = row;

        } else if (el.AtomicNumber === 57) { // Lanthanum - specific placement in main table
            div.style.gridColumnStart = 3;
            div.style.gridRowStart = 6;
        } else if (el.AtomicNumber === 89) { // Actinium - specific placement in main table
            div.style.gridColumnStart = 3;
            div.style.gridRowStart = 7;
        }


        div.onclick = () => showInfo(el); // Attach click event
        table.appendChild(div);
    });
}

// Function to display element information in the info panel
function showInfo(el) {
    info.innerHTML = `
        <h2>${el.Element || 'N/A'} (${el.Symbol || 'N/A'})</h2>
        <p><strong>Atomic Number:</strong> ${el.AtomicNumber || 'N/A'}</p>
        <p><strong>Atomic Mass:</strong> ${el.AtomicMass ? el.AtomicMass.toFixed(3) : 'N/A'}</p>
        <p><strong>Melting Point:</strong> ${el.MeltingPoint ? el.MeltingPoint + ' K' : 'N/A'}</p>
        <p><strong>Boiling Point:</strong> ${el.BoilingPoint ? el.BoilingPoint + ' K' : 'N/A'}</p>
        <p><strong>Electronegativity:</strong> ${el.Electronegativity || 'N/A'}</p>
        <p><strong>Atomic Radius:</strong> ${el.AtomicRadius ? el.AtomicRadius + ' pm' : 'N/A'}</p>
        <p><strong>Group:</strong> ${el.Group || 'N/A'}</p>
        <p><strong>Period:</strong> ${el.Period || 'N/A'}</p>
        <p><strong>Category:</strong> ${el.Category || 'N/A'}</p>
    `;
}

// Event listener for the search input
searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase().trim();
    let filteredElements;

    if (value === "") {
        // If search bar is empty, show all elements
        filteredElements = allElements;
    } else {
        // Filter elements based on name, symbol, or atomic number
        filteredElements = allElements.filter(el =>
            (el.Element && el.Element.toLowerCase().includes(value)) ||
            (el.Symbol && el.Symbol.toLowerCase().includes(value)) ||
            (el.AtomicNumber && el.AtomicNumber.toString().includes(value))
        );
    }
    renderTable(filteredElements);
});


// Initial data fetch when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/elements")
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            allElements = data; // Store full dataset
            renderTable(allElements); // Initial render of the full table
        })
        .catch(error => {
            console.error("Error fetching elements:", error);
            info.innerHTML = "<p style='color: red;'>Failed to load periodic table data. Please check the server and CSV file.</p>";
        });
});
