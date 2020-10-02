/*TODO : 
  1- fetch the topics list, // 4- sort goes here
  2- create function to display the lists, 
  3- creat a function to add topis via form
  4- listen for upvoted and downvoted
*/
// const window = document.querySelector(".container");
const listONextTopic = document.querySelector(".next-topic");
const listOfPastopic = document.querySelector(".past-topic");
const formEl = document.querySelector("form");
const endPoint = "https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json";

//state
let listOfTopics = [];

async function fecthTopics () {
  const res = await fetch(`${endPoint}`);
  const data = await res.json();
  listOfTopics = [...data];
  displayListTopics(listOfTopics);
  initToLocalStprage();
  // window.dispatchEvent( new CustomEvent(listOfTopicsUpdated));
  return data;
};

function displayListTopics (listOfTopics) {
  const undiscussedTopic = listOfTopics.filter(topic => !topic.discussedOn);
  //create html form the list
  const sortedList = undiscussedTopic.sort(function(a, b) {
    const aUpvotes = a.upvotes;
    const aDownvotes = a.downvotes;
    const aRatioVotes = aUpvotes - aDownvotes;
    const bUpvotes = b.upvotes;
    const bDownvotes = b.downvotes;
    const bRationVotes = bUpvotes - bDownvotes;
    return bRationVotes - aRatioVotes;
  });
  const html = sortedList.map(topic => {
    return `
    <div class="row my-4 bg-light p-4 rounded">
      <div class="col">
        <span>${topic.title}</span>
        <div class="d-block">
          <button type="button" class="upvotes" data-id="${topic.id}">
            <span>upvotes</span>
            ${topic.upvotes}</button>
          <button type="button" class="downvotes" data-id="${topic.id}">
            <span>downvotes</span> ${topic.downvotes}
          </button>
        </div>
      </div>
      <div>
        <button 
          class="archive" data-id="${topic.id}">
          <span>archive</span>
        </button>
      </div>
    </div>
    `
  }).join("");
  listONextTopic.innerHTML = html;
  const discussedTopics = listOfTopics.filter(topic => topic.discussedOn);
  const htmlDiscussed = discussedTopics.map(topic => {
    const date = topic.discussedOn;
    return `
    <div class="row my-4 bg-light p-4 rounded">
      <div class="col">
        <span>${topic.title}</span>
        <div class="d-block">
          Discussed on ${topic.discussedOn}
        </div>
      </div>
      <div>
        <button class="delete t" data-id="${topic.id}"><span>delete</span></button>
      </div>
    </div>
    `
  }).join("");
  listOfPastopic.innerHTML = htmlDiscussed;
}

function addList (e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (form.topics.value === "") return;
  //create a new obj for the new topics
  const newTopic = {
    id: Date.now(),
		upvotes : 0,
		title : form.topics.value,
		downvotes : 0,
		discussedOn : "",
  };
  // push the new topic to list of topics arr
  listOfTopics.push(newTopic);
  // window.dispatchEvent( new CustomEvent(listOfTopicsUpdated));
  displayListTopics(listOfTopics);
  initToLocalStprage();
  form.reset();
}

function handleClicks (e) {
  if (e.target.matches(".upvotes")) {
    const buttonUpId = e.target.dataset.id;
    console.log(buttonUpId);
    listOfTopics.forEach(topic => {
      if (topic.id === buttonUpId) {
        topic.upvotes++;
      }
    })
    // window.dispatchEvent( new CustomEvent(listOfTopicsUpdated));
    displayListTopics(listOfTopics);
  }

  if (e.target.matches(".downvotes")) {
    const buttonDownId = e.target.dataset.id;
    listOfTopics.forEach(topic => {
      if (topic.id === buttonDownId) {
        topic.downvotes--;
      }
    })
    // window.dispatchEvent( new CustomEvent(listOfTopicsUpdated));
    displayListTopics(listOfTopics);
    initToLocalStprage();
  }

  if (e.target.matches(".archive")) {
    const buttonArchiveId = e.target.dataset.id;
    const archived = listOfTopics.find(topic => topic.id === buttonArchiveId);
    archived.discussedOn = Date.now();
    displayListTopics(listOfTopics);
    initToLocalStprage();
    // window.dispatchEvent( new CustomEvent(listOfTopicsUpdated));
  }

  if (e.target.matches(".delete")) {
    const buttonToDeeleteId = e.target.dataset.id;
     listOfTopics = listOfTopics.filter(topic => topic.id !== buttonToDeeleteId);
    displayListTopics(listOfTopics);
    initToLocalStprage();
    // window.dispatchEvent( new CustomEvent(listOfTopicsUpdated));
  }
}

function initToLocalStprage () {
  localStorage.setItem("listOfTopics", JSON.stringify(listOfTopics));
}

function restoreFromLocalStorage () {
  let lsItems = JSON.parse(localStorage.getItem('listOfTopics'));
  //getItems("key"), we only use key to get the value of our object
  if (lsItems) {
    //push the items to the actual element here.
    listOfTopics = lsItems;
    // listOfTopics.push(lsItems);
  } else {
    fecthTopics();
  }
  displayListTopics(listOfTopics);
  initToLocalStprage();
  // window.dispatchEvent( new CustomEvent(listOfTopicsUpdated));
}

//listeners
formEl.addEventListener("submit", addList);
window.addEventListener('click', handleClicks);
// window.addEventListener("listOfTopicsUpdated", displayListTopics)
restoreFromLocalStorage();