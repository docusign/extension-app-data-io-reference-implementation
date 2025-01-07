locals {
  docker_image_tag           = formatdate("YYYYMMDDhhmm", timestamp())
  docker_image_name          = var.docker_image_name
  docker_image_name_with_tag = "${var.docker_image_name}:${local.docker_image_tag}"
  docker_image_full_name     = "${var.acr_login_server}/${local.docker_image_name_with_tag}"
}

resource "docker_image" "local_image" {
  name = local.docker_image_full_name

  build {
    context  = abspath("../../")
    platform = "linux/amd64"
  }
}

# resource "docker_registry_image" "push_to_acr" {
#   name = docker_image.local_image.name
#   depends_on = [
#     docker_image.local_image
#   ]
# }

resource "null_resource" "push_docker_image" {
  provisioner "local-exec" {
    command = <<-EOT
      az acr login --name "${var.acr_name}"
      docker push "${var.acr_login_server}/${local.docker_image_name_with_tag}"
    EOT
  }
  triggers = {
    always_run = "${timestamp()}"
  }
  depends_on = [
    docker_image.local_image
  ]
}
