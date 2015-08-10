
var taskDetails = {};
taskDetails["LANG"] = {title: "Which language?", src:"images/LANG.png"};
taskDetails["AIRL"] = {title: "Which airline?", src:"images/AIRL.png"};
taskDetails["BKRF"] = {title: "Booking reference", src:"images/BKRF.png"};
taskDetails["FRBN"] = {title: "Forbidden materials?", src:"images/FRBN.png"};
taskDetails["STSO"] = {title: "Outbound Seat", src:"images/STSO.png"};
taskDetails["EXBG"] = {title: "Buy extra bag?", src:"images/EXBG.png"};
taskDetails["PRLT"] = {title: "Print luggage tag?", src:"images/PRLT.png"};
taskDetails["CFRM"] = {title: "Confirm", src:"images/CFRM.png"};
taskDetails["PRBP"] = {title: "Reprint boarding pass?", src:"images/PRBP.png"};
taskDetails["DIMH"] = {title: "Hand luggage size?", src:"images/DIMH.png"};
taskDetails["LIQH"] = {title: "Liquids >100ml?", src:"images/LIQH.png"};

// Dependecies need to be flattened
var partialOrder = {};
partialOrder["LANG"] = [""];
partialOrder["AIRL"] = ["LANG"];
partialOrder["BKRF"] = ["LANG", "AIRL"];
partialOrder["FRBN"] = ["LANG"];
partialOrder["STSO"] = ["LANG", "BKRF", "AIRL"];
partialOrder["EXBG"] = ["LANG", "AIRL", "BKRF"];
partialOrder["PRLT"] = ["LANG", "AIRL", "BKRF", "STSO", "EXBG", "CFRM"];
partialOrder["PRBP"] = ["LANG", "AIRL", "BKRF", "CFRM", "STSO"];
partialOrder["DIMH"] = ["LANG", "AIRL"];
partialOrder["LIQH"] = ["LANG"];
partialOrder["CFRM"] = ["STSO", "LANG", "AIRL", "BKRF"];

var checkintask = document.getElementById("checkin-task");
var taskpool = document.getElementById("checkin-task-pool");

for (var key in taskDetails) {
    // Create a new task
    var task = document.createElement("li");
    task.classList.add("task");
    task.setAttribute("draggable", true);
    task.setAttribute("id", key);

    // Add the task details: title...
    var taskDetail= document.createElement("div");
    taskDetail.classList.add("task-detail");
    var taskTitle = document.createElement("span");
    var taskTitleValue = document.createTextNode(taskDetails[key].title);
    var taskImage = document.createElement("img");
    taskImage.setAttribute('src', taskDetails[key].src);
    taskImage.setAttribute('height', '100px');
    taskImage.setAttribute('width', '200px');
    taskTitle.appendChild(taskTitleValue);
    taskTitle.appendChild(taskImage);
    taskDetail.appendChild(taskTitle);
    task.appendChild(taskDetail);

    // Add the right and left elements to the task
    var right = document.createElement("div");
    right.classList.add("right");
    task.appendChild(right);

    // Add the new task to the approriate HTML list
    if (key === "LANG") {
        // Add the task to the checkin task 
        checkintask.appendChild(task);
    } else {
        // Add the task to the taskpool
        taskpool.appendChild(task);
    }
}

function displayCheckinTaskOrdering() {
    var listItems = checkintask.getElementsByTagName('li');
    var checkinTaskStr = "Checkin task ordering\n";
    for (var i = 0; i < listItems.length-1; i++) {
        var task = listItems[i];
        var taskId = task.getAttribute("id");
        checkinTaskStr = checkinTaskStr.concat(taskId);
        checkinTaskStr = checkinTaskStr.concat(", ");
    }
    checkinTaskStr = checkinTaskStr.concat(listItems[listItems.length-1].getAttribute("id"));
    alert(checkinTaskStr);
}

function checkPartialOrder() {
    var listItems = checkintask.getElementsByTagName('li');
    var orderingExceptionsSet = new Set();
    var orderingExceptions = {};
    for (var i = 0; i < listItems.length; i++) {
        var task = listItems[i];
        var taskId = task.getAttribute("id");
        if (taskId in partialOrder) {
            partialOrder[taskId].forEach(function(item) {
                for (var j = i+1; j < listItems.length; j++) {
                    var nTask = listItems[j];
                    var nTaskId = nTask.getAttribute("id");
                    if (nTaskId === item) {
                        task.getElementsByClassName("task-detail")[0].classList.add("wrong-order")
                        nTask.getElementsByClassName("task-detail")[0].classList.add("wrong-order");
                        if (!(nTaskId in orderingExceptions)) {
                            orderingExceptions[nTaskId] = new Array(); 
                        }
                        orderingExceptions[nTaskId].push(taskId);
                        orderingExceptionsSet.add(taskId); 
                        orderingExceptionsSet.add(nTaskId); 
                    } else  {
                        if (!orderingExceptionsSet.has(taskId)) {
                            listItems[i].getElementsByClassName("task-detail")[0].classList.remove("wrong-order")
                        }
                        if (!orderingExceptionsSet.has(nTaskId)) {
                            listItems[j].getElementsByClassName("task-detail")[0].classList.remove("wrong-order");
                        }
                    }
                }
            });
        }
    }

    // Create the alert warning about all partial ordering constraints
    var nOrderingExceptions = 0;
    for (var item in orderingExceptions) {
       nOrderingExceptions++; 
    }
    if (nOrderingExceptions !== 0) {
        var warningStr = "Partial order constraint(s) not satisfied\n";
        for (var item in orderingExceptions) {
			warningStr = warningStr.concat("</br>");
            //warningStr = warningStr.concat(item);
			warningStr = warningStr.concat("[");
			warningStr = warningStr.concat(taskDetails[item].title);
			warningStr = warningStr.concat("]");
            warningStr = warningStr.concat(" must be before ");
            var tempStr = "";
            for (var i = 0; i < orderingExceptions[item].length-1; i++) {
				tempStr = tempStr.concat("[");
                tempStr = tempStr.concat(taskDetails[orderingExceptions[item][i]].title);
                tempStr = tempStr.concat("], ");
            }
			tempStr = tempStr.concat("[");
            tempStr = tempStr.concat(taskDetails[orderingExceptions[item][orderingExceptions[item].length-1]].title);
			tempStr = tempStr.concat("]");
            warningStr = warningStr.concat(tempStr);
            
        }
        //alert(warningStr);

    // Add the task details: title...
	var alertInfo = document.getElementById("alertInfo");
    //task.appendChild(taskDetail);
	alertInfo.innerHTML = warningStr;
    }
}

function sendTracking()
  {
       var listItems = document.getElementById("checkin-task").children;
	   var checkinTaskStr = '';
	   for (var i = 0; i < listItems.length - 1; i++) {
        var task = listItems[i];
        var taskId = task.getAttribute("id");
        checkinTaskStr = checkinTaskStr.concat(taskId);
        checkinTaskStr = checkinTaskStr.concat(">");
    	}
	   checkinTaskStr = checkinTaskStr.concat(listItems[listItems.length-1].getAttribute("id"));
	   //value = document.getElementById("checkin-task").innerText;
       var xmlhttp = new XMLHttpRequest();
       xmlhttp.open("GET","http://localhost:8090?value="+checkinTaskStr+"&ts="+new Date().getTime(),true);
       xmlhttp.send();
       alert("Thank you! Please call the experimenter.");
  }

function displayButton(){
    document.getElementById("check").style.visibility = 'visible';
}

// Utils

String.prototype.format = function() {
    var s = this, i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var forEach = function(array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
    }
};

// Main

var tasks = document.querySelectorAll('.task');

var draggingEl = null;

var handleDragStart = function(e) {
    // this is the thing that started getting dragged
    this.classList.add('dragging');

    draggingEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
};

var handleDragOver = function(e) {
    if (e.preventDefault) {
        // Allows us to drop.
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    return false;
}

var handleDragEnter = function(e) {
    // this is the thing that's having something dragged over it
    this.classList.add('over');
};

var handleDragEnterLeft = function(e) {
    // this is the thing that's having something dragged over it
    this.parentNode.classList.add('over-left');
};

var handleDragEnterRight = function(e) {
    // this is the thing that's having something dragged over it
    this.parentNode.classList.add('over-right');
};

var handleDragLeave = function(e) {
    // this is the thing that's having something dragged over it
    this.classList.remove('over');
};

function handleDragLeaveLeft(e) {
    this.parentNode.classList.remove('over-left');
}

function handleDragLeaveRight(e) {
    this.parentNode.classList.remove('over-right');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        // Stops the browser from redirecting.
        e.stopPropagation();
    }

    // this is the element that's getting dropped on
    if (draggingEl != this) {
        // Remove the draggingEl from its parent and reattach it before this
        draggingEl.parentNode.removeChild(draggingEl);
        this.parentNode.insertBefore(draggingEl, this);

        // Swap the contents of draggingEl and this
        //draggingEl.innerHTML = this.innerHTML;
        //this.innerHTML = e.dataTransfer.getData('text/html');
    }
    // Do nothing if we drop an element on itself

    return false;
}

function getFirstChild(el){
  var firstChild = el.firstChild;
  while(firstChild != null && firstChild.nodeType == 3) { // skip TextNodes
    firstChild = firstChild.nextSibling;
  }
  return firstChild;
}

function handleDropLeft(e) {
    if (e.stopPropagation) {
        // Stops the browser from redirecting
        e.stopPropagation();
    }

    // this is the "left" element that's getting dropped on    
    var targetListEl = this.parentNode.parentNode;
    var targetItemEl = this.parentNode;

    // Check we're not just dropping something on itself
    if (draggingEl != targetItemEl) {
        // Remove draggingEl from its parent
        draggingEl.parentNode.removeChild(draggingEl);

        if (getFirstChild(targetListEl) === targetItemEl) {
            // Add <div class="left"/> to the draggingEl (that is, the new first
            // element in the HTML list) and remove it from the targetItemEl 
            var newDivEl = document.createElement("div");
            newDivEl.classList.add('left');
            newDivEl.addEventListener('drop', handleDropLeft, false);
            newDivEl.addEventListener('dragenter', handleDragEnterLeft, false);
            newDivEl.addEventListener('dragleave', handleDragLeaveLeft, false);
            draggingEl.appendChild(newDivEl);
            
            var leftDiv = targetItemEl.querySelectorAll(':scope > .left');
            targetItemEl.removeChild(leftDiv[0]);
        }

        // Put it into the target list
        targetListEl.insertBefore(draggingEl, targetItemEl);
    }
    return false;
}

function handleDropRight(e) {
    if (e.stopPropagation) {
        // Stops the browser from redirecting
        e.stopPropagation();
    }

    // this is the "right" element that's getting dropped on
    var targetListEl = this.parentNode.parentNode;
    var targetItemEl = this.parentNode;
    
    // Check we're not just dropping something on itself
    if (draggingEl != targetItemEl) {
        // Remove draggingEl from its parent
        draggingEl.parentNode.removeChild(draggingEl);

        // Put it into the target list
        if (targetItemEl.nextSibling != null) {
            // Put draggingEl before the next item in the list
            targetListEl.insertBefore(draggingEl, targetItemEl.nextSibling);
        } else {
            // No next item, so just append (there is no "insertAfter" method).
            targetListEl.appendChild(draggingEl);
        }
    }
    return false;
}

function handleDragEnd(e) {
    // this is the thing that stopping getting dragged
    forEach(tasks, function (index, item) {
        item.classList.remove('over');
        item.classList.remove('over-left');
        item.classList.remove('over-right');
        item.classList.remove('dragging');
        });
}

forEach(tasks, function (index, item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragend', handleDragEnd, false);
});

forEach(document.querySelectorAll('.left'), function (index, item) {
    item.addEventListener('drop', handleDropLeft, false);
    item.addEventListener('dragenter', handleDragEnterLeft, false);
    item.addEventListener('dragleave', handleDragLeaveLeft, false);
});

forEach(document.querySelectorAll('.right'), function (index, item) {
    item.addEventListener('drop', handleDropRight, false);
    item.addEventListener('dragenter', handleDragEnterRight, false);
    item.addEventListener('dragleave', handleDragLeaveRight, false);
});
