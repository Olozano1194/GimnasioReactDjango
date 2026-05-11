from storages.backends.s3boto3 import S3Boto3Storage


class SupabaseMediaStorage(S3Boto3Storage):
    location = 'fotos'
    file_overwrite = False
    default_acl = 'public-read'
