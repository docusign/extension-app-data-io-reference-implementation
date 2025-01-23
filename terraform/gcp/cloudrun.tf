locals {
  application_cloud_run_service_name = lower(coalesce(var.application_cloud_run_service_name, join("-", compact(["run", var.application_name]))))

  application_cloud_run_container_environment_variables = {
    JWT_SECRET_KEY      = local.application_jwt_secret_key
    OAUTH_CLIENT_ID     = local.application_oauth_client_id
    OAUTH_CLIENT_SECRET = local.application_oauth_client_secret
    AUTHORIZATION_CODE  = local.application_authorization_code
  }

  application_service_url = one(google_cloud_run_service.this.status[*].url)
}

resource "google_cloud_run_service" "this" {
  name     = local.application_cloud_run_service_name
  location = local.region

  template {
    spec {
      service_account_name = local.application_service_account_email

      containers {
        image = terraform_data.push_docker_image.output.application_image_name

        dynamic "env" {
          for_each = local.application_cloud_run_container_environment_variables

          content {
            name  = env.key
            value = env.value
          }
        }

        ports {
          container_port = var.application_port
        }
      }
    }
  }
}

resource "google_cloud_run_service_iam_binding" "invokers" {
  service  = google_cloud_run_service.this.name
  location = google_cloud_run_service.this.location
  role     = "roles/run.invoker"
  members = [
    "allUsers",
  ]
}
