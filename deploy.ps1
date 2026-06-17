# Build, sync to S3, and invalidate CloudFront in one step.
# Usage:  npm run deploy
#
# IMPORTANT: the westbrookdataviz.org bucket also hosts other apps in their own
# subdirectories (pit-data/, events/, set-list-drums/, etc.). This script must
# NEVER delete at the bucket root, or it would wipe those apps. Instead, the
# orphan-cleaning `--delete` is scoped to the four hashed-asset prefixes that
# ONLY the landing site owns (_file, _import, _node, _observablehq). Root files
# are uploaded without --delete, so nothing outside the landing site is removed.
$ErrorActionPreference = "Stop"

$BUCKET = "westbrookdataviz.org"
$DIST   = "dist"
# Prefixes owned exclusively by the landing-site build (safe to --delete within).
$HASHED = @("_file", "_import", "_node", "_observablehq")

# Check AWS CLI is available.
try { $null = Get-Command aws -ErrorAction Stop }
catch { Write-Host "AWS CLI is not installed. Install it first."; exit 1 }

# Always build fresh so we never deploy a stale dist/.
Write-Host "Building site..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed; aborting deploy."; exit 1 }

# Safety guard: never sync an empty/missing build over the live bucket.
if (-not (Test-Path "$DIST/index.html")) {
    Write-Host "ERROR: $DIST/index.html not found; aborting before sync."
    exit 1
}

# 1. Content-hashed assets — cache forever, and prune old hashes within each
#    landing-site prefix (scoped --delete keeps app subdirectories untouched).
foreach ($prefix in $HASHED) {
    if (Test-Path "$DIST/$prefix") {
        Write-Host "`nSyncing $prefix/ (immutable, pruning old hashes)..."
        aws s3 sync "$DIST/$prefix" "s3://$BUCKET/$prefix" `
            --delete `
            --cache-control "public,max-age=31536000,immutable"
    }
}

# 2. Root pages and assets (HTML, images, robots, sitemap) — short cache.
#    No --delete: this only adds/updates landing-site root files and never
#    removes anything, so the app subdirectories are safe.
Write-Host "`nSyncing root pages and assets..."
$excludes = @()
foreach ($prefix in $HASHED) { $excludes += "--exclude"; $excludes += "$prefix/*" }
aws s3 sync $DIST "s3://$BUCKET/" `
    @excludes `
    --cache-control "public,max-age=300,must-revalidate"

# 3. Invalidate the CloudFront cache (reuses the existing script).
Write-Host "`nInvalidating CloudFront..."
& "$PSScriptRoot\invalidate.ps1"

Write-Host "`nDeploy complete."
