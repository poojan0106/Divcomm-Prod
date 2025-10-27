import { LightningElement,api, track } from 'lwc';
import uploadBase64Image from '@salesforce/apex/FileSizeChecker.uploadBase64Image';
export default class RestrictionOnFileSize extends LightningElement {
      @api fileData;
    @api errorMessage;
    @api recordId;
    @api contentDocumentId;
    @track fileName;
    @api maxFileSize;

    connectedCallback() {
        console.log('recordId : ', this.recordId);
    }

    handleFileChange(event) {
         this.errorMessage = '';
        const file = event.target.files[0];

        if (!file) {
            this.errorMessage = 'Please upload a file';
            return;
        }

        this.fileName = file.name;
        const validTypes = ['application/pdf'];

        if (!validTypes.includes(file.type)) {
            this.errorMessage = 'Only PDF files are allowed.';
            this.fileName = null;
            return;
        }

        const maxSizeInBytes = this.maxFileSize * 1024 * 1024;
        console.log('maxSizeInBytes : ',maxSizeInBytes);
        if (file.size > maxSizeInBytes) {
            this.errorMessage = `File size should not exceed ${this.maxFileSize} MB.`;
            this.fileName = null;
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const readerResult = reader.result;
            // If needed, add Apex call here to upload the PDF file
            console.log('PDF file is ready for upload.');
            console.log('OUTPUT : ',this.fileName);
            uploadBase64Image({
                    base64Data: readerResult,
                    fileName: this.fileName,
                    recordId: this.recordId
                })
                    .then(contentDocId => {
                        this.fileData = readerResult;
                        this.isValid = true;
                        this.contentDocumentId = contentDocId;
                        console.log('File uploaded. ContentDocumentId:', contentDocId);
                    })
                    .catch(error => {
                        this.errorMessage = 'Upload failed: ' + (error.body ? error.body.message : error.message);
                        console.error('Upload error:', error);
                    });
        };
        reader.readAsDataURL(file);
    }
}