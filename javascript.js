document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search');
    const usernameInput = document.getElementById('user-text');
    const userStats = document.querySelector('.user-stats');
    const cardStats = document.querySelector('.card-stats');

    // Difficulty circle elements
    const difficultyCircles = {
        easy: {
            circle: document.querySelector('.easy'),
            count: document.querySelector('.easy .count')
        },
        medium: {
            circle: document.querySelector('.medium'),
            count: document.querySelector('.medium .count')
        },
        hard: {
            circle: document.querySelector('.hard'),
            count: document.querySelector('.hard .count')
        }
    };

    // Validate username using regex
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    // Update progress circle for each difficulty
    function updateProgress(solved, total, circle, countElement) {
        const progressDegree = total > 0 ? (solved / total) * 360 : 0;
        circle.style.background = `conic-gradient(#299f5d ${progressDegree}deg, #e0e0e0 0deg)`;
        countElement.textContent = `${solved}/${total}`;
        
    }

    // Fetch user details from LeetCode API
    async function fetchUserDetails(username) {
        try {
            // Disable search button during fetch
            searchButton.textContent = 'Searching...';
            searchButton.disabled = true;

            
            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);

            if (!response.ok) {
                throw new Error('Unable to fetch user details. Please check the username.');
            }

            const data = await response.json();
            displayUserData(data);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            // Re-enable search button
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
        }
    }

    // Display fetched user data
    function displayUserData(data) {
        // Total questions for each difficulty
        const totalQues = {
            easy: data.totalEasy,
            medium: data.totalMedium,
            hard: data.totalHard
        };

        // Solved questions for each difficulty
        const solvedQues = {
            easy: data.easySolved,
            medium: data.mediumSolved,
            hard: data.hardSolved
        };

        // Update progress circles
        updateProgress(
            solvedQues.easy, 
            totalQues.easy, 
            difficultyCircles.easy.circle, 
            difficultyCircles.easy.count
        );
        updateProgress(
            solvedQues.medium, 
            totalQues.medium, 
            difficultyCircles.medium.circle, 
            difficultyCircles.medium.count
        );
        updateProgress(
            solvedQues.hard, 
            totalQues.hard, 
            difficultyCircles.hard.circle, 
            difficultyCircles.hard.count
        );

        // Prepare card stats
        const cardsData = [
            { 
                title: 'Total Solved', 
                value: data.totalSolved 
            },
            { 
                title: 'Easy Solved', 
                value: solvedQues.easy 
            },
            { 
                title: 'Medium Solved', 
                value: solvedQues.medium 
            },
            { 
                title: 'Hard Solved', 
                value: solvedQues.hard 
            }
        ];

        // Populate card stats
        cardStats.innerHTML = cardsData.map(card => `
            <div class="card">
                <div class="title">${card.title}</div>
                <div class="value">${card.value}</div>
            </div>
        `).join('');

        // Show stats sections
        userStats.style.display = 'flex';
        cardStats.style.display = 'grid';
    }

    // Search button event listener
    searchButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

    // Allow enter key to trigger search
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    // Initially hide stats sections
    // userStats.style.display = 'none';
    cardStats.style.display = 'none';
});