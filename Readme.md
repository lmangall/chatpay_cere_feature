Hackathon judges and organizers FAQ:

Why so little code, why only having a feature open source ?
The ChatPay team is really dedicated in working on its product. We want to work on it and develop it, we believe it is a project for the common good, but we don't want to give it away ;)

At what stage is ChatPay ?
Our product is still an "advanced POC" with 1300+ users (organic). While we develop the product itself we seek for strategic partnerships and investment

How can ChatPay and The Blockspace, Web0 organization and key-members collaborate
Key-partnership (in AI or data acquisition as instance) and establishing connection with potential investors (finders fee) are of mutual interest

- ***

Check Readme for env var use:
https://github.com/cere-io/integration-telegram-app-bot/

https://github.com/Cerebellum-Network/cere-ddc-sdk-js/blob/main/packages/file-storage/docs/classes/FileStorage.md
The store method probably uses a PUT or POST request under the hood to upload files to the DDC, but you don't see the HTTP layer directly.

## Setting Up Your Environment

Install Node.js and npm (if not already installed):

<li>Download Node.js</li>
<li>Follow the installation steps provided on the Node.js website.</li>

### Access Your Cere Wallet:

<li>Visit the wallet at wallet.cere.io.</li>
<li>Log in using your email OTP.</li>
<li>You'll see your EVM and Cere wallets, along with your $CERE token balance.</li>

### Download Wallet Backup:

<li>Go to Settings in your Cere wallet.</li>
<li>Export your Cere account as an Encrypted JSON file.</li>
This file is crucial for accessing your bucket, so keep it secure.

## Configuring Your Environment

<li>Create Configuration File:</li>
<li>Create a new file named ddc.config.json.</li>
<li>Add the following content, replacing placeholders with your information:</li>

```
{
  "path": "./your-wallet-address.json",
  "clusterId": "0x0059f5ada35eee46802d80750d5ca4a490640511",
  "bucketId": "your-bucket-id",
  "network": "mainnet",
  "logLevel": "info"
}
```

<li>The path should point to your wallet backup file.</li>
<li>Find your bucketId in the developer console.</li>

---

create a base64 file and POST it with bash and curl requests:

```bash
echo "This is a test file" > example.txt
base64 example.txt > example.txt.base64
curl -X POST http://localhost:3000/dappstorage \
     -H "Content-Type: application/json" \
     -d '{"file": "'$(cat example.txt.base64)'"}'
```
