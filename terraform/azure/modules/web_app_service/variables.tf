variable "ext_app_name" {
  type        = string
  description = "Extension app name"
}

variable "rg_name" {
  type        = string
  description = "Resource group name"
}

variable "app_name" {
  type        = string
  description = "Web app name"
}

variable "location" {
  type        = string
  description = "Resource group location"
}

variable "service_plan_id" {
  type        = string
  description = "Service plan ID"
}

variable "docker_image_name" {
  type        = string
  description = "Docker image name"
}

variable "acr_login_server" {
  type        = string
  description = "Container registry login server"
}

variable "acr_id" {
  type        = string
  description = "Container registry id"
}

variable "acr_name" {
  type        = string
  description = "Container registry name"
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

variable "node_env" {
  type        = string
  description = "Node environment"
}

variable "node_port" {
  type        = number
  description = "Node port"
}
