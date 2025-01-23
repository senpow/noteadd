document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const searchInput = document.querySelector('.search-bar input');
    const tabs = document.querySelectorAll('.tab');
    const newFolderBtn = document.querySelector('.new-folder');
    const modal = document.getElementById('note-editor');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const saveNoteBtn = document.getElementById('save-note');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');

    // Load saved notes from localStorage
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteIndex = null;

    // Function to save notes to localStorage
    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Modal functions
    function openModal() {
        modal.classList.add('open');
    }

    function closeModal() {
        modal.classList.remove('open');
        currentNoteIndex = null;
        noteTitleInput.value = '';
        noteContentInput.value = '';
    }

    // Handle modal close
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Handle outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle save note
    saveNoteBtn.addEventListener('click', () => {
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (!content) {
            alert('Note content cannot be empty');
            return;
        }

        const noteData = {
            title: title || 'Untitled Note',
            text: content,
            date: new Date().toISOString()
        };

        if (currentNoteIndex !== null) {
            // Update existing note
            notes[currentNoteIndex] = noteData;
        } else {
            // Add new note
            notes.push(noteData);
        }

        saveNotes();
        displayNotes();
        closeModal();
    });

    // Function to display notes
    function displayNotes(filter = '') {
        notesList.innerHTML = '';
        
        const filteredNotes = notes.filter(note => {
            return note.text.toLowerCase().includes(filter.toLowerCase());
        });

        filteredNotes.forEach((note, index) => {
            const noteItem = document.createElement('div');
            noteItem.className = 'card note-item';
            
            const noteContent = document.createElement('div');
            noteContent.className = 'note-content';
            
            const noteTitle = document.createElement('h3');
            noteTitle.textContent = note.title || 'Untitled Note';
            
            const noteText = document.createElement('p');
            noteText.textContent = note.text;
            
            const noteDate = document.createElement('span');
            noteDate.className = 'note-date';
            noteDate.textContent = new Date(note.date).toLocaleDateString();
            
            const noteActions = document.createElement('div');
            noteActions.className = 'note-actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '&#9998;';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            
            deleteBtn.addEventListener('click', () => {
                notes.splice(index, 1);
                saveNotes();
                displayNotes();
            });

            noteContent.appendChild(noteTitle);
            noteContent.appendChild(noteText);
            noteContent.appendChild(noteDate);
            
            noteActions.appendChild(editBtn);
            noteActions.appendChild(deleteBtn);
            
            noteItem.appendChild(noteContent);
            noteItem.appendChild(noteActions);
            notesList.appendChild(noteItem);
        });
    }

    // Add new note
    document.querySelector('.sidebar nav li:first-child a').addEventListener('click', (e) => {
        e.preventDefault();
        const title = prompt('Enter note title:');
        const text = prompt('Enter note content:');
        
        if (text) {
            notes.push({
                title: title || 'Untitled Note',
                text: text,
                date: new Date().toISOString()
            });
            saveNotes();
            displayNotes();
        }
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        displayNotes(searchInput.value);
    });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Implement date filtering based on tab selection
            displayNotes();
        });
    });

    // New folder button
    newFolderBtn.addEventListener('click', () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            // Implement folder creation logic
            alert(`Created new folder: ${folderName}`);
        }
    });

    // Initial display of notes
    displayNotes();
});
