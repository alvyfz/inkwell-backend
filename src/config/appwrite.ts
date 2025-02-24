const sdk = require("node-appwrite");
const dotenv = require('dotenv')
dotenv.config()

const client = new sdk.Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY);

const users = new sdk.Users(client)

const ID = sdk.ID

const account = new sdk.Account(client);

export {client,users,ID,account}