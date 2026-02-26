$root = "c:\Users\CainAble\Documents\RHC Site"
$files = Get-ChildItem $root -Recurse -Include "*.html","*.js" | Where-Object { $_.FullName -notlike "*\compressed\*" }

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    $changed = $false
    $newLines = $lines | ForEach-Object {
        $line = $_
        $orig = $line
        $line = $line -replace 'Assets/', 'assets/'
        $line = $line -replace 'Untitled design', 'untitled design'
        $line = $line -replace 'Cement_Mixer_Video_Generated', 'cement_mixer_video_generated'
        $line = $line -replace 'Server_Rack_On_Concrete_Slab', 'server_rack_on_concrete_slab'
        if ($line -ne $orig) { $changed = $true }
        $line
    }
    if ($changed) {
        Set-Content $file.FullName $newLines
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "Done."
