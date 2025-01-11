from flask import Flask, render_template, redirect, request, session
from flask_session import Session

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
 
 
@app.route("/login", methods=["POST", "GET"])
def login():
      # if form is submited
    if request.method == "POST":
        # record the user name
        session["name"] = request.form.get("NAME")
        # redirect to the main page hehe
        return redirect("/")
    return render_template("login.html")



@app.route("/")
def index():
      # check if the users exist or not
    if not session.get("name"):
        # if not there in the session then redirect to the login page
        return redirect("/login")
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True,port=5000)
