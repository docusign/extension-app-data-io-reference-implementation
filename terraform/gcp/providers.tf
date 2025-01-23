provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone

  credentials = var.credentials

  default_labels = local.labels
}

provider "docker" {
  host = var.docker_host
}
