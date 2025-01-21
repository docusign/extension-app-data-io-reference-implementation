output "authorization_code" {
  value = local.secrets.authorization_code
}

output "jwt_secret_key" {
  value = local.secrets.jwt_secret_key
}

output "oauth_client_id" {
  value = local.secrets.oauth_client_id
}

output "oauth_client_secret" {
  value = local.secrets.oauth_client_secret
}
