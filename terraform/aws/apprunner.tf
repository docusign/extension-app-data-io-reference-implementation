locals {
  iam_role_name_separator      = "-"
  application_service_protocol = "https"
  application_service_url      = join("://", [local.application_service_protocol, aws_apprunner_service.this.service_url])
}

data "aws_iam_policy_document" "app_role_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["tasks.apprunner.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "instance" {
  name               = join(local.iam_role_name_separator, compact([var.application_name, local.region, "instance"]))
  assume_role_policy = data.aws_iam_policy_document.app_role_assume_role_policy.json
}

data "aws_iam_policy_document" "apprunner" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = [
        "build.apprunner.amazonaws.com",
        "tasks.apprunner.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role" "access" {
  name               = join(local.iam_role_name_separator, [var.application_name, local.region, "access"])
  assume_role_policy = data.aws_iam_policy_document.apprunner.json

  # workaround for https://github.com/hashicorp/terraform-provider-aws/issues/6566
  provisioner "local-exec" {
    command = "sleep 10"
  }
}

resource "aws_iam_role_policy_attachment" "apprunner" {
  role       = aws_iam_role.access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_apprunner_service" "this" {
  service_name = var.application_name
  tags         = var.tags

  source_configuration {
    auto_deployments_enabled = false

    authentication_configuration {
      access_role_arn = aws_iam_role.access.arn
    }

    image_repository {
      image_repository_type = "ECR"
      image_identifier      = module.image.app_image_name
      image_configuration {
        port = var.application_port
        runtime_environment_variables = {
          JWT_SECRET_KEY      = local.application_jwt_secret_key
          OAUTH_CLIENT_ID     = local.application_oauth_client_id
          OAUTH_CLIENT_SECRET = local.application_oauth_client_secret
          AUTHORIZATION_CODE  = local.application_authorization_code
        }
      }
    }
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.instance.arn
    cpu               = var.application_instance_cpu
    memory            = var.application_instance_memory
  }
}
