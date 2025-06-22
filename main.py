from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import csv # Import the csv module
import os

app = FastAPI()

# Mount static files (CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up Jinja2 templates
templates = Jinja2Templates(directory="templates")

# Load periodic table data directly using csv module
periodic_table_data = []
try:
    # Get the directory of the current script (main.py)
    script_dir = os.path.dirname(__file__)
    csv_file_path = os.path.join(script_dir, "periodictable_data.csv")

    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            # Convert relevant fields to appropriate types if needed
            # For simplicity, we'll keep them as strings for now,
            # but you could add type conversion here if your frontend
            # needs numbers for sorting/filtering.
            # Example: row['AtomicNumber'] = int(row['AtomicNumber']) if row['AtomicNumber'] else None
            # IMPORTANT: Ensure empty strings in CSV for numbers become None or 0 to prevent errors
            for key in ['AtomicMass', 'Electronegativity', 'AtomicRadius', 'MeltingPoint', 'BoilingPoint']:
                if row.get(key) == '': # Check for empty string
                    row[key] = None # Set to None for missing values
                else:
                    try:
                        row[key] = float(row[key]) # Convert to float
                    except (ValueError, TypeError):
                        pass # Keep as is if conversion fails (e.g., already None or non-numeric)

            for key in ['AtomicNumber', 'Group', 'Period']:
                if row.get(key) == '':
                    row[key] = None
                else:
                    try:
                        row[key] = int(row[key])
                    except (ValueError, TypeError):
                        pass


            periodic_table_data.append(row)
except FileNotFoundError:
    print(f"Error: {csv_file_path} not found. Please ensure it's in the correct directory.")
    periodic_table_data = [] # Ensure it's empty if file not found
except Exception as e:
    print(f"Error loading or parsing CSV: {e}")
    periodic_table_data = []

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/elements")
async def get_elements():
    # Return the loaded list of dictionaries
    return periodic_table_data