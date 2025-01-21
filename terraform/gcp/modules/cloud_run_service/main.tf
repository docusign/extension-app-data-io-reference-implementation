resource "google_service_account" "cloud_run_sa" {
  account_id   = var.cloud_service_account
  display_name = "Service account for Cloud Run ${var.ext_app_name} application"
}

resource "google_service_account_iam_member" "cloud_run_actas" {
  service_account_id = google_service_account.cloud_run_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${var.terraform_service_account}"
}

locals {
  updated_environment_variables = merge(
    var.environment_variables,
    {
      AUTHORIZATION_CODE  = var.authorization_code
      JWT_SECRET_KEY      = var.jwt_secret_key
      OAUTH_CLIENT_ID     = var.oauth_client_id
      OAUTH_CLIENT_SECRET = var.oauth_client_secret
    }
  )
}

resource "google_cloud_run_service" "web_service" {
  name     = "app-${var.ext_app_name}"
  location = var.gcp_region

  template {
    spec {
      service_account_name = google_service_account.cloud_run_sa.email
      containers {
        image = var.docker_image_full_name
        dynamic "env" {
          for_each = local.updated_environment_variables
          content {
            name  = env.key
            value = env.value
          }
        }
        ports {
          container_port = var.environment_variables.NODE_PORT
        }
      }
    }
  }
}

resource "google_project_iam_member" "cloud_run_artifact_registry_permissions" {
  project = var.gcp_project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_cloud_run_service_iam_member" "invoker" {
  service  = google_cloud_run_service.web_service.name
  location = google_cloud_run_service.web_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
