resource "null_resource" "generate_secrets" {
  provisioner "local-exec" {
    command = <<EOT
    if [ ! -f generated_secrets.json ]; then
      bash generate_secrets.sh
    fi
    EOT
  }
}

data "local_file" "secrets_file" {
  depends_on = [null_resource.generate_secrets]
  filename   = "generated_secrets.json"
}

locals {
  secrets = jsondecode(data.local_file.secrets_file.content)
}
