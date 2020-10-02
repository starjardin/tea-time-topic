/*TODO : 
  1- fetch the topics list, // 4- sort goes here
  2- create function to display the lists, 
  3- creat a function to add topis via form
  4- listen for upvoted and downvoted
*/

const list = document.querySelector(".next-topic");
const formEl = document.querySelector("form");

const endPoint = "https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json";

let listOfTopics = [];

async function fecthTopics () {
  const res = await fetch(`${endPoint}`);
  const data = await res.json();
  listOfTopics.push(...data);
  displayListTopics(listOfTopics);
};

function displayListTopics (listOfTopics) {
  //create html form the list
  const sortedList = listOfTopics.sort(function(a, b) {
    const aUpvotes = a.upvotes;
    const aDownvotes = a.downvotes;
    const aRatioVotes = aUpvotes - aDownvotes;
    const bUpvotes = b.upvotes;
    const bDownvotes = b.downvotes;
    const bRationVotes = bUpvotes - bDownvotes;
    return bRationVotes - aRatioVotes;
  });
  console.log(sortedList);
  const html = sortedList.map(topic => {
    return `
    <div class="row my-4 bg-light p-4 rounded">
      <div class="col">
        <span>${topic.title}</span>
        <div class="d-block">
          <button type="button" class="upvoted">
            upvoted 
            <span>${topic.upvotes}</span></button>
          <button type="button" class="downvoted">
            downvoted <span>${topic.downvotes}</span>
          </button>
        </div>
      </div>
      <div>
        <button class="archive">archive</button>
      </div>
    </div>
    `
  }).join("");
  list.innerHTML = html;
}

fecthTopics();