param(
  [string]$Before = ".\perf\results\before.json",
  [string]$After = ".\perf\results\after.json",
  [string]$Out = ".\perf\results\report.md"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-MetricValue {
  param(
    [Parameter(Mandatory = $true)] $Json,
    [Parameter(Mandatory = $true)] [string] $MetricName,
    [Parameter(Mandatory = $true)] [string] $StatName
  )

  $metricProp = $Json.metrics.PSObject.Properties[$MetricName]
  if ($null -eq $metricProp) { return $null }
  $metric = $metricProp.Value
  if ($null -eq $metric) { return $null }

  $valuesProp = $metric.PSObject.Properties["values"]
  $values = if ($null -ne $valuesProp) { $valuesProp.Value } else { $null }
  if ($null -ne $values) {
    $statProp = $values.PSObject.Properties[$StatName]
    if ($null -ne $statProp) { return $statProp.Value }
  }

  # k6 summary-export can also store stats directly under metric.
  $directProp = $metric.PSObject.Properties[$StatName]
  if ($null -ne $directProp) { return $directProp.Value }
  return $null
}

function Format-Number {
  param([double]$Value, [int]$Digits = 2)
  return [Math]::Round($Value, $Digits).ToString("F$Digits")
}

function Calc-DeltaPercent {
  param([double]$BeforeValue, [double]$AfterValue)
  if ($BeforeValue -eq 0) { return "N/A" }
  $delta = (($AfterValue - $BeforeValue) / $BeforeValue) * 100.0
  return "{0:+0.00;-0.00;0.00}%" -f $delta
}

$beforeJson = Get-Content $Before -Raw | ConvertFrom-Json
$afterJson = Get-Content $After -Raw | ConvertFrom-Json

$rows = @(
  @{
    Name = "Latency p95 (ms)"
    Before = [double](Get-MetricValue -Json $beforeJson -MetricName "http_req_duration" -StatName "p(95)")
    After = [double](Get-MetricValue -Json $afterJson -MetricName "http_req_duration" -StatName "p(95)")
    Better = "lower"
  },
  @{
    Name = "Latency avg (ms)"
    Before = [double](Get-MetricValue -Json $beforeJson -MetricName "http_req_duration" -StatName "avg")
    After = [double](Get-MetricValue -Json $afterJson -MetricName "http_req_duration" -StatName "avg")
    Better = "lower"
  },
  @{
    Name = "Error rate (%)"
    Before = [double](Get-MetricValue -Json $beforeJson -MetricName "http_req_failed" -StatName "value") * 100.0
    After = [double](Get-MetricValue -Json $afterJson -MetricName "http_req_failed" -StatName "value") * 100.0
    Better = "lower"
  },
  @{
    Name = "Request rate (req/s)"
    Before = [double](Get-MetricValue -Json $beforeJson -MetricName "http_reqs" -StatName "rate")
    After = [double](Get-MetricValue -Json $afterJson -MetricName "http_reqs" -StatName "rate")
    Better = "higher"
  }
)

$lines = @()
$lines += "# Redis Cache Performance Report"
$lines += ""
$lines += "| Metric | Before (cache off) | After (cache on) | Delta |"
$lines += "|---|---:|---:|---:|"

foreach ($row in $rows) {
  $beforeVal = [double]$row.Before
  $afterVal = [double]$row.After
  $delta = Calc-DeltaPercent -BeforeValue $beforeVal -AfterValue $afterVal

  if ($row.Better -eq "lower") {
    $improved = $afterVal -lt $beforeVal
    $delta = if ($improved) { "$delta (improved)" } else { "$delta (regressed)" }
  } else {
    $improved = $afterVal -gt $beforeVal
    $delta = if ($improved) { "$delta (improved)" } else { "$delta (regressed)" }
  }

  $lines += "| $($row.Name) | $(Format-Number -Value $beforeVal) | $(Format-Number -Value $afterVal) | $delta |"
}

$lines += ""
$lines += "## Files"
$lines += "- Before: ``$Before``"
$lines += "- After: ``$After``"

$outDir = Split-Path -Path $Out -Parent
if (-not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir | Out-Null
}

$lines -join [Environment]::NewLine | Set-Content -Path $Out -Encoding UTF8
Write-Host "Report generated: $Out"
