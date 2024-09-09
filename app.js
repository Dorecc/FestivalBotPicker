// Function to fetch songs data from JSON file
let songs = [];

let sorted = "ARTIST";

// Function to generate the checkbox list
function generateCheckboxList(songs) {
    console.log('Generating checkbox list...');
    const songList = document.getElementById('songList');
    songList.innerHTML = ''; // Clear any existing content

    songs.forEach(song => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `song-${song.Id}`;
        checkbox.value = song.Id;

        const label = document.createElement('label');
        // create label - start with artist if sorted by artist, else start with title
        label.htmlFor = `song-${song.Id}`;
        if (sorted === "ARTIST") {
            label.textContent = song.Artist + " - " + song.Title;
        } else {
            label.textContent = song.Title + " - " + song.Artist;
        }
        

        const div = document.createElement('div');
        div.className = 'song-item';
        div.appendChild(checkbox);
        div.appendChild(label);

        songList.appendChild(div);
    });
}

// Auto load JSON file if available in the same directory
function loadJSONFile() {
    console.log('Loading JSON file...');
    fetch('songList.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Response:', response);
            return response.json();
        })
        .then(data => {
            songs = data;
            generateCheckboxList(songs);
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
}

document.getElementById('copyButton').addEventListener('click', () => {
        const outputText = document.getElementById('output').innerText;
        navigator.clipboard.writeText(outputText).then(() => {
            alert('Output copied to clipboard!');
        });
    });

// Handle form submission
document.getElementById('songForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let outputText = 'AddSongBatch:';
    const selectedSongIDs = [];
    document.querySelectorAll('.song-item input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            selectedSongIDs.push(checkbox.value);
        }
    });
    
    // append the ids separated by semi-colons
    outputText += selectedSongIDs.join(';');    
    const output = document.getElementById('output');
    // update output in document
    output.innerText = outputText;
});

// Handle search functionality
document.getElementById('searchBox').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach(item => {
        const label = item.querySelector('label');
        if (label.textContent.toLowerCase().includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

// sort by artist
document.getElementById('sortArtistButton').addEventListener('click', function() {
    sorted = "ARTIST";
    songs.sort((a, b) => a.Artist.localeCompare(b.Artist));
    generateCheckboxList(songs);
});

// sort by title
document.getElementById('sortTitleButton').addEventListener('click', function() {
    sorted = "TITLE";
    songs.sort((a, b) => a.Title.localeCompare(b.Title));
    generateCheckboxList(songs);
});

// Initialize the app
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                console.log(data);
                songs = data;
                generateCheckboxList(songs);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    }
});

document.getElementById('DOMContentLoaded', loadJSONFile());