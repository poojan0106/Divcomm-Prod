import { LightningElement, api, track } from 'lwc';
import uploadToS3 from '@salesforce/apex/FileSizeChecker.uploadToS3';
import updateLogoURL from '@salesforce/apex/FileSizeChecker.updateLogoURL';
export default class RestrictionOnImageSize extends LightningElement {
    @api imageData;
    @api isValid = false;
    @api errorMessage;
    @api recordId;
    @api contentDocumentId;
    @api nameOfFile;
    @api maxDimension = 400; // Configurable in Flow Builder — defaults to 400px
    @track successMessage;

    @track fileName;
    connectedCallback() {
        console.log('recordId : ', this.recordId);
        console.log('maxDimension : ', this.maxDimension);
    }

    handleFileChange(event) {
        this.successMessage = '';
        this.errorMessage = '';
        this.isValid = false;
        const file = event.target.files[0];
        console.log('OUTPUT : ', file);

        this.fileName = this.nameOfFile;
        if (!file) {
            this.errorMessage = 'Please upload a file';
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
                console.log('img width-- : ', img.width);
                console.log('img height-- : ', img.height);

                const limit = this.maxDimension ? parseInt(this.maxDimension, 10) : 400;

                if (img.width > limit || img.height > limit) {
                    this.errorMessage = `Image dimensions must not exceed ${limit}x${limit} pixels.`;
                    this.fileName = null;
                    return;
                }
                uploadToS3({
                    base64Data: readerResult,
                    fileName: this.fileName,
                    fileType: file.type,
                    recordId: this.recordId
                })
                    .then(contentDocId => {
                        this.imageData = readerResult;
                        this.isValid = true;
                        this.contentDocumentId = contentDocId;
                        this.successMessage = 'File uploaded successfully!';
                        updateLogoURL({
                            recordId: this.recordId,
                            fileUrl: contentDocId
                        })
                            .then(() => {
                                console.log('Form record updated successfully.');
                            })
                            .catch(error => {
                                console.error('Error updating form record:', error);
                            });
                        console.log('File uploaded. ContentDocumentId: 11', contentDocId);
                    })
                    .catch(error => {
                        this.errorMessage = 'Upload failed: ' + (error.body ? error.body.message : error.message);
                        console.error('Upload error:', error);
                    });
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