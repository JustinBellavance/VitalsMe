from flask import Flask, jsonify, request, render_template
import pdfplumber
import pandas as pd
import os
import plotly.io as pio
import plotly.graph_objects as go
import scipy.stats as stats
import numpy as np
import re
import json

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

app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

app.config['EXTRACTED_DATA_FOLDER'] = 'uploads/temporary_csv'
os.makedirs(app.config['EXTRACTED_DATA_FOLDER'], exist_ok=True)

# Load the reference dataframe
reference_df = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'], "reference_data.csv"))
global reference_df_text
reference_df_text = reference_df.to_string(index=False)

# @app.route("/")
# def test_html():
#     return render_template("test.html")

def get_ai_response(personal_info_df, test_results_df):
    personal_info_text = personal_info_df.drop(0).to_string(index=False) # drop the name!
    test_results_text = test_results_df.to_string(index=False)
    
    user_prompt = "Give me an extremly brief analysis of my results, highlighting only the most important findings."

    # Prepare system message with extracted data
    system_message = (
        "You are a highly experienced and empathetic medical doctor. "
        "You analyze patient test results and provide medical advice in a compassionate manner. "
        "Here's the patient's personal information:\n"
        f"{personal_info_text}\n\n"
        "Here are the patient's test results:\n"
        f"{test_results_text}\n\n"
        "Please respond to the user's query with this context in mind."
    )

    # Construct messages for OpenAI API
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_prompt}
    ]

    # Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=500,
        temperature=0.7
    )

    # Extract AI response
    ai_response = response.choices[0].message.content
    return ai_response


# @app.route('/test_ai', methods=['POST'])
# def test_ai():
#     if request.method == 'POST':
#         # Check for file upload
#         if 'pdfFile' not in request.files:
#             return jsonify({'error': 'No file uploaded'}), 400

#         file = request.files['pdfFile']
        
#         # Save uploaded PDF file
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
#         file.save(file_path)

#         # Extract data from the PDF
#         try:
#             with pdfplumber.open(file_path) as pdf:
#                 p0 = pdf.pages[0]
#                 tables = p0.extract_tables()

#                 # Assume the first two tables are personal info and test results
#                 personal_info = tables[0]
#                 test_results = tables[1]

#                 # Convert tables to DataFrames
#                 personal_info_df = pd.DataFrame(personal_info[1:], columns=personal_info[0])
#                 test_results_df = pd.DataFrame(test_results[1:], columns=test_results[0])

#                 # Convert DataFrames to text for context
#                 personal_info_text = personal_info_df.to_string(index=False)
#                 test_results_text = test_results_df.to_string(index=False)
#         except Exception as e:
#             return jsonify({'error': f"Error processing PDF: {str(e)}"}), 500

#         #user_prompt = "Give me an extremly brief analysis of my results, highlighting only the most important findings."

#         # Get user prompt
#         if (request.form['prompt']):
#             user_prompt = request.form['prompt']

#         try:
#             # Prepare system message with extracted data
#             system_message = (
#                 "You are a highly experienced and empathetic medical doctor. "
#                 "You analyze patient test results and provide medical advice in a compassionate manner. "
#                 "Here's the patient's personal information:\n"
#                 f"{personal_info_text}\n\n"
#                 "Here are the patient's test results:\n"
#                 f"{test_results_text}\n\n"
#                 "Please respond to the user's query with this context in mind."
#             )

#             # Construct messages for OpenAI API
#             messages = [
#                 {"role": "system", "content": system_message},
#                 {"role": "user", "content": user_prompt}
#             ]

#             # Call OpenAI API
#             response = client.chat.completions.create(
#                 model="gpt-4o-mini",
#                 messages=messages,
#                 max_tokens=500,
#                 temperature=0.7
#             )

#             # Extract AI response
#             ai_response = response.choices[0].message.content
#             return jsonify({'ai_response': ai_response})

#         except Exception as e:
#             return jsonify({'error': f"Error generating AI response: {str(e)}"}), 500

#     return render_template('test_ai.html')

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

        # Convert to JSON
        results_json = test_results_df.to_json(orient='records')
        print(results_json)
        
    print(f"personal info : {personal_info}")

    ai_response = get_ai_response(personal_info_df, test_results_df)
    
    # Load all figures generated for each biomarker    
    all_figures = create_and_display_plots(reference_df,test_results_df,bad_results_first=True)
    
    final_result = {
        'ai_response' : ai_response,
        'personal_info' : personal_info,
        'all_figures' : all_figures,
        'user_results': test_results
    }

    

    return jsonify(final_result) 

if __name__ == "__main__":
    
    app.run(debug=True)