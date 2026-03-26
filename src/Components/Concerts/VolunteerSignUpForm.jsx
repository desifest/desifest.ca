import { useState } from "react";
import toast from "react-hot-toast";

export default function VolunteerSignupForm() {
  const genres = [
    "June 19th (Afternoon / Evening)",
    "June 20th (Morning)",
    "June 20th (Afternoon – Evening)",
    "General Volunteering",
    "SKILL BASED VOLUNTEERING (eg. sponsorship, planning, media, activation)",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+1",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    genre: "",
    linkedin: "",
    howCanYouHelp: "",
    howCanWeHelpYou: "",
    consent: false,
    website_url: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // optional: validation
  if (!formData.consent) {
    toast.error("Please agree to be contacted");
    return;
  }
  const toastId = toast.loading("Submitting form...");

  try {
    const res = await fetch(
      "/api/volunteer-signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    toast.success("Form submitted successfully 🎉", { id: toastId });

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "+1",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
      genre: "",
      linkedin: "",
      howCanYouHelp: "",
      howCanWeHelpYou: "",
      consent: false,
    });
  } catch (err) {
    toast.error("Something went wrong ❌", { id: toastId });
    console.error(err);
  }
};


  const emailError =
    formData.email.length > 0 && !formData.email.includes("@")
      ? "Not a valid mailID"
      : "";

  return (
    <div className="w-full mx-auto px-2 py-6 md:p-10 text-blue-black">
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden', tabIndex: -1 }}>
        <label htmlFor="hp_vol_website_url">Website</label>
        <input type="text" id="hp_vol_website_url" name="website_url" value={formData.website_url} onChange={handleChange} autoComplete="off" />
      </div>
      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-10">
        <Input
          label="Name*"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />

        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />

        <Input
          label="Work Email*"
          type="email"
          name="email"
          placeholder="abcd@gmail.com"
          value={formData.email}
          onChange={handleChange}
          error={emailError}
        />

        {/* Phone with country code selector */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-blue-black">Phone</label>

          <div className="flex items-center gap-2 border-b border-[#6F6486] py-2">
            <select
              name="phoneCode"
              value={formData.phoneCode}
              onChange={handleChange}
              className="bg-transparent text-sm text-blue-black outline-none"
            >
              <option>+91</option>
              <option>+1</option>
              <option>+44</option>
            </select>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number here"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <Input
          label="LinkedIn URL"
          name="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={formData.linkedin}
          onChange={handleChange}
        />

        <div className="md:col-span-2 flex flex-col gap-4">
          <label className="text-sm text-blue-black">Address</label>

          {/* Address line + City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            <Input
              placeholder="Address Line*"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

            <Input
              placeholder="Enter your City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          {/* Province / Postal / Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-4">
            <Input
              placeholder="Enter your Province"
              name="province"
              value={formData.province}
              onChange={handleChange}
            />

            <Input
              placeholder="Enter your Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />

            <div className="flex flex-col gap-1">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="bg-transparent border-b border-[#6F6486] py-2 text-sm"
              >
                <option value="">Choose your country</option>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* GENRE */}
      <div className="mb-5">
        {/* GENRE */}
        <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-blue-black">
          Genre
        </p>

        <div className="flex flex-wrap items-center max-w-5xl gap-3">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, genre }))}
              className={`px-4 py-2 border text-xs uppercase font-medium transition
  ${
    formData.genre === genre
      ? "bg-light-lavender text-blue-black border-blue-black"
      : "border-blue-black text-blue-black"
  }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* AGREEMENT */}
      <div className="flex flex-col gap-2 mb-10 mt-10">
        <label className="text-md font-medium text-blue-black">
          How Can You Help? <br /> Please share a little about yourself, any
          past volunteer experience (including with us) and what skills or
          experiences can you bring to our shows this year.
        </label>

        <textarea
          rows={2}
          name="howCanYouHelp"
          value={formData.howCanYouHelp}
          onChange={handleChange}
          placeholder=""
          className="
      w-full
      bg-transparent
      border-b
      border-[#6F6486]
      resize-none
      text-sm
      text-blue-black
      outline-none
      placeholder:text-[#9C92B3]
      py-2
    "
        />
      </div>

      <div className="flex flex-col gap-2 mb-10">
        <label className="text-md font-medium text-blue-black">
          How Can We Help You?
          <br /> What experiences are you looking to achieve while working with
          DESIFEST?
        </label>

        <textarea
          rows={2}
          name="howCanWeHelpYou"
          value={formData.howCanWeHelpYou}
          onChange={handleChange}
          placeholder=""
          className="
      w-full
      bg-transparent
      border-b
      border-[#6F6486]
      resize-none
      text-sm
      text-blue-black
      outline-none
      placeholder:text-[#9C92B3]
      py-2
    "
        />
      </div>

      <label className="flex items-center py-10">
        <input
          type="checkbox"
          className="mr-2 w-4 h-4 text-blue-black border-gray-300 rounded "
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
        />
        I agree to be contacted about sponsorship opportunities
      </label>
      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        type="submit"
        className="bg-neon-yellow hover:bg-lime-300 p-3 text-xl font-bold uppercase transition shadow-md"
      >
        Submit
      </button>

      <div className="py-10 font-medium text-blue-black text-xl">
        We appreciate your interest and frankly, DESIFEST is a community project
        and volunteers like you have made it possible for the past 18 years. If
        you are not not already following us, please follow us on Instagram
        @desifestmusic or on FB to stay updated on all activities this year.
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Input({
  label,
  placeholder,
  error,
  type = "text",
  value,
  onChange,
  name,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-md text-blue-black">{label}</label>}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={
          "bg-transparent border-b text-sm outline-none py-2 placeholder:text-[#9C92B3] text-blue-black " +
          (error ? "border-red-500" : "border-[#6F6486]")
        }
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
