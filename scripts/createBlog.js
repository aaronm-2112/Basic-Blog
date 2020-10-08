const BASE_URL = document.currentScript.getAttribute('base_url')

//upload the blog content to the blog creation route
async function createBlog() {
  try {
    //get the content of the blog 
    let bannerImage = document.getElementById("imageBanner").files[0];

    const imageFormData = new FormData();

    //append the bannerimage
    imageFormData.append("image", bannerImage);

    //create the hero image resource
    let result = await fetch(`${BASE_URL}/uploads`, { method: 'POST', body: imageFormData });

    //get the image path
    let imagePathData = await result.json();

    let imagePath = imagePathData.imagePath;

    //get text content from the blog creation form
    let content = document.getElementById("content").value;
    let title = document.getElementById("title").value;

    //create the blog resource using the text content
    let blogResult = await fetch(`${BASE_URL}/blogs`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, title }) });

    //get the blogID from the request
    let blogData = await blogResult.json();
    let blogID = blogData.blogID;


    //patch the blog at /blog/:blogID with the path to the hero image 
    let patchResult = await fetch(`${BASE_URL}/blogs/${blogID}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titleImagePath: imagePath })
    });

    //check for success status code
    if (patchResult.status === 200) {
      // let string = `/blogs/${blogID}?editPage=false`
      //console.log(string)
      window.location.href = `/blogs/${blogID}?editPage=false`;
    } else {
      console.log("Error creating blog!");
    }



  } catch (e) {
    console.log(e);
  }

}

document.getElementById("btnCreate").addEventListener("click", createBlog);
