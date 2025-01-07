terraform {
  required_version = ">= 0.12"

  required_providers {
    azurerm = ">= 4.14.0"
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
  # registry_auth {
  #   address  = module.container_registry.acr_login_server
  #   username = module.container_registry.acr_admin_username
  #   password = module.container_registry.acr_admin_password
  # }
}
