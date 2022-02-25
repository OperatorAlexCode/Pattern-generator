const Canvas = document.getElementById("canvas");
const Buttons = document.getElementById("Buttons");
const Export = document.getElementById("export");
const widthInput = document.getElementById("widthInp");
const heightInput = document.getElementById("heightInp");
const intervalInput = document.getElementById("interval");

let continuous = false;
let currentlyPlaying;
let interval = 400;

// Button objects
const MazePat = {
    name: "Maze",
    charSet: [
        [["┌"],["─","─","┬"],["┐"]],
        [["│","├"],["┌","┐","└","┘","├","┤","┬","┴","┼","─","│"],["│","┤"]],
        [["└"],["─","─","┴"],["┘"]]
    ],
    func: () => {
        Canvas.value = "";
        for (let x = 0; x < Canvas.rows; x++) {
            let set;
            if (x == 0) {
                set = MazePat.charSet[0];
            }
            else if (x == Canvas.rows-1) {
                set = MazePat.charSet[2];
            }
            else {
                set = MazePat.charSet[1];
            }
            for (let y = 0; y < Canvas.cols; y++) {
                if (y == 0) {
                    Canvas.value += set[0][Math.floor(Math.random()*set[0].length)];
                } 
                else if (y == Canvas.cols-1) {
                    Canvas.value += set[2][Math.floor(Math.random()*set[2].length)];
                }
                else {
                    Canvas.value += set[1][Math.floor(Math.random()*set[1].length)];
                }
            }
            if (x < Canvas.rows-1) {
                Canvas.value += "\n";
            }
        }
    }
};

const Clear = {
    name: "Clear",
    func: () => {
        Canvas.value = "";
        currentlyPlaying = null;
    }
};

// List of all the buttons
const ButtonList = [
    {
        charSet:["┌","┐","└","┘","├","┤","┬","┴","┼","─","│"]
    },
    {
        charSet:["▖","▗","▘","▝","▙","▛","▜","▟","▚","▞"]
    },
    {
        charSet:["╭","╮","╯","╰"]
    },
    {
        charSet:["◢","◣","◤","◥"]
    },
    {
        charSet:["▌","▐","▄","▀"]
    },
    {
        charSet:["╱","╲","╱","╲","╳"]
    },
    {
        name: "Rain",
        charSet:[" "," "," "," "," "," ","│"," "," "]
    },
    MazePat,
    Clear
];

intervalInput.value = interval;
Canvas.setAttribute("maxlength",Canvas.cols*Canvas.rows);

intervalInput.addEventListener("change", () => {
    interval = parseInt(intervalInput.value);
})

Export.addEventListener("click",ExportFile);

// Creates patterns using th
const PatternGod = (set) => {
    Canvas.value = "";
    if (set.func != undefined) {
        if (set.func == Clear.func) {
            PatternGod(ButtonList[Math.floor(Math.random()*ButtonList.length)]);
            return;
        }
        else {
            set.func();
        }
    }
    else {
        for (let x = 0; x < Canvas.rows; x++) {
            for (let y = 0; y < Canvas.cols+1; y++) {
                Canvas.value += set.charSet[Math.floor(Math.random()*set.charSet.length)];
            }
            if (x < Canvas.rows) {
                Canvas.value += "\n";
            }
        }
    }
    if (currentlyPlaying != set.ID) {
        currentlyPlaying = set.ID;
    }
}

// Creates Buttons from based on the sets in characterSets
const ButtonGod = () => {
    for (set in ButtonList) {
        let newButton = document.createElement("button");
            if (ButtonList[set].name) {
                newButton.innerText = ButtonList[set].name;
            }
            else {
                newButton.innerText = "Pattern "+(parseInt(set)+1);
            }
            newButton.setAttribute("id",set);
            ButtonList[set].ID = set;
                newButton.addEventListener("click",() => {
                    PatternGod(ButtonList[newButton.getAttribute("id")]);
                });

            Buttons.appendChild(newButton);
    }
}

// Changes the size of the textarea
const SetSize = () => {
    if (widthInput.value && Number.isInteger(parseInt(widthInput.value))) {
        Canvas.setAttribute("cols",parseInt(widthInput.value)-1);
    }
    if (heightInput.value && Number.isInteger(parseInt(heightInput.value))) {
        Canvas.setAttribute("rows",parseInt(heightInput.value));
    }
    Canvas.setAttribute("maxlength",Canvas.cols*Canvas.rows);
    PatternGod(ButtonList[currentlyPlaying]);
}

// Toggles Continuous on/off
const ToggleCont = () => {
    if (document.getElementById("cont").checked === true) {
        continuous = false;
        document.getElementById("cont").checked = false;
    }
    else {
        continuous = true;
        document.getElementById("cont").checked = true;
    }
}

// Plays the currently selected pattern if one is selected
const Play = () => {
    if (continuous == true && currentlyPlaying) {
        PatternGod(ButtonList[currentlyPlaying]);
    }
    setTimeout(Play,interval);
}

function ExportFile() {
    let file = new Blob([Canvas.value],{type:"text/plain;charset=utf-8"});
    saveAs(file,"Pattern.txt");
}

setTimeout(Play,interval);
ButtonGod();
PatternGod(ButtonList[Math.floor(Math.random()*ButtonList.length)]);