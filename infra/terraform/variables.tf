variable "region" {
  description = "Región de AWS o Localstack"
  type        = string
  default     = "eu-west-1"
}

variable "access_key" {
  description = "Access key para autenticación (dummy en Localstack)"
  type        = string
  default     = "test"
}

variable "secret_key" {
  description = "Secret key para autenticación (dummy en Localstack)"
  type        = string
  default     = "test"
}

