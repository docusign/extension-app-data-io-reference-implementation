locals {
  do_pull_base_image = alltrue([
    var.enabled,
    var.do_pull_base_image
  ])
  do_build_app_image = alltrue([
    var.enabled,
    var.do_build_app_image
  ])
  do_push_app_image = alltrue([
    var.enabled,
    var.do_push_app_image
  ])

  app_image_tag              = strcontains(var.app_image_name, ":") && !strcontains(var.app_image_name, "@sha256") ? element(split(":", var.app_image_name), 1) : null
  app_image_name_without_tag = element(split(":", var.app_image_name), 0)

  timestamp_tag = formatdate("YYYYMMDDHHmmss", one(time_static.app_docker_image[*].rfc3339))

  app_image_name_with_timestamp_tag = join(":", compact([local.app_image_name_without_tag, local.timestamp_tag]))
  app_image_build_name              = var.do_use_timestamp_tag && local.app_image_tag == null ? local.app_image_name_with_timestamp_tag : var.app_image_name
  app_image_build_tags              = var.do_use_timestamp_tag && local.app_image_tag != null ? concat(var.app_image_build_tags, [local.app_image_name_with_timestamp_tag]) : var.app_image_build_tags

  app_image_build_labels = merge(
    var.app_image_build_labels,
    {
      "org.opencontainers.image.created" = one(time_static.app_docker_image[*].rfc3339)
    }
  )

  file_path_separator       = "/"
  app_image_build_paths_md5 = length(var.app_image_build_paths) == 0 ? null : md5(join("", [for path in var.app_image_build_paths : md5(join("", [for file in fileset(var.app_image_build_context, path) : filemd5(join(local.file_path_separator, [var.app_image_build_context, file]))]))]))

  base_image_name          = one(data.docker_registry_image.base[*].name)
  base_image_sha256_digest = one(data.docker_registry_image.base[*].sha256_digest)

  app_image_name        = try(coalesce(one(docker_registry_image.app[*].name), one(docker_image.app[*].name)), null)
  app_image_repo_digest = one(docker_image.app[*].repo_digest)
}

data "docker_registry_image" "base" {
  count = local.do_pull_base_image ? 1 : 0

  name = var.base_image_name
}

resource "docker_image" "base" {
  count = local.do_pull_base_image ? 1 : 0

  name = local.base_image_name

  keep_locally = var.do_keep_images_locally
  force_remove = var.do_force_remove_images

  pull_triggers = [
    local.base_image_sha256_digest,
  ]
}

resource "time_static" "app_docker_image" {
  count = local.do_build_app_image ? 1 : 0

  triggers = {
    base_image_id = one(docker_image.base[*].id)
    paths_md5     = local.app_image_build_paths_md5
  }
}

resource "docker_image" "app" {
  count = local.do_build_app_image ? 1 : 0

  name = local.app_image_build_name

  keep_locally = var.do_keep_images_locally
  force_remove = var.do_force_remove_images

  build {
    context    = var.app_image_build_context
    dockerfile = var.app_image_build_dockerfile
    platform   = var.app_image_build_platform
    target     = var.app_image_build_target_stage
    build_args = var.app_image_build_args
    no_cache   = !var.do_use_build_cache
    tag        = local.app_image_build_tags
    label      = local.app_image_build_labels
  }

  triggers = {
    base_image_id = one(docker_image.base[*].id)
    paths_md5     = local.app_image_build_paths_md5
  }
}

resource "docker_registry_image" "app" {
  count = local.do_push_app_image ? 1 : 0

  keep_remotely = var.do_keep_images_remotely

  name = coalesce(one(docker_image.app[*].name), var.app_image_name)

  triggers = {
    app_image_id = one(docker_image.app[*].id)
  }
}

