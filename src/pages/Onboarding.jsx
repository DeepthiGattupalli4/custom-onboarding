import { useState, useEffect } from "react";
import axios from "axios";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    aboutMe: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    birthdate: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/config")
      .then((res) => setConfig(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Real-time validation on every change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value.trim()) {
      errorMsg = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    }

    // For email format validation
    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = "Enter a valid email address.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "Enter a valid email address.";
        }
      }

      if (!formData.password.trim())
        newErrors.password = "Password is required.";
    } else {
      const components = config.filter((c) => c.page === step);

      if (
        components.some((c) => c.component === "aboutMe") &&
        !formData.aboutMe.trim()
      ) {
        newErrors.aboutMe = "About Me is required.";
      }
      if (
        components.some((c) => c.component === "birthdate") &&
        !formData.birthdate.trim()
      ) {
        newErrors.birthdate = "Birthdate is required.";
      }
      if (components.some((c) => c.component === "address")) {
        if (!formData.street.trim()) newErrors.street = "Street is required.";
        if (!formData.city.trim()) newErrors.city = "City is required.";
        if (!formData.state.trim()) newErrors.state = "State is required.";
        if (!formData.zip.trim()) newErrors.zip = "Zip is required.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    if (validateStep()) {
      axios
        .post("http://localhost:5000/api/users", formData)
        .then(() => alert("🎉 User data submitted!"))
        .catch((err) => console.error(err));
    }
  };

  const renderFields = () => {
    const components = config.filter((c) => c.page === step);
    return (
      <>
        {components.some((c) => c.component === "aboutMe") && (
          <div>
            <label>About Me:</label>
            <textarea
              name="aboutMe"
              onChange={handleChange}
              value={formData.aboutMe}
            />
            {errors.aboutMe && <p className="error">{errors.aboutMe}</p>}
          </div>
        )}
        {components.some((c) => c.component === "birthdate") && (
          <div>
            <label>Birthdate:</label>
            <input
              type="date"
              name="birthdate"
              onChange={handleChange}
              value={formData.birthdate}
            />
            {errors.birthdate && <p className="error">{errors.birthdate}</p>}
          </div>
        )}
        {components.some((c) => c.component === "address") && (
          <>
            <label>Street:</label>
            <input
              name="street"
              onChange={handleChange}
              value={formData.street}
            />
            {errors.street && <p className="error">{errors.street}</p>}

            <label>City:</label>
            <input name="city" onChange={handleChange} value={formData.city} />
            {errors.city && <p className="error">{errors.city}</p>}

            <label>State:</label>
            <input
              name="state"
              onChange={handleChange}
              value={formData.state}
            />
            {errors.state && <p className="error">{errors.state}</p>}

            <label>Zip:</label>
            <input name="zip" onChange={handleChange} value={formData.zip} />
            {errors.zip && <p className="error">{errors.zip}</p>}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <nav>
        <a href="/">Onboarding</a>
        <a href="/admin">Admin</a>
        <a href="/data">Data Table</a>
      </nav>

      <div className="container fade active">
        <h2>Step {step} of 3</h2>

        {step === 1 && (
          <div>
            <label>Email:</label>
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <label>Password:</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
        )}

        {step > 1 && renderFields()}

        <div className="button-group">
          {step > 1 && <button onClick={handleBack}>Back</button>}
          {step < 3 && <button onClick={handleNext}>Next</button>}
          {step === 3 && <button onClick={handleSubmit}>Submit</button>}
        </div>
      </div>
    </>
  );
};

export default Onboarding;
