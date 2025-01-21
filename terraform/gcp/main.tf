# Create Google Container Registry
module "docker_registry" {
  source       = "./modules/docker_registry"
  gcp_region   = var.gcp_region
  ext_app_name = var.ext_app_name
}

# Build and push docker image
module "build_push_docker_image" {
  source          = "./modules/build_push_docker_image"
  ext_app_name    = var.ext_app_name
  gcp_project_id  = var.gcp_project_id
  gcp_region      = var.gcp_region
  repository_name = module.docker_registry.repository_name
}

# Generate secrets
module "generate_secrets" {
  source = "./modules/generate_secrets"
}

module "cloud_run_service" {
  source                    = "./modules/cloud_run_service"
  cloud_service_account     = "sa-${var.ext_app_name}"
  docker_image_full_name    = module.build_push_docker_image.docker_image_full_name
  ext_app_name              = var.ext_app_name
  gcp_project_id            = var.gcp_project_id
  gcp_region                = var.gcp_region
  environment_variables     = var.environment_variables
  terraform_service_account = var.terraform_service_account
  authorization_code        = module.generate_secrets.authorization_code
  jwt_secret_key            = module.generate_secrets.jwt_secret_key
  oauth_client_id           = module.generate_secrets.oauth_client_id
  oauth_client_secret       = module.generate_secrets.oauth_client_secret
  depends_on = [
    module.build_push_docker_image
  ]
}

# Update manifest files
module "update_manifest_files" {
  source                = "./modules/update_manifest_files"
  oauth_client_id       = module.generate_secrets.oauth_client_id
  oauth_client_secret   = module.generate_secrets.oauth_client_secret
  web_app_url           = replace(module.cloud_run_service.web_app_url, "/", "\\/")
  manifests_folder_path = "../../manifests"
}
