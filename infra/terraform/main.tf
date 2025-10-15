provider "aws" {
  region                      = var.region
  access_key                  = var.access_key
  secret_key                  = var.secret_key
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  skip_region_validation      = true

  endpoints {
    s3         = "http://midominio.local"
    sts        = "http://midominio.local"
    iam        = "http://midominio.local"
    dynamodb   = "http://midominio.local"
    sqs        = "http://midominio.local"
    cloudwatch = "http://midominio.local"
    logs       = "http://midominio.local"
  }
}

