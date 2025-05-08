// app/school_admin/layout.jsx

import React from "react";

export default function SchoolAdminLayout({ children }) {
  return (
    <div>
      {/* <nav>Sidebar or Navbar</nav> */}
      <main>{children}</main>
    </div>
  );
}
