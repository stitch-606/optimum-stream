document.addEventListener('DOMContentLoaded', function() {
    // Time Update
    function updateTime() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      
      document.getElementById('current-time').textContent = `${hours}:${minutes} ${ampm}`;
    }
  
    setInterval(updateTime, 1000);
    updateTime();
  
    // Welcome Overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 500);
      }, 4000);
    }
  
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
  
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
  
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const targetId = button.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  
    // Settings Description
    const menuButtons = document.querySelectorAll('.menu-button');
    const descriptionText = document.getElementById('description-text');
  
    if (menuButtons.length > 0 && descriptionText) {
      menuButtons.forEach(button => {
        // Add hover effects for description
        button.addEventListener('mouseenter', () => {
          const description = button.getAttribute('data-text');
          if (description) {
            descriptionText.textContent = description;
          }
        });
  
        button.addEventListener('mouseleave', () => {
          descriptionText.textContent = '';
        });
        
        // Add click handler for settings panels
        if (button.id !== 'deviceSettingsBtn') { // Skip the device settings button as it has its own handler
          button.addEventListener('click', () => {
            const settingType = button.getAttribute('data-settings');
            if (settingType) {
              openSettingsPanel(settingType, button.textContent.trim());
            }
          });
        }
      });
    }
    
    // Placeholder data for settings
    const settingsData = {
      'favorite-channels': {
        channels: [
          { id: 1, name: 'News 12', number: '12', favorite: true },
          { id: 2, name: 'NBC', number: '4', favorite: true },
          { id: 3, name: 'CBS', number: '2', favorite: false },
          { id: 4, name: 'ABC', number: '7', favorite: true },
          { id: 5, name: 'Fox', number: '5', favorite: false },
          { id: 6, name: 'ESPN', number: '27', favorite: true },
          { id: 7, name: 'HBO', number: '200', favorite: true },
          { id: 8, name: 'TNT', number: '40', favorite: false },
          { id: 9, name: 'TBS', number: '42', favorite: false },
          { id: 10, name: 'CNN', number: '78', favorite: true }
        ]
      },
      'dvr': {
        capacity: '500 GB',
        used: '210 GB',
        recordings: [
          { title: 'News 12 Morning', date: 'Today, 7:00 AM', size: '2.1 GB' },
          { title: 'Sports Center', date: 'Yesterday, 11:00 PM', size: '3.5 GB' },
          { title: 'The Late Show', date: '3/5/2025, 11:35 PM', size: '4.2 GB' }
        ],
        autoDelete: true,
        recordSeries: true
      },
      'sap': {
        current: 'English',
        available: ['English', 'Spanish', 'French', 'Portuguese']
      },
      'parental': {
        enabled: false,
        pin: '0000',
        movieRating: 'PG-13',
        tvRating: 'TV-14',
        blockedChannels: [210, 215, 220]
      },
      'pin': {
        current: '1234',
        enabled: true
      },
      'default-channel': {
        current: 'News 12',
        number: '12',
        favorites: ['News 12', 'HBO', 'ESPN']
      },
      'account': {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(212) 555-1234',
        plan: 'Optimum Select',
        nextBilling: '4/15/2025',
        amount: '$124.99'
      },
      'accessibility': {
        closedCaptions: true,
        fontSize: 'Medium',
        fontColor: 'White',
        backgroundColor: 'Black',
        talkback: false,
        highContrast: false
      },
      'help': {
        topics: [
          'Getting Started',
          'Remote Control',
          'TV Guide',
          'DVR & Recordings',
          'Apps & Features',
          'Troubleshooting',
          'Contact Support'
        ],
        supportPhone: '1-800-555-0123',
        supportHours: '24/7',
        firmwareVersion: '2.1.5',
        lastUpdated: '3/1/2025'
      }
    };
    
    // Function to open settings panel
    function openSettingsPanel(settingType, title) {
      // Create panel container if it doesn't exist
      let panelContainer = document.querySelector('.right-panel-stack');
      if (!panelContainer) {
        panelContainer = document.createElement('div');
        panelContainer.className = 'right-panel-stack';
        document.body.appendChild(panelContainer);
      }
      
      // Close any existing panel
      const existingPanel = document.querySelector('.right-panel.active');
      if (existingPanel) {
        existingPanel.classList.remove('active');
        setTimeout(() => {
          if (existingPanel.parentNode) {
            existingPanel.parentNode.removeChild(existingPanel);
          }
        }, 300);
      }
      
      // Create the settings panel
      const panel = document.createElement('div');
      panel.className = 'right-panel';
      
      // Set the panel content based on setting type
      panel.innerHTML = `
        <div class="right-panel-header">
          <button class="back-button">
            <i class="fas fa-chevron-left"></i>
          </button>
          <h2>${title}</h2>
        </div>
        <div class="right-panel-content">
          ${getSettingPanelContent(settingType)}
        </div>
      `;
      
      // Add the panel to the container
      panelContainer.appendChild(panel);
      
      // Show panel with animation
      setTimeout(() => {
        panel.classList.add('active');
      }, 10);
      
      // Set up back button
      const backButton = panel.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', () => {
          panel.classList.remove('active');
          setTimeout(() => {
            if (panel.parentNode) {
              panel.parentNode.removeChild(panel);
            }
          }, 300);
        });
      }
      
      // Initialize panel functionality
      initializeSettingPanel(panel, settingType);
    }
    
    // Generate HTML content for each setting panel
    function getSettingPanelContent(settingType) {
      switch (settingType) {
        case 'favorite-channels':
          const channels = settingsData['favorite-channels'].channels;
          return `
            <div class="panel-content">
              <div class="setting-header">
                <p>Select your favorite channels to add them to your favorites list.</p>
              </div>
              <div class="channel-list">
                ${channels.map(channel => `
                  <div class="channel-item">
                    <div class="channel-info">
                      <span class="channel-number">${channel.number}</span>
                      <span class="channel-name">${channel.name}</span>
                    </div>
                    <label class="switch">
                      <input type="checkbox" class="favorite-toggle" data-channel-id="${channel.id}" ${channel.favorite ? 'checked' : ''}>
                      <span class="slider round"></span>
                    </label>
                  </div>
                `).join('')}
              </div>
              <div class="settings-actions">
                <button class="action-button" id="save-favorites">Save Changes</button>
              </div>
            </div>
          `;
          
        case 'dvr':
          const dvr = settingsData['dvr'];
          return `
            <div class="panel-content">
              <div class="setting-group">
                <h3>DVR Storage</h3>
                <div class="storage-bar">
                  <div class="used-space" style="width: ${(parseInt(dvr.used) / parseInt(dvr.capacity)) * 100}%"></div>
                </div>
                <div class="storage-details">
                  <span>Used: ${dvr.used}</span>
                  <span>Total: ${dvr.capacity}</span>
                </div>
              </div>
              
              <div class="setting-group">
                <h3>Recent Recordings</h3>
                <div class="recordings-list">
                  ${dvr.recordings.map(rec => `
                    <div class="recording-item">
                      <div class="recording-info">
                        <span class="recording-title">${rec.title}</span>
                        <span class="recording-date">${rec.date}</span>
                      </div>
                      <span class="recording-size">${rec.size}</span>
                      <button class="delete-recording" data-title="${rec.title}">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div class="setting-group">
                <h3>DVR Settings</h3>
                <div class="setting-option">
                  <span>Auto-delete watched recordings</span>
                  <label class="switch">
                    <input type="checkbox" id="auto-delete" ${dvr.autoDelete ? 'checked' : ''}>
                    <span class="slider round"></span>
                  </label>
                </div>
                <div class="setting-option">
                  <span>Record entire series with one click</span>
                  <label class="switch">
                    <input type="checkbox" id="record-series" ${dvr.recordSeries ? 'checked' : ''}>
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              
              <div class="settings-actions">
                <button class="action-button" id="save-dvr">Save Changes</button>
              </div>
            </div>
          `;
          
        case 'sap':
          const sap = settingsData['sap'];
          return `
            <div class="panel-content">
              <div class="setting-header">
                <p>Choose your preferred audio language. Not all programs provide alternate audio.</p>
              </div>
              
              <div class="setting-group">
                <h3>Preferred Language</h3>
                <select class="setting-select" id="sap-language">
                  ${sap.available.map(lang => `
                    <option value="${lang}" ${lang === sap.current ? 'selected' : ''}>${lang}</option>
                  `).join('')}
                </select>
              </div>
              
              <div class="settings-actions">
                <button class="action-button" id="save-sap">Save Changes</button>
              </div>
            </div>
          `;
          
        case 'parental':
          const parental = settingsData['parental'];
          return `
            <div class="panel-content">
              <div class="setting-header">
                <p>Set parental controls to restrict access to mature content.</p>
              </div>
              
              <div class="setting-group">
                <h3>Parental Controls</h3>
                <div class="setting-option">
                  <span>Enable Parental Controls</span>
                  <label class="switch">
                    <input type="checkbox" id="parental-toggle" ${parental.enabled ? 'checked' : ''}>
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              
              <div class="setting-group">
                <h3>Parental PIN</h3>
                <div class="pin-input">
                  <input type="password" id="parental-pin" value="${parental.pin}" maxlength="4" placeholder="Enter 4-digit PIN">
                </div>
              </div>
              
              <div class="setting-group">
                <h3>Content Restrictions</h3>
                <div class="restriction-option">
                  <span>Movie Rating Limit</span>
                  <select class="setting-select" id="movie-rating">
                    <option value="G" ${parental.movieRating === 'G' ? 'selected' : ''}>G</option>
                    <option value="PG" ${parental.movieRating === 'PG' ? 'selected' : ''}>PG</option>
                    <option value="PG-13" ${parental.movieRating === 'PG-13' ? 'selected' : ''}>PG-13</option>
                    <option value="R" ${parental.movieRating === 'R' ? 'selected' : ''}>R</option>
                    <option value="NC-17" ${parental.movieRating === 'NC-17' ? 'selected' : ''}>NC-17</option>
                  </select>
                </div>
                <div class="restriction-option">
                  <span>TV Rating Limit</span>
                  <select class="setting-select" id="tv-rating">
                    <option value="TV-Y" ${parental.tvRating === 'TV-Y' ? 'selected' : ''}>TV-Y</option>
                    <option value="TV-Y7" ${parental.tvRating === 'TV-Y7' ? 'selected' : ''}>TV-Y7</option>
                    <option value="TV-G" ${parental.tvRating === 'TV-G' ? 'selected' : ''}>TV-G</option>
                    <option value="TV-PG" ${parental.tvRating === 'TV-PG' ? 'selected' : ''}>TV-PG</option>
                    <option value="TV-14" ${parental.tvRating === 'TV-14' ? 'selected' : ''}>TV-14</option>
                    <option value="TV-MA" ${parental.tvRating === 'TV-MA' ? 'selected' : ''}>TV-MA</option>
                  </select>
                </div>
              </div>
              
              <div class="settings-actions">
                <button class="action-button" id="save-parental">Save Changes</button>
              </div>
            </div>
          `;
          
        case 'pin':
          const pin = settingsData['pin'];
          return `
            <div class="panel-content">
              <div class="setting-header">
                <p>Set a purchase PIN to prevent unauthorized purchases.</p>
              </div>
              
              <div class="setting-group">
                <h3>Purchase PIN</h3>
                <div class="setting-option">
                  <span>Require PIN for Purchases</span>
                  <label class="switch">
                    <input type="checkbox" id="pin-toggle" ${pin.enabled ? 'checked' : ''}>
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              
              <div class="setting-group">
                <h3>Change PIN</h3>
                <div class="pin-inputs">
                  <div class="pin-field">
                    <label>Current PIN</label>
                    <input type="password" id="current-pin" value="${pin.current}" maxlength="4" placeholder="Current PIN">
                  </div>
                  <div class="pin-field">
                    <label>New PIN</label>
                    <input type="password" id="new-pin" maxlength="4" placeholder="New PIN">
                  </div>
                  <div class="pin-field">
                    <label>Confirm New PIN</label>
                    <input type="password" id="confirm-pin" maxlength="4" placeholder="Confirm PIN">
                  </div>
                </div>
              </div>
              
              <div class="settings-actions">
                <button class="action-button" id="save-pin">Save Changes</button>
              </div>
            </div>
          `;
          
        case 'default-channel':
          const defaultChannel = settingsData['default-channel'];
          return `
            <div class="panel-content">
              <div class="setting-header">
                <p>Select which channel your TV will tune to when you start Optimum TV.</p>
              </div>
              
              <div class="setting-group">
                <h3>Default Channel</h3>
                <select class="setting-select" id="default-channel-select">
                  <option value="Last Channel">Last Channel Viewed</option>
                  ${defaultChannel.favorites.map(channel => `
                    <option value="${channel}" ${channel === defaultChannel.current ? 'selected' : ''}>${channel}</option>
                  `).join('')}
                </select>
              </div>
              
              <div class="settings-actions">
                <button class="action-button" id="save-default-channel">Save Changes</button>
              </div>
            </div>
          `;
          
        case 'account':
          const account = settingsData['account'];
          return `
            <div class="panel-content">
              <div class="account-info">
                <div class="account-header">
                  <i class="fas fa-user-circle"></i>
                  <div>
                    <h3>${account.name}</h3>
                    <p>${account.plan}</p>
                  </div>
                </div>
                
                <div class="account-details">
                  <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${account.email}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Phone</span>
                    <span class="detail-value">${account.phone}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Next Billing Date</span>
                    <span class="detail-value">${account.nextBilling}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Monthly Bill</span>
                    <span class="detail-value">${account.amount}</span>
                  </div>
                </div>
                
                <div class="account-actions">
                  <button class="action-button" id="edit-account">Edit Account Information</button>
                  <button class="action-button" id="view-bill">View Bill</button>
                  <button class="action-button" id="payment-methods">Payment Methods</button>
                </div>
              </div>
            </div>
          `;
          
        case 'accessibility':
          const accessibility = settingsData['accessibility'];
          return `
            <div class="panel-content">
              <div class="setting-header">
                <p>Customize accessibility features to improve your viewing experience.</p>
              </div>
              
              <div class="setting-group">
                <h3>Closed Captions</h3>
                <div class="setting-option">
                  <span>Enable Closed Captions</span>
                  <label class="switch">
                    <input type="checkbox" id="cc-toggle" ${accessibility.closedCaptions ? 'checked' : ''}>
                    <span class="slider round"></span>
                  </label>
                </div>
                
                <div class="setting-option">
                  <span>Font Size</span>
                  <select class="setting-select" id="font-size">
                    <option value="Small" ${accessibility.fontSize === 'Small' ? 'selected' : ''}>Small</option>
                    <option value="Medium" ${accessibility.fontSize === 'Medium' ? 'selected' : ''}>Medium</option>
                    <option value="Large" ${accessibility.fontSize === 'Large' ? 'selected' : ''}>Large</option>
                    <option value="Extra Large" ${accessibility.fontSize === 'Extra Large' ? 'selected' : ''}>Extra Large</option>
                  </select>
                </div>
                
                <div class="setting-option">
                  <span>Font Color</span>
                  <select class="setting-select" id="font-color">
                    <option value="White" ${accessibility.fontColor === 'White' ? 'selected' : ''}>White</option>
                    <option value="Yellow" ${accessibility.fontColor === 'Yellow' ? 'selected' : ''}>Yellow</option>
                    <option value="Green" ${accessibility.fontColor === 'Green' ? 'selected' : ''}>Green</option>
                    <option value="Blue" ${accessibility.fontColor === 'Blue' ? 'selected' : ''}>Blue</option>
                  </select>
                </div>
              </div>
              
              <div class="setting-group">
                <h3>Additional Features</h3>
                <div class="setting-option">
                  <span>Screen Reader (TalkBack)</span>
                  <label class="switch">
                    <input type="checkbox" id="talkback-toggle" ${accessibility.talkback ? 'checked' : ''}>
                    <span class="slider round"></span>
                  </label>
                </div>
                
                <div class="setting-option">
                  <span>High Contrast Mode</span>
                  <label class="switch">
                    <input type="checkbox" id="contrast-toggle" ${accessibility.highContrast ? 'checked' : ''}>
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              
              <div class="settings-actions">
                <button class="action-button" id="save-accessibility">Save Changes</button>
              </div>
            </div>
          `;
          
        case 'help':
          const help = settingsData['help'];
          return `
            <div class="panel-content">
              <div class="help-topics">
                <h3>Help Topics</h3>
                <div class="topic-list">
                  ${help.topics.map(topic => `
                    <div class="topic-item">
                      <span>${topic}</span>
                      <i class="fas fa-chevron-right"></i>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div class="support-info">
                <h3>Contact Support</h3>
                <div class="support-detail">
                  <i class="fas fa-phone"></i>
                  <span>${help.supportPhone}</span>
                </div>
                <div class="support-detail">
                  <i class="fas fa-clock"></i>
                  <span>Available ${help.supportHours}</span>
                </div>
              </div>
              
              <div class="system-info">
                <h3>System Information</h3>
                <div class="detail-item">
                  <span class="detail-label">Firmware Version</span>
                  <span class="detail-value">${help.firmwareVersion}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Last Updated</span>
                  <span class="detail-value">${help.lastUpdated}</span>
                </div>
                <button class="action-button" id="check-updates">Check for Updates</button>
              </div>
            </div>
          `;
          
        default:
          return '<div class="panel-content"><p>Settings not available</p></div>';
      }
    }
    
    // Initialize event handlers for settings panels
    function initializeSettingPanel(panel, settingType) {
      switch (settingType) {
        case 'favorite-channels':
          const saveButton = panel.querySelector('#save-favorites');
          if (saveButton) {
            saveButton.addEventListener('click', () => {
              showNotification('Favorite channels saved');
            });
          }
          
          const toggles = panel.querySelectorAll('.favorite-toggle');
          toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
              const channelId = parseInt(e.target.getAttribute('data-channel-id'));
              const channel = settingsData['favorite-channels'].channels.find(ch => ch.id === channelId);
              if (channel) {
                channel.favorite = e.target.checked;
              }
            });
          });
          break;
          
        case 'dvr':
          const saveDvrButton = panel.querySelector('#save-dvr');
          if (saveDvrButton) {
            saveDvrButton.addEventListener('click', () => {
              showNotification('DVR settings saved');
            });
          }
          
          const deleteButtons = panel.querySelectorAll('.delete-recording');
          deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
              const title = e.target.closest('.delete-recording').getAttribute('data-title');
              showConfirmDialog(
                'Delete Recording',
                `Are you sure you want to delete "${title}"?`,
                () => {
                  // Find and remove the recording
                  const recordingIndex = settingsData['dvr'].recordings.findIndex(rec => rec.title === title);
                  if (recordingIndex >= 0) {
                    settingsData['dvr'].recordings.splice(recordingIndex, 1);
                    // Remove the recording item from the DOM
                    e.target.closest('.recording-item').remove();
                    showNotification(`"${title}" deleted`);
                  }
                }
              );
            });
          });
          break;
          
        case 'sap':
          const saveSapButton = panel.querySelector('#save-sap');
          if (saveSapButton) {
            saveSapButton.addEventListener('click', () => {
              const language = panel.querySelector('#sap-language').value;
              settingsData['sap'].current = language;
              showNotification(`Audio language set to ${language}`);
            });
          }
          break;
          
        case 'parental':
          const saveParentalButton = panel.querySelector('#save-parental');
          if (saveParentalButton) {
            saveParentalButton.addEventListener('click', () => {
              const enabled = panel.querySelector('#parental-toggle').checked;
              const pin = panel.querySelector('#parental-pin').value;
              const movieRating = panel.querySelector('#movie-rating').value;
              const tvRating = panel.querySelector('#tv-rating').value;
              
              // Update settings
              settingsData['parental'].enabled = enabled;
              settingsData['parental'].pin = pin;
              settingsData['parental'].movieRating = movieRating;
              settingsData['parental'].tvRating = tvRating;
              
              showNotification('Parental control settings saved');
            });
          }
          break;
          
        case 'pin':
          const savePinButton = panel.querySelector('#save-pin');
          if (savePinButton) {
            savePinButton.addEventListener('click', () => {
              const enabled = panel.querySelector('#pin-toggle').checked;
              const currentPin = panel.querySelector('#current-pin').value;
              const newPin = panel.querySelector('#new-pin').value;
              const confirmPin = panel.querySelector('#confirm-pin').value;
              
              // Validate PIN
              if (currentPin !== settingsData['pin'].current) {
                showNotification('Current PIN is incorrect');
                return;
              }
              
              if (newPin && newPin !== confirmPin) {
                showNotification('New PINs do not match');
                return;
              }
              
              // Update settings
              settingsData['pin'].enabled = enabled;
              if (newPin) {
                settingsData['pin'].current = newPin;
              }
              
              showNotification('Purchase PIN settings saved');
            });
          }
          break;
          
        case 'default-channel':
          const saveChannelButton = panel.querySelector('#save-default-channel');
          if (saveChannelButton) {
            saveChannelButton.addEventListener('click', () => {
              const channel = panel.querySelector('#default-channel-select').value;
              settingsData['default-channel'].current = channel;
              showNotification(`Default channel set to ${channel}`);
            });
          }
          break;
          
        case 'account':
          const accountButtons = panel.querySelectorAll('.account-actions button');
          accountButtons.forEach(button => {
            button.addEventListener('click', () => {
              showNotification(`${button.textContent} functionality will be available soon`);
            });
          });
          break;
          
        case 'accessibility':
          const saveAccessibilityButton = panel.querySelector('#save-accessibility');
          if (saveAccessibilityButton) {
            saveAccessibilityButton.addEventListener('click', () => {
              // Get values
              const cc = panel.querySelector('#cc-toggle').checked;
              const fontSize = panel.querySelector('#font-size').value;
              const fontColor = panel.querySelector('#font-color').value;
              const talkback = panel.querySelector('#talkback-toggle').checked;
              const highContrast = panel.querySelector('#contrast-toggle').checked;
              
              // Update settings
              settingsData['accessibility'].closedCaptions = cc;
              settingsData['accessibility'].fontSize = fontSize;
              settingsData['accessibility'].fontColor = fontColor;
              settingsData['accessibility'].talkback = talkback;
              settingsData['accessibility'].highContrast = highContrast;
              
              showNotification('Accessibility settings saved');
            });
          }
          break;
          
        case 'help':
          const topicItems = panel.querySelectorAll('.topic-item');
          topicItems.forEach(item => {
            item.addEventListener('click', () => {
              const topic = item.querySelector('span').textContent;
              showNotification(`Opening help for: ${topic}`);
            });
          });
          
          const checkUpdatesButton = panel.querySelector('#check-updates');
          if (checkUpdatesButton) {
            checkUpdatesButton.addEventListener('click', () => {
              showNotification('Checking for updates...');
              setTimeout(() => {
                showNotification('Your firmware is up to date');
              }, 2000);
            });
          }
          break;
      }
    }
    
    // Show a dialog for confirmations
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
  
    // Initialize Settings Manager
    if (typeof SettingsManager === 'function') {
      window.settingsManager = new SettingsManager();
    }
  });
  