const BASE_URL = document.currentScript.getAttribute('base_url')

//add update event to update button 
document.getElementById("update").addEventListener("click", updateUserInformation);

//request user information get updated
async function updateUserInformation() {
  //define uri
  let uri = `${BASE_URL}/users`;

  //get user information 
  let firstName = document.getElementById("fname").value;
  let lastName = document.getElementById("lname").value;
  let bio = document.getElementById("bio").value;

  //package data
  let data = {
    firstName,
    lastName,
    bio
  };

  try {
    //TODO: Make patch request
    //Update the user resource with the fname, lname, and bio information
    let response = await fetch(uri, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

    //check if response is successful 
    if (response.status !== 200) {
      console.log("Data not uploaded!");
      return;
    }

    //create a form data for uploading profile picture
    const imageProfileForm = new FormData();

    //get the image content
    let bannerImage = document.getElementById("imageProfile").files[0];

    //add image content to the form data object
    imageProfileForm.append("image", bannerImage);

    //upload the profile image
    let uploadRes = await fetch(`${BASE_URL}/uploads`, { method: "POST", body: imageProfileForm });

    console.log(uploadRes);

    //check if upload was not successful
    if (uploadRes.status !== 201) {
      //if not return 
      console.log("Image not uploaded!");
      return;
    }

    //get the path data 
    let imageJSON = await uploadRes.json();

    let imagePath = imageJSON.imagePath;

    console.log(imagePath);

    //patch the user with the new profile pic data
    let imagePathPatchRes = await fetch(`${BASE_URL}/users`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profilePicturePath: imagePath }) });

    //change location to profile
    // window.location.href = "/users/First User?profile=true";
  } catch (e) {
    console.error(e);
  }
}