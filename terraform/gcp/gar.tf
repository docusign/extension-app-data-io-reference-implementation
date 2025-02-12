locals {
  application_repository_name = lower(coalesce(var.application_repository_name, join("-", compact(["repo", var.application_name]))))

  artifact_registry_location     = google_artifact_registry_repository.this.location
  artifact_registry_project      = google_artifact_registry_repository.this.project
  artifact_registry_repository   = google_artifact_registry_repository.this.name
  artifact_registry_login_server = join("-", compact([local.artifact_registry_location, "docker.pkg.dev"]))

  artifact_registry_protocol = "https"
  artifact_registry_url = join("://", compact([
    local.artifact_registry_protocol,
    local.artifact_registry_login_server
  ]))
}

resource "google_artifact_registry_repository" "this" {
  repository_id = local.application_repository_name
  location      = local.region
  format        = "DOCKER"

  dynamic "docker_config" {
    for_each = var.are_image_tags_mutable != null ? [1] : []
    content {
      immutable_tags = var.are_image_tags_mutable
    }
  }

  dynamic "vulnerability_scanning_config" {
    for_each = var.do_scan_images ? [1] : []
    content {
      enablement_config = "INHERITED"
    }
  }
}
