# Terraform configuration for deploying to Google Cloud Platform (GCP)

## Specific cloud prerequisites

Before deploying your extension app on GCP, complete the following setup steps:

1. [Sign up for a Google Cloud account](https://cloud.google.com/free/) (if you don’t already have one).
    * You must [enable billing](https://cloud.google.com/billing/docs/how-to/manage-billing-account) to use most Google Cloud services, even if staying within the free tier.

1. **Configure Google Cloud SDK**: Install and configure the Google Cloud SDK to interact with your Google account. You can follow the instructions [here](https://cloud.google.com/sdk/docs/install).

1. **Authenticate with Google Cloud**: Log in to your Google account using the Application Default Credentials (ADC):
    ```sh
    gcloud auth login
    gcloud auth application-default login
    ```
    * The first command logs you into Google Cloud.
    * The second command allows Terraform and other tools to use ADC for authentication.

1. **Configure your Google Cloud project**:
    ```sh
    gcloud config set project YOUR_PROJECT_ID
    ```
    If you don’t have a project yet, [create one](https://cloud.google.com/resource-manager/docs/creating-managing-projects):
    ```sh
    gcloud projects create YOUR_PROJECT_ID --name="Your Project Name"
    ```
    After setting the project, export it as an environment variable so Terraform can reference it:
    ```sh
    export GOOGLE_CLOUD_PROJECT="your-project-id"
    ```
1. **Enable necessary APIs**: The following services must be [enabled in a project](https://cloud.google.com/service-usage/docs/enable-disable) before their service API can be used by the provider:
    - Cloud Resource Manager API
    - Artifact Registry API
    - Cloud Build API
    - Cloud Run Admin API

    ```sh
    gcloud services enable cloudresourcemanager.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    ```

In that case `google` Terraform provider is authenticated to Google using [User Application Default Credentials ("ADCs")](https://cloud.google.com/sdk/gcloud/reference/auth/application-default), but you may use other methods for [authenticating to Google](https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference#authentication).

Now that you’ve set up your Google Cloud environment, continue with the [Terraform deployment guide](terraform/README.md) to provision your infrastructure.

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
| <a name="input_application_build_paths"></a> [application\_build\_paths](#input\_application\_build\_paths) | Paths of files relative to the build context, changes to which lead to a rebuild of the image. Supported pattern matches are the same as for the `fileset` Terraform function (https://developer.hashicorp.com/terraform/language/functions/fileset). | `list(string)` | <pre>[<br/>  "public/**",<br/>  "src/**",<br/>  "views/**",<br/>  "package.json",<br/>  "tsconfig.json",<br/>  "Dockerfile",<br/>  ".dockerignore"<br/>]</pre> | no |
| <a name="input_application_cloud_run_service_name"></a> [application\_cloud\_run\_service\_name](#input\_application\_cloud\_run\_service\_name) | The name of the Cloud Run service. If it is not defined, the prefixed application name will be used | `string` | `null` | no |
| <a name="input_application_environment_mode"></a> [application\_environment\_mode](#input\_application\_environment\_mode) | The environment mode for the application | `string` | `"production"` | no |
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
| <a name="input_region"></a> [region](#input\_region) | The default region to manage resources in. If another region is specified on a regional resource, it will take precedence. Alternatively, this can be specified using the `GOOGLE_REGION` environment variable | `string` | `"us-central1"` | no |
| <a name="input_zone"></a> [zone](#input\_zone) | The default zone to manage resources in. Generally, this zone should be within the default region you specified. If another zone is specified on a zonal resource, it will take precedence. Alternatively, this can be specified using the `GOOGLE_ZONE` environment variable | `string` | `"us-central1-a"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_application_service_url"></a> [application\_service\_url](#output\_application\_service\_url) | The base URL of the application service |
| <a name="output_output_manifest_files_paths"></a> [output\_manifest\_files\_paths](#output\_output\_manifest\_files\_paths) | The absolute paths to the output manifest files |
<!-- END_TF_DOCS -->
