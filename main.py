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

# Set up Jinja2 templates
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