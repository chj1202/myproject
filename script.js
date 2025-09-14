let selectedImages = [];

// DOM 요소들
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const imageList = document.getElementById('imageList');
const loading = document.getElementById('loading');

// 파일 업로드 이벤트 리스너
fileInput.addEventListener('change', handleFiles);

// 드래그 앤 드롭 이벤트
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    handleFiles({ target: { files } });
});

// 파일 처리 함수
function handleFiles(e) {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
        alert('이미지 파일만 선택해주세요.');
        return;
    }

    imageFiles.forEach(file => {
        if (!selectedImages.find(img => img.file.name === file.name)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    file: file,
                    dataUrl: e.target.result,
                    name: file.name,
                    size: formatFileSize(file.size)
                };
                selectedImages.push(imageData);
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });
}

// 미리보기 업데이트
function updatePreview() {
    if (selectedImages.length === 0) {
        previewSection.style.display = 'none';
        return;
    }

    previewSection.style.display = 'block';
    imageList.innerHTML = '';

    selectedImages.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.draggable = true;
        imageItem.dataset.index = index;

        imageItem.innerHTML = `
            <img src="${image.dataUrl}" alt="${image.name}">
            <div class="image-info">
                <div class="filename">${image.name}</div>
                <div class="filesize">${image.size}</div>
            </div>
            <button class="remove-btn" onclick="removeImage(${index})">×</button>
        `;

        // 드래그 이벤트 리스너 추가
        imageItem.addEventListener('dragstart', handleDragStart);
        imageItem.addEventListener('dragend', handleDragEnd);
        imageItem.addEventListener('dragover', handleDragOver);
        imageItem.addEventListener('drop', handleDrop);

        imageList.appendChild(imageItem);
    });
}

// 이미지 제거
function removeImage(index) {
    selectedImages.splice(index, 1);
    updatePreview();
}

// 모든 이미지 삭제
function clearImages() {
    selectedImages = [];
    updatePreview();
    fileInput.value = '';
}

// 파일 크기 포맷팅
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// PDF 생성 함수
async function generatePDF() {
    if (selectedImages.length === 0) {
        alert('변환할 이미지를 선택해주세요.');
        return;
    }

    // 로딩 표시
    loading.style.display = 'block';
    previewSection.style.display = 'none';

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // A4 사이즈 (210 x 297 mm)
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const maxWidth = pageWidth - (margin * 2);
        const maxHeight = pageHeight - (margin * 2);

        for (let i = 0; i < selectedImages.length; i++) {
            if (i > 0) {
                pdf.addPage();
            }

            const image = selectedImages[i];

            // 이미지 로드 및 크기 계산
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = image.dataUrl;
            });

            // 이미지 비율 유지하며 A4 페이지에 맞게 조정
            let imgWidth = img.width;
            let imgHeight = img.height;

            // mm로 변환 (72 DPI 기준)
            imgWidth = imgWidth * 0.264583;
            imgHeight = imgHeight * 0.264583;

            // 페이지 크기에 맞게 스케일 조정
            const widthRatio = maxWidth / imgWidth;
            const heightRatio = maxHeight / imgHeight;
            const ratio = Math.min(widthRatio, heightRatio);

            const finalWidth = imgWidth * ratio;
            const finalHeight = imgHeight * ratio;

            // 중앙 정렬을 위한 좌표 계산
            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;

            // PDF에 이미지 추가
            pdf.addImage(image.dataUrl, 'JPEG', x, y, finalWidth, finalHeight);
        }

        // PDF 생성 완료 - 다운로드 폴더 선택
        const fileName = `converted_images_${new Date().getTime()}.pdf`;
        const pdfBlob = pdf.output('blob');

        // File System Access API를 지원하는 브라우저에서 폴더 선택
        if ('showSaveFilePicker' in window) {
            try {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'PDF files',
                        accept: {
                            'application/pdf': ['.pdf']
                        }
                    }]
                });

                const writable = await fileHandle.createWritable();
                await writable.write(pdfBlob);
                await writable.close();

                alert('PDF가 성공적으로 저장되었습니다!');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('파일 저장 중 오류:', err);
                    // 폴더 선택이 실패하면 기본 다운로드로 대체
                    downloadPdfFallback(pdfBlob, fileName);
                }
            }
        } else {
            // File System Access API를 지원하지 않는 브라우저에서는 기본 다운로드
            downloadPdfFallback(pdfBlob, fileName);
        }

    } catch (error) {
        console.error('PDF 생성 중 오류 발생:', error);
        alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        // 로딩 숨기기 및 미리보기 다시 표시
        loading.style.display = 'none';
        previewSection.style.display = 'block';
    }
}

// 기본 다운로드 방식 (폴백)
function downloadPdfFallback(pdfBlob, fileName) {
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 드래그 앤 드롭 정렬 기능
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (this !== draggedElement) {
        const rect = this.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;

        if (e.clientY < midY) {
            this.style.borderTop = '3px solid #ff8c00';
            this.style.borderBottom = '';
        } else {
            this.style.borderBottom = '3px solid #ff8c00';
            this.style.borderTop = '';
        }
    }
}

function handleDrop(e) {
    e.preventDefault();
    this.style.borderTop = '';
    this.style.borderBottom = '';

    if (this !== draggedElement) {
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(this.dataset.index);

        // 배열에서 요소를 이동
        const draggedImage = selectedImages.splice(draggedIndex, 1)[0];
        selectedImages.splice(targetIndex, 0, draggedImage);

        // 미리보기 업데이트
        updatePreview();
    }
}

// 드래그 오버 시 다른 요소들의 테두리 초기화
imageList.addEventListener('dragleave', (e) => {
    if (!e.relatedTarget || !imageList.contains(e.relatedTarget)) {
        const items = imageList.querySelectorAll('.image-item');
        items.forEach(item => {
            item.style.borderTop = '';
            item.style.borderBottom = '';
        });
    }
});