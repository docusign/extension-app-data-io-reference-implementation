output "base_image_name" {
  description = "The name of the used base image."
  value       = local.base_image_name
}

output "app_image_name" {
  description = "The name of the built application image."
  value       = local.app_image_name
}

output "app_image_repo_digest" {
  description = "The digest of the built application image."
  value       = local.app_image_repo_digest
}
