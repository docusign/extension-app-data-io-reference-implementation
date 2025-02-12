# Shared reusable module for Docker-related resources

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0, < 2.0.0 |
| <a name="requirement_docker"></a> [docker](#requirement\_docker) | ~> 3.0 |
| <a name="requirement_time"></a> [time](#requirement\_time) | ~> 0.12 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_docker"></a> [docker](#provider\_docker) | ~> 3.0 |
| <a name="provider_time"></a> [time](#provider\_time) | ~> 0.12 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [docker_image.app](https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs/resources/image) | resource |
| [docker_image.base](https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs/resources/image) | resource |
| [docker_registry_image.app](https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs/resources/registry_image) | resource |
| [time_static.app_docker_image](https://registry.terraform.io/providers/hashicorp/time/latest/docs/resources/static) | resource |
| [docker_registry_image.base](https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs/data-sources/registry_image) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_app_image_build_args"></a> [app\_image\_build\_args](#input\_app\_image\_build\_args) | The build arguments to pass to the build process. | `map(string)` | `{}` | no |
| <a name="input_app_image_build_context"></a> [app\_image\_build\_context](#input\_app\_image\_build\_context) | The absolute path to the build context. If it is empty, the application image will not be built. | `string` | `""` | no |
| <a name="input_app_image_build_dockerfile"></a> [app\_image\_build\_dockerfile](#input\_app\_image\_build\_dockerfile) | The path to the Dockerfile to use for building the image. | `string` | `null` | no |
| <a name="input_app_image_build_labels"></a> [app\_image\_build\_labels](#input\_app\_image\_build\_labels) | The labels to apply to the image. | `map(string)` | `{}` | no |
| <a name="input_app_image_build_paths"></a> [app\_image\_build\_paths](#input\_app\_image\_build\_paths) | Paths of files relative to the build context, changes to which lead to a rebuild of the image. Supported pattern matches are the same as for the `fileset` Terraform function (https://developer.hashicorp.com/terraform/language/functions/fileset). | `list(string)` | `[]` | no |
| <a name="input_app_image_build_platform"></a> [app\_image\_build\_platform](#input\_app\_image\_build\_platform) | The platform to build the image for. | `string` | `"linux/amd64"` | no |
| <a name="input_app_image_build_tags"></a> [app\_image\_build\_tags](#input\_app\_image\_build\_tags) | The tags to apply to the image. | `list(string)` | `[]` | no |
| <a name="input_app_image_build_target_stage"></a> [app\_image\_build\_target\_stage](#input\_app\_image\_build\_target\_stage) | The target build stage. | `string` | `null` | no |
| <a name="input_app_image_name"></a> [app\_image\_name](#input\_app\_image\_name) | The name of the application image to build. If it is empty, the application image will not be built. | `string` | `""` | no |
| <a name="input_base_image_name"></a> [base\_image\_name](#input\_base\_image\_name) | The name of the base image to use. If it is empty, the base image will not be pulled. | `string` | `""` | no |
| <a name="input_do_build_app_image"></a> [do\_build\_app\_image](#input\_do\_build\_app\_image) | Whether to build the application image. | `bool` | `true` | no |
| <a name="input_do_force_remove_images"></a> [do\_force\_remove\_images](#input\_do\_force\_remove\_images) | Whether to force remove images when the Terrafrom resources are destroyed. | `bool` | `false` | no |
| <a name="input_do_keep_images_locally"></a> [do\_keep\_images\_locally](#input\_do\_keep\_images\_locally) | Whether to keep images locally after destroy operation. | `bool` | `true` | no |
| <a name="input_do_keep_images_remotely"></a> [do\_keep\_images\_remotely](#input\_do\_keep\_images\_remotely) | Whether to keep images remotely after destroy operation. | `bool` | `true` | no |
| <a name="input_do_pull_base_image"></a> [do\_pull\_base\_image](#input\_do\_pull\_base\_image) | Whether to pull the base image. | `bool` | `true` | no |
| <a name="input_do_push_app_image"></a> [do\_push\_app\_image](#input\_do\_push\_app\_image) | Whether to push the application image. | `bool` | `true` | no |
| <a name="input_do_use_build_cache"></a> [do\_use\_build\_cache](#input\_do\_use\_build\_cache) | Whether to use the build cache. | `bool` | `true` | no |
| <a name="input_do_use_timestamp_tag"></a> [do\_use\_timestamp\_tag](#input\_do\_use\_timestamp\_tag) | Whether to add a timestamp tag to the image. | `bool` | `true` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Whether the module should be enabled. If it is false, the module will not do anything. | `bool` | `true` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_app_image_name"></a> [app\_image\_name](#output\_app\_image\_name) | The name of the built application image. |
| <a name="output_app_image_repo_digest"></a> [app\_image\_repo\_digest](#output\_app\_image\_repo\_digest) | The digest of the built application image. |
| <a name="output_base_image_name"></a> [base\_image\_name](#output\_base\_image\_name) | The name of the used base image. |
<!-- END_TF_DOCS -->
