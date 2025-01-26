from flask import Flask, jsonify, request, render_template

import pdfplumber
import pandas as pd
import os
import plotly.io as pio
import plotly.graph_objects as go
import scipy.stats as stats
import numpy as np
import re
from backend.utila.plots import create_and_display_plots
from flask_cors import CORS

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("No OpenAI API key found in environment variables")

client = OpenAI(
  api_key=api_key,  
)

app = Flask(__name__)

CORS(app, origins=['http://localhost:5173'])  # Replace with your frontend's URL

app.config['UPLOAD_FOLDER'] = './backend/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

app.config['EXTRACTED_DATA_FOLDER'] = './backend/uploads/temporary_csv'
os.makedirs(app.config['EXTRACTED_DATA_FOLDER'], exist_ok=True)

app.config['PLOTLY_OUTPUT_FOLDER'] = './plots'
os.makedirs(app.config['PLOTLY_OUTPUT_FOLDER'], exist_ok=True)

# Load the reference dataframe
reference_df = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'], "reference_data.csv"))

# @app.route("/")
# def test_html():
#     return render_template("test.html")

# Allows to upload the pdf, transform the tables into pd.dataframes, and save these as csv files
@app.route('/process', methods=['POST'])
def process_file():
    if 'pdfFile' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['pdfFile']
    
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)

    with pdfplumber.open(file_path) as pdf:

        p0 = pdf.pages[0]
        tables = p0.extract_tables()

        personal_info = tables[0]
        test_results = tables[1]

        personal_info_df = pd.DataFrame(personal_info[1:], columns=personal_info[0])
        test_results_df = pd.DataFrame(test_results[1:], columns=test_results[0])

    # Load all figures generated for each biomarker    
    all_figures = create_and_display_plots(reference_df,test_results_df)

    # TODO : send everything instead of just the last one
    return jsonify(all_figures) 

if __name__ == "__main__":
    
    app.run(debug=True)