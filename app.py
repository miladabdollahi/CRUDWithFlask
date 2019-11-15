from flask import Flask, request ,render_template
from sqlalchemy import create_engine ,inspect
engine = create_engine('postgresql://g2:g2@172.18.17.83:5432/g2', echo = True)
inspector = inspect(engine)
app = Flask(__name__)

@app.route("/")
def home():
    schemas_names = inspector.get_table_names()
    print(schemas_names)
    return render_template('home.html', table_names = schemas_names)

@app.route("/tables/<name>")
def table(name):
    head_table = inspector.get_columns(name)
    table = {}
    table["title"] = "جدول {}".format(name)
    connect = engine.connect()
    query =  "select * from \"{}\" ".format(name)
    list = connect.execute(query)
    connect.close()
    return render_template('show_table.html',head_table = head_table , body_table = list , name_table = table)

@app.route("/details")
def get_book_details():
    author=request.args.get('author')
    published=request.args.get('published')
    return "Author : {}, Published: {}".format(author,published)

if __name__ == '__main__':
    app.run()