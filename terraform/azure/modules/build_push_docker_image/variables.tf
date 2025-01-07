variable "acr_login_server" {
  type        = string
  description = "Docker container registry login server"
}

variable "acr_name" {
  type        = string
  description = "Docker container registry name"
}

# variable "acr_admin_password" {
#   type        = string
#   description = "Container registry admin password"
# }

# variable "acr_admin_username" {
#   type        = string
#   description = "Container registry admin username"
# }

variable "docker_image_name" {
  type        = string
  description = "Docker image name"
}
