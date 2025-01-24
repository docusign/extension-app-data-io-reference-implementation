locals {
  application_build_context = abspath(join(local.file_path_separator, compact([path.cwd, var.application_build_context])))

  application_image_name = join(local.docker_registry_separator, compact([
    local.artifact_registry_login_server,
    local.artifact_registry_project,
    local.artifact_registry_repository,
    join(local.docker_image_tag_separator, compact([
      var.application_name,
      var.application_build_image_tag
    ])),
  ]))

  application_image_name_without_registry = trimprefix(
    module.image.app_image_name,
    join("", compact([
      local.artifact_registry_login_server,
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
    container_registry_login_server = local.artifact_registry_login_server
    container_registry_url          = local.artifact_registry_url

    application_service_account_private_key      = local.application_service_account_private_key
    application_service_account_private_key_type = "_json_key_base64"

    container_tool = var.container_tool
  }

  triggers_replace = [
    google_artifact_registry_repository.this.id,
    google_artifact_registry_repository_iam_binding.readers.etag,
    google_artifact_registry_repository_iam_binding.writers.etag,
  ]

  provisioner "local-exec" {
    command = "${self.input.container_tool} login --username ${self.input.application_service_account_private_key_type} --password ${self.input.application_service_account_private_key} ${self.input.container_registry_url}"
  }

  provisioner "local-exec" {
    when       = destroy
    on_failure = continue
    command    = "${self.input.container_tool} logout ${self.input.container_registry_url}"
  }
}

resource "terraform_data" "push_docker_image" {
  input = {
    application_image_name = join(local.docker_registry_separator, compact([
      terraform_data.login_container_registry.output.container_registry_login_server,
      local.application_image_name_without_registry,
    ]))

    container_tool = var.container_tool
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
    command    = "gcloud artifacts docker images delete ${self.input.application_image_name} --quiet"
  }
}
