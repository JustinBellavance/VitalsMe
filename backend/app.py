from flask import Flask, jsonify, request, render_template

import pdfplumber
import pandas as pd
import os
import plotly.io as pio
import plotly.graph_objects as go
import scipy.stats as stats
import numpy as np

from utils import create_distribution

app = Flask(__name__)

# Set the folder where the files will be uploaded
app.config['UPLOAD_FOLDER'] = './uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
# Set the folder where the extracted data will be saved
app.config['EXTRACTED_DATA_FOLDER'] = './uploads/temporary_csv'
os.makedirs(app.config['EXTRACTED_DATA_FOLDER'], exist_ok=True)
# Set the folder where the plots will be saved
app.config['PLOTLY_OUTPUT_FOLDER'] = './plots'
os.makedirs(app.config['PLOTLY_OUTPUT_FOLDER'], exist_ok=True)

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
            x=data,
            nbinsx=30,  # Number of bins in the histogram
            histnorm='probability density',  # Normalize to show density
            opacity=0.7,
            marker=dict(color='rgba(0, 100, 255, 0.5)'),
        )

        # Create smoothed normal distribution curve
        x_vals = np.linspace(mean - 4*std_dev, mean + 4*std_dev, 1000)
        y_vals = stats.norm.pdf(x_vals, mean, std_dev)

        smoothed_curve = go.Scatter(
            x=x_vals,
            y=y_vals,
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
            title=None,  # Use row for title dynamically
            xaxis_title=reference_df["Vitals"][i],
            yaxis_title="Density",
            bargap=0.2,  # Spacing between bars in the histogram
            plot_bgcolor='rgba(0, 0, 0, 0)', 
            paper_bgcolor='rgba(0, 0, 0, 0)', 
            xaxis=dict(showgrid=False),  
            yaxis=dict(showgrid=False, showticklabels=False),
            showlegend=False  # Remove the legend
        )

        # Save plot as html locally
        # fig.write_html(os.path.join(app.config['PLOTLY_OUTPUT_FOLDER'], "".join([file_name, ".hmtl"])))

        config = {'displayModeBar': False}

        plot_html = fig.to_html(full_html=False, config=config)
        
        all_figures.append(plot_html)
        
    # TODO : send everything instead of just the last one
    return jsonify({'plot': all_figures[-1]})


# @app.route('/upload', methods=['POST'])
# def upload_pdf():
#     if 'pdfFile' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
    
#     file = request.files['pdfFile']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
    
#     if file and file.filename.endswith('.pdf'):
#         # Create the full file path
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        
#         # Save the file to the specified location
#         file.save(file_path)
        
#         # Now, use pdfplumber to extract table from the saved PDF first page
#         try:
#             with pdfplumber.open(file_path) as pdf:

#                 p0 = pdf.pages[0]
#                 tables = p0.extract_tables()

#                 personal_info = tables[0]
#                 test_results = tables[1]

#                 personal_info_df = pd.DataFrame(personal_info[1:], columns=personal_info[0])
#                 test_results_df = pd.DataFrame(test_results[1:], columns=test_results[0])

#                 # Save the dataframes for use in the plot route
#                 personal_info_df.to_csv(os.path.join(app.config['EXTRACTED_DATA_FOLDER'], "personal_info.csv"), index=False)
#                 test_results_df.to_csv(os.path.join(app.config['EXTRACTED_DATA_FOLDER'], "test_results.csv"), index=False)

#                 return jsonify({'message': f'Personal info table uploaded and processed successfully! Extracted table: {personal_info_df}...'},
#                 {'message': f'Test results table uploaded and processed successfully! Extracted table: {test_results_df}...'}), 200
#         except Exception as e:
#             return jsonify({'error': f'Error processing PDF: {str(e)}'}), 500
#     else:
#         return jsonify({'error': 'Only PDF files are allowed'}), 400


# # Plots for the test results
# @app.route('/figure', methods=['GET'])
# def test_results_plots():



#     # Load the test_results dataframe
#     test_results_df = pd.read_csv(os.path.join(app.config['EXTRACTED_DATA_FOLDER'], "test_results.csv"))
    
#     for i in range(len(reference_df)):  # Loop through rows using iterrows()
#         file_name = reference_df["vitals_short_name"][i]  # File name for the plot
#         mean = reference_df["Mean"][i]
#         variance = reference_df["Variance"][i]
#         std_dev = np.sqrt(variance)
#         user_data_point = test_results_df["Results"][i]
        
#         # Generate 1000 data points
#         data = np.random.normal(mean, std_dev, 1000)  

#         # Create the histogram
#         hist_data = go.Histogram(
#             x=data,
#             nbinsx=30,  # Number of bins in the histogram
#             histnorm='probability density',  # Normalize to show density
#             opacity=0.7,
#             marker=dict(color='rgba(0, 100, 255, 0.5)'),
#         )

#         # Create smoothed normal distribution curve
#         x_vals = np.linspace(mean - 4*std_dev, mean + 4*std_dev, 1000)
#         y_vals = stats.norm.pdf(x_vals, mean, std_dev)

#         smoothed_curve = go.Scatter(
#             x=x_vals,
#             y=y_vals,
#             mode='lines',
#             fill='tozeroy',  # Fill area under the plot with blue color
#             fillcolor='rgba(0, 0, 255, 0.3)',  # Blue with some transparency,
#             name=None,
#             #line=dict(color='red', width=2)
#         )

#         # Add a specific data point on the smoothed curve
#         user_y_val = stats.norm.pdf(user_data_point, mean, std_dev)
#         data_point = go.Scatter(
#             x=[user_data_point],
#             y=[user_y_val],
#             mode='markers',
#             marker=dict(size=10, color='green', symbol='circle'),
#             name='Data point'
#         )

#         # Combine histogram, smoothed curve, and data point
#         fig = go.Figure(data=[
#             hist_data,
#             smoothed_curve,
#             data_point
#             ])

#         # Custom layout
#         fig.update_layout(
#             title=None,  # Use row for title dynamically
#             xaxis_title=reference_df["Vitals"][i],
#             yaxis_title="Density",
#             bargap=0.2,  # Spacing between bars in the histogram
#             plot_bgcolor='rgba(0, 0, 0, 0)', 
#             paper_bgcolor='rgba(0, 0, 0, 0)', 
#             xaxis=dict(showgrid=False),  
#             yaxis=dict(showgrid=False, showticklabels=False),
#             showlegend=False  # Remove the legend
#         )

#         # Save plot as html locally
#         fig.write_html(os.path.join(app.config['PLOTLY_OUTPUT_FOLDER'], "".join([file_name, ".hmtl"])))

#     config = {'displayModeBar': False}

#     plot_html = fig.to_html(full_html=False, config=config)
        
#     return jsonify({'plot': plot_html})


if __name__ == "__main__":
    app.run(debug=True)