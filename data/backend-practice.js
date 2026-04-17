const xhr = new XMLHttpRequest();
xhr.addEventListener("load", () => {
  console.log(JSON.parse(xhr.response));
});
xhr.open("GET", "https://supersimplebackend.dev/products/first");
xhr.send();
