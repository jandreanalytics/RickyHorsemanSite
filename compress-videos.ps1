# Compress all MP4/MOV files in assets/ to under 50MB for GitHub
$inputDir = "c:\Users\CainAble\Documents\RHC Site\assets"
$outputDir = "c:\Users\CainAble\Documents\RHC Site\assets\compressed"

if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$videos = Get-ChildItem -Path $inputDir -Recurse -Include "*.mp4","*.mov"

foreach ($video in $videos) {
    $relativePath = $video.FullName.Substring($inputDir.Length + 1)
    $outputPath = Join-Path $outputDir $relativePath
    $outputFolder = Split-Path $outputPath -Parent

    if (!(Test-Path $outputFolder)) {
        New-Item -ItemType Directory -Path $outputFolder | Out-Null
    }

    $outputMp4 = [System.IO.Path]::ChangeExtension($outputPath, ".mp4")

    Write-Host "Compressing: $($video.Name) -> $outputMp4"

    ffmpeg -y -i "$($video.FullName)" `
        -c:v libx264 -crf 28 -preset fast `
        -vf "scale=1920:-2" `
        -c:a aac -b:a 96k `
        -movflags +faststart `
        "$outputMp4" 2>&1

    $size = (Get-Item $outputMp4).Length / 1MB
    Write-Host "  Output size: $([math]::Round($size, 2)) MB"
}

Write-Host ""
Write-Host "Done. Compressed files are in: $outputDir"
