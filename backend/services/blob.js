const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");

function getContext() {
  const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const key = process.env.AZURE_STORAGE_ACCOUNT_KEY;
  const container = process.env.AZURE_STORAGE_CONTAINER || "media";

  if (!account || !key) throw new Error("Missing Azure storage env vars");

  const credential = new StorageSharedKeyCredential(account, key);
  const service = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    credential
  );
  const containerClient = service.getContainerClient(container);

  return { account, container, credential, containerClient };
}

function safeBlobName(creatorId, fileName) {
  const safe = (fileName || "upload").replace(/[^\w.\-]+/g, "_").slice(0, 80);
  const ext = safe.includes(".") ? safe.split(".").pop() : "bin";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${creatorId}/${stamp}.${ext}`;
}

function createUploadSas(blobName, contentType) {
  const { container, containerClient, credential } = getContext();
  const blobClient = containerClient.getBlockBlobClient(blobName);

  const startsOn = new Date(Date.now() - 60 * 1000);
  const expiresOn = new Date(Date.now() + 10 * 60 * 1000);

  const sas = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName,
      permissions: BlobSASPermissions.parse("cw"),
      startsOn,
      expiresOn,
      contentType: contentType || "application/octet-stream",
    },
    credential
  ).toString();

  return {
    blobName,
    blobUrl: blobClient.url,
    uploadUrl: `${blobClient.url}?${sas}`,
  };
}

function createReadSasFromMediaUrl(mediaUrl) {
  if (!mediaUrl) return "";
  const { account, container, credential } = getContext();

  try {
    const u = new URL(mediaUrl);
    const expectedHost = `${account}.blob.core.windows.net`;
    if (u.host !== expectedHost) return mediaUrl;

    const path = u.pathname.startsWith("/") ? u.pathname.slice(1) : u.pathname;
    const prefix = `${container}/`;
    if (!path.startsWith(prefix)) return mediaUrl;

    const blobName = path.slice(prefix.length);

    const startsOn = new Date(Date.now() - 60 * 1000);
    const expiresOn = new Date(Date.now() + 60 * 60 * 1000);

    const sas = generateBlobSASQueryParameters(
      {
        containerName: container,
        blobName,
        permissions: BlobSASPermissions.parse("r"),
        startsOn,
        expiresOn,
      },
      credential
    ).toString();

    return `${mediaUrl}?${sas}`;
  } catch {
    return mediaUrl;
  }
}

module.exports = { safeBlobName, createUploadSas, createReadSasFromMediaUrl };
