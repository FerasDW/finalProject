export const reportActionButtons = [
  (row) => (
    <button 
      key="view" 
      className="action-btn view-btn"
      onClick={() => {
        // TODO: Implement view report functionality
        console.log("View report:", row);
      }}
    >
      View
    </button>
  ),
  (row) => (
    <button 
      key="download" 
      className="action-btn download-btn"
      onClick={() => {
        // TODO: Implement download report functionality
        console.log("Download report:", row);
      }}
    >
      Download
    </button>
  ),
  (row) => (
    <button 
      key="regenerate" 
      className="action-btn regenerate-btn"
      onClick={() => {
        // TODO: Implement regenerate report functionality
        // This needs to update queryText in the main component
        // Will be handled through a callback passed to the hook
      }}
    >
      Regenerate
    </button>
  )
];