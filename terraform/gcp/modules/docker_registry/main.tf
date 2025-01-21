resource "google_artifact_registry_repository" "ext_app_repo" {
  location      = var.gcp_region
  repository_id = "repo-${var.ext_app_name}"
  format        = "DOCKER"
}
