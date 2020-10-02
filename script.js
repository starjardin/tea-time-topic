/*TODO : 
  1- fetch the topics list, // 4- sort goes here
  2- create function to display the lists, 
  3- creat a function to add topis via form
  4- listen for upvoted and downvoted
*/
const article = document.querySelector("article");
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
  const newTopic = {
    id: Date.now(),
		upvotes: 0,
		title: form.topics.value,
		downvotes: 0,
		discussedOn: "",
  }
  listOfTopics.push(newTopic);
  displayListTopics(listOfTopics);
  form.reset();
}

function handleClicks (e) {
  if (e.target.matches(".upvotes")) {
    const buttonUpId = e.target.dataset.id;
    listOfTopics.map(topic => {
      if (topic.id === buttonUpId) {
        topic.upvotes++;
      }
    })
    displayListTopics(listOfTopics);
  }

  if (e.target.matches(".downvotes")) {
    const buttonDownId = e.target.dataset.id;
    listOfTopics.map(topic => {
      if (topic.id === buttonDownId) {
        topic.downvotes--;
      }
    })
    displayListTopics(listOfTopics);
  }

  if (e.target.matches(".archive")) {
    const buttonArchiveId = e.target.dataset.id;
    const archived = listOfTopics.find(topic => topic.id === buttonArchiveId);
    archived.discussedOn = Date.now();
    displayListTopics(listOfTopics);
  }

  if (e.target.matches(".delete")) {
    const buttonToDeeleteId = e.target.dataset.id;
     listOfTopics = listOfTopics.filter(topic => topic.id !== buttonToDeeleteId);
    displayListTopics(listOfTopics);
  }
}

function initToLocalStprage () {
  localStorage.setItem("listOfTopics", JSON.stringify(listOfTopics));
}

function restoreFromLocalStorage () {
  let lsItems = JSON.parse(localStorage.getItem('listOfTopics'));
  console.log(lsItems);
  //getItems("key"), we only use key to get the value of our object
  if (lsItems.length) {
    //push the items to the actual element here.
    listOfTopics = lsItems;
    // listOfTopics.push(lsItems);
  } else {
    fecthTopics();
  }
}
//listeners
formEl.addEventListener("submit", addList);
window.addEventListener('click', handleClicks);
initToLocalStprage();
restoreFromLocalStorage();