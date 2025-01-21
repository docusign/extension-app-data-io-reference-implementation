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
