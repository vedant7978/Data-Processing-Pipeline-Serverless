import React from "react";

const StatsDashboard = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-5xl p-4">
        {/* Embedded Looker Studio Dashboard */}
        <iframe
          title="Looker Studio Dashboard"
          width="100%"
          height="600"
          src="https://lookerstudio.google.com/embed/reporting/69ac9765-1e1d-4cc9-9d34-847905aa7e73/page/xujWE"
          frameBorder="0"
          style={{ border: "0" }}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
      </div>
    </div>
  );
};

export default StatsDashboard;
