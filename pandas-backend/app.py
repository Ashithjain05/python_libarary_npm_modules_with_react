from flask import Flask, request, jsonify
from flask_cors import CORS
from my_pandas_ops.operations import run_operation

app = Flask(__name__)
CORS(app)

@app.route("/calculate", methods=["POST"])
def calculate():
    payload = request.get_json(force=True)
    numbers = payload.get("numbers", [])
    operation = payload.get("operation", "")
    params = payload.get("params", {})  # for scalars like k

    try:
        result = run_operation(numbers, operation, **params)
        return jsonify({"operation": operation, "numbers": numbers, "params": params, "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5000, debug=True)
