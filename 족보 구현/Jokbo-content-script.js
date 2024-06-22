document.addEventListener('DOMContentLoaded', function() {
    const selectedNote = JSON.parse(localStorage.getItem('selectedExamPaper'));

    if (selectedNote) {
        document.querySelector('.title').innerText = "족보";

        const slidesWrapper = document.getElementById('slidesWrapper');
        selectedNote.images.forEach((image) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'mySlides';
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.name;
            slideDiv.appendChild(img);
            slidesWrapper.appendChild(slideDiv);
        });

        let slideIndex = 1;
        showSlides(slideIndex);

        function showSlides(n) {
            const slides = document.getElementsByClassName('mySlides');
            if (n > slides.length) { slideIndex = 1; }
            if (n < 1) { slideIndex = slides.length; }
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = 'none';
            }
            slides[slideIndex - 1].style.display = 'block';
        }

        function plusSlides(n) {
            showSlides(slideIndex += n);
        }

        document.querySelector('.prev').addEventListener('click', function() {
            plusSlides(-1);
        });

        document.querySelector('.next').addEventListener('click', function() {
            plusSlides(1);
        });

        const details = document.getElementById('details');
        details.innerHTML = `
            <p>과목명: ${selectedNote.subject}</p>
            <p>대학교: ${selectedNote.university}</p>
            <p>학과: ${selectedNote.department}</p>
            <p>수업일자: ${selectedNote.date}</p>
            <p>작성자: ${selectedNote.author}</p>
        `;

        const downloadButton = document.getElementById('downloadButton');
        const downloadLinksContainer = document.getElementById('downloadLinks');
        downloadButton.addEventListener('click', function() {
            downloadLinksContainer.innerHTML = '';

            selectedNote.images.forEach((image) => {
                const downloadLink = document.createElement('a');
                downloadLink.href = image.url;
                downloadLink.download = image.name;
                downloadLink.textContent = `다운로드: ${image.name}`;
                downloadLinksContainer.appendChild(downloadLink);
                downloadLinksContainer.appendChild(document.createElement('br'));

                downloadLink.click();
            });

            if (selectedNote.fileUrl) {
                const downloadLink = document.createElement('a');
                downloadLink.href = selectedNote.fileUrl;
                downloadLink.download = selectedNote.fileName;
                downloadLink.textContent = `다운로드: ${selectedNote.fileName}`;
                downloadLinksContainer.appendChild(downloadLink);
                downloadLinksContainer.appendChild(document.createElement('br'));

                downloadLink.click();
            }

            if (selectedNote.images.length === 0 && !selectedNote.fileUrl) {
                downloadLinksContainer.innerHTML = '다운로드할 파일이 없습니다.';
            }
        });

        const backButton = document.getElementById('backButton');
        backButton.addEventListener('click', function() {
            window.location.href = 'Jokbo-main-page.html';
        });

        // 댓글 기능 추가
        const commentList = document.getElementById('commentList');
        const commentInput = document.getElementById('commentInput');
        const commentButton = document.getElementById('commentButton');

        let comments = JSON.parse(localStorage.getItem('comments')) || [];

        function renderComments() {
            commentList.innerHTML = '';
            comments.forEach((comment, index) => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.innerHTML = `
                    <p>${comment.text}</p>
                    <span class="delete-comment" data-index="${index}">삭제</span>
                `;
                commentList.appendChild(commentDiv);
            });

            document.querySelectorAll('.delete-comment').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    comments.splice(index, 1);
                    localStorage.setItem('comments', JSON.stringify(comments));
                    renderComments();
                });
            });
        }

        renderComments();

        commentButton.addEventListener('click', function() {
            const commentText = commentInput.value.trim();
            if (commentText !== '') {
                comments.push({ text: commentText });
                localStorage.setItem('comments', JSON.stringify(comments));
                commentInput.value = '';
                renderComments();
            }
        });
    } else {
        window.location.href = 'Jokbo-main-page.html';
    }
});
