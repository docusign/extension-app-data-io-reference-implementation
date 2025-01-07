## Prerequisites
Ensure the following tools are installed on your system:
- **Azure CLI**: Installation instructions can be found [here](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).
- **Terraform v1.10.3**: Installation instructions can be found [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).
- **Docker desktop**: https://www.docker.com/products/docker-desktop/ and select `use WSL instead of Hyper-V`
- **jq**: A command-line JSON processor.
- **nodejs**:

**Note**: You must have the `Owner` role in your Azure subscription.

## Authenticate with Azure and Select Your Subscription
To authenticate Terraform with Azure, run `az login` command and select the subscription you want to use.

## Deploy the Application in Azure
Go to the `terraform/azure` directory and execute the following commands:
- `terraform init` - Initializes the working directory and installs plugins for the required providers.
- `terraform plan` - Creates an execution plan, allowing you to preview the changes Terraform will make.
- `terraform apply` - Executes the proposed plan to create, update, or destroy infrastructure.

## Verify the Application is Ready
Run the following command:
- `terraform output web_app_url`

Open the provided URL in a web browser to confirm the application is functioning as expected.


Warning

Warning! If you're not using an account that qualifies under the AWS free tier, you may be charged to run these examples. The most you should be charged should only be a few dollars, but we're not responsible for any charges that may incur.


az login --use-device-code
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code GSU93LXP8 to authenticate.

az account show


Here are a few steps you can try to resolve this issue:


Disable containerd for pulling and storing images:
•  Open Docker Desktop settings.
•  Navigate to the "Experimental Features" section.
•  Disable the "Use containerd for pulling and storing images" optionhttps://github.com/kreuzwerker/terraform-provider-docker/issues/534.
