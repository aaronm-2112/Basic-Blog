const BASE_URL = document.currentScript.getAttribute('base_url')

//blogid global
var blogid;

//gets the blogid fromthe url
const getBlogid = () => {
  let url = document.URL;
  blogid = url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('/') + 2); //
  console.log(blogid)

}

//execute getBlogid when window loads
window.onload = getBlogid;

//Loads all comments and replies -- happens when user clicks next or previous on the top level comment buttons
//has optional pagination parameters: likes = 0, and commentid = 0, flip = "next" used when called from next or prev pagination buttons
//TODO: Find workaround for placing mouseEvent parameter in the parameter list
async function loadAllComments(mouseEvent = 0, likes = 1000, commentid = 1000, flip = "next") {
  try {
    //clear the comments if any exist
    clearTopLevelComments();

    //retrieve the blog's top level comments, if they exist
    let response = await fetch(`${BASE_URL}/comments?blog=${blogid}&reply=false&replyto=0&orderby=likes&likes=${likes}&commentid=${commentid}&flip=${flip}`, {
      method: 'GET', headers: { 'Content-Type': 'application/json' }
    });

    //grab the comment data out of the response and store them in a top level comment collection
    let topLevelComments = [];
    topLevelComments = await response.json();

    console.log(topLevelComments)

    let bid = blogid.toString();
    let cid = 0;

    //create a key value collection of the comments' replies
    let topLevelCommentReplies = {};
    //traverse the top level comments collection

    for (let i = 0; i < topLevelComments.length; i++) {

      cid = topLevelComments[i].commentid.toString();
      console.log(cid)

      //-----use the commentid as replyto of the current top level comment to fetch that comment's replies ordered by date
      let res =
        await fetch(`${BASE_URL}/comments?blog=${blogid}&reply=true&replyto=${cid}&orderby=date&likes=0&commentid=${cid}&flip=next`, {
          method: 'GET', headers: { 'Content-Type': 'application/json' }
        });
      //-----grab the replies out of the server response and load them into the key value reply collection
      let commentReplies = await res.json();
      console.log(commentReplies)
      //-----create a comment and return the HTML reply section created for it --this houses all replies to the comment
      let replySection = displayComment(topLevelComments[i]);
      //-----traverse through the replies for that top level comment
      for (let j = 0; j < commentReplies.length; j++) {
        displayReply(commentReplies[j], replySection, topLevelComments[i].commentid);
      }
    }

    //check if pagination buttons are present
    if (document.querySelector('#btn-top-level-next') === null) {
      //add the pagination buttons for the top level comments
      let btnNext = document.createElement('button');
      btnNext.setAttribute("id", "btn-top-level-next");
      btnNext.textContent = "Next";
      let btnPrev = document.createElement('button');
      btnPrev.textContent = "Previous";
      btnPrev.setAttribute("id", "btn-top-level-prev");

      //add the buttons
      let commentSection = document.getElementById('comments-section');

      commentSection.appendChild(btnPrev);
      commentSection.appendChild(btnNext);
    }


  } catch (e) {
    console.log(e);
  }
}


//removes all top level comments and their replies from the page
function clearTopLevelComments() {
  //check if any top level comments exist
  let comments = document.querySelectorAll('.top-level-comment');
  if (comments.length) {
    //----if so traverse the comments in reverse order
    for (let i = comments.length - 1; i >= 0; i--) {
      //-------clear each comment from the DOM
      comments[i].remove();
    }
  } //else return
}

//paginate through the replies for a particular top level comment
//TODO: Add code to make grabbing the first and last reply safe
async function paginateReplies(topLevelCommentid, flip) {
  try {

    //get the reply section we want to paginate to new replies within
    let topLevelCommentSection = document.getElementById(topLevelCommentid);
    let topLevelSectionChildren = topLevelCommentSection.children;
    let replySection = topLevelSectionChildren[4].children;

    let replyid = "adsads";

    //check if flip value is next
    if (flip === 'next') {
      //if so get the last reply's commentid  by traversing to the last element in the reply section
      for (let i = 0; i < replySection.length; i++) { //pagination-div
        if (i == replySection.length - 1 && replySection[i].id != "pagination-div") {
          replyid = replySection[i].id;
          replyid = replyid.slice(replyid.lastIndexOf('-') + 1);
        }
      }
    } else { //user wants the previous pages results
      //------get the first reply's commentid
      //traverse the replysection
      for (let i = 0; i < replySection.length; i++) { //pagination-div
        //check if the element has an id
        if (replySection[i].hasAttribute('id')) {
          //check if the element's id is reply-section-comment
          if (replySection[i].id.includes("reply-section-comment")) {
            //set the id as the replyid 
            replyid = replySection[i].id;
            replyid = replyid.slice(replyid.lastIndexOf('-') + 1);
            break;
          }
        }
      }
    }

    //query all the replies in the reply section
    let replies = document.getElementsByClassName(`reply-section-comment-${topLevelCommentid}`);
    let i = replies.length - 1;
    //traverse the replies and remove them from the DOM -- need to go in reverse b/c the size of the list decreases as elements are removed
    while (i >= 0) {
      replies[i].remove();
      i--;
    }

    //fetch the next/previous 10 replies
    let response = await fetch(`${BASE_URL}/comments?blog=${blogid}&reply=true&replyto=${topLevelCommentid}&orderby=date&likes=0&commentid=${replyid}&flip=${flip}`, {
      method: 'GET', headers: { 'Content-Type': 'application/json' }
    });

    //parse the response and place the replies into a collection
    let newReplies = await response.json();

    //update reply section to an htmlCollection 
    replySection = topLevelSectionChildren[4]

    //traverse the collection 
    newReplies.forEach(reply => {
      //place each reply into the reply section
      displayReply(reply, replySection, topLevelCommentid);
    })

    //determine which pagination buttons to hide/unhide

  } catch (e) {
    console.log(e);
  }
}

//Creates a new top level comment(not a reply) in the blog's comment section
//TODO: Finish
async function createTopLevelComment() {
  try {
    //grab the user's top level comment content 
    let content = document.getElementById('user-top-level-comment-content').value;

    //set the reply value
    let reply = false;

    //set the replyto value
    let replyto = 0;

    //send the comment data to the server
    let res = await fetch(`${BASE_URL}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, reply, replyto, blogid }) });

    //check if successful comment creation
    if (res.status !== 201) {
      return;
    }

    //retrieve commentid
    let commentData = await res.json();

    let cid = commentData.commentid;


    //retrieve the comment the user created
    res = await fetch(`${BASE_URL}/comments/${cid}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

    let comment = await res.json();

    //display the user's comment at the botom of the comment section
    displayComment(comment);
  } catch (e) {
    console.log(e);
  }
}


//create an HTML element that displays a comment onto the screen
function displayComment(comment) {
  //create a div with class top level comment
  let div = document.createElement('div');
  div.setAttribute("class", 'top-level-comment');
  //set a unique id that matches with the add reply button
  div.setAttribute('id', `${comment.commentid}`);
  div.setAttribute("style", "border: 1px solid");

  //create a pragraph for the username of the comment
  let uname = document.createElement('p');
  uname.textContent = comment.username;

  //create a paragraph for the date of the comment
  let date = document.createElement('p');
  date.textContent = comment.created;

  //create a paragraph for the content of the comment
  let content = document.createElement('p');
  content.textContent = comment.content;

  //create the likes
  let likes = document.createElement('p');
  likes.setAttribute("class", 'likes');
  likes.setAttribute("id", `likes-${comment.commentid}`);
  likes.textContent = `Likes: ${comment.likes}`;

  //create a reply section for the comment
  let replySection = document.createElement('div');
  replySection.setAttribute('class', 'reply-section');
  replySection.setAttribute("style", "position: relative; left: 30px;");

  //create a reply textarea
  let replyTextArea = document.createElement('textarea');
  replyTextArea.setAttribute("class", "reply");
  replyTextArea.addEventListener("input", (e) => {
    replyTextArea.textContent = e.target.value;
  });

  //create a button that allows a user to add replies to the comment
  let btn = document.createElement('button');
  btn.textContent = "Reply";
  btn.setAttribute('id', `add-reply-${comment.commentid}`);


  //place the elements inside the comment div
  div.appendChild(uname);
  div.appendChild(date);
  div.appendChild(content);
  div.appendChild(likes);
  div.appendChild(replySection);

  //add the reply box to the reply section
  replySection.appendChild(replyTextArea);
  replySection.appendChild(btn);

  //create the buttons that allow users to paginate through the replies
  let paginationDiv = document.createElement('div');
  paginationDiv.setAttribute("class", "pagination-div");

  let btnNext = document.createElement('button');
  //set the ids using the unique top level comment id --will be used to identify which replies to get next when the click event bubbles up
  btnNext.setAttribute('id', `$btn-replies-next-${comment.commentid}`);
  btnNext.value = "Next";
  btnNext.textContent = "Next";
  let btnPrev = document.createElement('button');
  btnPrev.setAttribute('id', `$btn-replies-prev-${comment.commentid}`);
  btnPrev.value = "Previous";
  btnPrev.textContent = "Previous";

  //add the buttons to the pagination div
  paginationDiv.appendChild(btnPrev);
  paginationDiv.appendChild(btnNext);

  //append the btns into the replySection
  replySection.appendChild(paginationDiv);

  //append the div into the comments section
  let commentSection = document.getElementById('comments-section');

  commentSection.appendChild(div);

  //return the reply section
  return replySection;
}


//display the reply given comment data and a replysection
//TODO: Test when adding a new reply!
function displayReply(comment = {}, replySection = {}, replyto) {
  console.log(replyto);
  //----------create an html object 
  let div = document.createElement('div');
  div.setAttribute("class", `reply-section-comment-${replyto}`);
  div.setAttribute('style', "border: solid 1px; ");
  div.setAttribute('id', `reply-section-comment-${comment.commentid}`);
  //----------fill the html object wtih the reply values 
  let date = document.createElement('p');
  date.textContent = comment.created;
  let username = document.createElement('p');
  username.textContent = comment.username;
  let content = document.createElement('p');
  content.textContent = comment.content;
  //----------place the html object as a child of its top level comment's reply section
  div.appendChild(date);
  div.appendChild(username);
  div.appendChild(content);

  //append the reply to the replysection
  replySection.appendChild(div);
}

//event so that the users can create comments  
document.getElementById('post-comment').addEventListener('click', createTopLevelComment);

//activate the click for gathering all comments and displaying them on the screen
document.getElementById('comment').addEventListener("click", loadAllComments);

//event delegation that catches when a user creates a comment reply, wants to cycle through replies, or top level comments
document.addEventListener('click', async function (e) {
  try {
    if (e.target && e.target.id.includes('add-reply')) { //user wants to create reply
      //identify which comment the reply belongs to 
      let commentid = e.target.id.slice(e.target.id.lastIndexOf('-') + 1); //because replies ids are: add-reply-commentid and comment section ids are: id: commentid

      //grab the top-level-comment html element with the same commentid -- this is where the reply is nested
      let topLevelCommentSection = document.getElementById(commentid);

      //extract the reply section html element from the top level comment section
      let topLevelSectionChildren = topLevelCommentSection.children;

      let replySection = topLevelSectionChildren[4];
      console.log(replySection);

      //add the reply to the database
      let reply = true;
      let replyto = commentid;
      let content = replySection.firstChild.value;

      let res = await fetch(`${BASE_URL}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, reply, replyto, blogid }) });

      //get the repliy's cid
      let commentData = await res.json();

      let cid = commentData.commentid;

      //fetch the new reply data and display it at the bottom of the reply section it belongs to
      res = await fetch(`${BASE_URL}/comments/${cid}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

      //extract the comment from the json response
      let userReply = await res.json();

      //display the comment at the bottom of the reply section
      displayReply(userReply, replySection, commentid);


    } else if (e.target && e.target.id.includes('btn-replies')) {
      //identify which top level comment the replies to paginate through belong to
      let commentid = e.target.id.slice(e.target.id.lastIndexOf('-') + 1);

      //determine if page flip is "next" or "previous" are the id names btn-replies-next|| btn-replies-prev 
      let flip;
      e.target.id.includes("next") ? flip = "next" : flip = "prev";

      //paginate
      paginateReplies(commentid, flip);


    } else if (e.target && e.target.id.includes('btn-top-level')) {//activates when user clicks top level comment pagination btns
      //extract the final text from the target id
      let flip = e.target.id.slice(e.target.id.lastIndexOf('-') + 1);

      //get the top level comments
      let topLevelComments = document.querySelectorAll('.top-level-comment');
      console.log(topLevelComments);

      //likes and commentid
      let likes;
      let commentid;

      //check if the final text is next
      if (flip === "next") {
        //get the last comment
        let lastComment = topLevelComments[topLevelComments.length - 1];

        //set the commentid variable to the last comment's value
        commentid = lastComment.id;

        //get the last comment's elements
        let lastCommentElements = lastComment.childNodes;

        //traverse the elements
        lastCommentElements.forEach(element => {
          //check if the element's className is likes
          if (element.className == 'likes') {
            //if so set the likes variable to the last comment's value
            let likesElement = element.innerText;
            likes = likesElement.slice(likesElement.lastIndexOf(':') + 2);
          }
        });
      } else {
        //get the first comment
        let firstComment = topLevelComments[0];

        let firstCommentElements = firstComment.childNodes;

        firstCommentElements.forEach(element => {
          if (element.className == 'likes') {
            //if so set the likes variable to the first comment's value
            let likesElement = element.innerText;
            likes = likesElement.slice(likesElement.lastIndexOf(':') + 2);
          }
        });

        //------set the commentid variable to the first comment's value
        commentid = firstComment.id;
      }

      //call loadAllComments(mouseEvent, likes, commentid, flip)
      loadAllComments("", likes, commentid, flip);


    } else if (e.target && e.target.id.includes('likes')) {
      //get the top level commentid from the like id
      let cid = e.target.id.slice(e.target.id.lastIndexOf('-') + 1);

      //increase the displayed likes for this comment by one
      let likesElement = e.target.innerText;
      let likes = parseInt(likesElement.slice(likesElement.lastIndexOf(':') + 2));


      //update the comment's data
      let res = await fetch(`${BASE_URL}/comments/${cid}`,
        {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ like: true })
        });

      if (res.status != 200) {
        console.log("Error updating");
        return;
      }

      //update the like display
      e.target.innerText = `Likes: ${likes += 1}`;
    }
  } catch (err) {
    console.log(err);
  }
});
