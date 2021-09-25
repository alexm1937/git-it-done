var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {
    //formats the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    //request to url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            displayRepos(data, user);
            });
        } else {
            alert("Error: Github User Not Found");
        }
    }) //end then()//NOTE - catch func is chained to end of .then()!
    .catch(function(error) {
        alert("Unable to connect to Github");
    });        
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    //gets value from input
    var username = nameInputEl.value.trim();
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else { 
        alert("Please enter a Github username!");
    }
};

var displayRepos = function(repos, searchTerm) {
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    //check if api returned zero repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    //loop over repos
    for (var i = 0; i <repos.length; i++) {
        //formats repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        //create span element to hold repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //create statusElement
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        //check if repo has issues 
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else { 
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        repoEl.appendChild(statusEl);
        repoEl.appendChild(titleEl);
        repoContainerEl.appendChild(repoEl);
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);
