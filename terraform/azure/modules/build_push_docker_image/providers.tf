terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
  # registry_auth {
  #   address  = var.acr_login_server
  #   username = var.acr_admin_username
  #   password = var.acr_admin_password
  # }
}
