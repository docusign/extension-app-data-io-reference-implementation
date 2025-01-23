## Prerequisites
Create a Free Google Cloud Platform (GCP) account https://console.cloud.google.com/getting-started?inv=1&invt=Abnbjw

Ensure the following tools are installed on your system:
- **Google cloud CLI**: Installation instructions can be found [here](https://cloud.google.com/sdk/docs/install-sdk).
  Exit from current terminal and open a new one
  Check that `gcloud` installed successfully
  ```
  gcloud version
  ```
- **Terraform v1.10.3**: Installation instructions can be found [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).
  Check that `terraform` installed successfully
  ```
  terraform version
  ```
- **Docker Desktop**: https://www.docker.com/products/docker-desktop/ and select `use WSL instead of Hyper-V`
  Check that `docker` installed successfully and the Docker service is up and running
  ```
  docker info
  ```
  Disable containerd for pulling and storing images:
  •  Open Docker Desktop settings
  •  Navigate to the `Setting` -> `General` section
  •  Disable the `Use containerd for pulling and storing images` option
- **jq**: A command-line JSON processor.
- **nodejs**:

**Note**: You must have the `Owner` role in your Google cloud platform subscription.

## Create Service account in GCP
- In the Google Cloud console, go to `Menu` -> `APIs & Services` -> `Credentials`
- Click `Create credentials` -> `API key`
- Update name of the service account in the `variables.tf` (terraform_service_account)

## Create json authentication key for service account
- Go to `Menu` -> `IAM & Admin` -> `Service accounts`
- Select created service account and go to `KEYS` section
- Than `Add key` -> `Crate new key` -> select `JOSN key type` -> and press `Create` button
- Update name of the downloaded json file in the `gcp_credentials_file` variable (`variables.tf` file)
- Copy downloaded json file to the `terraform/gcp` folder
More details how to create service account key can be found in the article [Create a service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating)

## Add the permissions to the created service account
In the Google Cloud console, go to `Menu` -> `IAM & Admin` -> `Edit principal of the service account` and assign the following roles:
- Artifact registry administrator
- Cloud run admin
- Security Admin
- Service Account admin

## Enable GCP APIs
Find the following APIs and enable them:
- Cloud Resource Manager API
- Artifact Registry API
- Cloud Build API
- Cloud Run Admin API

## Authenticate with GCP and Select Your Project
To authenticate Terraform with GCP:
- run `gcloud auth login --no-launch-browser` command
- open generated URL in your WEB browserб authenticate and copy paste generated code form the browser to the terminal
- set your project ID using `gcloud config set project YOUR_PROJECT_ID` command (replace YOUR_PROJECT_ID to the name of your project ID)

## Deploy the Application in Azure
Go to the `terraform/azure` directory and execute the following commands:
- `terraform init` - Initializes the working directory and installs plugins for the required providers.
- `terraform plan` - Creates an execution plan, allowing you to preview the changes Terraform will make.
- `terraform apply` - Executes the proposed plan to create, update, or destroy infrastructure.

## Verify the Application is Ready
Run the following command:
- `terraform output web_app_url`

Open the provided URL in a web browser to confirm the application is functioning as expected.


**Warning**
Warning! If you're not using an account that qualifies under the GCP free tier, you may be charged to run these examples. The most you should be charged should only be a few dollars, but we're not responsible for any charges that may incur.

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0, < 2.0.0 |
| <a name="requirement_docker"></a> [docker](#requirement\_docker) | ~> 3.0 |
| <a name="requirement_google"></a> [google](#requirement\_google) | ~> 6.16 |
| <a name="requirement_local"></a> [local](#requirement\_local) | ~> 2.5 |
| <a name="requirement_random"></a> [random](#requirement\_random) | ~> 3.6 |
| <a name="requirement_time"></a> [time](#requirement\_time) | ~> 0.12 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_google"></a> [google](#provider\_google) | ~> 6.16 |
| <a name="provider_terraform"></a> [terraform](#provider\_terraform) | n/a |
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
| [google_artifact_registry_repository.this](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/artifact_registry_repository) | resource |
| [google_artifact_registry_repository_iam_binding.readers](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/artifact_registry_repository_iam_binding) | resource |
| [google_artifact_registry_repository_iam_binding.writers](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/artifact_registry_repository_iam_binding) | resource |
| [google_cloud_run_service.this](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_service) | resource |
| [google_cloud_run_service_iam_binding.invokers](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_service_iam_binding) | resource |
| [google_service_account.application](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/service_account) | resource |
| [google_service_account_key.application](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/service_account_key) | resource |
| [terraform_data.login_container_registry](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data) | resource |
| [terraform_data.push_docker_image](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data) | resource |
| [time_rotating.application_service_account_key](https://registry.terraform.io/providers/hashicorp/time/latest/docs/resources/rotating) | resource |
| [google_client_config.this](https://registry.terraform.io/providers/hashicorp/google/latest/docs/data-sources/client_config) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_application_authorization_code"></a> [application\_authorization\_code](#input\_application\_authorization\_code) | The authorization code for the application. If empty, a random code will be generated. | `string` | `""` | no |
| <a name="input_application_build_base_image_name"></a> [application\_build\_base\_image\_name](#input\_application\_build\_base\_image\_name) | The name of the base image to use for the application build | `string` | `"node:lts-alpine"` | no |
| <a name="input_application_build_context"></a> [application\_build\_context](#input\_application\_build\_context) | The relative path to the build context for the application. The build context is the directory from which the Dockerfile is read. If it is empty the current working directory will be used. | `string` | `"../.."` | no |
| <a name="input_application_build_image_tag"></a> [application\_build\_image\_tag](#input\_application\_build\_image\_tag) | The tag to apply to the application build image. If empty the timestamp tag will be used. | `string` | `""` | no |
| <a name="input_application_build_labels"></a> [application\_build\_labels](#input\_application\_build\_labels) | The labels to apply to the application build image | `map(string)` | <pre>{<br/>  "org.opencontainers.image.authors": "DocuSign Inc.",<br/>  "org.opencontainers.image.description": "This reference implementation models the implementation of data input and output functionalities in an extension app.",<br/>  "org.opencontainers.image.licenses": "MIT",<br/>  "org.opencontainers.image.source": "https://github.com/docusign/extension-app-data-io-reference-implementation-private",<br/>  "org.opencontainers.image.title": "Data IO Extension App Reference Implementation",<br/>  "org.opencontainers.image.vendor": "DocuSign Inc."<br/>}</pre> | no |
| <a name="input_application_build_paths"></a> [application\_build\_paths](#input\_application\_build\_paths) | Paths of files relative to the build context, changes to which lead to a rebuild of the image. Supported pattern matches are the same as for the `fileset` Terraform function (https://developer.hashicorp.com/terraform/language/functions/fileset). | `list(string)` | <pre>[<br/>  "src/**",<br/>  "views/**",<br/>  "package.json",<br/>  "Dockerfile",<br/>  ".dockerignore"<br/>]</pre> | no |
| <a name="input_application_build_target_stage"></a> [application\_build\_target\_stage](#input\_application\_build\_target\_stage) | The target build stage for the application | `string` | `"production"` | no |
| <a name="input_application_cloud_run_service_name"></a> [application\_cloud\_run\_service\_name](#input\_application\_cloud\_run\_service\_name) | The name of the Cloud Run service. If it is not defined, the prefixed application name will be used | `string` | `null` | no |
| <a name="input_application_jwt_secret_key"></a> [application\_jwt\_secret\_key](#input\_application\_jwt\_secret\_key) | The secret key to use for signing JWT tokens. If empty, a random key will be generated. | `string` | `""` | no |
| <a name="input_application_name"></a> [application\_name](#input\_application\_name) | The name of the application | `string` | `"extension-app-data-io"` | no |
| <a name="input_application_oauth_client_id"></a> [application\_oauth\_client\_id](#input\_application\_oauth\_client\_id) | The OAuth client ID for the application. If empty, a random client ID will be generated. | `string` | `""` | no |
| <a name="input_application_oauth_client_secret"></a> [application\_oauth\_client\_secret](#input\_application\_oauth\_client\_secret) | The OAuth client secret for the application. If empty, a random client secret will be generated. | `string` | `""` | no |
| <a name="input_application_port"></a> [application\_port](#input\_application\_port) | The port the application listens on | `number` | `3000` | no |
| <a name="input_application_repository_name"></a> [application\_repository\_name](#input\_application\_repository\_name) | The name of the Google Artifact Registry repository. If it is not defined, the prefixed application name will be used | `string` | `null` | no |
| <a name="input_application_service_account_key_rotation_days"></a> [application\_service\_account\_key\_rotation\_days](#input\_application\_service\_account\_key\_rotation\_days) | The number of days after which the application service account key should be rotated | `number` | `30` | no |
| <a name="input_application_service_account_name"></a> [application\_service\_account\_name](#input\_application\_service\_account\_name) | The name of the application service account. If it is not defined, the prefixed application name will be used | `string` | `null` | no |
| <a name="input_are_image_tags_mutable"></a> [are\_image\_tags\_mutable](#input\_are\_image\_tags\_mutable) | The image tag mutability setting for the Google Artifact Registry repository | `bool` | `false` | no |
| <a name="input_container_tool"></a> [container\_tool](#input\_container\_tool) | The container tool to use for building and pushing images | `string` | `"docker"` | no |
| <a name="input_credentials"></a> [credentials](#input\_credentials) | The credentials to use to authenticate against Google Cloud Platform. This can be a path to a file which contains service account key file in JSON format, or the credentials themselves. You can alternatively use the `GOOGLE_CREDENTIALS` environment variable | `any` | `null` | no |
| <a name="input_do_scan_images"></a> [do\_scan\_images](#input\_do\_scan\_images) | Whether images are scanned after being pushed to the Google Artifact Registry repository | `bool` | `true` | no |
| <a name="input_docker_host"></a> [docker\_host](#input\_docker\_host) | The Docker host (e.g. 'tcp://127.0.0.1:2376' or 'unix:///var/run/docker.sock') to connect to. If empty, the default Docker host will be used | `string` | `null` | no |
| <a name="input_labels"></a> [labels](#input\_labels) | A set of key/value label pairs to assign to the resources | `map(string)` | `{}` | no |
| <a name="input_manifest_files_paths"></a> [manifest\_files\_paths](#input\_manifest\_files\_paths) | The list of manifest files relative paths to generate | `list(string)` | <pre>[<br/>  "../../ReadOnlyManifest.json",<br/>  "../../ReadWriteManifest.json"<br/>]</pre> | no |
| <a name="input_output_manifest_files_directory"></a> [output\_manifest\_files\_directory](#input\_output\_manifest\_files\_directory) | The directory to output the generated manifest files | `string` | `".terraform"` | no |
| <a name="input_project"></a> [project](#input\_project) | The default project project to manage resources in. If another project is specified on a resource, it will take precedence. This can also be specified using the `GOOGLE_PROJECT` environment variable | `string` | `null` | no |
| <a name="input_region"></a> [region](#input\_region) | The default region to manage resources in. If another region is specified on a regional resource, it will take precedence. Alternatively, this can be specified using the `GOOGLE_REGION` environment variable | `string` | `null` | no |
| <a name="input_zone"></a> [zone](#input\_zone) | The default zone to manage resources in. Generally, this zone should be within the default region you specified. If another zone is specified on a zonal resource, it will take precedence. Alternatively, this can be specified using the `GOOGLE_ZONE` environment variable | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_application_service_url"></a> [application\_service\_url](#output\_application\_service\_url) | The base URL of the application service |
| <a name="output_output_manifest_files_paths"></a> [output\_manifest\_files\_paths](#output\_output\_manifest\_files\_paths) | The absolute paths to the output manifest files |
<!-- END_TF_DOCS -->
