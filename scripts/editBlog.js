const BASE_URL = document.currentScript.getAttribute('base_url')

function getBlogID() {
  //get the url 
  let url = window.location.href;

  //extract the blog id
  let slashPos = url.lastIndexOf('/'); // /blog/blogID  ==> /edit
  let urlSlice = url.substring(0, slashPos);

  console.log(urlSlice);

  slashPos = urlSlice.lastIndexOf('/'); // /blog ==> /blogID
  urlSlice = urlSlice.substring(slashPos + 1); // ==> is the value of blogID

  console.log(urlSlice);

  //trim 
  blogID = urlSlice.trim();

  return blogID;
}

//Begin patch function
async function patchContent() {
  try {
    //get blogID
    let blogID = getBlogID();

    //get the input field values
    let content = document.getElementById("content").value;

    //send patch request 
    let response = await fetch(`${BASE_URL}/blog/${blogID}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });


    console.log(response);

    if (response.status !== 204) {
      console.log("Patch not successful!");
    }
  } catch (e) {
    console.log(e);
  }
}

async function patchTitle() {
  try {
    //get blogID
    let blogID = getBlogID();

    //get the input field values
    let title = document.getElementById("title").value;

    console.log(title);

    //send patch request to the /blog/:blogID
    let response = await fetch(`${BASE_URL}/blog/${blogID}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });


    console.log(response);

    if (response.status !== 204) {
      console.log("Patch not successful!");
    }
  } catch (e) {
    console.log(e);
  }
}

async function patchBannerImage() {
  try {
    //get the image content
    let bannerImage = document.getElementById("imageBanner").files[0];

    const imageFormData = new FormData();

    //append the bannerimage
    imageFormData.append("image", bannerImage);

    //post the new image content to the uploads section
    let postResult = await fetch(`${BASE_URL}/uploads`, { method: 'POST', body: imageFormData });

    //get the image path
    let titleImagePath = await postResult.json();

    //get the blog's id
    let blogID = getBlogID();

    //patch the blog with new imagePath
    let response = await fetch(`${BASE_URL}/blog/${blogID}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titleImagePath }) });

  } catch (e) {
    console.log(e);
  }


}

function exit() {
  window.location.pathname = '/profile';
}

//add event listener to the save content button
document.getElementById("SaveContent").addEventListener("click", patchContent);

//add event listener to the save content button
document.getElementById("SaveTitle").addEventListener("click", patchTitle);

//add event listener to the save content button
document.getElementById("SaveBannerImage").addEventListener("click", patchBannerImage);

//add event listener to exit page
document.getElementById("StopEditing").addEventListener("click", exit);
