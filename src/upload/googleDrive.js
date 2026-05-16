const { google } = require('googleapis')
const { Readable } = require('stream')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN })

const drive = google.drive({ version: 'v3', auth: oauth2Client })

const createFolder = async (folderName, parentFolderId = null) => {
  const parents = parentFolderId ? [parentFolderId] : [process.env.GOOGLE_DRIVE_FOLDER_ID]

  const response = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents,
    },
    fields: 'id, name, webViewLink',
  })

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
  })

  return {
    folderId: response.data.id,
    folderName: response.data.name,
    viewLink: response.data.webViewLink,
  }
}

const listFolders = async (parentFolderId = null) => {
  const parent = parentFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID

  const response = await drive.files.list({
    q: `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name, webViewLink, createdTime)',
    orderBy: 'createdTime desc',
  })

  return response.data.files
}

const listFilesInFolder = async (folderId) => {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name, webViewLink, createdTime, mimeType)',
    orderBy: 'createdTime desc',
  })

  return response.data.files.map((f) => ({
    fileId: f.id,
    fileName: f.name,
    viewLink: f.webViewLink,
    directLink: `https://drive.google.com/uc?export=view&id=${f.id}`,
    createdTime: f.createdTime,
  }))
}

const uploadToDrive = async (file, folderId = null) => {
  const parent = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID
  const stream = Readable.from(file.buffer)

  const response = await drive.files.create({
    requestBody: {
      name: `${Date.now()}_${file.originalname}`,
      mimeType: file.mimetype,
      parents: [parent],
    },
    media: { mimeType: file.mimetype, body: stream },
    fields: 'id, name, webViewLink',
  })

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
  })

  return {
    fileId: response.data.id,
    fileName: response.data.name,
    viewLink: response.data.webViewLink,
    directLink: `https://drive.google.com/uc?export=view&id=${response.data.id}`,
  }
}

const deleteFromDrive = async (fileId) => {
  await drive.files.delete({ fileId })
}

module.exports = { createFolder, listFolders, listFilesInFolder, uploadToDrive, deleteFromDrive }
