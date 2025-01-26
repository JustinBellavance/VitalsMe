from flask import Flask, jsonify, request, render_template

import pdfplumber
import pandas as pd
import os
import plotly.io as pio
import plotly.graph_objects as go
import scipy.stats as stats
import numpy as np
import re

from utils import create_and_display_plots

app = Flask(__name__)

# Set the folder where the files will be uploaded
app.config['UPLOAD_FOLDER'] = './uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load the reference dataframe
reference_df = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'], "reference_data.csv"))

@app.route("/")
def test_html():
    return render_template("test.html")

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
    return jsonify({'plot': all_figures[-1]}) 

if __name__ == "__main__":
    app.run(debug=True)