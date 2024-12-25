
# **Rouge Android Hacking Botnet + Setup Guide**  
Rouge is an advanced **Android-based botnet** with a control panel built on PHP. It is a tool often used by hackers to compromise Android devices on a large scale.

---
## **History of Rouge Botnet**  
The **Rouge Botnet** was originally developed as an Android hacking tool for large-scale targeting. It first appeared on a darknet hacking forum called **HackForums**, introduced by a cyber threat actor as part of a **Malware-as-a-Service (MaaS)** model.

- The developer initially sold this botnet as a series, followed by the release of a variant named **Blue Shades v5**.  
- Upon releasing **v6**, the project was renamed and marketed as the **Rouge Botnet**.  
- Unfortunately for the creator, the **v6.2 source code** was leaked on the same forum after their server was compromised. This rendered the project obsolete as the leaked code was incomplete and flawed.  

Despite its misconfigurations and authentication issues, this guide will help you bypass these problems and set up the botnet successfully.

---

## **Features of Rouge Botnet**  
Rouge Botnet boasts a plethora of powerful features, including but not limited to:  

### **Core Functionalities**  
- **Mass Command Execution**: Execute commands on all connected bots simultaneously.  
- **Contacts Theft**: Extract all contacts from the victim's device.  
- **Call Logs**: Dump call logs from the target device.  
- **Wireless/Bluetooth Control**: Enable or disable Wi-Fi and Bluetooth remotely.  
- **Camera Access**: Take pictures using both the front and rear cameras.  
- **Shell Commands**: Execute shell commands directly on the victim's device.  
- **Message Inbox Access**: Read all SMS messages.  
- **Fake Alert Dialogs**: Create fake alert boxes on target devices.  
- **Default Messaging App Switch**: Change the default messaging app on the victim's device.  

### **Advanced Features**  
- **Notification Injection**: Send custom notifications to hacked devices.  
- **SMS Deletion**: Erase all inbox SMS messages.  
- **Device Information Retrieval**: Obtain details like model, IMEI, and battery status.  
- **Auto-start on Boot**: Ensures the bot starts automatically upon device restart.  
- **Audio Recording**: Record audio via the device microphone and stream it to the panel.  
- **Stealth Mode**: Hides its icon post-installation for undetected operation.  

### **Root-Dependent Features**  
- **Screenshot Grabber**: Capture device activity (requires root).  
- **System App Installation**: Install itself as a system app, making it almost impossible to uninstall.  
- **Admin/Root Access Request**: Forces the user to grant administrative privileges.  

### **Additional Utilities**  
- **GPS Tracking**: Track the live location of devices.  
- **Anti-Antivirus**: Blocks access to antivirus apps and Play Store.  
- **App Blocker**: Restrict access to selected apps.  
- **Self-Destruction**: Wipes all data and uninstalls itself.  
- **Keylogger**: Records and streams keystrokes to the server.  
- **Low Orbit Cannon**: Perform DDoS attacks to flood websites with traffic.

---

## **Setup Guide for Rouge Botnet**  
### **1. Preparing the Botnet Panel**  
Follow these steps to configure the botnet panel:  

1. **Choose a Hosting Site:**  
   - Select a hosting service and obtain a domain.  
   - Navigate to the **File Manager** in the hosting panel.  

2. **Upload Botnet Files:**  
   - Upload the `Dark` folder to the file manager.  
   - Inside the `Dark` folder, locate the subdirectory named `alienw`.  
   - Edit the `DatabaseConfig.php` file with your hosting details:  
     ```php
     $HostName = "your-host-name";
     $HostUser = "your-database-username";
     $HostPass = "your-database-password";
     $DatabaseName = "your-database-name";
     ```

3. **Bypass Authentication Issues:**  
   - Navigate to the `zathura` folder and open the `uth.php` file.  
   - Modify the file by:  
     - Removing **line 14**.  
     - Replacing `'1'` with `'0'` on **line 16**.  

4. **Setup the Database:**  
   - Log in to **MySQL** and upload the provided SQL bot file to create the database.  
   - Use **PHPMyAdmin** for easier SQL table management.

5. **Verify the Panel:**  
   - Open your website in a browser to access the Rouge Botnet panel.

---

### **2. Installing the Botnet on a Target Device**  

### **Decompiling and Modifying the APK**  
1. Locate the calculator APK provided in the Rouge Botnet package.  
2. **Decompile the APK:**  
   - Extract the APK files using an APK decompiler.  
   - Navigate to `Documents -> Decompiled Folder -> Smilie -> Com`.  
   - Open the files with Notepad and search for instances of `http://`.  

3. Replace the hardcoded URL (`http://kndbots-xyz...`) with your **panel URL**.  
4. Save the changes and recompile the APK.

### **Deploying the APK**  
1. Install the modified APK on the target device.  
2. Upon installation, the app (disguised as a calculator) will request various permissions:
   - **Camera**
   - **Microphone**
   - **Gallery**
   - **SMS**
   - **Phone**  
   Grant all permissions for full functionality.  

3. Refresh the botnet panel to verify that the device is registered.  

---

## **Disclaimer**  
This document is for **educational purposes only**. Misuse of such tools is illegal and unethical. Always ensure you have proper authorization before testing or deploying such software.

---

## **Conclusion**  
The **Rouge Botnet** is a sophisticated tool with extensive functionalities for compromising Android devices. Despite its flaws, this guide ensures a successful setup and deployment process for learning and testing purposes.
