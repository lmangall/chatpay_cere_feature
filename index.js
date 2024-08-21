require('dotenv').config(); // Ensure dotenv is loaded first
const express = require('express');
const { FileStorage, File, JsonSigner} = require('@cere-ddc-sdk/file-storage');
const { DdcClient, MAINNET } = require('@cere-ddc-sdk/ddc-client');
const { Readable } = require('stream'); // Ensure Readable is imported

const app = express();
app.use(express.json());

const bucketId = BigInt(process.env.DDC_BUCKET); // Ensure DDC_BUCKET is defined
console.log('DDC_BUCKET:', process.env.DDC_BUCKET);

const cereWalletBackup = require('./6SGbXFmXVkBx4LsoobNUHZXbCcq8c2UUdVR4qFJKB88zhzh1.json');
const passphrase = process.env.CERE_WALLET_PASSPHRASE;

let fileStorage, ddcClient;

// Initialize FileStorage and DdcClient Asynchronously
(async () => {
    try {
        const signer = new JsonSigner(cereWalletBackup, { passphrase });
        console.log('Signer created');
    
        ddcClient = await DdcClient.create(signer, MAINNET);
        console.log('DdcClient created');
    
        fileStorage = await FileStorage.create(signer, MAINNET);
        console.log('FileStorage client created');
    } catch (error) {
        console.error('Error initializing clients:', error);
        process.exit(1); // Exit if initialization fails
    }
})();

// Start the server only after initialization is complete
app.listen(process.env.PORT || 3000, () => {
    if (fileStorage) {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    }
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/dappstorage', async (req, res) => {
    try {
        let fileBuffer;

        if (process.env.INDEV === '1') {
            // Generate file content with the current date
            const currentDate = new Date().toISOString();
            fileBuffer = Buffer.from(currentDate, 'utf-8');
            console.log('Uploading current date:', currentDate);
        } else {
            // Check if req.body.file is present and valid
            if (!req.body.file) {
                console.error('No file content provided in the request');
                return res.status(400).send('No file content provided');
            }

            // Decode Base64 file content if needed
            try {
                fileBuffer = Buffer.from(req.body.file, 'base64');
            } catch (error) {
                console.error('Error decoding Base64 content:', error);
                return res.status(400).send('Invalid Base64 file content');
            }
            console.log('Uploading received file content');
            console.log('File content:', fileBuffer.toString('utf-8'));
        }

        // Ensure fileBuffer is valid
        if (!fileBuffer || fileBuffer.length === 0) {
            console.error('File buffer is empty or invalid');
            return res.status(400).send('File buffer is empty or invalid');
        }

        
        const fileStats = { size: fileBuffer.length };
        const fileStream = Readable.from(fileBuffer);
        // console.log('File stats:', fileStats);
        // console.log('File stream:', fileStream);

        const ddcFile = new File(fileStream, fileStats);

        // Store the file into DDC with SDK
        const fileCid = await fileStorage.store(bucketId, ddcFile);
        // console.log('File stored into bucket', bucketId, 'with CID', fileCid);

        // Respond with the CERE storage URL
        res.json({
            message: 'File stored successfully',
            fileUrl: `https://storage.mainnet.cere.network/${bucketId}/${fileCid}`
        });
    } catch (error) {
        console.error('Error storing file:', error);
        res.status(500).send('Error storing file');
    }
});

// Clean up on exit
process.on('SIGINT', async () => {
    if (fileStorage) {
        await fileStorage.disconnect();
    }
    process.exit();
});
