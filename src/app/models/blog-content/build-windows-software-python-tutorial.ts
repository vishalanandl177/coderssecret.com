export const CONTENT = `
      <p>Windows still powers 70%+ of desktop computers worldwide. Whether you want to build a productivity tool for yourself, ship software to millions of users, or automate tasks at your company — knowing how to build Windows software is a superpower. This guide shows you the <strong>practical options</strong>, when to use each, and includes a complete Python project you can build in 30 minutes.</p>

      <h2>Language Options for Windows Development</h2>
      <p>Windows supports almost every programming language ever made. Here are the practical choices in 2026:</p>

      <!-- Language Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Programming Languages for Windows Apps</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:550px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#3b82f6;color:#fff;border-radius:0.4rem 0 0 0">Language</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">Learning Curve</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">Performance</th>
                <th style="text-align:left;padding:0.6rem;background:#3b82f6;color:#fff;border-radius:0 0.4rem 0 0">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#22c55e;font-weight:700">Python</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Easy</td><td style="padding:0.5rem;text-align:center;color:#f97316">Good</td><td style="padding:0.5rem">Scripts, automation, GUI tools, data apps</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#7c3aed;font-weight:700">C# (.NET)</td><td style="padding:0.5rem;text-align:center">Medium</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Excellent</td><td style="padding:0.5rem">Native Windows apps, enterprise software, WPF/WinUI</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#ef4444;font-weight:700">C++</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Hard</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Best</td><td style="padding:0.5rem">Games, system software, performance-critical apps</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#f97316;font-weight:700">Rust</td><td style="padding:0.5rem;text-align:center;color:#f97316">Hard</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Best</td><td style="padding:0.5rem">Safe systems programming, CLI tools, Tauri apps</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#3b82f6;font-weight:700">Electron (JS/TS)</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Easy</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Heavy</td><td style="padding:0.5rem">Cross-platform apps (VS Code, Slack, Discord)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#a855f7;font-weight:700">Tauri (Rust + JS)</td><td style="padding:0.5rem;text-align:center">Medium</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Great</td><td style="padding:0.5rem">Lightweight Electron alternative (10x smaller)</td></tr>
              <tr><td style="padding:0.5rem;color:#22c55e;font-weight:700">PowerShell</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Easy</td><td style="padding:0.5rem;text-align:center;color:#f97316">OK</td><td style="padding:0.5rem">Automation scripts, admin tasks, WMI queries</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Decision Guide</h2>

      <!-- Decision Tree -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Which Language Should You Use?</div>
        <div class="dtree">
          <div class="dtree-node question">What are you building?</div>
          <div class="dtree-branches">
            <div class="dtree-branch">
              <div class="dtree-label">Quick tool or automation?</div>
              <div class="dtree-connector green"></div>
              <div class="dtree-answer both">Python<span class="dtree-answer-sub">Fastest to build</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Native Windows app, rich UI?</div>
              <div class="dtree-connector blue"></div>
              <div class="dtree-answer oidc">C# + WinUI 3<span class="dtree-answer-sub">Microsoft's official stack</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Cross-platform desktop app?</div>
              <div class="dtree-connector orange"></div>
              <div class="dtree-answer saml">Tauri or Electron<span class="dtree-answer-sub">Web tech + native</span></div>
            </div>
          </div>
        </div>
      </div>

      <h2>Hands-On Project: File Organizer (Python)</h2>
      <p>Let's build a real Windows app — a <strong>File Organizer</strong> with a GUI that sorts files into folders by type. We'll use <code>tkinter</code> (built into Python, no extra install) for the GUI and then package it as a standalone <code>.exe</code> using PyInstaller.</p>

      <!-- Project Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">What We'll Build</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F40D;</span>Python code<span class="pipeline-step-sub">Logic + GUI</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#a855f7;--i:1"><span class="pipeline-step-icon">&#x1F4E6;</span>PyInstaller<span class="pipeline-step-sub">Bundle</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x1F4BB;</span>.exe file<span class="pipeline-step-sub">Single file</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x1F680;</span>Inno Setup<span class="pipeline-step-sub">Installer</span></div>
        </div>
      </div>

      <h2>Step 1: Set Up Your Environment</h2>
      <pre><code># 1. Install Python 3.12+ from python.org
#    IMPORTANT: Check "Add python.exe to PATH" during installation!

# 2. Verify installation
python --version
# Python 3.12.0

# 3. Create a project folder
mkdir FileOrganizer
cd FileOrganizer

# 4. Create a virtual environment (isolates dependencies)
python -m venv venv
venv\\Scripts\\activate

# 5. Install required packages
pip install pyinstaller pillow</code></pre>

      <h2>Step 2: Build the File Organizer</h2>
      <p>Create <code>organizer.py</code> with the complete application:</p>
      <pre><code>"""
File Organizer — a Windows GUI app that sorts files by type.
"""
import os
import shutil
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from pathlib import Path

# File type categories
CATEGORIES = {
    "Images":    [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
    "Documents": [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt"],
    "Videos":    [".mp4", ".avi", ".mkv", ".mov", ".wmv", ".flv"],
    "Audio":     [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"],
    "Archives":  [".zip", ".rar", ".7z", ".tar", ".gz"],
    "Code":      [".py", ".js", ".ts", ".html", ".css", ".java", ".cpp"],
    "Spreadsheets": [".xls", ".xlsx", ".csv", ".ods"],
    "Installers":   [".exe", ".msi", ".dmg"],
}

def get_category(filename: str) -> str:
    """Return the category name for a file based on its extension."""
    ext = Path(filename).suffix.lower()
    for category, extensions in CATEGORIES.items():
        if ext in extensions:
            return category
    return "Others"

def organize_folder(folder: Path, progress_callback=None) -> dict:
    """Move files in folder into subfolders by category. Returns stats."""
    stats = {cat: 0 for cat in CATEGORIES}
    stats["Others"] = 0

    files = [f for f in folder.iterdir() if f.is_file()]
    total = len(files)

    for i, file in enumerate(files, 1):
        category = get_category(file.name)
        dest_folder = folder / category
        dest_folder.mkdir(exist_ok=True)

        try:
            shutil.move(str(file), str(dest_folder / file.name))
            stats[category] += 1
        except Exception as e:
            print(f"Error moving {file.name}: {e}")

        if progress_callback:
            progress_callback(i, total)

    return stats


class FileOrganizerApp:
    def __init__(self, root):
        self.root = root
        root.title("File Organizer")
        root.geometry("520x400")
        root.configure(bg="#f0f0f0")

        # Title
        title = tk.Label(root, text="&#x1F4C1; File Organizer",
                        font=("Segoe UI", 20, "bold"), bg="#f0f0f0")
        title.pack(pady=20)

        subtitle = tk.Label(root, text="Sort files into folders by type",
                           font=("Segoe UI", 10), fg="#666", bg="#f0f0f0")
        subtitle.pack()

        # Folder selection
        self.folder_var = tk.StringVar(value="No folder selected")
        folder_frame = tk.Frame(root, bg="#f0f0f0")
        folder_frame.pack(pady=20, padx=30, fill="x")

        tk.Label(folder_frame, textvariable=self.folder_var,
                font=("Segoe UI", 9), bg="white", fg="#333",
                relief="solid", bd=1, anchor="w", padx=10, pady=8).pack(fill="x")

        # Buttons
        btn_frame = tk.Frame(root, bg="#f0f0f0")
        btn_frame.pack(pady=10)

        tk.Button(btn_frame, text="Choose Folder", command=self.choose_folder,
                 font=("Segoe UI", 10), bg="#0078d4", fg="white",
                 padx=20, pady=8, bd=0, cursor="hand2").pack(side="left", padx=5)

        self.organize_btn = tk.Button(btn_frame, text="Organize Files",
                                      command=self.organize, state="disabled",
                                      font=("Segoe UI", 10, "bold"),
                                      bg="#107c10", fg="white",
                                      padx=20, pady=8, bd=0, cursor="hand2")
        self.organize_btn.pack(side="left", padx=5)

        # Progress bar
        self.progress = ttk.Progressbar(root, length=400, mode="determinate")
        self.progress.pack(pady=15)

        # Status
        self.status = tk.Label(root, text="Select a folder to begin",
                              font=("Segoe UI", 9), fg="#666", bg="#f0f0f0")
        self.status.pack()

        self.selected_folder = None

    def choose_folder(self):
        folder = filedialog.askdirectory(title="Select folder to organize")
        if folder:
            self.selected_folder = Path(folder)
            self.folder_var.set(folder)
            self.organize_btn.config(state="normal")
            file_count = sum(1 for _ in self.selected_folder.iterdir()
                           if _.is_file())
            self.status.config(text=f"Ready to organize {file_count} files")

    def update_progress(self, current, total):
        percent = (current / total) * 100
        self.progress["value"] = percent
        self.status.config(text=f"Processing {current} / {total} files...")
        self.root.update_idletasks()

    def organize(self):
        if not self.selected_folder:
            return

        result = messagebox.askyesno(
            "Confirm",
            f"Organize all files in:\\n{self.selected_folder}?"
        )
        if not result:
            return

        try:
            stats = organize_folder(self.selected_folder, self.update_progress)

            # Show results
            msg = "Done! Files organized:\\n\\n"
            for category, count in stats.items():
                if count > 0:
                    msg += f"  {category}: {count} files\\n"
            messagebox.showinfo("Success", msg)
            self.status.config(text="Organization complete! &#x2705;")
            self.progress["value"] = 0
        except Exception as e:
            messagebox.showerror("Error", f"Failed: {e}")


if __name__ == "__main__":
    root = tk.Tk()
    app = FileOrganizerApp(root)
    root.mainloop()</code></pre>

      <h2>Step 3: Run Your App</h2>
      <pre><code># Activate the virtual environment (if not already)
venv\\Scripts\\activate

# Run the app
python organizer.py

# A window opens! Click "Choose Folder", select a messy folder,
# click "Organize Files" — all files get sorted into subfolders by type.</code></pre>

      <h2>Step 4: Package as a Standalone .exe</h2>
      <p>Your Python script requires Python installed on the user's machine. Let's package it as a <strong>single .exe file</strong> that works on any Windows machine without Python:</p>
      <pre><code># PyInstaller bundles your script + Python + dependencies into one .exe
pyinstaller --onefile --windowed --name "FileOrganizer" organizer.py

# Flags explained:
# --onefile    : Single .exe (not a folder of files)
# --windowed   : No console window (GUI apps only)
# --name       : Output file name
# --icon=app.ico : Custom icon (optional)

# After ~30 seconds, you'll find:
# dist\\FileOrganizer.exe  &#x2190; Your shippable Windows app!

# The .exe is ~15 MB and runs on ANY Windows 10/11 machine
# No Python needed, no dependencies to install</code></pre>

      <h2>Step 5: Create a Professional Installer</h2>
      <p>A .exe is good, but a real Windows app needs an installer (MSI or setup .exe). Use <strong>Inno Setup</strong> — the free, industry-standard Windows installer builder.</p>
      <pre><code># 1. Download Inno Setup: https://jrsoftware.org/isdl.php

# 2. Create installer.iss:
[Setup]
AppName=File Organizer
AppVersion=1.0
DefaultDirName={autopf}\\FileOrganizer
DefaultGroupName=File Organizer
UninstallDisplayIcon={app}\\FileOrganizer.exe
OutputDir=.
OutputBaseFilename=FileOrganizer-Setup
Compression=lzma2
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64

[Files]
Source: "dist\\FileOrganizer.exe"; DestDir: "{app}"

[Icons]
Name: "{group}\\File Organizer"; Filename: "{app}\\FileOrganizer.exe"
Name: "{autodesktop}\\File Organizer"; Filename: "{app}\\FileOrganizer.exe"

[Run]
Filename: "{app}\\FileOrganizer.exe"; Description: "Launch File Organizer"; Flags: nowait postinstall skipifsilent

# 3. Compile: open installer.iss in Inno Setup, click "Build"
# Output: FileOrganizer-Setup.exe (the installer users will download)</code></pre>

      <h2>Step 6: Code Signing (Optional but Recommended)</h2>
      <p>Without code signing, Windows SmartScreen will scare your users with "Unrecognized publisher" warnings. Code signing proves the app is from you.</p>
      <pre><code># Buy a code signing certificate (\\$50-\\$300/year):
# - DigiCert, Sectigo, SSL.com, Certera

# Sign your .exe using signtool (comes with Windows SDK):
signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a FileOrganizer.exe

# Verify signature:
signtool verify /pa /v FileOrganizer.exe

# Signing an installer is even more important than signing the .exe.
# Users trust signed installers; unsigned ones trigger scary warnings.</code></pre>

      <h2>Python GUI Frameworks: Other Options</h2>
      <pre><code># tkinter (we used this)
# &#x2713; Built into Python, no install
# &#x2717; Dated look, limited widgets
# Best for: quick internal tools, simple apps

# PyQt6 / PySide6
# pip install PyQt6
# &#x2713; Professional look, rich widgets, Qt Designer for visual editing
# &#x2717; Large install (~50 MB), commercial license for PyQt
# Best for: polished commercial applications

# CustomTkinter
# pip install customtkinter
# &#x2713; Modern dark/light mode, looks great out of the box
# &#x2717; Less mature than Qt
# Best for: modern-looking apps without Qt complexity

# Flet (Flutter-based)
# pip install flet
# &#x2713; Beautiful Material Design, cross-platform, easy to build
# &#x2717; Requires Flet runtime
# Best for: modern UIs with less code

# pywebview
# pip install pywebview
# &#x2713; Use HTML/CSS/JS for UI, native Python backend
# &#x2717; Need to write web + Python
# Best for: React/Vue devs wanting native desktop feel</code></pre>

      <h2>Windows-Specific APIs You Should Know</h2>
      <pre><code># 1. Windows Registry access
import winreg

# Read installed programs
key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,
    r"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall")
# Enumerate subkeys for installed programs

# 2. System notifications (Windows toast)
# pip install winotify
from winotify import Notification

toast = Notification(
    app_id="File Organizer",
    title="Done!",
    msg="Organized 47 files",
    icon=r"C:\\path\\to\\icon.ico",
)
toast.show()

# 3. Autostart on boot (via registry)
import winreg
key = winreg.OpenKey(
    winreg.HKEY_CURRENT_USER,
    r"Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    0, winreg.KEY_SET_VALUE,
)
winreg.SetValueEx(key, "MyApp", 0, winreg.REG_SZ,
    r"C:\\Program Files\\MyApp\\MyApp.exe")

# 4. Run as administrator (elevation)
import ctypes
if not ctypes.windll.shell32.IsUserAnAdmin():
    ctypes.windll.shell32.ShellExecuteW(
        None, "runas", sys.executable, " ".join(sys.argv), None, 1
    )
    sys.exit(0)

# 5. Clipboard access
# pip install pyperclip
import pyperclip
pyperclip.copy("Hello!")
text = pyperclip.paste()</code></pre>

      <h2>Distribution Channels</h2>

      <!-- Distribution -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Where to Ship Your Windows App</div>
        <div class="hub-apps" style="max-width:600px;margin:0 auto">
          <div class="hub-app" style="animation-delay:0.1s"><span class="hub-app-icon">&#x1F3EC;</span>Microsoft Store<span class="hub-app-sub">Official, built-in updates</span></div>
          <div class="hub-app" style="background:#f97316;animation-delay:0.25s"><span class="hub-app-icon">&#x1F4C8;</span>winget<span class="hub-app-sub">CLI package manager</span></div>
          <div class="hub-app" style="background:#a855f7;animation-delay:0.4s"><span class="hub-app-icon">&#x1F370;</span>Chocolatey<span class="hub-app-sub">Dev-focused</span></div>
          <div class="hub-app" style="background:#ef4444;animation-delay:0.55s"><span class="hub-app-icon">&#x1F310;</span>Your website<span class="hub-app-sub">Direct download</span></div>
        </div>
      </div>

      <h2>The Essential Toolchain</h2>

      <!-- Toolchain -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Windows Developer Toolchain</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Code Editor: VS Code or Visual Studio 2022<span class="layer-item-sub">VS Code for Python/web, VS 2022 for C++/C#/.NET</span></div>
          <div class="layer-item" style="background:#7c3aed">Languages: Python + PowerShell (scripting)<span class="layer-item-sub">Start here. Both come with Windows 10/11 out of the box.</span></div>
          <div class="layer-item" style="background:#f97316">Package: PyInstaller (.exe) or MSIX Packaging Tool<span class="layer-item-sub">PyInstaller for simple, MSIX for Microsoft Store</span></div>
          <div class="layer-item" style="background:#22c55e">Installer: Inno Setup or WiX (MSI)<span class="layer-item-sub">Inno Setup is simpler; WiX is Microsoft standard</span></div>
          <div class="layer-item" style="background:#ef4444">Code Signing: signtool (Windows SDK)<span class="layer-item-sub">Required for professional distribution, avoids SmartScreen warnings</span></div>
        </div>
      </div>

      <h2>Auto-Update (Pro Tip)</h2>
      <pre><code># Add auto-update to your Python Windows app using PyUpdater
# pip install pyupdater

# Check for updates on startup:
import pyupdater
from pyupdater.client import Client

client = Client(ClientConfig(), refresh=True)
app_update = client.update_check("FileOrganizer", "1.0.0")
if app_update is not None:
    if app_update.is_downloaded():
        app_update.extract_restart()
    else:
        app_update.download()

# Alternative simpler approach: GitHub Releases + manual check
import requests
LATEST_RELEASE = "https://api.github.com/repos/you/app/releases/latest"
response = requests.get(LATEST_RELEASE).json()
latest_version = response["tag_name"]
if latest_version > current_version:
    # Show "Update available" notification
    pass</code></pre>

      <p>Building Windows software in 2026 has never been more accessible. With Python + tkinter, you can ship a working desktop app in an afternoon. With PyInstaller, your app runs on any Windows machine without Python. With Inno Setup, you get a professional installer. For more complex apps, graduate to C# + WinUI 3 (native) or Tauri (cross-platform). The toolchain is mature, the ecosystem is vast, and 70%+ of desktop users are waiting.</p>
    `;
