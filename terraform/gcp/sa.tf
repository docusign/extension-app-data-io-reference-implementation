locals {
  application_service_account_name        = substr(lower(coalesce(var.application_service_account_name, join("-", compact(["sa", var.application_name])))), 6, 23)
  application_service_account_email       = google_service_account.application.email
  application_service_account_private_key = google_service_account_key.application.private_key
}

resource "google_service_account" "application" {
  account_id   = local.application_service_account_name
  display_name = "Application Service Account"
  description  = "Service Account for ${var.application_name} application"
}

resource "time_rotating" "application_service_account_key" {
  rotation_days = var.application_service_account_key_rotation_days
}

resource "google_service_account_key" "application" {
  service_account_id = google_service_account.application.name

  keepers = {
    rotation_time = time_rotating.application_service_account_key.rotation_rfc3339
  }
}

resource "google_artifact_registry_repository_iam_binding" "readers" {
  location   = local.artifact_registry_location
  project    = local.artifact_registry_project
  repository = local.artifact_registry_repository

  role = "roles/artifactregistry.reader"
  members = [
    google_service_account.application.member,
  ]
}

resource "google_artifact_registry_repository_iam_binding" "writers" {
  location   = local.artifact_registry_location
  project    = local.artifact_registry_project
  repository = local.artifact_registry_repository

  role = "roles/artifactregistry.writer"
  members = [
    google_service_account.application.member,
  ]
}
