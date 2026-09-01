import { LightningElement, api, track } from 'lwc';
import uploadToS3 from '@salesforce/apex/FileSizeChecker.uploadToS3';
import updateFormRecordForFileUploader from '@salesforce/apex/FileSizeChecker.updateFormRecordForFileUploader';

export default class FileUploader extends LightningElement {
    @api imageData;
    @api isValid = false;
    @api errorMessage;
    @api recordId;
    @api contentDocumentId;
    @api nameOfFile;    //File name assigned statically from flow
    @track fileName;
    @track successMessage;

    connectedCallback() {
        console.log('recordId : ', this.recordId);
    }

    handleFileChange(event) {
        this.successMessage='';
        this.errorMessage = '';
        this.isValid = false;
        const file = event.target.files[0];
        console.log('OUTPUT : ', file);

        //this.fileName = file.name;
        this.fileName = this.nameOfFile;
        if (!file) {
            this.errorMessage = 'Please upload a file';
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            this.errorMessage = 'Only JPG, JPEG, or PNG files are allowed.';
            this.fileName = null;
            return;
        }

        // Validate file size (1 MB max)
        const maxSize = 1024 * 1024; // 1MB
        console.log('OUTPUT : ', file.size);
        if (file.size > maxSize) {
            this.errorMessage = 'File size should not exceed 1MB.';
            this.fileName = null;
            return;
        }

        //Read and validate image
        readAndValidateImage(file);

    }


    readAndValidateImage(file) {
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
                //Upload to S3 Code
                uploadToS3AndUpdateFields(readerResult, file);
            };
            img.onerror = () => {
                this.errorMessage = 'Invalid image file.';
                this.fileName = null;
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }

    uploadToS3AndUpdateFields(readerResult, file) {
        uploadToS3({
            base64Data: readerResult,
            fileName: this.fileName,
            fileType: file.type,
            recordId: this.recordId
        }).then(contentDocId => {
            this.imageData = readerResult;
            this.isValid = true;
            this.contentDocumentId = contentDocId;

            this.successMessage='File uploaded successfully!';
            //Updating Event Form Fields
            updateFormRecordForFileUploader({
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
    }
}