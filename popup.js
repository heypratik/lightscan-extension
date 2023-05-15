const askButtonInitialize = document.getElementById('extract-button');
const chatWidget = document.querySelector('.chat-enable');
const inputEl = document.getElementById('search-docs');
const apiKeyBtn = document.getElementById('apiKey-btn');
let isAskingQuestion = false;
let chatReady = false;
const askButton = document.getElementById('ask-ques');
let chattingId;
let text;
const apiKey = document.getElementById('api-key');

let APIKEYFROMSTORAGE;

function chatReadyFunction() {
  chatReady = true
  chatWidget.style.display = 'block';
  document.querySelector('.pre-chat').style.display = 'none'
  askButtonInitialize.style.display = 'none';
}

function getSlug() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = tabs[0].url;
        resolve(url);
      });
    });
  }

  function askingQuestionStart() {
    document.querySelector(".dot-container").style.display = "block";
    askButton.style.disabled = true;
    inputEl.style.disabled = true;
  }

  function askingQuestionEnd() {
    document.querySelector(".dot-container").style.display = "none";
    askButton.style.disabled = false;
    inputEl.style.disabled = false;
  }

document.addEventListener('DOMContentLoaded', async function() {
  const apiKeyFromStorage = localStorage.getItem('docbuddy')

  if (apiKeyFromStorage) {
    APIKEYFROMSTORAGE = apiKeyFromStorage
    document.querySelector('.api').style.display = 'none'
    askButtonInitialize.style.display = 'block';
  }

  apiKeyBtn.addEventListener('click', function() {
    const value = apiKey.value
    localStorage.setItem('docbuddy', value)
    APIKEYFROMSTORAGE = value
    document.querySelector('.api').style.display = 'none'
    document.querySelector('.parent-1').style.display = 'block'
    askButtonInitialize.style.display = 'block';
  })
})
 
  

document.querySelector('.open-menu').addEventListener('click', async function() {
  document.querySelector('.floating-menu').style.display = 'block'
})


document.querySelector('.float-close').addEventListener('click', async function() {
  document.querySelector('.floating-menu').style.display = 'none'
  
})

document.addEventListener('DOMContentLoaded', async function() {
  const apiValue = localStorage.getItem('docbuddy')

  if (!apiValue) {
    document.querySelector('.parent-1').style.display = 'none'
    askButtonInitialize.style.display = 'none';
  }

  askButtonInitialize.addEventListener('click', async function() {
    const urlForId = await getSlug();
      isAskingQuestion = true;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tab = tabs[0];
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: () => {
            return document.body.innerText;
          }
        }).then((result) => {
        text = result[0].result
        sendTextToAPI(text, urlForId);
        });
      });
    });
  });



function sendTextToAPI(text, url) {
  askButtonInitialize.innerText = 'Working on it...';
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://chat-over-docs.vercel.app/api/ingest', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      if (JSON.parse(xhr.responseText).status === 'success') {
        chattingId = JSON.parse(xhr.responseText).vectorID;
        chatReadyFunction()  
      }
    }
  };
  xhr.send(JSON.stringify({ text, url, APIKEYFROMSTORAGE }));
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    if (inputEl.value){
      sendQA(chattingId, text)
    }
  }
});

  askButton.addEventListener('click', async function() {
    sendQA(chattingId, text)
    });

  function sendQA(chattingId, text) {
    askingQuestionStart();
    const query = inputEl.value;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://chat-over-docs.vercel.app/api/chat", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        if (JSON.parse(xhr.responseText).status === "success") {
          askingQuestionEnd();
  
          // Create the answer card element
          const answerCardEl = document.createElement("div");
          answerCardEl.classList.add("answer-card");
  
          // Create the question element
          const questionEl = document.createElement("h3");
          questionEl.classList.add("card-question");
          questionEl.style.fontSize = "15px";
          questionEl.style.marginLeft = "10px";
          questionEl.innerText = inputEl.value;
  
          // Create the user icon element
          const userIconEl = document.createElement("i");
          userIconEl.classList.add("fa", "fa-user");
          userIconEl.setAttribute("aria-hidden", "true");
  
          // Append the user icon and question elements to the answer card element
          const questionWrapperEl = document.createElement("div");
          questionWrapperEl.classList.add("que-wrapper");
          questionWrapperEl.style.display = "flex";
          questionWrapperEl.appendChild(userIconEl);
          questionWrapperEl.appendChild(questionEl);
          answerCardEl.appendChild(questionWrapperEl);
  
          // Create the answer text element
          const answerTextEl = document.createElement("p");
          answerTextEl.classList.add("card-answer");
          answerTextEl.style.fontSize = "14px";
          var i = 0;
          var txt = JSON.parse(xhr.responseText).result.text;
          var speed = 15;
  
          function typeWriter() {
            if (i < txt.length) {
              answerTextEl.innerHTML += txt.charAt(i);
              i++;
              setTimeout(typeWriter, speed);
            }
          }
          typeWriter();
  
          // Append the answer text element to the answer card element
          const answerWrapperEl = document.createElement("div");
          // const uniqueId = inputEl.value + JSON.parse(xhr.responseText).result.text
          const uniqueId = Date.now()
          // answerWrapperEl.classList.add(uniqueId); 
          answerWrapperEl.setAttribute("id", `a${uniqueId}`);
          answerWrapperEl.classList.add("ans-wrapper");
          answerWrapperEl.style.display = "flex";
          answerWrapperEl.style.alignItems = "flex-start";
          answerWrapperEl.style.marginTop = "5px";
          answerWrapperEl.appendChild(answerTextEl);
          answerCardEl.appendChild(answerWrapperEl);
  
          // Create the bookmark icon element
          const bookmarkIconEl = document.createElement("div");
          bookmarkIconEl.classList.add("card-icons");
          const bookmarkIconIEl = document.createElement("i");
          bookmarkIconIEl.classList.add("fa", "fa-bookmark-o");
          bookmarkIconIEl.setAttribute("aria-hidden", "true");
          bookmarkIconEl.setAttribute("name", inputEl.value); 
          bookmarkIconEl.setAttribute("data-answer", JSON.parse(xhr.responseText).result.text); 

          const editIconEl = document.createElement("div");
          editIconEl.classList.add("card-icons");
          editIconEl.classList.add("pencil-icon");
          const editIconIEl = document.createElement("i");
          editIconIEl.classList.add("fa", "fa-pencil");
          editIconEl.setAttribute("id", `a${uniqueId}`); 
          editIconEl.setAttribute("data-answer", JSON.parse(xhr.responseText).result.text); 

          const copyIconEl = document.createElement("div");
          copyIconEl.classList.add("card-icons");
          copyIconEl.classList.add("copy-icon");
          const copyIconIEl = document.createElement("i");
          copyIconIEl.classList.add("fa", "fa-copy");
          copyIconIEl.setAttribute("id", `a${uniqueId}`); 
          copyIconEl.setAttribute("id", `a${uniqueId}`); 
          copyIconEl.setAttribute("data-answer", JSON.parse(xhr.responseText).result.text); 

          bookmarkIconEl.appendChild(bookmarkIconIEl);
          editIconEl.appendChild(editIconIEl);
          copyIconEl.appendChild(copyIconIEl);
  
          // Append the bookmark icon element to the answer card element

          const iconBoxEl = document.createElement("div");
          iconBoxEl.classList.add("icon-box");
          iconBoxEl.setAttribute("id", `icon${uniqueId}`);
          answerCardEl.appendChild(iconBoxEl);
          iconBoxEl.appendChild(bookmarkIconEl);
          iconBoxEl.appendChild(editIconEl);
          iconBoxEl.appendChild(copyIconEl);

          // Icon Functions 

          bookmarkIconEl.addEventListener("click", function() {
            const questionText = this.getAttribute("name");
            const answerText = this.getAttribute("data-answer");
            const exists = localStorage.getItem(`Lightscan-answers-${btoa(questionText)}`);
            if (exists) {
              localStorage.removeItem(`Lightscan-answers-${btoa(questionText)}`);
              bookmarkIconIEl.classList.toggle('fa-bookmark-o');
              bookmarkIconIEl.classList.toggle('fa-bookmark');
            } else {
            bookmarkIconIEl.classList.toggle('fa-bookmark-o');
            bookmarkIconIEl.classList.toggle('fa-bookmark');
            localStorage.setItem(`Lightscan-answers-${btoa(questionText)}`, answerText);
            }
          });
          
          editIconEl.addEventListener("click", function() {
            document.querySelector(`#icon${uniqueId}`).style.display = "none";
            const id = this.getAttribute("id");
            const textToEdit = this.getAttribute("data-answer");
            
            const divToEdit = document.querySelector(`#${id}`)
            divToEdit.querySelector(".card-answer").style.display = "none";

            const textArea = document.createElement("div");
            textArea.classList.add("edit-card-answer");
            textArea.innerHTML = ` <textarea value="${textToEdit}" id="b${id}" rows="3">${textToEdit}</textarea> <div class="btn-container"> <button id=${id} class="btn btn-primary save-answer">Save</button> <button id=${id} class="btn btn-secondary cancel-btn">Cancel</button> </div>`;
            
            const answerBoxEl = document.querySelector(`#${id}`)
            answerBoxEl.appendChild(textArea);

            document.querySelector(`#b${id}`).addEventListener('input', function(e) {
              document.querySelector(`#b${id}`).value = e.target.value
            })

            // Save Edited Answer 
          document.querySelector('.save-answer').addEventListener("click", function() {
            document.querySelector(`#icon${uniqueId}`).style.display = "flex";
            const updatedValue = document.querySelector(`#b${id}`).value;
            editIconEl.setAttribute("data-answer", updatedValue); 
            bookmarkIconEl.setAttribute("data-answer", updatedValue); 
            divToEdit.querySelector(".card-answer").innerText = updatedValue;
            divToEdit.querySelector(".card-answer").style.display = "block";
            document.querySelector(`#${id}`).removeChild(textArea);
          })

          document.querySelector('.cancel-btn').addEventListener("click", function() {
            document.querySelector(`#icon${uniqueId}`).style.display = "flex";
            divToEdit.querySelector(".card-answer").style.display = "block";
            document.querySelector(`#${id}`).removeChild(textArea);
          })
          })

          //Copy Button
          copyIconEl.addEventListener("click", function() {
            const id = this.getAttribute("id")
            const quesDiv = document.querySelector(`#${id}`)
            console.log(quesDiv)
            const textToCopy = quesDiv.querySelector(".card-answer").innerText
            navigator.clipboard.writeText(textToCopy)

            const ogId = id.slice(1)
            const mainCopyElDiv = document.querySelector(`#icon${ogId}`)
            const copyIcontoHide = mainCopyElDiv.querySelector(`.copy-icon`)
            copyIcontoHide.querySelector(`#${id}`).style.display = "none";
            const checkMarkEl = document.createElement("i");
            checkMarkEl.classList.add("fa", "fa-check");
            iconBoxEl.classList.add("pointer-e-null");
            checkMarkEl.setAttribute("id", `check${id}`); 
            console.log(checkMarkEl)
            console.log(mainCopyElDiv.querySelector(`.copy-icon`))
            mainCopyElDiv.querySelector(`.copy-icon`).appendChild(checkMarkEl);

            setTimeout(() => {
              const mainCopyElDiv = document.querySelector(`#icon${ogId}`)
              const copyIcontoHide = mainCopyElDiv.querySelector(`.copy-icon`)
              copyIcontoHide.removeChild(document.querySelector(`#check${id}`))
              copyIcontoHide.querySelector(`#${id}`).style.display = "block";
              iconBoxEl.classList.remove("pointer-e-null");
            }, 1000)

          })
          

          // Append the answer card element to the answer container
          const answerContainerEl = document.querySelector(".answer-container");
          answerContainerEl.appendChild(answerCardEl);
        }
      }
    };
    xhr.send(JSON.stringify({ query, chattingId, text, APIKEYFROMSTORAGE }));
  }

  function handleBookMark(e) {
    console.log(e)
  }