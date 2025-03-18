import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';
import NavbarAdmin from '../admin/NavbarAdmin';
import NavbarEmployee from '../employee/NavbarEmployee';
import NavbarEmployer from '../employer/NavbarEmployer';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0); // New state for total unread messages
  const messagesEndRef = useRef(null); // Add ref for auto-scrolling
  const messageInputRef = useRef(null);
  const currentUser = {
    id: sessionStorage.getItem('userId'),
    name: sessionStorage.getItem('name'),
    role: sessionStorage.getItem('role')?.toLowerCase()
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [profilePicCache, setProfilePicCache] = useState({});

  // Simple emoji list
  const emojis = ['😊', '😂', '😍', '👍', '❤️', '🎉', '👋', '🤔', '😭', '🙏'];

  useEffect(() => {
    // Initial fetch
    const initialFetch = async () => {
      await fetchUsers();
      // Only fetch last messages after users are loaded
      if (users.length > 0) {
        await fetchLastMessages();
      }
    };
    
    initialFetch();
    
    // Set up separate intervals for users and messages
    const userInterval = setInterval(async () => {
      await fetchUsers();
    }, 30000); // Fetch users every 30 seconds
    
    const messageInterval = setInterval(() => {
      if (users.length > 0) {
        fetchLastMessages();
      }
      if (selectedUser) {
        fetchMessages();
      }
    }, 10000); // Fetch messages every 10 seconds
    
    return () => {
      clearInterval(userInterval);
      clearInterval(messageInterval);
    };
  }, []); // Empty dependency array to run only once on mount

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Calculate total unread messages
  useEffect(() => {
    let total = 0;
    Object.values(unreadCounts).forEach(count => {
      total += count;
    });
    setTotalUnreadCount(total);
  }, [unreadCounts]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/chat/chat-users', {
        params: {
          userId: currentUser.id
        }
      });

      // Filter out current user
      const filteredUsers = response.data.filter(user => user._id !== currentUser.id);
      
      if (filteredUsers.length > 0) {
        setUsers(prevUsers => {
          // If we already have users, merge them with new ones to prevent flickering
          if (prevUsers.length > 0) {
            // Create a map of existing users for quick lookup
            const existingUserMap = new Map(prevUsers.map(user => [user._id, user]));
            
            // Update existing users with new data and add new users
            filteredUsers.forEach(user => {
              existingUserMap.set(user._id, user);
            });
            
            return Array.from(existingUserMap.values());
          }
          
          return filteredUsers;
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Don't clear users on error
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const response = await axios.get(`http://localhost:3000/api/chat/messages/${currentUser.id}/${selectedUser._id}`);
      
      // Sort messages by timestamp
      const sortedMessages = response.data.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      
      setMessages(sortedMessages);
      
      // Mark messages as read when user opens the conversation
      if (unreadCounts[selectedUser._id] > 0) {
        try {
          await axios.put(`http://localhost:3000/api/chat/mark-read/${currentUser.id}/${selectedUser._id}`);
          // Update unread counts
          setUnreadCounts(prev => ({
            ...prev,
            [selectedUser._id]: 0
          }));
        } catch (err) {
          console.error('Error marking messages as read:', err);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchLastMessages = async () => {
    if (!users || users.length === 0) return;
    
    try {
      // Create a new object to store last messages
      const newLastMsgs = {...lastMessages};
      const newUnread = {...unreadCounts};
      
      // Fetch last messages for all users at once
      const response = await axios.get(`http://localhost:3000/api/chat/all-last-messages/${currentUser.id}`);
      
      if (response.data && response.data.length > 0) {
        // Process all messages at once
        response.data.forEach(item => {
          if (item.message) {
            const otherUserId = item.otherUserId;
            newLastMsgs[otherUserId] = item.message;
            newUnread[otherUserId] = item.unreadCount || 0;
          }
        });
        
        // Update state with new messages and unread counts
        setLastMessages(newLastMsgs);
        setUnreadCounts(newUnread);
        
        // Sort users based on last message timestamp
        const sortedUsers = [...users].sort((a, b) => {
          // Get timestamps or use 0 if no message exists
          const timeA = newLastMsgs[a._id]?.timestamp ? new Date(newLastMsgs[a._id].timestamp).getTime() : 0;
          const timeB = newLastMsgs[b._id]?.timestamp ? new Date(newLastMsgs[b._id].timestamp).getTime() : 0;
          
          // Sort in descending order (newest first)
          return timeB - timeA;
        });
        
        // Update users list with sorted order
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Error in fetchLastMessages:', error);
    }
  };

  // Format message timestamps
  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    // If message is from today, show only time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If message is from this year, show date without year
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
             ' ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show full date
    return messageDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) +
           ' ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/chat/upload', formData);
      const fileUrl = response.data.fileUrl;

      setSelectedFile({
        name: file.name,
        url: fileUrl,
        type: file.type
      });

      setNewMessage(prev => prev.trim());
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojis(false);
    messageInputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    if (!selectedUser || !currentUser.id) return;

    try {
      const messageContent = selectedFile 
        ? `${newMessage.trim()} [${selectedFile.type.startsWith('image/') ? 'Image' : 'File'}: ${selectedFile.name}]`
        : newMessage.trim();

      const response = await axios.post('http://localhost:3000/api/chat/messages', {
        sender: currentUser.id,
        senderType: currentUser.role,
        receiver: selectedUser._id,
        receiverType: selectedUser.role,
        content: messageContent,
        fileUrl: selectedFile?.url || null
      });

      setNewMessage('');
      setSelectedFile(null);
      await fetchMessages();
      
      // Focus on input after sending message
      messageInputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      alert('Failed to send message. Please try again.');
    }
  };

  // Message content component
  const MessageContent = ({ message }) => {
    if (message.fileUrl) {
      if (message.fileType && message.fileType.startsWith('image/')) {
        return (
          <div>
            <img 
              src={`http://localhost:3000${message.fileUrl}`} 
              alt="Shared" 
              style={styles.messageImage}
              onClick={() => window.open(`http://localhost:3000${message.fileUrl}`, '_blank')}
            />
            {message.content && <p style={{...styles.messageText, display: 'block'}}>{message.content}</p>}
          </div>
        );
      } else {
        return (
          <div>
            <a 
              href={`http://localhost:3000${message.fileUrl}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.fileLink}
            >
              <i className="bi bi-file-earmark"></i>
              Download File
            </a>
            {message.content && <p style={{...styles.messageText, display: 'block'}}>{message.content}</p>}
          </div>
        );
      }
    }
    
    return <div style={{...styles.messageText, display: 'block'}}>{message.content}</div>;
  };

  // Get file URL helper
  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return null;
    return fileUrl.startsWith('http') ? fileUrl : `http://localhost:3000${fileUrl}`;
  };

  // Clear messages when changing users
  useEffect(() => {
    setMessages([]); // Clear messages when changing users
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser?._id]); // Only depend on the selected user ID

  // Update the fetchMessages function to reduce polling frequency
  useEffect(() => {
    let interval;
    if (selectedUser) {
      fetchMessages(); // Fetch immediately when user selected
      interval = setInterval(fetchMessages, 10000); // Poll every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedUser?._id]);

  // Add this effect to filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Add this useEffect to preload profile pictures when users are loaded
  useEffect(() => {
    const preloadProfilePics = async () => {
      if (!users.length) return;
      
      // Preload all user profile pictures immediately
      users.forEach(user => {
        if (profilePicCache[user._id]) return; // Skip if already cached
        
        const picUrl = getUserProfilePic(user);
        if (!picUrl) return;
        
        // Create a new image element to preload
        const img = new Image();
        img.onload = () => {
          setProfilePicCache(prev => ({ ...prev, [user._id]: picUrl }));
        };
        img.onerror = () => {
          // Cache the fact that no image exists
          setProfilePicCache(prev => ({ ...prev, [user._id]: null }));
        };
        img.src = picUrl;
      });
    };
    
    preloadProfilePics();
  }, [users]);

  // Add a new useEffect to immediately load the selected user's profile picture
  useEffect(() => {
    if (!selectedUser || profilePicCache[selectedUser._id]) return;
    
    const picUrl = getUserProfilePic(selectedUser);
    if (!picUrl) return;
    
    // Immediately load the selected user's profile picture
    const img = new Image();
    img.onload = () => {
      setProfilePicCache(prev => ({ ...prev, [selectedUser._id]: picUrl }));
    };
    img.src = picUrl;
  }, [selectedUser]);

  // Add this function to preload all profile pictures at once
  const preloadAllProfilePictures = async () => {
    // Get all unique user IDs from users, messages, and selected user
    const userIds = new Set();
    
    // Add all users
    users.forEach(user => userIds.add(user._id));
    
    // Add message senders and receivers
    messages.forEach(message => {
      userIds.add(message.sender);
      userIds.add(message.receiver);
    });
    
    // Add selected user
    if (selectedUser) {
      userIds.add(selectedUser._id);
    }
    
    // Preload all profile pictures
    Array.from(userIds).forEach(userId => {
      // Skip if already cached
      if (profilePicCache[userId]) return;
      
      // Find the user object
      const user = users.find(u => u._id === userId);
      if (!user) return;
      
      const picUrl = getUserProfilePic(user);
      if (!picUrl) return;
      
      // Preload the image
      const img = new Image();
      img.onload = () => {
        setProfilePicCache(prev => ({ ...prev, [userId]: picUrl }));
      };
      img.src = picUrl;
    });
  };

  // Call this function whenever users or messages change
  useEffect(() => {
    preloadAllProfilePictures();
  }, [users, messages, selectedUser]);

  // Add this useEffect to force preload all profile pictures when the component mounts
  useEffect(() => {
    const forcePreloadAllProfilePics = async () => {
      if (!users.length) return;
      
      // Create a batch of promises to load all profile pictures
      const loadPromises = users.map(user => {
        return new Promise((resolve) => {
          if (profilePicCache[user._id]) {
            resolve(); // Already cached
            return;
          }
          
          const picUrl = getUserProfilePic(user);
          if (!picUrl) {
            resolve(); // No URL available
            return;
          }
          
          // Create a new image element to preload
          const img = new Image();
          img.onload = () => {
            setProfilePicCache(prev => ({ ...prev, [user._id]: picUrl }));
            resolve();
          };
          img.onerror = () => {
            setProfilePicCache(prev => ({ ...prev, [user._id]: null }));
            resolve();
          };
          img.src = picUrl;
        });
      });
      
      // Wait for all images to load
      await Promise.all(loadPromises);
    };
    
    forcePreloadAllProfilePics();
  }, [users]);

  const renderNavbar = () => {
    const NavbarComponent = (() => {
    switch (currentUser.role.toLowerCase()) {
      case 'admin':
          return NavbarAdmin;
      case 'employee':
          return NavbarEmployee;
      case 'employer':
          return NavbarEmployer;
      default:
        return null;
    }
    })();

    // Pass the unread count to the navbar component
    return NavbarComponent ? (
      <NavbarComponent unreadMessageCount={totalUnreadCount} />
    ) : null;
  };

  // Message component
  const Message = ({ message }) => {
    const isCurrentUser = message.sender === currentUser.id;
    const otherUserId = isCurrentUser ? message.receiver : message.sender;
    const profilePic = profilePicCache[otherUserId];
    
    // Find the user object for the message sender/receiver
    const messageUser = users.find(u => u._id === otherUserId);
    const userInitial = messageUser ? messageUser.name.charAt(0).toUpperCase() : '?';
    
    return (
      <div 
        className={`message ${isCurrentUser ? 'sent' : 'received'}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
          marginBottom: '15px',
          width: '100%'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          maxWidth: '85%'
        }}>
          {!isCurrentUser && (
            <div style={{
              ...styles.userAvatar,
              width: '30px',
              height: '30px',
              marginRight: '8px',
              marginLeft: '0',
              overflow: 'hidden',
              backgroundColor: '#128C7E' // Use green color
            }}>
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt={messageUser?.name || 'User'} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.textContent = userInitial;
                  }}
                />
              ) : (
                userInitial
              )}
            </div>
          )}
          <div style={{
            ...isCurrentUser ? styles.sentMessage : styles.receivedMessage
          }}>
            <MessageContent message={message} />
          </div>
        </div>
        <span style={{
          ...styles.messageTime,
          position: 'static',
          marginTop: '4px',
          textAlign: isCurrentUser ? 'right' : 'left',
          paddingLeft: isCurrentUser ? '0' : '8px',
          paddingRight: isCurrentUser ? '8px' : '0'
        }}>
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    );
  };

  // Update the getUserProfilePic function to be more robust
  const getUserProfilePic = (user) => {
    if (!user || !user._id) return null;
    
    // Check if the user is an employer or employee
    const role = user.role?.toLowerCase() || '';
    
    if (role === 'employer') {
      // For employers, check the profile collection
      return `http://localhost:3000/profile/logo/${user._id}`;
    } else if (role === 'employee') {
      // For employees, check the employee profile collection
      return `http://localhost:3000/Employeeprofile/photo/${user._id}`;
    }
    
    // Default fallback
    return null;
  };

  // Update the UserItem component to properly display profile pictures
  const UserItem = ({ user }) => {
    const isActive = selectedUser && selectedUser._id === user._id;
    const unreadCount = unreadCounts[user._id] || 0;
    const lastMessage = lastMessages[user._id];
    const profilePic = profilePicCache[user._id];
    const userInitial = user.name.charAt(0).toUpperCase();
    
    // If profile pic isn't in cache yet, try to load it immediately
    useEffect(() => {
      if (!profilePic && user._id) {
        const picUrl = getUserProfilePic(user);
        if (picUrl) {
          const img = new Image();
          img.onload = () => {
            setProfilePicCache(prev => ({ ...prev, [user._id]: picUrl }));
          };
          img.src = picUrl;
        }
      }
    }, [user._id, profilePic]);
    
    return (
      <div 
        className={`user-item ${isActive ? 'active' : ''}`}
        style={{
          ...styles.userItem,
          ...(isActive ? styles.activeUser : {}),
          ...(unreadCount > 0 ? styles.unreadUserItem : {})
        }}
        onClick={() => setSelectedUser(user)}
      >
        <div style={{
          ...styles.userAvatar,
          overflow: 'hidden', // Ensure the image doesn't overflow
          backgroundColor: '#128C7E' // Use green color
        }}>
          {profilePic ? (
            <img 
              src={profilePic} 
              alt={user.name} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.textContent = userInitial;
              }}
            />
          ) : (
            userInitial
          )}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userNameContainer}>
            <h4 style={styles.userName}>{user.name}</h4>
            {unreadCount > 0 && (
              <div style={styles.unreadCount}>
                {unreadCount}
              </div>
            )}
          </div>
          <p style={styles.userRole}>{user.role}</p>
          {lastMessage && (
            <div style={styles.lastMessage}>
              {lastMessage.fileUrl ? (
                lastMessage.fileType?.startsWith('image/') ? '📷 Image' : '📎 File'
              ) : (
                lastMessage.content.length > 25 
                  ? `${lastMessage.content.substring(0, 25)}...` 
                  : lastMessage.content
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Also update the renderUserList function to use our updated UserItem component
  const renderUserList = () => {
    if (loading) {
      return (
        <div style={styles.loadingSpinner}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
          {searchQuery ? 'No users match your search' : 'No users available'}
        </div>
      );
    }

    return filteredUsers.map(user => (
      <UserItem key={user._id} user={user} />
    ));
  };

  // Update the ChatHeader component to use the cache
  const ChatHeader = ({ selectedUser }) => {
    const profilePic = profilePicCache[selectedUser?._id];
    
    if (!selectedUser) return null;
    
    return (
      <div style={{
        ...styles.chatHeader,
        backgroundColor: '#128C7E' // Change to green color
      }}>
        <div style={{
          ...styles.userAvatar,
          overflow: 'hidden' // Ensure the image doesn't overflow
        }}>
          {profilePic ? (
            <img 
              src={profilePic} 
              alt={selectedUser.name} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.textContent = selectedUser.name.charAt(0).toUpperCase();
              }}
            />
          ) : (
            selectedUser.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedUser.name}</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>{selectedUser.role}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderNavbar()}
      <div style={styles.chatContainer}>
        <div style={styles.chatSidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.headerText}>
              <i className="bi bi-chat-dots"></i> Conversations
            </h3>
          </div>
          
          {/* Add search input */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
          
          <div className="users-list" style={{ overflowY: 'auto', height: 'calc(100% - 120px)' }}>
            {renderUserList()}
          </div>
        </div>
        <div style={styles.chatMain}>
          {selectedUser ? (
            <>
              <ChatHeader selectedUser={selectedUser} />
              <div style={styles.messagesContainer}>
                {messages.map((message, index) => (
                  <Message key={message._id || index} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} style={styles.messageForm}>
                {isUploading && (
                  <div style={styles.uploadingIndicator}>
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span>Uploading file...</span>
                  </div>
                )}
                
                {selectedFile && (
                  <div style={styles.selectedFileContainer}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        {selectedFile.type.startsWith('image/') ? '📷 ' : '📎 '}
                        {selectedFile.name}
                      </span>
                      <button 
                        onClick={() => setSelectedFile(null)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px' }}>
                  <button 
                    style={styles.actionButton}
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    <i className="bi bi-paperclip"></i>
                  </button>
                  
                  <input
                    id="file-input"
                    type="file"
                    onChange={handleFileUpload}
                    style={styles.fileInput}
                  />
                  
                  <input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    style={styles.messageInput}
                  />
                  
                  <button 
                    style={styles.actionButton}
                    onClick={() => setShowEmojis(!showEmojis)}
                  >
                    <i className="bi bi-emoji-smile"></i>
                  </button>
                  
                  <button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim() && !selectedFile}
                    style={{
                      ...styles.sendButton,
                      opacity: (!newMessage.trim() && !selectedFile) ? 0.6 : 1
                    }}
                  >
                    <i className="bi bi-send-fill"></i>
                  </button>
                </div>
                
                {showEmojis && (
                  <div style={styles.emojiContainer}>
                    {emojis.map((emoji, index) => (
                      <button 
                        key={index} 
                        onClick={() => addEmoji(emoji)}
                        style={styles.emojiButton}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </>
          ) : (
            <div style={styles.noSelectedUser}>
              <i className="bi bi-chat-dots" style={{ fontSize: '3rem', color: '#128C7E' }}></i>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  chatContainer: {
    display: 'flex',
    height: 'calc(100vh - 100px)',
    margin: '20px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 5px 25px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff'
  },
  chatSidebar: {
    width: '320px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #dee2e6',
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarHeader: {
    padding: '20px',
    backgroundColor: '#360275',
    color: 'white',
    borderTopLeftRadius: '10px'
  },
  headerText: {
    margin: 0,
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  usersList: {
    overflowY: 'auto',
    height: 'calc(100% - 70px)',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid #dee2e6',
    position: 'relative'
  },
  activeUser: {
    backgroundColor: '#e3f2fd',
    borderLeft: '4px solid #360275'
  },
  unreadUserItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#128C7E', // WhatsApp green
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginRight: '15px',
    overflow: 'hidden' // Ensure the image doesn't overflow
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    margin: 0,
    fontSize: '1rem',
  },
  userRole: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#6c757d',
  },
  chatMain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  chatHeader: {
    padding: '12px 16px',
    backgroundColor: '#128C7E', // WhatsApp green
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #075E54', // Darker green border
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  selectedUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#e5ddd5', // WhatsApp background
    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgJDh0KGKxUZAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAANklEQVQ4y2NgGAWjgBqABYh9gNiHSvr/A3EAEwOVAcOgGYFAHEAl/QGjYdAwGgDxaLKhKQAAE5oIBqeRsXMAAAAASUVORK5CYII=")',
    backgroundRepeat: 'repeat'
  },
  message: {
    marginBottom: '15px',
    display: 'flex',
    
  },
  messageContent: {
    maxWidth: '70%',
    padding: '10px 15px',
    borderRadius: '15px',
    position: 'relative',
    
  },
  sentMessage: {
    backgroundColor: '#dcf8c6', // WhatsApp green
    borderRadius: '8px 0px 8px 8px', // Adjust border radius
    padding: '8px 12px', // Normal padding
    maxWidth: '85%',
    marginBottom: '2px',
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    wordBreak: 'break-word',
    display: 'inline-block', // Ensure proper text wrapping
    width: 'auto', // Let the width be determined by content
    textAlign: 'left' // Ensure text alignment is left
  },
  receivedMessage: {
    backgroundColor: 'white',
    borderRadius: '0px 8px 8px 8px', // Adjust border radius
    padding: '8px 12px', // Normal padding
    maxWidth: '85%',
    marginBottom: '2px',
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    wordBreak: 'break-word',
    display: 'inline-block', // Ensure proper text wrapping
    width: 'auto', // Let the width be determined by content
    textAlign: 'left' // Ensure text alignment is left
  },
  messageText: {
    margin: '0',
    wordBreak: 'break-word',
    fontSize: '0.95rem',
    lineHeight: '1.4',
    whiteSpace: 'normal', // Changed from pre-wrap to normal
    display: 'block' // Changed from inline to block
  },
  messageTime: {
    fontSize: '0.6rem',
    color: '#8e8e8e',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  messageForm: {
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column'
  },
  messageInput: {
    flex: 1,
    padding: '9px 12px',
    borderRadius: '21px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'white',
    fontSize: '0.95rem'
  },
  sendButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#128c7e', // WhatsApp light green
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  noSelectedUser: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6c757d',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  noUsers: {
    textAlign: 'center',
    padding: '20px',
    color: '#6c757d',
  },
  noUsersIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  messageActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f8f9fa',
    padding: '8px 12px',
    borderRadius: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.2rem',
    '&:hover': {
      color: '#128c7e',
    },
  },
  fileInput: {
    display: 'none',
  },
  emojiContainer: {
    position: 'absolute',
    bottom: '80px',
    right: '20px',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    maxWidth: '200px',
  },
  emojiButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
    padding: '5px',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  fileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: 'inherit',
    textDecoration: 'none',
    padding: '5px',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: '5px',
    marginBottom: '5px',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
  },
  uploadingIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#f0f8ff',
    borderRadius: '5px',
    marginBottom: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    animation: 'fadeIn 0.3s ease'
  },
  unreadIndicator: {
    width: '10px',
    height: '10px',
    backgroundColor: '#4CAF50',
    borderRadius: '50%',
    marginLeft: '8px',
    animation: 'pulse 1.5s infinite'
  },
  unreadCount: {
    backgroundColor: '#128C7E', // WhatsApp green
    color: 'white',
    borderRadius: '50%',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    padding: '0 5px'
  },
  lastMessage: {
    fontSize: '0.8rem',
    color: '#6c757d',
    marginTop: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '200px'
  },
  userNameContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  messageImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '5px',
    marginBottom: '5px',
    objectFit: 'contain',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  selectedFileContainer: {
    padding: '8px 12px',
    backgroundColor: '#f0f8ff',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  },
  searchContainer: {
    padding: '10px 15px',
    borderBottom: '1px solid #dee2e6',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchInput: {
    width: '100%',
    padding: '8px 30px 8px 12px',
    borderRadius: '20px',
    border: '1px solid #dee2e6',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    '&:focus': {
      borderColor: '#360275',
      boxShadow: '0 0 0 3px rgba(54, 2, 117, 0.1)'
    }
  },
  clearSearchButton: {
    position: 'absolute',
    right: '25px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#6c757d',
    '&:hover': {
      color: '#343a40'
    }
  },
  messageContentWrapper: {
    position: 'relative',
    width: '100%'
  },
};

export default Chat; 