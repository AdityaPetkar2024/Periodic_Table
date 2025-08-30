<<<<<<< HEAD
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import csv # Import the csv module
import os

app = FastAPI()

 
app.mount("/static", StaticFiles(directory="static"), name="static")

 
templates = Jinja2Templates(directory="templates")

 
periodic_table_data = []
try:
  
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
  

    return periodic_table_data
=======
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import csv
import os

app = FastAPI()

# Get the directory where main.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Mount static files (CSS, JS)
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

 
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# Define the path to the CSV file
CSV_FILE_PATH = os.path.join(BASE_DIR, "periodictable_data.csv")

# Function to load elements from CSV
def load_elements():
    elements_list = []
    try:
        with open(CSV_FILE_PATH, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Convert relevant fields to appropriate types
                row['AtomicNumber'] = int(row['AtomicNumber'])
                row['Group'] = int(row['Group']) if row['Group'] else None
                row['Period'] = int(row['Period']) if row['Period'] else None
                # Handle potentially missing numerical values gracefully
                row['AtomicMass'] = float(row['AtomicMass']) if row['AtomicMass'] else None
                row['Electronegativity'] = float(row['Electronegativity']) if row['Electronegativity'] else None
                row['AtomicRadius'] = int(row['AtomicRadius']) if row['AtomicRadius'] else None
                row['MeltingPoint'] = float(row['MeltingPoint']) if row['MeltingPoint'] else None
                row['BoilingPoint'] = float(row['BoilingPoint']) if row['BoilingPoint'] else None
                elements_list.append(row)
    except FileNotFoundError:
        print(f"Error: CSV file not found at {CSV_FILE_PATH}")
    except Exception as e:
        print(f"Error loading elements from CSV: {e}")
    return elements_list

# Route for the main page
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# API endpoint to get all elements
@app.get("/api/elements")
async def get_all_elements():
    return load_elements()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, log_level="info")
>>>>>>> e87927a2d2de4a200bd714e3fa4675c04c98afe0
