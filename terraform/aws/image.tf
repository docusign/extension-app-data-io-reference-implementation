locals {
  application_build_context = abspath(join(local.file_path_separator, compact([path.cwd, var.application_build_context])))
  application_image_name    = join(":", compact([aws_ecr_repository.this.repository_url, var.application_build_image_tag]))

  application_build_arguments = {
    BASE_IMAGE = var.application_build_base_image_name
    PORT       = var.application_port
  }

  application_build_dockerfile = {
    podman = "Containerfile"
  }
}

module "image" {
  source = "../common/modules/docker"

  base_image_name = var.application_build_base_image_name

  app_image_name               = local.application_image_name
  app_image_build_context      = local.application_build_context
  app_image_build_dockerfile   = lookup(local.application_build_dockerfile, var.container_tool, null)
  app_image_build_target_stage = var.application_environment_mode
  app_image_build_paths        = var.application_build_paths
  app_image_build_args         = local.application_build_arguments
  app_image_build_labels       = var.application_build_labels
}
