output "web_app_url" {
  description = "The URL of the deployed Cloud Run service"
  value       = module.cloud_run_service.web_app_url
}

output "docker_image_full_name" {
  value = module.build_push_docker_image.docker_image_full_name
}
