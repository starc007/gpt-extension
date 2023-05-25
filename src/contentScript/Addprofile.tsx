import React, { FC } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import { useAuth } from "../options/AuthContext";
import { skills } from "../options/skills";

interface Props {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const cmnLabel = "cmnLabel__addPfp";
const cmnClass = "cmnDes__addPfp";

const AddProfile: FC<Props> = ({ setIsVisible }) => {
  const { isLoggedin, AddProfile, formData, setFormData } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleSubmit = async () => {
    if (!isLoggedin) return toast.error("Please login to add profile");
    if (!formData.title || !formData.skills || !formData.bio) {
      return toast.error("Please fill all the fields");
    }
    toast.promise(AddProfile(formData, true), {
      loading: "Adding profile",
      success: "Profile added successfully",
      error: "Something went wrong",
    });
    setIsVisible(false);
  };

  const isButtonDisabled =
    !formData.title ||
    formData.skills.length > 5 ||
    !formData.bio ||
    formData.skills.length < 1;

  return (
    <div
      className="px-4 py-6"
      style={{
        padding: "1.5rem 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={chrome.runtime.getURL("user.svg")}
          alt="user"
          style={{
            width: "3rem",
            height: "3rem",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "1rem",
          }}
        >
          <h1 className="pfp__h1">Add Profile</h1>
          <p className="pfp__h2">Enter your profile details</p>
        </div>
      </div>
      <div
        className="selProfileDiv"
        style={{
          marginTop: "1rem",
        }}
      >
        {" "}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label className={cmnLabel}>Profile Title</label>
          <input
            type="text"
            name="title"
            className={cmnClass}
            placeholder="e.g: Full Stack Developer"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label className={cmnLabel}>Skills</label>
          <Select
            isMulti
            options={skills}
            className="width__cls69"
            maxMenuHeight={150}
            styles={{
              control: (provided) => ({
                ...provided,
                border: "1px solid #e2e8f0",
                "&:focus": {
                  boxShadow: "none",
                  outline: "none",
                },
                "&:hover": {
                  border: "1px solid #e2e8f0",
                },
                // height: "42px",
                minHeight: "42px",
                fontSize: "14px",
              }),
              indicatorSeparator: (state) => ({
                display: "none",
              }),
            }}
            theme={(theme) => {
              return {
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#7F56D9",
                },
              };
            }}
            placeholder="e.g: Product Design, Writing, Web Development, etc."
            value={formData.skills}
            onChange={(e) => {
              if (e.length > 5) {
                toast.error("Only 5 skills are allowed");
                return;
              }
              setFormData({ ...formData, skills: e });
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label className={cmnLabel}>Bio</label>
          <textarea
            name="bio"
            rows={4}
            className="txt__addPfp"
            placeholder="e.g: I am a full stack developer."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            required
          ></textarea>
        </div>
      </div>
      <div className="btns__parentPfp">
        <button
          type="button"
          className="cancelBtn__addPfp"
          onClick={() => setIsVisible(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={HandleSubmit}
          disabled={isButtonDisabled}
          className={`addPfp__btn ${isButtonDisabled && "disabled__cls69"}`}
        >
          Add Profile
        </button>
      </div>
    </div>
  );
};

export default AddProfile;
