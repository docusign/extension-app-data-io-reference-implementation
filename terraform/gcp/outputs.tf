output "application_service_url" {
  description = "The base URL of the application service"
  value       = local.application_service_url
}

output "output_manifest_files_paths" {
  description = "The absolute paths to the output manifest files"
  value       = local.output_manifest_files_paths
}
