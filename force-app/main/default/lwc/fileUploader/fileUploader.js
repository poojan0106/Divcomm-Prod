import { LightningElement, api, track } from 'lwc';
import uploadBase64Image from '@salesforce/apex/FileSizeChecker.uploadBase64Image';
export default class FileUploader extends LightningElement {
    @api imageData;
    @api isValid = false;
    @api errorMessage;
    @api recordId;
    @api contentDocumentId;
    @api
    validate() {
        if (!this.contentDocumentId) {
            this.errorMessage = 'Please upload a file.';
            return {
                isValid: false,
                errorMessage: this.errorMessage
            };
        }
        this.errorMessage = '';
        return {
            isValid: true,
            errorMessage: ''
        };
    }

    @track fileName;
    connectedCallback() {
        console.log('recordId : ', this.recordId);
    }
    handleFileChange(event) {
        this.errorMessage = '';
        this.isValid = false;
        const file = event.target.files[0];
        console.log('OUTPUT : ', file);

        this.fileName = file.name;
        if (!file) {
            this.errorMessage = 'Please upload a file.';
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            this.errorMessage = 'Only JPG, JPEG, or PNG files are allowed.';
            this.fileName = null;
            return;
        }

        const maxSize = 1024 * 1024; // 1MB
        console.log('OUTPUT : ', file.size);
        if (file.size > maxSize) {
            this.errorMessage = 'File size should not exceed 1MB.';
            this.fileName = null;
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const readerResult = reader.result;
            var img = new Image();

            img.src = readerResult;

            img.onload = () => {


                //const img = new Image();
                console.log('img width-- : ', img.width);
                console.log('img height-- : ', img.height);

                //img.onload = () => {
                if (img.width > 400 || img.height > 400) {
                    this.errorMessage = 'Image dimensions must not exceed 400x400 pixels.';
                    this.fileName = null;
                    return;
                }
                uploadBase64Image({
                    base64Data: readerResult,
                    fileName: this.fileName,
                    recordId: this.recordId
                })
                    .then(contentDocId => {
                        this.imageData = readerResult;
                        this.isValid = true;
                        this.contentDocumentId = contentDocId;
                        console.log('File uploaded. ContentDocumentId:', contentDocId);
                    })
                    .catch(error => {
                        this.errorMessage = 'Upload failed: ' + (error.body ? error.body.message : error.message);
                        console.error('Upload error:', error);
                    });

                // else {
                //     this.imageData = reader.result;
                //     this.isValid = true;
                //this.fileName = file.name;
                //}
            };
            img.onerror = () => {
                this.errorMessage = 'Invalid image file.';
                this.fileName = null;
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
}