output "repository_name" {
  description = "The URL of the deployed Cloud Run service"
  value       = google_artifact_registry_repository.ext_app_repo.name
}
