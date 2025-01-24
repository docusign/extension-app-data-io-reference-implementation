<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0, < 2.0.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.0 |
| <a name="requirement_docker"></a> [docker](#requirement\_docker) | ~> 3.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | ~> 2.5 |
| <a name="requirement_random"></a> [random](#requirement\_random) | ~> 3.6 |
| <a name="requirement_time"></a> [time](#requirement\_time) | ~> 0.12 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | ~> 5.0 |
| <a name="provider_time"></a> [time](#provider\_time) | ~> 0.12 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_generate_authorization_code"></a> [generate\_authorization\_code](#module\_generate\_authorization\_code) | ../common/modules/generate | n/a |
| <a name="module_generate_jwt_secret_key"></a> [generate\_jwt\_secret\_key](#module\_generate\_jwt\_secret\_key) | ../common/modules/generate | n/a |
| <a name="module_generate_oauth_client_id"></a> [generate\_oauth\_client\_id](#module\_generate\_oauth\_client\_id) | ../common/modules/generate | n/a |
| <a name="module_generate_oauth_client_secret"></a> [generate\_oauth\_client\_secret](#module\_generate\_oauth\_client\_secret) | ../common/modules/generate | n/a |
| <a name="module_image"></a> [image](#module\_image) | ../common/modules/docker | n/a |
| <a name="module_manifest"></a> [manifest](#module\_manifest) | ../common/modules/template | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_apprunner_service.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apprunner_service) | resource |
| [aws_ecr_repository.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository) | resource |
| [aws_ecr_repository_policy.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository_policy) | resource |
| [aws_iam_role.access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.instance](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.apprunner](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [time_sleep.access_iam_role_propagation](https://registry.terraform.io/providers/hashicorp/time/latest/docs/resources/sleep) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_ecr_authorization_token.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ecr_authorization_token) | data source |
| [aws_iam_policy_document.app_role_assume_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.apprunner](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecr](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_application_authorization_code"></a> [application\_authorization\_code](#input\_application\_authorization\_code) | The authorization code for the application. If empty, a random code will be generated. | `string` | `""` | no |
| <a name="input_application_build_base_image_name"></a> [application\_build\_base\_image\_name](#input\_application\_build\_base\_image\_name) | The name of the base image to use for the application build | `string` | `"node:lts-alpine"` | no |
| <a name="input_application_build_context"></a> [application\_build\_context](#input\_application\_build\_context) | The relative path to the build context for the application. The build context is the directory from which the Dockerfile is read. If it is empty the current working directory will be used. | `string` | `"../.."` | no |
| <a name="input_application_build_image_tag"></a> [application\_build\_image\_tag](#input\_application\_build\_image\_tag) | The tag to apply to the application build image. If empty the timestamp tag will be used. | `string` | `""` | no |
| <a name="input_application_build_labels"></a> [application\_build\_labels](#input\_application\_build\_labels) | The labels to apply to the application build image | `map(string)` | <pre>{<br/>  "org.opencontainers.image.authors": "DocuSign Inc.",<br/>  "org.opencontainers.image.description": "This reference implementation models the implementation of data input and output functionalities in an extension app.",<br/>  "org.opencontainers.image.licenses": "MIT",<br/>  "org.opencontainers.image.source": "https://github.com/docusign/extension-app-data-io-reference-implementation-private",<br/>  "org.opencontainers.image.title": "Data IO Extension App Reference Implementation",<br/>  "org.opencontainers.image.vendor": "DocuSign Inc."<br/>}</pre> | no |
| <a name="input_application_build_paths"></a> [application\_build\_paths](#input\_application\_build\_paths) | Paths of files relative to the build context, changes to which lead to a rebuild of the image. Supported pattern matches are the same as for the `fileset` Terraform function (https://developer.hashicorp.com/terraform/language/functions/fileset). | `list(string)` | <pre>[<br/>  "src/**",<br/>  "views/**",<br/>  "package.json",<br/>  "Dockerfile",<br/>  ".dockerignore"<br/>]</pre> | no |
| <a name="input_application_environment_mode"></a> [application\_environment\_mode](#input\_application\_environment\_mode) | The environment mode for the application | `string` | `"production"` | no |
| <a name="input_application_instance_cpu"></a> [application\_instance\_cpu](#input\_application\_instance\_cpu) | The number of CPU units to allocate to the application instance | `string` | `"256"` | no |
| <a name="input_application_instance_memory"></a> [application\_instance\_memory](#input\_application\_instance\_memory) | The amount of memory to allocate to the application instance | `string` | `"512"` | no |
| <a name="input_application_jwt_secret_key"></a> [application\_jwt\_secret\_key](#input\_application\_jwt\_secret\_key) | The secret key to use for signing JWT tokens. If empty, a random key will be generated. | `string` | `""` | no |
| <a name="input_application_name"></a> [application\_name](#input\_application\_name) | The name of the application | `string` | `"extension-app-data-io"` | no |
| <a name="input_application_oauth_client_id"></a> [application\_oauth\_client\_id](#input\_application\_oauth\_client\_id) | The OAuth client ID for the application. If empty, a random client ID will be generated. | `string` | `""` | no |
| <a name="input_application_oauth_client_secret"></a> [application\_oauth\_client\_secret](#input\_application\_oauth\_client\_secret) | The OAuth client secret for the application. If empty, a random client secret will be generated. | `string` | `""` | no |
| <a name="input_application_port"></a> [application\_port](#input\_application\_port) | The port the application listens on | `number` | `3000` | no |
| <a name="input_container_tool"></a> [container\_tool](#input\_container\_tool) | The container tool to use for building and pushing images | `string` | `"docker"` | no |
| <a name="input_do_force_delete_repository"></a> [do\_force\_delete\_repository](#input\_do\_force\_delete\_repository) | Whether to delete the ECR repository even if it contains images | `bool` | `true` | no |
| <a name="input_do_scan_images"></a> [do\_scan\_images](#input\_do\_scan\_images) | Whether images are scanned after being pushed to the ECR repository | `bool` | `true` | no |
| <a name="input_docker_host"></a> [docker\_host](#input\_docker\_host) | The Docker host (e.g. 'tcp://127.0.0.1:2376' or 'unix:///var/run/docker.sock') to connect to. If empty, the default Docker host will be used | `string` | `null` | no |
| <a name="input_manifest_files_paths"></a> [manifest\_files\_paths](#input\_manifest\_files\_paths) | The list of manifest files relative paths to generate | `list(string)` | <pre>[<br/>  "../../ReadOnlyManifest.json",<br/>  "../../ReadWriteManifest.json"<br/>]</pre> | no |
| <a name="input_output_manifest_files_directory"></a> [output\_manifest\_files\_directory](#input\_output\_manifest\_files\_directory) | The directory to output the generated manifest files | `string` | `".terraform"` | no |
| <a name="input_region"></a> [region](#input\_region) | The AWS region | `string` | `null` | no |
| <a name="input_repository_image_tag_mutability"></a> [repository\_image\_tag\_mutability](#input\_repository\_image\_tag\_mutability) | The image tag mutability setting for the ECR repository | `string` | `"MUTABLE"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | A map of the tags to apply to various resources | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_application_service_url"></a> [application\_service\_url](#output\_application\_service\_url) | The base URL of the application service |
| <a name="output_output_manifest_files_paths"></a> [output\_manifest\_files\_paths](#output\_output\_manifest\_files\_paths) | The absolute paths to the output manifest files |
<!-- END_TF_DOCS -->
