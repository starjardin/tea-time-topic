/*TODO : 
  1- fetch the topics list, // 4- sort goes here
  2- create function to display the lists, 
  3- creat a function to add topis via form
  4- listen for upvoted and downvoted
*/

const list = document.querySelector(".container");
const formEl = document.querySelector("form");

const endPoint = "https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json";

let listTopics = [];

async function fecthTopics () {
  const res = await fetch(`${endPoint}`);
  const data = await res.json();
  listTopics.push(...data);
};

function displayListTopics () {

}