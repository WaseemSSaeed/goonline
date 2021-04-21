function test(){
    this.name = '';
    this.hi = function(){
        alert(this.name);
    };
    return 0;
}
//setups
__courses = [];
__thisCourseID = 0;
__thisSectionID = 0;
__thisVideoID = 0;
__thisCourseKeywords = '';
__isRenderCourseOnLoad = true;
lastCourseID = null;

function loader(filer){
    $('#infoLoader').load(filer);
}
function loadCourse(tag){
    document.getElementById('infoLoader').innerHTML = __courses[__thisCourseID][tag];
}

function create(elementType, handlers, handlersIDs){
    i = 0;
    handlers.forEach(handler => {
        handler = document.createElement(elementType);
        if(handlersIDs[i] && handlersIDs[i] != ""){
            handler.id = handlersIDs[i];
        }
        i+=1;
    });
}

function append(parent, childs){
    childs.forEach(child => {
        parent.appendChild(child);
    });
}

//classes
function video(){
    this.source = '';
    this.addClass = '';
    this.parent = 'videoHolder';
    this.videoElement = document.createElement('video');
    this.videoElement.id = "videoElement";
    
    this.render = function(){
        this.videoElement.style = "width: 100%; height: 100%;";
        this.videoElement.src = this.source;
        this.videoElement.autoplay = false;
        this.videoElement.muted = false;
        this.videoElement.controls = true;
        this.videoElement.classList += this.addClass;

        document.getElementById(this.parent).appendChild(this.videoElement);
    }

    this.refresh = function(){
        this.videoElement.src = this.source;
    }
}

function course(courseName){
    
}

VDOBJ = '';
function videoPage(courseID){
    this.navBar = document.createElement('div');
    this.videoHolder = document.createElement('div'); this.videoHolder.id = 'videoHolder';
    this.videoAbout = document.createElement('div'); this.videoAbout.id = 'videoAbout';
    this.videoInfo = document.createElement('div'); this.videoInfo.id = 'videoInfo';
    this.mainCmd = document.createElement('div');
    this.navBarRightArrow = document.createElement('span');
    this.navBarLeftArrow = document.createElement('span');
    this.homeArrow = document.createElement('span');
    this.userDataDownload = document.createElement('span');
    this.videoKeywords = document.createElement('div'); this.videoKeywords.id = 'videoKeywords';

    this.navBarRightArrow.innerHTML = this.navBarLeftArrow.innerHTML = 'P';
    //this.navBar.id = 'navBar';
    this.navBar.classList = 'navBar';
    this.navBarRightArrow.classList = 'navBarRightArrow';
    this.navBarLeftArrow.classList = 'navBarLeftArrow';

    this.homeArrow.innerHTML = 'A';
        this.homeArrow.classList = 'navBarHomeArrdow';
        this.homeArrow.addEventListener('click', ()=>{
            window.location = 'http://localhost/prjopps/layouts/courseBrowse/';
        }, false);
    
    this.userDataDownload.innerHTML = '{';
        this.userDataDownload.classList = 'navBarUserDataArrow';
        this.userDataDownload.addEventListener('click', ()=>{
            downloadUserData();
        }, false);

    this.navBarRightArrow.addEventListener('click', ()=>{
        gotoNextVideo(VDOBJ);
    });
    this.navBarLeftArrow.addEventListener('click', ()=>{
        gotoPreviousVideo(VDOBJ);
    });
    this.videoInfo.innerHTML = '<div onclick="loader(\'http://localhost/prjopps/layouts/course/info-docs.html\')" class="barBtn">تحميل الملفات</div>\
                                <div onclick="loadCourse(\'courseAbout\')" class="barBtn">حول الكورس</div>\
                                <div id="infoLoader"></div>';
    
    this.render = function(){
        element = document.getElementById('body');
        element.innerHTML = '';
        element.appendChild(this.navBar);
        element.appendChild(this.videoHolder);
        element.appendChild(this.videoAbout);
        element.appendChild(this.videoKeywords);
        element.appendChild(this.videoInfo);
        element.appendChild(this.mainCmd);

        this.navBar.appendChild(this.navBarRightArrow);
        this.navBar.appendChild(this.navBarLeftArrow);
        this.navBar.appendChild(this.homeArrow);
        this.navBar.appendChild(this.userDataDownload);

        $('#userPanel').slideUp(500);
        $('#topMargin').slideUp(500);
        if(__courses[courseID] != undefined){
            var myVideo = new video();
            myVideo.source = __courses[courseID]["courseSections"][0]["secVideos"][0]["src"];
            myVideo.render();
            VDOBJ = myVideo;

            __thisCourseID = __courses[courseID]["courseID"];
        }
    }
}

function host(){
    this.name = 'myEduHost1';
    this.host = 'localhost';
    this.password = '';
    this.databases = [{"db1":["tb1","tb2","tb3"]}];

    this.httpEvents = [{"/":"index.htm"}, {"/$__name;": "<h1>hello $__name; </h1>"}];
}

function loadAllCourses(){
    var httpGetJSON = new XMLHttpRequest;
    if (httpGetJSON.readyState == 4 || httpGetJSON.readyState == 0){
        httpGetJSON.open("GET", "http://localhost/prjopps/jslib/testJSONCourse.json", true);
        httpGetJSON.onreadystatechange = function(){
            if (httpGetJSON.readyState == 4)
            {
                if (httpGetJSON.status == 200)
                { 
                    __courses = [];
                    __thisCourseID = 2;
                    __thisSectionID = 0;
                    __thisVideoID = 0;
                    __thisCourseKeywords = '';
                    __courses = JSON.parse(httpGetJSON.responseText);
                    if(__isRenderCourseOnLoad){
                        __courses[__thisCourseID]['courseKeywords'].forEach(keyword=>{
                            __thisCourseKeywords += "<span class='keyword'>" +keyword+ "</span>";
                            document.getElementById('videoKeywords').innerHTML = __thisCourseKeywords;
                        });
                    }
                    console.log('done');
                } else {
                    console.log('error');
                }
            }
        };
        httpGetJSON.send(null);
    }
}

function gotoNextVideo(videoObject){
    if(__thisVideoID == __courses[__thisCourseID]['courseSections'][__thisSectionID]['secVideos'].length - 1){
        console.log('أنت في الفيديو الأخير');
    } else {
        __nextVideoID = __thisVideoID+1;
        myNextVideo = __courses[__thisCourseID]['courseSections'][__thisSectionID]['secVideos'][__nextVideoID];
        videoObject.source = __courses[__thisCourseID]['courseSections'][__thisSectionID]['secVideos'][__thisVideoID+1]['src'];
        videoObject.refresh();
        console.log(myNextVideo['name']);
        document.querySelector('#videoAbout').innerHTML = myNextVideo['name'];
        __thisVideoID+=1;
    }
}
function gotoPreviousVideo(videoObject){
    if(__thisVideoID != 0){
        myPreviousVideo = __courses[__thisCourseID]['courseSections'][__thisSectionID]['secVideos'][__thisVideoID-1];
        videoObject.source = __courses[__thisCourseID]['courseSections'][__thisSectionID]['secVideos'][__thisVideoID-1]['src'];
        videoObject.refresh();
        console.log(myPreviousVideo['name']);
        document.querySelector('#videoAbout').innerHTML = myPreviousVideo['name'];
        __thisVideoID = __thisVideoID-1;
    } else {
        console.log('أنت في الفيديو الأول');
    }
}

function coursesBrowser(){
    this.navBar = document.createElement('div');
        //this.navBar.classList = 'navBar normalNavBar';
        this.navBar.classList = 'navBar mainNavBar';
        //this.navBar.innerHTML = 'تصفح الكورسات';
        this.navBar.id = 'navBar';
        
    this.navBarBody = document.createElement('div');
        this.navBarBody.classList = 'mainNavBarBdy';
        this.navBar.appendChild(this.navBarBody);

    this.navBarHeadline = document.createElement('span');
        this.navBarHeadline.innerHTML = 'أgنلاين';
        this.navBarHeadline.classList = 'navbarHeadline';
        this.navBarBody.appendChild(this.navBarHeadline);
    
    this.navBarLogo = document.createElement('span');
        this.navBarLogo.innerHTML = '$';
        this.navBarLogo.classList = 'navBarLogo';
        this.navBarBody.appendChild(this.navBarLogo);
    
    this.navBarMenuBtn = document.createElement('span');
        this.navBarMenuBtn.innerHTML = '...';
        this.navBarMenuBtn.classList = 'navBarMenuBtn';
        this.navBarBody.appendChild(this.navBarMenuBtn);
    
    this.navbarSubHeadline = document.createElement('span');
        //this.navbarSubHeadline.innerHTML = 'نتعلم ، نعلم ، نكبر سوا...';
        this.navbarSubHeadline.classList = 'navbarSubHeadline';
        this.navBarBody.appendChild(this.navbarSubHeadline);

    this.courses = __courses;
    this.color = 'teal';

    this.render = function(){
        document.getElementById('body').appendChild(this.navBar);

        courseBrowseDiv = document.createElement('div');
            courseBrowseDiv.classList = 'courseBrowseDiv';
    
        __courses.forEach(course => {
            this.color = course['courseColor'];
            courseCard = document.createElement('div');
            courseCard.style.borderColor = this.color;
            courseCard.classList = 'courseCard card-rightBorder';

            courseImageHolder = document.createElement('div');
                courseImageHolder.classList = 'courseImgHolder';

            courseImage = document.createElement('img');
                courseImage.src = course['courseImage'];

            courseTitle = document.createElement('span');
                courseTitle.classList = 'courseTitle';
                courseTitle.innerHTML = course['courseName'];

            courseKeywords = document.createElement('div');
                courseKeywords.classList = 'courseKeywords';
            
            courseAbout = document.createElement('div');
                courseAbout.classList = 'courseAbout';
                courseAbout.innerHTML = course['courseAbout'];

            courseDuration = document.createElement('span'); courseDuration.classList = 'keyword courseInfo';
                if(course['courseDuration'] == 1){
                    courseDuration.innerHTML = 'ساعة واحدة';
                } else if (course['courseDuration'] == 2){
                    courseDuration.innerHTML = 'ساعتان';
                } else {
                    courseDuration.innerHTML = course['courseDuration'] + " ساعة";
                }
                courseKeywords.appendChild(courseDuration);

            course['courseKeywords'].forEach(keyword=>{
                keywordElement = document.createElement('span'); keywordElement.classList = 'keyword';
                keywordElement.innerHTML = keyword;
                keywordElement.style.backgroundColor = this.color;
                courseKeywords.appendChild(keywordElement);
            });

            courseGoto = document.createElement('button');
                courseGoto.innerHTML = 'ذهاب إلى الكورس';
                courseGoto.classList = 'cardbtn';
                courseGoto.style.backgroundColor = course['courseColor'];
                courseGoto.addEventListener('click', ()=>{
                    myGoto = new videoPage(course["courseID"]);
                    if(lastCourseID == course["courseID"]){
                        console.log('أهلاً مجدداً');
                    }
                    myGoto.render();
                }, false);

            courseImageHolder.appendChild(courseImage);
            courseCard.appendChild(courseImageHolder);
            courseImageHolder.appendChild(courseTitle);
            courseCard.appendChild(courseKeywords);
            courseCard.appendChild(courseAbout);
            courseCard.appendChild(courseGoto);
            courseBrowseDiv.appendChild(courseCard);
        });
        document.getElementById('body').appendChild(courseBrowseDiv);
    }
}

function downloadUserData(){
    cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        if(cookie.split('userLocalBackup'+'=') != 0){
            myCookie = cookie.split('userLocalBackup'+'=')[1];
            var dataString = "data: text/json;charset=utf-8, "
                        + encodeURIComponent(myCookie);
            var downloadElement = document.createElement('a');
            downloadElement.setAttribute('href', dataString);
            downloadElement.setAttribute('download', "test.json");
            downloadElement.style.visibility = 'hidden';
            document.body.appendChild(downloadElement);
            downloadElement.click();
            downloadElement.remove();
            //exit;
        } else {
            myCookie = undefined;
        }
    });
}
