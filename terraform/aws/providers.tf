provider "aws" {
  region = var.region

  default_tags {
    tags = local.tags
  }
}

provider "docker" {
  host = var.docker_host

  registry_auth {
    address  = data.aws_ecr_authorization_token.current.proxy_endpoint
    username = data.aws_ecr_authorization_token.current.user_name
    password = data.aws_ecr_authorization_token.current.password
  }
}
