import { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [config, setConfig] = useState([]);
  const componentsList = ["aboutMe", "birthdate", "address"];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/config")
      .then((res) => {
        console.log("Admin Config Loaded:", res.data); // Confirm it's loading
        setConfig(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const updateComponentPage = (component, page) => {
    axios
      .post("http://localhost:5000/api/config", {
        component,
        page: parseInt(page),
      })
      .then(() => {
        const updated = config.map((c) =>
          c.component === component ? { ...c, page: parseInt(page) } : c
        );
        setConfig(updated);
        alert(`Saved: ${formatComponentName(component)} set to Page ${page}`);
      })
      .catch((err) => console.error(err));
  };

  const formatComponentName = (comp) => {
    if (comp === "aboutMe") return "About Me";
    if (comp === "birthdate") return "Birthdate";
    if (comp === "address") return "Address";
    return comp;
  };

  // 🔄 Show Loading until config is ready
  if (config.length === 0) {
    return (
      <>
        <div className="container">
          <h2>Loading Admin Config...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <nav>
        <a href="/">Onboarding</a>
        <a href="/admin">Admin</a>
        <a href="/data">Data Table</a>
      </nav>

      <div className="container">
        <h1>Admin Configuration</h1>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Assign each component to Step 2 or Step 3 in the onboarding flow.
        </p>

        {componentsList.map((comp) => {
          // Find existing config for this component
          const compConfig = config.find((c) => c.component === comp);

          // If exists, show current page; if not, default to page 2
          const selectedPage = compConfig ? compConfig.page : 2;

          return (
            <div key={comp} className="admin-config-row">
              <label>{formatComponentName(comp)}:</label>
              <select
                value={selectedPage}
                onChange={(e) => updateComponentPage(comp, e.target.value)}
              >
                <option value={2}>Page 2</option>
                <option value={3}>Page 3</option>
              </select>
            </div>
          );
        })}
        <hr style={{ margin: "40px 0" }} />

        <h2 className="preview-title">Component Previews</h2>

        <div className="preview-container">
          {/* About Me */}
          <div className="preview-card">
            <h3>About Me</h3>
            <textarea
              placeholder="E.g., I love hiking and coding..."
              disabled
            />
          </div>

          {/* Birthdate */}
          <div className="preview-card">
            <h3>Birthdate</h3>
            <input type="date" disabled />
          </div>

          {/* Address */}
          <div className="preview-card">
            <h3>Address</h3>
            <input placeholder="Street Address" disabled />
            <input placeholder="City" disabled />
            <input placeholder="State" disabled />
            <input placeholder="Zip Code" disabled />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
