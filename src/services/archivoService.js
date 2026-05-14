const { randomUUID } = require('crypto');
const supabase = require('../config/supabase');
const archivoRepository = require('../repositories/archivoRepository');
const auditService = require('./auditService');

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'archivos';
const PUBLIC_BUCKET = String(process.env.SUPABASE_STORAGE_PUBLIC || 'true') === 'true';

let bucketReadyPromise = null;

const normalizeFileName = (fileName) => {
  return fileName
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-');
};

const ensureBucketExists = async () => {
  if (!bucketReadyPromise) {
    bucketReadyPromise = (async () => {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();

      if (listError) {
        throw new Error(listError.message);
      }

      const bucketExists = buckets.some((bucket) => bucket.name === BUCKET_NAME);

      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: PUBLIC_BUCKET,
        });

        if (createError) {
          throw new Error(createError.message);
        }
      }

      return true;
    })().catch((error) => {
      bucketReadyPromise = null;
      throw error;
    });
  }

  return bucketReadyPromise;
};

const buildStoragePath = (moduleName, fileName) => {
  const safeModule = normalizeFileName(moduleName || 'general');
  const safeFileName = normalizeFileName(fileName || 'archivo');
  return `${safeModule}/${Date.now()}-${randomUUID()}-${safeFileName}`;
};

const getStoragePathFromUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;

    if (!parsedUrl.pathname.includes(marker)) {
      return null;
    }

    return parsedUrl.pathname.split(marker)[1] || null;
  } catch {
    return null;
  }
};

const uploadFile = async (payload, user, ip) => {
  const { file, modulo, referencia_id } = payload;

  if (!file) {
    throw new Error('El archivo es obligatorio');
  }

  if (!modulo) {
    throw new Error('El módulo es obligatorio');
  }

  await ensureBucketExists();

  const storagePath = buildStoragePath(modulo, file.originalname);
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  const archivo = await archivoRepository.createFile({
    nombre_archivo: file.originalname,
    url: publicUrlData?.publicUrl,
    tipo_archivo: file.mimetype,
    modulo,
    referencia_id: referencia_id || null,
    subido_por: user.id,
  });

  await auditService.recordAction({
    user,
    action: 'SUBIR_ARCHIVO',
    module: 'archivos',
    recordId: archivo.id,
    description: `Archivo ${file.originalname} subido al módulo ${modulo}`,
    ip,
  });

  return archivo;
};

const getFiles = async (user, filters = {}) => {
  const queryFilters = {
    modulo: filters.modulo,
    referenciaId: filters.referencia_id ?? filters.referenciaId,
  };

  if (user.rol !== 'superadmin') {
    queryFilters.subidoPor = user.id;
  }

  return await archivoRepository.findFiles(queryFilters);
};

const getFileById = async (id, user) => {
  const archivo = await archivoRepository.findFileById(id);

  if (!archivo) {
    throw new Error('El archivo no existe');
  }

  if (user.rol !== 'superadmin' && Number(archivo.subido_por) !== Number(user.id)) {
    throw new Error('No tiene permisos para ver este archivo');
  }

  return archivo;
};

const deleteFile = async (id, user, ip) => {
  const archivo = await archivoRepository.findFileById(id);

  if (!archivo) {
    throw new Error('El archivo no existe');
  }

  if (user.rol !== 'superadmin' && Number(archivo.subido_por) !== Number(user.id)) {
    throw new Error('No tiene permisos para eliminar este archivo');
  }

  const storagePath = getStoragePathFromUrl(archivo.url);

  if (storagePath) {
    const { error: deleteStorageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (deleteStorageError) {
      throw new Error(deleteStorageError.message);
    }
  }

  await archivoRepository.deleteFile(id);

  await auditService.recordAction({
    user,
    action: 'ELIMINAR_ARCHIVO',
    module: 'archivos',
    recordId: archivo.id,
    description: `Archivo ${archivo.nombre_archivo} eliminado del módulo ${archivo.modulo}`,
    ip,
  });

  return {
    message: 'Archivo eliminado correctamente',
  };
};

module.exports = {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile,
};