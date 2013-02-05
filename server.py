from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
  return "Hello World!"

@app.route('/post_something', methods=['POST'])
def post():
  return "post successful!"

if __name__ == "__main__":
  app.run('localhost', 3000)
