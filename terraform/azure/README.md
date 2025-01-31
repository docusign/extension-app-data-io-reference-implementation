# Terraform configuration for deploying to Microsoft Azure

## Specific Cloud Prerequisites

To get started, you need to:

1. **Configure Azure CLI**: Install and configure the Azure CLI to interact with your Azure account. You can follow the instructions [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

1. **Authenticate Azure CLI**: Log in to your Azure account using the Azure CLI:
    ```sh
    az login
    ```

1. **Set Subscription**: Set the Azure subscription you want to use:
    ```sh
    az account set --subscription "your-subscription-id"
    ```
    It's also necessary to set the Azure subscription when running the `azurerm` Terraform provider with version 4.0 or above. This can be done by specifying the `subscription_id` Terraform variable or by exporting the `ARM_SUBSCRIPTION_ID` environment variable. For instance,
    ```sh
    export ARM_SUBSCRIPTION_ID="your-subscription-id"
    ```

In that case `azurerm` Terraform provider is [authenticated to Azure using the Azure CLI](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/azure_cli), but you may use other methods for [authenticating to Azure](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#authenticating-to-azure).

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0, < 2.0.0 |
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | ~> 4.16 |
| <a name="requirement_docker"></a> [docker](#requirement\_docker) | ~> 3.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | ~> 2.5 |
| <a name="requirement_random"></a> [random](#requirement\_random) | ~> 3.6 |
| <a name="requirement_time"></a> [time](#requirement\_time) | ~> 0.12 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | ~> 4.16 |
| <a name="provider_random"></a> [random](#provider\_random) | ~> 3.6 |
| <a name="provider_terraform"></a> [terraform](#provider\_terraform) | n/a |

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
| [azurerm_container_registry.this](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_registry) | resource |
| [azurerm_linux_web_app.this](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app) | resource |
| [azurerm_resource_group.this](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group) | resource |
| [azurerm_role_assignment.pull_image](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_service_plan.this](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/service_plan) | resource |
| [random_id.container_registry](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [random_id.web_app](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [terraform_data.login_container_registry](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data) | resource |
| [terraform_data.push_docker_image](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data) | resource |
| [azurerm_subscription.current](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/subscription) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_application_authorization_code"></a> [application\_authorization\_code](#input\_application\_authorization\_code) | The authorization code for the application. If empty, a random code will be generated. | `string` | `""` | no |
| <a name="input_application_build_base_image_name"></a> [application\_build\_base\_image\_name](#input\_application\_build\_base\_image\_name) | The name of the base image to use for the application build | `string` | `"node:lts-alpine"` | no |
| <a name="input_application_build_context"></a> [application\_build\_context](#input\_application\_build\_context) | The relative path to the build context for the application. The build context is the directory from which the Dockerfile is read. If it is empty the current working directory will be used. | `string` | `"../.."` | no |
| <a name="input_application_build_image_tag"></a> [application\_build\_image\_tag](#input\_application\_build\_image\_tag) | The tag to apply to the application build image. If empty the timestamp tag will be used. | `string` | `""` | no |
| <a name="input_application_build_labels"></a> [application\_build\_labels](#input\_application\_build\_labels) | The labels to apply to the application build image | `map(string)` | <pre>{<br/>  "org.opencontainers.image.authors": "DocuSign Inc.",<br/>  "org.opencontainers.image.description": "This reference implementation models the implementation of data input and output functionalities in an extension app.",<br/>  "org.opencontainers.image.licenses": "MIT",<br/>  "org.opencontainers.image.source": "https://github.com/docusign/extension-app-data-io-reference-implementation-private",<br/>  "org.opencontainers.image.title": "Data IO Extension App Reference Implementation",<br/>  "org.opencontainers.image.vendor": "DocuSign Inc."<br/>}</pre> | no |
| <a name="input_application_build_paths"></a> [application\_build\_paths](#input\_application\_build\_paths) | Paths of files relative to the build context, changes to which lead to a rebuild of the image. Supported pattern matches are the same as for the `fileset` Terraform function (https://developer.hashicorp.com/terraform/language/functions/fileset). | `list(string)` | <pre>[<br/>  "public/**",<br/>  "src/**",<br/>  "views/**",<br/>  "package.json",<br/>  "tsconfig.json",<br/>  "Dockerfile",<br/>  ".dockerignore"<br/>]</pre> | no |
| <a name="input_application_environment_mode"></a> [application\_environment\_mode](#input\_application\_environment\_mode) | The environment mode for the application | `string` | `"production"` | no |
| <a name="input_application_jwt_secret_key"></a> [application\_jwt\_secret\_key](#input\_application\_jwt\_secret\_key) | The secret key to use for signing JWT tokens. If empty, a random key will be generated. | `string` | `""` | no |
| <a name="input_application_name"></a> [application\_name](#input\_application\_name) | The name of the application | `string` | `"extension-app-data-io"` | no |
| <a name="input_application_oauth_client_id"></a> [application\_oauth\_client\_id](#input\_application\_oauth\_client\_id) | The OAuth client ID for the application. If empty, a random client ID will be generated. | `string` | `""` | no |
| <a name="input_application_oauth_client_secret"></a> [application\_oauth\_client\_secret](#input\_application\_oauth\_client\_secret) | The OAuth client secret for the application. If empty, a random client secret will be generated. | `string` | `""` | no |
| <a name="input_application_port"></a> [application\_port](#input\_application\_port) | The port the application listens on | `number` | `3000` | no |
| <a name="input_application_service_plan_name"></a> [application\_service\_plan\_name](#input\_application\_service\_plan\_name) | The name of the application service plan. If it is not defined, the prefixed application name will be used | `string` | `null` | no |
| <a name="input_application_service_plan_sku_name"></a> [application\_service\_plan\_sku\_name](#input\_application\_service\_plan\_sku\_name) | The SKU name of the application service plan | `string` | `"F1"` | no |
| <a name="input_application_service_plan_worker_count"></a> [application\_service\_plan\_worker\_count](#input\_application\_service\_plan\_worker\_count) | The number of workers to allocate for the application service plan | `number` | `1` | no |
| <a name="input_application_webapp_name"></a> [application\_webapp\_name](#input\_application\_webapp\_name) | The name of the application web app. If it is not defined, the prefixed application name will be used | `string` | `null` | no |
| <a name="input_container_registry_name"></a> [container\_registry\_name](#input\_container\_registry\_name) | The name of the container registry. If it is not defined, the prefixed application name will be used | `string` | `null` | no |
| <a name="input_container_registry_sku"></a> [container\_registry\_sku](#input\_container\_registry\_sku) | The SKU of the container registry | `string` | `"Basic"` | no |
| <a name="input_container_tool"></a> [container\_tool](#input\_container\_tool) | The container tool to use for building and pushing images | `string` | `"docker"` | no |
| <a name="input_do_enable_admin_access"></a> [do\_enable\_admin\_access](#input\_do\_enable\_admin\_access) | Whether to enable admin access to the container registry | `bool` | `true` | no |
| <a name="input_do_randomize_resource_names"></a> [do\_randomize\_resource\_names](#input\_do\_randomize\_resource\_names) | Whether to randomize the resource names that should be globally unique | `bool` | `true` | no |
| <a name="input_docker_host"></a> [docker\_host](#input\_docker\_host) | The Docker host (e.g. 'tcp://127.0.0.1:2376' or 'unix:///var/run/docker.sock') to connect to. If empty, the default Docker host will be used | `string` | `null` | no |
| <a name="input_is_application_webapp_always_on"></a> [is\_application\_webapp\_always\_on](#input\_is\_application\_webapp\_always\_on) | Whether the application web app should always be on | `bool` | `false` | no |
| <a name="input_location"></a> [location](#input\_location) | The location/region where the resources will be created | `string` | `"West Europe"` | no |
| <a name="input_manifest_files_paths"></a> [manifest\_files\_paths](#input\_manifest\_files\_paths) | The list of manifest files relative paths to generate | `list(string)` | <pre>[<br/>  "../../ReadOnlyManifest.json",<br/>  "../../ReadWriteManifest.json"<br/>]</pre> | no |
| <a name="input_output_manifest_files_directory"></a> [output\_manifest\_files\_directory](#input\_output\_manifest\_files\_directory) | The directory to output the generated manifest files | `string` | `".terraform"` | no |
| <a name="input_resource_group_name"></a> [resource\_group\_name](#input\_resource\_group\_name) | The name of the resource group. If it is not defined, the prefixed application name will be used | `string` | `null` | no |
| <a name="input_subscription_id"></a> [subscription\_id](#input\_subscription\_id) | The Azure subscription ID | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | A map of the tags to apply to various resources | `map(string)` | `{}` | no |
| <a name="input_tenant_id"></a> [tenant\_id](#input\_tenant\_id) | The Azure tenant ID | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_application_service_url"></a> [application\_service\_url](#output\_application\_service\_url) | The base URL of the application service |
| <a name="output_output_manifest_files_paths"></a> [output\_manifest\_files\_paths](#output\_output\_manifest\_files\_paths) | The absolute paths to the output manifest files |
<!-- END_TF_DOCS -->
