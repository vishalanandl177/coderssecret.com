Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "out\podcasts\art"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$W = 3000
$H = 3000

function Color-Hex($hex, [int]$alpha = 255) {
  $h = $hex.TrimStart("#")
  return [System.Drawing.Color]::FromArgb(
    $alpha,
    [Convert]::ToInt32($h.Substring(0, 2), 16),
    [Convert]::ToInt32($h.Substring(2, 2), 16),
    [Convert]::ToInt32($h.Substring(4, 2), 16)
  )
}

function New-RoundRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

function Draw-Background($g, $c1, $c2, $c3) {
  $rect = New-Object System.Drawing.Rectangle 0, 0, $W, $H
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, (Color-Hex $c1), (Color-Hex $c2), 45
  $g.FillRectangle($brush, $rect)
  $brush.Dispose()

  $rad1 = New-Object System.Drawing.Drawing2D.GraphicsPath
  $rad1.AddEllipse(-600, -380, 1700, 1700)
  $b1 = New-Object System.Drawing.SolidBrush (Color-Hex $c3 95)
  $g.FillPath($b1, $rad1)
  $b1.Dispose()
  $rad1.Dispose()

  $rad2 = New-Object System.Drawing.Drawing2D.GraphicsPath
  $rad2.AddEllipse(1750, 1900, 1450, 1350)
  $b2 = New-Object System.Drawing.SolidBrush (Color-Hex "#ffffff" 34)
  $g.FillPath($b2, $rad2)
  $b2.Dispose()
  $rad2.Dispose()

  $pen = New-Object System.Drawing.Pen (Color-Hex "#ffffff" 28), 2
  for ($i = -800; $i -lt 3800; $i += 180) {
    $g.DrawLine($pen, $i, 0, $i + 1450, 3000)
  }
  $pen.Dispose()
}

function Draw-Brand($g, $accent) {
  $font = New-Object System.Drawing.Font "Segoe UI", 62, ([System.Drawing.FontStyle]::Bold)
  $brush = New-Object System.Drawing.SolidBrush (Color-Hex "#ffffff" 220)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::Near
  $g.DrawString("CODERSSECRET PODCAST", $font, $brush, 220, 205, $fmt)
  $font.Dispose()
  $brush.Dispose()

  $pill = New-RoundRect 220 292 560 88 44
  $pb = New-Object System.Drawing.SolidBrush (Color-Hex $accent 210)
  $g.FillPath($pb, $pill)
  $pb.Dispose()
  $small = New-Object System.Drawing.Font "Segoe UI", 38, ([System.Drawing.FontStyle]::Bold)
  $sb = New-Object System.Drawing.SolidBrush (Color-Hex "#08111f")
  $g.DrawString("DEVELOPER DEEP DIVE", $small, $sb, 258, 314)
  $small.Dispose()
  $sb.Dispose()
  $pill.Dispose()
}

function Draw-Logo($g, $x, $y, $size) {
  $rect = New-Object System.Drawing.RectangleF $x, $y, $size, $size
  $path = New-RoundRect $x $y $size $size ($size * 0.23)
  $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, (Color-Hex "#7c3aed"), (Color-Hex "#3b82f6"), 45
  $g.FillPath($grad, $path)
  $grad.Dispose()

  $pen = New-Object System.Drawing.Pen (Color-Hex "#ffffff" 235), ($size * 0.065)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $g.DrawLines($pen, @(
    (New-Object System.Drawing.PointF ($x + $size * 0.35), ($y + $size * 0.30)),
    (New-Object System.Drawing.PointF ($x + $size * 0.18), ($y + $size * 0.50)),
    (New-Object System.Drawing.PointF ($x + $size * 0.35), ($y + $size * 0.70))
  ))
  $g.DrawLines($pen, @(
    (New-Object System.Drawing.PointF ($x + $size * 0.65), ($y + $size * 0.30)),
    (New-Object System.Drawing.PointF ($x + $size * 0.82), ($y + $size * 0.50)),
    (New-Object System.Drawing.PointF ($x + $size * 0.65), ($y + $size * 0.70))
  ))
  $g.DrawLine($pen, ($x + $size * 0.58), ($y + $size * 0.25), ($x + $size * 0.42), ($y + $size * 0.75))
  $pen.Dispose()

  $font = New-Object System.Drawing.Font "Segoe UI", ($size * 0.15), ([System.Drawing.FontStyle]::Bold)
  $b = New-Object System.Drawing.SolidBrush (Color-Hex "#ffffff" 230)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::Center
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $csRect = New-Object System.Drawing.RectangleF $x, ($y + $size * 0.74), $size, ($size * 0.22)
  $g.DrawString("CS", $font, $b, $csRect, $fmt)
  $font.Dispose()
  $b.Dispose()
  $path.Dispose()
}

function Draw-Title($g, [string]$title, [float]$x, [float]$y, [float]$w, [float]$h, [int]$maxSize = 230) {
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::Near
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $fmt.Trimming = [System.Drawing.StringTrimming]::None
  $fmt.FormatFlags = 0

  $size = $maxSize
  do {
    $font = New-Object System.Drawing.Font "Segoe UI Black", $size, ([System.Drawing.FontStyle]::Bold)
    $measured = $g.MeasureString($title, $font, [int]$w, $fmt)
    if ($measured.Height -le $h -and $measured.Width -le ($w + 20)) { break }
    $font.Dispose()
    $size -= 6
  } while ($size -gt 96)

  $shadow = New-Object System.Drawing.SolidBrush (Color-Hex "#000000" 105)
  $white = New-Object System.Drawing.SolidBrush (Color-Hex "#ffffff")
  $rectShadow = New-Object System.Drawing.RectangleF ($x + 14), ($y + 18), $w, $h
  $rect = New-Object System.Drawing.RectangleF $x, $y, $w, $h
  $g.DrawString($title, $font, $shadow, $rectShadow, $fmt)
  $g.DrawString($title, $font, $white, $rect, $fmt)
  $shadow.Dispose()
  $white.Dispose()
  $font.Dispose()
}

function Draw-Subtitle($g, [string]$text, [float]$x, [float]$y, [float]$w, [string]$accent) {
  $font = New-Object System.Drawing.Font "Segoe UI", 64, ([System.Drawing.FontStyle]::Bold)
  $path = New-RoundRect $x $y $w 108 54
  $b = New-Object System.Drawing.SolidBrush (Color-Hex $accent 230)
  $g.FillPath($b, $path)
  $b.Dispose()
  $tb = New-Object System.Drawing.SolidBrush (Color-Hex "#06101f")
  $g.DrawString($text, $font, $tb, ($x + 42), ($y + 16))
  $tb.Dispose()
  $font.Dispose()
  $path.Dispose()
}

function Save-Art($name, $bg1, $bg2, $bg3, $accent, $title, $tag, [scriptblock]$drawIcon) {
  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  Draw-Background $g $bg1 $bg2 $bg3
  Draw-Brand $g $accent
  & $drawIcon $g $accent
  Draw-Subtitle $g $tag 220 2170 900 $accent
  Draw-Title $g $title 220 630 1840 1440 235
  Draw-Logo $g 2420 220 360

  $file = Join-Path $outDir $name
  $bmp.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  return $file
}

$files = @()

$files += Save-Art "why-your-claude-bill-is-bigger-than-your-prompt.png" "#101827" "#4c1d95" "#22d3ee" "#5eead4" "WHY YOUR CLAUDE BILL IS BIGGER THAN YOUR PROMPT" "AI COSTS" {
  param($g, $accent)
  $pen = New-Object System.Drawing.Pen (Color-Hex "#5eead4" 210), 18
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  for ($i = 0; $i -lt 5; $i++) {
    $x = 2070 + ($i * 80)
    $y = 1110 + ($i * 130)
    $r = New-Object System.Drawing.RectangleF $x, $y, 520, 130
    $b = New-Object System.Drawing.SolidBrush (Color-Hex "#0f172a" 145)
    $g.FillEllipse($b, $r)
    $b.Dispose()
    $g.DrawEllipse($pen, $r)
  }
  $font = New-Object System.Drawing.Font "Segoe UI Black", 300, ([System.Drawing.FontStyle]::Bold)
  $b2 = New-Object System.Drawing.SolidBrush (Color-Hex "#ffffff" 235)
  $g.DrawString("$", $font, $b2, 2200, 1100)
  $font.Dispose()
  $b2.Dispose()
  $pen.Dispose()
}

$files += Save-Art "oauth-is-not-authentication.png" "#06131f" "#0f766e" "#f59e0b" "#fbbf24" "OAUTH IS NOT AUTHENTICATION" "SECURITY" {
  param($g, $accent)
  $shield = New-Object System.Drawing.Drawing2D.GraphicsPath
  $shield.AddPolygon(@(
    (New-Object System.Drawing.PointF 2300, 770),
    (New-Object System.Drawing.PointF 2670, 920),
    (New-Object System.Drawing.PointF 2600, 1640),
    (New-Object System.Drawing.PointF 2300, 1900),
    (New-Object System.Drawing.PointF 2000, 1640),
    (New-Object System.Drawing.PointF 1930, 920)
  ))
  $b = New-Object System.Drawing.SolidBrush (Color-Hex "#0f172a" 145)
  $g.FillPath($b, $shield)
  $b.Dispose()
  $pen = New-Object System.Drawing.Pen (Color-Hex "#fbbf24" 230), 22
  $g.DrawPath($pen, $shield)
  $lockPen = New-Object System.Drawing.Pen (Color-Hex "#ffffff" 230), 34
  $g.DrawArc($lockPen, 2130, 1070, 340, 300, 200, 140)
  $body = New-RoundRect 2080 1240 440 360 52
  $bb = New-Object System.Drawing.SolidBrush (Color-Hex "#fbbf24" 235)
  $g.FillPath($bb, $body)
  $bb.Dispose()
  $font = New-Object System.Drawing.Font "Segoe UI Black", 112, ([System.Drawing.FontStyle]::Bold)
  $tb = New-Object System.Drawing.SolidBrush (Color-Hex "#082f49")
  $g.DrawString("ID", $font, $tb, 2210, 1365)
  $font.Dispose()
  $tb.Dispose()
  $pen.Dispose()
  $lockPen.Dispose()
  $body.Dispose()
  $shield.Dispose()
}

$files += Save-Art "delta-lake-vs-iceberg-table-format-war.png" "#07111f" "#14532d" "#38bdf8" "#86efac" "DELTA LAKE VS ICEBERG THE TABLE FORMAT WAR" "LAKEHOUSE" {
  param($g, $accent)
  $delta = New-Object System.Drawing.Drawing2D.GraphicsPath
  $delta.AddPolygon(@(
    (New-Object System.Drawing.PointF 2030, 1720),
    (New-Object System.Drawing.PointF 2290, 780),
    (New-Object System.Drawing.PointF 2580, 1720)
  ))
  $b = New-Object System.Drawing.SolidBrush (Color-Hex "#22c55e" 180)
  $g.FillPath($b, $delta)
  $b.Dispose()
  $pen = New-Object System.Drawing.Pen (Color-Hex "#ffffff" 210), 20
  $g.DrawPath($pen, $delta)
  $ice = New-Object System.Drawing.Drawing2D.GraphicsPath
  $ice.AddPolygon(@(
    (New-Object System.Drawing.PointF 1920, 1840),
    (New-Object System.Drawing.PointF 2150, 1320),
    (New-Object System.Drawing.PointF 2260, 1500),
    (New-Object System.Drawing.PointF 2400, 1120),
    (New-Object System.Drawing.PointF 2700, 1840)
  ))
  $ib = New-Object System.Drawing.SolidBrush (Color-Hex "#7dd3fc" 215)
  $g.FillPath($ib, $ice)
  $ib.Dispose()
  $g.DrawPath($pen, $ice)
  $font = New-Object System.Drawing.Font "Segoe UI Black", 150, ([System.Drawing.FontStyle]::Bold)
  $tb = New-Object System.Drawing.SolidBrush (Color-Hex "#ffffff")
  $g.DrawString("VS", $font, $tb, 2260, 1765)
  $font.Dispose()
  $tb.Dispose()
  $pen.Dispose()
  $delta.Dispose()
  $ice.Dispose()
}

$files += Save-Art "catalog-war-after-table-format-war.png" "#0b1020" "#6d28d9" "#f97316" "#fb923c" "THE CATALOG WAR AFTER THE TABLE FORMAT WAR" "METADATA" {
  param($g, $accent)
  $center = New-RoundRect 1990 1040 720 520 70
  $b = New-Object System.Drawing.SolidBrush (Color-Hex "#111827" 180)
  $g.FillPath($b, $center)
  $b.Dispose()
  $pen = New-Object System.Drawing.Pen (Color-Hex "#fb923c" 230), 18
  $g.DrawPath($pen, $center)
  $font = New-Object System.Drawing.Font "Segoe UI Black", 88, ([System.Drawing.FontStyle]::Bold)
  $tb = New-Object System.Drawing.SolidBrush (Color-Hex "#ffffff")
  $g.DrawString("CATALOG", $font, $tb, 2058, 1240)
  $nodePen = New-Object System.Drawing.Pen (Color-Hex "#ffffff" 150), 10
  $nodeBrush = New-Object System.Drawing.SolidBrush (Color-Hex "#fb923c" 220)
  $nodes = @(@(1970,760,"SPARK"),@(2640,800,"TRINO"),@(1940,1750,"FLINK"),@(2630,1770,"AI"))
  foreach ($n in $nodes) {
    $g.DrawLine($nodePen, 2350, 1300, $n[0] + 110, $n[1] + 70)
    $g.FillEllipse($nodeBrush, $n[0], $n[1], 220, 140)
    $g.DrawString($n[2], (New-Object System.Drawing.Font "Segoe UI", 35, ([System.Drawing.FontStyle]::Bold)), $tb, $n[0] + 36, $n[1] + 45)
  }
  $font.Dispose()
  $tb.Dispose()
  $pen.Dispose()
  $nodePen.Dispose()
  $nodeBrush.Dispose()
  $center.Dispose()
}

Write-Output ($files -join [Environment]::NewLine)
