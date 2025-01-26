from flask import Flask, jsonify, request, render_template

import pdfplumber
import pandas as pd
import os
import plotly.io as pio
import plotly.graph_objects as go
import scipy.stats as stats
import numpy as np
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
        
    all_figures = []
    for i in range(len(reference_df)):  # Loop through rows using iterrows()
        file_name = reference_df["vitals_short_name"][i]  # File name for the plot
        mean = reference_df["Mean"][i]
        variance = reference_df["Variance"][i]
        std_dev = np.sqrt(variance)
        user_data_point = test_results_df["Results"][i]
        
        # Generate 1000 data points
        data = np.random.normal(mean, std_dev, 1000)  

        # Create the histogram
        hist_data = go.Histogram(
            x=data.tolist(),
            nbinsx=30,  # Number of bins in the histogram
            histnorm='probability density',  # Normalize to show density
            opacity=0.7,
            marker=dict(color='rgba(0, 100, 255, 0.5)'),
        )

        # Create smoothed normal distribution curve
        x_vals = np.linspace(mean - 4*std_dev, mean + 4*std_dev, 1000)
        y_vals = stats.norm.pdf(x_vals, mean, std_dev)

        smoothed_curve = go.Scatter(
            x=x_vals.tolist(),
            y=y_vals.tolist(),
            mode='lines',
            fill='tozeroy',  # Fill area under the plot with blue color
            fillcolor='rgba(0, 0, 255, 0.3)',  # Blue with some transparency,
            name=None,
            #line=dict(color='red', width=2)
        )

        # Add a specific data point on the smoothed curve
        
        user_data_point = float(user_data_point)
        user_y_val = stats.norm.pdf(float(user_data_point), mean, std_dev)
        data_point = go.Scatter(
            x=[user_data_point],
            y=[user_y_val],
            mode='markers',
            marker=dict(size=10, color='green', symbol='circle'),
            name='Data point'
        )

        # Combine histogram, smoothed curve, and data point
        fig = go.Figure(data=[
            hist_data,
            smoothed_curve,
            data_point
            ])

        # Custom layout
        fig.update_layout(
            title=None,  
            xaxis_title=reference_df["Vitals"][i],
            yaxis_title="Density",
            bargap=0.2, 
            plot_bgcolor='rgba(0, 0, 0, 0)', 
            paper_bgcolor='rgba(0, 0, 0, 0)', 
            xaxis=dict(showgrid=False),  
            yaxis=dict(showgrid=False, showticklabels=False),
            showlegend=False  
        )

        # Save plot as html locally
        # fig.write_html(os.path.join(app.config['PLOTLY_OUTPUT_FOLDER'], "".join([file_name, ".hmtl"])))

        config = {'displayModeBar': False}
        
        #print(f"saving figure {i}")
        #fig.write_image(f"figure_{i}.png")

        fig_json = fig.to_dict()
        fig_json['config'] = config 
       
        all_figures.append(fig_json)
        
    return jsonify(all_figures)


if __name__ == "__main__":
    
    app.run(debug=True)