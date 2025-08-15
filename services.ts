src/staticwebapp.config.json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}


----



  "assets": [
  "src/favicon.ico",
  "src/assets",
  "src/staticwebapp.config.json"
]


--- actions

name: Azure Static Web Apps - Angular 20

on:
  push:
    branches: [ main ]
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [ main ]

permissions:
  contents: read
  pull-requests: write
  id-token: write

env:
  # If your Angular app is in a subfolder, change this from "." to that folder (e.g., apps/web)
  APP_SOURCE_LOCATION: "."
  # Angular 17+ outputs to dist/<project-name>/browser
  BUILD_OUTPUT_LOCATION: "dist/<project-name>/browser"

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    name: Build and Deploy

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node.js 20 (Angular 20 requirement)
        uses: actions/setup-node@v4
        with:
          node-version: '20.19.0'
          cache: 'npm'
          cache-dependency-path: |
            ${{ env.APP_SOURCE_LOCATION }}/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.APP_SOURCE_LOCATION }}
        run: npm ci

      - name: Build (production)
        working-directory: ${{ env.APP_SOURCE_LOCATION }}
        run: npm run build -- --configuration=production

      # ---- Deploy (main branch) OR preview (PR) ----
      - name: Deploy to Azure Static Web Apps
        if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: upload
          # We deploy the compiled output directly, so point app_location at the built folder
          app_location: ${{ env.APP_SOURCE_LOCATION }}/${{ env.BUILD_OUTPUT_LOCATION }}
          output_location: ""            # not used when skip_app_build = true
          skip_app_build: true

      # Clean up preview environment when a PR is closed
      - name: Close Pull Request Preview
        if: github.event_name == 'pull_request' && github.event.action == 'closed'
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: close
