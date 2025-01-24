locals {
  application_build_context = abspath(join(local.file_path_separator, compact([path.cwd, var.application_build_context])))

  application_image_name = join(local.docker_registry_separator, compact([
    local.created_container_registry_login_server,
    join(local.docker_image_tag_separator, compact([
      var.application_name,
      var.application_build_image_tag
    ])),
  ]))

  pushed_application_image_name_without_registry = trimprefix(
    module.image.app_image_name,
    join("", compact([
      local.created_container_registry_login_server,
      local.docker_registry_separator,
    ]))
  )

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

  do_push_app_image = false
}

resource "terraform_data" "login_container_registry" {
  input = {
    subscription_id = local.subscription_id

    container_registry_name                = local.created_container_registry_name
    container_registry_resource_group_name = local.created_container_registry_resource_group_name
    container_registry_login_server        = local.created_container_registry_login_server

    container_tool = var.container_tool
  }

  triggers_replace = [
    azurerm_container_registry.this.id,
  ]

  provisioner "local-exec" {
    environment = {
      DOCKER_COMMAND = self.input.container_tool
    }
    command = "az acr login --name ${self.input.container_registry_name} --resource-group ${self.input.container_registry_resource_group_name} --subscription ${self.input.subscription_id}"
  }

  provisioner "local-exec" {
    when       = destroy
    on_failure = continue
    command    = "${self.input.container_tool} logout ${self.input.container_registry_login_server}"
  }
}

resource "terraform_data" "push_docker_image" {
  input = {
    application_image_name                  = module.image.app_image_name
    application_image_name_without_registry = local.pushed_application_image_name_without_registry

    container_tool          = var.container_tool
    container_registry_name = local.created_container_registry_name
  }

  triggers_replace = [
    terraform_data.login_container_registry.id,
    module.image.app_image_repo_digest,
  ]

  provisioner "local-exec" {
    command = "${self.input.container_tool} push ${self.input.application_image_name}"
  }

  provisioner "local-exec" {
    when       = destroy
    on_failure = continue
    command    = "az acr repository delete --name ${self.input.container_registry_name} --image ${self.input.application_image_name_without_registry} --yes"
  }
}
