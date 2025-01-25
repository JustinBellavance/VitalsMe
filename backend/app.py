from flask import Flask, jsonify, request, render_template

import pdfplumber
import os

from utils import create_distribution

app = Flask(__name__)

# Set the folder where the files will be uploaded
app.config['UPLOAD_FOLDER'] = './uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route("/")
def test_html():
    return render_template("test.html")


@app.route('/figure')
def get_figure():
    
    plot_html = create_distribution()
    return jsonify({'plot': plot_html})


@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'pdfFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['pdfFile']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.pdf'):
        # Create the full file path
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        
        # Save the file to the specified location
        file.save(file_path)
        
        # Now, use pdfplumber to extract text from the saved PDF
        try:
            with pdfplumber.open(file_path) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text()

                return jsonify({'message': f'File uploaded and processed successfully! Extracted text: {text[:500]}...'}), 200
        except Exception as e:
            return jsonify({'error': f'Error processing PDF: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Only PDF files are allowed'}), 400


if __name__ == "__main__":
    app.run(debug=True)