# Create a resource group
module "resource_group" {
  source       = "./modules/resource_group"
  ext_app_name = var.ext_app_name
  rg_name      = "rg-${var.ext_app_name}"
  rg_region    = var.rg_region
}

# Create app service plan
module "app_service_plan" {
  source       = "./modules/app_service_plan"
  asp_name     = "asp-${var.ext_app_name}"
  asp_os_type  = var.asp_os_type
  asp_sku_name = var.asp_sku_name
  ext_app_name = var.ext_app_name
  location     = module.resource_group.resource_group_location
  rg_name      = module.resource_group.resource_group_name
  worker_count = 1
}

# Create an Azure Container Registry
module "container_registry" {
  source       = "./modules/container_registry"
  acr_location = module.resource_group.resource_group_location
  acr_name     = replace("acr${var.ext_app_name}", "-", "")
  acr_rg_name  = module.resource_group.resource_group_name
  acr_sku      = var.acr_sku
  ext_app_name = var.ext_app_name
}

# # Update env files
# module "update_env_files" {
#   source = "./modules/update_env_files"
# }

# Build and push docker image
module "build_push_docker_image" {
  source           = "./modules/build_push_docker_image"
  acr_login_server = module.container_registry.acr_login_server
  acr_name         = module.container_registry.acr_name
  # acr_admin_password = module.container_registry.acr_admin_password
  # acr_admin_username = module.container_registry.acr_admin_username
  docker_image_name = var.ext_app_name
}

# Generate secrets
module "generate_secrets" {
  source = "./modules/generate_secrets"
}

# Create web app service
module "web_app_service" {
  source              = "./modules/web_app_service"
  acr_id              = module.container_registry.acr_id
  acr_login_server    = module.container_registry.acr_login_server
  acr_name            = module.container_registry.acr_name
  app_name            = "app-${var.ext_app_name}"
  docker_image_name   = module.build_push_docker_image.docker_image_name_with_tag
  ext_app_name        = var.ext_app_name
  location            = module.resource_group.resource_group_location
  rg_name             = module.resource_group.resource_group_name
  service_plan_id     = module.app_service_plan.app_service_plan_id
  authorization_code  = module.generate_secrets.authorization_code
  jwt_secret_key      = module.generate_secrets.jwt_secret_key
  oauth_client_id     = module.generate_secrets.oauth_client_id
  oauth_client_secret = module.generate_secrets.oauth_client_secret
  node_env            = var.node_env
  node_port           = var.node_port
  depends_on = [
    module.build_push_docker_image
  ]
}

# Update ReadOnlyManifest.json and ReadWriteManifest.json files
module "update_manifest_files" {
  source                = "./modules/update_manifest_files"
  oauth_client_id       = module.generate_secrets.oauth_client_id
  oauth_client_secret   = module.generate_secrets.oauth_client_secret
  web_app_url           = replace(module.web_app_service.web_app_url, "/", "\\/")
  manifests_folder_path = "../../manifests"
}
