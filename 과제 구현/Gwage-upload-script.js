document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const date = document.getElementById('date').value;
    const university = document.getElementById('university').value;
    const department = document.getElementById('department').value;
    const professor = document.getElementById('professor').value;
    const author = document.getElementById('author').value;
    const imageFiles = document.getElementById('images').files;
    const uploadedFile = document.getElementById('file').files[0];

    if (imageFiles.length === 0 && !uploadedFile) {
        alert("이미지나 파일 중 하나를 업로드해주세요.");
        return;
    }

    const imageUrls = [];
    let imagesLoaded = 0;

    if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageUrls.push({ name: imageFiles[i].name, url: e.target.result });
                imagesLoaded++;

                if (imagesLoaded === imageFiles.length) {
                    finalizeUpload();
                }
            };
            reader.readAsDataURL(imageFiles[i]);
        }
    } else {
        finalizeUpload();
    }

    function finalizeUpload() {
        const fileUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : null;
        const note = {
            subject,
            date,
            university,
            department,
            professor,
            author,
            images: imageUrls,
            fileUrl,
            fileName: uploadedFile ? uploadedFile.name : null
        };

        const notes = JSON.parse(localStorage.getItem('assignments')) || [];
        notes.push(note);
        localStorage.setItem('assignments', JSON.stringify(notes));
        localStorage.setItem('selectedAssignment', JSON.stringify(note)); 

        window.location.href = 'Gwage-content-page.html';
    }
});

document.getElementById('images').addEventListener('change', function(event) {
    const imageFiles = event.target.files;
    const uploadedFilesList = document.getElementById('uploadedFilesList');
    uploadedFilesList.innerHTML = '';

    for (let i = 0; i < imageFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            uploadedFilesList.appendChild(img);
        };
        reader.readAsDataURL(imageFiles[i]);
    }
});
