import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadToS3 from '@salesforce/apex/FileSizeChecker.uploadToS3';
import updateFileURL from '@salesforce/apex/FileSizeChecker.updateFileURL';
import updateFormRecordForStateDesignFlow from '@salesforce/apex/FileSizeChecker.updateFormRecordForStateDesignFlow';
export default class RestrictionOnFileSize extends LightningElement {
    @api fileData;
    @api errorMessage;
    @api recordId;
    @api contentDocumentId;
    @api flowContext;   //To check whether the flow is company profile or product information repeater.
    @track fileName;
    @api nameOfFile;    //File name assigned statically from flow
    @api maxFileSize;
    @track successMessage;

    connectedCallback() {
        console.log('recordId : ', this.recordId);
    }

    displayToast(title, message, variant) {
    const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
        mode: 'dismissable'
    });
    this.dispatchEvent(event);
    console.log('Toast executed successfully');
}

handletoast(event) {
        this.displayToast('Success', 'File uploaded successfully!', 'success');
    }

    handleFileChange(event) {
        this.successMessage='';
        this.errorMessage = '';
        const file = event.target.files[0];

        if (!file) {
            this.errorMessage = 'Please upload a file';
            return;
        }

        this.fileName = this.nameOfFile;
        const validTypes = ['application/pdf'];

        if (!validTypes.includes(file.type)) {
            this.errorMessage = 'Only PDF files are allowed.';
            this.fileName = null;
            return;
        }

        const maxSizeInBytes = this.maxFileSize * 1024 * 1024;
        console.log('maxSizeInBytes : ', maxSizeInBytes);
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
            console.log('OUTPUT : ', this.fileName);
            //Upload file to S3
            uploadToS3({
                base64Data: readerResult,
                fileName: this.fileName,
                fileType: file.type,
                recordId: this.recordId
            })
                .then(contentDocId => {
                    this.fileData = readerResult;
                    this.isValid = true;
                    this.contentDocumentId = contentDocId;

                    this.successMessage='File uploaded successfully!';
                    // To update fields of Event Form Object
                    
                    if (this.flowContext == 'CompanyProfile') {

                        updateFileURL({
                            recordId: this.recordId,
                            fileUrl: contentDocId
                        })
                            .then(() => {
                                console.log('Form record updated successfully.');
                                this.handletoast();
                                
                            })
                            .catch(error => {
                                let errorMessagetemp = 'Error updating form record: ' + (error.body ? error.body.message : error.message);
                                console.error('Error updating form record:', error);
                                this.displayToast('Error', errorMessagetemp, 'error');
                            });
                        console.log('File uploaded. ContentDocumentId:', this.contentDocumentId);
                        setTimeout(() => {
                            this.displayToast('Success', 'File uploaded successfully!', 'success');
                        }, 300);
                    }
                    else {
                        updateFormRecordForStateDesignFlow({
                            recordId: this.recordId,
                            fileUrl: contentDocId,
                            flowContext: this.flowContext
                        })
                            .then(() => {
                                console.log('Form record updated successfully.');
                            })
                            .catch(error => {
                                let errorMessagetemp = 'Error updating form record: ' + (error.body ? error.body.message : error.message);
                                console.error('Error updating form record:', error);
                                this.displayToast('Error', errorMessagetemp, 'error');
                            });
                        
                    }

                    console.log('File uploaded. ContentDocumentId:', this.contentDocumentId);
                        this.displayToast('Success', 'File uploaded successfully!', 'success');

                })
                .catch(error => {
                    this.errorMessage = 'Upload failed: ' + (error.body ? error.body.message : error.message);
                    console.error('Upload error:', error);
                    this.displayToast('Error', this.errorMessage, 'error');
                });
        };
        reader.readAsDataURL(file);
    }
}