//upload the blog content to the blog creation route
async function createBlog() {
  try {
    //get the content of the blog 
    let bannerImage = document.getElementById("imageBanner").files[0];

    const imageFormData = new FormData();

    //append the bannerimage
    imageFormData.append("image", bannerImage);

    //create the hero image resource
    let result = await fetch('http://localhost:3000/uploads', { method: 'POST', body: imageFormData });

    console.log(result);

    //get the image path
    let imagePath = await result.json();

    console.log(imagePath);

    //get text content from the blog creation form
    let content = document.getElementById("content").value;
    let title = document.getElementById("title").value;

    console.log("Upload the blog content");

    //create the blog resource using the text content
    let blogResult = await fetch(`http://localhost:3000/blogs`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, title }) });

    console.log(blogResult);

    //get the blogID from the request
    let blogID = await blogResult.json();

    //patch the blog at /blog/:blogID with the path to the hero image 
    let patchResult = await fetch(`http://localhost:3000/blogs/${blogID}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titleImagePath: imagePath })
    });

    //check for success status code
    if (patchResult.status === 204) {
      console.log("Blog created!");
      window.location.pathname = `/blogs/${blogID}/false`;
    } else {
      console.log("Error creating blog!");
    }



  } catch (e) {
    console.log(e);
  }

}

document.getElementById("btnCreate").addEventListener("click", createBlog);
