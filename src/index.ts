import app from "./app"

app.listen(3000, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on 3000`);
});


//createDB().then(() => console.log("Cool"))