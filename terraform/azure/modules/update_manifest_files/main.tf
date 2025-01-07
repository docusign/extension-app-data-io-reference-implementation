resource "null_resource" "update_json_files" {
  provisioner "local-exec" {
    command = <<-EOT
      manifest_files=$(ls ${var.manifests_folder_path} | grep -v backups)
      mkdir "${var.manifests_folder_path}/backups"
      for manifest_file in $manifest_files;
      do
        cp "${var.manifests_folder_path}/$manifest_file" "${var.manifests_folder_path}/backups/"
        case "$OSTYPE" in
          darwin*)
            sed -i '' "s|<PROXY_BASE_URL>|${var.web_app_url}|g" "${var.manifests_folder_path}/$manifest_file"
            sed -i '' "s|<CLIENT_ID>|${var.oauth_client_id}|g" "${var.manifests_folder_path}/$manifest_file"
            sed -i '' "s|<CLIENT_SECRET>|${var.oauth_client_secret}|g" "${var.manifests_folder_path}/$manifest_file"
            ;;
          *)
            sed -i "s|<PROXY_BASE_URL>|${var.web_app_url}|g" "${var.manifests_folder_path}/$manifest_file"
            sed -i "s|<CLIENT_ID>|${var.oauth_client_id}|g" "${var.manifests_folder_path}/$manifest_file"
            sed -i "s|<CLIENT_SECRET>|${var.oauth_client_secret}|g" "${var.manifests_folder_path}/$manifest_file"
            ;;
        esac
      done
    EOT
  }
}
