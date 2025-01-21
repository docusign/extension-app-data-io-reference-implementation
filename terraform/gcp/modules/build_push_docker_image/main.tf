locals {
  docker_image_tag           = formatdate("YYYYMMDDhhmm", timestamp())
  docker_image_name          = var.ext_app_name
  docker_image_name_with_tag = "${var.ext_app_name}:${local.docker_image_tag}"
  docker_image_full_name = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${var.repository_name}/${local.docker_image_name_with_tag}"
}

resource "docker_image" "local_image" {
  name = local.docker_image_full_name

  build {
    context  = abspath("../../")
    platform = "linux/amd64"
  }
}

resource "null_resource" "push_docker_image" {
  provisioner "local-exec" {
    command = <<-EOT
      gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://gcr.io
      docker push ${local.docker_image_full_name}
    EOT
  }
  triggers = {
    always_run = "${timestamp()}"
  }
  depends_on = [
    docker_image.local_image
  ]
}
