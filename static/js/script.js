<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    const tableDiv = document.getElementById('table');
    const infoPanel = document.getElementById('info');
    const searchInput = document.getElementById('search');
    let elementsData = []; // To store fetched data

    // Function to fetch data
    async function fetchElements() {
        try {
            const response = await fetch('/api/elements');
            elementsData = await response.json();
            renderTable(elementsData);
        } catch (error) {
            console.error('Error fetching elements:', error);
            infoPanel.innerHTML = '<p>Error loading periodic table data.</p>';
        }
    }

    // Function to render the table
    function renderTable(data) {
        tableDiv.innerHTML = ''; // Clear existing elements

        // --- Main Periodic Table Layout ---

        // Period 1 (H and He)
        const h = data.find(el => el.Symbol === 'H');
        if (h) createElement(h);
        appendEmptyCells(1, 16, 2); // Gap between H and He (start at column 2)
        const he = data.find(el => el.Symbol === 'He');
        if (he) createElement(he);

        // Define elements that should *always* go into the f-block, regardless of their main category
        const fBlockElements = data.filter(el =>
            el.Category === 'lanthanide' ||
            el.Category === 'actinide' ||
            el.Symbol === 'Lu' || // Explicitly include Lutetium in f-block rendering
            el.Symbol === 'Lr'    // Explicitly include Lawrencium in f-block rendering
        );

        // Define elements for the main periodic table
        const mainTableElements = data.filter(el =>
            el.Period >= 1 && el.Period <= 7 && // Within the main 7 periods
            !fBlockElements.includes(el)        // Exclude elements destined for the f-block
        );

        // Render elements for Period 2
        mainTableElements.filter(el => el.Period === 2).forEach(el => {
            createElement(el);
        });
        appendEmptyCells(2, 10, 3); // Gap for period 2, groups 3-12

        // Render elements for Period 3
        mainTableElements.filter(el => el.Period === 3).forEach(el => {
            createElement(el);
        });
        appendEmptyCells(3, 10, 3); // Gap for period 3, groups 3-12

        // Periods 4 to 7 (full rows in the main table, excluding f-block elements)
        for (let p = 4; p <= 7; p++) {
            mainTableElements.filter(el => el.Period === p).forEach(el => createElement(el));
        }

        // --- Placeholders for Lanthanide and Actinide series in the main table ---

        // Lanthanides (57-71) Placeholder
        const lanthanidePlaceholder = document.createElement('div');
        lanthanidePlaceholder.className = 'element lanthanide-placeholder';
        lanthanidePlaceholder.style.gridColumn = '3'; // Group 3
        lanthanidePlaceholder.style.gridRow = '6';  // Period 6
        lanthanidePlaceholder.innerHTML = '<div class="symbol">57-71</div>';
        lanthanidePlaceholder.addEventListener('click', () => {
            infoPanel.innerHTML = '<p>Lanthanides (Elements 57-71) are displayed below in the f-block.</p>';
        });
        tableDiv.appendChild(lanthanidePlaceholder);

        // Actinides (89-103) Placeholder
        const actinidePlaceholder = document.createElement('div');
        actinidePlaceholder.className = 'element actinide-placeholder';
        actinidePlaceholder.style.gridColumn = '3'; // Group 3
        actinidePlaceholder.style.gridRow = '7';  // Period 7
        actinidePlaceholder.innerHTML = '<div class="symbol">89-103</div>';
        actinidePlaceholder.addEventListener('click', () => {
            infoPanel.innerHTML = '<p>Actinides (Elements 89-103) are displayed below in the f-block.</p>';
        });
        tableDiv.appendChild(actinidePlaceholder);

        // --- Lanthanides and Actinides (f-block) ---
        // These will be placed in separate rows below the main table,
        // typically at grid rows 8 and 9, starting from grid column 4.

        // Add empty cells to align the f-block elements correctly in row 8
        appendEmptyCells(8, 3, 1); // Empty cells for columns 1, 2, 3 in row 8

        // Render all Lanthanides (including Lu) in the f-block
        let currentLanthanideCol = 4; // Start from column 4 in the grid for f-block
        fBlockElements.filter(el => el.Category === 'lanthanide' || el.Symbol === 'Lu').sort((a,b) => a.AtomicNumber - b.AtomicNumber).forEach(el => {
            const div = createElementDiv(el); // Use the helper to create the div
            div.style.gridColumn = `${currentLanthanideCol++}`;
            div.style.gridRow = '8'; // All lanthanides go in row 8
            tableDiv.appendChild(div);
        });

        // Add empty cells to align the f-block elements correctly in row 9
        appendEmptyCells(9, 3, 1); // Empty cells for columns 1, 2, 3 in row 9

        // Render all Actinides (including Lr) in the f-block
        let currentActinideCol = 4; // Start from column 4 in the grid for f-block
        fBlockElements.filter(el => el.Category === 'actinide' || el.Symbol === 'Lr').sort((a,b) => a.AtomicNumber - b.AtomicNumber).forEach(el => {
            const div = createElementDiv(el); // Use the helper to create the div
            div.style.gridColumn = `${currentActinideCol++}`;
            div.style.gridRow = '9'; // All actinides go in row 9
            tableDiv.appendChild(div);
        });
    }

    // Helper to append empty cells for grid layout
    function appendEmptyCells(row, count, startColumn = 1) {
        for (let i = 0; i < count; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-cell';
            emptyDiv.style.gridColumn = `${startColumn + i}`;
            emptyDiv.style.gridRow = `${row}`;
            tableDiv.appendChild(emptyDiv);
        }
    }

    // Refactored common element creation logic into a helper function
    function createElementDiv(el) {
        const div = document.createElement('div');
        const categoryClass = (el.Category || "").toLowerCase().replace(/ /g, ''); // Ensure concatenated
        div.className = `element ${categoryClass}`;

        div.innerHTML = `
            <div class="atomic-number">${el.AtomicNumber}</div>
            <div class="symbol">${el.Symbol}</div>
        `;
        div.addEventListener('click', () => showElementDetails(el));
        return div; // Return the div, don't append it here
    }

    // Function to create and append an element div for the main table (uses group/period)
    function createElement(el) {
        const div = createElementDiv(el); // Create the base div
        div.style.gridColumn = `${el.Group}`;
        div.style.gridRow = `${el.Period}`;
        tableDiv.appendChild(div); // Append it to the tableDiv
    }

    // Function to display element details
    function showElementDetails(el) {
        infoPanel.innerHTML = `
            <h2>${el.Element} (${el.Symbol})</h2>
            <p><strong>Atomic Number:</strong> ${el.AtomicNumber}</p>
            <p><strong>Atomic Mass:</strong> ${el.AtomicMass ? el.AtomicMass.toFixed(3) : 'N/A'}</p>
            <p><strong>Category:</strong> ${el.Category}</p>
            <p><strong>Group:</strong> ${el.Group}</p>
            <p><strong>Period:</strong> ${el.Period}</p>
            <p><strong>Electronegativity:</strong> ${el.Electronegativity || 'N/A'}</p>
            <p><strong>Atomic Radius:</strong> ${el.AtomicRadius || 'N/A'} pm</p>
            <p><strong>Melting Point:</strong> ${el.MeltingPoint || 'N/A'} K</p>
            <p><strong>Boiling Point:</strong> ${el.BoilingPoint || 'N/A'} K</p>
        `;
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const elements = document.querySelectorAll('.element');

        elements.forEach(elDiv => {
            const symbolElement = elDiv.querySelector('.symbol');
            const atomicNumberElement = elDiv.querySelector('.atomic-number');

            // Handle placeholder elements (like '57-71', '89-103')
            if (elDiv.classList.contains('lanthanide-placeholder') || elDiv.classList.contains('actinide-placeholder')) {
                if (symbolElement && symbolElement.textContent.toLowerCase().includes(searchTerm)) {
                    elDiv.classList.remove('hidden');
                } else if (searchTerm === '') { // Always show placeholders if search is empty
                    elDiv.classList.remove('hidden');
                } else {
                    elDiv.classList.add('hidden');
                }
                return;
            }

            // For regular elements
            if (!symbolElement || !atomicNumberElement) {
                elDiv.classList.add('hidden'); // Hide if it's an unexpected structure
                return;
            }

            const symbol = symbolElement.textContent.toLowerCase();
            const atomicNumber = atomicNumberElement.textContent;

            const elementData = elementsData.find(d => d.Symbol && d.Symbol.toLowerCase() === symbol);

            const matches = elementData && (
                elementData.Element.toLowerCase().includes(searchTerm) ||
                symbol.includes(searchTerm) ||
                atomicNumber.includes(searchTerm)
            );

            if (matches) {
                elDiv.classList.remove('hidden');
            } else {
                elDiv.classList.add('hidden');
            }
        });
    });

    // Initial data fetch
    fetchElements();
});
=======
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
>>>>>>> e87927a2d2de4a200bd714e3fa4675c04c98afe0
