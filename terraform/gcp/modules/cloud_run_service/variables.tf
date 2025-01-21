variable "gcp_region" {
  type        = string
  description = "GCP region"
}

variable "gcp_project_id" {
  type        = string
  description = "GCP project ID"
}

variable "ext_app_name" {
  type        = string
  description = "Extension app name"
}

variable "cloud_service_account" {
  type        = string
  description = "Google cloud service account"
}

variable "terraform_service_account" {
  type        = string
  description = "Google cloud service account for terraform"
}

variable "docker_image_full_name" {
  type        = string
  description = "Docker image name with tag"
}

variable "environment_variables" {
  type        = map(string)
  description = "Environment variables"
}

variable "authorization_code" {
  type        = string
  sensitive   = true
  description = "Authorization code"
}

variable "jwt_secret_key" {
  type        = string
  sensitive   = true
  description = "JWT secret key"
}

variable "oauth_client_id" {
  type        = string
  sensitive   = true
  description = "OAUTH client ID"
}

variable "oauth_client_secret" {
  type        = string
  sensitive   = true
  description = "OAUTH client secret"
}
