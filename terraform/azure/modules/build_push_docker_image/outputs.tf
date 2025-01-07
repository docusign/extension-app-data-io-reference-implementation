output "docker_image_name" {
  value       = local.docker_image_name
  sensitive   = false
  description = "Docker image name"
}

output "docker_image_name_with_tag" {
  value       = local.docker_image_name_with_tag
  sensitive   = false
  description = "Docker image name with tag"
}

output "docker_image_full_name" {
  value       = local.docker_image_full_name
  sensitive   = false
  description = "Docker image full name"
}
