document.addEventListener("DOMContentLoaded",function() {

    const searchButton=document.getElementById("search-button");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-cards");

    //returns true or false
    function validateusername(username){
        if(username.trim()==""){
            alert("username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;

            const response=await fetch(url);

            // const proxyUrl=`https://cors-anywhere.herokuapp.com/`
            // const targetUrl = `https://leetcode.com/graphql/`;//GRPAH QL
            // //concatenated url:https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/

            // const myHeaders = new Headers();
            // myHeaders.append("content-type", "application/json");
            // const graphQL = JSON.stringify({
            //     query: `query userSessionProgress($username: String!) {
            //     allQuestionsCount {
            //     difficulty
            //     count
            //     }
            //     matchedUser(username: $username) {
            //     submitStats {
            //     acSubmissionNum {
            //     difficulty
            //     count
            // }
            // totalSubmissionNum {
            //     difficulty
            //     count
            // }}}}`,
            // variables: { "username": `${username}` }
            // });
            // const requestOptions = {
            //     method: "POST",
            //     headers: myHeaders,
            //     body: graphQL,
            //     redirect: "follow"};
            // const response = await fetch(proxyUrl+targetUrl, requestOptions);
        //-----------------------------------------------------------
            if(!response.ok){
                throw new Error("Unable to fetch user details");
            }
            const parsedData=await response.json();
            //display user data function
            displayUserData(parsedData);

            console.log("Logging data",parsedData);
        }
        catch(error){
            statsContainer.innerHTML='<p>No data Found</p>';
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }
    
    function displayUserData(parsedData) {
        const {
            totalSolved,
            totalQuestions,
            easySolved,
            totalEasy,
            mediumSolved,
            totalMedium,
            hardSolved,
            totalHard
        } = parsedData;
    
        // Set text inside progress circles
        easyLabel.textContent = `${easySolved}/${totalEasy}`;
        mediumLabel.textContent = `${mediumSolved}/${totalMedium}`;
        hardLabel.textContent = `${hardSolved}/${totalHard}`;
    
        // Calculate percentage for each difficulty
        const easyPercent = totalEasy ? ((easySolved / totalEasy) * 100).toFixed(1) : 0;
        const mediumPercent = totalMedium ? ((mediumSolved / totalMedium) * 100).toFixed(1) : 0;
        const hardPercent = totalHard ? ((hardSolved / totalHard) * 100).toFixed(1) : 0;
    
        // Update circle backgrounds
        easyProgressCircle.style.background = `conic-gradient(#4caf50 ${easyPercent}%, #ccc ${easyPercent}% 100%)`;
        mediumProgressCircle.style.background = `conic-gradient(#ff9800 ${mediumPercent}%, #ccc ${mediumPercent}% 100%)`;
        hardProgressCircle.style.background = `conic-gradient(#f44336 ${hardPercent}%, #ccc ${hardPercent}% 100%)`;
    
        // Calculate submissions (assuming total submissions = total solved + wrong attempts or similar)
        const overallSubmissions = totalSolved;  // Change this if you have a better number!
        const easySubmissions = easySolved;
        const mediumSubmissions = mediumSolved;
        const hardSubmissions = hardSolved;
    
        // Update stats cards
        document.querySelector('.stats-cards').innerHTML = `
        <div class="card orange-card">
            <h3>Overall Submissions</h3>
            <p>${overallSubmissions}</p>
        </div>
        <div class="card orange-card">
            <h3>Overall Easy Submissions</h3>
            <p>${easySubmissions}</p>
        </div>
        <div class="card orange-card">
            <h3>Overall Medium Submissions</h3>
            <p>${mediumSubmissions}</p>
        </div>
        <div class="card orange-card">
            <h3>Overall Hard Submissions</h3>
            <p>${hardSubmissions}</p>
        </div>
    `;
    }
    

    searchButton.addEventListener("click",function(){
        const username=usernameInput.value;
        if(validateusername(username)){
            fetchUserDetails(username)
        }


    })

})