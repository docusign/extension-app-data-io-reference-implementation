# Deploying an extension app to the cloud with Terraform

Hashicorp Terraform is an Infrastructure as code (IaC) tool that lets you provision and manage cloud infrastructure. Terraform provides plugins called providers that allow you to interact with cloud providers and other APIs (e.g. Docker).

This guide describes how to use Terraform to deploy your extension app to different cloud providers:
- [Amazon Web Services](https://aws.amazon.com/)
- [Microsoft Azure](https://azure.microsoft.com/)
- [Google Cloud Platform](https://cloud.google.com/)

## Prerequisites

To get started, you need to:
- **Install any container management tool**: Make sure that you have a container management tool installed on your local machine. You can download it from:
    - [Docker Desktop](https://docs.docker.com/desktop/) based on [Docker](https://docs.docker.com/engine/install/)
        - **Note:** See [What else should I check if I run Docker Desktop?](#what-else-should-i-check-if-i-run-docker-desktop)
    - [Rancher Desktop](https://docs.rancherdesktop.io/getting-started/installation/) based on [Moby](https://mobyproject.org/)
    - [Podman Desktop](https://podman-desktop.io/docs/installation) based on [Podman](https://podman.io/)
- **Install Terraform**: Make sure that you have Terraform installed on your local machine. You can download it from the [official Terraform website](https://developer.hashicorp.com/terraform/install).
- **Meet the specific cloud prerequisites**:
    - [AWS](aws/README.md#specific-cloud-prerequisites)
    - [Azure](azure/README.md#specific-cloud-prerequisites)
    - [GCP](gcp/README.md#specific-cloud-prerequisites)

## Deploying resources

To deploy your extension app using Terraform, follow these steps:

1. **Navigate to the directory of the cloud provider you want to deploy to:**
    ```sh
    cd aws    # For Amazon Web Services
    cd azure  # For Microsoft Azure
    cd gcp    # For Google Cloud Platform
    ```

1. **Initialize Terraform:**
    ```sh
    terraform init -upgrade
    ```

    _Key points_:

    - The `-upgrade` parameter upgrades the necessary provider plugins to the newest version that complies with the configuration's version constraints.

1. **Generate and review the execution plan:**
    ```sh
    terraform plan -out app.tfplan
    ```

    _Key points_:

    - The `terraform plan` command creates an execution plan but doesn't execute it. Instead, it determines the necessary actions to create the configuration specified in your configuration files. This pattern allows you to verify whether the execution plan matches your expectations before making any changes to actual resources.
    - The optional `-out` parameter allows you to specify an output file for the plan. Using the `-out` parameter ensures that the plan you reviewed is exactly what is applied.

1. **Apply the configuration to provision the infrastructure:**
    ```sh
    terraform apply app.tfplan
    ```

    _Key points_:

    - The example `terraform apply` command assumes you previously ran `terraform plan -out app.tfplan`.
    - If you specified a different filename for the `-out` parameter, use that same filename in the call to `terraform apply`.
    - If you didn't use the `-out` parameter, call `terraform apply` without any parameters.
    - You may add the `-auto-approve` parameter to automatically confirm. If not please type `yes` when prompted.

Following these steps will deploy your extension app to the selected cloud provider using Terraform.

## Getting results

After running the `terraform apply` command and confirming the action, Terraform will begin provisioning the infrastructure as defined in configuration files. This process involves:

1. **Creating Resources:** Terraform will create the necessary resources (e.g., Docker image, cloud container registry, cloud web application service, etc.) by making API calls to providers.
1. **Configuring Resources:** Terraform will configure the resources according to the specifications in the configuration files.
1. **Updating State File:** Terraform will update the state file to reflect the current state of the infrastructure. This file is crucial for tracking the resources and their configurations.

Once the process is complete, Terraform will output the results, including the cloud web application service URL and paths for the generated manifests. Upload these manifests to the [DocuSign Developer Console](https://devconsole.docusign.com/apps) to add your extension app. You can always get the results later by running the `terraform output` command.

## Cleaning up

When you no longer need the resources created via Terraform, do the following steps:

1. **Generate and review the execution plan:**

    ```sh
    terraform plan -destroy -out app.destroy.tfplan
    ```

    _Key points_:

    - The `-destroy` parameter activates destroy mode that creates a plan whose goal is to destroy all remote objects that currently exist, leaving an empty Terraform state. It is the same as running `terraform destroy`. Destroy mode can be useful for situations like transient development environments, where the managed objects cease to be useful once the development task is complete.

1. **Apply the configuration to remove the infrastructure:**

    ```sh
    terraform apply app.destroy.tfplan
    ```

    _Key points_:

    - Optionally, you can run `terraform destroy` instead of generating and applying the destroy plan in the above two steps.
    - You may add `-auto-approve` parameter to automatically confirm. If not please type `yes` when prompted.


## Benefits of using Terraform

This section explains some of the benefits of using Terraform to provision and manage extension app cloud deployment:
- Terraform is the most commonly used tool to provision and automate cloud infrastructure. You can use the different cloud providers to configure and manage all cloud resources using the same declarative syntax and tooling.
- Terraform lets you specify your preferred end state for your infrastructure. You can then deploy the same configuration multiple times to create reproducible development, test, and production environments.
- Terraform lets you generate an execution plan that shows what Terraform will do when you apply your configuration. This lets you avoid any surprises when you modify your infrastructure through Terraform.
- Terraform lets you package and reuse common code in the form of [modules](https://developer.hashicorp.com/terraform/language/modules). Modules present standard interfaces for creating resources. They simplify projects by increasing readability and allow teams to organize infrastructure in readable blocks.
- Terraform records the current state of your infrastructure and lets you manage the state effectively. The Terraform state file keeps track of all resources in a deployment.

## Using Terraform

Terraform has a declarative and configuration-oriented syntax, which you can use to [author the infrastructure](https://developer.hashicorp.com/terraform/language) that you want to provision. Using this syntax, you'll define your preferred end-state for your infrastructure in a _Terraform configuration file_. You'll then use the [Terraform CLI](https://developer.hashicorp.com/terraform/cli/commands) to provision infrastructure based on the configuration file.

The following steps explain how Terraform works:

1. You describe the cloud infrastructure you want to provision in a Terraform configuration file. You don't need to author code describing _how_ to provision this configuration.
1. You run the `terraform plan` command, which evaluates your configuration and generates an execution plan. You can review the plan and make changes as needed.
1. Then, you run the `terraform apply` command, which performs the following actions:
    - It provisions your infrastructure based on your execution plan by invoking the corresponding APIs in the background.
    - It creates a _Terraform state file_, which is a JSON formatted mapping of resources in your configuration file to the resources in the real-world infrastructure. Terraform uses this file to know the latest state of your infrastructure, and to determine when to create, update, and destroy resources.
1. Subsequently, when you run `terraform apply`, Terraform uses the mapping in the state file to compare the existing infrastructure to the code, and make updates as necessary:
    - If a resource object defined in the configuration file does not exist in the state file, Terraform creates it.
    - If a resource object exists in the state file, but has a different configuration from your configuration file, Terraform updates the resource to match your configuration file.
    - If a resource object in the state file matches your configuration file, Terraform leaves the resource unchanged.

## Directory structure

The directory structure is organized to support deploying the extension app to different cloud providers using Terraform. Here's an overview of the structure:

- `README.md`: The main documentation file.
- `aws/`: Contains Terraform configuration files for deploying to Amazon Web Services.
    - `README.md`: Documentation specific to AWS deployment.
    - `apprunner.tf`, `ecr.tf`, `image.tf`, `main.tf`, `outputs.tf`, `providers.tf`, `terraform.tf`, `variables.tf`: Various Terraform configuration files for AWS resources.
- `azure/`: Contains Terraform configuration files for deploying to Microsoft Azure.
    - `README.md`: Documentation specific to Azure deployment.
    - `acr.tf`, `image.tf`, `main.tf`, `outputs.tf`, `providers.tf`, `resource_group.tf`, `terraform.tf`, `variables.tf`, `webapp.tf`: Various Terraform configuration files for Azure resources.
- `gcp/`: Contains Terraform configuration files for deploying to the Google Cloud Platform.
    - `README.md`: Documentation specific to GCP deployment.
    - `cloudrun.tf`, `gar.tf`, `image.tf`, `main.tf`, `outputs.tf`, `providers.tf`, `sa.tf`, `terraform.tf`, `variables.tf`: Various Terraform configuration files for GCP resources.
- `common/`: Contains reusable modules that can be shared across different cloud providers.
    - `modules/`: Directory for common modules.
        - `docker/`: Module for Docker-related resources.
            - `README.md`: Documentation specific to the `docker` module.
            - `main.tf`, `outputs.tf`, `terraform.tf`, `variables.tf`: Terraform configuration files for the `docker` module.
        - `generate/`: Module for generating secret values.
            - `README.md`: Documentation specific to the `generate` module.
            - `main.tf`, `outputs.tf`, `terraform.tf`, `variables.tf`: Terraform configuration files for the `generate` module.
        - `template/`: Module for templating manifests.
            - `README.md`: Documentation specific to the `template` module
            - `main.tf`, `outputs.tf`, `terraform.tf`, `variables.tf`: Terraform configuration files for the `template` module.

```
├── README.md
├── aws
│   ├── README.md
│   ├── apprunner.tf
│   ├── ecr.tf
│   ├── image.tf
│   ├── main.tf
│   ├── outputs.tf
│   ├── providers.tf
│   ├── terraform.tf
│   └── variables.tf
├── azure
│   ├── README.md
│   ├── acr.tf
│   ├── image.tf
│   ├── main.tf
│   ├── outputs.tf
│   ├── providers.tf
│   ├── resource_group.tf
│   ├── terraform.tf
│   ├── variables.tf
│   └── webapp.tf
├── common
│   └── modules
│       ├── docker
│       │   ├── README.md
│       │   ├── main.tf
│       │   ├── outputs.tf
│       │   ├── terraform.tf
│       │   └── variables.tf
│       ├── generate
│       │   ├── README.md
│       │   ├── main.tf
│       │   ├── outputs.tf
│       │   ├── terraform.tf
│       │   └── variables.tf
│       └── template
│           ├── README.md
│           ├── main.tf
│           ├── outputs.tf
│           ├── terraform.tf
│           └── variables.tf
└── gcp
    ├── README.md
    ├── cloudrun.tf
    ├── gar.tf
    ├── image.tf
    ├── main.tf
    ├── outputs.tf
    ├── providers.tf
    ├── sa.tf
    ├── terraform.tf
    └── variables.tf
```

## Frequently asked questions

### What if I use a non-standard Docker daemon socket (Moby, Podman, etc.)?

You can configure Terraform to use a non-standard Docker daemon socket by setting the `DOCKER_HOST` environment variable or by assigning the `docker_host` Terrafrom variable. For example, if you are using Podman, you can set the `DOCKER_HOST` to point to the Podman socket:

```sh
export DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock
```

Make sure to replace the socket path with the correct path for your environment. This will direct Terraform to use the specified Docker daemon socket for all Docker-related operations.


If you use Docker Desktop on Windows, you need to enable the TCP socket to allow Terraform to communicate with Docker. Follow these steps:

1. Open Docker Desktop and go to the **Settings**.
1. Navigate to the [**General**](https://docs.docker.com/desktop/settings-and-maintenance/settings/#general) tab.
1. Enable the option **Expose daemon on tcp://localhost:2375 without TLS**.
1. Apply the changes and restart Docker Desktop if necessary.

After enabling the TCP socket, set the `DOCKER_HOST` environment variable to point to the TCP socket:

```powershell
$env:DOCKER_HOST="tcp://localhost:2375"
```

This configuration will allow Terraform to interact with Docker Desktop on Windows.

### What else should I check if I run Docker Desktop?

If you run Docker Desktop, ensure the following:

1. **Use containerd for pulling and storing images**: Turn off the containerd image store. It should bring new features like faster container startup performance by lazy-pulling images, and the ability to run Wasm applications with Docker, but unfortunately `docker` Terraform provider [doesn't support it](https://github.com/kreuzwerker/terraform-provider-docker/issues/534#issuecomment-1483798237). You can check this in Docker Desktop settings under the [**General**](https://docs.docker.com/desktop/settings-and-maintenance/settings/#general) tab.

1. **WSL 2 Backend:** Verify that Docker Desktop is configured to use the WSL 2 backend for better performance and compatibility. You can check this in Docker Desktop settings under the [**General**](https://docs.docker.com/desktop/settings-and-maintenance/settings/#general) tab.

1. **Resource Allocation:** Adjust the resource allocation for Docker Desktop to make sure it has enough CPU and memory to run your containers efficiently. This can be configured in the [**Resources**](https://docs.docker.com/desktop/settings-and-maintenance/settings/#resources) tab of Docker Desktop settings.

1. **Network Configuration:** If you encounter network issues, check the network settings in Docker Desktop. Make sure that the network mode is correctly configured and that there are no conflicts with other network adapters.

1. **Windows Firewall:** Make sure that Windows Firewall or any other security software is not blocking Docker's network traffic. You may need to create exceptions for Docker.

By checking these settings, you can ensure that Docker Desktop runs smoothly on your machine.

### What if I use Podman as a container tool?

If you use Podman as a container tool, you can configure Terraform to use it by [setting](https://developer.hashicorp.com/terraform/language/values/variables#assigning-values-to-root-module-variables) the `container_tool` Terraform variable to `podman`. For instance:

```sh
export TF_VAR_container_tool=podman
```

This will ensure that Terraform uses `podman` binary for all container-related operations.
