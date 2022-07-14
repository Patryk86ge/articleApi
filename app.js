const counterApp = document.querySelector(".counter_app");
const divApp = document.querySelector("#app");
const btn = document.querySelector("button");
const sortByTitle = document.querySelector(".sortByTitle");
const sorBtyData = document.querySelector(".sorBtyData");
const count = 200;
let limit = 15;

Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
}
NodeList.prototype = HTMLCollection.prototype = function () {
  for (let i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}

async function btnFavorite(elId) {
  let addFavorite = document.querySelector(".box__addFavorite");
  //let el = document.getElementById((elId));
  let res = await fetch(`https://api.spaceflightnewsapi.net/v3/articles?id=${elId}`);
  let el = (await res.json())[0];
  addFavorite.innerHTML += `<div id=${el.id} class="container__box">
         <div class="img__box">
         <img src="${el.imageUrl}" alt="el.imageUrl">
         </div>
          <p>Id w : ${el.id}</p>
         <h1>Tytuł : ${el.title}</h1>
         <p>Wiadomościami : ${el.newsSite}</p>
         <p>Opublikowany w : ${el.publishedAt}</p>
         <p>Streszczenie : ${(el.summary.slice(0, 200) + (el.summary.length > 200 ? '...' : ''))}</p>
         <a href="${el.url}">Link do artykulu</a>
          <button onclick="document.getElementById(${el.id}).remove();" class="btn__addRemove">x</button>
         </div>`;
}


async function dataArticles(query) {
  counterApp.innerHTML = "15";
  divApp.innerHTML = 'Loading...';
  let res;
  if (query) {
    res = await fetch(`https://api.spaceflightnewsapi.net/v3/articles?_limit=${query}`);
  } else {
    res = await fetch(`https://api.spaceflightnewsapi.net/v3/articles?_limit=${limit}`);
  }

  let result = await res.json();
  if (sortByTitle) {
    sortByTitle.addEventListener('click', (e) => {
      result = result.sort(function (a, b) {
        return (a.title).localeCompare(b.title);
      })
      renderArcicles(result);

      console.log("sortByTitle");
    })
  }
  if (sorBtyData) {
    sorBtyData.addEventListener('click', (e) => {
      result = result.sort(function (a, b) {
        return ('' + a.publishedAt).localeCompare(b.publishedAt);
      })
      renderArcicles(result);
      console.log("sorBtyData");
    })
  }
  renderArcicles(result);
}

function renderArcicles(result) {
  console.log(result);
  divApp.innerHTML = '';
  result.map((el) => {

    divApp.innerHTML += `<div id=${el.id} class="container__box">
         <div class="img__box">
         <img src="${el.imageUrl}" alt="el.imageUrl">
         </div>
          <p>Id w : ${el.id}</p>
         <h1>Tytuł : ${el.title}</h1>
         <p>Wiadomościami : ${el.newsSite}</p>
         <p>Opublikowany w : ${el.publishedAt}</p>
         <p>Streszczenie : ${(el.summary.slice(0, count) + (el.summary.length > count ? '...' : ''))}</p>
         <a href="${el.url}">Link do artykulu</a>
         <button onclick="btnFavorite(${el.id})" class="btn__addFavorite">Dodaj</button>
         </div>`;
  });
}

dataArticles();

btn.addEventListener('click', (e) => {
  let input = document.querySelector("input").value.trim();
  if (input.value === 0) {
    return false;
  } else {
    dataArticles(input);
    counterApp.innerHTML = input;
  }
})

window.addEventListener("scroll", () => {
  const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight) {
    limit += 15;
    dataArticles();
    counterApp.innerHTML = "15" + "/" + limit;
  }
})







