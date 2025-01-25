from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

incomes = [
    { 'description': 'salary', 'amount': 5000 }
]

@app.route("/")
def test_html():
    return render_template("test.html")

@app.route('/incomes')
def get_incomes():
    return jsonify(incomes)


@app.route('/upload', methods=['POST'])
def upload_pdf():
    incomes.append(request.get_json())
    return '', 200


if __name__ == "__main__":
    app.run(debug=True)