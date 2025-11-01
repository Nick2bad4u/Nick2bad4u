# PowerShell script to move files older than 60 days from source to destination with logging and progress

$source = "C:\Users\Nick\Dropbox\PC (2)\Downloads"
$destination = "C:\Users\Nick\Dropbox\Random Save\Chrome Downloads"
$logFile = "C:\Users\Nick\Dropbox\PC Tool Kit\MoveOldDownloads.log"

# Function to log messages
function Write-Log {
    param([string]$message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "$timestamp - $message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

# Start logging
Write-Log "Starting script to move old downloads."

# Ensure destination folder exists
if (!(Test-Path $destination)) {
    Write-Log "Destination folder does not exist. Creating: $destination"
    New-Item -ItemType Directory -Path $destination
}
else {
    Write-Log "Destination folder exists: $destination"
}

# Get files modified more than 60 days ago
$oldFiles = Get-ChildItem -Path $source -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-60) }
$fileCount = $oldFiles.Count

if ($fileCount -eq 0) {
    Write-Log "No files older than 60 days found in $source."
}
else {
    Write-Log "Found $fileCount files older than 60 days. Starting to move them."

    $progress = 0
    foreach ($file in $oldFiles) {
        $progress++
        Write-Progress -Activity "Moving old downloads" -Status "Moving file $progress of $fileCount" -PercentComplete (($progress / $fileCount) * 100)
        Write-Log "Moving file: $($file.FullName) to $destination"
        try {
            Move-Item -Path $file.FullName -Destination $destination -ErrorAction Stop
            Write-Log "Successfully moved: $($file.Name)"
        }
        catch {
            Write-Log "Error moving file $($file.FullName): $($_.Exception.Message)"
        }
    }
    Write-Progress -Activity "Moving old downloads" -Completed
}

Write-Log "Script completed."
