# Compress all MP4/MOV files in assets/, replace originals, then push to GitHub
$assetsDir = "c:\Users\CainAble\Documents\RHC Site\assets"
$repoDir = "c:\Users\CainAble\Documents\RHC Site"

$videos = Get-ChildItem -Path $assetsDir -Recurse -Include "*.mp4","*.mov" | Where-Object { $_.DirectoryName -notlike "*\compressed*" }

foreach ($video in $videos) {
    $tempOutput = $video.FullName + ".compressed.mp4"

    Write-Host "Compressing: $($video.Name)"

    ffmpeg -y -i "$($video.FullName)" `
        -c:v h264_nvenc -rc vbr -cq 28 -preset p4 `
        -vf "scale=1920:-2" `
        -c:a aac -b:a 96k `
        -movflags +faststart `
        "$tempOutput" 2>&1

    if ($LASTEXITCODE -eq 0) {
        $originalSize = [math]::Round($video.Length / 1MB, 2)
        $newSize = [math]::Round((Get-Item $tempOutput).Length / 1MB, 2)
        Write-Host "  $originalSize MB -> $newSize MB"

        # Replace original with compressed version (always as .mp4)
        $finalPath = [System.IO.Path]::ChangeExtension($video.FullName, ".mp4")
        Remove-Item $video.FullName -Force
        Rename-Item $tempOutput $finalPath
        Write-Host "  Replaced: $finalPath"
    } else {
        Write-Host "  ERROR compressing $($video.Name), skipping."
        if (Test-Path $tempOutput) { Remove-Item $tempOutput -Force }
    }
}

Write-Host ""
Write-Host "All videos compressed. Updating .gitignore and pushing to GitHub..."

# Update .gitignore to allow videos now that they are small
$gitignorePath = "$repoDir\.gitignore"
$gitignoreContent = Get-Content $gitignorePath -Raw
$gitignoreContent = $gitignoreContent -replace "# Video assets.*\n.*\n.*\n.*\n", ""
Set-Content $gitignorePath $gitignoreContent.Trim()

# Stage, commit, and push
git -C $repoDir add .
git -C $repoDir commit -m "Add compressed video assets"
git -C $repoDir push origin master

Write-Host "Done. Videos replaced and pushed to GitHub."
