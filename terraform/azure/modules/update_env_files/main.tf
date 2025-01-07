data "external" "generate_secret" {
  count   = 4
  program = ["bash", "generate_secret.sh"]
}

resource "null_resource" "update_secrets" {
  provisioner "local-exec" {
    command = <<-EOT
      cp ../../example.development.env ../../development.env
      sed -i '' 's/^JWT_SECRET_KEY=[^ ]*/JWT_SECRET_KEY=${data.external.generate_secret[0].result.secret}/g' ../../development.env
      sed -i '' 's/^OAUTH_CLIENT_ID=[^ ]*/OAUTH_CLIENT_ID=${data.external.generate_secret[1].result.secret}/g' ../../development.env
      sed -i '' 's/^OAUTH_CLIENT_SECRET=[^ ]*/OAUTH_CLIENT_SECRET=${data.external.generate_secret[2].result.secret}/g' ../../development.env
      sed -i '' 's/^AUTHORIZATION_CODE=[^ ]*/AUTHORIZATION_CODE=${data.external.generate_secret[3].result.secret}/g' ../../development.env
      cp ../../example.production.env ../../production.env
      sed -i '' 's/^JWT_SECRET_KEY=[^ ]*/JWT_SECRET_KEY=${data.external.generate_secret[0].result.secret}/g' ../../production.env
      sed -i '' 's/^OAUTH_CLIENT_ID=[^ ]*/OAUTH_CLIENT_ID=${data.external.generate_secret[1].result.secret}/g' ../../production.env
      sed -i '' 's/^OAUTH_CLIENT_SECRET=[^ ]*/OAUTH_CLIENT_SECRET=${data.external.generate_secret[2].result.secret}/g' ../../production.env
      sed -i '' 's/^AUTHORIZATION_CODE=[^ ]*/AUTHORIZATION_CODE=${data.external.generate_secret[3].result.secret}/g' ../../production.env
    EOT
  }
  triggers = {
    always_run = "${timestamp()}"
  }
}
