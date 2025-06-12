import { useState, useEffect } from "react";
import {
  localGroupsList,
  localGroupPosts,
} from "../../../Static/communityData";
import "../../../CSS/Pages/Community/groups.scss";
import { useNavigate } from "react-router-dom";
import Posts from "../../Components/Community/Posts";

const Groups = () => {
  const navigate = useNavigate();

  // User state
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false);
  
  // Form state for creating group
  const [createGroupForm, setCreateGroupForm] = useState({
    name: "",
    description: "",
    img: "",
    imgFile: null,
    type: "Public" // Public or Private
  });

  // Current user
  const currentUser = {
    id: 1,
    name: "Muhammed Taha",
  };

  // Load joined and available groups on mount
  useEffect(() => {
    const joined = localGroupsList.filter((group) =>
      group.membersList.some((member) => member.id === currentUser.id)
    );
    const available = localGroupsList.filter(
      (group) => !group.membersList.some((member) => member.id === currentUser.id)
    );
    
    setJoinedGroups(joined);
    setAvailableGroups(available);
  }, []);

  // Join group (only join, no leave functionality here)
  const joinGroup = (group) => {
    // Add user as member
    const updatedGroup = {
      ...group,
      membersList: [
        ...(group.membersList || []),
        {
          id: currentUser.id,
          name: currentUser.name,
          role: "Member",
          joinDate: new Date().toLocaleDateString(),
        },
      ],
      members: group.members + 1,
    };

    // Update localGroupsList directly
    const groupIndex = localGroupsList.findIndex((g) => g.id === group.id);
    if (groupIndex !== -1) {
      localGroupsList[groupIndex] = updatedGroup;
    }

    // Update local state
    setJoinedGroups([...joinedGroups, updatedGroup]);
    setAvailableGroups(availableGroups.filter((g) => g.id !== group.id));
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCreateGroupForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);
      setCreateGroupForm(prev => ({
        ...prev,
        imgFile: file,
        img: imageUrl
      }));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setCreateGroupForm(prev => ({
      ...prev,
      imgFile: null,
      img: ""
    }));
  };

  // Create new group
  const createGroup = (e) => {
    e.preventDefault();
    
    // Validation
    if (!createGroupForm.name.trim() || !createGroupForm.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Generate new group ID
    const newGroupId = Math.max(...localGroupsList.map(g => g.id), 0) + 1;

    // Handle image - use file URL if uploaded, otherwise URL or placeholder
    let groupImage = "https://via.placeholder.com/60x60?text=Group";
    if (createGroupForm.imgFile) {
      // In a real app, you'd upload to a server here
      // For demo purposes, we'll use the blob URL
      groupImage = createGroupForm.img;
    } else if (createGroupForm.img.trim()) {
      groupImage = createGroupForm.img.trim();
    }

    // Create new group object
    const newGroup = {
      id: newGroupId,
      name: createGroupForm.name.trim(),
      description: createGroupForm.description.trim(),
      img: groupImage,
      type: createGroupForm.type,
      members: 1, // Creator is the first member
      membersList: [
        {
          id: currentUser.id,
          name: currentUser.name,
          role: "Founder",
          joinDate: new Date().toLocaleDateString(),
        }
      ],
      createdDate: new Date().toLocaleDateString(),
      createdBy: currentUser.id
    };

    // Add to localGroupsList
    localGroupsList.push(newGroup);

    // Initialize empty posts array for this group
    localGroupPosts[newGroupId] = [];

    // Add to joined groups (creator automatically joins)
    setJoinedGroups([...joinedGroups, newGroup]);

    // Reset form and close popup
    setCreateGroupForm({
      name: "",
      description: "",
      img: "",
      imgFile: null,
      type: "Public"
    });
    setShowCreateGroupPopup(false);
  };

  // Close popup
  const closePopup = () => {
    // Clean up blob URL if exists
    if (createGroupForm.imgFile && createGroupForm.img) {
      URL.revokeObjectURL(createGroupForm.img);
    }
    
    setShowCreateGroupPopup(false);
    setCreateGroupForm({
      name: "",
      description: "",
      img: "",
      imgFile: null,
      type: "Public"
    });
  };

  // Get all posts from joined groups
  const allPosts = joinedGroups.flatMap((group) =>
    (localGroupPosts[group.id] || []).map((post) => ({
      ...post,
      groupName: group.name,
      groupId: group.id,
    }))
  );

  return (
    <div className="groupsPage horizontalLayout">
      {/* Left: Feed */}
      <div className="groupFeed">
        <div className="feedHeader">
          <h3>Latest Updates</h3>
        </div>

        {allPosts.length === 0 ? (
          <p>You haven't joined any groups yet or there are no posts.</p>
        ) : (
          <Posts posts={allPosts} />
        )}
      </div>

      {/* Right: All groups to join/leave */}
      <div className="groupSidebar">
        <div className="groupSidebarHeader">
          <h3>Discover Groups</h3>
          <button 
            className="createGroupBtn"
            onClick={() => setShowCreateGroupPopup(true)}
          >
            Create Group
          </button>
        </div>

        {availableGroups.map((group) => (
          <div className="groupListCard" key={group.id}>
            <img src={group.img} alt={group.name} className="groupThumb" />
            <div className="groupInfo">
              <h4>{group.name}</h4>
              <p>{group.description}</p>
              <small>
                {group.members} Members • {group.type}
              </small>
            </div>
            <button
              className="joinBtn"
              onClick={() => joinGroup(group)}
            >
              Join
            </button>
          </div>
        ))}

        {availableGroups.length === 0 && (
          <p className="noGroupsMessage">You've joined all available groups!</p>
        )}

        {joinedGroups.length > 0 && (
          <div className="joinedGroupsSection">
            <h3>Your Groups</h3>
            {joinedGroups.map((group) => {
              // Check if current user is the founder
              const userRole = group.membersList.find(member => member.id === currentUser.id)?.role;
              
              return (
                <div className="groupListCard" key={group.id}>
                  <img src={group.img} alt={group.name} className="groupThumb" />
                  <div className="groupInfo">
                    <h4>{group.name}</h4>
                    <p>{group.description}</p>
                    <small>
                      {group.members} Members • {group.type}
                      {userRole === "Founder" && <span className="roleTag founder">Founder</span>}
                    </small>
                  </div>
                  <div className="groupCardActions">
                    <button
                      className="viewGroupBtn"
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      View Group
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Group Popup */}
      {showCreateGroupPopup && (
        <div className="popupOverlay" onClick={closePopup}>
          <div className="createGroupPopup" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h3>Create New Group</h3>
              <button className="closeBtn" onClick={closePopup}>×</button>
            </div>
            
            <form onSubmit={createGroup} className="createGroupForm">
              <div className="formGroup">
                <label htmlFor="groupName">Group Name *</label>
                <input
                  type="text"
                  id="groupName"
                  name="name"
                  value={createGroupForm.name}
                  onChange={handleFormChange}
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="groupDescription">Description *</label>
                <textarea
                  id="groupDescription"
                  name="description"
                  value={createGroupForm.description}
                  onChange={handleFormChange}
                  placeholder="Describe your group"
                  rows="3"
                  required
                />
              </div>

              <div className="formGroup">
                <label>Group Image</label>
                <div className="imageUploadSection">
                  {createGroupForm.img ? (
                    <div className="imagePreview">
                      <img src={createGroupForm.img} alt="Group preview" className="previewImg" />
                      <button type="button" className="removeImageBtn" onClick={removeImage}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="imageUploadOptions">
                      <div className="uploadOption">
                        <label htmlFor="imageFile" className="fileUploadBtn">
                          Choose from Computer
                        </label>
                        <input
                          type="file"
                          id="imageFile"
                          accept="image/*"
                          onChange={handleFileChange}
                          hidden
                        />
                      </div>
                      <div className="orDivider">OR</div>
                      <div className="uploadOption">
                        <input
                          type="url"
                          name="img"
                          value={createGroupForm.imgFile ? "" : createGroupForm.img}
                          onChange={handleFormChange}
                          placeholder="Enter image URL"
                          disabled={!!createGroupForm.imgFile}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="formGroup">
                <label htmlFor="groupType">Privacy</label>
                <select
                  id="groupType"
                  name="type"
                  value={createGroupForm.type}
                  onChange={handleFormChange}
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div className="formActions">
                <button type="button" className="cancelBtn" onClick={closePopup}>
                  Cancel
                </button>
                <button type="submit" className="submitBtn">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;