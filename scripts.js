// Make file upload and paste csv buttons dark
buttonDark("uploadButton");
buttonDark("pasteCSVButton");

// Variable for accent color
const ACCENT_COLOR = "rgb(82, 129, 247)";

// Apply accent color to button
function accentButton(buttonID)
{
    // Find the button
    const curButton = document.getElementById(buttonID);
    
    // If button exists
    if(curButton != null)
    {
        // Turn button accent color
        curButton.style.backgroundColor = ACCENT_COLOR;
    }
}

// Makes a text area to input CSV
function pasteCSV()
{
    // Make button light
    buttonDark("uploadButton");
    buttonLight("pasteCSVButton");
    
    // Find input container
    let inContainer = document.getElementById("inputContainer");
    
    // Clear containers (except "startButtons")
    clearDiv("inputContainer");
    clearDiv("errorContainer");
    clearDiv("resultContainer");
    clearDiv("modButtonContainer");
    clearDiv("modifyContainer");
    
    // Make a div for the text area
    let inputDiv = document.createElement("div");
    inputDiv.id = "inputDiv";
    
    inContainer.appendChild(inputDiv);
    
    // Make text area
    let inputText = document.createElement("textarea");
    inputText.id = "txtArea";
    
    inputText.placeholder = "Type here";
    inputDiv.appendChild(inputText);
    
    // Autosize the text area
    areaAutosize(inputText.id, true);
    
    // Add a toggle table button
    toggleTable(inputText, inContainer, inputDiv);
    
    // Make 'save csv' button
    saveCSV(inputText, inContainer);
}

// Inputs csv/txt files
function fileUpload()
{
    // Make button light
    buttonLight("uploadButton");
    buttonDark("pasteCSVButton");
    
    // Find input container
    let inContainer = document.getElementById("inputContainer");
    
    // Clear containers (except "startButtons")
    clearDiv("inputContainer");
    clearDiv("errorContainer");
    clearDiv("resultContainer");
    clearDiv("modButtonContainer");
    clearDiv("modifyContainer");
    
    // Create the input element
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';
    inContainer.appendChild(fileInput);

    // Add event listener to handle file selection
    fileInput.addEventListener('change', (event) =>	{ // When a file is selected
        let file = event.target.files[0]; // Grab the first selected file
        if(file) // If a file has been selected
        {
            // If file is .csv or .txt
            if(file.name.split('.').pop().toLowerCase() /*File extension*/ === "csv" || file.name.split('.').pop().toLowerCase() /*File extension*/ === "txt")
            {
                let reader = new FileReader(); // Creates new 'FileReader' object from the 'FileReader' API to read the file
                reader.onload = (e) => { // Once the file (parameter: 'e') has successfully been read
                    let content = e.target.result; // Retrieve the content of the loaded file
                    
                    // Create a line break
                    createLineBreak("afterUploadArea", inContainer);
                    
                    // Make a div for the text area
                    let inputDiv = document.createElement("div");
                    inputDiv.id = "inputDiv";
                    
                    inContainer.appendChild(inputDiv);
                    
                    /*// Make text area
                    let fileTextArea = document.createElement("textarea");
                    fileTextArea.id = "txtArea";
                    
                    fileTextArea.placeholder = "File content";
                    fileTextArea.textContent = content;
                    inputDiv.appendChild(fileTextArea);
                    
                    // Autosize the text area
                    areaAutosize(fileTextArea.id, true);
                    
                    // Add a toggle table button
                    toggleTable(inputText, inContainer, inputDiv);
                    
                    // Make 'save csv' button
                    saveCSV(fileTextArea, inContainer);*/

                    // Make text area
                    let fileTextArea = document.createElement("textarea");
                    fileTextArea.id = "txtArea";
                    
                    fileTextArea.placeholder = "Type here";
                    fileTextArea.textContent = content;
                    inputDiv.appendChild(fileTextArea);
                    
                    // Autosize the text area
                    areaAutosize(fileTextArea.id, true);
                    
                    // Add a toggle table button
                    toggleTable(fileTextArea, inContainer, inputDiv);
                    
                    // Make 'save csv' button
                    saveCSV(fileTextArea, inContainer);
                };
                reader.readAsText(file); // Initiate reading of the file
            }
            else // If file is not .csv or .txt
            {
                // Tell the user that the file has to be either .csv or .txt
                alert("Files must be either .csv or .txt");
            }
        }
    });
}

// Toggles between text area view and table view
function toggleTable(textarea, inContainer, inputDiv)
{
    /*
    Idea: Make editing the cells edit the text area, which keeps track of the correct cell format using CSVtoArray
    -Complete: Instead of deleting the textarea when the table view is toggled, hide it
    -Complete: Adapt the table such that editing a cell edits the text area
    -Complete: Find out how to properly tell if the length of a cell's text is different than the text area's equivalent text (ln.440)
    -Complete: Make a way to delete cells with backspace and delete
    -Complete: Adapt error manager to work when the table display is used
    -Complete: When paste is pressed, make sure the right cell is selected afterwards
    -Complete: Work on scroll/autosize when the table expands past the max height
    */
    
    // Make a button below the text area's parent div
    let toggleTableButton = document.createElement('button');
    toggleTableButton.id = "toggleTableButton";
    toggleTableButton.textContent = "Toggle table view";
    
    // Add onclick to toggle table button
    toggleTableButton.addEventListener('click', function()
    {
        // Make error buttons dark
        buttonDark("unequalRowButton");
        buttonDark("emptyElementsButton");
        buttonDark("falseCarriageReturnsButton");
        buttonDark("falseNewLinesButton");
        
        // Remove error line break and arrow buttons
        removeById("afterUnequalRowButton");
        removeById("afterEmptyElementButton");
        removeById("afterFalseCarriageReturnButton");
        removeById("afterFalseNewLinesButton");
        removeById("leftArrowButton");
        removeById("elementIndexButton");
        removeById("rightArrowButton");
        
        // If the text content is "Toggle table view"
        if(toggleTableButton.textContent == "Toggle table view")
        {
            // Make the text area invisible
            textarea.style.display = "none";
            
            // Swap the text content
            toggleTableButton.textContent = "Toggle text area view";
            
            // Convert the text to an array
            let csvArr = CSVtoArray(textarea.value);
            
            // Placeholder int for the maximum length row
            let maxRowLength = 0;
            
            // Find the maximum length row in the csvArr
            for(let i = 0; i < csvArr.length; i++)
            {
                // If current row length is larger than the maxRowLength
                if(csvArr[i].length > maxRowLength)
                {
                    // Set maxRowLength to the current row length
                    maxRowLength = csvArr[i].length;
                }
            }
            
            // Create a table element and a table body element
            let tbl = document.createElement("table");
            tbl.id = textarea.id + "Table";
            let tblBody = document.createElement("tbody");
            
            // Make first row of table (numbered column cells)
            let firstRow = document.createElement("tr");
            
            // Add first row to the beginning of the table
            tblBody.appendChild(firstRow);
            
            // Add empty column to first row
            let emptyCell = document.createElement("td");
            firstRow.appendChild(emptyCell);
            
            // Loop through maxRowLength
            for(let curCol = 0; curCol < maxRowLength; curCol++)
            {
                // Add to first row
                let firstRowCell = document.createElement("td");
                firstRowCell.appendChild(document.createTextNode("Column " + (curCol + 1)));
                firstRow.appendChild(firstRowCell);
            }
            
            // Loop through csvArr
            for(let curRow = 0; curRow < csvArr.length; curRow++)
            {
                // Make a current row
                let curCellRow = document.createElement("tr");
                
                // Make a numbered row cell
                let numberedRowCell = document.createElement("td");
                numberedRowCell.appendChild(document.createTextNode("Row " + (curRow + 1)));
                curCellRow.appendChild(numberedRowCell);
                
                // Loop through current csvArr row
                for(let curCol = 0; curCol < csvArr[curRow].length; curCol++)
                {
                    // Add cell to current row
                    let curCell = document.createElement("td");
                    
                    // Set custom properties to store row and column information
                    curCell.row = curRow;
                    curCell.col = curCol;
                    
                    curCellRow.appendChild(curCell);
                    
                    // Find the text content from the array
                    if(csvArr[curRow][curCol])
                    {
                        curCell.appendChild(document.createTextNode(csvArr[curRow][curCol]));
                    }
                    else
                    {
                        curCell.appendChild(document.createTextNode(""));
                    }
                    
                    // Make that thang editable
                    cellEditable(curCell, tblBody);
                }
                
                // Add current row to the table
                tblBody.appendChild(curCellRow);
            }
            
            // put the <tbody> in the <table>
            tbl.appendChild(tblBody);
            // appends <table> into tableContainer
            inputDiv.appendChild(tbl);
            
            // Apply styles to table
            tbl.setAttribute("border", "2");
            
            // Finding all cells
            let cells = tbl.querySelectorAll("td");
            
            // Making all cells not wrap
            cells.forEach((cell) => {
                cell.style.whiteSpace = "pre";
            });
            
            // Setting background color
            tbl.style.backgroundColor = "rgb(240,240,240)";
            
            // Autosize the div
            tableAutosize(tbl.id, true);
        }
        // If the text content is "Toggle text area view"
        else if(toggleTableButton.textContent == "Toggle text area view")
        {
            // Make the text area visible
            textarea.style.display = "block";
            
            // Remove the table
            removeById(textarea.id + "Table");
            
            // Swap the text content
            toggleTableButton.textContent = "Toggle table view";
            
            // Autosize the div once
            areaAutosize(textarea.id, false)
        }
    });
    
    // Append toggle table button to overarching div
    inContainer.appendChild(toggleTableButton);
    
    // Make cell editable
    function cellEditable(cell, tblBody)
    {
        // Make the cell editable
        cell.setAttribute("contenteditable", "true");
        
        // Make the cells deletable (with backspace and delete events)
        cell.addEventListener('keydown', function (event) {
            if(event.key === 'Backspace')
            {
                // Placeholder boolean for if the comma to the left of the cell should be deleted
                let commaDeleted = false;
                
                // If there is no text in the cell
                if(cell.textContent.length == 0)
                {
                    commaDeleted = true;
                }
                else // If there is text in the cell
                {
                    // Find the selected text
                    // Get the selection object
                    let selection = window.getSelection();
                    
                    // Check if there's a selection within the cell
                    let range = selection.getRangeAt(0);
                    
                    // If the selected text is in the cell
                    if (cell.contains(range.startContainer) && cell.contains(range.endContainer))
                    {
                        // Find the start and end offsets within the cell
                        let startIndex = range.startOffset;
                        let endIndex = range.endOffset;
                        
                        // If only one index is selected and the selected text is the leftmost index of the cell
                        if(endIndex - startIndex == 0 && startIndex == 0)
                        {
                            commaDeleted = true;
                        }
                    }
                }
                
                // If commaDeleted is true
                if(commaDeleted == true)
                {
                    // Prevent the default behavior of the backspace key
                    event.preventDefault();
                    
                    // Find the cell before it
                    // Get the parent row of the cell
                    let row = cell.parentElement;
                    
                    // Get all the cells in the row
                    let cellsInRow = row.getElementsByTagName("td"); // Assuming you're working with table cells (td)
                    
                    // Find the index of the cell in the row
                    let cellIndex = Array.from(cellsInRow).indexOf(cell);
                    
                    // Calculate the index of the cell to the left
                    let leftCellIndex = cellIndex - 1;
                    
                    // Placeholder for the previous cell
                    let prevCell = null;
                    
                    // Check if there's a cell to the left
                    if (leftCellIndex >= 1)
                    {
                        prevCell = cellsInRow[leftCellIndex];
                    }
                    else
                    {
                        // Find the previous row
                        let previousRow = row.previousElementSibling;
                        
                        // Get the first cell (assuming it's a <td> element)
                        let firstCell = previousRow.querySelector("td");
                        
                        // Check if the first cell has no text content
                        if (firstCell.textContent.trim() !== "")
                        {
                            // Find the last cell of the row
                            // Get all the cells in the row
                            var cellsInPreviousRow = previousRow.getElementsByTagName("td");
                            
                            // Check if there are cells in the row
                            if (cellsInPreviousRow.length > 0) {
                                // Access the last cell
                                prevCell = cellsInPreviousRow[cellsInPreviousRow.length - 1];
                            }
                        }
                    }
                    
                    // If there is a previous cell
                    if(prevCell != null)
                    {
                        // Find the row and column of the cell
                        let row = cell.row;
                        let col = cell.col;
                        
                        // Find the text in the text area
                        textAreaText = textarea.value;
                        
                        // Convert the cell to the index in the textarea
                        let textAreaCellIndexes = csvCoordinateToIndex(textAreaText, [row,col]);
                        
                        // Extract the text before and after the portion to be replaced
                        var textBefore = textAreaText.substring(0, textAreaCellIndexes - 1);
                        var textAfter = textAreaText.substring(textAreaCellIndexes);
                        
                        // Update the text area's text with the cell's text
                        textarea.value = textBefore + textAfter;
                        
                        // Do error handling on the structure of the table
                        // Find the selected cell and text
                        let selectedCellRow = cell.row;
                        let selectedCellCol = cell.col;
                        
                        // Find the scroll position
                        let xScrollPosition = inputDiv.scrollLeft;
                        let yScrollPosition = inputDiv.scrollTop;
                        
                        // Remove the table
                        removeById(textarea.id + "Table");
                        
                        // Make a new table
                        // Convert the text to an array
                        let csvArr = CSVtoArray(textarea.value);
                        
                        // Placeholder int for the maximum length row
                        let maxRowLength = 0;
                        
                        // Find the maximum length row in the csvArr
                        for(let i = 0; i < csvArr.length; i++)
                        {
                            // If current row length is larger than the maxRowLength
                            if(csvArr[i].length > maxRowLength)
                            {
                                // Set maxRowLength to the current row length
                                maxRowLength = csvArr[i].length;
                            }
                        }
                        
                        // Create a table element and a table body element
                        let tbl = document.createElement("table");
                        tbl.id = textarea.id + "Table";
                        let tblBody = document.createElement("tbody");
                        
                        // Make first row of table (numbered column cells)
                        let firstRow = document.createElement("tr");
                        
                        // Add first row to the beginning of the table
                        tblBody.appendChild(firstRow);
                        
                        // Add empty column to first row
                        let emptyCell = document.createElement("td");
                        firstRow.appendChild(emptyCell);
                        
                        // Loop through maxRowLength
                        for(let curCol = 0; curCol < maxRowLength; curCol++)
                        {
                            // Add to first row
                            let firstRowCell = document.createElement("td");
                            firstRowCell.appendChild(document.createTextNode("Column " + (curCol + 1)));
                            firstRow.appendChild(firstRowCell);
                        }
                        
                        // Loop through csvArr
                        for(let curRow = 0; curRow < csvArr.length; curRow++)
                        {
                            // Make a current row
                            let curCellRow = document.createElement("tr");
                            
                            // Make a numbered row cell
                            let numberedRowCell = document.createElement("td");
                            numberedRowCell.appendChild(document.createTextNode("Row " + (curRow + 1)));
                            curCellRow.appendChild(numberedRowCell);
                            
                            // Loop through current csvArr row
                            for(let curCol = 0; curCol < csvArr[curRow].length; curCol++)
                            {
                                // Add cell to current row
                                let curCell = document.createElement("td");
                                
                                // Set custom properties to store row and column information
                                curCell.row = curRow;
                                curCell.col = curCol;
                                
                                // If current cell is the prevCell (from earlier)
                                if(curRow == prevCell.row && curCol == prevCell.col)
                                {
                                    // Give it an id
                                    curCell.id = "selectedCell";
                                }
                                
                                curCellRow.appendChild(curCell);
                                
                                // Find the text content from the array
                                if(csvArr[curRow][curCol])
                                {
                                    curCell.appendChild(document.createTextNode(csvArr[curRow][curCol]));
                                }
                                else
                                {
                                    curCell.appendChild(document.createTextNode(""));
                                }
                                
                                // Make that thang editable
                                cellEditable(curCell, tblBody);
                            }
                            
                            // Add current row to the table
                            tblBody.appendChild(curCellRow);
                        }
                        
                        // put the <tbody> in the <table>
                        tbl.appendChild(tblBody);
                        // appends <table> into tableContainer
                        inputDiv.appendChild(tbl);
                        
                        // Apply styles to table
                        tbl.setAttribute("border", "2");
                        
                        // Finding all cells
                        let cells = tbl.querySelectorAll("td");
                        
                        // Making all cells not wrap
                        cells.forEach((cell) => {
                            cell.style.whiteSpace = "pre";
                        });
                        
                        // Setting background color
                        tbl.style.backgroundColor = "rgb(240,240,240)";
                        
                        // Autosize the div
                        tableAutosize(tbl.id, true);
                        
                        // Select text in cell
                        let range = document.createRange();
                        var sel = window.getSelection();
                        
                        let newPrevCell = document.getElementById("selectedCell");
                        
                        range.setStart(newPrevCell.firstChild, prevCell.textContent.length);
                        range.collapse(true);
                        
                        sel.removeAllRanges();
                        sel.addRange(range);
                        
                        // Create and dispatch an 'input' event
                        var inputEvent = new Event('input');
                        textarea.dispatchEvent(inputEvent);
                        
                        // Scroll to the position the table was at before
                        inputDiv.scrollLeft = xScrollPosition;
                        inputDiv.scrollTop = yScrollPosition;
                    }
                }
            }
            if(event.key === "Delete")
            {
                // Placeholder boolean for if the comma to the right of the cell should be deleted
                let commaDeleted = false;
                
                // If there is no text in the cell
                if(cell.textContent.length == 0)
                {
                    commaDeleted = true;
                }
                else // If there is text in the cell
                {
                    // Find the selected text
                    // Get the selection object
                    let selection = window.getSelection();
                    
                    // Check if there's a selection within the cell
                    let range = selection.getRangeAt(0);
                    
                    // If the selected text is in the cell
                    if (cell.contains(range.startContainer) && cell.contains(range.endContainer))
                    {
                        // Find the start and end offsets within the cell
                        let startIndex = range.startOffset;
                        let endIndex = range.endOffset;
                        
                        // If only one index is selected and the selected text is the leftmost index of the cell
                        if(endIndex - startIndex == 0 && startIndex == cell.textContent.length)
                        {
                            commaDeleted = true;
                        }
                    }
                }
                
                // If commaDeleted is true
                if(commaDeleted == true)
                {
                    // Prevent the default behavior of the delete key
                    event.preventDefault();
                    
                    // Find the cell after it
                    // Get the parent row of the cell
                    let row = cell.parentElement;
                    
                    // Get all the cells in the row
                    let cellsInRow = row.getElementsByTagName("td"); // Assuming you're working with table cells (td)
                    
                    // Find the index of the cell in the row
                    let cellIndex = Array.from(cellsInRow).indexOf(cell);
                    
                    // Calculate the index of the cell to the right
                    let rightCellIndex = cellIndex + 1;
                    
                    // Placeholder for the next cell
                    let nextCell = null;
                    
                    // Check if there's a cell to the right
                    if (rightCellIndex < cellsInRow.length)
                    {
                        nextCell = cellsInRow[rightCellIndex];
                    }
                    else
                    {
                        // Find the next row
                        let nextRow = row.nextElementSibling;
                        
                        // If there is a next row
                        if(nextRow != null)
                        {
                            // Get the second cell (assuming it's a <td> element)
                            // Get all the cells in the row
                            let cellsInRow = nextRow.getElementsByTagName("td"); // Assuming you're working with table cells (td)
                            
                            // Check if there are at least two cells in the row
                            if (cellsInRow.length > 1) {
                                // Access the second cell (index 1)
                                nextCell = cellsInRow[1];
                            }
                        }
                    }
                    
                    // If there is a next cell
                    if(nextCell != null)
                    {
                        // Find how long the current cell is
                        let cellTextLength = cell.textContent.length;
                        
                        // Find the row and column of the cell
                        let row = nextCell.row;
                        let col = nextCell.col;
                        
                        // Find the text in the text area
                        textAreaText = textarea.value;
                        
                        // Convert the cell to the index in the textarea
                        let textAreaCellIndexes = csvCoordinateToIndex(textAreaText, [row,col]);
                        
                        // Extract the text before and after the portion to be replaced
                        var textBefore = textAreaText.substring(0, textAreaCellIndexes - 1);
                        var textAfter = textAreaText.substring(textAreaCellIndexes);
                        
                        // Update the text area's text with the cell's text
                        textarea.value = textBefore + textAfter;
                        
                        // Do error handling on the structure of the table
                        // Find the selected cell and text
                        let selectedCellRow = cell.row;
                        let selectedCellCol = cell.col;
                        
                        // Find the scroll position
                        let xScrollPosition = inputDiv.scrollLeft;
                        let yScrollPosition = inputDiv.scrollTop;
                        
                        // Remove the table
                        removeById(textarea.id + "Table");
                        
                        // Make a new table
                        // Convert the text to an array
                        let csvArr = CSVtoArray(textarea.value);
                        
                        // Placeholder int for the maximum length row
                        let maxRowLength = 0;
                        
                        // Find the maximum length row in the csvArr
                        for(let i = 0; i < csvArr.length; i++)
                        {
                            // If current row length is larger than the maxRowLength
                            if(csvArr[i].length > maxRowLength)
                            {
                                // Set maxRowLength to the current row length
                                maxRowLength = csvArr[i].length;
                            }
                        }
                        
                        // Create a table element and a table body element
                        let tbl = document.createElement("table");
                        tbl.id = textarea.id + "Table";
                        let tblBody = document.createElement("tbody");
                        
                        // Make first row of table (numbered column cells)
                        let firstRow = document.createElement("tr");
                        
                        // Add first row to the beginning of the table
                        tblBody.appendChild(firstRow);
                        
                        // Add empty column to first row
                        let emptyCell = document.createElement("td");
                        firstRow.appendChild(emptyCell);
                        
                        // Loop through maxRowLength
                        for(let curCol = 0; curCol < maxRowLength; curCol++)
                        {
                            // Add to first row
                            let firstRowCell = document.createElement("td");
                            firstRowCell.appendChild(document.createTextNode("Column " + (curCol + 1)));
                            firstRow.appendChild(firstRowCell);
                        }
                        
                        // Loop through csvArr
                        for(let curRow = 0; curRow < csvArr.length; curRow++)
                        {
                            // Make a current row
                            let curCellRow = document.createElement("tr");
                            
                            // Make a numbered row cell
                            let numberedRowCell = document.createElement("td");
                            numberedRowCell.appendChild(document.createTextNode("Row " + (curRow + 1)));
                            curCellRow.appendChild(numberedRowCell);
                            
                            // Loop through current csvArr row
                            for(let curCol = 0; curCol < csvArr[curRow].length; curCol++)
                            {
                                // Add cell to current row
                                let curCell = document.createElement("td");
                                
                                // Set custom properties to store row and column information
                                curCell.row = curRow;
                                curCell.col = curCol;
                                
                                // If current cell is the cell
                                if(curRow == cell.row && curCol == cell.col)
                                {
                                    // Give it an id
                                    curCell.id = "selectedCell";
                                }
                                
                                curCellRow.appendChild(curCell);
                                
                                // Find the text content from the array
                                if(csvArr[curRow][curCol])
                                {
                                    curCell.appendChild(document.createTextNode(csvArr[curRow][curCol]));
                                }
                                else
                                {
                                    curCell.appendChild(document.createTextNode(""));
                                }
                                
                                // Make that thang editable
                                cellEditable(curCell, tblBody);
                            }
                            
                            // Add current row to the table
                            tblBody.appendChild(curCellRow);
                        }
                        
                        // put the <tbody> in the <table>
                        tbl.appendChild(tblBody);
                        // appends <table> into tableContainer
                        inputDiv.appendChild(tbl);
                        
                        // Apply styles to table
                        tbl.setAttribute("border", "2");
                        
                        // Finding all cells
                        let cells = tbl.querySelectorAll("td");
                        
                        // Making all cells not wrap
                        cells.forEach((cell) => {
                            cell.style.whiteSpace = "pre";
                        });
                        
                        // Setting background color
                        tbl.style.backgroundColor = "rgb(240,240,240)";
                        
                        // Autosize the div
                        tableAutosize(tbl.id, true);
                        
                        // Select text in cell
                        let range = document.createRange();
                        var sel = window.getSelection();
                        
                        let newPrevCell = document.getElementById("selectedCell");
                        
                        range.setStart(newPrevCell.firstChild, cellTextLength);
                        range.collapse(true);
                        
                        sel.removeAllRanges();
                        sel.addRange(range);
                        
                        // Create and dispatch an 'input' event
                        var inputEvent = new Event('input');
                        textarea.dispatchEvent(inputEvent)
                        
                        // Scroll to the position the table was at before
                        inputDiv.scrollLeft = xScrollPosition;
                        inputDiv.scrollTop = yScrollPosition;
                    }
                }
            }
        });
        
        // Make input event
        cell.addEventListener("input", function()
        {
            // Find the row and column of the cell
            let row = cell.row;
            let col = cell.col;
            
            // Find the text in the text area
            textAreaText = textarea.value;
            
            // Convert the cell to the index in the textarea
            let textAreaCellIndexes = csvCoordinateToIndexes(textAreaText, [row,col]);
            
            // Extract the text before and after the portion to be replaced
            var textBefore = textAreaText.substring(0, textAreaCellIndexes[0]);
            var textAfter = textAreaText.substring(textAreaCellIndexes[1]);
            
            // Find the new lines in the cell
            const trailingLineBreaks = cell.textContent.match(/\n+$/);
            
            // Placeholder for the selected index
            let selectedIndex = -1;
            
            // Find the selected text
            // Get the selection object
            let selection = window.getSelection();
            
            // Check if there's a selection within the cell
            let range = selection.getRangeAt(0);
            
            // Check if the selection is within the cell
            if (cell.contains(range.startContainer) && cell.contains(range.endContainer))
            {
                // If there are line breaks
                if(trailingLineBreaks != null)
                {
                    // If there is more than one line break
                    if(trailingLineBreaks[0].length > 1)
                    {
                        // Remove one character from the text content of the cell
                        cell.textContent = cell.textContent.substring(0, cell.textContent.length - 1);
                        
                        // Select the end of the cell again
                        range = document.createRange();
                        
                        range.setStart(cell.firstChild, cell.textContent.length);
                        range.collapse(true);
                        
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
                
                // Find the start offset within the cell
                selectedIndex = range.startOffset;
                
                // Find the index of a new line
                let indexOfNewLine = cell.textContent.indexOf("\n");
                
                // If the user pressed enter before or between characters
                if(selectedIndex == 0 && indexOfNewLine !== -1)
                {
                    selectedIndex = indexOfNewLine + 1;
                }
            }
            
            // Update the text area's text with the cell's text
            textarea.value = textBefore + cell.textContent + textAfter;
            
            // Do error handling on the structure of the table
            // Redo the textAreaCellIndexes
            textAreaCellIndexes = csvCoordinateToIndexes(textarea.value, [row,col]);
            
            // Find the length of the text in the text area
            let textAreaCellLength = textAreaCellIndexes[1] - textAreaCellIndexes[0];
            
            // If the length of the text in the text area doesn't match the length of the cell text
            if(textAreaCellLength != cell.textContent.length)
            {
                // Find the selected row and column using the index
                let editedTextEndIndex = (textBefore + cell.textContent.substring(0, selectedIndex)).length;
                let selectedCoordinates = csvIndexToCoordinate(textarea.value, editedTextEndIndex);
                
                // Find the selected cell and text
                let selectedCellRow = selectedCoordinates[0];
                let selectedCellCol = selectedCoordinates[1];
                selectedIndex = selectedCoordinates[2];
                
                // Remove the table
                removeById(textarea.id + "Table");
                
                // Make a new table
                // Convert the text to an array
                let csvArr = CSVtoArray(textarea.value);
                
                // Placeholder int for the maximum length row
                let maxRowLength = 0;
                
                // Find the maximum length row in the csvArr
                for(let i = 0; i < csvArr.length; i++)
                {
                    // If current row length is larger than the maxRowLength
                    if(csvArr[i].length > maxRowLength)
                    {
                        // Set maxRowLength to the current row length
                        maxRowLength = csvArr[i].length;
                    }
                }
                
                // Create a table element and a table body element
                let tbl = document.createElement("table");
                tbl.id = textarea.id + "Table";
                let tblBody = document.createElement("tbody");
                
                // Make first row of table (numbered column cells)
                let firstRow = document.createElement("tr");
                
                // Add first row to the beginning of the table
                tblBody.appendChild(firstRow);
                
                // Add empty column to first row
                let emptyCell = document.createElement("td");
                firstRow.appendChild(emptyCell);
                
                // Loop through maxRowLength
                for(let curCol = 0; curCol < maxRowLength; curCol++)
                {
                    // Add to first row
                    let firstRowCell = document.createElement("td");
                    firstRowCell.appendChild(document.createTextNode("Column " + (curCol + 1)));
                    firstRow.appendChild(firstRowCell);
                }
                
                // Placeholder bool to give the cell after the selected cell an id
                let nextCellID = false;
                
                // Loop through csvArr
                for(let curRow = 0; curRow < csvArr.length; curRow++)
                {
                    // Make a current row
                    let curCellRow = document.createElement("tr");
                    
                    // Make a numbered row cell
                    let numberedRowCell = document.createElement("td");
                    numberedRowCell.appendChild(document.createTextNode("Row " + (curRow + 1)));
                    curCellRow.appendChild(numberedRowCell);
                    
                    // Loop through current csvArr row
                    for(let curCol = 0; curCol < csvArr[curRow].length; curCol++)
                    {
                        // Add cell to current row
                        let curCell = document.createElement("td");
                        
                        // Set custom properties to store row and column information
                        curCell.row = curRow;
                        curCell.col = curCol;
                        
                        // If current cell is the selected cell (from earlier)
                        if(curRow == selectedCellRow && curCol == selectedCellCol)
                        {
                            // Give it an id
                            curCell.id = "selectedCell";
                            
                            // Give the next cell an id
                            nextCellID = true;
                        }
                        else if(nextCellID == true) // If this cell is the next cell
                        {
                            // Give it an id
                            curCell.id = "afterSelectedCell";
                            
                            // Don't give the next cell an id
                            nextCellID = false;
                        }
                        
                        curCellRow.appendChild(curCell);
                        
                        // Find the text content from the array
                        if(csvArr[curRow][curCol])
                        {
                            curCell.appendChild(document.createTextNode(csvArr[curRow][curCol]));
                        }
                        else
                        {
                            curCell.appendChild(document.createTextNode(""));
                        }
                        
                        // Make that thang editable
                        cellEditable(curCell, tblBody);
                    }
                    
                    // Add current row to the table
                    tblBody.appendChild(curCellRow);
                }
                
                // put the <tbody> in the <table>
                tbl.appendChild(tblBody);
                // appends <table> into tableContainer
                inputDiv.appendChild(tbl);
                
                // Apply styles to table
                tbl.setAttribute("border", "2");
                
                // Finding all cells
                let cells = tbl.querySelectorAll("td");
                
                // Making all cells not wrap
                cells.forEach((cell) => {
                    cell.style.whiteSpace = "pre";
                });
                
                // Setting background color
                tbl.style.backgroundColor = "rgb(240,240,240)";
                
                // Autosize the div
                tableAutosize(tbl.id, true);
                
                // Find the selected cell
                let selectedCell = document.getElementById("selectedCell");
                let afterSelectedCell = document.getElementById("afterSelectedCell");
                
                range = document.createRange();
                var sel = window.getSelection();
                
                if(selectedIndex <= selectedCell.textContent.length)
                {
                    range.setStart(selectedCell.firstChild, selectedIndex);
                    range.collapse(true);
                }
                else
                {
                    range.setStart(afterSelectedCell.firstChild, 0);
                    range.collapse(true);
                }
                
                sel.removeAllRanges();
                sel.addRange(range);
            }
            
            // Create and dispatch an 'input' event
            var inputEvent = new Event('input');
            textarea.dispatchEvent(inputEvent);
        });
    }
}

// Takes CSV from textArea, stores a 2d array, and displays the CSV in a new text area
function saveCSV(textarea, inContainer)
{
    // Make 'save csv' button
    let saveCsvButton = document.createElement('button');
    saveCsvButton.id = "SaveCSV";
    saveCsvButton.textContent = "Save CSV";
    saveCsvButton.style.backgroundColor = ACCENT_COLOR;
    
    // Add click event to save button
    saveCsvButton.addEventListener('click', function() {
        // If button is light
        if(buttonAccentedOrDark("SaveCSV") == "accented")
        {
            // Clear divs
            //clearDiv("errorContainer");
            clearDiv("resultContainer");
            clearDiv("modButtonContainer");
            clearDiv("modifyContainer");
            
            // Display CSV in an output text area
            displayCSVInTextarea(textarea);
            
            // Make CSV buttons
            CSVStylers();
        }
    });
    
    inContainer.appendChild(saveCsvButton);
    
    CSVErrorManager();
}

// Function to turn CSV to a 2d array
function CSVtoArray(CSV) {
    // Split CSV into rows
    let rows = CSV.split("\n"); // Array stores inputted CSV divided by every new line
    
    // Make a 2D array to store the data
    let data = [];
    
    // Loop through each index in rows
    for(let i = 0; i < rows.length; i++)
    {
        // Make a boolean to store whether we are within quotes in our element
        let inQuotes = false;

        // Save the current element
        let curElement = rows[i];
        
        // Placeholder array for current row
        let rowData = [];
        
        // Integer for storing the starting point of the current element (for use in the next loop)
        let elementStart = 0;
        
        if(curElement.length == 0)
        {
            rowData.push("");
        }
        else
        {
            // Loop through the characters of the current element
            for(let x = 0; x < curElement.length; x++)
            {
                // Setting the current index
                let curIndex = curElement[x];
                
                // If current index is a quote without a '\' in front
                if (curIndex == '"' && (x === 0 || curElement[x - 1] !== "\\"))
                {
                    // Toggle inQuotes
                    if(inQuotes == false)
                    {
                        inQuotes = true;
                    }
                    else if(inQuotes == true)
                    {
                        inQuotes = false;
                    }
                }
                
                
                // If current index is a comma at the end of the row
                /*if(x == curElement.length - 1 && (curIndex == ',' && curElement[x - 1] != '\\' && inQuotes == false))
                {
                    rowData.push("");
                }
                else */if(curIndex == ',' && curElement[x - 1] != '\\' && inQuotes == false) // If current index is a comma without a '\' in front and without quotes around it
                {
                    // Add all previous characters to rowData
                    rowData.push(curElement.substring(elementStart, x));
                    
                    // Set the elementStart to the next index
                    elementStart = x + 1;
                }
                if(x == curElement.length - 1) // If current index is the end of the row
                {
                    
                    if(curElement.substring(elementStart, x + 1) == null)
                    {
                        rowData.push("");
                    }
                    else if(curElement.substring(elementStart, x + 1) != null)
                    {
                        // Add all previous characters to rowData
                        rowData.push(curElement.substring(elementStart, x + 1));
                    }
                }
            }
        }
        
        // Add the comma-separated row to the end of "data" (2D array)
        data.push(rowData);
    }
    
    return data;
}

// Function to display the CSV in a new text area
function displayCSVInTextarea(textArea) {
    // Get the container element for displaying the result
    const resultContainer = document.getElementById("resultContainer");
    
    // Look for a text area in the container
    let resultTextArea = document.getElementById('resultArea');

    // Decide whether to create a new text area or to overwrite an existing one
    if(resultTextArea == null) // If there is no text area in div
    {
        // Create a new textarea element
        resultTextArea = document.createElement("textarea");
        resultTextArea.id = "resultArea";
        resultTextArea.placeholder = "Array data";
        resultTextArea.readOnly = true;
        
        // Make a div for the text area
        let resultDiv = document.createElement("div");
        resultDiv.id = "resultDiv";
        
        resultContainer.appendChild(resultDiv);
        
        // Append the new textarea to the div
        resultDiv.appendChild(resultTextArea);
    }
    
    // Set value to input area value
    resultTextArea.value = textArea.value;
    
    // Autosize the text area
    areaAutosize(resultTextArea.id, false);
}

// Deletes object taking in the id
function removeById(ID)
{
    // Check if object exists
    let objectExists = document.getElementById(ID) != null;
    
    // If object exists
    if(objectExists == true)
    {
        // Remove it
        let object = document.getElementById(ID);
        object.remove();
    }
}

// Makes button light if dark and dark if light
function toggleLightDark(buttonID)
{
    // Find the button
    const curButton = document.getElementById(buttonID);
    
    // Get computed style
    const computedStyle = window.getComputedStyle(curButton);
    
    // Get rgb background color
    const backgroundColor = computedStyle.backgroundColor;
    
    // If button is dark
    if(backgroundColor == "rgb(180, 180, 180)" || backgroundColor == "rgb(180,180,180)")
    {
        // Turn button light
        curButton.style.backgroundColor = "rgb(240,240,240)";
    }
    else if(backgroundColor == "rgb(240, 240, 240)" || backgroundColor == "rgb(240,240,240)") // If button is light
    {
        // Turn button dark
        curButton.style.backgroundColor = "rgb(180,180,180)";
    }
}

// Makes button light
function buttonLight(buttonID)
{
    // Find the button
    const curButton = document.getElementById(buttonID);
    
    // If button exists
    if(curButton != null)
    {
        // Turn button light
        curButton.style.backgroundColor = "rgb(240,240,240)";
    }
}

// Makes button dark
function buttonDark(buttonID)
{
    // Find the button
    const curButton = document.getElementById(buttonID);
    
    // If button exists
    if(curButton != null)
    {
        // Turn button dark
        curButton.style.backgroundColor = "rgb(180,180,180)";
    }
}

// Creates and displays line breaks given an id and container
function createLineBreak(ID, container)
{
    // Find if the line break exists
    let lineBreakExists = document.getElementById(ID) != null;
    
    // If the line break exists
    if(lineBreakExists == true)
    {
        // Remove it
        let lineBreak = document.getElementById(ID);
        lineBreak.remove();
    }
    
    let lineBreak = document.createElement('br');
    lineBreak.id = ID;
    container.appendChild(lineBreak);
}

// Function makes all CSV style buttons
function CSVStylers()
{
    // All caps, all lowercase, capitalize first
    modifyCSV();
    
    // Find the 2d array
    // Find output text area
    let resultArea = document.getElementById("resultArea");
    
    // Find array
    let twoDArray = CSVtoArray(resultArea.value);
    
    // If there are more than one columns
    if(twoDArray[0].length > 1)
    {
        // Delete columns
        deleteColumns(twoDArray);
    }
    
    // If there are more than one rows
    if(twoDArray.length > 1)
    {
        // Delete rows
        deleteRows(twoDArray);
    }
}

// Function to access rows, columns, and style elements of the csv
function modifyCSV()
{
    // Find text area
    let textArea = document.getElementById("resultArea");
    
    // Save the text
    let textContent = textArea.value;
    
    // Convert CSV to a 2d Array
    let doubleDArray = CSVtoArray(textContent);
    
    // Find the modify button container
    const modButtonContainer = document.getElementById("modButtonContainer");
    
    // Find the modify container
    const modifyContainer = document.getElementById("modifyContainer");
    
    // Make a modify CSV button
    const modifyCSVButton = document.createElement("button");
    modifyCSVButton.textContent = "Modify CSV";
    modifyCSVButton.id = "accessRowsButton";
    modifyCSVButton.addEventListener('click', function()
    {
        // Make button light
        buttonLight("accessRowsButton");
        buttonDark("deleteColumnButton");
        buttonDark("deleteRowButton");
        
        // Clear div
        clearDiv("modifyContainer");
        
        // Make div for table
        let tableContainer = document.createElement("div");
        tableContainer.id = "tableContainer";
        
        // Create a table element and a table body element
        let tbl = document.createElement("table");
        tbl.id = "modifyTable";
        let tblBody = document.createElement("tbody");
        
        // Make first row of table (select all/deselect all, column cells)
        let firstRow = document.createElement("tr");
        
        // Select all cell
        let selectAllCell = document.createElement("td");
        selectAllCell.id = "selectAllCell";
        selectAllCell.appendChild(document.createTextNode("Select All"));
        
        // Make the cell dark
        selectAllCell.style.backgroundColor = "rgb(180,180,180)";

        firstRow.appendChild(selectAllCell);
        
        // Check for browser support
        if (typeof selectAllCell.style.userSelect !== "undefined") {
            selectAllCell.style.userSelect = "none"; // Make the text unselectable
        }
        
        // add the row to the end of the table body
        tblBody.appendChild(firstRow);
        
        // sets the border attribute of tbl to '2'
        tbl.setAttribute("border", "2");
        
        // Placeholder arrays for the ids of all of the cells
        let cellIDArr = [];
        let curRowCellIDArr = [];
        
        // Loop through rows
        for(let curRow = 0; curRow < doubleDArray.length; curRow++)
        {
            // Emptying curRowCellIDArr
            curRowCellIDArr = [];
            
            // Find 1-indexed version of curRow
            let curRowOneIndexed = curRow + 1;
            
            // Make a table row for current row
            let row = document.createElement("tr");
            
            // Add row cell
            let rowCell = document.createElement("td");
            rowCell.id = "row" + curRow;
            rowCell.appendChild(document.createTextNode("Row " + curRowOneIndexed));
            row.appendChild(rowCell);
            
            // Make the cell dark
            rowCell.style.backgroundColor = "rgb(180,180,180)";
            
            // Check for browser support
            if (typeof rowCell.style.userSelect !== "undefined") {
                rowCell.style.userSelect = "none"; // Make the text unselectable
            }
            
            // Loop through the elements of current row
            for(let curElement = 0; curElement < doubleDArray[curRow].length; curElement++)
            {
                // Add cell
                let curCell = document.createElement("td");
                curCell.id = "row" + curRow + "column" + curElement;
                curCell.appendChild(document.createTextNode(cutDownToColumn(doubleDArray[curRow][curElement], curElement)));
                row.appendChild(curCell);
                
                // Add cell ID to array
                curRowCellIDArr.push(curCell.id);
                
                // Make the cell dark
                curCell.style.backgroundColor = "rgb(180,180,180)";
                
                // Add a light/dark to the cell
                curCell.addEventListener("click", function()
                {
                    // Toggle the light/dark of the cell
                    toggleLightDark(curCell.id);
                    
                    // If cell turns dark
                    if(buttonLightOrDark(curCell.id) == "dark")
                    {
                        // Make sure the row, column, and select all are dark
                        //cellsDark([rowCell.id, ("column" + (curElement + 1)), selectAllCell.id]);
                        buttonDark(rowCell.id);
                        buttonDark("column" + (curElement + 1));
                        selectAllCell.textContent = "Select All";
                        buttonDark(selectAllCell.id);
                        
                        // Find current scroll position
                        // Get the horizontal scroll position
                        let horizontalScrollPosition = tableContainer.scrollLeft;
                        
                        // Get the vertical scroll position
                        let scrollTop = tableContainer.scrollTop;
                        
                        // Autosize table container
                        tableAutosize("modifyTable", false);
                        
                        // Set the horizontal scroll position
                        tableContainer.scrollLeft = horizontalScrollPosition;
                        
                        // Set the vertical scroll position
                        tableContainer.scrollTop = scrollTop;
                    }
                    else if(buttonLightOrDark(curCell.id) == "light")
                    {
                        // Check if all cells in row are light
                        let rowLight = "light";
                        
                        for(let i = 0; i < doubleDArray[curRow].length; i++)
                        {
                            if(buttonLightOrDark("row" + curRow + "column" + i) == "dark")
                            {
                                rowLight = "dark";
                            }
                        }
                        
                        // If all cells in row are light
                        if(rowLight == "light")
                        {
                            // Make row button light
                            buttonLight("row" + curRow);
                        }
                        
                        // Check if all cells in column are light
                        let columnLight = "light";
                        
                        for(let i = 0; i < doubleDArray.length; i++)
                        {
                            if(buttonLightOrDark("row" + i + "column" + curElement) == "dark")
                            {
                                columnLight = "dark";
                            }
                        }
                        
                        // If all cells in column are light
                        if(columnLight == "light")
                        {
                            // Make row button light
                            buttonLight("column" + (curElement + 1));
                        }
                        
                        // Check if all cells are light
                        // If all cells in column are light, and all cells in row are light
                        if(rowLight == "light" && columnLight == "light")
                        {
                            // Check if all column buttons are light
                            let columnButtonsLight = "light";
                            
                            for(let i = 1; i <= doubleDArray[0].length; i++)
                            {
                                if(buttonLightOrDark("column" + i) == "dark")
                                {
                                    columnButtonsLight = "dark";
                                }
                            }
                            // If all column buttons are light
                            if(columnButtonsLight == "light")
                            {
                                // Make select all button light
                                buttonLight(selectAllCell.id);
                                selectAllCell.textContent = "Deselect All";
                                
                                // Find current scroll position
                                // Get the horizontal scroll position
                                let horizontalScrollPosition = tableContainer.scrollLeft;
                                
                                // Get the vertical scroll position
                                let scrollTop = tableContainer.scrollTop;
                                
                                // Autosize table container
                                tableAutosize("modifyTable", false);
                                
                                // Set the horizontal scroll position
                                tableContainer.scrollLeft = horizontalScrollPosition;
                                
                                // Set the vertical scroll position
                                tableContainer.scrollTop = scrollTop;
                            }
                        }
                        
                        // Update the column, row, and select all
                    }
                });
                
                // Check for browser support
                if (typeof curCell.style.userSelect !== "undefined") {
                    curCell.style.userSelect = "none"; // Make the text unselectable
                }
            }
            
            // Add current row of cell IDs to the overall ID placeholder
            cellIDArr.push(curRowCellIDArr);
            
            // Add row cells to table body
            tblBody.appendChild(row);
            
            // Add onclick to current row cell
            rowCell.addEventListener('click', function()
            {
                // Add light/dark toggle
                toggleLightDark(rowCell.id);
                
                // If row cell is light
                if(buttonLightOrDark(rowCell.id) == "light")
                {
                    // Make all buttons in the row light
                    cellsLight(cellIDArr[curRow]);
                }
                else if(buttonLightOrDark(rowCell.id) == "dark") // If row cell is dark
                {
                    // Make all cells in the row dark
                    cellsDark(cellIDArr[curRow]);
                }
            });
        }
        
        // Add onclick to column cell
        // Loop through the rest of the row to make column cells
        for(let i = 1; i <= doubleDArray[0].length; i++)
        {
            let columnCell = document.createElement("td");
            columnCell.id = "column" + i;
            columnCell.appendChild(document.createTextNode("Column " + i));
            
            // Make the cell dark
            columnCell.style.backgroundColor = "rgb(180,180,180)";
            
            // Add a light/dark toggle
            columnCell.addEventListener("click", function()
            {
                toggleLightDark(columnCell.id);
                
                // If column cell is light
                if(buttonLightOrDark(columnCell.id) == "light")
                {
                    // Make all buttons in the row light
                    cellsLight(columnFromTwoDArr(cellIDArr, i));
                }
                else if(buttonLightOrDark(columnCell.id) == "dark") // If row cell is dark
                {
                    // Make all cells in the row dark
                    cellsDark(columnFromTwoDArr(cellIDArr, i));
                }
            });
            
            firstRow.appendChild(columnCell);
            
            // Check for browser support
            if (typeof columnCell.style.userSelect !== "undefined") {
                columnCell.style.userSelect = "none"; // Make the text unselectable
            }
        }
        
        // Add onclick to select all/deselect all cell
        selectAllCell.addEventListener("click", function()
        {
            // Add a light/dark toggle to the cell
            toggleLightDark(selectAllCell.id);
            
            // If cell is light
            if(buttonLightOrDark(selectAllCell.id) == "light")
            {
                // Set text to "Deselect all"
                selectAllCell.textContent = "Deselect All";
                
                // Make all buttons in the row light
                cellsLight(cellIDArr);
                
                // Find current scroll position
                // Get the horizontal scroll position
                let horizontalScrollPosition = tableContainer.scrollLeft;
                
                // Get the vertical scroll position
                let scrollTop = tableContainer.scrollTop;
                
                // Autosize table container
                tableAutosize("modifyTable", false);
                
                // Set the horizontal scroll position
                tableContainer.scrollLeft = horizontalScrollPosition;
                
                // Set the vertical scroll position
                tableContainer.scrollTop = scrollTop;
            }
            else if(buttonLightOrDark(selectAllCell.id) == "dark") // If row cell is dark
            {
                // Set text to ""
                selectAllCell.textContent = "Select All";
                
                // Make all cells in the row dark
                cellsDark(cellIDArr);
                
                // Find current scroll position
                // Get the horizontal scroll position
                let horizontalScrollPosition = tableContainer.scrollLeft;
                
                // Get the vertical scroll position
                let scrollTop = tableContainer.scrollTop;
                
                // Autosize table container
                tableAutosize("modifyTable", false);
                
                // Set the horizontal scroll position
                tableContainer.scrollLeft = horizontalScrollPosition;
                
                // Set the vertical scroll position
                tableContainer.scrollTop = scrollTop;
            }
        });
        
        // put the <tbody> in the <table>
        tbl.appendChild(tblBody);
        // appends <table> into tableContainer
        tableContainer.appendChild(tbl);
        
        // Apply the CSS styles
        let cells = tbl.querySelectorAll("td"); // Finding all cells
        
        // Making all cells not wrap
        cells.forEach((cell) => {
            cell.style.whiteSpace = "nowrap";
        });
        
        // Setting background color
        tbl.style.backgroundColor = "rgb(240,240,240)";
        
        // Setting all text to monospaced
        /*for (const cell of cells) {
            cell.style.fontFamily = 'monospace';
        }*/
        
        // AAAAAHHHHH!!!!! vvv
        /*tableContainer.style.overflowX = "auto"; // Making the table scrollable (from side-to-side)
        
        // Set the width of the container
        let windowSize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        windowSize = windowSize * 0.95;
        tableContainer.style.width = windowSize + 'px';
        modifyContainer.appendChild(tableContainer);
        
        // Set a maximum height
        let MAX_HEIGHT = window.innerHeight * 0.33;
        
        // Set the maximum height
        tableContainer.style.maxHeight = MAX_HEIGHT + "px";*/
        
        modifyContainer.appendChild(tableContainer);
        
        tableAutosize("modifyTable", false);
        // AAAAAHHHHH!!!!! ^^^
        
        // “uppercase first”, “uppercase all”, “lowercase all,” "titlecase," and "empty element" buttons
        // Uppercase first button
        let upperFirstButton = document.createElement("button");
        upperFirstButton.textContent = "Uppercase first";
        upperFirstButton.id = "upperFirstButton";
        upperFirstButton.style.backgroundColor = "rgb(180,180,180)";
        upperFirstButton.addEventListener('click', function() {
            toggleLightDark("upperFirstButton");
            buttonDark("upperAllButton");
            buttonDark("lowerAllButton");
            buttonDark("titlecaseButton");
            buttonDark("emptyElementButton");
        });
        modifyContainer.appendChild(upperFirstButton);
        
        // Uppercase all button
        let upperAllButton = document.createElement("button");
        upperAllButton.textContent = "Uppercase all";
        upperAllButton.id = "upperAllButton";
        upperAllButton.style.backgroundColor = "rgb(180,180,180)";
        upperAllButton.addEventListener('click', function() {
            buttonDark("upperFirstButton");
            toggleLightDark("upperAllButton");
            buttonDark("lowerAllButton");
            buttonDark("titlecaseButton");
            buttonDark("emptyElementButton");
        });
        modifyContainer.appendChild(upperAllButton);
        
        // Lowercase all button
        let lowerAllButton = document.createElement("button");
        lowerAllButton.textContent = "Lowercase all";
        lowerAllButton.id = "lowerAllButton";
        lowerAllButton.style.backgroundColor = "rgb(180,180,180)";
        lowerAllButton.addEventListener('click', function() {
            buttonDark("upperFirstButton");
            buttonDark("upperAllButton");
            toggleLightDark("lowerAllButton");
            buttonDark("titlecaseButton");
            buttonDark("emptyElementButton");
        });
        modifyContainer.appendChild(lowerAllButton);
        
        // Titlecase button
        let titlecaseButton = document.createElement("button");
        titlecaseButton.textContent = "Titlecase";
        titlecaseButton.id = "titlecaseButton";
        titlecaseButton.style.backgroundColor = "rgb(180,180,180)";
        titlecaseButton.addEventListener('click', function() {
            buttonDark("upperFirstButton");
            buttonDark("upperAllButton");
            buttonDark("lowerAllButton");
            toggleLightDark("titlecaseButton");
            buttonDark("emptyElementButton");
        });
        modifyContainer.appendChild(titlecaseButton);
        
        // Empty element button
        let emptyElementButton = document.createElement("button");
        emptyElementButton.textContent = "Empty element";
        emptyElementButton.id = "emptyElementButton";
        emptyElementButton.style.backgroundColor = "rgb(180,180,180)";
        emptyElementButton.addEventListener('click', function() {
            buttonDark("upperFirstButton");
            buttonDark("upperAllButton");
            buttonDark("lowerAllButton");
            buttonDark("titlecaseButton");
            toggleLightDark("emptyElementButton");
        });
        modifyContainer.appendChild(emptyElementButton);
        
        // Add a line break
        createLineBreak("afterStyleButtons", modifyContainer);
        
        // Make “save choices” button
        let saveChoices = document.createElement("button");
        saveChoices.textContent = "Save choices";
        saveChoices.id = "saveChoicesButton";
        saveChoices.addEventListener('click', function() {
            // Find what style to apply to the selected text
            // Placeholder for what style is selected
            let style = "none";
            
            if(buttonLightOrDark(upperFirstButton.id) === "light") // Upper first is selected
            {
                style = "upperFirst"; // Set style to upper first
            }
            else if(buttonLightOrDark(upperAllButton.id) === "light") // Upper all is selected
            {
                style = "upperAll"; // Set style to upper all
            }
            else if(buttonLightOrDark(lowerAllButton.id) === "light") // Lower all is selected
            {
                style = "lowerAll"; // Set style to lower all
            }
            else if(buttonLightOrDark(titlecaseButton.id) === "light") // Titlecase is selected
            {
                style = "titlecase"; // Set style to titlecase
            }
            else if(buttonLightOrDark(emptyElementButton.id) === "light") // Empty element is selected
            {
                style = "emptyElement"; // Set style to empty element
            }
            
            // Make a shallow copy of doubleDArray
            let doubleDCopy = doubleDArray.map(row => [...row]);
            
            // Loop through cellIDArr array and apply styles
            for(let i = 0; i < cellIDArr.length; i++) // Loop through rows
            {
                for(let x = 0; x < cellIDArr[i].length; x++) // Loop through columns
                {
                    // If current button is selected
                    if(buttonLightOrDark(cellIDArr[i][x]) == "light")
                    {
                        // Style the current element
                        if(style === "upperFirst") // If style is uppercase first
                        {
                            // Uppercase first
                            doubleDCopy[i][x] = uppercaseFirst(doubleDCopy[i][x]);
                        }
                        else if(style === "upperAll") // If style is uppercase all
                        {
                            // Uppercase all
                            doubleDCopy[i][x] = doubleDCopy[i][x].toUpperCase();
                        }
                        else if(style === "lowerAll") // If style is lowercase all
                        {
                            // Lowercase all
                            doubleDCopy[i][x] = doubleDCopy[i][x].toLowerCase();
                        }
                        else if(style === "titlecase") // If style is titlecase
                        {
                            // Titlecase
                            doubleDCopy[i][x] = doubleDCopy[i][x].toTitleCase();
                        }
                        else if(style === "emptyElement") // If style is empty element
                        {
                            // Empty element
                            doubleDCopy[i][x] = "";
                        }
                    }
                }
            }
            
            // Add a line break
            //createLineBreak("afterSaveChoicesButton", modifyContainer);
            
            // Make text area and save buttons
            afterStyleTextArea(doubleDCopy);
        });
        
        modifyContainer.appendChild(saveChoices);
        
        // Add 'copy' button and 'save as file' button
        accentButton("saveChoicesButton");
    });
    
    modButtonContainer.appendChild(modifyCSVButton);
    
    // Make button dark
    buttonDark("accessRowsButton");
}

// Titlecase function
String.prototype.toTitleCase = function() {
    var i, j, str, lowers, uppers;
    str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless 
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
        function(txt) {
        return txt.toLowerCase();
        });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
        uppers[i].toUpperCase());

    return str;
}

// Handles the text content in modify tables
function cutDownToColumn(cellTextContent, column)
{
    // Convert column to one-indexed
    let columnNum = column + 1;
    
    // Find the string of the column string
    let columnString = "Column " + columnNum;
    
    // If the text content has more characters than the column string
    if(cellTextContent.length > columnString.length)
    {
        // Cut down the text to 3 less than the column string
        let newCellText = cellTextContent.substring(0, columnString.length - 3);
        
        // Add '...' to the end of the text
        newCellText = newCellText + "...";
        
        // Return newCellText
        return newCellText;
    }
    else
    {
        // Return input text
        return cellTextContent;
    }
}

// Handles autosizing the table container
function tableAutosize(tableID, ongoing)
{
    // Find the table
    let theTable = document.getElementById(tableID);
    
    // Find table container
    let tableContainer = theTable.parentElement;
    
    // Find max width
    let MAX_WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    MAX_WIDTH = MAX_WIDTH * 0.98;
    
    // Run preconditions on parent div
    // Make a rounded black border on the div
    tableContainer.style.border = "1px solid black";
    tableContainer.style.borderRadius = '3px';
    
    // Set parent div size
    tableContainer.style.width = "0px";
    tableContainer.style.width = tableContainer.scrollWidth + "px";
    
    tableContainer.style.height = "0px";
    tableContainer.style.height = tableContainer.scrollHeight + "px";
    
    // Make the horizontal scrollbar disappear
    tableContainer.style.overflowX = 'visible';
    
    // Find the normal difference of tableContainer.offsetWidth and tableContainer.clientWidth (used for vertical scrollbar width later on)
    let NORMAL_MARGIN = tableContainer.offsetWidth - tableContainer.clientWidth;
    
    // Have the div overflow horizontally to make a scrollbar
    tableContainer.style.overflowX = 'auto';
    
    // Run initial autosize
    autosizeHandler();
    
    // If it is ongoing
    if(ongoing == true)
    {
        // Set autosize to the input event off the text area
        theTable.addEventListener('input', function()
        {
            autosizeHandler();
        });
    }
    
    // Autsizes that thang
    function autosizeHandler()
    {
        // Deal with parent width
        tableContainer.style.width = "0px";
        tableContainer.style.width = tableContainer.scrollWidth + "px";
        
        // Deal with parent height
        tableContainer.style.height = "auto";
        
        // If parent div's height is greater than a quarter of the screen
        if(tableContainer.scrollHeight > window.innerHeight * 0.25)
        {
            // Set parent area height a quarter of the screen height
            tableContainer.style.height = window.innerHeight * 0.25 + "px";
        }
        
        // If difference between tableContainer.offsetWidth and tableContainer.clientWidth is greater than normal
        if(tableContainer.offsetWidth - tableContainer.clientWidth > NORMAL_MARGIN)
        {
            // Add difference to the width
            tableContainer.style.width = parseInt(tableContainer.style.width) + ((tableContainer.offsetWidth - tableContainer.clientWidth) - NORMAL_MARGIN) + "px";
        }
        
        // Check maximum size of parent div
        // If parent div's width is greater than the max width
        if(parseInt(tableContainer.style.width) > MAX_WIDTH)
        {
            // Set parent area width to the max width
            tableContainer.style.width = MAX_WIDTH + "px";
        }
    }
}

// Return the column given the passed arraay and column number
function columnFromTwoDArr(passedArr, passedColumn)
{
    // Convert passedColumn to zero-indexed
    let column = passedColumn - 1;
    
    // Placeholder array for the column
    let columnArr = [];
    
    // Loop through passedArr
    for(let i = 0; i < passedArr.length; i++)
    {
        columnArr.push(passedArr[i][column]);
    }
    
    return columnArr;
}

// Make passed array of cell IDs light
function cellsLight(passedArr)
{
    for(let i = 0; i < passedArr.length; i++)
    {
        // If current element is an array
        if(Array.isArray(passedArr[i]) == true)
        {
            // Loop through it
            for(let j = 0; j < passedArr[i].length; j++)
            {
                if(buttonLightOrDark(passedArr[i][j]) == "dark")
                {
                    clickElement(passedArr[i][j]);
                }
            }
        }
        else // Else
        {
            if(buttonLightOrDark(passedArr[i]) == "dark")
            {
                clickElement(passedArr[i]);
            }
        }
    }
}

// Make passed array of cell IDs dark
function cellsDark(passedArr)
{
    for(let i = 0; i < passedArr.length; i++)
    {
        // If current element is an array
        if(Array.isArray(passedArr[i]) == true)
        {
            // Loop through it
            for(let j = 0; j < passedArr[i].length; j++)
            {
                if(buttonLightOrDark(passedArr[i][j]) == "light")
                {
                    clickElement(passedArr[i][j]);
                }
            }
        }
        else // Else
        {
            if(buttonLightOrDark(passedArr[i]) == "light")
            {
                clickElement(passedArr[i]);
            }
        }
    }
}

// Clicks an element given the id
function clickElement(passedID)
{
    // Find the element from the ID
    let clickerElement = document.getElementById(passedID);
    
    // If the element exists
    if(clickerElement)
    {
        // Click it
        clickerElement.click();
    }
}

// Makes a button to delete selected columns
function deleteColumns(doubleDArray)
{
    /*// Find text area and save the text
    let textArea = document.getElementById("resultArea");
    
    let textContent = textArea.value;
    
    // Convert CSV to a 2d Array
    let doubleDArray = CSVtoArray(textContent);*/
    
    // Find the modify button container
    const modButtonContainer = document.getElementById("modButtonContainer");
    
    // Find the modify container
    const modifyContainer = document.getElementById("modifyContainer");
    
    // Create delete columns button
    let columnButton = document.createElement("button");
    columnButton.id = "deleteColumnButton";
    columnButton.textContent = "Delete column(s)";
    columnButton.addEventListener('click', function()
    {
        // Make button light
        buttonDark("accessRowsButton");
        buttonLight("deleteColumnButton");
        buttonDark("deleteRowButton");
        
        // Clear div
        clearDiv("modifyContainer");
        
        // Make a div for the table to be wrapped in
        let columnDiv = document.createElement('div');
        columnDiv.id = "columnDiv";
        
        // Make table and table body
        let tbl = document.createElement("table");
        tbl.id = "deleteColumnsTable";
        let tblBody = document.createElement("tbody");
        
        // Make two table rows
        let firstRow = document.createElement("tr");
        let secondRow = document.createElement("tr");
        
        // Make a 2d array with two rows (for storing the ids of the cells in each row)
        let cellIDArr = [[],[]];
        
        // Loop through the columns of the 2d array
        for(let i = 0; i < doubleDArray[0].length; i++)
        {
            // Make a cell for the column title
            let columnTitleCell = document.createElement("td");
            columnTitleCell.appendChild(document.createTextNode("Column " + (i + 1)));
            columnTitleCell.id = "column" + (i + 1);
            
            // Add column title id to first row of id array
            cellIDArr[0].push(columnTitleCell.id);
            
            // Add column title cell to first table row
            firstRow.appendChild(columnTitleCell);
            
            // Make the cell dark
            columnTitleCell.style.backgroundColor = "rgb(180,180,180)";
            
            // Make the text unselectable
            if (typeof columnTitleCell.style.userSelect !== "undefined") // Check for browser support
            {
                columnTitleCell.style.userSelect = "none";
            }
            
            // Make a cell for the column preview
            let columnPreviewCell = document.createElement("td");
            columnPreviewCell.id = "preview" + i;
            
            // Make the column preview
            columnPreviewCell.appendChild(document.createTextNode(columnPreview(i))); //Set text of column preview to shortened version of the first row of the column
            
            // Add column preview cell id to second row of id array
            cellIDArr[1].push(columnPreviewCell.id);
            
            // Add column preview cell to second table row
            secondRow.appendChild(columnPreviewCell);
            
            // Make the cell dark
            columnPreviewCell.style.backgroundColor = "rgb(180,180,180)";
            
            // Make the text unselectable
            if (typeof columnPreviewCell.style.userSelect !== "undefined") // Check for browser support
            {
                columnPreviewCell.style.userSelect = "none";
            }
            
            // Add onclick events to column title cell and column preview cell
            // columnTitleCell light/dark toggle
            columnTitleCell.addEventListener("click", function()
            {
                toggleLightDark(columnTitleCell.id);
                toggleLightDark(columnPreviewCell.id);
            });
            
            
            // columnPreviewCell light/dark toggle
            columnPreviewCell.addEventListener("click", function()
            {
                toggleLightDark(columnPreviewCell.id);
                toggleLightDark(columnTitleCell.id);
            });
        }
        
        // Add both table rows to the table body
        tblBody.appendChild(firstRow);
        tblBody.appendChild(secondRow);
        
        // Add table body to table
        tbl.appendChild(tblBody);
        
        // Apply styles to table
        // sets the border attribute of tbl to '2'
        tbl.setAttribute("border", "2");
        
        // Apply the CSS styles
        let cells = tbl.querySelectorAll("td"); // Finding all cells
        
        // Making all cells not wrap
        cells.forEach((cell) => {
            cell.style.whiteSpace = "pre";
        });
        
        // Setting background color
        tbl.style.backgroundColor = "rgb(240,240,240)";
        
        // Setting all text to monospaced
        /*for (const cell of cells) {
            cell.style.fontFamily = 'monospace'; // Use 'Courier New' or your preferred monospaced font
        }*/
        
        // Add table to table div
        columnDiv.appendChild(tbl);
        
        // Add div to screen
        modifyContainer.appendChild(columnDiv);
        
        // Autosize div
        tableAutosize("deleteColumnsTable", false);
        
        // Make a 'save' button
        let saveButton = document.createElement("button");
        saveButton.id = "deleteColumnsSaveButton";
        saveButton.textContent = "Save";
        saveButton.addEventListener('click', function() {
            // Placeholder array for storing column-deleted CSV
            let placeholderCSV = JSON.parse(JSON.stringify(doubleDArray));
            
            // Looping through cells in reverse to find selected cells
            for(let i = cellIDArr[0].length - 1; i >= 0; i--)
            {
                // If button is light/selected
                if(buttonLightOrDark(cellIDArr[0][i]) === "light")
                {
                    // Loop through rows of CSV and delete that column in placeholder array
                    for(let x = 0; x < placeholderCSV.length; x++)
                    {
                        // Delete element from column of current row
                        placeholderCSV[x].splice(i, 1);
                    }
                }
            }
            
            // Find if the array is empty
            const isAllSubarraysEmpty = placeholderCSV.every(subarray => subarray.length === 0);
            
            // If array is empty
            if(isAllSubarraysEmpty == true)
            {
                // Set it to more empty (afterStyleTextArea interprets it better)
                placeholderCSV = [];
            }
            
            // Make text area and save buttons
            afterStyleTextArea(placeholderCSV);
        });
        
        // Append the save button
        modifyContainer.appendChild(saveButton);
        
        accentButton("deleteColumnsSaveButton");
        
        // Takes in the column, and outputs the column preview
        function columnPreview(passedColumn)
        {
            // Placeholder string for the column preview
            let previewReturn = "";
            
            // Loop through rows of 2d array
            for(let i = 0; i < doubleDArray.length; i++)
            {
                // Add string from current row to previewReturn
                previewReturn += cutDownToColumn(doubleDArray[i][passedColumn], passedColumn);
                
                // If it is not the last iteration of this loop
                if(i < doubleDArray.length - 1)
                {
                    previewReturn += "\n";
                }
            }
            
            // Return previewReturn
            return previewReturn;
        }
    });
    
    // Append to button container
    modButtonContainer.appendChild(columnButton);
    
    // Make button dark
    buttonDark("deleteColumnButton");
}

// Makes a button to delete selected rows
function deleteRows(doubleDArray)
{
    /*// Find text area and save the text
    let textArea = document.getElementById("resultArea");
    
    let textContent = textArea.value;
    
    // Convert CSV to a 2d Array
    let doubleDArray = CSVtoArray(textContent);*/
    
    // Find the modify button container
    const modButtonContainer = document.getElementById("modButtonContainer");
    
    // Find the modify container
    const modifyContainer = document.getElementById("modifyContainer");
    
    // Create delete rows button
    let rowButton = document.createElement("button");
    rowButton.id = "deleteRowButton";
    rowButton.textContent = "Delete row(s)";
    rowButton.addEventListener('click', function()
    {
        // Make button light
        buttonDark("accessRowsButton");
        buttonDark("deleteColumnButton");
        buttonLight("deleteRowButton");
        
        // Clear div
        clearDiv("modifyContainer");
        
        // Make a div for the table to be wrapped in
        let rowDiv = document.createElement('div');
        rowDiv.id = "rowDiv";
        
        // Make table and table body
        let tbl = document.createElement("table");
        tbl.id = "deleteRowsTable";
        let tblBody = document.createElement("tbody");
        
        // Make a 2d array for storing the ids of the cells
        let cellIDArr = [];
        
        // Loop through the rows of the 2d array
        for(let i = 0; i < doubleDArray.length; i++)
        {
            // Make an array storing the ids of the cells of the current row
            let curRowCellIDArr = [];
            
            // Make a table row
            let curTableRow = document.createElement("tr");
            
            // Make a cell for the row title
            let rowTitleCell = document.createElement("td");
            rowTitleCell.appendChild(document.createTextNode("Row " + (i + 1)));
            rowTitleCell.id = "row" + (i + 1);
            
            // Add row title id to curRowCellIDArr
            curRowCellIDArr.push(rowTitleCell.id);
            
            // Add row title cell to curTableRow
            curTableRow.appendChild(rowTitleCell);
            
            // Make the cell dark
            rowTitleCell.style.backgroundColor = "rgb(180,180,180)";
            
            // Make the text unselectable
            if (typeof rowTitleCell.style.userSelect !== "undefined") // Check for browser support
            {
                rowTitleCell.style.userSelect = "none";
            }
            
            // Make a cell for the row preview
            let rowPreviewCell = document.createElement("td");
            rowPreviewCell.id = "preview" + i;
            
            // Make the row preview
            rowPreviewCell.appendChild(document.createTextNode(rowPreview(i))); //Set text of row preview to stringified version of the current row
            
            // Add row preview cell id to curRowCellIDArr
            curRowCellIDArr.push(rowPreviewCell.id);
            
            // Add row preview cell to curTableRow
            curTableRow.appendChild(rowPreviewCell);
            
            // Make the cell dark
            rowPreviewCell.style.backgroundColor = "rgb(180,180,180)";
            
            // Make the text unselectable
            if (typeof rowPreviewCell.style.userSelect !== "undefined") // Check for browser support
            {
                rowPreviewCell.style.userSelect = "none";
            }
            
            // Add onclick events to row title cell and row preview cell
            // rowTitleCell light/dark toggle
            rowTitleCell.addEventListener("click", function()
            {
                toggleLightDark(rowTitleCell.id);
                toggleLightDark(rowPreviewCell.id);
            });
            
            
            // rowPreviewCell light/dark toggle
            rowPreviewCell.addEventListener("click", function()
            {
                toggleLightDark(rowPreviewCell.id);
                toggleLightDark(rowTitleCell.id);
            });
            
            // Add table row to the table body
            tblBody.appendChild(curTableRow);
            
            // Add curRowCellIDArr to cellIDArr
            cellIDArr.push(curRowCellIDArr);
        }
        
        // Add table body to table
        tbl.appendChild(tblBody);
        
        // Apply styles to table
        // sets the border attribute of tbl to '2'
        tbl.setAttribute("border", "2");
        
        // Apply the CSS styles
        let cells = tbl.querySelectorAll("td"); // Finding all cells
        
        // Making all cells not wrap
        cells.forEach((cell) => {
            cell.style.whiteSpace = "pre";
        });
        
        // Setting background color
        tbl.style.backgroundColor = "rgb(240,240,240)";
        
        // Setting all text to monospaced
        /*for (const cell of cells) {
            cell.style.fontFamily = 'monospace'; // Use 'Courier New' or your preferred monospaced font
        }*/
        
        // Add table to table div
        rowDiv.appendChild(tbl);
        
        // Add div to screen
        modifyContainer.appendChild(rowDiv);
        
        // Autosize div
        tableAutosize("deleteRowsTable", false);
        
        // Make a 'save' button
        let saveButton = document.createElement("button");
        saveButton.id = "deleteColumnsSaveButton";
        saveButton.textContent = "Save";
        saveButton.addEventListener('click', function() {
            // Placeholder array for storing row-deleted CSV
            let placeholderCSV = JSON.parse(JSON.stringify(doubleDArray));
            
            // Looping through buttons in reverse to find selected buttons
            for(let i = cellIDArr.length - 1; i >= 0; i--)
            {
                // If button is light/selected
                if(buttonLightOrDark(cellIDArr[i][0]) === "light")
                {
                    // Loop through rows of CSV and delete that row in placeholder array
                    placeholderCSV.splice(i, 1);
                }
            }
            
            // Make text area and save buttons
            afterStyleTextArea(placeholderCSV)
        });
        
        // Append the save button
        modifyContainer.appendChild(saveButton);
        
        accentButton("deleteColumnsSaveButton");
        
        // Takes in the row, and outputs the row preview
        function rowPreview(passedRow)
        {
            // Placeholder string for the column preview
            let previewReturn = "";
            
            // Loop through columns of passed row2d array
            for(let i = 0; i < doubleDArray[passedRow].length; i++)
            {
                // Add string from current column to previewReturn
                previewReturn += doubleDArray[passedRow][i];
                
                // If it is not the last iteration of this loop
                if(i < doubleDArray[passedRow].length - 1)
                {
                    previewReturn += ",";
                }
            }
            
            // Return previewReturn
            return previewReturn;
        }
    });
    
    // Append to button container
    modButtonContainer.appendChild(rowButton);
    
    // Make button dark
    buttonDark("deleteRowButton");
}

// Returns inputted string with a capitalized first character
function uppercaseFirst(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Returns if button from parameter is accented or dark
function buttonAccentedOrDark(buttonID)
{
    // Find current button
    let curButton = document.getElementById(buttonID);
    
    // Get computed style
    let computedStyle = window.getComputedStyle(curButton);
    
    // Get rgb background color
    const backgroundColor = computedStyle.backgroundColor;
    
    // If button is dark
    if(backgroundColor == "rgb(180, 180, 180)" || backgroundColor == "rgb(180,180,180)")
    {
        // Return "dark"
        return "dark";
    }
    else if(backgroundColor == ACCENT_COLOR || backgroundColor == ACCENT_COLOR.replace(/\s+/g, '')) // If button is accented
    {
        // Return "accented"
        return "accented";
    }
}

// Returns if button from parameter is light or dark
function buttonLightOrDark(buttonID)
{
    // Find current button
    let curButton = document.getElementById(buttonID);
    
    // Get computed style
    let computedStyle = window.getComputedStyle(curButton);
    
    // Get rgb background color
    const backgroundColor = computedStyle.backgroundColor;
    
    // If button is dark
    if(backgroundColor == "rgb(180, 180, 180)" || backgroundColor == "rgb(180,180,180)")
    {
        // Return "dark"
        return "dark";
    }
    else if(backgroundColor == "rgb(240, 240, 240)" || backgroundColor == "rgb(240,240,240)") // If button is light
    {
        // Return "light"
        return "light";
    }
}

// Takes 2d array as a parameter and returns CSV (made by ChatGPT)
function twoDToCSV(twoDimensionArray) {
    let csvString = '';

    for (let i = 0; i < twoDimensionArray.length; i++) {
    csvString += twoDimensionArray[i].join(',');
    
    // Add newline character if not the last row
    if (i < twoDimensionArray.length - 1) {
        csvString += '\n';
    }
    }

    return csvString;
}

// Clears all children in a div
function clearDiv(divID)
{
    // Finding the parameter div from ID
    let myDiv = document.getElementById(divID);

    // Remove all child elements from the <div>
    while (myDiv.firstChild) {
        myDiv.removeChild(myDiv.firstChild);
    }
}

// Makes a text area with inputted CSV and makes the save buttons (for after styling/modifying the csv)
function afterStyleTextArea(twoDArr) // Make it replace the text content, not make a brand new text area!
{
    // Find the modify container
    let modifyContainer = document.getElementById("modifyContainer");
    
    // Look for a text area in the container
    let styledArea = document.getElementById('styledArea');

    // Decide whether to create a new text area or to overwrite an existing one
    if(styledArea == null) // If there is no text area in div
    {
        // Create a new textarea element
        styledArea = document.createElement("textarea");
        styledArea.id = "styledArea";
        styledArea.placeholder = "Styled array";
        styledArea.readOnly = true;
        
        // Make a div for the text area
        let styledDiv = document.createElement("div");
        styledDiv.id = "styledDiv";
        
        modifyContainer.appendChild(styledDiv);
        
        // Append the new textarea to the div
        styledDiv.appendChild(styledArea);
    }
    
    // Set the value of the textarea to the CSV
    styledArea.value = twoDToCSV(twoDArr);
    
    // Autosize the text area
    areaAutosize("styledArea", false);
    
    // Make 'copy,' 'modify again,' and 'save as file' buttons
    // Remove modify again button
    removeById("modifyAgainButton");
    
    // Make modify again button
    let modButton = document.createElement("button");
    modButton.id = "modifyAgainButton";
    modButton.textContent = "Modify again";
    modButton.addEventListener('click', modButtonClickHandler);
    modifyContainer.appendChild(modButton);
    
    // Handles the 'modify again' button
    function modButtonClickHandler()
    {
        // Clear result and modify button containers
        clearDiv("resultContainer");
        clearDiv("modButtonContainer");
        
        displayCSVInTextarea(styledArea);
        
        // Make the modify buttons
        CSVStylers();
        
        // Clear modify container
        clearDiv("modifyContainer");
    }
    
    // Remove copy button
    removeById("copyButton");
    
    // Make copy button
    let copyButton = document.createElement("button");
    copyButton.id = "copyButton";
    copyButton.textContent = "Copy";
    copyButton.addEventListener('click', copyButtonClickHandler);
    modifyContainer.appendChild(copyButton);
    
    // Make a click enabled placeholder
    let copyButtonEnabled = true;
    
    // Handles the 'copy' button
    function copyButtonClickHandler()
    {
        if(copyButtonEnabled == true)
        {
            // Create a temporary textarea to hold the content
            let tempTextArea = document.createElement('textarea');
            
            // Set the value/text of the temporary text area
            tempTextArea.value = styledArea.value;
            
            // Add the temporary textarea to the DOM
            document.body.appendChild(tempTextArea);

            // Select the text from the temporary textarea
            tempTextArea.select();

            // Copy the selected text to the clipboard
            document.execCommand('copy');

            // Clean up: remove the temporary textarea
            tempTextArea.remove();
            
            // Disable clicks
            copyButtonEnabled = false;
            
            // Add copy animation
            copyButton.textContent = "Copied!";
            
            // Wait 1 second
            setTimeout(function () {
                // Enable clicks
                copyButtonEnabled = true;
                
                // Finish copy animation
                copyButton.textContent = "Copy";
            }, 1000); // You can adjust the delay time (in milliseconds) as needed
        }
    }
    
    // Remove save.csv button
    removeById("saveCSVButton");
    
    // Make save.csv button
    let CSVButton = document.createElement("button");
    CSVButton.id = "saveCSVButton";
    CSVButton.textContent = "Save.csv";
    
    // Make a click enabled placeholder
    let CSVButtonEnabled = true;
    
    CSVButton.addEventListener('click', function()
    {
        saveCSVFile(styledArea.value, "data.csv");
    });
    modifyContainer.appendChild(CSVButton);
    
    // Handles the 'save.csv' button (made by ChatGPT)
    function saveCSVFile(csvString, filename)
    {
        if(CSVButtonEnabled == true)
        {
            // Create a Blob from the CSV string
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            
            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);
            
            // Create an anchor element for the download link
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            
            // Programmatically trigger a click event on the anchor element
            link.click();
            
            // Release the URL object
            URL.revokeObjectURL(url);
            
            // Disable clicks
            CSVButtonEnabled = false;
            
            // Add copy animation
            CSVButton.textContent = "Saving!";
            
            // Wait 1 second
            setTimeout(function () {
                // Enable clicks
                CSVButtonEnabled = true;
                
                // Finish copy animation
                CSVButton.textContent = "Save.csv";
            }, 1000); // You can adjust the delay time (in milliseconds) as needed
        }
    }
}

// Returns "Errors," "No errors," and "Potential errors." Manages the error alerts and buttons.
function CSVErrorManager()
{
    /*
    Flow:
    -As the user types, pastes, or exports a file, I want the error buttons to auto-populate (on the input event listener of the input text area).
    -Because this would eliminate the “scan for errors” button (because the function that button activates is now running on the input listener of the text area), I don’t get the alert for what errors are present.
    -Because I don’t get the alert for what errors are present, the error buttons will have to show how many errors are present
    -Because I don’t like having error buttons with no errors present, error buttons will only be made for errors that have at least one instance
    -Because I don’t like the save CSV button being clickable when there are errors present, disable it when there are errors
    -Because it might confuse the user as to why the save button is disabled, add a hover title (the text that activates when you hover your mouse over the button) that explains why it is disabled*/
    
    // Find toggle table view button
    let toggleTableButton = document.getElementById("toggleTableButton");
    /*toggleTableButton.id = "toggleTableButton";
    toggleTableButton.textContent = "Toggle table view";
    toggleTableButton.textContent = "Toggle text area view";*/
    
    // Find save csv button
    let saveCsvButton = document.getElementById("SaveCSV");
    
    // Find error Container
    let errorArea = document.getElementById("errorContainer");
    
    // Find output container
    let outputArea = document.getElementById("resultContainer");
    
    // Find the input text area
    let inputTextArea = document.getElementById("txtArea");
    
    // Find the input text area's wrapping div
    let inputParentDiv = inputTextArea.parentElement;
    
    // Find text from area
    let textFromArea = inputTextArea.value;
    
    // Convert the CSV to a 2d array
    let csvArray = CSVtoArray(textFromArea);
    
    // Stores what button is scrolling
    let buttonScroll = "none";
    
    // Make an array storing all of the errors
    let errorArray = []; // Format: [["alertType", [effected areas]], ["alertType", [effected areas]], ["alertType", [effected areas]]]
    
    // Make a potential error array
    let potentialErrors = [];
    
    // Create all error buttons
    let unequalRowButton = document.createElement('button');
    let emptyElementsButton = document.createElement('button');
    let falseCarriageReturnsButton = document.createElement('button');
    let falseNewLinesButton = document.createElement('button');
    
    createErrorButtons();
    
    // Update buttons (set text [ex: 0 unequal length rows, 1 empty element, etc.], disable/enable buttons [ex: 0 unequal length rows - disabled, 1 empty element - enabled, etc.])
    updateErrorButtons();
    
    // Make an input loop on the text area
    inputTextArea.addEventListener("input", function()
    {
        // Update buttons (set text [ex: 0 unequal length rows, 1 empty element, etc.], disable/enable buttons [ex: 0 unequal length rows - disabled, 1 empty element - enabled, etc.])
        updateErrorButtons();
    });
    
    // Handling light/dark of buttons without arrows
    window.addEventListener("mouseup", function()
    {
        // Delay the execution of isErrorSelected
        setTimeout(function () {
            updateDarkButtonFromSelect();
        }, 10); // You can adjust the delay time (in milliseconds) as needed
    });
    
    window.addEventListener("mousedown", function(event)
    {
        // Get the element that the user clicked on
        var clickedElement = event.target;
        
        // Delay the execution of isErrorSelected
        setTimeout(function () {
            updateDarkButtonFromDown(clickedElement);
        }, 10); // You can adjust the delay time (in milliseconds) as needed
        
        //updateDarkButtonFromDown();
    });
    
    // Handles making buttons dark if their error is not selected
    function updateDarkButtonFromDown(clickedElement)
    {
        // Find the light button ID
        if(buttonLightOrDark("unequalRowButton") == "light")
        {
            // If the light button has no arrows
            if(buttonScroll == "none")
            {
                // If neither the text area or the button was clicked
                if(clickedElement != inputTextArea && clickedElement != unequalRowButton)
                {
                    // Make the button dark
                    buttonDark("unequalRowButton");
                }
            }
        }
        else if(buttonLightOrDark("emptyElementsButton") == "light")
        {
            // If the light button has no arrows
            if(buttonScroll == "none")
            {
                // If neither the text area or the button was clicked
                if(clickedElement != inputTextArea && clickedElement != emptyElementsButton)
                {
                    // Make the button dark
                    buttonDark("emptyElementsButton");
                }
            }
        }
        else if(buttonLightOrDark("falseCarriageReturnsButton") == "light")
        {
            // If the light button has no arrows
            if(buttonScroll == "none")
            {
                // If neither the text area or the button was clicked
                if(clickedElement != inputTextArea && clickedElement != falseCarriageReturnsButton)
                {
                    // Make the button dark
                    buttonDark("falseCarriageReturnsButton");
                }
            }
        }
        else if(buttonLightOrDark("falseNewLinesButton") == "light")
        {
            // If the light button has no arrows
            if(buttonScroll == "none")
            {
                // If neither the text area or the button was clicked
                if(clickedElement != inputTextArea && clickedElement != falseNewLinesButton)
                {
                    // Make the button dark
                    buttonDark("falseNewLinesButton");
                }
            }
        }
    }
    
    // Handles making buttons dark if their error is not selected
    function updateDarkButtonFromSelect()
    {
        if(buttonLightOrDark("unequalRowButton") == "light" && buttonScroll == "none")
        {
            // Check if there is selected text
            if (inputTextArea.selectionStart !== undefined)
            {
                // Get the start and end indices of the selected text
                selectedStartIndex = inputTextArea.selectionStart;
                selectedEndIndex = inputTextArea.selectionEnd;
                if(selectedStartIndex != unequalRowIndexes()[0] || selectedEndIndex != unequalRowIndexes()[1])
                {
                    buttonDark("unequalRowButton");
                }
            }
            else
            {
                buttonDark("unequalRowButton");
            }
        }
        else if(buttonLightOrDark("emptyElementsButton") == "light" && buttonScroll == "none")
        {
            // Check if there is selected text
            if (inputTextArea.selectionStart !== undefined)
            {
                // Get the start and end indices of the selected text
                selectedStartIndex = inputTextArea.selectionStart;
                selectedEndIndex = inputTextArea.selectionEnd;
                if(selectedStartIndex != emptyElementIndexes()[0] || selectedEndIndex != emptyElementIndexes()[1])
                {
                    buttonDark("emptyElementsButton");
                }
            }
            else
            {
                buttonDark("emptyElementsButton");
            }
        }
        else if(buttonLightOrDark("falseCarriageReturnsButton") == "light" && buttonScroll == "none")
        {
            // Check if there is selected text
            if (inputTextArea.selectionStart !== undefined)
            {
                // Get the start and end indices of the selected text
                selectedStartIndex = inputTextArea.selectionStart;
                selectedEndIndex = inputTextArea.selectionEnd;
                if(selectedStartIndex != carriageReturnIndexes()[0] || selectedEndIndex != carriageReturnIndexes()[1])
                {
                    buttonDark("falseCarriageReturnsButton");
                }
            }
            else
            {
                buttonDark("falseCarriageReturnsButton");
            }
        }
        else if(buttonLightOrDark("falseNewLinesButton") == "light" && buttonScroll == "none")
        {
            // Check if there is selected text
            if (inputTextArea.selectionStart !== undefined)
            {
                // Get the start and end indices of the selected text
                selectedStartIndex = inputTextArea.selectionStart;
                selectedEndIndex = inputTextArea.selectionEnd;
                if(selectedStartIndex != newLineIndexes()[0] || selectedEndIndex != newLineIndexes()[1])
                {
                    buttonDark("falseNewLinesButton");
                }
            }
            else
            {
                buttonDark("falseNewLinesButton");
            }
        }
    }
    
    // Updates text and enablement of buttons
    function updateErrorButtons()
    {
        // Update unequal rows and save button
        if(checkForSpecificErrors("unequalRows")[1] == null) // If there are no unequal length rows
        {
            // Set text content
            unequalRowButton.textContent = "0 unequal length rows";
            
            // Disable button
            //unequalRowButton.disabled = true;
            
            // Make SaveCSV accented
            accentButton("SaveCSV");
            //buttonLight("SaveCSV");
            
            // Add a title to the save button
            saveCsvButton.setAttribute("title", "All good!");
            
            if(buttonScroll == "unequalRows") // If the error has arrow buttons
            {
                // Remove line break and arrow buttons
                removeById("afterUnequalRowButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
                
                // Update buttonScroll
                buttonScroll = "none";
            }
            
            // Make the button dark
            buttonDark("unequalRowButton");
        }
        else // If there are unequal length row(s)
        {
            // Set text content
            unequalRowButton.textContent = checkForSpecificErrors("unequalRows")[1].length + " unequal length row";
            
            // If there are more than one unequal length rows
            if(checkForSpecificErrors("unequalRows")[1].length >= 2)
            {
                // Add an 's' to the text content (to make it plural)
                unequalRowButton.textContent += "s";
            }
            else if(checkForSpecificErrors("unequalRows")[1].length == 1 && buttonScroll == "unequalRows") // If there is only one error and it has arrow buttons
            {
                // Remove line break and arrow buttons
                removeById("afterUnequalRowButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
                
                // Update buttonScroll
                buttonScroll = "none";
            }
            
            // If the button scroll isn't unequal length rows
            if(buttonScroll != "unequalRows")
            {
                buttonDark("unequalRowButton");
            }
            
            // Make SaveCSV dark
            buttonDark("SaveCSV");
            
            // Add a title to the save button
            saveCsvButton.setAttribute("title", "Fix unequal length rows");
        }
        
        // Update empty elements
        if(checkForSpecificErrors("emptyElements")[1].length == 0) // If there are no empty elements
        {
            // Set text content
            emptyElementsButton.textContent = "0 empty elements";
            
            // Disable button
            //emptyElementsButton.disabled = true;
            
            if(buttonScroll == "emptyElements") // If the error has arrow buttons
            {
                // Remove line break and arrow buttons
                removeById("afterEmptyElementButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
                
                // Update buttonScroll
                buttonScroll = "none";
            }
            
            // Make the button dark
            buttonDark("emptyElementsButton");
        }
        else // If there are empty element(s)
        {
            // Set text content
            emptyElementsButton.textContent = checkForSpecificErrors("emptyElements")[1].length + " empty element";
            
            // If there are more than one empty elements
            if(checkForSpecificErrors("emptyElements")[1].length >= 2)
            {
                // Add an 's' to the text content (to make it plural)
                emptyElementsButton.textContent += "s";
            }
            else if(checkForSpecificErrors("emptyElements")[1].length == 1 && buttonScroll == "emptyElements") // If there is only one error and it has arrow buttons
            {
                // Remove line break and arrow buttons
                removeById("afterEmptyElementButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
                
                // Update buttonScroll
                buttonScroll = "none";
            }
            
            // If the button scroll isn't unequal length rows
            if(buttonScroll != "emptyElements")
            {
                buttonDark("emptyElementsButton");
            }
            
            // Enable button
            //emptyElementsButton.disabled = false;
        }
        
        // Update false carriage returns
        if(checkForSpecificErrors("falseCarriageReturns")[1].length == 0) // If there are no false carriage returns
        {
            // Set text content
            falseCarriageReturnsButton.textContent = "0 false carriage returns";
            
            // Disable button
            //falseCarriageReturnsButton.disabled = true;
            
            if(buttonScroll == "falseCarriageReturns") // If the error has arrow buttons
            {
                // Remove line break and arrow buttons
                removeById("afterFalseCarriageReturnButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
                
                // Update buttonScroll
                buttonScroll = "none";
            }
            
            // Make the button dark
            buttonDark("falseCarriageReturnsButton");
        }
        else // If there are false carriage return(s)
        {
            // Set text content
            falseCarriageReturnsButton.textContent = checkForSpecificErrors("falseCarriageReturns")[1].length + " false carriage return";
            
            // If there are more than one false carriage returns
            if(checkForSpecificErrors("falseCarriageReturns")[1].length >= 2)
            {
                // Add an 's' to the text content (to make it plural)
                falseCarriageReturnsButton.textContent += "s";
            }
            else if(checkForSpecificErrors("falseCarriageReturns")[1].length == 1 && buttonScroll == "falseCarriageReturns") // If there is only one error and it has arrow buttons
            {
                // Remove line break and arrow buttons
                removeById("afterFalseCarriageReturnButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
                
                // Update buttonScroll
                buttonScroll = "none";
            }
            
            // If the button scroll isn't unequal length rows
            if(buttonScroll != "falseCarriageReturns")
            {
                buttonDark("falseCarriageReturnsButton");
            }
            
            // Enable button
            //falseCarriageReturnsButton.disabled = false;
        }
        
        // Update false new lines
        if(checkForSpecificErrors("falseNewLines")[1].length == 0) // If there are no false new lines
        {
            // Set text content
            falseNewLinesButton.textContent = "0 false new lines";
            
            // Disable button
            //falseNewLinesButton.disabled = true;
            
            if(buttonScroll == "falseNewLines") // If the error has arrow buttons
            {
                // Remove line break and arrow buttons
                removeById("afterFalseNewLinesButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
                
                // Update buttonScroll
                buttonScroll = "none";
            }
            
            // Make the button dark
            buttonDark("falseNewLinesButton");
        }
        else // If there are false new line(s)
        {
            // Set text content
            falseNewLinesButton.textContent = checkForSpecificErrors("falseNewLines")[1].length + " false new line";
            
            // If there are more than one false new lines
            if(checkForSpecificErrors("falseNewLines")[1].length >= 2)
            {
                // Add an 's' to the text content (to make it plural)
                falseNewLinesButton.textContent += "s";
            }
            else if(checkForSpecificErrors("falseNewLines")[1].length == 1 && buttonScroll == "falseNewLines") // If there is only one error and it has arrow buttons
            {
                // Remove line break and arrow buttons
                removeById("afterFalseNewLinesButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
                
                // Update buttonScroll
                buttonScroll = "none";
            }
            
            // If the button scroll isn't unequal length rows
            if(buttonScroll != "falseNewLines")
            {
                buttonDark("falseNewLinesButton");
            }
            
            // Enable button
            //falseNewLinesButton.disabled = false;
        }
    }
    
    // Creates all error buttons
    function createErrorButtons()
    {
        // Unequal rows button
        unequalRowButton.id = "unequalRowButton";
        unequalRowButton.style.backgroundColor = "rgb(180,180,180)";
        
        // Add click event
        unequalRowButton.addEventListener('click', function()
        {
            // If there are errors found
            if(checkForSpecificErrors("unequalRows")[1].length > 0)
            {
                // Set the view to text area
                if(toggleTableButton.textContent ==  "Toggle text area view")
                {
                    toggleTableButton.click();
                }
                
                // Light/dark buttons
                buttonLight("unequalRowButton");
                buttonDark("emptyElementsButton");
                buttonDark("falseCarriageReturnsButton");
                buttonDark("falseNewLinesButton");
                
                // Remove line break and arrow buttons
                removeById("afterUnequalRowButton");
                removeById("afterEmptyElementButton");
                removeById("afterFalseCarriageReturnButton");
                removeById("afterFalseNewLinesButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
            }
            
            if(checkForSpecificErrors("unequalRows")[1].length == 1) // If there is only one unequal row found
            {
                // Set buttonScroll
                buttonScroll = "none";
                
                // Find and select the unequal length row
                selectUnequalRow(1);
            }
            else if(checkForSpecificErrors("unequalRows")[1].length > 1) // If there are multiple unequal rows found
            {
                // Set buttonScroll
                buttonScroll = "unequalRows";
                
                // Add a line break
                createLineBreak("afterUnequalRowButton", errorArea);
                
                // Make arrow buttons to loop through the elements found ([<--][insert number here][-->])
                let elementIndexButton = document.createElement('button');
                elementIndexButton.id = "elementIndexButton";
                elementIndexButton.textContent = "1";
                elementIndexButton.addEventListener('click', function() {
                    // If current element index is greater than the amount of elements
                    if(elementIndexButton.textContent > checkForSpecificErrors("unequalRows")[1].length)
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("unequalRows")[1].length;
                    }
                    
                    selectUnequalRow(elementIndexButton.textContent);
                });
                
                // Find and select the first empty element
                selectUnequalRow(elementIndexButton.textContent);
                
                let leftArrowButton = document.createElement('button');
                leftArrowButton.id = "leftArrowButton";
                leftArrowButton.textContent = "<--";
                leftArrowButton.addEventListener('click', function() {
                    // If elementIndexButton's text is greater than one
                    if(elementIndexButton.textContent > 1)
                    {
                        // Subtract one from elementIndexButton's text
                        elementIndexButton.textContent--;
                    }
                    else if(elementIndexButton.textContent <= 1) // If elementIndexButton's text is less than or equal to one
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("unequalRows")[1].length;
                    }
                    
                    // If current element index is greater than the amount of elements
                    if(elementIndexButton.textContent > checkForSpecificErrors("unequalRows")[1].length)
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("unequalRows")[1].length;
                    }
                    
                    // Select the element indicated by elementIndexButton.textContent
                    selectUnequalRow(elementIndexButton.textContent);
                });
                
                let rightArrowButton = document.createElement('button');
                rightArrowButton.id = "rightArrowButton";
                rightArrowButton.textContent = "-->";
                rightArrowButton.addEventListener('click', function() {
                    // If current element index is less than the amount of elements
                    if(elementIndexButton.textContent < checkForSpecificErrors("unequalRows")[1].length)
                    {
                        // Add one to elementIndexButton's text
                        elementIndexButton.textContent++;
                    }
                    else if(elementIndexButton.textContent >= checkForSpecificErrors("unequalRows")[1].length) // If current element index is greater than or equal to the amount of elements
                    {
                        // Set elementIndexButton's text to the first element
                        elementIndexButton.textContent = 1;
                    }
                    
                    // Select the element indicated by elementIndexButton.textContent
                    selectUnequalRow(elementIndexButton.textContent);
                });
                
                // Add arrow buttons
                errorArea.appendChild(leftArrowButton);
                errorArea.appendChild(elementIndexButton);
                errorArea.appendChild(rightArrowButton);
            }
        });
        errorArea.appendChild(unequalRowButton);
        
        // Empty elements button
        emptyElementsButton.id = "emptyElementsButton";
        emptyElementsButton.style.backgroundColor = "rgb(180,180,180)";
        
        // Add click event
        emptyElementsButton.addEventListener('click', function()
        {
            // If there are errors found
            if(checkForSpecificErrors("emptyElements")[1].length > 0)
            {
                // Set the view to text area
                if(toggleTableButton.textContent ==  "Toggle text area view")
                {
                    toggleTableButton.click();
                }
                
                // Light/dark buttons
                buttonDark("unequalRowButton");
                buttonLight("emptyElementsButton");
                buttonDark("falseCarriageReturnsButton");
                buttonDark("falseNewLinesButton");
                
                // Remove line break and arrow buttons
                removeById("afterUnequalRowButton");
                removeById("afterEmptyElementButton");
                removeById("afterFalseCarriageReturnButton");
                removeById("afterFalseNewLinesButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
            }
            
            if(checkForSpecificErrors("emptyElements")[1].length == 1) // If there is only one empty element found
            {
                // Set buttonScroll
                buttonScroll = "none";
                
                // Find and select the empty element
                selectEmptyElement(1);
            }
            else if(checkForSpecificErrors("emptyElements")[1].length > 1) // If there are multiple empty elements found
            {
                // Set buttonScroll
                buttonScroll = "emptyElements";
                
                // Add a line break
                createLineBreak("afterEmptyElementButton", errorArea);
                
                // Make arrow buttons to loop through the elements found ([<--][insert number here][-->])
                let elementIndexButton = document.createElement('button');
                elementIndexButton.id = "elementIndexButton";
                elementIndexButton.textContent = "1";
                elementIndexButton.addEventListener('click', function() {
                    // If current element index is greater than the amount of elements
                    if(elementIndexButton.textContent > checkForSpecificErrors("emptyElements")[1].length)
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("emptyElements")[1].length;
                    }
                    
                    selectEmptyElement(elementIndexButton.textContent);
                });
                
                // Find and select the first empty element
                selectEmptyElement(elementIndexButton.textContent);
                
                let leftArrowButton = document.createElement('button');
                leftArrowButton.id = "leftArrowButton";
                leftArrowButton.textContent = "<--";
                leftArrowButton.addEventListener('click', function() {
                    // If elementIndexButton's text is greater than one
                    if(elementIndexButton.textContent > 1)
                    {
                        // Subtract one from elementIndexButton's text
                        elementIndexButton.textContent--;
                    }
                    else if(elementIndexButton.textContent <= 1) // If elementIndexButton's text is less than or equal to one
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("emptyElements")[1].length;
                    }
                    
                    // If current element index is greater than the amount of elements
                    if(elementIndexButton.textContent > checkForSpecificErrors("emptyElements")[1].length)
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("emptyElements")[1].length;
                    }
                    
                    // Select the element indicated by elementIndexButton.textContent
                    selectEmptyElement(elementIndexButton.textContent);
                });
                
                let rightArrowButton = document.createElement('button');
                rightArrowButton.id = "rightArrowButton";
                rightArrowButton.textContent = "-->";
                rightArrowButton.addEventListener('click', function() {
                    // If current element index is less than the amount of elements
                    if(elementIndexButton.textContent < checkForSpecificErrors("emptyElements")[1].length)
                    {
                        // Add one to elementIndexButton's text
                        elementIndexButton.textContent++;
                    }
                    else if(elementIndexButton.textContent >= checkForSpecificErrors("emptyElements")[1].length) // If current element index is greater than or equal to the amount of elements
                    {
                        // Set elementIndexButton's text to the first element
                        elementIndexButton.textContent = 1;
                    }
                    
                    // Select the element indicated by elementIndexButton.textContent
                    selectEmptyElement(elementIndexButton.textContent);
                });
                
                // Add arrow buttons
                errorArea.appendChild(leftArrowButton);
                errorArea.appendChild(elementIndexButton);
                errorArea.appendChild(rightArrowButton);
            }
        });
        errorArea.appendChild(emptyElementsButton);
        
        // False carriage returns button
        falseCarriageReturnsButton.id = "falseCarriageReturnsButton";
        falseCarriageReturnsButton.style.backgroundColor = "rgb(180,180,180)";
        
        // Add click event
        falseCarriageReturnsButton.addEventListener('click', function()
        {
            // If there are errors found
            if(checkForSpecificErrors("falseCarriageReturns")[1].length > 0)
            {
                // Set the view to text area
                if(toggleTableButton.textContent ==  "Toggle text area view")
                {
                    toggleTableButton.click();
                }
                
                // Light/dark buttons
                buttonDark("unequalRowButton");
                buttonDark("emptyElementsButton");
                buttonLight("falseCarriageReturnsButton");
                buttonDark("falseNewLinesButton");
                
                // Remove line break and arrow buttons
                removeById("afterUnequalRowButton");
                removeById("afterEmptyElementButton");
                removeById("afterFalseCarriageReturnButton");
                removeById("afterFalseNewLinesButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
            }
            
            if(checkForSpecificErrors("falseCarriageReturns")[1].length == 1) // If there is only one false carriage return found
            {
                // Set buttonScroll
                buttonScroll = "none";
                
                // Find and select the false carriage return
                selectCarriageReturn(1);
            }
            else if(checkForSpecificErrors("falseCarriageReturns")[1].length > 1) // If there are multiple false carriage returns found
            {
                // Set buttonScroll
                buttonScroll = "falseCarriageReturns";
                
                // Add a line break
                createLineBreak("afterFalseCarriageReturnButton", errorArea);
                
                // Make arrow buttons to loop through the carriage returns found ([<--][insert number here][-->])
                let elementIndexButton = document.createElement('button');
                elementIndexButton.id = "elementIndexButton";
                elementIndexButton.textContent = "1";
                elementIndexButton.addEventListener('click', function() {
                    // If current element index is greater than the amount of elements
                    if(elementIndexButton.textContent > checkForSpecificErrors("falseCarriageReturns")[1].length)
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("falseCarriageReturns")[1].length;
                    }
                    
                    selectCarriageReturn(elementIndexButton.textContent);
                });
                
                // Find and select the first empty element
                selectCarriageReturn(elementIndexButton.textContent);
                
                let leftArrowButton = document.createElement('button');
                leftArrowButton.id = "leftArrowButton";
                leftArrowButton.textContent = "<--";
                leftArrowButton.addEventListener('click', function() {
                    // If elementIndexButton's text is greater than one
                    if(elementIndexButton.textContent > 1)
                    {
                        // Subtract one from elementIndexButton's text
                        elementIndexButton.textContent--;
                    }
                    else if(elementIndexButton.textContent <= 1) // If elementIndexButton's text is less than or equal to one
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("falseCarriageReturns")[1].length;
                    }
                    
                    // If current element index is greater than the amount of elements
                    if(elementIndexButton.textContent > checkForSpecificErrors("falseCarriageReturns")[1].length)
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("falseCarriageReturns")[1].length;
                    }
                    
                    // Select the element indicated by elementIndexButton.textContent
                    selectCarriageReturn(elementIndexButton.textContent);
                });
                
                let rightArrowButton = document.createElement('button');
                rightArrowButton.id = "rightArrowButton";
                rightArrowButton.textContent = "-->";
                rightArrowButton.addEventListener('click', function() {
                    // If current element index is less than the amount of elements
                    if(elementIndexButton.textContent < checkForSpecificErrors("falseCarriageReturns")[1].length)
                    {
                        // Add one to elementIndexButton's text
                        elementIndexButton.textContent++;
                    }
                    else if(elementIndexButton.textContent >= checkForSpecificErrors("falseCarriageReturns")[1].length) // If current element index is greater than or equal to the amount of elements
                    {
                        // Set elementIndexButton's text to the first element
                        elementIndexButton.textContent = 1;
                    }
                    
                    // Select the element indicated by elementIndexButton.textContent
                    selectCarriageReturn(elementIndexButton.textContent);
                });
                
                // Add arrow buttons
                errorArea.appendChild(leftArrowButton);
                errorArea.appendChild(elementIndexButton);
                errorArea.appendChild(rightArrowButton);
            }
        });
        errorArea.appendChild(falseCarriageReturnsButton);
        
        // False new lines button
        falseNewLinesButton.id = "falseNewLinesButton";
        falseNewLinesButton.style.backgroundColor = "rgb(180,180,180)";
        
        // Add click event
        falseNewLinesButton.addEventListener('click', function()
        {
            // If there are errors found
            if(checkForSpecificErrors("falseNewLines")[1].length > 0)
            {
                // Set the view to text area
                if(toggleTableButton.textContent ==  "Toggle text area view")
                {
                    toggleTableButton.click();
                }
                
                // Light/dark buttons
                buttonDark("unequalRowButton");
                buttonDark("emptyElementsButton");
                buttonDark("falseCarriageReturnsButton");
                buttonLight("falseNewLinesButton");
                
                // Remove line break and arrow buttons
                removeById("afterUnequalRowButton");
                removeById("afterEmptyElementButton");
                removeById("afterFalseCarriageReturnButton");
                removeById("afterFalseNewLinesButton");
                removeById("leftArrowButton");
                removeById("elementIndexButton");
                removeById("rightArrowButton");
            }
            
            if(checkForSpecificErrors("falseNewLines")[1].length == 1) // If there is only one false new line found
            {
                // Set buttonScroll
                buttonScroll = "none";
                
                // Find and select the false new line
                selectNewLine(1);
            }
            else if(checkForSpecificErrors("falseNewLines")[1].length > 1) // If there are multiple false new lines found
            {
                // Set buttonScroll
                buttonScroll = "falseNewLines";
                
                // Add a line break
                createLineBreak("afterFalseNewLinesButton", errorArea);
                
                // Make arrow buttons to loop through the new lines found ([<--][insert number here][-->])
                let elementIndexButton = document.createElement('button');
                elementIndexButton.id = "elementIndexButton";
                elementIndexButton.textContent = "1";
                elementIndexButton.addEventListener('click', function() {
                    // If current element index is greater than the amount of elements
                    if(elementIndexButton.textContent > checkForSpecificErrors("falseNewLines")[1].length)
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("falseNewLines")[1].length;
                    }
                    
                    selectNewLine(elementIndexButton.textContent);
                });
                
                // Find and select the first false new line
                selectNewLine(elementIndexButton.textContent);
                
                let leftArrowButton = document.createElement('button');
                leftArrowButton.id = "leftArrowButton";
                leftArrowButton.textContent = "<--";
                leftArrowButton.addEventListener('click', function() {
                    // If elementIndexButton's text is greater than one
                    if(elementIndexButton.textContent > 1)
                    {
                        // Subtract one from elementIndexButton's text
                        elementIndexButton.textContent--;
                    }
                    else if(elementIndexButton.textContent <= 1) // If elementIndexButton's text is less than or equal to one
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("falseNewLines")[1].length;
                    }
                    
                    // If current element index is greater than the amount of elements
                    if(elementIndexButton.textContent > checkForSpecificErrors("falseNewLines")[1].length)
                    {
                        // Set elementIndexButton's text to the last index of an element
                        elementIndexButton.textContent = checkForSpecificErrors("falseNewLines")[1].length;
                    }
                    
                    // Select the element indicated by elementIndexButton.textContent
                    selectNewLine(elementIndexButton.textContent);
                });
                
                let rightArrowButton = document.createElement('button');
                rightArrowButton.id = "rightArrowButton";
                rightArrowButton.textContent = "-->";
                rightArrowButton.addEventListener('click', function() {
                    // If current element index is less than the amount of elements
                    if(elementIndexButton.textContent < checkForSpecificErrors("falseNewLines")[1].length)
                    {
                        // Add one to elementIndexButton's text
                        elementIndexButton.textContent++;
                    }
                    else if(elementIndexButton.textContent >= checkForSpecificErrors("falseNewLines")[1].length) // If current element index is greater than or equal to the amount of elements
                    {
                        // Set elementIndexButton's text to the first element
                        elementIndexButton.textContent = 1;
                    }
                    
                    // Select the element indicated by elementIndexButton.textContent
                    selectNewLine(elementIndexButton.textContent);
                });
                
                // Add arrow buttons
                errorArea.appendChild(leftArrowButton);
                errorArea.appendChild(elementIndexButton);
                errorArea.appendChild(rightArrowButton);
            }
        });
        errorArea.appendChild(falseNewLinesButton);
    }
    
    // Detect empty elements, different-length rows, and false new lines and carriage returns
    function checkForErrors()
    {
        // Empty array arrays
        errorArray = [];
        potentialErrors = [];
        
        // Update the input CSV
        // Find text from area
        textFromArea = inputTextArea.value;
        
        // Convert the CSV to a 2d array
        csvArray = CSVtoArray(textFromArea);
        
        // AAAAAHHHHH vvv
        // If there is more than one row
        if(csvArray.length > 1)
        {
            // Scan for different-length
            // Set unequalRows to an empty array
            let unequalRows = [];
            
            // Find the length of rows that is the most prevalent
            // Placeholder array storing all of the lengths of rows
            let rowLengths = [];
            
            // Loop through rows to add to row lengths
            for(let i = 0; i < csvArray.length; i++)
            {
                rowLengths.push(csvArray[i].length);
            }
            
            // Sort rowLengths from smallest to largest
            rowLengths.sort(function(a, b) // Use the sort() method with a compare function
            {
                return a - b;
            });
            
            let curLength = rowLengths[0];
            let curLengthFreq = 1;
            let lengthFreq = [];

            for (let i = 1; i < rowLengths.length; i++) {
                if (curLength !== rowLengths[i]) {
                    lengthFreq.push([curLength, curLengthFreq]);
                    curLength = rowLengths[i];
                    curLengthFreq = 1;
                } else {
                    curLengthFreq++;
                }
                
                // Handle the last iteration
                if (i === rowLengths.length - 1) {
                    lengthFreq.push([curLength, curLengthFreq]);
                }
            }
            
            // If the length of lengthFreq is larger than one
            if(lengthFreq.length > 1)
            {
                // Sort lengthFreq in descending order (greatest to least) by the frequencies of the lengths
                lengthFreq.sort(function(a, b) {
                    // Compare the values in the second column (index 1) in reverse order
                    return b[1] - a[1];
                });
                
                // If the highest frequency is shared by multiple lengths (ex: length 3, freq 4/ length 6, freq 4)
                if(lengthFreq[0][1] == lengthFreq[1][1])
                {
                    // Return all the rows as unequal
                    // Loop through all rows
                    for(let i = 0; i < csvArray.length; i++)
                    {
                        // Add every row to unequalRows
                        unequalRows.push(i);
                    }
                }
                else // If the highest frequency is not shared by multiple lengths
                {
                    // Loop through all rows
                    for(let i = 0; i < csvArray.length; i++)
                    {
                        // Add every row with a length unequal to the most common length
                        if(csvArray[i].length != lengthFreq[0][0])
                        {
                            unequalRows.push(i);
                        }
                    }
                }
            }
            
            // If there are items in unequalRows
            if(unequalRows[0] != null)
            {
                // Add the rows that are not equal to the majority length to the errorArray
                errorArray.push(["unequalRows", unequalRows]);
            }
        }
        // AAAAAHHHHH ^^^
        
        // Make a placeholder array for empty elements
        let emptyElements = [];
        
        // Scan for empty elements
        for(let y = 0; y < csvArray.length; y++) // Loop through rows
        {
            for(let x = 0; x < csvArray[y].length; x++) // Loop through columns of current row
            {
                // If current element is empty
                if(csvArray[y][x].trim() == '')
                {
                    // Push current element to array
                    emptyElements.push([y,x]);
                }
            }
        }
        
        // If there are items in emptyElements
        if(emptyElements[0] != null)
        {
            // Add the empty elements to the potentialErrors array
            potentialErrors.push(["emptyElements", emptyElements]);
        }
        
        // Scan for false carriage returns (\\r) and false new lines (\\n)
        
        // Placeholder array storing the indexes of false carriage returns
        let falseCarriageReturns = [];
        
        // Placeholder array storing the indexes of false new lines
        let falseNewLines = [];
        
        // Loop through the input text area string
        for(let i = 0; i < textFromArea.length; i++)
        {
            // If there is a false carriage return (\\r) found, add index to falseCarriageReturns
            if(textFromArea[i] === "\\" && textFromArea[i+1] === "r")
            {
                // Increment placeholder array
                falseCarriageReturns.push(i);
            }
            
            // If there is a false new line (\\n) found, add index to falseCarriageReturns
            if(textFromArea[i] === "\\" && textFromArea[i+1] === "n")
            {
                // Increment placeholder array
                falseNewLines.push(i);
            }
        }
        
        // If there are items in carriageReturnIndexes
        if(falseCarriageReturns[0] != null)
        {
            // Add the empty elements to the errorArray
            potentialErrors.push(["falseCarriageReturns", falseCarriageReturns]);
        }
        
        // If there are items in falseNewLines
        if(falseNewLines[0] != null)
        {
            // Add the empty elements to the errorArray
            potentialErrors.push(["falseNewLines", falseNewLines]);
        }
    }
    
    // Check for specific errors and return them in an array
    function checkForSpecificErrors(errorType)
    {
        // Update the input CSV
        // Find text from area
        textFromArea = inputTextArea.value;
        
        // Convert the CSV to a 2d array
        csvArray = CSVtoArray(textFromArea);
        
        // If specific error is rows
        if(errorType === "unequalRows")
        {
            // Scan for different-length
            // Set unequalRows to an empty array
            let unequalRows = [];
            
            // Find the length of rows that is the most prevalent
            // Placeholder array storing all of the lengths of rows
            let rowLengths = [];
            
            // Loop through rows to add to row lengths
            for(let i = 0; i < csvArray.length; i++)
            {
                rowLengths.push(csvArray[i].length);
            }
            
            // Sort rowLengths from smallest to largest
            rowLengths.sort(function(a, b) // Use the sort() method with a compare function
            {
                return a - b;
            });
            
            let curLength = rowLengths[0];
            let curLengthFreq = 1;
            let lengthFreq = [];

            for (let i = 1; i < rowLengths.length; i++) {
                if (curLength !== rowLengths[i]) {
                lengthFreq.push([curLength, curLengthFreq]);
                curLength = rowLengths[i];
                curLengthFreq = 1;
                } else {
                curLengthFreq++;
                }

                // Handle the last iteration
                if (i === rowLengths.length - 1) {
                lengthFreq.push([curLength, curLengthFreq]);
                }
            }
            
            // If the length of lengthFreq is larger than one
            if(lengthFreq.length > 1)
            {
                // Sort lengthFreq in descending order (greatest to least) by the frequencies of the lengths
                lengthFreq.sort(function(a, b) {
                    // Compare the values in the second column (index 1) in reverse order
                    return b[1] - a[1];
                });
                
                // If the highest frequency is shared by multiple lengths (ex: length 3, freq 4/ length 6, freq 4)
                if(lengthFreq[0][1] == lengthFreq[1][1])
                {
                    // Return all the rows as unequal
                    // Loop through all rows
                    for(let i = 0; i < csvArray.length; i++)
                    {
                        // Add every row to unequalRows
                        unequalRows.push(i);
                    }
                }
                else // If the highest frequency is not shared by multiple lengths
                {
                    // Loop through all rows
                    for(let i = 0; i < csvArray.length; i++)
                    {
                        // Add every row with a length unequal to the most common length
                        if(csvArray[i].length != lengthFreq[0][0])
                        {
                            unequalRows.push(i);
                        }
                    }
                }
                
                // Add the rows that are not equal to the majority length to the errorArray
                return(["unequalRows", unequalRows]);

            }
            else if(lengthFreq.length <= 1) // If there is one (or less) index in lengthFreq
            {
                // Return empty error array
                return(["unequalRows", ]);
            }
        }
        else if(errorType === "emptyElements") // If specific error is empty elements
        {
            // Make a placeholder array for empty elements
            let emptyElements = [];
            
            // Scan for empty elements
            for(let y = 0; y < csvArray.length; y++) // Loop through rows
            {
                for(let x = 0; x < csvArray[y].length; x++) // Loop through columns of current row
                {
                    // If current element is empty
                    if(csvArray[y][x].trim() == '')
                    {
                        // Push current element to array
                        emptyElements.push([y,x]);
                    }
                }
            }
            
            // Return specific error array
            return(["emptyElements", emptyElements]);
        }
        else if(errorType === "falseCarriageReturns") // If specific error is false carriage returns
        {
            // Placeholder array storing the indexes of false carriage returns
            let falseCarriageReturns = [];
            
            // Loop through the input text area string
            for(let i = 0; i < textFromArea.length; i++)
            {
                // If there is a false carriage return (\\r) found, add index to falseCarriageReturns
                if(textFromArea[i] === "\\" && textFromArea[i+1] === "r")
                {
                    // Increment placeholder array
                    falseCarriageReturns.push(i);
                }
            }
            
            // Return specific error array
            return(["falseCarriageReturns", falseCarriageReturns]);
        }
        else if(errorType === "falseNewLines") // If specific error is false new lines
        {
            // Placeholder array storing the indexes of false new lines
            let falseNewLines = [];
            
            // Loop through the input text area string
            for(let i = 0; i < textFromArea.length; i++)
            {
                // If there is a false new line (\\n) found, add index to falseCarriageReturns
                if(textFromArea[i] === "\\" && textFromArea[i+1] === "n")
                {
                    // Increment placeholder array
                    falseNewLines.push(i);
                }
            }
            
            // Return specific error array
            return(["falseNewLines", falseNewLines]);
        }
    }
    
    // Finds and selects unequal length row in the input area given what unequal row (ex: pass in 4, select the 4th unequal length row)
    function selectUnequalRow(passedRow)
    {
        // Converts the parameter to zero-indexed
        let selectedElement = passedRow - 1;
        
        // Finds the value of the text area
        let textValue = inputTextArea.value;
        
        // Find and select the empty element
        let startIndex = csvCoordinateToIndex(textValue, [checkForSpecificErrors("unequalRows")[1][selectedElement], 0]);
        
        // Find the end index of the row is that needs to be selected
        let endIndex = startIndex;
        while(endIndex < textValue.length)
        {
            if(textValue[endIndex] != '\n')
            {
                endIndex++;
            }
            else
            {
                break;
            }
        }
        
        // If the start index is not invalid (-1)
        if(startIndex !== -1)
        {
            // Select the empty element in the input text area
            inputTextArea.focus();
            inputTextArea.setSelectionRange(startIndex, endIndex);
            
            // Scroll to the selected value
            scrollToSelected(startIndex, endIndex);
        }
    }
    
    // Returns the start and end indexes of the unequal row passed in
    function unequalRowIndexes()
    {
        // Converts the parameter to zero-indexed
        let selectedElement = 0;
        
        // Finds the value of the text area
        let textValue = inputTextArea.value;
        
        // Find and select the empty element
        let startIndex = csvCoordinateToIndex(textValue, [checkForSpecificErrors("unequalRows")[1][selectedElement], 0]);
        
        // Find the end index of the row is that needs to be selected
        let endIndex = startIndex;
        while(endIndex < textValue.length)
        {
            if(textValue[endIndex] != '\n')
            {
                endIndex++;
            }
            else
            {
                break;
            }
        }
        
        // If the start index is not invalid (-1)
        if(startIndex !== -1)
        {
            // Return the start and end index
            return [startIndex, endIndex];
        }
    }
    
    // Finds and selects an empty element in the input area passing in what empty element (ex: pass in 4, select the 4th empty element)
    function selectEmptyElement(passedEmpty)
    {
        // Converts the parameter to zero-indexed
        let selectedElement = passedEmpty - 1;
        
        // Find and select the empty element
        let startIndex = csvCoordinateToIndex(inputTextArea.value, checkForSpecificErrors("emptyElements")[1][selectedElement]);
        
        // If the start index is not invalid (-1)
        if(startIndex !== -1)
        {
            // If the previous character is a comma or a new line
            if(inputTextArea.value[startIndex - 1] == "," || inputTextArea.value[startIndex - 1] == "\n")
            {
                // Select the empty element in the input text area
                inputTextArea.focus();
                inputTextArea.setSelectionRange(startIndex - 1, startIndex);
                
                // Scroll to the selected value
                scrollToSelected(startIndex - 1, startIndex);
            }
            else if(inputTextArea.value[startIndex + 1] == "\n") // If the next character is a new line
            {
                // Select the empty element in the input text area
                inputTextArea.focus();
                inputTextArea.setSelectionRange(startIndex, startIndex + 1);
                
                // Scroll to the selected value
                scrollToSelected(startIndex, startIndex + 1);
            }
            else if(startIndex == 0 && inputTextArea.value[startIndex + 1] != null) // If there is no previous character and there is a next character
            {
                // Select the empty element in the input text area
                inputTextArea.focus();
                inputTextArea.setSelectionRange(startIndex, startIndex + 1);
                
                // Scroll to the selected value
                scrollToSelected(startIndex, startIndex + 1);
            }
            else
            {
                // Select the empty element in the input text area
                inputTextArea.focus();
                inputTextArea.setSelectionRange(startIndex, startIndex);
                
                // Scroll to the selected value
                scrollToSelected(startIndex, startIndex);
            }
        }
    }
    
    // Returns the start and end indexes of the empty element passed in
    function emptyElementIndexes()
    {
        // Converts the parameter to zero-indexed
        let selectedElement = 0;
        
        // Find and select the empty element
        let startIndex = csvCoordinateToIndex(inputTextArea.value, checkForSpecificErrors("emptyElements")[1][selectedElement]);
        
        // If the start index is not invalid (-1)
        if(startIndex !== -1)
        {
            // If the previous character is a comma or a new line
            if(inputTextArea.value[startIndex - 1] == "," || inputTextArea.value[startIndex - 1] == "\n")
            {
                // Return the start and end index
                return [startIndex - 1, startIndex];
            }
            else if(inputTextArea.value[startIndex + 1] == "\n") // If the next character is a new line
            {
                // Return the start and end index
                return [startIndex, startIndex + 1];
            }
            else if(startIndex == 0 && inputTextArea.value[startIndex + 1] != null) // If there is no previous character and there is a next character
            {
                // Return the start and end index
                return [startIndex, startIndex + 1];
            }
            else
            {
                // Return the start and end index
                return [startIndex, startIndex];
            }
        }
    }
    
    // Finds and selects false carriage return in the input area given what false carriage return (ex: pass in 4, select the 4th false carriage return)
    function selectCarriageReturn(passedCarriage)
    {
        // Converts the parameter to zero-indexed
        let selectedElement = passedCarriage - 1;
        
        // Find and select the false carriage return
        let startIndex = checkForSpecificErrors("falseCarriageReturns")[1][selectedElement];
        
        // If the start index is not invalid (-1)
        if(startIndex !== -1)
        {
            // Select the false carriage return in the input text area
            inputTextArea.focus();
            inputTextArea.setSelectionRange(startIndex, startIndex + 2);
            
            // Scroll to the selected value
            scrollToSelected(startIndex, startIndex + 2);
        }
    }
    
    // Returns the start and end indexes of the carriage return passed in
    function carriageReturnIndexes()
    {
        // Converts the parameter to zero-indexed
        let selectedElement = 0;
        
        // Find and select the false carriage return
        let startIndex = checkForSpecificErrors("falseCarriageReturns")[1][selectedElement];
        
        // If the start index is not invalid (-1)
        if(startIndex !== -1)
        {
            // Return the start and end index
            return [startIndex, startIndex + 2];
        }
    }
    
    // Finds and selects false new line in the input are given what false new line (ex: pass 4, select the 4th false new line)
    function selectNewLine(passedNewLine) {
        // Converts the parameter to zero-indexed
        let selectedElement = passedNewLine - 1;
        
        // Find and select the false new line
        let startIndex = checkForSpecificErrors("falseNewLines")[1][selectedElement];
        
        // If the start index is not invalid (-1)
        if(startIndex !== -1)
        {
            // Select the false carriage return in the input text area
            inputTextArea.focus();
            inputTextArea.setSelectionRange(startIndex, startIndex + 2);
            
            // Scroll to the selected value
            scrollToSelected(startIndex, startIndex + 2);
        }
    }
    
    // Returns the start and end indexes of the new line passed in
    function newLineIndexes() {
        // Converts the parameter to zero-indexed
        let selectedElement = 0;
        
        // Find and select the false new line
        let startIndex = checkForSpecificErrors("falseNewLines")[1][selectedElement];
        
        // If the start index is not invalid (-1)
        if(startIndex !== -1)
        {
            // Return the start and end index
            return [startIndex, startIndex + 2];
        }
    }
    
    // Scroll to selected text
    function scrollToSelected(startPos, endPos)
    {
        // If the div is scrolling
        if(inputParentDiv.scrollHeight > parseInt(inputParentDiv.style.height))
        {
            // Find the text from the text area
            let text = inputTextArea.value;
            
            // Find how many rows of text are in the text area
            const rows = text.split("\n").length;
            
            // Calculate the height of a single line of text within the textarea
            const lineHeight = inputTextArea.scrollHeight/ rows;
            
            // Calculate the number of lines between the top of the textarea and the selected text
            const linesAbove = text.substr(0, startPos).split('\n').length - 1;
            
            // Find how many pixels are between the top of the text area and the top of the selected text
            const topOffset = (linesAbove) * lineHeight;
            
            // Find how many lines fit in the height of the div (minus 0.6)
            let linesContainedByDiv = parseInt(inputParentDiv.style.height)/lineHeight - 0.6;
            
            // If selected text is already on the screen
            if(inputParentDiv.scrollTop < topOffset && topOffset < inputParentDiv.scrollTop + (linesContainedByDiv * lineHeight))
            {
                // Do nothing
            }
            else if(topOffset > inputParentDiv.scrollHeight - parseInt(inputParentDiv.style.height)/3) // If the selected text is too close to the bottom to center it at 1/3 the height of the div
            {
                // Scroll the scrolling div to the calculated top offset
                inputParentDiv.scrollTop = topOffset;
            }
            else // If the selected text is not too close to the bottom and is not already in view
            {
                // Scroll the scrolling div to center it at 1/3 the height of the div
                inputParentDiv.scrollTop = topOffset - parseInt(inputParentDiv.style.height)/3;
            }
        }
    }
}

// Clears all children but the first in a div
function clearDivExcludingFirst(divID)
{
    // Finding the parameter div from ID
    let myDiv = document.getElementById(divID);

    // Get the first child element
    let firstChild = myDiv.firstElementChild;

    // Remove all child elements except the first one
    while (myDiv.childElementCount > 1) {
        myDiv.removeChild(myDiv.lastElementChild);
    }
}

// Returns the index of an element in CSV given the coordinate from the 2d array form
function csvCoordinateToIndex(csvData, coordinate)
{
    // Parse the CSV into a 2D array
    const csvArray = CSVtoArray(csvData);
    
    const [row, column] = coordinate;
    
    // Check if the coordinate is valid
    if (row >= 0 && row < csvArray.length && column >= 0 && column < csvArray[row].length)
    {
        // Calculate the index
        let index = 0;
        
        // Loop through the rows until the row that is passed in the coordinate
        for(let y = 0; y <= row; y++)
        {
            // If current row is less than the coordinate row
            if(y < row)
            {
                // Loop through the columns of the current row
                for(let x = 0; x < csvArray[y].length; x++)
                {
                    // Add the length of the current element to the index
                    index += csvArray[y][x].length;
                    
                    // If the current element is at least one away from the end of the current row
                    if(x < csvArray[y].length - 1)
                    {
                        index++; // Add one to the index (for the comma)
                    }
                }
                
                index ++; // Add one to the index (for the new line)
            }
            else if(y == row) // If current row is the coordinate row
            {
                // Loop through the columns of the current row until the coordinate column
                for(let x = 0; x < column; x++)
                {
                    // Add the length of the current element to the index
                    index += csvArray[y][x].length;
                    
                    // If the current element is at least one away from the end of the current row
                    if(x < column)
                    {
                        index++; // Add one to the index (for the comma)
                    }
                }
            }
        }
        
        return index;
    }
    else
    {
        // Coordinate is out of bounds
        return -1;
    }
}

// Returns the index of an element in CSV given the coordinate from the 2d array form
function csvCoordinateToIndexes(csvData, coordinate)
{
    // Parse the CSV into a 2D array
    const csvArray = CSVtoArray(csvData);
    
    const [row, column] = coordinate;
    
    // Check if the coordinate is valid
    if (row >= 0 && row < csvArray.length && column >= 0 && column < csvArray[row].length)
    {
        // Calculate the index
        let index = 0;
        let endIndex = 0;
        
        // Loop through the rows until the row that is passed in the coordinate
        for(let y = 0; y <= row; y++)
        {
            // If current row is less than the coordinate row
            if(y < row)
            {
                // Loop through the columns of the current row
                for(let x = 0; x < csvArray[y].length; x++)
                {
                    // Add the length of the current element to the index
                    index += csvArray[y][x].length;
                    
                    // If the current element is at least one away from the end of the current row
                    if(x < csvArray[y].length - 1)
                    {
                        index++; // Add one to the index (for the comma)
                    }
                }
                
                index ++; // Add one to the index (for the new line)
            }
            else if(y == row) // If current row is the coordinate row
            {
                // Loop through the columns of the current row until the coordinate column
                for(let x = 0; x < column; x++)
                {
                    // Add the length of the current element to the index
                    index += csvArray[y][x].length;
                    
                    // If the current element is at least one away from the end of the current row
                    if(x < column)
                    {
                        index++; // Add one to the index (for the comma)
                    }
                }
                
                endIndex = index + csvArray[y][column].length;
            }
        }
        
        return [index,endIndex];
    }
    else
    {
        // Coordinate is out of bounds
        return -1;
    }
}

// Returns the coordinate of an element in CSV given the index (format: [row, column, index])
function csvIndexToCoordinate(csvData, index)
{
    // Placeholder for the coordinate
    let csvCoordinate = [];
    
    // Check if the index is valid
    if(index <= csvData.length)
    {
        // Parse the CSV into a 2D array
        const csvArray = CSVtoArray(csvData);
        
        // Make a substring that goes up to the index
        let csvSubstring = csvData.substring(0, index);
        
        // Parse the substring into a 2D array
        let substringArray = CSVtoArray(csvSubstring);
        
        // Find the last index in the substring array
        let lastIndexRow = substringArray.length - 1;
        let lastIndexCol = substringArray[lastIndexRow].length - 1;
        
        csvCoordinate = [lastIndexRow, lastIndexCol, substringArray[lastIndexRow][lastIndexCol].length];
    }
    
    // Returns the coordinate
    return csvCoordinate;
}

// Handles autosizing the text area
function areaAutosize(areaID, ongoing)
{
    // Find text area
    let textarea = document.getElementById(areaID);
    
    // Find parent div
    let parentArea = textarea.parentElement;
    
    // Find max width
    let MAX_WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    MAX_WIDTH = MAX_WIDTH * 0.98;
    
    // Create a default text area
    let defaultTextArea = document.createElement('textarea');
    document.body.appendChild(defaultTextArea);
    
    // Get the computed styles
    let computedStyles = window.getComputedStyle(defaultTextArea);
    
    // Find the minimum width and minimum height (width and height of default text area)
    let MIN_WIDTH = parseInt(computedStyles.getPropertyValue("width"));
    let MIN_HEIGHT = parseInt(computedStyles.getPropertyValue("height"));
    
    // Remove the invisible textarea
    defaultTextArea.remove();
    
    // Set text area to minimum size
    textarea.style.width = MIN_WIDTH + "px";
    textarea.style.height = MIN_HEIGHT + "px";
    
    // Run preconditions on text area and parent div
    autosizePreconditions();
    
    // Find the normal difference of parentArea.offsetWidth and parentArea.clientWidth (used for vertical scrollbar width later on)
    let NORMAL_MARGIN = parentArea.offsetWidth - parentArea.clientWidth;
    
    // Run initial autosize
    autosizeHandler();
    
    // If ongoing is true
    if(ongoing == true)
    {
        // Set autosize to the input event off the text area
        textarea.addEventListener('input', function()
        {
            autosizeHandler();
        });
    }
    
    // Autosize handler
    function autosizeHandler()
    {
        // Width sizing
        // Set width overflow (with scrollbar)
        textarea.style.overflowX = 'auto';
        textarea.style.whiteSpace = 'pre';
        
        // Autogrow vvv
        // If scroll width (width of text) is greater than client width (width of the textarea viewport)
        if (textarea.scrollWidth > textarea.clientWidth) {
            textarea.style.width = textarea.scrollWidth + 'px'; // Set textarea width to the scroll width
        }
        // Autoshrink
        else // If scroll width (width of text) is less than client width (width of the textarea viewport)
        {
            // Set width to minimum size
            textarea.style.width = MIN_WIDTH + "px";
            
            // If scroll width is greater than client width
            if (textarea.scrollWidth > textarea.clientWidth) {
                textarea.style.width = textarea.scrollWidth + 'px'; // Set textarea width to the scroll width
            }
        }
        
        // Height sizing
        // Set height to auto
        textarea.style.height = 'auto';
        
        // Set height to scroll height
        textarea.style.height = textarea.scrollHeight + "px";
        
        // Check minimum size
        if(parseInt(textarea.style.width) < MIN_WIDTH)
        {
            textarea.style.width = MIN_WIDTH + "px";
        }
        
        if(parseInt(textarea.style.height) < MIN_HEIGHT)
        {
            textarea.style.height = MIN_HEIGHT + "px";
        }
        
        // Deal with parent width
        parentArea.style.width = MIN_WIDTH + "px";
        parentArea.style.width = parentArea.scrollWidth + "px";
        
        // Deal with parent height
        parentArea.style.height = "auto";
        
        // If parent div's height is greater than a quarter of the screen
        if(parentArea.scrollHeight > window.innerHeight * 0.25)
        {
            // Set parent area height a quarter of the screen height
            parentArea.style.height = window.innerHeight * 0.25 + "px";
        }
        
        // If difference between parentArea.offsetWidth and parentArea.clientWidth is greater than normal
        if(parentArea.offsetWidth - parentArea.clientWidth > NORMAL_MARGIN)
        {
            // Add difference to the width
            parentArea.style.width = parseInt(parentArea.style.width) + ((parentArea.offsetWidth - parentArea.clientWidth) - NORMAL_MARGIN) + "px";
        }
        
        // Check maximum size of parent div
        // If parent div's width is greater than the max width
        if(parseInt(parentArea.style.width) > MAX_WIDTH)
        {
            // Set parent area width to the max width
            parentArea.style.width = MAX_WIDTH + "px";
        }
    }
    
    // Sets preconditions for text area autosizing
    function autosizePreconditions()
    {
        // TEXT AREA vvv
        // Disable resizes
        textarea.style.resize = "none";
        
        // Have the text area overflow horizontally to make a scrollbar (instead of overflow to the next line)
        textarea.style.overflowX = 'auto';
        textarea.style.whiteSpace = 'pre';
        
        // Set the border to none
        textarea.style.border = "none";
        
        // Set the textarea's display property to 'block'
        textarea.style.display = 'block';
        
        // PARENT DIV vvv
        // Make a rounded black border on the div
        parentArea.style.border = "1px solid black";
        parentArea.style.borderRadius = '3px';
        
        // Set parent div size
        parentArea.style.width = "0px";
        parentArea.style.width = parentArea.scrollWidth + "px";
        
        parentArea.style.height = "0px";
        parentArea.style.height = parentArea.scrollHeight + "px";
        
        // Have the div overflow horizontally to make a scrollbar
        parentArea.style.overflowX = 'auto';
    }
}
