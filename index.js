const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;
const UserInputKey = "UserInput";

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
    
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    if(storageAvailable("localStorage"))
    {
        // If no user input exists create a new one
        if(!localStorage.getItem(UserInputKey))
        {
            AddNewInput(e.clientX,e.clientY);
        }
        // If it exists append to existing data
        else
        {
            AppendNexInput(e.clientX,e.clientY);
        }
    }
    else
    {
        return;
    }
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
    console.log('Mouse Pos: %f,%f',e.clientX,e.clientY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    console.log("mouse down event");
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    if(storageAvailable("localStorage"))
    {
        localStorage.removeItem(UserInputKey);
    }

    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }

  function AddNewInput(X,Y)
  {
    console.log("Adding new input");
    let newInput = {
        "Input":[{"X": X, "Y": Y}]
    };

    let newInputString = JSON.stringify(newInput);
    localStorage.setItem(UserInputKey,newInputString);
  }

  function AppendNexInput(X,Y)
  {
    console.log("Appending input");
    let existingInputString = localStorage.getItem(UserInputKey);

    let existingInputObj = JSON.parse(existingInputString);
    existingInputObj['Input'].push({"X": X, "Y": Y});

    let newInputString = JSON.stringify(existingInputObj);

    localStorage.setItem(UserInputKey, newInputString);
  }