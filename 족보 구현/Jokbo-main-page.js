document.addEventListener('DOMContentLoaded', function() {
    const notesSection = document.getElementById('notesSection');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    let notes = JSON.parse(localStorage.getItem('examPapers')) || [];
    const itemsPerPage = 10;
    let currentPage = parseInt(localStorage.getItem('examPapersCurrentPage')) || 1;

    let filteredNotes = notes;

    const totalPages = () => Math.ceil(filteredNotes.length / itemsPerPage);

    function renderNotes(page) {
        notesSection.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedNotes = filteredNotes.slice(start, end);

        paginatedNotes.forEach((note, index) => {
            const noteTable = document.createElement('table');
            noteTable.className = 'note';
            noteTable.innerHTML = `
                <tr>
                    <td class="left-column">
                        <div class="thumbnail" style="background-image: url('${note.images && note.images.length > 0 ? note.images[0].url : ''}');"></div>
                    </td>
                    <td class="middle-column">
                        <h2 class="note-title" data-index="${start + index}">${note.subject}</h2>
                        <p class="date">수업일자: ${note.date}</p>
                    </td>
                    <td class="right-column">
                        <p>대학교: ${note.university} | 학과: ${note.department}</p>
                        <p>교수명: ${note.professor} | 작성자: ${note.author}</p>
                        <button class="buy-button">구매하기</button>
                        <button class="delete-button" data-index="${start + index}">삭제</button>
                    </td>
                </tr>
            `;
            notesSection.appendChild(noteTable);
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                notes.splice(index, 1);
                localStorage.setItem('examPapers', JSON.stringify(notes));
                window.location.reload();
            });
        });

        document.querySelectorAll('.note-title').forEach(title => {
            title.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                localStorage.setItem('selectedExamPaper', JSON.stringify(notes[index]));
                title.classList.add('visited'); // 클릭했을 때 색상 변경
                window.location.href = 'Jokbo-content-page.html';
            });
        });
    }

    function renderPagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (totalPages() > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.className = 'page-button';
            firstPageButton.innerText = '처음';
            firstPageButton.addEventListener('click', function() {
                localStorage.setItem('examPapersCurrentPage', 1);
                currentPage = 1;
                renderNotes(1);
                renderPagination();
            });
            pagination.appendChild(firstPageButton);
        }

        for (let i = 1; i <= totalPages(); i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'page-button';
            pageButton.innerText = i;
            pageButton.addEventListener('click', function() {
                localStorage.setItem('examPapersCurrentPage', i);
                currentPage = i;
                renderNotes(i);
                renderPagination();
            });
            if (i === currentPage) {
                pageButton.style.fontWeight = 'bold';
            }
            pagination.appendChild(pageButton);
        }
    }

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase();
        filteredNotes = notes.filter(note => 
            note.subject.toLowerCase().includes(query) ||
            note.university.toLowerCase().includes(query) ||
            note.department.toLowerCase().includes(query) ||
            note.professor.toLowerCase().includes(query) ||
            note.author.toLowerCase().includes(query)
        );
        currentPage = 1;
        localStorage.setItem('examPapersCurrentPage', currentPage);
        renderNotes(currentPage);
        if (totalPages() > 1) {
            renderPagination();
        }
    });

    renderNotes(currentPage);
    if (totalPages() > 1) {
        renderPagination();
    }
});
