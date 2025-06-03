import { useParams } from "react-router-dom";
import {
  localGroupsList,
  localGroupPosts,
} from "../../../Static/communityData";
import Posts from "../../Components/Community/posts/Posts";
import Share from "../../Components/Community/share/Share";
import "./groupPage.scss";
import { useState, useEffect } from "react";

const GroupPage = () => {
  const { groupId } = useParams();
  const parsedGroupId = parseInt(groupId);

  // State
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedGroup, setEditedGroup] = useState(null);

  // Current user
  const currentUser = {
    id: 1,
    name: "Muhammed Taha",
  };

  // Load group & posts
  useEffect(() => {
    const foundGroup = localGroupsList.find((g) => g.id === parsedGroupId);
    if (foundGroup) {
      setGroup(foundGroup);
      setPosts(localGroupPosts[parsedGroupId] || []);
      setEditedGroup(foundGroup);
    }
  }, [parsedGroupId]);

  if (!group) return <div className="groupPage">Group not found.</div>;

  const isFounder = group.founderId === currentUser.id;
  const isCoFounder = group.membersList?.some(
    (m) => m.id === currentUser.id && m.role === "Co-founder"
  );
  const hasManagePermission = isFounder || isCoFounder;
  const isMember = group.membersList.some((m) => m.id === currentUser.id);

  // Join/Leave group functionality
  const toggleMembership = () => {
    if (isFounder) return; // Founder cannot leave their own group

    if (isMember) {
      // Leave group
      const updatedMembers = group.membersList.filter((m) => m.id !== currentUser.id);
      const updatedGroup = {
        ...group,
        membersList: updatedMembers,
        members: group.members - 1,
      };
      
      // Update global data
      const idx = localGroupsList.findIndex((g) => g.id === group.id);
      if (idx !== -1) localGroupsList[idx] = updatedGroup;
      
      setGroup(updatedGroup);
    } else {
      // Join group
      const newMember = {
        id: currentUser.id,
        name: currentUser.name,
        role: "Member",
        joinDate: new Date().toLocaleDateString(),
      };
      
      const updatedGroup = {
        ...group,
        membersList: [...group.membersList, newMember],
        members: group.members + 1,
      };
      
      // Update global data
      const idx = localGroupsList.findIndex((g) => g.id === group.id);
      if (idx !== -1) localGroupsList[idx] = updatedGroup;
      
      setGroup(updatedGroup);
    }
  };

  // Promote member
  const promoteToCoFounder = (memberId) => {
    if (!isFounder) return;
    const updatedMembers = group.membersList.map((m) =>
      m.id === memberId ? { ...m, role: "Co-founder" } : m
    );
    const updatedGroup = { ...group, membersList: updatedMembers };
    const idx = localGroupsList.findIndex((g) => g.id === group.id);
    if (idx !== -1) localGroupsList[idx] = updatedGroup;
    setGroup(updatedGroup);
  };

  // Remove member
  const removeMember = (memberId) => {
    if (!hasManagePermission || memberId === group.founderId) return;
    const updatedMembers = group.membersList.filter((m) => m.id !== memberId);
    const updatedGroup = {
      ...group,
      membersList: updatedMembers,
      members: group.members - 1,
    };
    const idx = localGroupsList.findIndex((g) => g.id === group.id);
    if (idx !== -1) localGroupsList[idx] = updatedGroup;
    setGroup(updatedGroup);
  };

  // Update group info
  const updateGroupInfo = () => {
    if (!hasManagePermission || !editedGroup) return;
    const idx = localGroupsList.findIndex((g) => g.id === group.id);
    if (idx !== -1) localGroupsList[idx] = editedGroup;
    setGroup(editedGroup);
    setShowEditModal(false);
  };

  return (
    <div className="groupPage">
      {/* Group Header */}
      <div className="groupHeader">
        <img src={group.img} alt={group.name} className="groupBanner" />
        <div className="groupInfo">
          <h2>{group.name}</h2>
          <p>{group.description}</p>
          <small>
            {group.members} Members • {group.type}
          </small>
          <div className="groupActions">
            {/* Join/Leave Button - only show if not founder */}
            {!isFounder && (
              <button
                className={`membershipBtn ${isMember ? "leave" : "join"}`}
                onClick={toggleMembership}
              >
                {isMember ? "Leave Group" : "Join Group"}
              </button>
            )}
            
            <button
              className="membersBtn"
              onClick={() => setShowMembersModal(true)}
            >
              View Members
            </button>
            
            {hasManagePermission && (
              <button
                className="editGroupBtn"
                onClick={() => setShowEditModal(true)}
              >
                Edit Group
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Share Component for Creating Post */}
      <div className="createPostSection">
        {isMember && (
          <Share
            onShare={(newPost) => {
              // Update local state immediately for better UX
              setPosts([newPost, ...posts]);
              // Update global data in background
              if (!localGroupPosts[group.id]) localGroupPosts[group.id] = [];
              localGroupPosts[group.id].unshift(newPost);
            }}
          />
        )}
      </div>

      {/* Posts Section */}
      <div className="groupPosts">
        <div className="postsHeader">
          <h3>Posts</h3>
        </div>
        {posts.length === 0 ? (
          <p className="emptyPostsMessage">No posts yet in this group.</p>
        ) : (
          <Posts
            posts={posts.map((p) => ({
              ...p,
              groupName: group.name,
              userRole:
                group.membersList.find((m) => m.name === p.user)?.role ||
                "Member",
            }))}
          />
        )}
      </div>

      {/* Modals */}
      {/* You can keep the same modals from your original file */}
      {/* or use simplified versions if needed */}
    </div>
  );
};

export default GroupPage;