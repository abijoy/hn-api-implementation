
// perfect !!!

// getting top stories IDs.

var counter = 1;
var asyn = false;
var x = 1;
var scy;
var boh;
var k=0;
var paginator = 7;
var storyCount = 1;
var xhrList = {};
var topStoriesIDs;
var typeofStory= 'top';
var section = document.createElement('section')
//document.getElementById('storyType').textContent = typeofStory;

function getStoriesIds () {
	k=0;
	paginator = 7;
	x = 1;
	scy;
	boh;
	storyCount = 1;
	xhrList = {};
	topStoriesIDs;
	//typeofStory= 'top';
	topStoriesURL = `https://hacker-news.firebaseio.com/v0/${typeofStory}stories.json`;
	document.querySelector('title').textContent = `Hacker News ${typeofStory} stories`;
	topStoriesXHR = new XMLHttpRequest();
	topStoriesXHR.open('GET', topStoriesURL, false);
	topStoriesXHR.onload = function () {
		topStoriesIDs = JSON.parse(topStoriesXHR.response);
	}
	topStoriesXHR.send();
	//controllerFunc();
}
getStoriesIds();
console.log(topStoriesIDs.length);
//controllerFunc();


controllerFunc();
function controllerFunc() {
	//console.log(k);
	storyCount = 1;
	var partialTops = topStoriesIDs.slice(k, paginator);
	for (var key in partialTops) {
		fetchStory(partialTops[key], topStoriesIDs.indexOf(partialTops[key]))
	}
	var temp = paginator;
	k = paginator;
	paginator += 7;
	storyCount = 1;
	//console.log(k,paginator, xhrList)
}



function fetchStory(s, i) {
	xhrList[i] = new XMLHttpRequest();
	var url = `https://hacker-news.firebaseio.com/v0/item/${s}.json`;
	//console.log(url);
	//xhr = new XMLHttpRequest();
	xhrList[i].open('GET', url, true);
	xhrList[i].responseType = 'json';
	xhrList[i].onreadystatechange = function () {
		if(xhrList[i].readyState == 4) {
			//console.log(xhr.response);
			buildDOM(xhrList[i].response);
			if (storyCount == 7){
			//console.log(storyCount);
			//scy = window.scrollY;
			//boh = document.body.offsetHeight;
			//console.log(window.scrollY,(window.innerHeight + window.scrollY), document.body.offsetHeight);
			//console.log('=> StoryC: ', storyCount, scy, boh);
				//buildMoreButt();
			}
			storyCount += 1;
			//document.body.appendChild(div);
			//return xhr.response;
			//clearInterval(setInt);
		}
	}
	xhrList[i].send();
}

function buildDOM (story) {
		var mainThread = `https://news.ycombinator.com/item?id=${story['id']}`;
		var OPUrl = `https://news.ycombinator.com/user?id=${story['by']}`;
		
		var storyContainer = document.createElement('div');
		var countSpan = document.createElement('span');
		//countSpan.textContent = x+'. ';
		//countSpan.className = 'sp';
		storyContainer.appendChild(countSpan);

		var storyTitle = document.createElement('p');
		var storyUrl = document.createElement('a');

		var storyMetaContainer = document.createElement('p');
		var storyScore = document.createElement('span');
		var storyOP = document.createElement('span');
		var storyPostedTime = document.createElement('span');
		var storyComments = document.createElement('span');

		storyUrl.textContent = story['title'];
		storyUrl.href = story['url'] != undefined ? story['url'] : mainThread;
		storyUrl.target = '_blank';
		storyUrl.addClass = ''
		storyScore.innerHTML = `<b>${story['score']}</b> points   | `;
		storyOP.innerHTML = ` By <a href="${OPUrl}" target="_blank" class="spa"><b>${story['by']}</b></a> | `;
		storyPostedTime.textContent = unixTimeToHR(Number(story['time'])) +'  |  ';
		storyComments.innerHTML = `<a href="${mainThread}" target="_blank" class="spa"> <b>${story['descendants']}</b> comments</a>`;

		storyContainer.appendChild(storyUrl);

		storyMetaContainer.appendChild(storyScore);
		storyMetaContainer.appendChild(storyOP);
		storyMetaContainer.appendChild(storyPostedTime);
		storyMetaContainer.appendChild(storyComments);
		
		storyContainer.appendChild(storyMetaContainer);
		

		section.appendChild(storyContainer);
		document.body.appendChild(section);
		x += 1;
}

window.onscroll = function(ev) {
	//console.log('Before: ', scy, boh, window.scrollY,(window.innerHeight + window.scrollY), document.body.offsetHeight);
	if((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		//window.scrollY = 0;
		//console.log('After: ', window.innerHeight,window.scrollY,(window.innerHeight + window.scrollY), document.body.offsetHeight);
		controllerFunc();
		
	}
}


function unixTimeToHR(unixTimestamp) {
	var	givenDateObj = new Date(unixTimestamp*1000);
	var currentDateObj = new Date();
	var currentUnixDate = currentDateObj.getTime();
	var monthDict = {
		0: 'January',
		1: 'February',
		2: 'March',
		3: 'April',
		4: 'May',
		5: 'June',
		6: 'July',
		7: 'August',
		8: 'September',
		9: 'October',
		10: 'November',
		11: 'December'
	}

	var diff = Math.round((currentUnixDate - givenDateObj) / 1000);
	//console.log(currentUnixDate, givenDateObj, diff);
	var ft;

	var ampm = givenDateObj.getHours() >= 12 ? 'PM': 'AM';
	var hour;
	var minutes = givenDateObj.getMinutes();
	var date = givenDateObj.getDate();
	if (givenDateObj.getHours() == 0) {
		hour = 1;
	}
	else {
		hour = givenDateObj.getHours() > 12 ? givenDateObj.getHours() - 12 : givenDateObj.getHours();
	}
	if (hour < 10) {
		hour = '0'+hour;
	}
	if (minutes < 10) {
		minutes = '0'+minutes;
	}
	if (diff >= 86400 && diff <= 86400*2) {
		ft = `Yesterday at ${hour}:${minutes} ${ampm}`;
	}

	else if (diff < 86400) {
		var mins = Math.floor(diff / 60);
		//console.log(`mins ${mins}`)
		var duration;
		if (mins >= 60) {
			duration = Math.floor(mins / 60);
			duration = duration > 1?duration+' hours' : duration+' hour';
		}
		else {
			duration = mins > 1 ?mins+' minutes': mins+' minute';
		}
		ft = `${duration} ago`;
	}

	else {
		ft = `${monthDict[givenDateObj.getMonth()]} ${givenDateObj.getDate()} at ${hour}:${minutes} ${ampm}`;
	}

	return ft;
}

function fun() {
	typeofStory = document.querySelector('select').value;
	//console.log(typeofStory);
	document.querySelector('section').innerHTML = '';
	getStoriesIds();
	controllerFunc();
}
