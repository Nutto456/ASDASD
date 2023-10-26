// Fetch user data from the backend and display it in the frontend
function fetchUserList() {
    fetch('http://localhost:8080/users')
        .then(response => response.json())
        .then(data => {
            const userList = document.getElementById('userList');
            userList.innerHTML = ''; // Clear the list first

            data.users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`;
                userList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error in fetch:', error);
        });
}

// Call the fetchUserList function when the page loads
fetchUserList();

document.getElementById('createUserForm').addEventListener('submit', event => {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            fetchUserList();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('deleteUserForm').addEventListener('submit', event => {
    event.preventDefault(); // Prevent the default form submission

    const userId = document.getElementById('userId').value;

    fetch(`http://localhost:8080/users/${userId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log('User deleted:', data);
            fetchUserList();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
