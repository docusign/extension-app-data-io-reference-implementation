output "resource_group_name" {
  value = module.resource_group.resource_group_name
}

output "resource_group_location" {
  value = module.resource_group.resource_group_location
}

output "container_registry_name" {
  value = module.container_registry.acr_name
}

output "container_registry_login_server" {
  value = module.container_registry.acr_login_server
}

output "docker_image_full_name" {
  value = module.build_push_docker_image.docker_image_full_name
}

output "docker_image_name" {
  value = module.build_push_docker_image.docker_image_name
}

output "docker_image_name_with_tag" {
  value = module.build_push_docker_image.docker_image_name_with_tag
}

output "web_app_url" {
  value = module.web_app_service.web_app_url
}
