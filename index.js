const roles = ['Roam', 'Midlane', 'Jungler', 'Gold Lane', 'Exp Lane'];

function addTeams() {
    const teamsContainer = document.getElementById('teams-container');
    teamsContainer.innerHTML = '';

    const teamNumber = document.getElementById('team-number').value;

    for (let i = 1; i <= teamNumber; i++) {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';
        teamDiv.id = `team-${i}`;
        
        const teamLabel = document.createElement('h3');
        teamLabel.textContent = `Team ${i}`;
        teamDiv.appendChild(teamLabel);

        roles.forEach((role, index) => {
            const roleInput = document.createElement('input');
            roleInput.type = 'text';
            roleInput.className = 'role-input';
            roleInput.placeholder = role;
            roleInput.id = `team-${i}-role-${role}`;
            teamDiv.appendChild(roleInput);
        });

        teamsContainer.appendChild(teamDiv);
    }

    document.getElementById('download-btn').disabled = true; // Disable download button initially
}

function randomizeRoles() {
    const teamsContainer = document.getElementById('teams-container');
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    const teams = teamsContainer.getElementsByClassName('team');
    const rolePlayers = {
        'Roam': [],
        'Midlane': [],
        'Jungler': [],
        'Gold Lane': [],
        'Exp Lane': []
    };

    for (let team of teams) {
        const teamId = team.id;
        roles.forEach(role => {
            const roleInput = document.getElementById(`${teamId}-role-${role}`);
            if (roleInput.value) {
                rolePlayers[role].push(roleInput.value);
            }
        });
    }

    if (!Object.values(rolePlayers).every(players => players.length === teams.length)) {
        alert('Please fill in all player names for each role.');
        return;
    }

    Object.keys(rolePlayers).forEach(role => {
        rolePlayers[role] = multiShuffle(rolePlayers[role]);
    });

    const randomizedTeams = assignPlayersToTeams(rolePlayers, teams.length);
    displayResults(randomizedTeams);

    document.getElementById('download-btn').disabled = false; // Enable download button after randomization
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function multiShuffle(array) {
    for (let i = 0; i < 5; i++) {  // Shuffle multiple times
        array = shuffleArray(array);
    }
    return array;
}

function assignPlayersToTeams(rolePlayers, teamNumber) {
    const randomizedTeams = {};

    for (let i = 1; i <= teamNumber; i++) {
        randomizedTeams[`Team ${i}`] = {};
    }

    roles.forEach(role => {
        rolePlayers[role].forEach((player, index) => {
            const teamIndex = (index % teamNumber) + 1;
            randomizedTeams[`Team ${teamIndex}`][role] = player;
        });
    });

    return randomizedTeams;
}

function displayResults(randomizedTeams) {
    const resultContainer = document.getElementById('result-container');

    Object.keys(randomizedTeams).forEach(teamId => {
        const teamResult = document.createElement('div');
        teamResult.className = 'team-result';

        const teamLabel = document.createElement('h3');
        teamLabel.textContent = `${teamId} Randomized Roles`;
        teamResult.appendChild(teamLabel);

        Object.keys(randomizedTeams[teamId]).forEach(role => {
            const roleResult = document.createElement('p');
            roleResult.textContent = `${role}: ${randomizedTeams[teamId][role]}`;
            teamResult.appendChild(roleResult);
        });

        resultContainer.appendChild(teamResult);
    });
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const resultContainer = document.getElementById('result-container');
    const teams = resultContainer.getElementsByClassName('team-result');

    let yPosition = 10;
    for (let team of teams) {
        const teamName = team.getElementsByTagName('h3')[0].textContent;
        doc.text(teamName, 10, yPosition);
        yPosition += 10;

        const roles = team.getElementsByTagName('p');
        for (let role of roles) {
            doc.text(role.textContent, 10, yPosition);
            yPosition += 10;
        }

        yPosition += 10;
    }

    doc.save('randomized_teams.pdf');
}
