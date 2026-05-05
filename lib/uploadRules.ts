export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

export function isAllowedUpload(file: File) {
  return ALLOWED_UPLOAD_MIME_TYPES.has(file.type);
}

export function formatUploadLimit() {
  return `${MAX_UPLOAD_BYTES / 1024 / 1024}MB`;
}
