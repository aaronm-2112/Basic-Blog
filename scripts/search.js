//cache of the next blog results and the previous blog results
var nextResults = [];
var previousResults = [];

//TODO 3: Refine search by adding pagination to front end and back end if necessary(e.g., if we show 15 results we do not need to collect all 1000 matching blogs for the user) [WIP]
//script that searches by the client's keywords and returns a set of results
async function search(evt) {
  //clear the cache
  nextResults = [];
  previousResults = [];

  let blog = [];

  //get the button that created the event
  let button = evt.target;

  //determine if the search or next buttons were clicked
  if (button === document.getElementById("search")) {
    //clear any previous results
    clearResults();
    //get the search results
    blogs = await getNextResults()
  } else if (button === document.getElementById("next")) {
    //get the search results
    blogs = await getNextResults();
  } else {
    blogs = await getPrevResults();
  }


  //clear any previous results
  clearResults();

  //Display the new search results if any exist and the next and previous buttons
  display(blogs);


}

//get the next set of blog results
async function getNextResults() {
  try {
    //get the search query
    let value = document.getElementById("query").value;


    //get the checkbox values
    let authorCheckbox = document.getElementById("author");
    let categoryCheckbox = document.getElementById("title");

    let authorCheck = authorCheckbox.checked;
    let categoryCheck = categoryCheckbox.checked;

    //set the keyset pagination key --blogid is our keyset pagination key
    let blogid;

    //get the seach results div
    let div = document.getElementById("search-results");

    //check if the search results div is empty
    if (div.childElementCount === 0) {
      console.log("0 elems");
      //set the pagination key to 0 
      blogid = 0;
    } else { //else set the pagination key to the last result's blogid value
      //grab the last search result -- this should be an anchor tag
      let lastResult = div.lastChild;
      console.log(lastResult);
      //extract the anchor url from the last search result
      let lastResultUrl = lastResult.href;
      console.log(lastResultUrl);
      //trim the edit value
      lastResultUrl = lastResultUrl.slice(0, lastResultUrl.lastIndexOf('/'));
      //extract the blogid
      blogid = lastResultUrl.slice(lastResultUrl.lastIndexOf('/') + 1);
      console.log(blogid);
    }

    //set the query parameter value 
    let param;
    if (authorCheck && categoryCheck) {
      return;
    } else if (authorCheck) {
      param = "username";
    } else {
      param = "title";
    }

    let blogs = [];

    //check if there are any cached results for the next set of blog results
    if (nextResults.length === 0) {
      //send query request to the blog controller
      let response = await fetch(`http://localhost:3000/blog?param=${param}&value=${value}&key=${blogid}&keyCondition=>`, {
        method: 'GET', headers: { 'Content-Type': 'application/json' }
      });

      blogs = await response.json();
    } else {
      //set blogs as the cahced results
      blogs = nextResults;
      nextResults = [];
    }

    return blogs;
  } catch (e) {
    console.log(e);
  }
}

//get the previous set of blog results
async function getPrevResults() {
  try {
    //get the search query
    let value = document.getElementById("query").value;


    //get the checkbox values
    let authorCheckbox = document.getElementById("author");
    let categoryCheckbox = document.getElementById("title");

    let authorCheck = authorCheckbox.checked;
    let categoryCheck = categoryCheckbox.checked;

    //set the keyset pagination key --blogid is our keyset pagination key
    let blogid;

    //get the seach results div
    let div = document.getElementById("search-results");

    //check if the search results div is empty
    if (div.childElementCount === 0) {
      console.log("0 elems");
      //set the pagination key to 0 
      blogid = 0;
    } else { //else set the pagination key to the first result's url blogid value
      //grab the first search result anchor tag -- this contains the blogid
      let firstResult = div.firstChild.nextSibling.nextSibling;
      console.log(firstResult);
      //extract the anchor url from the last search result
      firstResult = firstResult.href;
      console.log(firstResult);
      //trim the edit value
      firstResult = firstResult.slice(0, firstResult.lastIndexOf('/'));
      //extract the blogid
      blogid = firstResult.slice(firstResult.lastIndexOf('/') + 1);
      console.log(blogid);
    }

    //set the query parameter value 
    let param;
    if (authorCheck && categoryCheck) {
      return;
    } else if (authorCheck) {
      param = "username";
    } else {
      param = "title";
    }

    let blogs = [];

    //check if there are any cached results for the next set of blog results
    if (previousResults.length === 0) {
      //send query request to the blog controller
      let response = await fetch(`http://localhost:3000/blog?param=${param}&value=${value}&key=${blogid}&keyCondition=<`, {
        method: 'GET', headers: { 'Content-Type': 'application/json' }
      });

      blogs = await response.json();
    } else {
      //set blogs as the cahced results
      blogs = previousResults;
      previousResults = [];
    }

    return blogs;
  } catch (e) {
    console.log(e);
  }
}

function clearResults() {
  //get the search-result DOM element
  let searchResultsDiv = document.getElementById("search-results");

  //remove the first result until their are no more results remaining
  while (searchResultsDiv.firstChild) {
    searchResultsDiv.removeChild(searchResultsDiv.firstChild);
  }
}

async function display(blogs) {
  //place blog results into the search-results div
  let title;
  let username;
  let blogurl;
  //get the seach results div
  let div = document.getElementById("search-results");
  for (let i = 0; i < blogs.length; i++) {
    //set title 
    title = blogs[i].title;
    //set the username
    username = blogs[i].username;
    //construct the path to the blog  -- blogID and if editing or not
    blogurl = `http://localhost:3000/blog/${blogs[i].blogid}/false`;

    //create the title DOM element
    let DOMTitle = document.createElement('p');
    DOMTitle.innerText = title;
    console.log(DOMTitle);

    //create the username DOM element
    let DOMUsername = document.createElement('p');
    DOMUsername.innerText = username;

    //create anchor
    let DOMLink = document.createElement('a');
    DOMLink.href = blogurl;
    DOMLink.innerText = "Blog"

    //append results to the search-results div
    div.appendChild(DOMTitle);
    div.appendChild(DOMUsername);
    div.appendChild(DOMLink);

  }

  //display appropriate navigation buttons  
  await showNavButtons();


}


//display the next and previous buttons that are appropriate and manage result cache
async function showNavButtons() {
  //Check if there is a set of previous results -- these can be cached blogs 
  //If so then display a previous button
  let blogs = await getPrevResults()
  //check if any blog results were returned
  if (blogs.length) {
    //display the next button
    let prev = document.getElementById("prev");
    prev.style.display = "inline";
    //set the cache
    previousResults = blogs;
  } else {//else hide display
    let prev = document.getElementById("prev");
    prev.style.display = "none";
    //empty the cache of next results
    previousResults = [];
  }


  //clear blogs 
  blogs = [];

  //check if there is a set of new results 
  //get the next set of blog results
  blogs = await getNextResults()
  //check if any blog results were returned
  if (blogs.length) {
    //display the next button
    let next = document.getElementById("next");
    next.style.display = "inline";
    //set the cache
    nextResults = blogs;
  } else {//else hide display
    let next = document.getElementById("next");
    next.style.display = "none";
    //empty the cache of next results
    nextResults = [];
  }
}

//search event listsner
document.getElementById("search").addEventListener("click", search);

//Next nav button event listener
document.getElementById("next").addEventListener("click", search);

//Prev nav button event listener
document.getElementById("prev").addEventListener("click", search); 