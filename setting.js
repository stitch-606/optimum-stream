// Mock data
const mockNetworks = [
    { ssid: 'Home_WiFi_2.4G', strength: 4, secured: true },
    { ssid: 'Neighbor_5G', strength: 3, secured: true },
    { ssid: 'Public_WiFi', strength: 2, secured: false },
    { ssid: 'Guest_Network', strength: 1, secured: true }
  ];
  
  const mockApps = {
    optimum: {
      name: 'Optimum TV',
      icon: './assets/opt-tv-logo.png',
      version: '2.1.0',
      storage: { total: '1.2 GB', data: '800 MB', cache: '400 MB' }
    },
    netflix: {
      name: 'Netflix',
      icon: './assets/netflexAppSmall.png',
      version: '8.4.0',
      storage: { total: '2.1 GB', data: '1.5 GB', cache: '600 MB' }
    }
  };
  
  // Device settings data
  const deviceSettings = [
    { id: 'network', title: 'Network & Internet', icon: 'fa-wifi' },
    { id: 'accounts', title: 'Accounts & Sign-In', icon: 'fa-user-circle' },
    { id: 'apps', title: 'Apps', icon: 'fa-th-large' },
    { id: 'preferences', title: 'Device Preferences', icon: 'fa-sliders-h' },
    { id: 'tv', title: 'TV Settings', icon: 'fa-tv' },
    { id: 'remotes', title: 'Remotes & Accessories', icon: 'fa-gamepad' }
  ];
  
  // Generate some dummy app data
  const generateDummyApps = (count, isSystem = false) => {
    const appTypes = ['Entertainment', 'Social', 'Utility', 'Games', 'Media', 'News'];
    const companies = ['MediaCorp', 'StreamNet', 'AppWorks', 'TechFusion', 'DigiSoft', 'ViewMax'];
    
    return Array.from({ length: count }, (_, i) => {
      const appType = appTypes[Math.floor(Math.random() * appTypes.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const version = `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
      const storageMB = Math.floor(Math.random() * 500) + 50;
      const dataMB = Math.floor(storageMB * 0.6);
      const cacheMB = storageMB - dataMB;
      
      return {
        id: `app-${i}`,
        name: isSystem ? `System ${appType} ${i+1}` : `${appType} ${i+1}`,
        publisher: isSystem ? 'Optimum' : company,
        version: version,
        // Use font awesome cog icon instead of a placeholder image
        useIconClass: true,
        iconClass: 'fas fa-cog',
        isSystem: isSystem,
        storage: {
          total: `${storageMB} MB`,
          data: `${dataMB} MB`,
          cache: `${cacheMB} MB`
        }
      };
    });
  };
  
  // Create dummy apps list
  const dummyApps = generateDummyApps(12);
  const allApps = [...dummyApps, ...generateDummyApps(8)];
  const systemApps = generateDummyApps(29, true);
  
  // Add Optimum TV to system apps
  systemApps.push({
    id: 'optimum-tv',
    name: 'Optimum TV',
    publisher: 'Optimum',
    version: '2.1.0',
    icon: './assets/optTvApp.png',
    isSystem: true,
    storage: {
      total: '1.5 GB',
      data: '950 MB',
      cache: '550 MB'
    }
  });
  
  // Simple settings state
  const settingsState = {
    network: {
      wifi: {
        enabled: true,
        connected: 'Home_WiFi_2.4G'
      },
      ethernet: {
        enabled: false,
        status: 'Disconnected'
      }
    },
    accounts: {
      currentUser: 'OptimumUser',
      email: 'user@example.com',
      lastSync: 'Today at 10:30 AM'
    },
    display: {
      resolution: '1080p',
      hdr: true,
      audioOutput: 'HDMI'
    },
    remotes: {
      paired: ['Optimum Remote 1'],
      batteryLevel: '85%'
    },
    storage: {
      total: '32 GB',
      used: '18.5 GB',
      free: '13.5 GB'
    },
    preferences: {
      language: 'English',
      location: 'New York',
      timeZone: 'Eastern Time (ET)',
      keyboardLayout: 'QWERTY'
    },
    tv: {
      inputSource: 'HDMI 1',
      aspect: '16:9',
      colorTemp: 'Normal',
      hdmiCEC: true
    },
    apps: {
      regular: dummyApps,
      all: allApps,
      system: systemApps
    }
  };
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing settings');
    setupDeviceSettings();
  });
  
  // Main setup function
  function setupDeviceSettings() {
    // Set up device settings button
    const deviceSettingsBtn = document.getElementById('deviceSettingsBtn');
    if (deviceSettingsBtn) {
      deviceSettingsBtn.addEventListener('click', toggleDeviceSettings);
    }
  }
  
  // Global state
  let activePanel = null;
  let panelHistory = [];
  
  // Toggle the device settings panel
  function toggleDeviceSettings() {
    console.log('Toggle device settings');
    
    // If panel is already open, close it
    if (activePanel) {
      closePanel();
      return;
    }
    
    // Create the main device panel
    createDevicePanel();
  }
  
  // Create the main device settings panel
  function createDevicePanel() {
    console.log('Creating device panel');
    
    // Create panel container if it doesn't exist
    let panelContainer = document.querySelector('.right-panel-stack');
    if (!panelContainer) {
      panelContainer = document.createElement('div');
      panelContainer.className = 'right-panel-stack';
      document.body.appendChild(panelContainer);
    }
    
    // Create the panel
    const panel = document.createElement('div');
    panel.className = 'right-panel';
    panel.innerHTML = `
      <div class="right-panel-header">
        <button class="back-button">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2>Device & Remote Settings</h2>
      </div>
      <div class="right-panel-content">
        <div class="settings-menu-list">
          ${deviceSettings.map(setting => `
            <div class="settings-menu-item" data-setting="${setting.id}">
              <i class="fas ${setting.icon}"></i>
              <span>${setting.title}</span>
              <i class="fas fa-chevron-right"></i>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    // Add the panel to the container
    panelContainer.appendChild(panel);
    
    // Set up back button
    const backButton = panel.querySelector('.back-button');
    backButton.addEventListener('click', closePanel);
    
    // Set up menu items
    const menuItems = panel.querySelectorAll('.settings-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const settingId = item.getAttribute('data-setting');
        showSettingPanel(settingId);
      });
    });
    
    // Show panel with animation
    setTimeout(() => {
      panel.classList.add('active');
    }, 10);
    
    // Set as active panel
    activePanel = panel;
  }
  
  // Show a specific setting panel
  function showSettingPanel(settingId) {
    console.log('Show setting panel:', settingId);
    
    if (!activePanel) return;
    
    // Find the setting from our data
    const setting = deviceSettings.find(s => s.id === settingId);
    if (!setting) return;
    
    // Store current content for back navigation
    const currentContent = activePanel.querySelector('.right-panel-content').innerHTML;
    const currentTitle = activePanel.querySelector('.right-panel-header h2').textContent;
    panelHistory.push({ content: currentContent, title: currentTitle });
    
    // Update header
    const header = activePanel.querySelector('.right-panel-header h2');
    header.textContent = setting.title;
    
    // Update content based on the setting type
    const content = activePanel.querySelector('.right-panel-content');
    content.innerHTML = getSettingContent(settingId);
    
    // Initialize the content with event handlers
    initializeSettingContent(settingId);
    
    // Change back button to go back instead of close
    const backButton = activePanel.querySelector('.back-button');
    backButton.removeEventListener('click', closePanel);
    backButton.addEventListener('click', goBack);
  }
  
  // Go back to previous panel
  function goBack() {
    console.log('Going back in panel history');
    
    if (panelHistory.length === 0 || !activePanel) {
      closePanel();
      return;
    }
    
    const previous = panelHistory.pop();
    const header = activePanel.querySelector('.right-panel-header h2');
    const content = activePanel.querySelector('.right-panel-content');
    
    if (header && content && previous) {
      header.textContent = previous.title;
      content.innerHTML = previous.content;
      
      // Reinitialize content if we're back at the main menu
      if (previous.title === 'Device & Remote Settings') {
        const menuItems = content.querySelectorAll('.settings-menu-item');
        menuItems.forEach(item => {
          item.addEventListener('click', () => {
            const settingId = item.getAttribute('data-setting');
            showSettingPanel(settingId);
          });
        });
        
        // Change back button to close instead of go back
        const backButton = activePanel.querySelector('.back-button');
        backButton.removeEventListener('click', goBack);
        backButton.addEventListener('click', closePanel);
      }
    }
  }
  
  // Close the panel
  function closePanel() {
    console.log('Closing panel');
    
    if (!activePanel) return;
    
    // Hide with animation
    activePanel.classList.remove('active');
    
    // Remove after animation
    setTimeout(() => {
      if (activePanel && activePanel.parentNode) {
        activePanel.parentNode.removeChild(activePanel);
      }
      activePanel = null;
      panelHistory = [];
    }, 300);
  }
  
  // Get content HTML for a specific setting
  function getSettingContent(settingId) {
    switch (settingId) {
      case 'network':
        return `
          <div class="panel-content">
            <h3>Connection Type</h3>
            <div class="setting-group">
              <div class="connection-toggle">
                <div class="connection-option ${settingsState.network.wifi.enabled ? 'active' : ''}" id="wifi-option">
                  <i class="fas fa-wifi"></i>
                  <span>Wi-Fi</span>
                </div>
                <div class="connection-option ${settingsState.network.ethernet.enabled ? 'active' : ''}" id="ethernet-option">
                  <i class="fas fa-ethernet"></i>
                  <span>Ethernet</span>
                </div>
              </div>
            </div>
            
            <div id="wifi-settings" class="${settingsState.network.wifi.enabled ? '' : 'hidden'}">
              <div class="wifi-status">
                <div class="wifi-toggle">
                  <span>Wi-Fi</span>
                  <label class="switch">
                    <input type="checkbox" id="wifi-toggle" ${settingsState.network.wifi.enabled ? 'checked' : ''}>
                    <span class="slider round"></span>
                  </label>
                </div>
                <p class="wifi-name">Connected to: <span id="current-network">${settingsState.network.wifi.connected || 'Not connected'}</span></p>
              </div>
              <div class="wifi-list">
                <h3>Available Networks</h3>
                <div class="network-list" id="network-list">
                  ${mockNetworks.map(network => `
                    <div class="network-item" data-network="${network.ssid}">
                      <div class="network-info">
                        <span class="network-name">${network.ssid}</span>
                        <div class="network-signal">
                          ${Array(network.strength).fill('<i class="fas fa-signal"></i>').join('')}
                        </div>
                      </div>
                      ${network.secured ? '<i class="fas fa-lock"></i>' : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
            
            <div id="ethernet-settings" class="${settingsState.network.ethernet.enabled ? '' : 'hidden'}">
              <div class="ethernet-status">
                <div class="setting-item">
                  <span>Status</span>
                  <span id="ethernet-status">${settingsState.network.ethernet.status}</span>
                </div>
                <div class="setting-item">
                  <span>IP Address</span>
                  <span>192.168.1.101</span>
                </div>
                <div class="setting-item">
                  <span>MAC Address</span>
                  <span>00:1A:2B:3C:4D:5E</span>
                </div>
                <div class="setting-item">
                  <span>Gateway</span>
                  <span>192.168.1.1</span>
                </div>
                <div class="setting-item">
                  <span>DNS</span>
                  <span>8.8.8.8</span>
                </div>
                <button class="action-button" id="ethernet-config">
                  <i class="fas fa-cog"></i> Configure
                </button>
              </div>
            </div>
          </div>
        `;
        
      case 'accounts':
        return `
          <div class="panel-content">
            <div class="accounts-info">
              <div class="current-user">
                <div class="user-avatar">
                  <i class="fas fa-user-circle"></i>
                </div>
                <div class="user-details">
                  <h3>${settingsState.accounts.currentUser}</h3>
                  <p>${settingsState.accounts.email}</p>
                  <p class="last-sync">Last synced: ${settingsState.accounts.lastSync}</p>
                </div>
              </div>
              
              <div class="account-options">
                <div class="setting-item clickable">
                  <span>Add Another Account</span>
                  <i class="fas fa-chevron-right"></i>
                </div>
                <div class="setting-item clickable">
                  <span>Privacy Settings</span>
                  <i class="fas fa-chevron-right"></i>
                </div>
                <div class="setting-item clickable">
                  <span>Data Sync</span>
                  <i class="fas fa-chevron-right"></i>
                </div>
                <div class="setting-item clickable">
                  <span>Account Security</span>
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
              
              <div class="account-actions">
                <button class="action-button" id="sign-out">
                  <i class="fas fa-sign-out-alt"></i> Sign Out
                </button>
              </div>
            </div>
          </div>
        `;
        
      case 'apps':
        return `
          <div class="panel-content">
            <div class="apps-info">
              <h3>Installed Apps</h3>
              <div class="apps-list scrollable">
                ${settingsState.apps.regular.map((app, index) => `
                  <div class="app-item" data-app-id="${app.id}">
                    ${app.useIconClass 
                      ? `<div class="app-icon-container"><i class="${app.iconClass}"></i></div>` 
                      : `<img src="${app.icon}" alt="${app.name}" class="app-icon">`
                    }
                    <div class="app-details">
                      <span class="app-name">${app.name}</span>
                      <span class="app-version">${app.version}</span>
                    </div>
                  </div>
                `).join('')}
                <div class="app-item see-all" id="see-all-apps">
                  <i class="fas fa-th-large"></i>
                  <span>See All Apps</span>
                </div>
              </div>
            </div>
          </div>
        `;
        
      case 'preferences':
        return `
          <div class="panel-content">
            <div class="preferences-info">
              <div class="setting-group">
                <h3>Language</h3>
                <select class="setting-select" id="language">
                  <option value="English" ${settingsState.preferences.language === 'English' ? 'selected' : ''}>English</option>
                  <option value="Spanish" ${settingsState.preferences.language === 'Spanish' ? 'selected' : ''}>Spanish</option>
                  <option value="French" ${settingsState.preferences.language === 'French' ? 'selected' : ''}>French</option>
                </select>
              </div>
              
              <div class="setting-group">
                <h3>Location</h3>
                <select class="setting-select" id="location">
                  <option value="New York" ${settingsState.preferences.location === 'New York' ? 'selected' : ''}>New York</option>
                  <option value="Los Angeles" ${settingsState.preferences.location === 'Los Angeles' ? 'selected' : ''}>Los Angeles</option>
                  <option value="Chicago" ${settingsState.preferences.location === 'Chicago' ? 'selected' : ''}>Chicago</option>
                </select>
              </div>
              
              <div class="setting-group">
                <h3>Time Zone</h3>
                <select class="setting-select" id="timezone">
                  <option value="Eastern Time (ET)" ${settingsState.preferences.timeZone === 'Eastern Time (ET)' ? 'selected' : ''}>Eastern Time (ET)</option>
                  <option value="Central Time (CT)" ${settingsState.preferences.timeZone === 'Central Time (CT)' ? 'selected' : ''}>Central Time (CT)</option>
                  <option value="Mountain Time (MT)" ${settingsState.preferences.timeZone === 'Mountain Time (MT)' ? 'selected' : ''}>Mountain Time (MT)</option>
                  <option value="Pacific Time (PT)" ${settingsState.preferences.timeZone === 'Pacific Time (PT)' ? 'selected' : ''}>Pacific Time (PT)</option>
                </select>
              </div>
              
              <div class="setting-group">
                <h3>Date & Time</h3>
                <div class="setting-item clickable">
                  <span>Set Date & Time</span>
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
              
              <div class="setting-group">
                <h3>Accessibility</h3>
                <div class="setting-item clickable">
                  <span>Accessibility Settings</span>
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        `;
        
      case 'tv':
        return `
          <div class="panel-content">
            <div class="tv-settings-info">
              <div class="setting-group">
                <h3>Input Source</h3>
                <select class="setting-select" id="input-source">
                  <option value="HDMI 1" ${settingsState.tv.inputSource === 'HDMI 1' ? 'selected' : ''}>HDMI 1</option>
                  <option value="HDMI 2" ${settingsState.tv.inputSource === 'HDMI 2' ? 'selected' : ''}>HDMI 2</option>
                  <option value="Component" ${settingsState.tv.inputSource === 'Component' ? 'selected' : ''}>Component</option>
                </select>
              </div>
              
              <div class="setting-group">
                <h3>Aspect Ratio</h3>
                <select class="setting-select" id="aspect-ratio">
                  <option value="16:9" ${settingsState.tv.aspect === '16:9' ? 'selected' : ''}>16:9</option>
                  <option value="4:3" ${settingsState.tv.aspect === '4:3' ? 'selected' : ''}>4:3</option>
                  <option value="Zoom" ${settingsState.tv.aspect === 'Zoom' ? 'selected' : ''}>Zoom</option>
                </select>
              </div>
              
              <div class="setting-group">
                <h3>Color Temperature</h3>
                <select class="setting-select" id="color-temp">
                  <option value="Cool" ${settingsState.tv.colorTemp === 'Cool' ? 'selected' : ''}>Cool</option>
                  <option value="Normal" ${settingsState.tv.colorTemp === 'Normal' ? 'selected' : ''}>Normal</option>
                  <option value="Warm" ${settingsState.tv.colorTemp === 'Warm' ? 'selected' : ''}>Warm</option>
                </select>
              </div>
              
              <div class="setting-group">
                <h3>HDMI-CEC</h3>
                <label class="switch">
                  <input type="checkbox" id="hdmi-cec" ${settingsState.tv.hdmiCEC ? 'checked' : ''}>
                  <span class="slider round"></span>
                </label>
              </div>
              
              <div class="setting-group">
                <h3>Advanced Settings</h3>
                <div class="setting-item clickable">
                  <span>Picture Settings</span>
                  <i class="fas fa-chevron-right"></i>
                </div>
                <div class="setting-item clickable">
                  <span>Sound Settings</span>
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        `;
        
      case 'remotes':
        return `
          <div class="panel-content">
            <div class="remotes-info">
              <h3>Paired Remotes</h3>
              <div class="paired-remotes">
                ${settingsState.remotes.paired.map(remote => `
                  <div class="remote-item">
                    <i class="fas fa-gamepad"></i>
                    <div class="remote-details">
                      <span>${remote}</span>
                      <span class="battery-level">Battery: ${settingsState.remotes.batteryLevel}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <div class="accessory-options">
                <h3>Available Accessories</h3>
                <div class="setting-item clickable">
                  <span>Bluetooth Devices</span>
                  <i class="fas fa-bluetooth-b"></i>
                </div>
                <div class="setting-item clickable">
                  <span>Game Controllers</span>
                  <i class="fas fa-gamepad"></i>
                </div>
                <div class="setting-item clickable">
                  <span>Keyboards</span>
                  <i class="fas fa-keyboard"></i>
                </div>
              </div>
              
              <button class="action-button" id="pair-remote">
                <i class="fas fa-plus"></i> Pair New Remote
              </button>
            </div>
          </div>
        `;
        
      default:
        return '<div class="panel-content"><p>Content not available</p></div>';
    }
  }
  
  // Initialize the content with event handlers
  function initializeSettingContent(settingId) {
    if (!activePanel) return;
    
    switch (settingId) {
      case 'network':
        // Connection type toggle
        const wifiOption = activePanel.querySelector('#wifi-option');
        const ethernetOption = activePanel.querySelector('#ethernet-option');
        const wifiSettings = activePanel.querySelector('#wifi-settings');
        const ethernetSettings = activePanel.querySelector('#ethernet-settings');
        
        if (wifiOption && ethernetOption) {
          wifiOption.addEventListener('click', () => {
            settingsState.network.wifi.enabled = true;
            settingsState.network.ethernet.enabled = false;
            wifiOption.classList.add('active');
            ethernetOption.classList.remove('active');
            wifiSettings.classList.remove('hidden');
            ethernetSettings.classList.add('hidden');
            showNotification('Switched to Wi-Fi connection');
          });
          
          ethernetOption.addEventListener('click', () => {
            settingsState.network.wifi.enabled = false;
            settingsState.network.ethernet.enabled = true;
            wifiOption.classList.remove('active');
            ethernetOption.classList.add('active');
            wifiSettings.classList.add('hidden');
            ethernetSettings.classList.remove('hidden');
            showNotification('Switched to Ethernet connection');
          });
        }
        
        // WiFi toggle
        const wifiToggle = activePanel.querySelector('#wifi-toggle');
        if (wifiToggle) {
          wifiToggle.addEventListener('change', () => {
            settingsState.network.wifi.enabled = wifiToggle.checked;
            if (!wifiToggle.checked) {
              settingsState.network.wifi.connected = null;
              const currentNetwork = activePanel.querySelector('#current-network');
              if (currentNetwork) {
                currentNetwork.textContent = 'Not connected';
              }
            }
            showNotification(wifiToggle.checked ? 'WiFi enabled' : 'WiFi disabled');
          });
        }
        
        // Network items
        const networkItems = activePanel.querySelectorAll('.network-item');
        networkItems.forEach(item => {
          item.addEventListener('click', () => {
            const networkName = item.getAttribute('data-network');
            settingsState.network.wifi.connected = networkName;
            const currentNetwork = activePanel.querySelector('#current-network');
            if (currentNetwork) {
              currentNetwork.textContent = networkName;
            }
            showNotification(`Connected to ${networkName}`);
          });
        });
        
        // Ethernet config button
        const ethernetConfigBtn = activePanel.querySelector('#ethernet-config');
        if (ethernetConfigBtn) {
          ethernetConfigBtn.addEventListener('click', () => {
            showNotification('Opening Ethernet configuration...');
          });
        }
        break;
        
      case 'accounts':
        // Sign out button
        const signOutBtn = activePanel.querySelector('#sign-out');
        if (signOutBtn) {
          signOutBtn.addEventListener('click', () => {
            showNotification('Signing out...');
            setTimeout(() => {
              showNotification('You have been signed out');
            }, 1500);
          });
        }
        
        // All clickable items
        const accountClickables = activePanel.querySelectorAll('.setting-item.clickable');
        accountClickables.forEach(item => {
          item.addEventListener('click', () => {
            const text = item.querySelector('span').textContent;
            showNotification(`Opening ${text}...`);
          });
        });
        break;
        
      case 'apps':
        // See all apps button
        const seeAllBtn = activePanel.querySelector('#see-all-apps');
        if (seeAllBtn) {
          seeAllBtn.addEventListener('click', () => {
            // Create all apps view
            const content = activePanel.querySelector('.right-panel-content');
            const currentContent = content.innerHTML;
            const header = activePanel.querySelector('.right-panel-header h2');
            const currentTitle = header.textContent;
            
            // Store for back navigation
            panelHistory.push({ content: currentContent, title: currentTitle });
            
            // Update header
            header.textContent = 'All Apps';
            
            // Update content with all apps
            content.innerHTML = `
              <div class="panel-content">
                <div class="apps-info">
                  <h3>All Installed Apps</h3>
                  <div class="apps-list scrollable">
                    ${settingsState.apps.all.map((app, index) => `
                      <div class="app-item" data-app-id="${app.id}">
                        ${app.useIconClass 
                          ? `<div class="app-icon-container"><i class="${app.iconClass}"></i></div>` 
                          : `<img src="${app.icon}" alt="${app.name}" class="app-icon">`
                        }
                        <div class="app-details">
                          <span class="app-name">${app.name}</span>
                          <span class="app-version">${app.version}</span>
                        </div>
                      </div>
                    `).join('')}
                    <div class="app-item see-all" id="show-system-apps">
                      <i class="fas fa-cog"></i>
                      <span>Show System Apps</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
            
            // Add event listener for "Show System Apps"
            const showSystemBtn = content.querySelector('#show-system-apps');
            if (showSystemBtn) {
              showSystemBtn.addEventListener('click', () => {
                // Store current content for back navigation
                const allAppsContent = content.innerHTML;
                panelHistory.push({ content: allAppsContent, title: 'All Apps' });
                
                // Update header
                header.textContent = 'System Apps';
                
                // Update content with system apps
                content.innerHTML = `
                  <div class="panel-content">
                    <div class="apps-info">
                      <h3>System Apps</h3>
                      <div class="apps-list scrollable">
                        ${settingsState.apps.system.map((app, index) => `
                          <div class="app-item" data-app-id="${app.id}">
                            ${app.useIconClass 
                              ? `<div class="app-icon-container"><i class="${app.iconClass}"></i></div>` 
                              : `<img src="${app.icon}" alt="${app.name}" class="app-icon">`
                            }
                            <div class="app-details">
                              <span class="app-name">${app.name}</span>
                              <span class="app-version">${app.version}</span>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                `;
                
                // Add event listeners for the app items (specifically Optimum TV)
                const systemAppItems = content.querySelectorAll('.app-item');
                systemAppItems.forEach(appItem => {
                  appItem.addEventListener('click', () => {
                    const appId = appItem.getAttribute('data-app-id');
                    if (appId === 'optimum-tv') {
                      showAppDetails(appId);
                    }
                  });
                });
              });
            }
            
            // Add event listeners for the app items
            const appItems = content.querySelectorAll('.app-item');
            appItems.forEach(appItem => {
              if (!appItem.id) { // Skip the "Show System Apps" button
                appItem.addEventListener('click', () => {
                  const appId = appItem.getAttribute('data-app-id');
                  if (appId) {
                    showNotification(`Opening ${appId} details...`);
                  }
                });
              }
            });
          });
        }
        break;
        
      case 'preferences':
        // Select dropdowns
        const language = activePanel.querySelector('#language');
        const location = activePanel.querySelector('#location');
        const timezone = activePanel.querySelector('#timezone');
        
        if (language) {
          language.addEventListener('change', (e) => {
            settingsState.preferences.language = e.target.value;
            showNotification(`Language changed to ${e.target.value}`);
          });
        }
        
        if (location) {
          location.addEventListener('change', (e) => {
            settingsState.preferences.location = e.target.value;
            showNotification(`Location changed to ${e.target.value}`);
          });
        }
        
        if (timezone) {
          timezone.addEventListener('change', (e) => {
            settingsState.preferences.timeZone = e.target.value;
            showNotification(`Time zone changed to ${e.target.value}`);
          });
        }
        
        // Clickable items
        const clickableItems = activePanel.querySelectorAll('.setting-item.clickable');
        clickableItems.forEach(item => {
          item.addEventListener('click', () => {
            const text = item.querySelector('span').textContent;
            showNotification(`Opening ${text}...`);
          });
        });
        break;
        
      case 'tv':
        // Input source
        const inputSource = activePanel.querySelector('#input-source');
        const aspectRatio = activePanel.querySelector('#aspect-ratio');
        const colorTemp = activePanel.querySelector('#color-temp');
        const hdmiCec = activePanel.querySelector('#hdmi-cec');
        
        if (inputSource) {
          inputSource.addEventListener('change', (e) => {
            settingsState.tv.inputSource = e.target.value;
            showNotification(`Input source changed to ${e.target.value}`);
          });
        }
        
        if (aspectRatio) {
          aspectRatio.addEventListener('change', (e) => {
            settingsState.tv.aspect = e.target.value;
            showNotification(`Aspect ratio changed to ${e.target.value}`);
          });
        }
        
        if (colorTemp) {
          colorTemp.addEventListener('change', (e) => {
            settingsState.tv.colorTemp = e.target.value;
            showNotification(`Color temperature changed to ${e.target.value}`);
          });
        }
        
        if (hdmiCec) {
          hdmiCec.addEventListener('change', (e) => {
            settingsState.tv.hdmiCEC = e.target.checked;
            showNotification(`HDMI-CEC ${e.target.checked ? 'enabled' : 'disabled'}`);
          });
        }
        
        // Clickable items
        const tvClickables = activePanel.querySelectorAll('.setting-item.clickable');
        tvClickables.forEach(item => {
          item.addEventListener('click', () => {
            const text = item.querySelector('span').textContent;
            showNotification(`Opening ${text}...`);
          });
        });
        break;
        
      case 'remotes':
        // Pair remote button
        const pairButton = activePanel.querySelector('#pair-remote');
        if (pairButton) {
          pairButton.addEventListener('click', () => {
            showNotification('Searching for new remotes...');
            setTimeout(() => {
              showNotification('No new remotes found');
            }, 3000);
          });
        }
        
        // Clickable items
        const remoteClickables = activePanel.querySelectorAll('.setting-item.clickable');
        remoteClickables.forEach(item => {
          item.addEventListener('click', () => {
            const text = item.querySelector('span').textContent;
            showNotification(`Opening ${text}...`);
          });
        });
        break;
    }
  }
  
  // Show app details in a new panel
  function showAppDetails(appId) {
    if (!activePanel) return;
    
    // Get the app data
    const app = settingsState.apps.system.find(app => app.id === appId);
    if (!app) return;
    
    // Store current content for back navigation
    const content = activePanel.querySelector('.right-panel-content');
    const currentContent = content.innerHTML;
    const header = activePanel.querySelector('.right-panel-header h2');
    const currentTitle = header.textContent;
    panelHistory.push({ content: currentContent, title: currentTitle });
    
    // Update header
    header.textContent = app.name;
    
    // Update content with app details
    content.innerHTML = `
      <div class="panel-content">
        <div class="app-details-view">
          <div class="app-header">
            ${app.useIconClass 
              ? `<div class="app-icon-container large"><i class="${app.iconClass}"></i></div>` 
              : `<img src="${app.icon}" alt="${app.name}" class="app-icon">`
            }
            <div class="app-info">
              <h3>${app.name}</h3>
              <p>Version ${app.version}</p>
              <p>By ${app.publisher}</p>
            </div>
          </div>
          
          <div class="storage-info">
            <h3>Storage</h3>
            <div class="storage-item">
              <span>Total Space</span>
              <span class="storage-value">${app.storage.total}</span>
            </div>
            <div class="storage-item">
              <span>App Data</span>
              <span class="storage-value">${app.storage.data}</span>
            </div>
            <div class="storage-item">
              <span>Cache</span>
              <span class="storage-value">${app.storage.cache}</span>
            </div>
          </div>
          
          <div class="app-actions">
            <button class="action-button" id="clear-data">Clear Data</button>
            <button class="action-button" id="clear-cache">Clear Cache</button>
            <button class="action-button" id="force-stop">Force Stop</button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners for action buttons
    const clearDataBtn = content.querySelector('#clear-data');
    const clearCacheBtn = content.querySelector('#clear-cache');
    const forceStopBtn = content.querySelector('#force-stop');
    
    if (clearDataBtn) {
      clearDataBtn.addEventListener('click', () => {
        showConfirmDialog(
          'Clear App Data',
          `Are you sure you want to clear all data for ${app.name}? This will remove all user data and reset the app to its initial state.`,
          () => {
            showNotification(`Data cleared for ${app.name}`);
          }
        );
      });
    }
    
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        showConfirmDialog(
          'Clear Cache',
          `Are you sure you want to clear the cache for ${app.name}? This will not affect your user data.`,
          () => {
            showNotification(`Cache cleared for ${app.name}`);
          }
        );
      });
    }
    
    if (forceStopBtn) {
      forceStopBtn.addEventListener('click', () => {
        showConfirmDialog(
          'Force Stop',
          `Are you sure you want to force stop ${app.name}? This may cause unsaved data to be lost.`,
          () => {
            showNotification(`${app.name} has been force stopped`);
          }
        );
      });
    }
  }
  
  // Show a confirmation dialog
  function showConfirmDialog(title, message, onConfirm) {
    // Create dialog background
    const dialogBg = document.createElement('div');
    dialogBg.className = 'dialog-background';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'confirmation-dialog';
    dialog.innerHTML = `
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="dialog-buttons">
        <button class="dialog-button cancel">Cancel</button>
        <button class="dialog-button confirm">Confirm</button>
      </div>
    `;
    
    // Add dialog to background
    dialogBg.appendChild(dialog);
    
    // Add to body
    document.body.appendChild(dialogBg);
    
    // Add event listeners
    const cancelBtn = dialog.querySelector('.cancel');
    const confirmBtn = dialog.querySelector('.confirm');
    
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(dialogBg);
    });
    
    confirmBtn.addEventListener('click', () => {
      document.body.removeChild(dialogBg);
      if (onConfirm) onConfirm();
    });
  }
  
  // Show a notification
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }