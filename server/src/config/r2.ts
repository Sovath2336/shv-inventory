import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  endpoint: process.env.AWS_ENDPOINT || 'https://<account-id>.r2.cloudflarestorage.com',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  signatureVersion: 'v4',
  region: process.env.AWS_REGION || 'auto',
});

export const uploadToR2 = async (
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: key,
    Body: file,
    ContentType: contentType,
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
};

export const getFromR2 = async (key: string): Promise<Buffer> => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: key,
  };

  try {
    const result = await s3.getObject(params).promise();
    return result.Body as Buffer;
  } catch (error) {
    console.error('Error getting from R2:', error);
    throw error;
  }
};

export const deleteFromR2 = async (key: string): Promise<void> => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting from R2:', error);
    throw error;
  }
}; 