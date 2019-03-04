function deleteBook(id) {
  let sure = confirm('Are you sure you want to delete this book?');
  if (sure) {
    let req = new XMLHttpRequest();
    req.overrideMimeType('application/json');
    req.open('DELETE', 'localhost:4000/api/books/' + id, true);
    req.onload = () => alert(JSON.parse(req.responseText).message);
    req.send();
  }
  location.reload();
}